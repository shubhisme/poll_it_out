"use client";

import SyncUser from '@/app/components/SyncUser';
import { useSignUp } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function Page() {
    const router = useRouter();
    const {isLoaded,setActive,signUp} = useSignUp();
    const [email ,setemail] = useState("");
    const [password ,setpassword] = useState("");
    const [usersname , setusername] = useState("");
    const [code , setcode] = useState("");
    const [error , seterror] = useState("");
    const [synced, setsynced] = useState(false);
    const [ispendingverified, setpendingverified]= useState(false);

    if(!isLoaded){return null;}

    const handelSubmit = async(e: React.FormEvent)=>{
        e.preventDefault();
        seterror("");

        try{
            await signUp.create({
                emailAddress: email,
                password,
                username:usersname
            })

            await signUp.prepareEmailAddressVerification({strategy: 'email_code'});

            setpendingverified(true);
        }catch(err: any){
            if (err.errors?.[0]?.code === "form_identifier_exists") {
                seterror("This email is already registered. Please sign in instead.");
            } else {
                seterror(err.errors?.[0]?.message || "Something went wrong. Try again.");
            }
        }
    }

    const handelverif = async(e: React.FormEvent)=>{
        e.preventDefault();
        if(!isLoaded){return null;}

        const result = await signUp.attemptEmailAddressVerification({code});

        if(result.status === "complete"){
            setActive({session: result.createdSessionId});
            console.log("User created:", result.createdUserId);
            console.log("going inside /SyncUser ");
            setsynced(true);
        }else{
            console.log("Verification status:", result.status);
        }
    }

    const handelGoogleLogin = async()=>{
        seterror("");
        try{
            const sigininrec = await signUp?.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/signin/sso-callback",
                redirectUrlComplete: "/dashboard"
            });
            console.log("User signup: ",sigininrec);
            <SyncUser/>
            router.push("/dashboard");
            }
        catch(err){
            console.log(err.errors?.[0]?.message || "You are already signed In....");
            seterror(err.errors?.[0]?.long_message || "You are already signed In....")
        }
    }
    return (
        <>
        {synced && <SyncUser/>}
        <div className='flex justify-center items-center h-full'>
            {!ispendingverified ?
            <form key={10} action="" className='flex flex-col gap-y-2 w-[30dvw]' onSubmit={handelSubmit}>
                <h1 className='font-semibold text-xl text-center'>Signup</h1>

                <p>Username</p>
                <input type="text" value={usersname} className='border-2 px-2 border-black py-2 placeholder:text-gray-500 mb-2' onChange={(e)=> setusername(e.target.value)} placeholder='What should we call you?' />

                <p>Email</p>
                <input type="email" value={email} className='border-2 px-2 border-black py-2 placeholder:text-gray-500 mb-2' onChange={(e)=> setemail(e.target.value)} placeholder='Email' />

                <p>Password (Minimun 8 charachters)</p>
                <input type="password" value={password} className='border-2 px-2 border-black py-2 placeholder:text-gray-500 mb-2' onChange={(e)=> setpassword(e.target.value)} placeholder='Password' />


                <div className='flex space-x-2'>
                    <button type='button' onClick={handelGoogleLogin} className='flex items-center gap-x-2 justify-center w-full py-2 border-2 border-black bg-[#f9fafc] text-[#7e737a] font-medium'>
                        <Image src="/google-icon.svg" alt='google' width={20} height={20}/>
                        <p>Continue with Google</p>
                    </button>

                    <button type='button' onClick={handelGoogleLogin} className='flex items-center gap-x-2 justify-center w-full py-2 border-2 border-black bg-[#f9fafc] text-[#7e737a] font-medium'>
                        <Image src="/github-icon.svg" alt='google' width={20} height={20}/>
                        <p>Continue with Github</p>
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

                <button type='submit' className="w-full py-2 border-2 border-black bg-[#f9fafc] text-[#7e737a] font-medium shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer">
                    Sign Up
                </button>

                <p className="text-sm font-semibold text-[#7e737a]">New User? <Link href="/signin" className="underline">Sign In</Link></p>
            </form>
                :
                <form key={12} onSubmit={handelverif}>
                    <input type="text" value={code} onChange={(e)=> setcode(e.target.value)} className='border-2 px-2 border-black py-2 placeholder:text-gray-500 mb-2'
                    placeholder='Enter verification code' />

                    <button type='submit' className='w-full py-2 border-2 border-black bg-[#f9fafc] text-[#7e737a] font-medium shadow-[2px_2px_0px_black] hover:shadow-none hover:duration-300 hover:delay-200'>
                        Submit
                    </button>
                </form>
    }
        </div>
    </>
  )
}

export default Page