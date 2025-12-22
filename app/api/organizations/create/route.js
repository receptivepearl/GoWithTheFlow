import { NextResponse } from "next/server";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { 
            name, 
            address, 
            phone, 
            email, 
            description, 
            website, 
            taxId, 
            contactPerson = '', // Default to empty string
            hours = '',         // Default to empty string
            productsNeeded = [],// <--- CRITICAL FIX: Default to empty array
            acceptedDonationTypes = [], // Accepted donation categories
            lat = 0,            // <--- CRITICAL FIX: Default to 0
            lng = 0             // <--- CRITICAL FIX: Default to 0
        } = await request.json();

        await connectDB();

        // Check if organization already exists
        const existingOrg = await Organization.findById(userId);
        
        console.log('Incoming Organization Data:', {
            name, 
            address, 
            phone, 
            email, 
            description, 
            website, 
            taxId, 
            contactPerson, 
            hours,
            productsNeeded,
            acceptedDonationTypes,
            lat,
            lng 
        });
        
        if (existingOrg) {
            return NextResponse.json({
                success: false,
                message: 'Organization already exists for this user'
            });
        }

        // Create organization
        const organization = new Organization({
            _id: userId,
            name: name,
            email: email,
            address: address,
            phone: phone || '',
            website: website || '',
            description: description,
            taxId: taxId || '',
            contactPerson: contactPerson || '',
            hours: hours || '',
            productsNeeded: productsNeeded || [],
            acceptedDonationTypes: acceptedDonationTypes || [], // Save accepted donation categories
            lat: lat || 0,
            lng: lng || 0,
            verified: true, // Organizations are auto-verified
            totalOrders: 0,
            totalProducts: 0,
            date: Date.now()
        });

        await organization.save();

        // Update user role to organization
        await User.findByIdAndUpdate(userId, {
            role: 'organization'
        });

        return NextResponse.json({
            success: true,
            message: 'Organization created successfully',
            organization: organization
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        });
    }
}







