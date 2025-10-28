import { NextResponse } from "next/server";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { clerkId, email, firstName, lastName, role } = await request.json();

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findById(userId);
        if (existingUser) {
            return NextResponse.json({
                success: true,
                user: existingUser
            });
        }

        // Create new user
        const user = new User({
            _id: userId,
            clerkId: clerkId,
            name: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role || 'donor',
            imageUrl: '',
            cartItems: {},
            date: Date.now()
        });

        await user.save();

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user: user
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







