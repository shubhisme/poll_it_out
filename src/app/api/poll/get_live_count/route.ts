import redis from "@/lib/redis"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try{
        const body = await req.json();
        console.log({id: body});

        const {pollid} = body;

        if(!pollid){
            return NextResponse.json({error : "Pollid is null..."}, {status: 404});
        }

        const pattern = `viewing:pollid:${pollid}:user_id:*`
       
        const key = await redis.keys(pattern);
        // console.log({redis_key : key});

        return NextResponse.json({
            count : key.length
        } , {status: 200})
    }catch(err){
        return NextResponse.json({error : err} , {status : 400})
    }
}