"use client"

import { POST } from '@/app/api/connectdb/route'
import { BadgeDollarSign } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Page() {

    const [fdata , setfdata] = useState<{ [key: string]: any }>();

    const router = useRouter();

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


  return (
    <>
        <div>Inside Dashboard/create-poll route...</div>
        <div className='gap-y-3'>
            {fdata && Object.keys(fdata).map(key => (
                <div key={key} className='flex flex-col gap-y-3 border-2 my-3'>
                    <div>{key}</div>
                    <p className='gap-x-3'>{fdata[key]}</p>
                </div>
            ))}
            <BadgeDollarSign size={20} strokeWidth={0.5}/>
        </div>
        <button type='submit' onClick={apiCall}>Make a poll</button>
    </>
  )
}

export default Page