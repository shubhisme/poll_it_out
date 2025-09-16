import SyncUser from '@/app/components/SyncUser'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <ClerkProvider      
        appearance={{
            variables: {
            colorPrimary: '#0000ff', // blue
            colorForeground: '#000000', // black
            },
      }}>
        <SignedOut>
            <SignInButton />
            <SignUpButton>
            <button className=" text-gray-800 font-medium text-sm sm:text-base py-2 px-2 sm:px-3 cursor-pointer">
                Sign Up
            </button>
            </SignUpButton>
        </SignedOut>
        <SignedIn>
            <UserButton />
            <SyncUser/>
        </SignedIn>
    </ClerkProvider>
  )
}

export default page