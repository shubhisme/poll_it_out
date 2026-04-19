import {Poll} from '@/app/models/schema';
import dbconnect from "@/lib/mongodb"
import {NextResponse} from 'next/server';

type Params = Promise<{ code: string }>;

export async function GET(req: Request,
  { params }: { params: Params }
){
    const {code} = await params;

    if(!code) return NextResponse.json({success: false, message: "Poll code is required"}, {status: 400});

    try{
        await dbconnect();

        const poll = await Poll.findOne({share_code : code}).select("_id");
        if(!poll) return NextResponse.json({success: false, message: "Poll not found"}, {status: 404});

        return NextResponse.json({success: true, pollId: poll._id}, {status: 200});

    }catch(err : unknown){
        const errorMessage = err instanceof Error ? err.message : "Error fetching poll";
        return NextResponse.json({success: false, message: errorMessage}, {status: 500});
    }
}