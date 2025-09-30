import { ChartArea, Layers, MonitorCog, Vote } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Hero() {
  return (
    <section className='flex justify-center'>
        <div className='w-[100%] h-full flex justify-center px-15'> 
            <div className='flex flex-col  w-full gap-y-2 text-black text-center'>
                <div className='flex flex-col gap-x-2'>
                    <h1 className='mt-10 font-bold text-5xl'>POLL IT OUT</h1>
                    <p className='font-semibold'>Real-time polling made simple</p>
                    <p className='text-center text-gray-500 mt-3'>
                        Create instant polls, get live results, and engage your audience in real-time.<br/> Perfect for meetings, classrooms, events, and online communities.
                    </p>
                </div>

                <div className='mt-3'>
                    <div className='flex justify-center'>
                        <Link href="/dashboard/create-poll" className='cursor-pointer'>
                            <button className='text-white bg-black px-3 py-1 text-xl font-semibold flex gap-x-2 items-center justify-center shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer'>
                                <Vote className='text-white'/>
                                <p>Create Your First Poll!</p>
                            </button>
                        </Link>
                    </div>

                    <p className='text-2xl font-semibold my-3'>OR</p>

                    <div className='flex justify-center items-center gap-x-2'>
                        <input type="number" className='border-2 px-3  no-spinner bg-[#f3f4f6] rounded-[5px] py-[2px]' placeholder='Enter Poll Code' />

                        <Link href="/dashboard" className='flex justify-center cursor-pointer'>
                            <button className='text-white bg-black px-3 py-[3px] font-semibold flex gap-x-2 items-center justify-center shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all rounded-[5px] cursor-pointer'>
                                <p>Join Poll</p>
                            </button>
                        </Link>
                    </div>
                </div>


                <div className='flex mt-10'>
                    <div className='grid grid-cols-3 gap-x-6 justify-around items-center w-full'> 
                        <div className='flex flex-col justify-center gap-y-2 border-2 bg-[#f3f4f6] p-4 h-full'>

                            <div className='flex gap-x-2 justify-center items-center'>
                                <MonitorCog/>
                                <p className='font-semibold'>Instant Setup</p>
                            </div>

                            <div className='flex bg-white border-2 p-1 h-full'>
                                <p className='text-left text-gray-800'>Create polls in seconds. No registration required for participants. Share a simple code and start collecting responses immediately.Just share a short code or link and your audience can instantly join in.
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center gap-y-2 border-2 bg-[#f3f4f6] p-4 h-full'>

                            <div className='flex gap-x-2 justify-center items-center'>
                                <ChartArea/>
                                <p className='font-semibold'>Live Results</p>
                            </div>

                            <div className='felx bg-white border-2 p-1 h-full'>
                                <p className='text-left text-gray-800'>Watch responses come in real-time. See live charts and analytics as participants vote. This makes it perfect for interactive presentations, team brainstorming, or large audience engagement.
                                </p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-center gap-y-2 border-2 bg-[#f3f4f6] p-4 h-full'>

                            <div className='flex gap-x-2 justify-center items-center'>
                                <Layers/>
                                <p className='font-semibold'>Multiple Formats</p>
                            </div>

                            <div className='felx bg-white border-2 p-1 h-full'>
                                <p className='text-left text-gray-800'>Support for multiple choice, rating scales, open text, and more. Customize your polls with flexible options to suit classrooms, workshops, business meetings, or events.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  )
}

export default Hero