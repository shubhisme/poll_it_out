import {auth,clerkClient} from "@clerk/nextjs/server"
import dbconnect from "@/lib/mongodb"
import {User} from "@/app/models/schema"
import { NextResponse } from "next/server";

export async function POST() {

    try{
        await dbconnect();
        const {userId} = await auth();
        if (!userId){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        };

        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        const userdata = {
            clerk_id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            authenticated:true,
            username : clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split("@")[0]
        }

        const user = await User.findOneAndUpdate(
            {clerk_id: userdata.clerk_id},
            {
                email: userdata.email,
                authenticated: userdata.authenticated,
                username: userdata.username,
            },
            {new:true, upsert: true}
        )

        console.log("DB Connected: ",userdata);

        return NextResponse.json( {data: user} , {status: 200})
    }catch(err){
        console.log(err);

        return NextResponse.json({eror: err} , {status: 500})
    }
}
