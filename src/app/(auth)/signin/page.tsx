"use client";

import SyncUser from "@/app/components/SyncUser";
import { useSignIn } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function CustomSignIn() {

    const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) return null; 

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {

      const result = await signIn.create({
        identifier: email,
        password,
      });

      console.log(result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        <SyncUser/>


      } else {
        console.log(result); 
      }
    } catch (err) {
      setError(err.errors[0].message);
    }
  };

    const handelGoogleLogin = async()=>{
        setError("");

        try{
            const sigininrec = await signIn?.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/signin/sso-callback",
                redirectUrlComplete: "/dashboard"
            });
            console.log(sigininrec);
            <SyncUser/>

            router.push("/dashboard");
        }catch(err)
        {
            setError(err.errors?.[0]?.message);
        }
    }

  const handelGoogleGithub = async()=>{
    setError("");
    try{
        await signIn?.authenticateWithRedirect({
            strategy: "oauth_github",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard"
        });
        <SyncUser/>
    }catch(err){
        setError(err.errors?.[0]?.long_message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-full font-courier">
        <form onSubmit={handleSubmit} className="space-y-2 w-[30dvw] bg-white rounded-lg ">
        <h2 className="text-xl font-semibold font-courier text-center">Sign In</h2>

        <p>Email</p>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 px-3 py-2 bg-[#f9fafc] mb-6"
        />

        <p>Password (Maximum 8 charachters)</p>
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 px-3 py-2 bg-[#f9fafc] mb-6"
        />


        <div className="flex w-full gap-x-3">
            <button type="button" className="flex items-center gap-x-2 justify-center w-full border-2 border-black py-2" onClick={handelGoogleLogin}>
                <Image src="/google-icon.svg" alt='google' width={20} height={20}/>
                Connect With Google
            </button>

            <button type="button" className="flex items-center gap-x-2 justify-center w-full border-2 border-black py-2" onClick={handelGoogleGithub}>
                <Image src="/github-icon.svg" alt='google' width={20} height={20}/>
                Connect With Github
            </button>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

        <button
            type="submit"
            className="w-full py-2 border-2 border-black bg-[#f9fafc] text-[#7e737a] font-medium shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all  mb-2 cursor-pointer"
        >
            Sign In
        </button>

        <p className="text-sm font-semibold text-[#7e737a]">Already a user? <Link href="/signup" className="underline">Signup</Link></p>
        </form>
    </div>
  );
}