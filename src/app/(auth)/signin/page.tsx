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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-lg p-6 sm:p-8 shadow-md"
        aria-label="Sign in form"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
          Sign In
        </h2>

        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 px-3 py-2 bg-[#f9fafc] mb-4 rounded"
          aria-label="Email"
          required
        />

        <label className="block text-sm mb-1">
          Password (Maximum 8 characters)
        </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 px-3 py-2 bg-[#f9fafc] mb-4 rounded"
          aria-label="Password"
          required
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            type="button"
            onClick={handelGoogleLogin}
            className="flex items-center gap-2 justify-center w-full sm:flex-1 border-2 py-2 rounded bg-white"
            aria-label="Sign in with Google"
          >
            <Image src="/google-icon.svg" alt="google" width={20} height={20} />
            <span className="text-sm">Connect With Google</span>
          </button>

          <button
            type="button"
            onClick={handelGoogleGithub}
            className="flex items-center gap-2 justify-center w-full sm:flex-1 border-2 py-2 rounded bg-white"
            aria-label="Sign in with Github"
          >
            <Image src="/github-icon.svg" alt="github" width={20} height={20} />
            <span className="text-sm">Connect With Github</span>
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-semibold mb-3" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 border-2 border-black bg-[#f9fafc] text-[#7e737a] font-medium shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none transition-all mb-3 rounded"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-[#7e737a]">
          Not a user?{" "}
          <Link href="/signup" className="underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}