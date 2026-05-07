import dbConnect from "@/config/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    let filter: any = {};

    // 🔍 SEARCH FILTER
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    // 📦 CATEGORY FILTER (optional)
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const groceries = await Grocery.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: groceries.length,
        data: groceries,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Mobile grocery API error: ${error}`,
      },
      { status: 500 }
    );
  }
}