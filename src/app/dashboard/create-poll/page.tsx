"use client"

import { POST } from '@/app/api/connectdb/route'
import Navbar from '@/app/components/Navbar';
import { BadgeDollarSign, Infinity, Plus, X } from 'lucide-react';
import Image from 'next/image';
import {useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import type Poll_data from '@/app/types/Poll_types';
import { useUser } from '@clerk/nextjs';
import Loginpopup from '../_components/Loginpopup';
import { assert } from 'console';

function Page() {
    const {isLoaded , isSignedIn , user} = useUser();
    const [polld , setPolld] = useState<Poll_data>();
    const [fdata , setfdata] = useState<{ [key: string]:any }>();
    const router = useRouter();

    const duration_option = ["1 minute" , "2 minutes" , "5 minutes" , "1 hour" , "3 hours" , "Forever"]
    const [options , setoptions] = useState(["",""]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (isSignedIn === false) {
        return <Loginpopup />;
    }

    const apiCall = async ()=>{
        try{
            const response = await fetch("/api/createpoll",{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({question: "Who is the best cricketer?", text: ["vk" , "st" , "bh" , "msd"] , multi_true: false})
            })

            const data = await response.json();

            if(response.status === 401){
                console.log("Route changing: ");
                router.push("/login");
            }

            setfdata(data);

            console.log("response accepted: ", data);

        }catch(error){
            console.log("Caught Error: ",error);
        }
    }

    const handelChange = (index:number, value:string)=>{
        const newOp = [...options];
        newOp[index] = value;
        setoptions(newOp);
    };


    const removeoptions = (index:number)=>{
        const newop = options.filter((_,i)=> i!= index);
        setoptions(newop);
    }

    const addOptions = ()=>{
        if(options.length === 15) return;
        setoptions([...options , ""]);
    }


  return (
    <>
        <Navbar/>
        <div className='flex w-4xl mx-auto mt-5'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-semibold'>Create a Poll</h1>
                    <p className='text-[#8d9aa6]'>Set up your question and options. Your poll will be live immediately after creation.</p>

                    <form action="">
                        <div className='flex flex-col gap-y-4'>
                            <div className='flex flex-col gap-y-1 border-2 px-6 py-4'>
                                <p className='text-lg'>Poll Question</p>
                                <p className='text-[#8d9aa6]'>Ask a clear, specific question that's easy to understand</p>

                                <div className='flex flex-col gap-y-1'>
                                    <div>
                                        <p>Question*</p>
                                        
                                        <textarea
                                        id="question"
                                        value={polld?.question}
                                        placeholder="What's your favorite programming language?"
                                        required
                                        className="w-[70%] min-h-20 bg-[#f3f4f6] px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <p>Description (optional)</p>

                                        <textarea
                                        id="question"
                                        value={polld?.question}
                                        placeholder="Add context or additional details..."
                                        required
                                        className="w-[70%] min-h-20 bg-[#f3f4f6] px-4 py-2 rounded-md outline-none focus:ring-1 focus:ring-gray-500 placeholder:text-gray-500 text-sm"
                                        />
                                    </div>

                                </div>

                            </div>

                            <div className='flex flex-col gap-y-3 border-2 px-6 py-4'>
                                <div>
                                    <p className='text-lg'>Answer Options</p>
                                    <p className='text-[#8d9aa6]'>Add the choices participants can select from</p>
                                </div>

                                <div className='flex flex-col gap-y-2'>
                                    {
                                        options.map((op , ind)=>(
                                            <div key={ind} className='flex gap-x-1'>
                                                <input type="text" value={op} onChange={e => handelChange(ind , e.target.value)} placeholder={`Option ${ind+1}`} className='border p-2 w-[70%] bg-[#f3f4f6] text-sm'  />

                                                {
                                                    options.length > 2 && (
                                                        <button onClick={()=> removeoptions(ind)} type='button' className='cursor-pointer border p-2 hover:bg-[#f3f4f6] '>
                                                            <X size={18} className='hover:text-red-400 transition-colors delay-100'/>
                                                        </button>
                                                    )
                                                }

                                            </div>
                                        ))
                                    }
                                </div>

                                <button className='flex items-center justify-center w-full border py-1 text-center cursor-pointer shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all' type='button' onClick={addOptions}>
                                    <Plus size={15}/>
                                    <span>Add Options <span className={options.length === 15 ? `text-red-500` : ""}>(Maximum 15)</span></span>
                                </button>

                            </div>

                            <div className='flex flex-col gap-y-3 border-2 px-6 py-4'>
                                <div>
                                    <p className='text-lg'>Poll Settings</p>
                                    <p className='text-[#8d9aa6]'>Configure how your poll behaves</p>
                                </div>

                                <div className='flex flex-col gap-y-1'>
                                    <p >Duration</p>
                                    <select defaultValue={"Time Duration"} name="" id="duration" className='border px-3 py-1'>
                                        {
                                            duration_option.map((val , ind)=>{
                                                
                                                if(val === "Forever"){
                                                    return <option value={val} key={ind} className='bg-[#d4d6db]'>∞ {val}</option>
                                                }
                                                
                                                return <option value={val} key={ind} className='hover:bg-[#d4d6db] mb-1'>{val}</option>
                                            })
                                        }
                                    </select>
                                </div>



                            </div>
                        </div>
                    </form>
                </div>
        </div>

        <button type='submit' onClick={apiCall}>Make a poll</button>
    </>
  )
}

export default Page