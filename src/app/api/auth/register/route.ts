import dbConnect from "@/config/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // check user exists
    let userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        { success: false, message: "email already exist" },
        { status: 400 }
      );
    }

    // password validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // hash password
    let hashedPassword = await bcrypt.hash(password, 10);

    // create user
    let user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🔐 CREATE TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.AUTH_SECRET as string,
      
    );

    return NextResponse.json(
      {
        success: true,
        message: "user created successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `register error ${error}` },
      { status: 500 }
    );
  }
}