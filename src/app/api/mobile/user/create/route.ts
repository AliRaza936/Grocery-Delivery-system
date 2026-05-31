import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, image } = body;

    // 🔒 Basic validation
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and email are required",
        },
        { status: 400 }
      );
    }

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists with this email",
        },
        { status: 409 }
      );
    }

    // 👤 Create user
    const user = await User.create({
      name,
      email,
      image: image || "",
      role: "user", // default but explicit
      isOnline: false,
      socketId: null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `create user error: ${error}`,
      },
      { status: 500 }
    );
  }
}