import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import {User , Vote , Poll} from "@/app/models/schema";

export async function POST(request: NextRequest) {
    try{
        await dbconnect()

        const {poll_id, user_id} = await request.json();

        const userID = await User.findOne({clerk_id: user_id}).select("_id");

        const voteIn = await Vote.findOne({poll_id : poll_id , user_id :userID});

        const created_poll = await Poll.findById({poll_id}).select("created_by");

        console.log({voteIn : voteIn})
        if(voteIn || (created_poll.created_by.toString() === userID._id.toString())){
            return NextResponse.json({hasVoted : true} , {status : 200});
        }

        return NextResponse.json({hasVoted : false} , {status : 200});

    }catch(error){
        console.error("Error in hasvoted API:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}