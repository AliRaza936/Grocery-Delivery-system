import { auth } from "@/auth";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect()
        const session = await auth()
        const assignments = await DeliveryAssignment.find({
                broadcastedTo:session?.user?.id,
                status:'brodcasted'
        }).populate('order').sort({createdAt:-1})
        return NextResponse.json(assignments,{status:200})
    } catch (error) {
        return NextResponse.json({message:`get assignment error ${error}`},{status:500})
        
    }
}