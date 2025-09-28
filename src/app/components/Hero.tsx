import { Vote } from 'lucide-react'
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
                    <Link href="/dashboard/create-poll" className='flex justify-center cursor-pointer'>
                        <button className='text-white bg-black px-3 py-1 text-xl font-semibold flex gap-x-2 items-center justify-center shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all'>
                            <Vote className='text-white'/>
                            <p>Create Your First Poll!</p>
                        </button>
                    </Link>

                    <p className='text-xl font-semibold my-3'>OR</p>

                    <div className='flex justify-center items-center gap-x-2'>
                        <input type="number" className='border-2 px-3  no-spinner bg-[#f3f4f6] rounded-[5px]' placeholder='Enter Poll Code' />

                        <Link href="/dashboard/" className='flex justify-center cursor-pointer'>
                            <button className='text-white bg-black px-3 font-semibold flex gap-x-2 items-center justify-center shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all rounded-[5px]'>
                                <p>Join Poll</p>
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    </section>
  )
}

export default Hero