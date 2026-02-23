import redis from "@/lib/redis"
import { NextRequest, NextResponse } from "next/server"

export async function POST (req : NextRequest){
    try {
        const {pollid, user_id} = await req.json();

        const key = `viewing:pollid:${pollid}:user_id:${user_id}`;

        const res = await redis.set(key, "1" , {
            EX: 10
        })

        // console.log({res :res});

        return NextResponse.json({success : true} , {status : 200});

    }catch(error){
        console.log(error);
        return NextResponse.json({error : "Internal Server Error"} , {status : 500});
    }
}