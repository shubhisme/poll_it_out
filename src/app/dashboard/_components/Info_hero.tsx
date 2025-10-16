import { ChartArea, Layers, MonitorCog } from 'lucide-react'
import React from 'react'

function Info_hero() {
  return (
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
  )
}

export default Info_hero