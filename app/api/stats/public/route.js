import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import Organization from "@/models/Organization";
import Donation from "@/models/Donation";

export async function GET(request) {
    try {
        await connectDB();

        // Get public stats (no auth required)
        const totalUsers = await User.countDocuments({ role: 'donor' });
        const totalOrganizations = await Organization.countDocuments({ verified: true });
        const totalDonations = await Donation.countDocuments({ status: { $ne: 'cancelled' } });
        
        const totalProductsDonated = await Donation.aggregate([
            {
                $match: {
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

        // Get unique cities from organizations that received donations
        // Get all non-cancelled donations and extract unique organization IDs
        const donations = await Donation.find({ 
            status: { $ne: 'cancelled' } 
        }).select('organizationId').lean();

        // Get unique organization IDs from donations
        const uniqueOrgIds = [...new Set(donations.map(d => d.organizationId))];

        // Get organizations that received donations
        const organizations = await Organization.find({
            _id: { $in: uniqueOrgIds }
        }).select('address').lean();

        // Extract cities from addresses of organizations that received donations
        const uniqueCities = new Set();
        organizations.forEach(org => {
            const address = org.address;
            if (address) {
                // Normalize address: replace newlines with commas, remove extra whitespace
                const normalizedAddress = address.replace(/\n/g, ',').replace(/\s+/g, ' ').trim();
                
                // Extract city from address (handle various address formats)
                // Common formats: "123 Main St, City, State ZIP" or "City, State" or "Street, City, State, ZIP"
                const parts = normalizedAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
                
                if (parts.length >= 2) {
                    // For addresses like "Street, City, State ZIP" or "Street, City, State, ZIP"
                    // City is usually the second-to-last part (before state)
                    // For "City, State", city is the first part
                    let city;
                    if (parts.length === 2) {
                        // Format: "City, State" or "Street, City State"
                        // Try to detect if first part looks like a street (contains numbers or common street terms)
                        const firstPart = parts[0].toLowerCase();
                        if (firstPart.match(/\d/) || firstPart.match(/\b(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court)\b/)) {
                            // First part is street, second part might be "City State" or just state
                            // Try to split by space to get city and state
                            const secondParts = parts[1].split(/\s+/);
                            if (secondParts.length >= 2) {
                                // Assume everything except last part is city (last part is state)
                                city = secondParts.slice(0, -1).join(' ');
                            } else {
                                // Can't determine, use second part as city
                                city = parts[1];
                            }
                        } else {
                            // First part is likely the city
                            city = parts[0];
                        }
                    } else {
                        // Format: "Street, City, State ZIP" - city is second-to-last
                        city = parts[parts.length - 2];
                    }
                    
                    if (city && city.length > 0) {
                        // Remove any trailing state abbreviations or ZIP codes that might be in the city field
                        city = city.replace(/\s+\d{5}(-\d{4})?$/, '').trim(); // Remove ZIP
                        city = city.replace(/\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/i, '').trim(); // Remove state
                        if (city.length > 0) {
                            uniqueCities.add(city);
                        }
                    }
                } else if (parts.length === 1) {
                    // Single part - might be just city name or a full address without commas
                    // Try to extract city by removing common address parts
                    let city = parts[0];
                    // Remove ZIP codes
                    city = city.replace(/\s+\d{5}(-\d{4})?$/, '').trim();
                    // Remove state abbreviations
                    city = city.replace(/\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)$/i, '').trim();
                    
                    // If it looks like a street address (contains numbers), skip it
                    // Otherwise, assume it's a city name
                    if (!city.match(/^\d+/) && city.length > 0) {
                        uniqueCities.add(city);
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                totalOrganizations,
                totalDonations,
                totalProductsDonated: totalProductsDonated[0]?.total || 0,
                totalCities: uniqueCities.size || 0
            }
        });

    } catch (error) {
        console.error('Error fetching public stats:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
}

