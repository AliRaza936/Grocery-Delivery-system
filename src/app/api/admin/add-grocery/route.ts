import { auth } from "@/auth";
import uploadOnCloudunary from "@/config/cloudinary";
import dbConnect from "@/config/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
try {
    await dbConnect()
    let session = await auth()
    if (session?.user?.role !== "admin") {
        return NextResponse.json({message:"You are not admin"}, {status:400})
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;
    const unit = formData.get("unit") as string;
    let imageUrl

    if(file){
        imageUrl =  await uploadOnCloudunary(file);
            }
            const grocery = await Grocery.create({
                name,
                category,
                price,
                unit,
                image:imageUrl,
            })
            return NextResponse.json({grocery},{status:201});

} catch (error) {
    return NextResponse.json({message:"Internal server error",error},{status:500} )
}
}