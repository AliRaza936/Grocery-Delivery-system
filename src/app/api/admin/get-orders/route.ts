import dbConnect from "@/config/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await dbConnect()
        const orders = await Order.find({}).populate({
            path:'user assignedDeliveryBoy',
            select:"-password"
        }).sort({createdAt:-1})
        return NextResponse.json(orders,{status:200})
    } catch (error) {
        return NextResponse.json({message:`get order error: ${error}`},{status:500})
        
    }
    
}