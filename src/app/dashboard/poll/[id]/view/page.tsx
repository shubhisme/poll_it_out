"use client";

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Navbar from '@/app/components/Navbar';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAuth } from '@clerk/nextjs';
import {} from "@/app/global";
import { CheckLine , UserRoundCheck, QrCode, X , CircleQuestionMark } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { getSocket , disconnectSocket } from '@/lib/socket';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { ToolTip} from '@/app/dashboard/_components/Tooltip';
import { Drawer_Right } from '@/app/dashboard/_components/Drawer_Right';
import { ChatSection } from '@/app/dashboard/_components/ChatSection';
import "@/app/globals.css";


interface ChartDataItem {
  option_text: string;
  vote_count: number;
  percentage: number;
}

interface PollOption {
  option_text: string;
  vote_count: number;
}

interface PollData {
  options: PollOption[];
}

const chartConfig = {
  vote_count: {
    label: "Votes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const Page = () => {
    const [poll_data , setPollData] = useState<PollData | null>(null);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [question , setQuestion] = useState("");
    const [description , setDescription] = useState("");
    const [join_code , setJoin_code] = useState("");
    const [image_link , setImage_link] = useState("");
    const [totalVotes , setTotalVotes] = useState(0);
    const [socket , setSocket] = useState<Socket | null>(null);
    const [pollId , setPollId] = useState<string | null>(null);
    const [liveCount , setLiveCount] = useState<Number> (0);

    const [totalVoters , setTotalVoters] = useState(0);
    const [showQR, setShowQR] = useState(false);

    const {userId} = useAuth()

    const [error , setError] = useState("error: ");
    const { id } = useParams();


    const getVoters = useCallback(
        async ()=>{
            try{
                const users = await fetch(`/api/getUserOnPoll` , {
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({pollid : id})
                })

                const res = await users.json();

                setTotalVoters(res?.data);
            }catch(err: any){
                setError(err?.error);
                console.log(err?.error);
            }
        } , [id]
    )

    const isPoll = useCallback(
        async ()=>{
        try{
            const poll_data = await fetch(`/api/validate/checkpollbyid` , {
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({pollid : id})
            })

            const res = await poll_data.json();
            // console.log(res);
            
            setPollData(res?.data);

            if(res?.status === 200){
                setPollId(res?.data?._id);

                if(res?.data?.multi_true){
                    getVoters();
                }

                setJoin_code(res?.data?.share_code);

                if(res?.data?.share_code){
                    setImage_link(res?.data?.qr);
                }

                let totalV = res?.data?.options.map((option: any)=>{
                    const vote = option.votes_count;
                    
                    setTotalVotes(prev => prev + vote);

                    return vote + totalVotes;
                })

                totalV = totalV.reduce((acc : number, vote : number)=> vote +acc , 0 )
                console.log({total_votes : totalV})

                const newChartData: ChartDataItem[] = res?.data?.options.map((option: any) => ({
                    option_text: option.text,
                    vote_count: option.votes_count,
                    percentage: option.votes_count / totalV * 100
                })) || [];
                
                setChartData(newChartData);
                setQuestion(res?.data?.question);
                setDescription(res?.data?.description);

                // console.log({chartdata : newChartData});
            }


        }catch(err: any){
            setError(err?.error);
            console.log(err?.error);
        }

        } , [id] 
    );

    useEffect(() => {
        isPoll();
    }, [id]);

    useEffect(()=>{
        if(!userId){return;}

        const socketInstance = getSocket(userId);
        socketInstance.connect();
        setSocket(socketInstance);

        return ()=>{
            disconnectSocket();
            setSocket(null);
        }

    } , [userId])

    // joining rooms
    useEffect(()=>{
        if(!socket || !pollId){
            return;
        }

        socket.emit("join_poll" , pollId);

        socket.on("update_poll" , (data : any[])=>{
            console.log("Poll updated via socket:", data);
            
            const updatedChartData: ChartDataItem[] = data.map((item) => ({
                option_text: item.text,
                vote_count: item.vote_count,
                percentage: item.percentage
            }));
            
            setChartData(updatedChartData);

            const total = data.reduce((sum, item) => sum + item.vote_count, 0);
            setTotalVotes(total);
        })

    } , [socket , pollId , userId])

    useEffect(()=> {
        if(!pollId) return;

        const getVoters = async()=>{
            try{
                const res = await fetch(`/api/poll/get_live_count` , {
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({pollid : pollId})
                })

                if (res.status !== 200) {
                    throw new Error("Failed to fetch live count");
                }

                const data = await res.json();
                // console.log({live_count_data : data});
                setLiveCount(data?.count);

            }catch(err : any){
                // setError(err ?? err?.error);
                console.log(err);
            }
        }

        getVoters();

        const interval = setInterval(getVoters , 5000);
        return ()=> clearInterval(interval);
        
    } , [pollId])

    useEffect(()=>{
        try{
            const refresh = async()=>{
                const res = await fetch(`/api/poll/refresh_presence` , {
                    method : "POST",
                    headers : {
                        "Content-Type": "application/json"
                    },
                    body : JSON.stringify({pollid : pollId , user_id : userId})
                })

                const data = await res.json();
                // console.log(data);
            }
            refresh();

            const interval = setInterval(refresh , 10000);

            return ()=> clearInterval(interval);
        }catch(err: any){
            setError(err?.error);
            console.log(err?.error);
        }

    } , [pollId , userId])

  return (
    <>        
        <Navbar />

        <div className='flex mx-auto w-[90%] flex-col gap-4 mt-3'>
            <div className='flex justify-between items-center'>
                <p>Joinig Code : <span className='text-lg px-2 font-bold bg-black text-white'>{join_code}</span></p>
                
                <div className='flex flex-row space-x-0.5'>
                    <button 
                        onClick={() => setShowQR(true)}
                        className="flex items-center gap-2 px-2 py-2 bg-black hover:bg-gray-800  rounded-lg cursor-pointer text-white transition-all"
                        >
                        <QrCode className="w-5 h-5" />
                        <span className="font-medium">QR Code</span>
                    </button>
                    <ToolTip content = "Scan QR Code to vote in the poll" children= {
                        <Button className="bg-transparent hover:bg-transparent cursor-pointer text-black border-none shadow-none">
                            <CircleQuestionMark width={20} height={20} />
                        </Button>
                    } />
                </div>

                <div className='flex flex-row items-center space-x-2'>
                    <ToolTip content='Live count of people active on this poll' children={
                        <div className="live-indicator">
                            <span className="live-dot"></span>
                            <span className="live-text">Live Count 1</span>
                        </div>
                    }  />
                </div>

            </div>
            
            <div className='flex flex-row space-x-20 '>
                <Card className='w-[90%] h-[80%] m-0 flex justigy-left shadow-none border-none p-0 '>
                <CardHeader className='flex flex-col gap-4 p-0'>
                    <div className='flex flex-row items-start justify-between'>
                        <div className='flex flex-col gap-2'>
                            <CardTitle className='font-bold text-2xl'>{question}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>

                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2 h-full'>
                                <CheckLine className='w-8 h-8' />
                                <span className='font-semibold text-lg'>{totalVotes}</span>
                            </div>

                            <div className='flex items-center gap-2 h-full'>
                                <UserRoundCheck className='w-8 h-8' />
                                <span className='font-semibold text-lg'>{totalVoters}</span>
                            </div>
                        </div>
                    </div>

                </CardHeader>
                <CardContent className='p-0'>
                    <ChartContainer config={chartConfig} className='p-0'>
                    <BarChart
                        accessibilityLayer
                        data={chartData.length > 0 ? chartData : []}
                        layout="vertical"
                        margin={{
                            left: 20,
                            right: 20,
                            top: 10,
                            bottom: 10,
                        }}
                    >
                        <YAxis
                            dataKey="option_text"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={100}
                            style={{ fontSize: '0.875rem' }}
                        />

                        <XAxis dataKey="vote_count" type="number" hide />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent 
                                    hideLabel 
                                    indicator='line'
                                    formatter={(value, name, item, index, payload) => {
                                        const data = payload as ChartDataItem;
                                        return (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Votes:</span>
                                                    <span className="font-mono font-medium">{value}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Percentage:</span>
                                                    <span className="font-mono font-medium">{data?.percentage?.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            }
                        />

                        <Bar className='p-0' barSize={10} dataKey="vote_count" layout="vertical" radius={2} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
                </Card>
                    
                <div className='w-full h-[35rem]'>
                    <ChatSection user_id = {userId} poll_id = {id} />
                </div>
            </div>
        </div>


        {showQR && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm  w-full relative animate-in fade-in zoom-in duration-800">
                    <button 
                        onClick={() => setShowQR(false)}
                        className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500"/>
                    </button>
                    
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl font-bold text-gray-900">Poll QR Code</h3>
                        <div className="bg-white p-4 rounded-none border shadow-sm">
                            <Image 
                                src={image_link} 
                                alt="Poll QR Code" 
                                width={1000} 
                                height={1000}
                                className="w-full h-auto"
                            />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Scan to join this poll directly
                        </p>
                    </div>
                </div>
            </div>
        )}
    </> 
  )
}

export default Page