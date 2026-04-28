"use client";

import SyncUser from '@/app/components/SyncUser';
import { useSignUp } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ClerkError {
    errors?: Array<{
        code?: string;
        message?: string;
        long_message?: string;
    }>;
}

function Page() {
    const router = useRouter();
    const {isLoaded,setActive,signUp} = useSignUp();
    const [email ,setemail] = useState("");
    const [password ,setpassword] = useState("");
    const [usersname , setusername] = useState("");
    const [error , seterror] = useState("");
    const [synced] = useState(false);

    if(!isLoaded){return null;}

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    seterror("");

    try {
        await signUp.create({
            emailAddress: email,
            password,
            username: usersname
        });

        await setActive({ session: signUp.createdSessionId });

        } catch (err: unknown) {
            const clerkError = err as ClerkError;
            if (clerkError?.errors?.[0]?.code === "form_identifier_exists") {
                seterror("This email is already registered. Please sign in instead.");
            } else {
                seterror(clerkError?.errors?.[0]?.message || "Something went wrong. Try again.");
            }
        }
    };


    const handleGoogleLogin = async()=>{
        seterror("");
        try{
            const sigininrec = await signUp?.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/signin/sso-callback",
                redirectUrlComplete: "/dashboard"
            });
            console.log("User signup: ",sigininrec);
            
            router.back();
            }
        catch(err: unknown){
            const clerkError = err as ClerkError;
            console.log(clerkError?.errors?.[0]?.message || "You are already signed In....");
            seterror(clerkError?.errors?.[0]?.long_message || "You are already signed In....")
        }
    }

    return (
        <>
            {synced && <SyncUser/>}
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f9fafc] to-white px-3 sm:px-4 md:px-6 overflow-hidden">
                {/* Decorative background elements - responsive sizing */}
                <div className="hidden sm:block absolute top-5 sm:top-10 md:top-16 left-5 sm:left-10 md:left-16 w-24 sm:w-32 md:w-48 h-24 sm:h-32 md:h-48 bg-black opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="hidden sm:block absolute bottom-5 sm:bottom-10 md:bottom-16 right-5 sm:right-10 md:right-16 w-28 sm:w-40 md:w-56 h-28 sm:h-40 md:h-56 bg-black opacity-5 rounded-full blur-3xl pointer-events-none"></div>
                
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md relative z-10"
                    aria-label="Sign up form"
                >
                    {/* Header Section */}
                    <div className="text-center mb-3 sm:mb-4">
                        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-0.5 sm:mb-1 leading-tight">
                            Create Account
                        </h1>
                        <p className="text-xs xs:text-sm sm:text-sm text-[#7e737a]">
                            Join us and start creating amazing polls
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white border-2 border-black p-3 xs:p-4 sm:p-5 md:p-6 shadow-[2px_2px_0px_black] xs:shadow-[3px_3px_0px_black] sm:shadow-[4px_4px_0px_black] mb-3 sm:mb-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                        
                        {/* Username Field */}
                        <div className="mb-2.5 sm:mb-3">
                            <label className="block text-xs xs:text-sm font-semibold text-black mb-0.5 sm:mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="What should we call you?"
                                value={usersname}
                                onChange={(e) => setusername(e.target.value)}
                                className="w-full border-2 border-black px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[#f9fafc] text-xs xs:text-sm text-black placeholder:text-[#7e737a] focus:outline-none focus:bg-white transition-colors"
                                aria-label="Username"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-2.5 sm:mb-3">
                            <label className="block text-xs xs:text-sm font-semibold text-black mb-0.5 sm:mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                className="w-full border-2 border-black px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[#f9fafc] text-xs xs:text-sm text-black placeholder:text-[#7e737a] focus:outline-none focus:bg-white transition-colors"
                                aria-label="Email"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-3 sm:mb-3.5">
                            <label className="block text-xs xs:text-sm font-semibold text-black mb-0.5 sm:mb-1">
                                Password (Min 8 chars)
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                className="w-full border-2 border-black px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 bg-[#f9fafc] text-xs xs:text-sm text-black placeholder:text-[#7e737a] focus:outline-none focus:bg-white transition-colors"
                                aria-label="Password"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-300 px-2 xs:px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-3.5 text-xs">
                                <p className="text-red-600 font-semibold" role="alert">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="w-full py-2 xs:py-2.5 sm:py-3 border-2 border-black bg-black text-white font-bold text-xs xs:text-sm sm:text-base shadow-[2px_2px_0px_rgba(0,0,0,0.3)] xs:shadow-[3px_3px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.3)] transition-all cursor-pointer hover:bg-[#1a1a1a]"
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="flex-1 h-px bg-black"></div>
                        <span className="text-[#7e737a] text-xs sm:text-sm font-semibold px-1">OR</span>
                        <div className="flex-1 h-px bg-black"></div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex items-center gap-1.5 sm:gap-2 justify-center w-full border-2 border-black py-2 xs:py-2.5 sm:py-3 bg-[#f9fafc] text-[#7e737a] font-semibold text-xs sm:text-sm shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer hover:bg-white"
                            aria-label="Sign up with Google"
                        >
                            <Image src="/google-icon.svg" alt="google" width={16} height={16} className="w-3.5 sm:w-4" />
                            <span className="text-xs sm:text-sm">Google</span>
                        </button>

                        {/* <button
                            type="button"
                            onClick={handleGitHubLogin}
                            className="flex items-center gap-1.5 sm:gap-2 justify-center w-full border-2 border-black py-2 xs:py-2.5 sm:py-3 bg-[#f9fafc] text-[#7e737a] font-semibold text-xs sm:text-sm shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer hover:bg-white"
                            aria-label="Sign up with Github"
                        >
                            <Image src="/github-icon.svg" alt="github" width={16} height={16} className="w-3.5 sm:w-4" />
                            <span className="text-xs sm:text-sm">GitHub</span>
                        </button> */}
                    </div>

                    {/* Sign In Link */}
                    <div className="text-center">
                        <p className="text-xs xs:text-sm text-[#7e737a]">
                            Already have an account?{" "}
                            <Link href="/signin" className="font-bold text-black underline hover:no-underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Page