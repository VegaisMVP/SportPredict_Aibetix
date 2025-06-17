import { logger } from '../utils/logger'

// List of regions prohibited from using Product 2 and Product 3
export const RESTRICTED_REGIONS = [
  'CN', // Mainland China
  'AF', // Afghanistan
  'IN-AP', // Andhra Pradesh (State in India)
  'IN-AR', // Arunachal Pradesh (State in India)
  'BY', // Belarus
  'BE', // Belgium
  'BA', // Bosnia And Herzegovina
  'BG', // Bulgaria
  'CD', // Congo (Democratic Republic)
  'CI', // Cote D'Ivoire
  'HR', // Croatia (local name: Hrvatska)
  'CU', // Cuba
  'CY', // Cyprus
  'CZ', // Czech Republic
  'EG', // Egypt
  'EE', // Estonia
  'FR', // France
  'GF', // French Guiana
  'PF', // French Polynesia
  'TF', // French Southern Territories
  'GR', // Greece
  'HU', // Hungary
  'ID', // Indonesia
  'IR', // Iran (Islamic Republic Of)
  'IQ', // Iraq
  'IT', // Italy
  'JP', // Japan
  'IN-KL', // Kerala (State in India)
  'XK', // Kosovo
  'LV', // Latvia
  'LT', // Lithuania
  'MY', // Malaysia
  'MT', // Malta
  'ME', // Montenegro
  'MM', // Myanmar
  'IN-NL', // Nagaland (State in India)
  'NG', // Nigeria
  'KP', // North Korea
  'MK', // North Macedonia
  'IN-OR', // Odisha (State in India)
  'PK', // Pakistan
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'RU', // Russian Federation
  'RS', // Serbia
  'IN-SK', // Sikkim (State in India)
  'SK', // Slovakia (Slovak Republic)
  'SI', // Slovenia
  'SD', // Sudan
  'SY', // Syrian Arab Republic
  'IN-TN', // Tamil Nadu (State in India)
  'IN-TG', // Telangana (State in India)
  'TR', // Turkey
  'UA', // Ukraine
  'VN', // Vietnam
  'YU', // Yugoslavia
  'ZW'  // Zimbabwe
]

// Restricted states in India
export const RESTRICTED_INDIAN_STATES = [
  'IN-AP', // Andhra Pradesh
  'IN-AR', // Arunachal Pradesh
  'IN-KL', // Kerala
  'IN-NL', // Nagaland
  'IN-OR', // Odisha
  'IN-SK', // Sikkim
  'IN-TN', // Tamil Nadu
  'IN-TG'  // Telangana
]

export interface GeoLocation {
  country: string
  region?: string
  city?: string
  latitude?: number
  longitude?: number
  timezone?: string
  isp?: string
}

export interface GeoCheckResult {
  isAllowed: boolean
  region: string
  reason?: string
  requiresVerification: boolean
  location: GeoLocation
}

export class GeoService {
  /**
   * Get geolocation information from IP address
   */
  static async getLocationFromIP(ip: string): Promise<GeoLocation | null> {
    try {
      // Use free IP geolocation API
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp`)
      
      if (!response.ok) {
        throw new Error(`IP API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.status === 'success') {
        return {
          country: data.country,
          region: data.regionName,
          city: data.city,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          isp: data.isp
        }
      } else {
        logger.warn(`IP geolocation failed for ${ip}: ${data.message}`)
        return null
      }
    } catch (error) {
      logger.error(`Error getting location from IP ${ip}:`, error)
      return null
    }
  }

  /**
   * Validate if GPS coordinates match IP location
   */
  static validateGPSLocation(ipLocation: GeoLocation, gpsLat: number, gpsLon: number): boolean {
    if (!ipLocation.latitude || !ipLocation.longitude) {
      return false
    }

    // Calculate distance between IP location and GPS location (using Haversine formula)
    const distance = this.calculateDistance(
      ipLocation.latitude,
      ipLocation.longitude,
      gpsLat,
      gpsLon
    )

    // If the distance exceeds 50km, consider the location mismatched
    return distance <= 50
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth radius (km)
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  /**
   * Check if region is restricted
   */
  static isRegionRestricted(countryCode: string, regionCode?: string): boolean {
    // Check country-level restrictions
    if (RESTRICTED_REGIONS.includes(countryCode)) {
      return true
    }

    // Check Indian specific states restrictions
    if (countryCode === 'IN' && regionCode) {
      const fullRegionCode = `${countryCode}-${regionCode}`
      return RESTRICTED_INDIAN_STATES.includes(fullRegionCode)
    }

    return false
  }

  /**
   * Check user permission to use specific product
   */
  static async checkProductAccess(
    ip: string,
    gpsLat?: number,
    gpsLon?: number
  ): Promise<GeoCheckResult> {
    const location = await this.getLocationFromIP(ip)
    
    if (!location) {
      return {
        isAllowed: false,
        region: 'Unknown',
        reason: 'Unable to determine location from IP',
        requiresVerification: true,
        location: { country: 'Unknown' }
      }
    }

    const regionCode = this.getRegionCode(location.country, location.region)
    const isRestricted = this.isRegionRestricted(location.country, regionCode)

    // If region is restricted, need identity verification
    if (isRestricted) {
      return {
        isAllowed: false,
        region: regionCode,
        reason: 'Region is restricted for betting and investment products',
        requiresVerification: true,
        location
      }
    }

    // If there is GPS information, verify location consistency
    if (gpsLat && gpsLon) {
      const gpsValid = this.validateGPSLocation(location, gpsLat, gpsLon)
      if (!gpsValid) {
        return {
          isAllowed: false,
          region: regionCode,
          reason: 'GPS location does not match IP location',
          requiresVerification: true,
          location
        }
      }
    }

    return {
      isAllowed: true,
      region: regionCode,
      requiresVerification: false,
      location
    }
  }

  /**
   * Get region code
   */
  private static getRegionCode(country: string, region?: string): string {
    if (country === 'IN' && region) {
      // Indian state code mapping
      const stateMap: Record<string, string> = {
        'Andhra Pradesh': 'AP',
        'Arunachal Pradesh': 'AR',
        'Kerala': 'KL',
        'Nagaland': 'NL',
        'Odisha': 'OR',
        'Sikkim': 'SK',
        'Tamil Nadu': 'TN',
        'Telangana': 'TG'
      }
      const stateCode = stateMap[region]
      return stateCode ? `${country}-${stateCode}` : country
    }
    return country
  }

  /**
   * Get user real IP address
   */
  static getClientIP(req: any): string {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip ||
           '127.0.0.1'
  }
} 