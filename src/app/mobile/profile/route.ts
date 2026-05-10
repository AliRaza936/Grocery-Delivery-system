import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/user.model";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // 🔐 verify user
    const userData = verifyToken(req);

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 👤 fetch user from DB
    const user = await User.findById(userData.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}