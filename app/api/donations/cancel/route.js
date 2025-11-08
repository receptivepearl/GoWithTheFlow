import { NextResponse } from "next/server";
import Donation from "@/models/Donation";
import Organization from "@/models/Organization";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const { donationId } = await request.json();

        if (!donationId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Donation ID is required' 
            });
        }

        await connectDB();

        // Find the donation and verify it belongs to the user
        const donation = await Donation.findOne({ 
            _id: donationId, 
            donorId: userId 
        });

        if (!donation) {
            return NextResponse.json({
                success: false,
                message: 'Donation not found or unauthorized'
            });
        }

        // Check if donation can be cancelled (not already delivered or cancelled)
        if (donation.status === 'delivered') {
            return NextResponse.json({
                success: false,
                message: 'Cannot cancel a donation that has already been delivered'
            });
        }

        if (donation.status === 'cancelled') {
            return NextResponse.json({
                success: false,
                message: 'Donation is already cancelled'
            });
        }

        // Update donation status to cancelled
        donation.status = 'cancelled';
        await donation.save();

        // Update organization statistics (decrement counts)
        await Organization.findByIdAndUpdate(donation.organizationId, {
            $inc: { 
                totalOrders: -1, 
                totalProducts: -donation.totalItems 
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Donation commitment cancelled successfully',
            donation: donation
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}

