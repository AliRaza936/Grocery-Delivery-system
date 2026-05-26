import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Get user from JWT token
    const user = verifyToken(req);
    let userId = user?.id;

    // 2. Fallback for mobile apps using query params
    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("userId") || undefined;
    }

    // 3. Unauthorized check
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: userId missing",
        },
        { status: 401 }
      );
    }

    // 4. Fetch delivery assignments
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: userId,
      status: "brodcasted",
      rejectedBy: { $ne: userId },
    })
      .populate("order")
      .sort({ createdAt: -1 });

    // 5. Return response
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