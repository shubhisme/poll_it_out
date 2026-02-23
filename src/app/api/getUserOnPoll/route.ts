import { NextRequest , NextResponse } from "next/server";
import {Vote} from "@/app/models/schema"
import dbconnect from "@/lib/mongodb"

export async function POST(req : NextRequest){
    try {
        await dbconnect();

        const {pollid} = await req.json();

        if(!pollid){return NextResponse.json({error : "Invalid pollid"} , {status : 400})}

        const users = await Vote.distinct("user_id" , {poll_id : pollid});

        if(!users){
            return NextResponse.json({error : "No users found"} , {status : 404});
        }

        console.log({users : users});

        return NextResponse.json({data : users.length} , {status : 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({error : "Internal server error"} , {status : 500});
    }
}