import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import {Poll , User} from "@/app/models/schema";

export async function GET(request : NextRequest){
    const {searchParams} = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if(!user_id){
        return NextResponse.json({error : "User ID is required"} , {status : 400})
    }

    try{
        await dbconnect();

        const user_obj_id = await User.findOne({clerk_id : user_id} , {_id : 1})
        if(!user_obj_id){
            return NextResponse.json({error : "User not found"} , {status : 404})
        }

        const polls = await Poll.find({created_by : user_obj_id._id})
        // console.log({POLL_DATA : polls})

        return NextResponse.json({poll_data : polls} , {status : 200})

    }catch(err : unknown){
        const errorMessage = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({error : errorMessage} , {status : 500})
    }
}