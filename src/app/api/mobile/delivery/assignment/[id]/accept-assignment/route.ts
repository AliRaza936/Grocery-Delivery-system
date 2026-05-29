import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import emitEventHandler from "@/config/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // ✅ Get assignment id from params
    const { id } = await context.params;

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

    // ✅ Find assignment
    const assignment = await DeliveryAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Assignment not found",
        },
        { status: 404 }
      );
    }

    // ✅ Check assignment status
    if (assignment.status !== "brodcasted") {
      return NextResponse.json(
        {
          success: false,
          message: "Assignment expired",
        },
        { status: 400 }
      );
    }

    // ✅ Check already assigned order
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        {
          success: false,
          message: "Already assigned to another order",
        },
        { status: 400 }
      );
    }

    // ✅ Update assignment
    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    await assignment.save();

    // ✅ Find order
    const order = await Order.findById(assignment.order);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    // ✅ Assign delivery boy to order
    order.assignedDeliveryBoy = deliveryBoyId;

    await order.save();

    // ✅ Populate delivery boy
    await order.populate("assignedDeliveryBoy");

    // ✅ Emit socket event
    await emitEventHandler("order-assigned", {
      orderId: order._id,
      assignedDeliveryBoy: order.assignedDeliveryBoy,
    });

    // ✅ Remove this delivery boy from other broadcasts
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "brodcasted",
      },
      {
        $pull: {
          broadcastedTo: deliveryBoyId,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Order accepted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Accept assignment error: ${error}`,
      },
      { status: 500 }
    );
  }
}