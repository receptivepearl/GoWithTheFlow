import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Donation from "@/models/Donation";
import Organization from "@/models/Organization";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized'
            }, { status: 401 });
        }

        await connectDB();

        // Find the organization by userId
        const organization = await Organization.findById(userId);
        if (!organization) {
            return NextResponse.json({
                success: false,
                message: 'Organization not found'
            }, { status: 404 });
        }

        // Calculate real-time stats from donations
        const totalOrders = await Donation.countDocuments({ 
            organizationId: userId,
            status: { $ne: 'cancelled' }
        });

        const totalProducts = await Donation.aggregate([
            {
                $match: {
                    organizationId: userId,
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalItems" }
                }
            }
        ]);

        // Calculate this month's orders
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const thisMonthOrders = await Donation.countDocuments({
            organizationId: userId,
            date: { $gte: thisMonth.getTime() },
            status: { $ne: 'cancelled' }
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalOrders,
                totalProducts: totalProducts[0]?.total || 0,
                thisMonthOrders
            }
        });

    } catch (error) {
        console.error('Error fetching organization stats:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}

