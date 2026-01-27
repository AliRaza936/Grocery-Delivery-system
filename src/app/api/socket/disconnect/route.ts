import dbConnect from "@/config/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { socketId } = await req.json();

    await User.findOneAndUpdate(
      { socketId },
      {
        $unset: { socketId: "" },
        isOnline: false,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
