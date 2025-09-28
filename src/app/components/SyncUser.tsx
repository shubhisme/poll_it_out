"use client"

import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

function SyncUser() {
    const {isSignedIn} = useAuth();

    console.log("Is signed in: ",isSignedIn);

    useEffect(()=>{
        if(isSignedIn){
            console.log("fetching /api/connectdb");
            fetch("/api/connectdb" , {method: "POST"})
        }
    }, [isSignedIn])

  return (
    null
  )
}

export default SyncUser