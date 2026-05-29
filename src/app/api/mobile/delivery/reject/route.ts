import { verifyToken } from "@/config/authCheck";
import dbConnect from "@/config/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // ✅ Get body data
    const { assignmentId } = await req.json();

    // ✅ Verify token
    const user = verifyToken(req);

    let userId = user?.id;

    // ✅ Optional fallback from query
    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("userId") || undefined;
    }

    // ✅ Unauthorized check
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: userId missing",
        },
        { status: 401 }
      );
    }

    // ✅ Validate assignment id
    if (!assignmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Assignment ID is required",
        },
        { status: 400 }
      );
    }

    // ✅ Reject assignment
    const assignment = await DeliveryAssignment.findByIdAndUpdate(
      assignmentId,
      {
        $addToSet: {
          rejectedBy: userId,
        },
      },
      { new: true }
    );

    // ✅ Assignment not found
    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Assignment not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Assignment rejected successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: `Error rejecting assignment: ${error}`,
      },
      { status: 500 }
    );
  }
}