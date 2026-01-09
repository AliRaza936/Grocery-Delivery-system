import dbConnect from "@/config/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, context:{params:Promise<{orderId:string}>}) {
    try {
        await dbConnect()
        const orderId = await context.params
        const order = await Order.findById(orderId).populate({
            path:'assignedDeliveryBoy',

        })
            if(!order){
                return NextResponse.json({message:'order not found'},{status:400})
            }
                return NextResponse.json(order,{status:200})

    } catch (error) {
                return NextResponse.json({message:`order fetching error ${error}`},{status:500})
        
    }
}