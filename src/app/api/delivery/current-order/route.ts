import { auth } from "@/auth";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect()
        const session = await auth()
        const deliveryBoyId = session?.user?.id
        const activeAssingment = await DeliveryAssignment.findOne({
            assignedTo:deliveryBoyId,
            status:'assigned'

        }).populate({
            path:'order',
            populate:{path:"address"}
        }).lean()
        if(!activeAssingment){
            return NextResponse.json({active:false},{status:400})
        }
            return NextResponse.json({active:true,assignment:activeAssingment},{status:200})


    } catch (error) {
            return NextResponse.json({message:`current order error ${error}`},{status:400})
        
    }
}