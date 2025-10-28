// src/app/api/organizations/nearby/route.js

import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Organization from "@/models/Organization";
import { locationService } from "@/lib/locationService";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get('lat'));
        const lng = parseFloat(searchParams.get('lng'));
        const query = searchParams.get('query') || '';
        // FIX: Ensure verifiedOnly is checked as boolean
        const verifiedOnly = searchParams.get('verifiedOnly') === 'true'; 
        const radius = parseInt(searchParams.get('radius')) || 50000;

        if (!lat || !lng) {
            return NextResponse.json({
                success: false,
                message: "Latitude and longitude are required"
            }, { status: 400 });
        }

        await connectDB();

        // 1. FIX: Update MongoDB Query to conditionally filter by 'verified'
        const mongoQuery = {
            lat: { $exists: true, $ne: null },
            lng: { $exists: true, $ne: null }
        };
        if (verifiedOnly) {
            mongoQuery.verified = true;
        }
        
        const mongoOrganizations = await Organization.find(mongoQuery);

        let allOrganizations = [];
        let googlePlaces = [];

        // 2. INTEGRATION: If not 'verifiedOnly', fetch Google Places
        if (!verifiedOnly) {
            try {
                // Search for nearby places, using the user's query if provided
                const nearbyPlaces = await locationService.searchNearbyPlaces(
                    { lat, lng }, 
                    query, 
                    radius
                );

                // Fetch details and format (limit to 15 to reduce load)
                const placePromises = nearbyPlaces.slice(0, 15).map(async (place) => {
                    try {
                        const details = await locationService.getPlaceDetails(place.place_id);
                        return locationService.formatPlaceData(details);
                    } catch (error) {
                        return locationService.formatPlaceData(place);
                    }
                });

                googlePlaces = await Promise.all(placePromises);
                
            } catch (error) {
                console.error('Error fetching Google Places:', error);
            }
        }

        // Format MongoDB organizations (Ensure lat/lng and photoUrl are included)
        const mongoFormatted = mongoOrganizations.map(org => ({
            id: org._id.toString(), 
            name: org.name,
            address: org.address,
            lat: org.lat, // CRITICAL: Needed for distance calculation
            lng: org.lng, // CRITICAL: Needed for distance calculation
            description: org.description,
            photoUrl: org.imageUrl, // Ensure property name matches page.jsx
            verified: org.verified,
            isGooglePlace: false, 
            rating: 0, 
            userRatingsTotal: 0,
            types: ['Registered Organization']
        }));

        // Combine all organizations
        allOrganizations = [...mongoFormatted, ...googlePlaces];

        // 3. DISTANCE CALCULATION: Apply distances and sort
        if (allOrganizations.length > 0) {
            try {
                // Create destinations list from organizations with valid coordinates
                const destinations = allOrganizations
                    .filter(org => org.lat && org.lng)
                    .map(org => ({ lat: org.lat, lng: org.lng }));

                if (destinations.length > 0) {
                    const distances = await locationService.calculateDistances(
                        { lat, lng },
                        destinations
                    );

                    // Re-apply distance information to the original array
                    let distanceIndex = 0;
                    allOrganizations = allOrganizations.map(org => {
                        // Only organizations with valid coordinates were in the destinations array
                        if (org.lat && org.lng) {
                            const distanceInfo = distances[distanceIndex];
                            distanceIndex++;
                            return {
                                ...org,
                                // FIX: Ensure we use 'text' and 'value' fields from the Distance Matrix API
                                distance: distanceInfo?.distance?.text || 'Unknown distance',
                                distanceValue: distanceInfo?.distance?.value || Infinity,
                                duration: distanceInfo?.duration?.text || 'Unknown duration'
                            };
                        }
                        return org;
                    });
                }

                // Sort by distance (closest first)
                allOrganizations.sort((a, b) => {
                    const distanceA = a.distanceValue || Infinity;
                    const distanceB = b.distanceValue || Infinity;
                    return distanceA - distanceB;
                });
                
            } catch (error) {
                console.error('Error calculating distances:', error);
            }
        }

        // Limit to 15 results (after sorting)
        allOrganizations = allOrganizations.slice(0, 15);

        return NextResponse.json({
            success: true,
            organizations: allOrganizations,
            count: allOrganizations.length
        });

    } catch (error) {
        console.error('Error in nearby organizations API:', error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}


