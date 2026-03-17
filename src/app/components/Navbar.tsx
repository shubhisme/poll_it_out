'use client'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Book, Plus, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from "sonner";

function Navbar() {
    const path = usePathname();
    const router = useRouter();
    const isPath = path.includes("/dashboard/poll/");
    const [open, setOpen] = useState(false);
    const [pollCode, setPollCode] = useState("");
    const dropdownRef = useRef<HTMLLIElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const handleJoin = async () => {
        const code = pollCode.trim();
        if (!code) return;

        try{
            const res = await fetch(`/api/poll/${code}`);
            const data = await res.json();

            console.log("response", res.ok);

            if(!res.ok && data?.message){
                console.log("inside error");
                toast.error(data.message || "Error joining poll");
                setPollCode("");
            }else{
                const { pollId } = data;
                router.push(`/dashboard/poll/${pollId}`);
            }

        }catch(err){
            const message =
                typeof err === "object" &&
                err !== null &&
                "message" in err &&
                typeof err.message === "string"
                    ? err.message
                    : "Error joining poll";
            toast.error(message);
        }

        setPollCode("");
    };


  return (
    <div className='flex items-center justify-center'>
        <nav className='w-[100%] bg-white h-full flex justify-between px-15 py-4 border-b-2 items-center'>
            <p>Poll It Out</p>

            <ul className='flex justify-around gap-x-5 items-center'>
                <li className='flex items-center gap-x-2 shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer'>
                    <Link href="/dashboard/create-poll" className='flex items-center gap-x-2 border-2 px-2'>
                        <Plus className='w-4 h-4 text-black'/>
                        {isPath ? <p>Create New Poll</p> :
                            <p>Create Poll</p>}
                    </Link>
                </li>

                <li ref={dropdownRef} className='relative'>
                    <button
                        onClick={() => setOpen(!open)}
                        className='flex items-center gap-x-2 border-2 px-2 py-[1px] bg-white text-black shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer'
                    >
                        <Users className='w-4 h-4 text-black'/>
                        <p>Join A Poll</p>
                    </button>

                    {open && (
                        <div className='absolute top-full left-0 mt-2 z-50 border-2 border-black bg-white shadow-[4px_4px_0px_black] p-2 animate-in fade-in slide-in-from-top-1 duration-150'>
                            <div className='flex gap-1.5'>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={pollCode}
                                    onChange={(e) => setPollCode(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                                    placeholder="Enter code"
                                    className="w-32 px-2 py-1 border-2 border-black text-sm font-medium placeholder:text-gray-400 focus:outline-none"
                                />
                                <button
                                    onClick={handleJoin}
                                    disabled={!pollCode.trim()}
                                    className="bg-black text-white px-2 py-1 border-2 border-black text-sm font-semibold shadow-[2px_2px_0px_gray] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_gray]"
                                >
                                    <ArrowRight className='w-4 h-4' />
                                </button>
                            </div>
                        </div>
                    )}
                </li>

                {!isPath && 
                    <li className='flex items-center gap-x-2 shadow-[2px_2px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer'>
                        <Link href="/dashboard/create-poll" className='flex items-center gap-x-2 border-2 px-2'>
                            <Book className='w-4 h-4 text-black'/>
                            <p>About</p>
                        </Link>
                    </li>
                }
            </ul>

            <ul className="flex justify-around items-center gap-x-3">
                <li>Account</li>

                <SignedOut>
                    <li>
                        <Link href="/signin">
                        <button
                            className="font-semibold bg-black text-white px-2 py-1 shadow-[2px_2px_0px_gray]
                                    active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-x-1"
                        >
                            Sign In
                        </button>
                        </Link>
                    </li>

                    <li>
                        <Link href="/signup">
                        <button
                            className="font-semibold bg-black text-white px-2 py-1 shadow-[2px_2px_0px_gray]
                            active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                        >
                            Sign Up
                        </button>
                        </Link>
                    </li>
                </SignedOut>

                <li>
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-20 h-20", // custom classes
                                    userButtonPopoverCard: "bg-gray-900 text-white shadow-lg",
                                },
                                variables: {
                                    colorPrimary: "#2563eb", // Tailwind blue-600
                                }
                            }}  />
                    </SignedIn>
                </li>
            </ul>

        </nav>
    </div>
  )
}

export default Navbar