import { Poll , User } from "@/app/models/schema";
import dbconnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbconnect();
        const body = await request.json();
        const pollid = body.pollid;
        const userId = body.user_id;
        console.log({pollid});

        if (!pollid) {
            return NextResponse.json({ error: "Poll ID is required" }, { status: 400 });
        }

        const poll_data = await Poll.findById(pollid);
        const user_name = await User.findOne({clerk_id : userId}).select("username");

        if(!user_name){
            return NextResponse.json({error : "User not found..."}, {status : 404});
        }

        console.log({user_name : user_name});
        const name = user_name ? user_name?.username : null;

        if (!poll_data) {
            return NextResponse.json({ error: "Poll not found" }, { status: 404 });
        }

        // console.log({api_poll_data : poll_data});
        return NextResponse.json({ data: poll_data , userName : name , status : 200 }, {status : 200 });

    } catch (error) {
        console.error("Error fetching poll by ID:", error);
        return NextResponse.json({ error: error}, { status: 500 });
    }
}