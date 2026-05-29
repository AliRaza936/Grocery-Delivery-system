import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // ✅ Verify token
    const user = verifyToken(req);

    let deliveryBoyId = user?.id;

    // ✅ Optional fallback from query
    if (!deliveryBoyId) {
      const { searchParams } = new URL(req.url);
      deliveryBoyId = searchParams.get("userId") || undefined;
    }

    if (!deliveryBoyId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: userId missing",
        },
        { status: 401 }
      );
    }

    // ✅ Find active assignment
    const activeAssignment = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: "assigned",
    })
      .populate({
        path: "order",
        populate: {
          path: "address",
        },
      })
      .lean();

    if (!activeAssignment) {
      return NextResponse.json(
        {
          success: true,
          active: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        active: true,
        assignment: activeAssignment,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Current order error: ${error}`,
      },
      { status: 500 }
    );
  }
}