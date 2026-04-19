import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PollViewSkeleton() {
  return (
    <>
      <div className='flex mx-auto w-[90%] flex-col gap-4 pt-3'>
        {/* Header Section */}
        <div className='flex flex-wrap justify-between items-center gap-3'>
          {/* Joining Code */}
          <div className='flex items-center gap-2'>
            <p>Joining Code :</p>
            <Skeleton className='h-8 w-20 bg-gray-800 rounded-none' />
          </div>

          {/* QR Code and Live Count */}
          <div className='flex flex-row items-center gap-4'>
            <Skeleton className='h-10 w-32 bg-gray-200 rounded-none' />
            <Skeleton className='h-10 w-10 bg-gray-200 rounded-none' />
          </div>

          {/* Live Indicator */}
          <div className='flex items-center gap-2'>
            <Skeleton className='h-6 w-40 bg-green-200 rounded-full' />
          </div>
        </div>

        {/* Main Content Section */}
        <div className='flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-200px)] h-[calc(100vh-180px)]'>
          {/* Chart Section - Left Side */}
          <div className='flex-1 border-2 border-black bg-white shadow-[4px_4px_0px_black] p-5 sm:p-6 flex flex-col h-full lg:h-auto mb-0'>
            {/* Header with Title and Chart Type Selector */}
            <div className='flex flex-col gap-4 mb-6 flex-shrink-0'>
              <div className='flex flex-col sm:flex-row items-start justify-between gap-3'>
                {/* Question and Description */}
                <div className='flex-1'>
                  <Skeleton className='h-8 w-full max-w-md bg-gray-200 mb-2 rounded-sm' />
                  <Skeleton className='h-4 w-full max-w-lg bg-gray-150 rounded-sm' />
                </div>
                {/* Chart Type Dropdown */}
                <Skeleton className='h-10 w-40 bg-gray-200 rounded-none flex-shrink-0' />
              </div>
            </div>

            {/* Chart Area */}
            <div className='flex-1 flex items-center justify-center pb-6'>
              <div className='w-full h-full'>
                {/* Bar Chart Skeleton */}
                <div className='space-y-4'>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className='flex items-center gap-3'>
                      <Skeleton className='h-6 w-24 bg-gray-150 rounded-sm flex-shrink-0' />
                      <Skeleton className='flex-1 h-8 bg-gray-300 rounded-sm' />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Vote Counts */}
            <div className='flex items-center justify-between flex-shrink-0 gap-2 flex-wrap'>
              <div className='flex items-center gap-1.5 border-2 border-black px-3 py-0.5'>
                <p className='text-sm'>Total Votes:</p>
                <Skeleton className='h-6 w-12 bg-gray-200 rounded-sm' />
              </div>
              <Skeleton className='h-10 w-48 bg-gray-200 rounded-sm' />
            </div>
          </div>

          {/* Chat Section - Right Side */}
          <div className='w-full lg:w-[45%] h-full lg:h-auto flex flex-col border-2 border-black bg-black shadow-[4px_4px_0px_black]'>
            {/* Chat Header */}
            <div className='border-b-2 border-gray-700 p-4 flex-shrink-0'>
              <Skeleton className='h-6 w-32 bg-gray-600 rounded-sm mb-1' />
              <Skeleton className='h-4 w-48 bg-gray-600 rounded-sm' />
            </div>

            {/* Chat Messages Area */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'} rounded p-3 space-y-1`}>
                    <Skeleton className='h-4 w-20 bg-gray-600 rounded-sm' />
                    <Skeleton className='h-3 w-full bg-gray-600 rounded-sm' />
                    <Skeleton className='h-3 w-24 bg-gray-600 rounded-sm' />
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className='border-t-2 border-gray-700 p-4 flex-shrink-0 flex gap-2'>
              <Skeleton className='flex-1 h-10 bg-gray-700 rounded-sm' />
              <Skeleton className='h-10 w-10 bg-gray-700 rounded-sm' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PollViewSkeleton;
