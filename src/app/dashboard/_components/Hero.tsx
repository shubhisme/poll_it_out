import { Vote } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Info_hero from './Info_hero'
import Live_board from './Live_board'

function Hero() {
  return (
    <section className='flex justify-center'>
        <div className='w-[100%] h-full flex justify-center px-15'> 
            <div className='flex flex-col  w-full gap-y-2 text-black text-center p-5'>
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

                <Live_board/>

                <Info_hero/>

            </div>
        </div>
    </section>
  )
}

export default Hero