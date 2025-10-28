import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        await connectDB();

        // Check if user is admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized - Admin access required'
            });
        }

        const organizations = await Organization.find().sort({ date: -1 });
        
        return NextResponse.json({
            success: true,
            organizations: organizations
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
        const { organizationId, verified } = await request.json();

        await connectDB();

        // Check if user is admin
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized - Admin access required'
            });
        }

        const organization = await Organization.findByIdAndUpdate(
            organizationId,
            { verified: verified },
            { new: true }
        );

        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found'
            });
        }

        return NextResponse.json({
            success: true,
            message: `Organization ${verified ? 'verified' : 'unverified'} successfully`,
            organization: organization
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







