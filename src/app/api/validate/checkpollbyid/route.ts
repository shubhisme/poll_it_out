import { Poll } from "@/app/models/schema";
import dbconnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbconnect();
        const body = await request.json();
        const pollid = body.pollid;

        if (!pollid) {
            return NextResponse.json({ error: "Poll ID is required" }, { status: 400 });
        }

        const poll_data = await Poll.findById(pollid);

        if (!poll_data) {
            return NextResponse.json({ error: "Poll not found" }, { status: 404 });
        }

        console.log({api_poll_data : poll_data});
        return NextResponse.json({ data: poll_data }, { status: 200 });
    } catch (error) {
        console.error("Error fetching poll by ID:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}