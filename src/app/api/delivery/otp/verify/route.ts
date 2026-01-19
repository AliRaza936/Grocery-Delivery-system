import dbConnect from "@/config/db";
import emitEventHandler from "@/config/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const {orderId,otp} = await req.json()
 
        if(!orderId || !otp){
            return NextResponse.json({message:'OrderId or otp not found'},{status:400})
        }
         const order = await Order.findById(orderId).populate({
                    path:'user',
                    select:"-password"
                })
                if(!order){
                    return NextResponse.json({message:"order not found"},{status:400})
                }

                if(order.deliveryOtp !==otp){
                    return NextResponse.json({message:"Invalid or expired otp"},{status:400})
                }
                order.status = 'delivered'
                order.deliveryOtpVerification = true
                order.deliveredAt = new Date()
                await order.save()
                                await emitEventHandler('order-status-update',{orderId:order._id,status:order.status})
                

                await DeliveryAssignment.updateOne(
                    {order:orderId},
                    {$set:{assignedTo:null,status:"completed"}}
                )

            return NextResponse.json({message:"delivery successfully completed"},{status:200})

    } catch (error) {
            return NextResponse.json({message:`verify otp error ${error}`},{status:500})
        
    }
    
}