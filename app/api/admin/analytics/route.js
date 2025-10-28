import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import Organization from "@/models/Organization";
import Donation from "@/models/Donation";
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

        // Get analytics data
        const totalUsers = await User.countDocuments();
        const totalOrganizations = await Organization.countDocuments();
        const verifiedOrganizations = await Organization.countDocuments({ verified: true });
        const totalDonations = await Donation.countDocuments();
        
        const totalProductsDonated = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalItems" }
                }
            }
        ]);

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const thisMonthDonations = await Donation.countDocuments({
            date: { $gte: thisMonth.getTime() }
        });

        const thisMonthProducts = await Donation.aggregate([
            {
                $match: {
                    date: { $gte: thisMonth.getTime() }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalItems" }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            analytics: {
                totalUsers,
                totalOrganizations,
                verifiedOrganizations,
                pendingOrganizations: totalOrganizations - verifiedOrganizations,
                totalDonations,
                totalProductsDonated: totalProductsDonated[0]?.total || 0,
                thisMonthDonations,
                thisMonthProducts: thisMonthProducts[0]?.total || 0
            }
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







