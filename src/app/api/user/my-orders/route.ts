import { auth } from "@/auth";
import dbConnect from "@/config/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await dbConnect()
        const session = await auth()
        const orders  =  await Order.find({user:session?.user?.id}).populate({
            path:'user assignedDeliveryBoy',
            select:'-password'
        }).sort({createdAt:-1})
        if(!orders){
            return NextResponse.json({success:false,message:"orders not found"},{status:400})
        }
                    return NextResponse.json({success:true,orders},{status:200})

    } catch (error) {
            return NextResponse.json({success:false,message:`get all orders error:${error}`},{status:500})
        
    }
}