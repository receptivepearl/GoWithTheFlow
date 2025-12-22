import { NextResponse } from "next/server";
import Donation from "@/models/Donation";
import User from "@/models/User";
import Organization from "@/models/Organization";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Ensure the user is an admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Access Denied: Admin Only" }, { status: 403 });
        }

        // Get all donations
        // Note: All donations include the 'image' field (may be null if no image was uploaded)
        // The image field is the SINGLE SOURCE OF TRUTH for donation images
        const donations = await Donation.find()
            .populate({
                path: 'donorId',
                model: User,
                select: 'firstName lastName email'
            })
            .populate({
                path: 'organizationId',
                model: Organization,
                select: 'name address'
            })
            .sort({ date: -1 });

        return NextResponse.json({ success: true, donations });

    } catch (error) {
        console.error("Error fetching admin donations:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}




