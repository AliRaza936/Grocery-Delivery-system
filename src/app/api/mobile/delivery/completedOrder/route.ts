import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 🔐 verify user from token
    const user = verifyToken(req);
    let deliveryBoyId = user?.id;

    // fallback (optional)
    if (!deliveryBoyId) {
      const { searchParams } = new URL(req.url);
      deliveryBoyId = searchParams.get("userId") || undefined;
    }

    if (!deliveryBoyId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: deliveryBoyId missing",
        },
        { status: 401 }
      );
    }

    // 📦 fetch orders assigned to delivery boy
    const orders = await Order.find({
      assignedDeliveryBoy: deliveryBoyId,
      deliveryOtpVerification: true,
    })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("assignedDeliveryBoy");

    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `get delivery orders error: ${error.message || error}`,
      },
      { status: 500 }
    );
  }
}