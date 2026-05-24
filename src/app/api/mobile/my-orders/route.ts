import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Try to get userId from JWT
    const user = verifyToken(req);
    let userId = user?.id;

    // 2. Fallback: get from query params (mobile apps sometimes use this)
    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("userId") || undefined;
    }

    // 3. If still no userId → reject
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: userId missing" },
        { status: 401 }
      );
    }

    // 4. Fetch orders
    const orders = await Order.find({ user: userId })
      .populate({
        path: "user assignedDeliveryBoy",
        select: "-password",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `get orders error: ${error}` },
      { status: 500 }
    );
  }
}