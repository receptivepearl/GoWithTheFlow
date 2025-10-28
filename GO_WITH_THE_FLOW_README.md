# Go with the Flow - Period Product Donation Platform

## Overview

Go with the Flow is a sophisticated platform that connects compassionate donors with organizations serving women in need, specifically focusing on menstrual product donations to combat period poverty.

## Features

### 🏠 Landing Page
- **Mission-focused design** with gradient backgrounds and modern UI
- **Account type selection** for donors and organizations
- **Statistics display** showing platform impact
- **Responsive design** for all devices

### 👤 User Dashboard
- **Location-based organization discovery** - finds nearest 10 organizations
- **Verification system** - shows verified organizations with checkmarks
- **Interactive organization cards** with detailed information
- **About tab** explaining the platform's mission
- **Real-time location services** integration

### 🏢 Organization Dashboard
- **Order management system** with status tracking
- **Analytics dashboard** showing donation statistics
- **Impact metrics** including total orders and products received
- **Order status updates** (pending, in transit, completed)
- **About tab** with organization-specific information

### 👨‍💼 Administrator Dashboard
- **Organization approval system** for new registrations
- **Platform analytics** including user counts and donation metrics
- **Organization management** with verification status
- **Pending approval workflow** with approve/reject functionality

### 📦 Order Placement System
- **Product selection interface** for various menstrual products
- **Quantity management** with add/remove functionality
- **Description fields** for specific donation details
- **Order summary** with total item counts
- **Integration with organization data**

## Technical Implementation

### Location Services Integration

The platform includes a comprehensive location service system:

#### Location Service (`lib/locationService.js`)
```javascript
// Key functions:
- getCurrentLocation() // Gets user's GPS coordinates
- calculateDistance() // Haversine formula for distance calculation
- findNearestOrganizations() // Finds closest organizations
- geocodeAddress() // Converts addresses to coordinates
- reverseGeocode() // Converts coordinates to addresses
```

#### API Endpoint (`/api/organizations/nearby`)
- **GET/POST support** for flexible usage
- **Distance-based filtering** with configurable radius
- **Verification filtering** for verified organizations only
- **Coordinate validation** with error handling
- **Haversine distance calculation** for accurate results

### Maps API Integration

To integrate with real mapping services, you'll need to:

#### 1. Google Maps Integration
```javascript
// Add to your environment variables:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

// The Google Maps API is already integrated in the app:
// - Google Maps JavaScript API is loaded in layout.js
// - Location service uses the API key for geocoding and places
// - Distance Matrix API is used for accurate distance calculations
```

#### 2. Mapbox Integration
```javascript
// Add to your environment variables:
MAPBOX_ACCESS_TOKEN=your_access_token_here

// Update locationService.js for Mapbox geocoding:
const response = await fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
);
```

#### 3. Leaflet/OpenStreetMap Integration
```javascript
// For client-side mapping, add Leaflet:
npm install leaflet react-leaflet

// Create a map component:
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
```

### Database Integration

The current implementation uses mock data. To connect to a real database:

#### MongoDB Integration (Current Setup)
```javascript
// Update models/Organization.js:
const organizationSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  verified: Boolean,
  // ... other fields
});

// Update API routes to use MongoDB:
import Organization from '@/models/Organization';
const organizations = await Organization.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [lng, lat] },
      $maxDistance: radius * 1609.34 // Convert miles to meters
    }
  }
});
```

#### PostgreSQL with PostGIS
```sql
-- For advanced geographic queries:
SELECT *, ST_Distance(
  location::geography,
  ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
) as distance
FROM organizations
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
  $3 * 1609.34
)
ORDER BY distance
LIMIT $4;
```

## Backend API Endpoints

### Organizations
- `GET /api/organizations/nearby` - Find organizations near coordinates
- `POST /api/organizations/nearby` - Alternative POST method
- `GET /api/organizations` - List all organizations
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Orders
- `GET /api/orders` - List orders for organization
- `POST /api/orders` - Create new donation order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Admin
- `GET /api/admin/organizations/pending` - Get pending approvals
- `POST /api/admin/organizations/:id/approve` - Approve organization
- `POST /api/admin/organizations/:id/reject` - Reject organization
- `GET /api/admin/analytics` - Get platform statistics

## Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/go-with-the-flow

# Maps API (choose one)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Optional: Email service
SENDGRID_API_KEY=your_sendgrid_key
```

## Deployment Considerations

### Production Setup
1. **Environment Variables**: Set all required API keys
2. **Database**: Configure production MongoDB/PostgreSQL
3. **Maps API**: Enable billing and set usage limits
4. **Security**: Implement rate limiting and input validation
5. **Monitoring**: Set up error tracking and analytics

### Performance Optimization
1. **Caching**: Implement Redis for location queries
2. **CDN**: Use CloudFront for static assets
3. **Database Indexing**: Create spatial indexes for location queries
4. **Image Optimization**: Optimize organization logos and images

## Future Enhancements

### Planned Features
- **Real-time notifications** for new orders
- **Donation tracking** with delivery confirmations
- **Impact stories** from organizations
- **Mobile app** development
- **Multi-language support**
- **Advanced analytics** dashboard
- **Automated email campaigns**
- **Integration with social media**

### Technical Improvements
- **Progressive Web App** (PWA) capabilities
- **Offline support** for organization listings
- **Advanced search filters** (organization type, hours, etc.)
- **Bulk donation** capabilities
- **Recurring donation** scheduling
- **Integration with payment processors**

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up environment variables**
4. **Configure database connection**
5. **Set up maps API credentials**
6. **Run development server**: `npm run dev`

## Support

For technical support or questions about the implementation, please refer to the codebase documentation or create an issue in the repository.

---

**Go with the Flow** - Making period poverty history, one donation at a time.













