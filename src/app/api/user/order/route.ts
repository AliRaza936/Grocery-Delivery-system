import dbConnect from "@/config/db";
import emitEventHandler from "@/config/emitEventHandler";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const {userId,items,paymentMethod,totalAmount,address} = await req.json()
        if(!userId || !items || ! paymentMethod || !totalAmount || !address){
            return NextResponse.json({message:'please send all credentials'},{status:400})
        }
        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json({message:'user not found'},{status:400})

        }
        const newOrder = await Order.create({
            user:userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        await emitEventHandler('new-order',newOrder)
        
            return NextResponse.json({success:true,message:'Order created successfully',newOrder},{status:201})

    } catch (error) {
            return NextResponse.json({success:false,message:`place order error ${error}`},{status:500})
        
    }
    
}