import {User} from "@/app/models/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clerkId = request.nextUrl.searchParams.get("clerkId");

  try{
    if(!clerkId){
        return NextResponse.json({ error: "Clerk ID is required" }, { status: 400 });
    }

    const user = await User.findOne({clerk_id : clerkId}).select("_id");

    if(!user){
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: { _id: user._id } }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}