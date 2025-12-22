import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        await connectDB();

        // Get donations for this donor
        // Note: All donations include the 'image' field (may be null if no image was uploaded)
        // The image field is the SINGLE SOURCE OF TRUTH for donation images
        const donations = await Donation.find({ donorId: userId }).sort({ date: -1 });
        
        return NextResponse.json({
            success: true,
            donations: donations
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







