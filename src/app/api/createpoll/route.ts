import Poll from "@/app/models/poll";
import Options from "@/app/models/options";
import dbconnect from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/app/models/user";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
        console.log(userId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // await dbconnect();
    const user_objId = await User.findOne({clerk_id: userId})

    const body = await req.json();
    const { question, multi_true, text } = body;

    // generate 4-digit code
    const shareable_code = Math.floor(Math.random() * 9000) + 1000;

    // create poll first
    const pollCreated = await Poll.create({
      question,
      created_by: user_objId._id,
      is_active: true,
      share_code: shareable_code,
      multi_true,
      duration: "1",
      options: [] // initialize empty
    });

    const createdOptions = await Promise.all(
        text.map(async (optionText: string) => {
            const optn = await Options.create({
                poll_id: pollCreated._id,
                text: optionText
            });
        return optn._id;
        })
    );

    // update poll with option ids
    pollCreated.options.push(...createdOptions);

    // update polls_created in User collection
    const upd_usr = await User.findOneAndUpdate(
        {_id : user_objId}, 
        {$addToSet : {polls_created : pollCreated._id}},
        {new: true}
    )
    
    await pollCreated.save();

    return NextResponse.json(pollCreated, { status: 201 });
  } catch (err: any) {
    console.error("Error creating poll:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
