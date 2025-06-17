import { Router } from 'express'
import { authenticateToken, requireRole } from './middleware/auth'
import { GeoService } from './geoService'
import { IdentityVerificationService } from './identityVerificationService'
import { getUserComplianceStatus } from './compliance'
import { logger } from './utils/logger'

const router = Router()

/**
 * Get user compliance status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const ipAddress = GeoService.getClientIP(req)
    
    const complianceStatus = await getUserComplianceStatus(userId, ipAddress)
    
    res.json({
      success: true,
      data: complianceStatus
    })
  } catch (error) {
    logger.error('Error getting compliance status:', error)
    res.status(500).json({ error: 'Failed to get compliance status' })
  }
})

/**
 * Submit identity verification request
 */
router.post('/identity-verification', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const {
      documentType,
      documentNumber,
      documentCountry,
      documentImage,
      selfieImage,
      gpsLatitude,
      gpsLongitude
    } = req.body

    // Validate required fields
    if (!documentType || !documentNumber || !documentCountry || !documentImage || !selfieImage) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate document number format
    if (!IdentityVerificationService.validateDocumentNumber(documentType, documentNumber, documentCountry)) {
      return res.status(400).json({ error: 'Invalid document number format' })
    }

    const verificationRequest = {
      userId,
      documentType,
      documentNumber,
      documentCountry,
      documentImage,
      selfieImage,
      gpsLatitude: gpsLatitude ? Number(gpsLatitude) : undefined,
      gpsLongitude: gpsLongitude ? Number(gpsLongitude) : undefined,
      ipAddress: GeoService.getClientIP(req),
      userAgent: req.headers['user-agent'] || ''
    }

    const result = await IdentityVerificationService.submitVerification(verificationRequest)

    res.json({
      success: true,
      data: result,
      message: 'Identity verification request submitted successfully'
    })
  } catch (error) {
    logger.error('Error submitting identity verification:', error)
    res.status(500).json({ error: 'Failed to submit verification request' })
  }
})

/**
 * Get identity verification status
 */
router.get('/identity-verification/status', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const status = await IdentityVerificationService.getVerificationStatus(userId)
    
    res.json({
      success: true,
      data: status
    })
  } catch (error) {
    logger.error('Error getting verification status:', error)
    res.status(500).json({ error: 'Failed to get verification status' })
  }
})

/**
 * Get geolocation verification history
 */
router.get('/location-history', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const history = await IdentityVerificationService.getLocationVerificationHistory(userId)
    
    res.json({
      success: true,
      data: history
    })
  } catch (error) {
    logger.error('Error getting location history:', error)
    res.status(500).json({ error: 'Failed to get location history' })
  }
})

/**
 * Check geolocation access permission
 */
router.post('/geo-check', authenticateToken, async (req, res) => {
  try {
    const ipAddress = GeoService.getClientIP(req)
    const { gpsLatitude, gpsLongitude } = req.body

    const geoCheck = await GeoService.checkProductAccess(
      ipAddress,
      gpsLatitude ? Number(gpsLatitude) : undefined,
      gpsLongitude ? Number(gpsLongitude) : undefined
    )

    res.json({
      success: true,
      data: geoCheck
    })
  } catch (error) {
    logger.error('Error checking geo access:', error)
    res.status(500).json({ error: 'Failed to check geographic access' })
  }
})

/**
 * Admin: Get pending verification request list
 */
router.get('/admin/pending-verifications', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const result = await IdentityVerificationService.getPendingVerifications(page, limit)

      res.json({
        success: true,
        data: result
      })
    } catch (error) {
      logger.error('Error getting pending verifications:', error)
      res.status(500).json({ error: 'Failed to get pending verifications' })
    }
  }
)

/**
 * Admin: Review identity verification request
 */
router.post('/admin/review-verification/:verificationId',
  authenticateToken,
  requireRole(['ADMIN']),
  async (req, res) => {
    try {
      const { verificationId } = req.params
      const adminUserId = (req as any).user.userId
      const { approved, reason } = req.body

      if (typeof approved !== 'boolean') {
        return res.status(400).json({ error: 'Approved field is required and must be boolean' })
      }

      await IdentityVerificationService.reviewVerification(
        verificationId,
        adminUserId,
        approved,
        reason
      )

      res.json({
        success: true,
        message: `Verification ${approved ? 'approved' : 'rejected'} successfully`
      })
    } catch (error) {
      logger.error('Error reviewing verification:', error)
      res.status(500).json({ error: 'Failed to review verification' })
    }
  }
)

/**
 * Admin: Get user compliance report
 */
router.get('/admin/user-compliance/:userId',
  authenticateToken,
  requireRole(['ADMIN']),
  async (req, res) => {
    try {
      const { userId } = req.params
      const ipAddress = GeoService.getClientIP(req)

      const complianceStatus = await getUserComplianceStatus(userId, ipAddress)
      const verificationStatus = await IdentityVerificationService.getVerificationStatus(userId)
      const locationHistory = await IdentityVerificationService.getLocationVerificationHistory(userId)

      res.json({
        success: true,
        data: {
          complianceStatus,
          verificationStatus,
          locationHistory
        }
      })
    } catch (error) {
      logger.error('Error getting user compliance report:', error)
      res.status(500).json({ error: 'Failed to get user compliance report' })
    }
  }
)

export default router 