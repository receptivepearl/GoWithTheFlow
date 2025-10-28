import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        await connectDB();

        const organization = await Organization.findById(userId);
        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found'
            });
        }

        return NextResponse.json({
            success: true,
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
        const updateData = await request.json();

        await connectDB();

        const organization = await Organization.findByIdAndUpdate(
            userId,
            updateData,
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
            message: 'Organization updated successfully',
            organization: organization
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







