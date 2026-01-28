import dbConnect from "@/config/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await context.params;
console.log(slug)
    const product = await Grocery.find({
      slug:slug
    });
    

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `product with slug error ${error}` },
      { status: 500 }
    );
  }
}
