import dbconnect from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {User , Poll } from "@/app/models/schema";
import { redirect } from "next/navigation";
import type Poll_data from "@/app/types/Poll_types";

function duration_convert(dur : string){
    switch (dur) {
    case "5 minutes": return 5 * 60 * 1000;
    case "10 minutes": return 10 * 60 * 1000;
    case "1 hour": return 60 * 60 * 1000;
    case "3 hours": return 3 * 60 * 60 * 1000;
    case "Forever": return null;
    default: return null;
  }
}

export async function POST(req: Request) {
    // parse and type the request body
    const body = (await req.json()) as Poll_data;
    console.log("Received poll creation request:", body.question);
  try {
    await dbconnect();

    const { userId } = await auth();
    console.log("Authenticated user ID:", userId);
    if (!userId) {
        console.log(userId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_obj = await User.findOne({clerk_id: userId});
    if(!user_obj) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { question, description, options, duration, multi_true} = body;
    const rawOptions = Array.isArray(body.options)
      ? body.options
      : [];
    
    if(options.length < 2 || options.length > 10){
        return NextResponse.json({ error: "Options must be between 2 and 10" }, { status: 400 });
    }

    if(!question){
        return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const formatted_op = options.map((opt : string)=> ({text: opt.trim()}));

    const shareable_code = Math.floor(Math.random() * 90000) + 10000;

    const durationMs = duration_convert(duration);
    const expAt = durationMs ? new Date(Date.now() + durationMs) : null;
    console.log({expiry_date : expAt});

    const pollCreated = await Poll.create({
      question: (question ?? "").toString().trim(),
      description: (description ?? "").toString(),
      created_by: user_obj._id,
      is_active: true,
      qr: "",
      share_code: shareable_code,
      multi_true: multi_true,
      duration: duration,
      options: formatted_op,
      expires_at : expAt    
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host")}`;
    const pollUrl = `${baseUrl}/dashboard/poll/${pollCreated._id}`;
        
        // Generate QR Data URL
        const QrCode = (await import("qrcode")).default;
        const qrDataUrl = await QrCode.toDataURL(pollUrl);
        pollCreated.qr = qrDataUrl;
    
    await pollCreated.save();

    return NextResponse.json({ data: pollCreated }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating poll:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
