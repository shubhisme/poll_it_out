import { Chat } from "@/app/models/schema";
import dbconnect from "@/lib/mongodb";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req : NextRequest){
    try{
        await dbconnect();

        const {searchParams} = new URL(req.url);
        const poll_id = searchParams.get("poll_id");
        const limit = searchParams.get("limit");

        if(!poll_id || typeof poll_id !== "string"){
            return NextResponse.json({error : "Invalid poll id..."} , {status: 400});
        }

        const messages = await Chat.find({poll_id}).sort({createdAt : -1}).limit(limit ? parseInt(limit) : 50);

        return NextResponse.json({messages : messages} , {status: 200});

    }catch(err){
        return NextResponse.json({error : err || "Failed to fetch messages..."} , {status: 500});  
    }
}