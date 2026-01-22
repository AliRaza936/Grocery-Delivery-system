import dbConnect from "@/config/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await dbConnect()
        const groceries = await Grocery.find({})
        return NextResponse.json(groceries,{status:200})
    } catch (error) {
        return NextResponse.json({message:`Get groceries error ${error}`},{status:500})
        
    }
}