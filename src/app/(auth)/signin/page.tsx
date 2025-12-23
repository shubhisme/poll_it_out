"use client";

import SyncUser from "@/app/components/SyncUser";
import { useSignIn } from "@clerk/nextjs";
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

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
    //   const {data , err} = await db_connect();
    //   console.log("DB Connected: ",data);

        router.push("/dashboard");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Sign in failed");
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

    //   const {data , err} = await db_connect();
    //   console.log("DB Connected: ",data);


    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Google sign in failed");
    }
  };

  const handelGoogleGithub = async () => {
    setError("");
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    //   <SyncUser />;
    } catch (err: any) {
      setError(err?.errors?.[0]?.long_message ?? "Github sign in failed");
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