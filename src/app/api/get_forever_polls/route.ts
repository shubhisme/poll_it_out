import { NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import {Poll} from "@/app/models/schema";

export async function GET() {
    try{
        await dbconnect();

        const polls = await Poll.find({duration : "Forever" , is_active : true})
        
        return NextResponse.json({poll : polls} , {status : 200})

    }catch(err : unknown){
        console.log(err);
        const errorMessage = err instanceof Error ? err.message : "Failed to create poll";
        console.error("Error creating poll:", err);
        return NextResponse.json({error : errorMessage} , {status : 500})
    }
}