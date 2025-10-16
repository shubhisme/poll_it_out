"use client"

import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

function SyncUser() {
    const {isSignedIn} = useAuth();

    console.log("Is signed in: ",isSignedIn);

    useEffect(() => {
        const syncUser = async () => {
            if(isSignedIn){
                console.log("fetching /api/connectdb");

                try{
                    const response = await fetch("/api/connectdb" , {method: "POST"});
                    if(response.status == 401){
                        console.log("User is not authorized");
                        throw new Error("Failed to connect to database");
                    }
                }catch(err){
                    console.log("Error fetching /api/connectdb:", err);
                }
            }
        };
        syncUser();
    }, [isSignedIn])

  return (
    null
  )
}

export default SyncUser