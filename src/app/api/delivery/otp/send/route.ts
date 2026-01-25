import dbConnect from "@/config/db";
import emitEventHandler from "@/config/emitEventHandler";
import { sendMail } from "@/config/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const {orderId} = await req.json()
        const order = await Order.findById(orderId).populate({
            path:'user',
            select:"-password"
        })
        if(!order){
            return NextResponse.json({message:"order not found"},{status:400})
        }
        const otp = Math.floor(1000+Math.random()*9000).toString()

        order.deliveryOtp = otp
        await emitEventHandler("order-otp", {
      orderId: order._id,
      otp,
    });
        await order.save()

        await sendMail(
            order.user.email,
            "Your Delivery OTP",
              `
  <div style="font-family: Arial, sans-serif">
    <h2>Grocify Delivery Verification</h2>
    <p>Your delivery OTP is:</p>
    <h1 style="letter-spacing: 4px">${otp}</h1>
    
  </div>
  `
        
        )

            return NextResponse.json({message:"otp send successfully"},{status:200})

    } catch (error) {
            return NextResponse.json({message:`send otp error ${error}`},{status:500})
        
    }
    
}