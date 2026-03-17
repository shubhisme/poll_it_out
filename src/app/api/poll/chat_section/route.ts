import { Chat, User } from "@/app/models/schema";
import dbconnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
    
export async function POST(req : NextRequest){
    try{
        await dbconnect();

        const {user_id , poll_id , message} = await req.json(); 

        console.log({user : user_id , poll : poll_id , mess : message});
        
        if(!user_id || !poll_id || typeof message !== "string" || message.trim() === ""){
            return NextResponse.json({error : "Invalid payload..."} , {status: 400});
        }

        if (!mongoose.Types.ObjectId.isValid(poll_id)) {
            return NextResponse.json({ error: "Invalid poll id..." }, { status: 400 });
        }

        // let resolvedUserId = user_id;
        // if (!mongoose.Types.ObjectId.isValid(user_id)) {
        //     const user = await User.findOne({ clerk_id: user_id }).select("_id");
        //     if (!user?._id) {
        //         return NextResponse.json({ error: "User not found..." }, { status: 404 });
        //     }
        //     resolvedUserId = user._id.toString();
        // }

        const userName = await User.findById(user_id).select("username");

        if(!userName){
            return NextResponse.json({error : "User not found..."} , {status: 404});
        }

        const name = userName?.username ?? "Unkown User";

        const data = await Chat.insertOne({
            user_id: user_id,
            poll_id,
            message: message.trim(),
            user_name : name
        });

        if(!data) {
            return NextResponse.json({error : "Failed to send message..."} , {status: 404});
        }

        console.log("message data : ", data);

        try{
            const payload = {
                _id: data?._id,
                user_id: data?.user_id,
                poll_id : data?.poll_id,
                message: data?.message,
                user_name : data?.user_name,
                createdAt: data?.createdAt ?? new Date().toISOString()
            };

            await fetch("http://localhost:4000/chat-section" , {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    pollid: poll_id,
                    data: payload
                })
            })
        }catch(error){
            console.error("Error sending message to socket server:", error);
        }   

        return NextResponse.json({data : data} , {status: 200});
        
    }catch(error){
        console.error("chat_section POST error:", error);
        return NextResponse.json({error : "Internal Server Error..."} , {status: 500});
    }
}