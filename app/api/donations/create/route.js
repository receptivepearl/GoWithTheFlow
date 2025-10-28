import { NextResponse } from "next/server";
import Donation from "@/models/Donation";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { inngest } from "@/config/inngest";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { organizationId, organizationName, items, totalItems, donorName, donorEmail } = await request.json();

        if (!organizationId || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid donation data' });
        }

        await connectDB();

        // Create donation record
        const donation = new Donation({
            donorId: userId,
            organizationId: organizationId,
            items: items,
            totalItems: totalItems,
            donorName: donorName,
            donorEmail: donorEmail,
            organizationName: organizationName,
            status: 'pending',
            date: Date.now()
        });

        await donation.save();

        // Update organization statistics
        await Organization.findByIdAndUpdate(organizationId, {
            $inc: { 
                totalOrders: 1, 
                totalProducts: totalItems 
            }
        });

        // Send Inngest event for donation processing
        await inngest.send({
            name: 'donation/created',
            data: {
                donationId: donation._id,
                donorId: userId,
                organizationId: organizationId,
                totalItems: totalItems,
                status: 'pending',
                date: Date.now()
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Donation commitment created successfully',
            donation: donation
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}







