# Compliance API Documentation

## Overview

SportPredict Platform implements a complete legal compliance design, including geographic location detection and identity verification systems. The system confirms whether users have permission to use products based on their access IP and GPS information. If IP and GPS cannot be confirmed, users need to provide necessary identity documents to prove their identity.

## Product Access Permission Rules

### Product 1: Sports Information and News Platform (Vegais Sports Predict)
- **Access Permission**: Users from all regions can use
- **Restrictions**: No geographic restrictions
- **Identity Verification**: Not required

### Product 2: Betting and Strategy Platform (Vegais Sportsbook)
- **Access Permission**: Only users from specific regions can use
- **Restrictions**: Requires geographic location permission and identity verification
- **Identity Verification**: Must complete identity verification

### Product 3: Sports Betting ETF (Vegais ETF)
- **Access Permission**: Only users from specific regions can use
- **Restrictions**: Requires geographic location permission and identity verification
- **Identity Verification**: Must complete identity verification

## Restricted Regions List

Users from the following regions cannot use Products 2 and 3:

- Mainland China (CN)
- Afghanistan (AF)
- Andhra Pradesh, India (IN-AP)
- Arunachal Pradesh, India (IN-AR)
- Belarus (BY)
- Belgium (BE)
- Bosnia And Herzegovina (BA)
- Bulgaria (BG)
- Congo, Democratic Republic (CD)
- Cote D'Ivoire (CI)
- Croatia (HR)
- Cuba (CU)
- Cyprus (CY)
- Czech Republic (CZ)
- Egypt (EG)
- Estonia (EE)
- France (FR)
- French Guiana (GF)
- French Polynesia (PF)
- French Southern Territories (TF)
- Greece (GR)
- Hungary (HU)
- Indonesia (ID)
- Iran (IR)
- Iraq (IQ)
- Italy (IT)
- Japan (JP)
- Kerala, India (IN-KL)
- Kosovo (XK)
- Latvia (LV)
- Lithuania (LT)
- Malaysia (MY)
- Malta (MT)
- Montenegro (ME)
- Myanmar (MM)
- Nagaland, India (IN-NL)
- Nigeria (NG)
- North Korea (KP)
- North Macedonia (MK)
- Odisha, India (IN-OR)
- Pakistan (PK)
- Poland (PL)
- Portugal (PT)
- Romania (RO)
- Russian Federation (RU)
- Serbia (RS)
- Sikkim, India (IN-SK)
- Slovakia (SK)
- Slovenia (SI)
- Sudan (SD)
- Syrian Arab Republic (SY)
- Tamil Nadu, India (IN-TN)
- Telangana, India (IN-TG)
- Turkey (TR)
- Ukraine (UA)
- Vietnam (VN)
- Yugoslavia (YU)
- Zimbabwe (ZW)

## API Endpoints

### 1. Get User Compliance Status

**GET** `/api/compliance/status`

Get the current user's compliance status, including geographic location check and identity verification status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isAllowed": true,
    "requiresVerification": false,
    "reason": null,
    "geoCheck": {
      "isAllowed": true,
      "region": "US",
      "requiresVerification": false,
      "location": {
        "country": "United States",
        "region": "California",
        "city": "San Francisco",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "timezone": "America/Los_Angeles",
        "isp": "Comcast Cable"
      }
    },
    "identityVerified": true
  }
}
```

### 2. Submit Identity Verification Request

**POST** `/api/compliance/identity-verification`

Submit identity verification request, upload identity documents and selfie photo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentType": "passport",
  "documentNumber": "123456789",
  "documentCountry": "US",
  "documentImage": "base64_encoded_image",
  "selfieImage": "base64_encoded_image",
  "gpsLatitude": 37.7749,
  "gpsLongitude": -122.4194
}
```

**Supported Document Types:**
- `passport` - Passport
- `national_id` - National ID Card
- `drivers_license` - Driver's License
- `utility_bill` - Utility Bill

**Response:**
```json
{
  "success": true,
  "data": {
    "isVerified": false,
    "verificationId": "ver_123456789",
    "status": "pending"
  },
  "message": "Identity verification request submitted successfully"
}
```

### 3. Get Identity Verification Status

**GET** `/api/compliance/identity-verification/status`

Get the current user's identity verification status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isVerified": true,
    "verificationId": "ver_123456789",
    "status": "approved",
    "verifiedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Get Geographic Location Verification History

**GET** `/api/compliance/location-history`

Get user's geographic location verification history records.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "loc_123456789",
      "userId": "user_123",
      "ipAddress": "192.168.1.1",
      "gpsLatitude": 37.7749,
      "gpsLongitude": -122.4194,
      "isAllowed": true,
      "reason": null,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 5. Check Geographic Location Access Permission

**POST** `/api/compliance/geo-check`

Check if a specific geographic location has access permission.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "gpsLatitude": 37.7749,
  "gpsLongitude": -122.4194
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isAllowed": true,
    "region": "US",
    "requiresVerification": false,
    "location": {
      "country": "United States",
      "region": "California",
      "city": "San Francisco",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "timezone": "America/Los_Angeles",
      "isp": "Comcast Cable"
    }
  }
}
```

## Administrator API Endpoints

### 1. Get Pending Verification Request List

**GET** `/api/compliance/admin/pending-verifications`

Get all pending identity verification requests.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "verifications": [
      {
        "id": "ver_123456789",
        "userId": "user_123",
        "documentType": "PASSPORT",
        "documentNumber": "123456789",
        "documentCountry": "US",
        "status": "PENDING",
        "submittedAt": "2024-01-15T10:30:00Z",
        "user": {
          "id": "user_123",
          "username": "john_doe",
          "email": "john@example.com",
          "createdAt": "2024-01-01T00:00:00Z"
        }
      }
    ],
    "total": 1
  }
}
```

### 2. Review Identity Verification Request

**POST** `/api/compliance/admin/review-verification/:verificationId`

Review a specific identity verification request.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "approved": true,
  "reason": "Documents verified successfully"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification approved successfully"
}
```

### 3. Get User Compliance Report

**GET** `/api/compliance/admin/user-compliance/:userId`

Get complete compliance report for a specific user.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "complianceStatus": {
      "isAllowed": true,
      "requiresVerification": false,
      "reason": null,
      "geoCheck": {
        "isAllowed": true,
        "region": "US",
        "requiresVerification": false,
        "location": {
          "country": "United States",
          "region": "California",
          "city": "San Francisco"
        }
      },
      "identityVerified": true
    },
    "verificationStatus": {
      "isVerified": true,
      "verificationId": "ver_123456789",
      "status": "approved",
      "verifiedAt": "2024-01-15T10:30:00Z"
    },
    "locationHistory": [
      {
        "id": "loc_123456789",
        "ipAddress": "192.168.1.1",
        "isAllowed": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## Error Responses

### Geographic Location Restriction Error
```json
{
  "error": "Access denied: Region is restricted for betting and investment products",
  "requiresVerification": true,
  "geoCheck": {
    "isAllowed": false,
    "region": "CN",
    "reason": "Region is restricted for betting and investment products"
  },
  "identityVerified": false
}
```

### Identity Verification Required Error
```json
{
  "error": "Identity verification required",
  "requiresVerification": true,
  "geoCheck": {
    "isAllowed": true,
    "region": "US",
    "reason": null
  },
  "identityVerified": false
}
```

### GPS Location Mismatch Error
```json
{
  "error": "Access denied: GPS location does not match IP location",
  "requiresVerification": true,
  "geoCheck": {
    "isAllowed": false,
    "region": "US",
    "reason": "GPS location does not match IP location"
  },
  "identityVerified": true
}
```

## Middleware Integration

### Compliance Check Middleware

Use `complianceMiddleware` in routes that require compliance checks:

```typescript
import { complianceMiddleware } from '../middleware/compliance'

// Sports information platform routes (no restrictions)
router.get('/matches', async (req, res) => {
  // All users can access
})

// Betting and strategy platform routes (require compliance check)
router.post('/strategies', authenticateToken, complianceMiddleware('sportsbook'), async (req, res) => {
  // Only users who pass compliance check can access
})

// Sports betting ETF routes (require compliance check)
router.post('/etf/deposit', authenticateToken, complianceMiddleware('etf'), async (req, res) => {
  // Only users who pass compliance check can access
})
```

## Security Considerations

1. **IP Address Verification**: System records and verifies user IP addresses
2. **GPS Location Verification**: If GPS coordinates are provided, consistency check with IP location
3. **Document Verification**: Supports multiple identity document types including passport, ID card, driver's license, etc.
4. **Audit Logging**: All compliance checks record detailed audit logs
5. **Administrator Review**: Identity verification requires manual administrator review
6. **Data Encryption**: Sensitive document data stored using Base64 encoding

## Compliance Process

1. **User Registration**: Basic geographic location check for new user registration
2. **Product Access**: Compliance check when accessing restricted products
3. **Identity Verification**: If geographic location is restricted or verification needed, guide users to submit identity verification
4. **Administrator Review**: Administrator reviews user-submitted identity documents
5. **Permission Granting**: Grant corresponding product access permissions after approval
6. **Continuous Monitoring**: Regularly check user geographic location and compliance status 