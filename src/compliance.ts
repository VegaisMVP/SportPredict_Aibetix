import { GeoService, GeoCheckResult } from './geoService'
import { IdentityVerificationService } from './identityVerificationService'
import { logger } from './utils/logger'

export interface ComplianceCheck {
  isAllowed: boolean
  requiresVerification: boolean
  reason?: string
  geoCheck: GeoCheckResult
  identityVerified: boolean
}

export interface ProductAccess {
  sportsPredict: boolean
  sportsbook: boolean
  etf: boolean
}

/**
 * Check if user has permission to access specific product
 */
export async function checkProductAccess(
  userId: string,
  ipAddress: string,
  gpsLatitude?: number,
  gpsLongitude?: number
): Promise<ProductAccess> {
  try {
    // Get geolocation check result
    const geoCheck = await GeoService.checkProductAccess(ipAddress, gpsLatitude, gpsLongitude)
    
    // Check user identity verification status
    const identityVerified = await IdentityVerificationService.isUserVerified(userId)
    
    // Record geolocation verification
    await IdentityVerificationService.recordLocationVerification(
      userId,
      ipAddress,
      geoCheck.isAllowed,
      gpsLatitude,
      gpsLongitude,
      geoCheck.reason
    )

    // Product access permission rules:
    // 1. Sports information platform: accessible to all regions
    // 2. Betting and strategy platform: requires allowed geolocation and identity verification
    // 3. Sports betting fund: requires allowed geolocation and identity verification

    const sportsPredict = true // Accessible to all regions
    const sportsbook = geoCheck.isAllowed && identityVerified
    const etf = geoCheck.isAllowed && identityVerified

    return {
      sportsPredict,
      sportsbook,
      etf
    }
  } catch (error) {
    logger.error('Error checking product access:', error)
    // Default to deny access on error
    return {
      sportsPredict: true,
      sportsbook: false,
      etf: false
    }
  }
}

/**
 * Compliance check middleware
 */
export function complianceMiddleware(productType: 'sportsPredict' | 'sportsbook' | 'etf') {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const ipAddress = GeoService.getClientIP(req)
      const gpsLatitude = req.body.gpsLatitude || req.query.gpsLatitude
      const gpsLongitude = req.body.gpsLongitude || req.query.gpsLongitude

      const productAccess = await checkProductAccess(
        userId,
        ipAddress,
        gpsLatitude ? Number(gpsLatitude) : undefined,
        gpsLongitude ? Number(gpsLongitude) : undefined
      )

      // Check access permission for specific product
      const hasAccess = productAccess[productType]
      
      if (!hasAccess) {
        // Get geolocation check result for error message
        const geoCheckResult = await GeoService.checkProductAccess(ipAddress, gpsLatitude, gpsLongitude)
        const identityVerified = await IdentityVerificationService.isUserVerified(userId)

        let errorMessage = 'Access denied'
        if (!geoCheckResult.isAllowed) {
          errorMessage = `Access denied: ${geoCheckResult.reason || 'Geographic restriction'}`
        } else if (!identityVerified) {
          errorMessage = 'Identity verification required'
        }

        return res.status(403).json({
          error: errorMessage,
          requiresVerification: geoCheckResult.requiresVerification,
          geoCheck: {
            isAllowed: geoCheckResult.isAllowed,
            region: geoCheckResult.region,
            reason: geoCheckResult.reason
          },
          identityVerified
        })
      }

      // Add compliance check result to request object
      req.compliance = {
        productAccess,
        geoCheck: await GeoService.checkProductAccess(ipAddress, gpsLatitude, gpsLongitude),
        identityVerified: await IdentityVerificationService.isUserVerified(userId)
      }

      next()
    } catch (error) {
      logger.error('Compliance middleware error:', error)
      res.status(500).json({ error: 'Compliance check failed' })
    }
  }
}

/**
 * Get user compliance status
 */
export async function getUserComplianceStatus(userId: string, ipAddress: string): Promise<ComplianceCheck> {
  try {
    const geoCheck = await GeoService.checkProductAccess(ipAddress)
    const identityVerified = await IdentityVerificationService.isUserVerified(userId)

    return {
      isAllowed: geoCheck.isAllowed && identityVerified,
      requiresVerification: geoCheck.requiresVerification || !identityVerified,
      reason: geoCheck.reason || (!identityVerified ? 'Identity verification required' : undefined),
      geoCheck,
      identityVerified
    }
  } catch (error) {
    logger.error('Error getting user compliance status:', error)
    throw error
  }
} 