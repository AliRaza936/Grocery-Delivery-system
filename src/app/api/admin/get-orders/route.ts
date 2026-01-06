import dbConnect from "@/config/db";
import { IOrderPopulated } from "@/config/populateOrder";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();

    const orders: IOrderPopulated[] = await Order.find()
      .populate({ path: "user", select: "-password" })
      .populate({ path: "assignedDeliveryBoy", select: "-password" })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get order error: ${error}` },
      { status: 500 }
    );
  }
}
