import { Chat} from "@/app/models/schema";
import { NextRequest, NextResponse } from "next/server";
    
export async function POST(req : NextRequest){
    try{
        const {user_id , poll_id , message} = await req.json(); 
        
        if(!user_id || !poll_id || message === ''){
            return NextResponse.json({error : "Inavalid Headders..."} , {status: 405});
        }

        const data = await Chat.insertOne({
            user_id,
            poll_id,
            message
        });

        if(!data) {
            return NextResponse.json({error : "Failed to send message..."} , {status: 404});
        }

        return NextResponse.json({message : "Message sent successfully..."} , {status: 200});
        
    }catch(error){
        return NextResponse.json({error : "Internal Server Error..."} , {status: 500});
    }
}