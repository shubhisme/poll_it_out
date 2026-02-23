"use client";

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Chat_Data from '@/app/types/Chat_types'


export function ChatSection(user_id : string , poll_id : string) {
  const [messages, setMessages] = useState<Chat_Data[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    const newMessage : Chat_Data = {
        user_id : user_id,
        poll_id : poll_id,
        message : inputValue
    }

    try{
        
        const res = await fetch(`/api/poll/chat_section/` , {
            headers :{
                'Content-Type' : "application/json"
            },

            body : JSON.stringify(newMessage)
        })

        if(res?.status === 200){
            console.log("Message sent successfully...");
        }

        messages.push(newMessage)

    }catch(err: any){
        console.log(err?.error);
    }

    // const newMessage: Chat_Data = {
    //   text: inputValue,
    //   sender: 'user',
    //   timestamp: new Date(),
    // };

    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full border border-border bg-background">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-bold text-lg">Poll Chat</h3>
        <p className="text-xs text-muted-foreground">Discuss with other participants</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m) => (
          <div
            key={m.}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-3 py-2 ${
                m.sender === 'user'
                  ? 'bg-black text-white'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm break-words">{m.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {m.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button
            onClick={handleSend}
            className="bg-black hover:bg-gray-800 text-white px-4"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
