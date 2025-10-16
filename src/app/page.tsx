"use client";

import { useRouter } from "next/navigation";
import Page from "./dashboard/page";
import { useEffect } from "react";


export default function Home() {
    const router = useRouter();
    
    useEffect(()=>{
        router.push("/dashboard");
    }, [router])
  return (<></>
  );
}
