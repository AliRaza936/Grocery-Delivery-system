import { auth } from "@/auth";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { assignmentId } = await req.json();
    const session = await auth(); 
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await DeliveryAssignment.findByIdAndUpdate(assignmentId, {
        $addToSet: { rejectedBy: userId }
    });

    return NextResponse.json({ message: "Assignment rejected successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error rejecting assignment", error }, { status: 500 });
  }
}
