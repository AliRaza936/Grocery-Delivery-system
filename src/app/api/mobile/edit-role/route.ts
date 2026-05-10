import dbConnect from "@/config/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/config/authCheck";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // 🔐 verify token
    const userData = verifyToken(req);

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role, mobile } = await req.json();

    // 👤 update using EMAIL from token
    const updatedUser = await User.findOneAndUpdate(
      { email: userData.email },
      { role, mobile },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Update failed ${error}` },
      { status: 500 }
    );
  }
}