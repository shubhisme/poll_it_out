"use client";

import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Poll_timer from '../../_components/Poll_timer';

const Page = () => {
    const [poll_data, setPollData] = useState<any>();
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [err, setError] = useState("");
    const [isPollExpired, setIsPollExpired] = useState(false);
    const { id } = useParams();

    const isPoll = useCallback(
        async () => {
            try {
                const poll_data_api = await fetch(`/api/validate/checkpollbyid`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ pollid: id })
                })

                const res = await poll_data_api.json();
                console.log({ response: res.data });

                setPollData(res?.data);
            } catch (err: any) {
                setError(err?.error || "Failed to load poll");
                console.log(err?.error);
            }

        }, [id]
    );

    useEffect(() => {
        isPoll();
    }, [id]);

    const handleCheckboxChange = (optionId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selections = poll_data?.multi_true ? selectedOptions : [selectedOption];
        console.log("Submitted selections:", selections);
        // TODO: Add vote submission logic
    };

    if (!poll_data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading poll...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background relative">
            {/* Timer in top right */}
            <div className="absolute top-6 right-6 z-10">
                <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_black]">
                    <Poll_timer exp_at={poll_data?.expires_at} onExpire={() => setIsPollExpired(true)} />
                </div>
            </div>

            {/* Main content centered */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-3xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Question and Description */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-foreground">
                                {poll_data?.question}
                            </h1>
                            {poll_data?.description && (
                                <p className="text-lg text-muted-foreground">
                                    {poll_data.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Poll Code: {poll_data?.share_code}</span>
                                {poll_data?.multi_true && (
                                    <>
                                        <span>•</span>
                                        <span className="font-medium">Multiple selections allowed</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {poll_data?.multi_true ? (
                                // Multiple selection mode
                                poll_data?.options?.map((option: any) => (
                                    <div
                                        key={option._id}
                                        className="group"
                                    >
                                        <div className={`
                                            flex items-center space-x-4 p-5 border-2 border-black
                                            transition-all
                                            hover:translate-x-1 hover:translate-y-1
                                            ${selectedOptions.includes(option._id)
                                                ? 'bg-white text-black shadow-none'
                                                : 'bg-white shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black]'
                                            }
                                        `}
                                        >
                                            <Checkbox
                                                id={option._id}
                                                checked={selectedOptions.includes(option._id)}
                                                onCheckedChange={() => handleCheckboxChange(option._id)}
                                                className="border-2 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                            />
                                            <Label
                                                htmlFor={option._id}
                                                className="flex-1 text-lg cursor-pointer font-medium"
                                            >
                                                {option.text}
                                            </Label>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Single selection mode with checkbox (toggleable)
                                poll_data?.options?.map((option: any) => (
                                    <div
                                        key={option._id}
                                        className="group"
                                    >
                                        <div className={`
                                            flex items-center space-x-4 p-5 border-2 border-black
                                            transition-all
                                            hover:translate-x-1 hover:translate-y-1
                                            ${selectedOption === option._id
                                                ? 'bg-white text-black shadow-none'
                                                : 'bg-white shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black]'
                                            }
                                        `}
                                        >
                                            <Checkbox
                                                id={option._id}
                                                checked={selectedOption === option._id}
                                                onCheckedChange={(checked) => {
                                                    // Toggle behavior: if already selected, deselect; otherwise select this one
                                                    setSelectedOption(checked ? option._id : "");
                                                }}
                                                className="border-2 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                            />
                                            <Label
                                                htmlFor={option._id}
                                                className="flex-1 text-lg cursor-pointer font-medium"
                                            >
                                                {option.text}
                                            </Label>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isPollExpired || (poll_data?.multi_true ? selectedOptions.length === 0 : !selectedOption)}
                                className="
                                    px-12 py-6 text-xl font-bold
                                    bg-white text-black border-2 border-black
                                    shadow-[6px_6px_0px_black]
                                    hover:translate-x-1 hover:translate-y-1
                                    hover:shadow-[6px_6px_0px_black]
                                    active:translate-x-2 active:translate-y-2
                                    active:shadow-none
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    disabled:hover:translate-x-0 disabled:hover:translate-y-0
                                    disabled:hover:shadow-[6px_6px_0px_black]
                                    transition-all
                                "
                            >
                                Submit Vote
                            </Button>
                        </div>

                        {err && (
                            <p className="text-center text-red-500 font-medium">{err}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Page
