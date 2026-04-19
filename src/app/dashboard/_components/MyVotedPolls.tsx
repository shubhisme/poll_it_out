"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Copy, Check, BarChart3 } from 'lucide-react'
import Poll_data from '@/app/types/Poll_types';

function MyVotedPolls({ user_id }: { user_id: string }) {

    const [votedPolls, setVotedPolls] = useState<Poll_data[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVotedPolls() {
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/poll/get_voted_polls?user_id=${user_id}`);
                const data = await res.json();

                if (res.ok) {
                    setVotedPolls(data.data || []);
                } else {
                    setError(data.error || "Failed to load voted polls");
                }
            } catch (error) {
                console.error("Error fetching voted polls:", error);
                setError("Error loading voted polls. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchVotedPolls();
    }, [user_id])

    const calculateTotalVotes = (poll: Poll_data) => {
        if (!poll.options) return 0;
        return (poll.options as Array<{ votes_count?: number }>).reduce((sum: number, option) => sum + (option.votes_count || 0), 0);
    };

    const isActive = (poll: Poll_data) => {
        if (!poll.expires_at) return true;
        return new Date(poll.expires_at) > new Date();
    };

    const handleCopyCode = (code: string, pollId: string) => {
        navigator.clipboard.writeText(code.toString());
        setCopiedId(pollId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Loading State
    if (loading) {
        return (
            <section className='mt-10 w-full'>
                <div className='flex justify-center'>
                    <div className='animate-pulse text-gray-400'>Loading your voted polls...</div>
                </div>
            </section>
        );
    }

    // Empty State
    if (!loading && votedPolls.length === 0) {
        return (
            <section className='mt-10 w-full'>
                <div className='border-2 bg-[#f3f4f6] p-8 text-center'>
                    <BarChart3 className='mx-auto mb-3 text-gray-400' size={40} />
                    <p className='text-gray-600 font-semibold mb-2'>No Voted Polls Yet</p>
                    <p className='text-gray-500 text-sm'>
                        Vote on a poll to see it here!
                    </p>
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className='mt-10 w-full'>
                <div className='border-2 border-red-300 bg-red-50 p-4 text-center'>
                    <p className='text-red-600 font-semibold'>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className='mt-8 w-full lg:w-1/2'>
            <div className='mb-4 px-2 sm:px-0'>
                <h2 className='text-xl sm:text-2xl font-bold text-black'>Voted Polls</h2>
                <p className='text-gray-500 text-xs sm:text-sm mt-1'>{votedPolls.length} poll{votedPolls.length !== 1 ? 's' : ''} voted</p>
            </div>

            <div className='max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2 space-y-2 sm:space-y-3'>
                {votedPolls.map((poll: Poll_data) => {
                    const totalVotes = calculateTotalVotes(poll);
                    const active = isActive(poll);

                    return (
                        <div
                            key={poll._id}
                            className='border-2 border-black bg-white hover:shadow-[4px_4px_0px_rgba(0,0,0,0.15)] transition-all duration-200 p-3 sm:p-4'
                        >
                            {/* Header: Title and Stats */}
                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3'>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='font-bold text-black text-sm sm:text-base leading-tight break-words'>
                                        {poll.question}
                                    </h3>
                                </div>
                                <div className='flex flex-wrap gap-1 sm:gap-2 items-center text-xs sm:text-sm font-semibold whitespace-nowrap sm:flex-shrink-0'>
                                    <span className='text-black'>{totalVotes}</span>
                                    <span className='text-gray-600 text-xs'>Votes</span>
                                    <span className='text-black text-xs sm:text-sm truncate'>{poll.duration || 'Forever'}</span>
                                    <div className={`px-1.5 sm:px-2 py-0.5 border-2 ${
                                        active 
                                            ? 'border-green-600 bg-green-50 text-green-700' 
                                            : 'border-gray-400 bg-gray-100 text-gray-600'
                                    }`}>
                                        <span className='text-xs font-bold'>{active ? 'Active' : 'Closed'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Code Display */}
                            <div className='mb-3 pb-3 border-b border-gray-200'>
                                <p className='text-xs text-gray-600 mb-2 break-all'>
                                    <span className='font-semibold'>Code:</span> {poll.share_code}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-2'>
                                <Link href={`/dashboard/poll/${poll._id}/view`} className='flex-1 w-full sm:w-auto'>
                                    <button className='w-full border-2 border-black bg-black text-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold hover:bg-gray-800 transition-colors active:translate-y-[1px]'>
                                        View
                                    </button>
                                </Link>

                                <button
                                    onClick={() => handleCopyCode(poll.share_code?.toString() || '', poll._id || '')}
                                    className='flex-1 sm:flex-initial border-2 border-black bg-white text-black px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold hover:bg-[#f3f4f6] transition-colors active:translate-y-[1px] whitespace-nowrap flex items-center justify-center sm:justify-start gap-1'
                                    title="Copy poll code"
                                >
                                    {copiedId === poll._id ? (
                                        <>
                                            <Check size={14} />
                                            <span className='hidden sm:inline'>Copied</span>
                                            <span className='sm:hidden'>✓</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span className='hidden sm:inline'>Copy code</span>
                                            <span className='sm:hidden'>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}

export default MyVotedPolls