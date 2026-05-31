import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/user.model";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, image } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }

    // check existing user
    let user = await User.findOne({ email });

    // 👇 if user doesn't exist, create it
    if (!user) {
      user = await User.create({
        name,
        email,
        image: image || "",
        
      });
    }

    // 🔐 CREATE JWT TOKEN
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in env");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET
    );

    return NextResponse.json(
      {
        success: true,
        message: "User authenticated successfully",
        user,
        token, // ✅ send token
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `auth error: ${error}`,
      },
      { status: 500 }
    );
  }
}