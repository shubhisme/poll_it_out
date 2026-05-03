"use client";

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import Poll_timer from '../../_components/Poll_timer';
import type Poll_data from '@/app/types/Poll_types'
import type Option_data from '@/app/types/Poll_types'
import { useAuth } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { Copy, Check, ChevronRight } from 'lucide-react';
import PollPageSkeleton from './PollPageSkeleton';
import { toast } from 'sonner';

const Page = () => {
    const [poll_data, setPollData] = useState<Poll_data | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [err, setError] = useState("");
    const [isPollExpired, setIsPollExpired] = useState(false);
    const { id } = useParams();
    const {userId , isLoaded} = useAuth();
    const [hasVoted , setHasVoted] = useState(true);
    const [copied, setCopied] = useState(false);

    const router = useRouter();

    useEffect(()=>{
        if(!isLoaded){return ;}

        if(!userId){
            router.push("/signin");
            return;
        }

        isPoll();
    } , [isLoaded , userId , router]);

    const isPoll = useCallback(
        async () => {
            try {

                console.log({userID: userId})
                const poll_data_api = await fetch(`/api/validate/checkpollbyid`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ pollid: id , user_id: userId })
                })

                const res = await poll_data_api.json();

                setPollData(res?.data);

            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "Failed to load poll");
                    toast.error(err.message || "Failed to load poll");
                } else {
                    setError("Failed to load poll");
                    toast.error("Failed to load poll");
                }
                console.log(err);
            }

        }, [id, userId]
    );

    const handleCheckboxChange = (optionId: string) => {
        setSelectedOptions(prev => {
            const newSelections = prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId];
            
            console.log({selectedOptions : newSelections});
            return newSelections;
        });
    };

    const handleCopyCode = () => {
        if (poll_data?.share_code) {
            const strCode = String(poll_data.share_code);
            navigator.clipboard.writeText(strCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const selections = poll_data?.multi_true ? selectedOptions : [selectedOption];
        console.log("Submitted selections:", selections);

        const vote_api_data = {
            pollid : id,
            options_id : selections,
            clerk_id : userId
        }

        // console.log({vote_api_data : vote_api_data});

        try{
            const vote_api = await fetch(`/api/votepoll` , {
                method : "POST",
                headers :{
                    "Content-Type" : "application/json"
                },

                body : JSON.stringify(vote_api_data)
            })

            const data = await vote_api.json()
            console.log({data});

            if(vote_api?.status !== 200){
                setError(data?.error);
                toast.error(data?.error || "Failed to vote");
            }else{
                setHasVoted(true);
                toast.success("Vote submitted successfully!");
            }

        } catch(err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to vote");
            } else {
                setError("Failed to vote");
            }
            console.log(err);
        }

    }, [id, poll_data, selectedOptions, selectedOption, userId]);

    if (!poll_data) {
        return <PollPageSkeleton />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* <Navbar /> */}

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Left: Poll content */}
                <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-8 lg:py-12">
                    <div className="w-full max-w-2xl mx-auto lg:mx-0">
                        {/* Header section */}
                        <div className="space-y-3 mb-8">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
                                {poll_data?.question}
                            </h1>
                            {poll_data?.description && (
                                <p className="text-base sm:text-lg text-gray-500">
                                    {poll_data.description}
                                </p>
                            )}

                            {/* Poll meta badges */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                    onClick={handleCopyCode}
                                    className="inline-flex items-center gap-1.5 border-2 border-black px-3 py-1 text-sm font-semibold bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <span>Code: {poll_data?.share_code}</span>
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>

                                {poll_data?.multi_true && (
                                    <span className="inline-flex items-center border-2 border-black bg-black text-white px-3 py-1 text-sm font-semibold">
                                        Multi-select
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Options */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                {poll_data?.multi_true ? (
                                    poll_data?.options?.filter(option => option._id).map((option: Option_data, idx: number) => {
                                    const optionId = option._id as string;
                                    return (
                                        <label
                                            key={optionId}
                                            htmlFor={optionId}
                                            className={`
                                                group flex items-center gap-4 p-4 sm:p-5 border-2 border-black cursor-pointer
                                                transition-all duration-150
                                                ${selectedOptions.includes(optionId)
                                                    ? 'bg-black text-white translate-x-1 translate-y-1 shadow-none'
                                                    : 'bg-white text-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px]'
                                                }
                                            `}
                                        >
                                            <span className={`
                                                flex-shrink-0 w-7 h-7 flex items-center justify-center border-2 text-xs font-bold
                                                ${selectedOptions.includes(optionId)
                                                    ? 'border-white text-white'
                                                    : 'border-black text-black'
                                                }
                                            `}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <Checkbox
                                                id={optionId}
                                                checked={selectedOptions.includes(optionId)}
                                                onCheckedChange={() => handleCheckboxChange(optionId)}
                                                className="hidden"
                                            />
                                            <span className="flex-1 text-base sm:text-lg font-medium">
                                                {option.text}
                                            </span>
                                            <ChevronRight className={`w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${selectedOptions.includes(optionId) ? 'opacity-100' : ''}`} />
                                        </label>
                                    );
                                    })
                                ) : (
                                    poll_data?.options?.filter(option => option._id).map((option: Option_data, idx: number) => {
                                    const optionId = option._id as string;
                                    return (
                                        <label
                                            key={optionId}
                                            htmlFor={optionId}
                                            className={`
                                                group flex items-center gap-4 p-4 sm:p-5 border-2 border-black cursor-pointer
                                                transition-all duration-150
                                                ${selectedOption === optionId
                                                    ? 'bg-black text-white translate-x-1 translate-y-1 shadow-none'
                                                    : 'bg-white text-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px]'
                                                }
                                            `}
                                        >
                                            <span className={`
                                                flex-shrink-0 w-7 h-7 flex items-center justify-center border-2 text-xs font-bold
                                                ${selectedOption === optionId
                                                    ? 'border-white text-white'
                                                    : 'border-black text-black'
                                                }
                                            `}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <Checkbox
                                                id={optionId}
                                                checked={selectedOption === optionId}
                                                onCheckedChange={(checked) => {
                                                    if (typeof checked === 'boolean' && checked) {
                                                        setSelectedOption(optionId);
                                                    } else {
                                                        setSelectedOption("");
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <span className="flex-1 text-base sm:text-lg font-medium">
                                                {option.text}
                                            </span>
                                            <ChevronRight className={`w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${selectedOption === optionId ? 'opacity-100' : ''}`} />
                                        </label>
                                    );
                                    })
                                )}
                            </div>

                            {/* Error */}
                            {err && (
                                <div className="mt-4 border-2 border-red-500 bg-red-50 px-4 py-2">
                                    <p className="text-red-600 font-semibold text-sm">{err}</p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-3 mt-8">
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={(poll_data?.expires_at && isPollExpired) || (poll_data?.multi_true ? selectedOptions.length === 0 : !selectedOption)}
                                    className="
                                        px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold
                                        bg-black text-white border-2 border-black
                                        shadow-[4px_4px_0px_gray]
                                        hover:translate-y-[2px] hover:shadow-[2px_2px_0px_gray]
                                        active:translate-y-[4px] active:shadow-none
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_gray]
                                        transition-all
                                    "
                                >
                                    Submit Vote
                                </Button>

                                {hasVoted && (
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={() => router.push(`/dashboard/poll/${id}/view`)}
                                        className="
                                            px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold
                                            bg-white text-black border-2 border-black
                                            shadow-[4px_4px_0px_gray]
                                            hover:translate-y-[2px] hover:shadow-[2px_2px_0px_gray] hover:bg-transparent
                                            active:translate-y-[4px] active:shadow-none
                                            transition-all
                                        "
                                    >
                                        View Results
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Timer sidebar */}
                <div className="lg:w-72 xl:w-80 border-t-2 lg:border-t-0 lg:border-l-2 border-black bg-gray-50 p-5 sm:p-6 lg:p-8">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        {/* Timer card */}
                        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_black]">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Time Remaining</p>
                            <div className="text-2xl font-bold">
                                <Poll_timer exp_at={poll_data?.expires_at} onExpire={() => setIsPollExpired(true)} />
                            </div>
                        </div>

                        {/* Poll info card */}
                        <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_black]">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Poll Info</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Options</span>
                                    <span className="font-bold">{poll_data?.options?.length ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-bold">{poll_data?.multi_true ? 'Multi-select' : 'Single'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Code</span>
                                    <span className="font-bold">{poll_data?.share_code}</span>
                                </div>
                            </div>
                        </div>

                        {/* Expired overlay */}
                        {isPollExpired && poll_data?.expires_at && (
                            <div className="border-2 border-red-500 bg-red-50 p-4">
                                <p className="font-bold text-red-600 text-sm">This poll has expired.</p>
                                <p className="text-red-500 text-xs mt-1">You can still view results provided you have voted.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
