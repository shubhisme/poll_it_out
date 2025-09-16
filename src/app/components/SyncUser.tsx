"use client"

import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

function SyncUser() {
    const {isSignedIn} = useAuth();

    useEffect(()=>{
        if(isSignedIn){
            fetch("/api/connectdb" , {method: "POST"})
        }
    }, [isSignedIn])

  return (
    null
  )
}

export default SyncUser