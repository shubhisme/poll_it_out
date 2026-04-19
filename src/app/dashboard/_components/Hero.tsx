"use client"

import { Vote, Plus, UserPlus } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import Info_hero from './Info_hero'
import Live_board from './Live_board'
import MyPolls from './MyPolls'
import HeroSkeleton from './HeroSkeleton'
import { useAuth } from '@clerk/nextjs';
import MyVotedPolls from './MyVotedPolls'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

function Hero() {

    const { isSignedIn, isLoaded, userId } = useAuth()
    const [pollCode , setPollCode] = useState("");
    const [open, setOpen] = useState(false)
    const [isJoining , setIsJoinng] = useState(false);

    const router = useRouter()

    const handleJoin = async () => {
        const code = pollCode.trim()
        if (!code) return
    
        try {
            setIsJoinng(true);
          const res = await fetch(`/api/poll/${code}`)
          const data = await res.json()
    
          if (!res.ok && data?.message) {
            toast.error(data.message || "Error joining poll")
            setPollCode("")
          } else {
            const { pollId } = data
            router.push(`/dashboard/poll/${pollId}`)
            setOpen(false)
          }
        } catch (err) {

          const message =
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof err.message === "string"
              ? err.message
              : "Error joining poll"
          toast.error(message , { position : "top-center"})
        }
        finally{
            setIsJoinng(false);
        }
    
        setPollCode("")
      }

    if (!isLoaded) {
        return <HeroSkeleton />
    }

    return (
        <section className='min-h-screen bg-white'>
            <div className='max-w-7xl mx-auto px-6 py-16'>
                {/* Hero Header */}
                <div className='mb-16'>
                    <h1 className='text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight md:text-left text-center'>
                        POLL IT OUT
                    </h1>
                    <p className='text-xl text-gray-600 font-semibold mb-3 md:text-left text-center'>
                        Real-time polling made simple
                    </p>
                    <p className='text-gray-500 text-lg max-w-2xl leading-relaxed md:text-left text-center'>
                        Create instant polls, get live results, and engage your audience in real-time. 
                        Perfect for meetings, classrooms, events, and online communities.
                    </p>
                </div>

                {/* Action Buttons Section */}
                <div className='border-2 border-black bg-white p-8 mb-16'>
                    <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
                        <Link href="/dashboard/create-poll" className='w-full md:w-auto'>
                            <button className='w-full md:w-auto border-2 border-black bg-black text-white px-6 py-3 font-semibold flex gap-2 items-center justify-center hover:bg-gray-900 transition-colors active:translate-y-[1px]'>
                                <Plus size={18} />
                                Create New Poll
                            </button>
                        </Link>

                        <div className='hidden md:block text-gray-400'>•</div>

                        <div className='flex gap-2 w-full md:w-auto'>
                            <input 
                                type="text"
                                value={pollCode}
                                onChange={(e) => setPollCode(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.key === "Enter") handleJoin()
                                }}

                                className='border-2 border-black px-4 py-3 font-semibold flex-1 md:flex-none w-full md:w-auto focus:outline-none focus:bg-gray-50 transition-colors' 
                                placeholder='Enter Poll Code' 
                            />
                            <button 
                                onClick={handleJoin}
                                className='border-2 border-black bg-white text-black px-6 py-3 font-semibold flex gap-2 items-center hover:bg-gray-50 transition-colors active:translate-y-[1px]'
                            >
                                <UserPlus size={18} />
                                {isJoining ?  "Joining ... " : "Join"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* My Polls and Voted Polls Section */}
                {isLoaded && userId && (
                    <div className='mb-16'>
                        <div className='flex flex-col lg:flex-row gap-8'>
                            <MyVotedPolls user_id={userId} />
                            <MyPolls user_id={userId} />
                        </div>
                    </div>
                )}

                {/* Live Board */}
                <div className='mb-16'>
                    <Live_board />
                </div>

                {/* Info Section */}
                <div>
                    <Info_hero />
                </div>
            </div>
        </section>
    )
}

export default Hero