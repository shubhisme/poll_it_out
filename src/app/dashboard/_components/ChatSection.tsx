"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Socket } from 'socket.io-client';
import StateEnum from '@/app/types/StateEnum';

interface ChatMessage {
  tempid ?: string;
  _id?: string;
  user_id: string | null;
  poll_id?: string;
  message: string;
  user_name ?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatApiResponse {
  data?: {
    _id?: string;
    user_id?: string;
    poll_id?: string;
    message?: string;
    user_name ?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
}

interface ChatSectionProps {
  socket: Socket | null;
  userName : string | null;
}

function dedupeMessagesById(items: ChatMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  const output: ChatMessage[] = [];

  for (const item of items) {
    if (item._id) {
      if (seen.has(item._id)) continue;
      seen.add(item._id);
    }
    output.push(item);
  }

  return output;
}

export function ChatSection({ socket , userName }: ChatSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { userId  , isLoaded } = useAuth();
  const pollId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : undefined;
  const [sending, setSending] = useState(false);
  const [user_mongo_id , setUser_mongo_id] = useState<string | null>(null);
  const [staus , setStatus] = useState<StateEnum>();   

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // get all messages for this poll
  useEffect(()=>{
    const fetchMessages = async()=>{
        try{

            const res = await fetch(`/api/poll/get_previous_chat?poll_id=${pollId}&limit=50`);

            if(res?.status === 200){
                const data = await res.json();

                let fetchedMess : ChatMessage[] = data?.messages?.map((m : ChatMessage)=>{
                    return{
                        _id : m._id,
                        user_id : m.user_id,
                        poll_id : m.poll_id,
                        message : m.message,
                        user_name : m.user_name,
                        createdAt : m.createdAt ? new Date(m.createdAt) : new Date(),
                        updatedAt : m.updatedAt ? new Date(m.updatedAt) : new Date(),
                    }
                })

                fetchedMess = fetchedMess.reverse();

                setMessages(fetchedMess ?? []);
            }
            else{throw new Error("Failed to fetch messages...");}

        }catch(err){
            if (err instanceof Error) {              console.log(err.message);
            }          else {              console.log("Failed to fetch messages...");
            }
        }
    }

    if(pollId){
        fetchMessages();
    }

  } , [pollId]);

  const fetchUserid = useCallback(async (clerkId: string) => {
    const res = await fetch(`/api/getuser?clerkId=${clerkId}`);
    const userData = await res.json();

    setUser_mongo_id(userData?.user?._id ?? null);
  } , []);

  useEffect(()=>{
    if(isLoaded && userId != null){
        fetchUserid(userId ?? '');
    }
  } , [fetchUserid, userId , isLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // socket logic
  useEffect(() => {
    if (!socket || !pollId) return;

    socket.emit("join_poll", pollId);

    const handleIncomingChat = (data: ChatMessage) => {
      console.log("Incoming chat message:", data);
      const incomingMessage: ChatMessage = {
        _id: data._id,
        user_id: data.user_id,
        poll_id: data.poll_id,
        message: data.message,
        user_name : data.user_name,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt : data.updatedAt ? new Date(data.updatedAt) : new Date(),
      };
      setMessages((prev) => {
        if (incomingMessage._id && prev.some((m) => m._id === incomingMessage._id)) {
          return prev;
        } // duplicate message insertion check
        return dedupeMessagesById([...prev, incomingMessage]);
      });

      console.log("Updated messages state:", [...messages, incomingMessage]);
    };

    socket.on("chat", handleIncomingChat);

    return () => {
      socket.off("chat", handleIncomingChat);
    };
  }, [socket, pollId , messages]);


  // send message logic
  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    // setSending(true);

    if (!userId || !pollId) {
      console.log("User not authenticated");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const newMessage : ChatMessage = {
        tempid : tempId,
        user_id : user_mongo_id,
        poll_id : pollId,
        message : inputValue,
        createdAt : new Date(),
    }

    setMessages((prev)=> [...prev , newMessage]);

    console.log({NewMessage : newMessage});

    try{
        setStatus(StateEnum.sending);
        const res = await fetch(`/api/poll/chat_section/` , {
            method: "POST",
            headers :{
                'Content-Type' : "application/json"
            },

            body : JSON.stringify(newMessage)
        })

        if(res?.status === 200){
            console.log("Message sent successfully...");

            const responseData: ChatApiResponse = await res.json();
            console.log({ data: responseData });

            setMessages(
              prev => {
                const mapped = prev.map((m)=>
                  m.tempid === tempId && responseData?.data?._id ? {
                    ...m ,
                    _id : responseData.data._id,
                    createdAt : responseData.data.createdAt ? new Date(responseData.data.createdAt) : m.createdAt,
                    updatedAt : responseData.data.updatedAt ? new Date(responseData.data.updatedAt) : m.updatedAt,
                    tempid : undefined,
                    user_name : m.user_name ?? responseData.data.user_name ?? userName
                  } : m
                );

                return dedupeMessagesById(mapped);
              }
            )

            setStatus(StateEnum.sent);
        }else{
            setStatus(StateEnum.failed);
        }

        // const createdMessage: ChatMessage = {
        //   _id: responseData?.data?._id,
        //   user_id: responseData?.data?.user_id ?? userId ?? null,
        //   poll_id: responseData?.data?.poll_id,
        //   message: responseData?.data?.message ?? inputValue,
        //   createdAt: responseData?.data?.createdAt ? new Date(responseData.data.createdAt) : new Date(),
        //   updatedAt: responseData?.data?.updatedAt ? new Date(responseData.data.updatedAt) : new Date(),
        // };

        // setMessages((prev) => {
        //   if (createdMessage._id && prev.some((m) => m._id === createdMessage._id)) {
        //     return prev;
        //   }
        //   return [...prev, createdMessage];
        // });

    }catch(err: unknown){
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("Failed to send message...");
        }
    }

    // setSending(false);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-black bg-white shadow-[4px_4px_0px_black]">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b-2 border-black bg-black text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg">Poll Chat</h3>
            <p className="text-xs text-gray-400">Discuss with other participants</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400 font-medium">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((m, index) => {
          const isOwn = m.user_id === user_mongo_id || m.tempid !== undefined;
          return (
            <div
              key={m._id ?? m.tempid ?? `${m.user_id ?? 'unknown'}-${index}`}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[75%] px-3 py-2 ${
                  isOwn
                    ? 'bg-black text-white border-2 border-black'
                    : 'bg-white text-black border-2 border-black shadow-[2px_2px_0px_black]'
                }`}
              >
                <p className={`font-bold text-xs mb-0.5 ${isOwn ? 'text-gray-300' : 'text-gray-500'}`}>
                  {isOwn ? 'You' : (m.user_name ?? 'Anonymous')}
                </p>
                <p className="text-sm break-words leading-relaxed">{m.message}</p>
                {m?.createdAt && (
                  <span className={`text-[10px] mt-1 block text-right ${isOwn ? 'text-gray-400' : 'text-gray-400'}`}>
                    {m.createdAt?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {m.tempid && ' · Sending...'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3 sm:px-4 py-3 border-t-2 border-black bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border-2 border-black bg-white text-black placeholder:text-gray-400 focus:outline-none text-sm font-medium"
          />
          <button
            onClick={handleSend}
            disabled={sending || !inputValue.trim()}
            className="bg-black text-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_gray] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_gray]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
