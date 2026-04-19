"use client";

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Bar, BarChart, XAxis, YAxis , Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useAuth } from '@clerk/nextjs';
import { QrCode, X , CircleQuestionMark , ChartBar, ChartPie } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { getSocket , disconnectSocket } from '@/lib/socket';
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { ToolTip} from '@/app/dashboard/_components/Tooltip';
import { ChatSection } from '@/app/dashboard/_components/ChatSection';
import PollViewSkeleton from './PollViewSkeleton';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

interface SocketPollUpdateItem {
    text: string;
    vote_count: number;
    percentage: number;
}

const chartConfig = {
  vote_count: {
    label: "Votes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const Page = () => {
    const [, setPollData] = useState<PollData | null>(null);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [question , setQuestion] = useState("");
    const [description , setDescription] = useState("");
    const [join_code , setJoin_code] = useState("");
    const [image_link , setImage_link] = useState("");
    const [totalVotes , setTotalVotes] = useState(0);
    const [socket , setSocket] = useState<Socket | null>(null);
    const [pollId , setPollId] = useState<string | null>(null);
    const [liveCount , setLiveCount] = useState<number> (0);
    const [user_id , setUser_id] = useState<string | null>(null);
    const [userName , setUserName] = useState<string | null>(null);
    const [chartType , setChartType] = useState<"bar" | "pie">("bar");
    const [multiTrue , setMultiTrue] = useState(false);

    const [totalVoters , setTotalVoters] = useState(0);
    const [showQR, setShowQR] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {userId , isLoaded} = useAuth()
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

                console.log(`Total voters: ${res?.data}`);
                setTotalVoters(res?.data);
            }catch(err: unknown){
                console.log(err);
            }
        } , [id]
    )

    const isPoll = useCallback(
        async ()=>{
            if(isLoaded){
                try{
                    setIsLoading(true);
                    const poll_data = await fetch(`/api/validate/checkpollbyid` , {
                        method : "POST",
                        headers : {
                            "Content-Type": "application/json"
                        },
                        body : JSON.stringify({pollid : id , user_id : userId})
                    })

                    const res = await poll_data.json();
                    // console.log(res);
                    
                    setPollData(res?.data);

                    if(res?.status === 200){
                        setPollId(res?.data?._id);
                        setUser_id(res?.data?.created_by);
                        setUserName(res?.userName);
                        console.log({user_id : res?.data?.created_by})

                        if(res?.data?.multi_true){
                            getVoters();
                        }

                        setJoin_code(res?.data?.share_code);

                        if(res?.data?.share_code){
                            setImage_link(res?.data?.qr);
                        }

                        const totalV = res?.data?.options?.reduce((acc: number, option: { votes_count: number }) => {
                            return acc + option.votes_count;
                        }, 0) ?? 0;
                        
                        setTotalVotes(totalV);
                        console.log({total_votes : totalV})

                        const newChartData: ChartDataItem[] = res?.data?.options.map((option: { text: string; votes_count: number }) => ({
                            option_text: option.text,
                            vote_count: option.votes_count,
                            percentage: totalV > 0 ? (option.votes_count / totalV) * 100 : 0
                        })) || [];
                        
                        setChartData(newChartData);
                        setQuestion(res?.data?.question);
                        setMultiTrue(res?.data?.multi_true);
                        setDescription(res?.data?.description);

                        // console.log({chartdata : newChartData});
                    }
                    setIsLoading(false);

                }catch(err: unknown){
                    console.log(err);
                    setIsLoading(false);
                }
            }

        } , [id, getVoters , userId , isLoaded] 
    );

    useEffect(() => {
        isPoll();
    }, [isPoll]);

    useEffect(()=>{
        if(!userId){return;}

        const socketInstance = getSocket(userId);
        socketInstance.connect();
        setSocket(socketInstance);

        return ()=>{
            disconnectSocket();
            setSocket(null);
        }

    } , [userId , pollId])

    // joining rooms
    useEffect(()=>{
        if(!socket || !pollId){
            return;
        }

        socket.emit("join_poll" , pollId);

        socket.on("update_poll" , (data : SocketPollUpdateItem[])=>{
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

        // listening to live count
    useEffect(()=>{

        if(!socket || !pollId){
            return;
        }

        socket.on("total_joined" , (count : number)=>{
            setLiveCount(count);
        })

    } , [socket , pollId , userId])

    const chart = chartType === "bar" ? (
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
                        formatter={(value) => {
                            const voteValue = typeof value === 'number' ? value : Number(value);
                            const percentage = totalVotes > 0 ? (voteValue / totalVotes) * 100 : 0;
                            return (
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">Votes:</span>
                                        <span className="font-mono font-medium">{voteValue}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">Percentage:</span>
                                        <span className="font-mono font-medium">{percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                }
            />

            <Bar className='p-0' barSize={10} dataKey="vote_count" layout="vertical" radius={2} />
        </BarChart> ) : (
        <PieChart className='mb-0'>
            <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel
                                        indicator='line'
                        formatter={(value) => {
                            const voteValue = typeof value === 'number' ? value : Number(value);
                            const percentage = totalVotes > 0 ? (voteValue / totalVotes) * 100 : 0;
                            return (
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">Votes:</span>
                                        <span className="font-mono font-medium">{voteValue}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-muted-foreground">Percentage:</span>
                                        <span className="font-mono font-medium">{percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            );
                        }} />}
            />
            <Pie data={chartData}
            dataKey="vote_count"
            nameKey="option_text"
            >
              {chartData.map((_, index) => {
                const lightness = Math.round((index / Math.max(chartData.length - 1, 1)) * 60);
                return <Cell key={`cell-${index}`} fill={`hsl(0, 0%, ${lightness}%)`} />;
              })}
            </Pie>
        </PieChart>
    )

  return (
    <>
        {isLoading ? <PollViewSkeleton /> : (
        <>
        {/* <Navbar /> */}

        <div className='flex mx-auto w-[90%] flex-col gap-4 pt-3'>
            <div className='flex flex-wrap justify-between items-center gap-3'>
                <p>Joining Code : <span className='text-lg px-2 font-bold bg-black text-white'>{join_code}</span></p>
                
                <div className='flex flex-row space-x-0.5'>
                    <button 
                        onClick={() => setShowQR(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-gray-800 cursor-pointer text-white transition-all border-2 border-black shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none"
                        >
                        <QrCode className="w-5 h-5" />
                        <span className="font-medium">QR Code</span>
                    </button>
                    <ToolTip content = "Scan QR Code to vote in the poll">
                        <Button className="bg-transparent hover:bg-transparent cursor-pointer text-black border-none shadow-none">
                            <CircleQuestionMark width={20} height={20} />
                        </Button>
                    </ToolTip>
                </div>

                <div className='flex flex-row items-center space-x-2'>
                    <ToolTip content='Live count of people active on this poll'>
                        <div className="live-indicator">
                            <span className="live-dot"></span>
                            <span className="live-text">Live Count {liveCount}</span>
                        </div>
                    </ToolTip>
                </div>

            </div>
            
            <div className='flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-200px)] h-[calc(100vh-180px)]'>

                <div className='flex-1 border-2 border-black bg-white shadow-[4px_4px_0px_black] p-5 sm:p-6 flex flex-col h-full lg:h-auto mb-0'>
                    <Card className='w-full m-0 flex flex-col shadow-none border-none p-0 bg-transparent h-full'>
                    <CardHeader className='flex flex-col gap-4 p-0 w-full flex-shrink-0'>
                        <div className='flex flex-col justify-between sm:flex-row items-start w-full gap-3'>
                            <div className='flex items-start gap-2 text-sm px-2 py-1 flex-shrink-0'>
                                <div className='flex flex-col gap-2'>
                                    <CardTitle className='font-bold text-2xl'>{question}</CardTitle>
                                    <CardDescription>{description}</CardDescription>
                                </div>
                            </div>
                            <div>
                            <Select
                                value={chartType}
                                onValueChange={(val) => setChartType(val as "bar" | "pie")}
                            >
                                <SelectTrigger className="w-[160px] border-2 border-black rounded-none bg-white font-bold shadow-[2px_2px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
                                <SelectValue placeholder="Select chart" />
                                </SelectTrigger>

                                <SelectContent className="border-2 border-black rounded-none bg-white shadow-[4px_4px_0px_black]">
                                <SelectGroup>
                                    <SelectItem value="bar" className="rounded-none font-medium cursor-pointer focus:bg-black focus:text-white">
                                    <p className="flex items-center gap-2">
                                        <ChartBar className="w-4 h-4" />
                                        <span>Bar Chart</span>
                                    </p>
                                    </SelectItem>

                                    <SelectItem value="pie" className="rounded-none font-medium cursor-pointer focus:bg-black focus:text-white">
                                    <p className="flex items-center gap-2">
                                        <ChartPie className="w-4 h-4" />
                                        <span>Pie Chart</span>
                                    </p>
                                    </SelectItem>
                                </SelectGroup>
                                </SelectContent>
                            </Select>
                            </div>
                        </div>

                    </CardHeader>
                    <CardContent className='p-0 mt-0 flex-1 overflow-y-auto'>
                        <ChartContainer config={chartConfig} className='p-0 mt-0'>
                            {chart}
                        </ChartContainer>
                        <CardFooter>
                            <div className='flex items-center justify-between w-full flex-shrink-0'>
                                <div className='flex items-center gap-1.5 border-2 border-black px-3 py-0.5'>
                                    <p>Total Votes: </p>
                                    <span className='font-bold text-lg'>{totalVotes}</span>
                                </div>

                                {multiTrue && (
                                    <div className='flex items-center gap-1.5 border-2 border-black px-3 py-0.5'>
                                        <p>Total Voters: </p>
                                        <span className='font-bold text-lg'>{totalVoters}</span>
                                    </div>
                                )}
                            </div>
                        </CardFooter>
                    </CardContent>
                    </Card>
                </div>
                
                {user_id && userName ?
                    <div className='w-full lg:w-[45%] h-full lg:h-auto flex flex-col'>
                        <ChatSection socket = {socket} userName = {userName} />
                    </div> : null
                }
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
        )}
    </> 
  )
}

export default Page