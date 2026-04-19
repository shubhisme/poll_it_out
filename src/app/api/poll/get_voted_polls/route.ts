import dbconnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {Vote , User, Poll} from "@/app/models/schema";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)

    const user_id = searchParams.get("user_id");

    if(!user_id){
        return NextResponse.json({error: "User ID is required"}, {status: 400})
    }

    try{
        await dbconnect();

        const user = await User.findOne({clerk_id : user_id}).select("_id");
        console.log({user_id: user?._id});

        const VotedPolls = await Vote.distinct("poll_id", {user_id : user._id});

        if(VotedPolls.length === 0){
            return NextResponse.json({data: []}, {status: 200})
        }

        // poll_id
        const polls_Voted = []
        for (const pollid of VotedPolls) {
            const db_poll_data = await Poll.findById(pollid);
            polls_Voted.push(db_poll_data);
        }

        return NextResponse.json({ data: polls_Voted }, { status: 200 });
    }catch(err : unknown){
        const errorMessage = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}