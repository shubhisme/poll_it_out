import {auth,clerkClient} from "@clerk/nextjs/server"
import dbconnect from "@/lib/mongodb"
import User from "@/app/models/user"
import { NextResponse } from "next/server";

export async function POST() {

    try{
        const {userId} = await auth();
        if (!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        };

        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        const userdata = {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            authenticated:true,
            usrname : clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split("@")[0]
        }

        await dbconnect();
        const user = await User.findOneAndUpdate(
            {clerk_id: userdata.clerkId},
            {
                email: userdata.email,
                authenticated: userdata.authenticated,
                username: userdata.usrname,
                polls_created: [],
                polls_voted: []
            },
            {new:true, upsert: true}
        )

        console.log("DB Connected: ",userdata);

        return NextResponse.json(user , {status: 200})
    }catch(err){
        console.log(err);

        return NextResponse.json({eror: err} , {status: 500})
    }
}
