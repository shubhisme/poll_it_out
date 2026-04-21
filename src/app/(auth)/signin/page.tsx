"use client";

import { useSignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ClerkError {
  errors?: Array<{
    code?: string;
    message?: string;
    long_message?: string;
  }>;
}

interface SignInFactor {
  strategy: string;
  [key: string]: unknown;
}

export default function CustomSignIn() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) return null;

//   const db_connect = async ()=>{
//     try{
//         const connect_db = await fetch("/api/connectdb",{
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//         console.log("DB Connected: ",connect_db);
//         return connect_db.json();
//     }
//     catch(err){
//         console.log(err);
//         return {err: err}
//     }
//   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signIn) {
      setError("Sign in not available");
      return;
    }

    try {
      // Step 1: Create sign-in attempt
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      // Step 2: Check available first factors
      if (signInAttempt.status === "complete") {
        // If already complete, set session
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/dashboard");
      } else if (signInAttempt.status === "needs_first_factor") {
        // Check if password is supported
        const supportedStrategies = signInAttempt.supportedFirstFactors;
        const passwordStrategy = supportedStrategies?.find(
          (factor: SignInFactor) => factor.strategy === "password"
        );

        if (!passwordStrategy) {
          setError(
            "This account doesn't have password authentication enabled. Please use Google or GitHub to sign in, or create a new account with a password."
          );
          return;
        }

        // Attempt first factor verification (password)
        const attemptResult = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
        });

        if (attemptResult.status === "complete") {
          await setActive({ session: attemptResult.createdSessionId });
          router.push("/dashboard");
        } else {
          setError("Sign in failed. Please try again.");
          console.log("Sign in status:", attemptResult.status);
        }
      } else {
        setError("Sign in failed. Please try again.");
        console.log("Unexpected status:", signInAttempt.status);
      }
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      const errorMessage = clerkError?.errors?.[0]?.message ?? "Invalid email or password";
      
      // Handle specific error cases
      if (errorMessage.includes("not found") || errorMessage.includes("identifier")) {
        setError("Email not found. Please sign up or try another email.");
      } else {
        setError(errorMessage);
      }
      console.error("Sign in error:", err);
    }
  };

  const handelGoogleLogin = async () => {
    setError("");
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/signin/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      setError(clerkError?.errors?.[0]?.message ?? "Google sign in failed");
    }
  };

  const handelGoogleGithub = async () => {
    setError("");
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/signin/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      setError(clerkError?.errors?.[0]?.long_message ?? "Github sign in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f9fafc] to-white px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
      {/* Decorative background elements - responsive sizing */}
      <div className="hidden sm:block absolute top-5 sm:top-10 md:top-16 left-5 sm:left-10 md:left-16 w-24 sm:w-32 md:w-48 h-24 sm:h-32 md:h-48 bg-black opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="hidden sm:block absolute bottom-5 sm:bottom-10 md:bottom-16 right-5 sm:right-10 md:right-16 w-28 sm:w-40 md:w-56 h-28 sm:h-40 md:h-56 bg-black opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative z-10"
        aria-label="Sign in form"
      >
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-7 md:mb-8 lg:mb-10">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-1 sm:mb-2 md:mb-3 leading-tight">
            Welcome Back
          </h1>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#7e737a] px-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border-2 border-black p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 shadow-[2px_2px_0px_black] xs:shadow-[3px_3px_0px_black] sm:shadow-[4px_4px_0px_black] md:shadow-[5px_5px_0px_black] mb-5 sm:mb-6 md:mb-7">
          
          {/* Email Field */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs xs:text-sm sm:text-base font-semibold text-black mb-1 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black px-3 xs:px-3.5 sm:px-4 md:px-5 py-2 xs:py-2.5 sm:py-3 md:py-3.5 bg-[#f9fafc] text-xs xs:text-sm sm:text-base text-black placeholder:text-[#7e737a] focus:outline-none focus:bg-white transition-colors"
              aria-label="Email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-5 sm:mb-6 md:mb-7">
            <label className="block text-xs xs:text-sm sm:text-base font-semibold text-black mb-1 sm:mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black px-3 xs:px-3.5 sm:px-4 md:px-5 py-2 xs:py-2.5 sm:py-3 md:py-3.5 bg-[#f9fafc] text-xs xs:text-sm sm:text-base text-black placeholder:text-[#7e737a] focus:outline-none focus:bg-white transition-colors"
              aria-label="Password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 px-3 xs:px-3.5 sm:px-4 py-2 sm:py-3 mb-5 sm:mb-6">
              <p className="text-red-600 text-xs xs:text-sm sm:text-base font-semibold" role="alert">
                {error}
              </p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2.5 xs:py-3 sm:py-3.5 md:py-4 border-2 border-black bg-black text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg shadow-[2px_2px_0px_rgba(0,0,0,0.3)] xs:shadow-[3px_3px_0px_rgba(0,0,0,0.3)] sm:shadow-[3px_3px_0px_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.3)] transition-all cursor-pointer hover:bg-[#1a1a1a]"
          >
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-7">
          <div className="flex-1 h-px bg-black"></div>
          <span className="text-[#7e737a] text-xs sm:text-sm font-semibold px-1">OR</span>
          <div className="flex-1 h-px bg-black"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex w-full mb-5 sm:mb-6 md:mb-7">
          <button
            type="button"
            onClick={handelGoogleLogin}
            className="flex items-center gap-2 sm:gap-2.5 justify-center w-full border-2 border-black py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-[#f9fafc] text-[#7e737a] font-semibold text-xs sm:text-sm md:text-base shadow-[2px_2px_0px_black] xs:shadow-[2px_2px_0px_black] sm:shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer hover:bg-white"
            aria-label="Sign in with Google"
          >
            <Image src="/google-icon.svg" alt="google" width={18} height={18} className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-xs sm:text-sm">Google</span>
          </button>

          {/* <button
            type="button"
            onClick={handelGoogleGithub}
            className="flex items-center gap-2 sm:gap-2.5 justify-center w-full border-2 border-black py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-[#f9fafc] text-[#7e737a] font-semibold text-xs sm:text-sm md:text-base shadow-[2px_2px_0px_black] xs:shadow-[2px_2px_0px_black] sm:shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer hover:bg-white"
            aria-label="Sign in with Github"
          >
            <Image src="/github-icon.svg" alt="github" width={18} height={18} className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-xs sm:text-sm">GitHub</span>
          </button> */}
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-xs xs:text-sm sm:text-base text-[#7e737a]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-black underline hover:no-underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}