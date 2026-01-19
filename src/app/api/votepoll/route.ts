import { NextRequest, NextResponse } from "next/server";
import dbconnect from "@/lib/mongodb";
import {User , Vote , Poll} from "@/app/models/schema";

export async function POST(req: NextRequest) {
    try {
        await dbconnect();
        const body = await req.json();
        const {pollid, options_id , clerk_id} = body;

        const io = new Server(3001, {
            cors: { origin: "*" }
        });

        const user = await User.findOne({clerk_id : clerk_id});
        const user_id = user?._id;
        if(!user_id){
            return NextResponse.json({error : "User not found"} , {status: 404});
        }

        if(!pollid || !options_id){
            return NextResponse.json({error: "Missing required fields"} , {status: 400});
        }

        // Ensure options is an array
        if(!Array.isArray(options_id) || options_id.length === 0){
            return NextResponse.json({error: "Options must be a non-empty array"} , {status: 400});
        }

        const existingVote = await Vote.findOne({
            poll_id : pollid,
            user_id : user_id,
        });
        
        if(existingVote){
            return NextResponse.json({error : "You've already voted in this poll. No double voting allowed."} , {status: 409});
        }

        const poll = await Poll.findById(pollid);
        if(!poll){
            return NextResponse.json({error : "Poll not found"} , {status: 404});
        }

        // Check if poll has expired
        if(poll.expires_at && new Date() > new Date(poll.expires_at)){
            return NextResponse.json({error : "This poll has expired"} , {status: 403});
        }

        // Get all valid option IDs from the poll
        const validOptions = poll.options.map((opt: any) => opt._id.toString());
        
        // Check if all submitted options are valid
        const invalidOptions = options_id.filter((optionId: any) => 
            !validOptions.includes(optionId)
        );
        
        if(invalidOptions.length > 0){
            return NextResponse.json({
                error: "Invalid option provided",
                invalidOptions
            }, {status: 400});
        }

        // Check multi-select constraint
        if(!poll.multi_true && options_id.length > 1){
            return NextResponse.json({
                error: "This poll only allows single selection"
            }, {status: 400});
        }

        // Create vote records for each selected option
        const votePromises = options_id.map((optionId: any) => {
            return Vote.create({
                poll_id : pollid,
                user_id : user_id, // here we need the id
                option_id : optionId,
                voted_at : new Date()
            });
        });

        const createdVotes = await Promise.all(votePromises);

        const updatePromises = options_id.map((optionId: any) => {
            return Poll.updateOne(
                { 
                    _id: pollid, 
                    "options._id": optionId  // Find the specific option in the array
                },
                { 
                    $inc: { "options.$.votes_count": 1 }  // Increment by 1
                }
            );
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: "Vote recorded successfully",
            votesRecorded: createdVotes.length,
            optionsVoted: options_id
        }, {status: 200});

    } catch (err) {
        console.error("Error recording vote:", err);
        return NextResponse.json({
            error: "Internal server error while recording vote",
            details: err instanceof Error ? err.message : "Unknown error"
        }, {status: 500});
    }
}