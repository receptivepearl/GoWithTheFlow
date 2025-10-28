import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Organization from '@/models/Organization';

export async function GET() {
    try {
        await connectDB();
        
        const organizations = await Organization.find({ verified: true }).sort({ date: -1 });
        
        return NextResponse.json({
            success: true,
            organizations: organizations
        });

    } catch (error) {
        console.error('Error fetching organizations:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}




