import { auth } from "@/auth";

import dbConnect from "@/config/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
try {
    await dbConnect()
    let session = await auth()
    if (session?.user?.role !== "admin") {
        return NextResponse.json({message:"You are not admin"}, {status:400})
    }
const {groceryId} = await req.json()
            const grocery = await Grocery.findByIdAndDelete(groceryId)
            return NextResponse.json(grocery,{status:201});

} catch (error) {
    return NextResponse.json({message:"Internal server error",error},{status:500} )
}
}