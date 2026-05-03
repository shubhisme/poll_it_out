import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import { Poll, Vote, Chat, User } from "@/app/models/schema";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {
  await dbconnect();

  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pollId } = await req.json();

  if (!mongoose.Types.ObjectId.isValid(pollId)) {
    return NextResponse.json({ error: "Invalid pollId" }, { status: 400 });
  }

  // map Clerk → Mongo user
  const user = await User.findOne({ clerk_id: userId });
  if (!user){
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete poll with ownership check
    const deletedPoll = await Poll.findOneAndDelete({
      _id: pollId,
      created_by: user._id,
    }).session(session);

    if (!deletedPoll) {
      await session.abortTransaction();
      return NextResponse.json(
        { error: "Poll not found or unauthorized" },
        { status: 404 }
      );
    }

    // delete dependent data
    await Promise.all([
      Vote.deleteMany({ poll_id: pollId }).session(session),
      Chat.deleteMany({ poll_id: pollId }).session(session),
    ]);

    await session.commitTransaction();

    return NextResponse.json(
      { message: "Poll deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}