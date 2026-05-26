import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model"; // ✅ IMPORTANT FIX
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = verifyToken(req);
    let userId = user?.id;

    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("userId") || undefined;
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: userId missing",
        },
        { status: 401 }
      );
    }

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: userId,
      status: "brodcasted",
      rejectedBy: { $ne: userId },
    })
      .populate("order")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        assignments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `get assignment error: ${error}`,
      },
      { status: 500 }
    );
  }
}