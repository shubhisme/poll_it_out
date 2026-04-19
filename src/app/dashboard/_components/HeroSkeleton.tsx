import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function HeroSkeleton() {
  return (
    <section className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-6 py-16'>
        {/* Hero Header Skeleton */}
        <div className='mb-16'>
          {/* Main Title */}
          <Skeleton className='h-16 w-full md:w-3/4 bg-gray-200 mb-6 rounded-sm' />
          
          {/* Subtitle */}
          <Skeleton className='h-8 w-full md:w-1/2 bg-gray-150 mb-4 rounded-sm' />
          
          {/* Description Lines */}
          <div className='space-y-3'>
            <Skeleton className='h-6 w-full bg-gray-150 rounded-sm' />
            <Skeleton className='h-6 w-full bg-gray-150 rounded-sm' />
            <Skeleton className='h-6 w-3/4 bg-gray-150 rounded-sm' />
          </div>
        </div>

        {/* Action Buttons Section Skeleton */}
        <div className='border-2 border-gray-200 bg-white p-8 mb-16'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
            {/* Create Poll Button */}
            <Skeleton className='w-full md:w-48 h-12 bg-gray-200 rounded-none' />
            
            {/* Separator */}
            <div className='hidden md:block text-gray-400'>•</div>

            {/* Join Input Section */}
            <div className='flex gap-2 w-full md:w-auto'>
              <Skeleton className='flex-1 md:flex-none w-full md:w-48 h-12 bg-gray-200 rounded-none' />
              <Skeleton className='w-24 h-12 bg-gray-200 rounded-none' />
            </div>
          </div>
        </div>

        {/* My Polls and Voted Polls Section Skeleton */}
        <div className='mb-16'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Left Column - My Voted Polls */}
            <div className='flex-1'>
              <Skeleton className='h-8 w-48 bg-gray-200 mb-4 rounded-sm' />
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='border-2 border-gray-200 p-4 space-y-2'>
                    <Skeleton className='h-6 w-3/4 bg-gray-150 rounded-sm' />
                    <Skeleton className='h-4 w-1/2 bg-gray-150 rounded-sm' />
                    <div className='flex gap-2 mt-2'>
                      <Skeleton className='h-8 w-20 bg-gray-150 rounded-sm' />
                      <Skeleton className='h-8 w-20 bg-gray-150 rounded-sm' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - My Polls */}
            <div className='flex-1'>
              <Skeleton className='h-8 w-48 bg-gray-200 mb-4 rounded-sm' />
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='border-2 border-gray-200 p-4 space-y-2'>
                    <Skeleton className='h-6 w-3/4 bg-gray-150 rounded-sm' />
                    <Skeleton className='h-4 w-1/2 bg-gray-150 rounded-sm' />
                    <div className='flex gap-2 mt-2'>
                      <Skeleton className='h-8 w-20 bg-gray-150 rounded-sm' />
                      <Skeleton className='h-8 w-20 bg-gray-150 rounded-sm' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Board Skeleton */}
        <div className='mb-16'>
          <Skeleton className='h-8 w-48 bg-gray-200 mb-4 rounded-sm' />
          <div className='border-2 border-gray-200 p-6 space-y-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex items-center justify-between border-b border-gray-200 pb-4 last:border-0'>
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-6 w-2/3 bg-gray-150 rounded-sm' />
                  <Skeleton className='h-4 w-1/3 bg-gray-150 rounded-sm' />
                </div>
                <Skeleton className='h-12 w-24 bg-gray-200 rounded-sm' />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section Skeleton */}
        <div>
          <Skeleton className='h-8 w-48 bg-gray-200 mb-4 rounded-sm' />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='border-2 border-black p-6 space-y-3'>
                <Skeleton className='h-10 w-10 bg-gray-200 rounded-sm' />
                <Skeleton className='h-6 w-3/4 bg-gray-200 rounded-sm' />
                <Skeleton className='h-4 w-full bg-gray-150 rounded-sm' />
                <Skeleton className='h-4 w-5/6 bg-gray-150 rounded-sm' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSkeleton
