import React, { useCallback, useState , useEffect } from 'react'
import Poll_data from '@/app/types/Poll_types'
import { toast } from 'sonner'
import Link from 'next/link'
import { Check, Copy } from 'lucide-react'

function Active() {

    const [pollData , setPollData] = useState<Poll_data[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchActive = useCallback(async()=>{

        try{
            setLoading(true);
            setError("");
            const res = await fetch("/api/get_forever_polls")

            const data = await res.json();

            if(res.ok){
                setPollData(data.poll ||[])
            }else if(!res.ok){
                toast.error("Cannot fetch active pollData .");
                return;
            }
        }catch(err){
            console.log({ ERR: err })
            setError("Error loading polls. Please try again.");
        }finally{
            setLoading(false);
        }

    } , [setPollData])

    useEffect(()=>{
        fetchActive()
    } , [fetchActive])

    const calculateTotalVotes = (poll: Poll_data) => {
        if (!poll.options) return 0;
        return (poll.options as Array<{votes_count?: number}>).reduce((sum: number, option) => sum + (option.votes_count || 0), 0);
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

    const whatsapp_share = (pollId : string)=>{
        const message = `🗳️ *You're Invited to a Poll!* 

        🔥 *Poll It Out* needs your vote!

        👉 Click below to participate:
        https://pollitout.vercel.app/dashboard/poll/${pollId}

        📊 Make your opinion count now!`;

        const encodeURL = encodeURIComponent(message);

        const URL = `https://wa.me/?text=${encodeURL}`;

        window.open(URL , '_blank');
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

    if (loading) {
        return (
            <section className='mt-10 w-full'>
                <div className='flex justify-center'>
                    <div className='animate-pulse text-gray-400'>Loading Active polls...</div>
                </div>
            </section>
        );
    }

    return (
    <>
        {pollData &&
            <section className='mt-8 w-full px-2 sm:px-4'>
                <div className='mb-6'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-black'>Active Polls</h2>
                    <p className='text-gray-500 text-sm sm:text-base mt-2'>{pollData.length} poll{pollData.length !== 1 ? 's' : ''} created</p>
                </div>

                <div className='max-h-[600px] overflow-y-auto pr-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4'>
                        {pollData.map((poll: Poll_data) => {
                            const totalVotes = calculateTotalVotes(poll);
                            const active = isActive(poll);

                            return (
                                <div
                                    key={poll._id}
                                    className='border-2 border-black bg-white hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] active:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all duration-200 p-4 sm:p-5 flex flex-col gap-4 rounded-none group cursor-pointer'
                                >
                                    {/* Header: Title and Status Badge */}
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <h3 className='font-bold text-black text-base sm:text-lg leading-tight flex-1 break-words group-hover:text-gray-800 transition-colors'>
                                                {poll.question}
                                            </h3>
                                            <div className={`px-2.5 py-1 border-2 flex-shrink-0 font-bold text-xs whitespace-nowrap rounded-none ${
                                                active 
                                                    ? 'border-green-600 bg-green-50 text-green-700' 
                                                    : 'border-gray-400 bg-gray-100 text-gray-600'
                                            }`}>
                                                {active ? 'Active' : 'Closed'}
                                            </div>
                                        </div>

                                        {/* Vote Stats */}
                                        <div className='flex items-center gap-2 bg-gray-50 px-3 py-2 border border-gray-200 rounded-none'>
                                            <span className='text-lg sm:text-xl font-bold text-black'>{totalVotes}</span>
                                            <span className='text-xs sm:text-sm text-gray-600 font-semibold'>Votes</span>
                                            {poll.duration && (
                                                <>
                                                    <span className='text-gray-300'>•</span>
                                                    <span className='text-xs sm:text-sm text-gray-600 font-semibold'>{poll.duration}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Code Display */}
                                    <div className='border-t border-gray-200 pt-3'>
                                        <p className='text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wider'>Poll Code</p>
                                        <div className='flex items-center gap-2 bg-gray-50 p-2.5 border border-gray-200 rounded-none group/code'>
                                            <code className='text-xs sm:text-sm font-mono font-bold text-black flex-1 break-all'>
                                                {poll.share_code}
                                            </code>
                                            <button
                                                onClick={() => handleCopyCode(poll.share_code?.toString() || '', poll._id || '')}
                                                className='flex-shrink-0 bg-black text-white p-1.5 border border-black hover:bg-gray-800 transition-colors active:translate-y-[1px] rounded-none'
                                                title="Copy poll code"
                                            >
                                                {copiedId === poll._id ? (
                                                    <Check size={16} className='text-green-400' />
                                                ) : (
                                                    <Copy size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex gap-2 pt-2 border-t border-gray-200 mt-auto'>
                                        <Link href={`/dashboard/poll/${poll._id}`} className='flex-1'>
                                            <button className='w-full border-2 border-black bg-black text-white px-3 py-2 text-xs sm:text-sm font-bold hover:bg-gray-800 active:translate-y-[1px] active:shadow-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all rounded-none'>
                                                View Poll
                                            </button>
                                        </Link>

                                        {/* Share Button */}
                                        <button className='flex-1 border-2 border-black bg-white text-black px-3 py-2 text-xs sm:text-sm font-bold hover:bg-green-50 hover:border-green-600 active:translate-y-[1px] shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all rounded-none' onClick={() =>whatsapp_share(poll._id || '')}>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        }
    </>
  )
}

export default Active