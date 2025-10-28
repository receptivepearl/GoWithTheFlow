import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Donation from "@/models/Donation";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        await connectDB();

        // Find the organization by userId
        const organization = await Organization.findById(userId);
        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found'
            });
        }

        // Get donations for this organization
        const donations = await Donation.find({ organizationId: userId }).sort({ date: -1 });
        
        return NextResponse.json({
            success: true,
            donations: donations,
            organization: organization
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);
        const { donationId, status, notes } = await request.json();

        await connectDB();

        // Verify the donation belongs to this organization
        const donation = await Donation.findOne({ 
            _id: donationId, 
            organizationId: userId 
        });

        if (!donation) {
            return NextResponse.json({
                success: false,
                message: 'Donation not found or unauthorized'
            });
        }

        // Update donation status
        donation.status = status;
        if (notes) donation.notes = notes;
        await donation.save();

        return NextResponse.json({
            success: true,
            message: 'Donation status updated successfully',
            donation: donation
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







