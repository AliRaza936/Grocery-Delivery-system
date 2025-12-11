import dbConnect from "@/config/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req:NextRequest){
    try {
    await dbConnect()
    const {name,email,password} = await req.json()

    let userExist = await User.findOne({email})
    if(userExist){
        return NextResponse.json({success:false,message:"email already exist"},{status:400})
    }
    if(password.length < 6){
        return NextResponse.json({success:false,message:"password must be at least 6 characters"},{status:400})
    }
    let hashedPassword = await bcrypt.hash(password,10)
    let user = await User.create({name,email,password:hashedPassword})

        return NextResponse.json({success:true,message:"user created successfully",user},{status:200})

    }
catch (error) {
        return NextResponse.json({success:false,message:`register error ${error}`},{status:500})
    
}
}