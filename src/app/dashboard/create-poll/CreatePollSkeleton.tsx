import Navbar from "@/app/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function CreatePollSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-2xl mx-auto px-4 py-8 md:px-6">
          {/* Header Section */}
          <div className="mb-8">
            <Skeleton className="h-10 w-64 bg-gray-200 mb-4 rounded-sm" />
            <Skeleton className="h-6 w-full bg-gray-150 rounded-sm" />
          </div>

          {/* Question Section */}
          <div className="border-2 border-black px-6 py-5 mb-6">
            <div className="mb-4">
              <Skeleton className="h-6 w-40 bg-gray-200 mb-2 rounded-sm" />
              <Skeleton className="h-4 w-full bg-gray-150 rounded-sm" />
            </div>

            <div className="space-y-4">
              {/* Question Input */}
              <div>
                <Skeleton className="h-4 w-24 bg-gray-150 mb-2 rounded-sm" />
                <Skeleton className="h-24 w-full bg-gray-100 rounded" />
              </div>

              {/* Description Input */}
              <div>
                <Skeleton className="h-4 w-32 bg-gray-150 mb-2 rounded-sm" />
                <Skeleton className="h-20 w-full bg-gray-100 rounded" />
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="border-2 border-black px-6 py-5 mb-6">
            <div className="mb-4">
              <Skeleton className="h-6 w-48 bg-gray-200 mb-2 rounded-sm" />
              <Skeleton className="h-4 w-full bg-gray-150 rounded-sm" />
            </div>

            <div className="space-y-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-2 items-stretch">
                  <Skeleton className="flex-1 h-10 bg-gray-100 rounded" />
                  {i > 2 && (
                    <Skeleton className="w-10 h-10 bg-gray-100 rounded" />
                  )}
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            <Skeleton className="w-full h-10 bg-gray-200 rounded-none" />
          </div>

          {/* Settings Section */}
          <div className="border-2 border-black px-6 py-5 mb-6">
            <div className="mb-4">
              <Skeleton className="h-6 w-40 bg-gray-200 mb-2 rounded-sm" />
              <Skeleton className="h-4 w-full bg-gray-150 rounded-sm" />
            </div>

            <div className="space-y-5">
              {/* Duration Dropdown */}
              <div>
                <Skeleton className="h-4 w-20 bg-gray-150 mb-2 rounded-sm" />
                <Skeleton className="w-full h-10 bg-gray-100 rounded" />
              </div>

              {/* Multiple Selections Toggle */}
              <div className="flex items-center justify-between border border-gray-200 rounded p-4 bg-gray-50">
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 bg-gray-200 mb-2 rounded-sm" />
                  <Skeleton className="h-3 w-64 bg-gray-150 rounded-sm" />
                </div>
                <Skeleton className="w-12 h-6 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Skeleton className="w-full h-14 bg-gray-200 rounded-none mb-8" />

          {/* Help Text */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
            <Skeleton className="h-4 w-full bg-gray-150 rounded-sm mb-2" />
            <Skeleton className="h-4 w-3/4 bg-gray-150 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePollSkeleton;
