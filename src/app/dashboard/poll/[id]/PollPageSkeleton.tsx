import React from "react";
import Navbar from "@/app/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

function PollPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-8 lg:py-12">
          <div className="w-full max-w-2xl mx-auto lg:mx-0">
            <div className="space-y-3 mb-8">
              <Skeleton className="h-10 sm:h-12 w-[90%]" />
              <Skeleton className="h-5 w-[70%]" />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Skeleton className="h-8 w-36 rounded-none border-2 border-black" />
                <Skeleton className="h-8 w-24 rounded-none border-2 border-black" />
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 sm:p-5 border-2 border-black shadow-[4px_4px_0px_black]"
                >
                  <Skeleton className="w-7 h-7 rounded-none border-2 border-black bg-primary/15" />
                  <Skeleton className="h-6 w-[75%]" />
                  <Skeleton className="w-5 h-5" />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Skeleton className="h-14 w-40 rounded-none border-2 border-black" />
              <Skeleton className="h-14 w-40 rounded-none border-2 border-black" />
            </div>
          </div>
        </div>

        <div className="lg:w-72 xl:w-80 border-t-2 lg:border-t-0 lg:border-l-2 border-black bg-gray-50 p-5 sm:p-6 lg:p-8">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_black] space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>

            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_black] space-y-3">
              <Skeleton className="h-3 w-20" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollPageSkeleton;
