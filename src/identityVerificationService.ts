import { logger } from './utils/logger'
import { prisma } from './server'

export interface IdentityDocument {
  type: 'passport' | 'national_id' | 'drivers_license' | 'utility_bill'
  number: string
  country: string
  expiryDate?: Date
  documentImage?: string // Base64 encoded image
}

export interface VerificationRequest {
  userId: string
  documentType: string
  documentNumber: string
  documentCountry: string
  documentImage: string
  selfieImage: string
  gpsLatitude?: number
  gpsLongitude?: number
  ipAddress: string
  userAgent: string
}

export interface VerificationResult {
  isVerified: boolean
  verificationId: string
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  verifiedAt?: Date
}

export class IdentityVerificationService {
  /**
   * Submit identity verification request
   */
  static async submitVerification(request: VerificationRequest): Promise<VerificationResult> {
    try {
      // Create verification record
      const verification = await prisma.identityVerification.create({
        data: {
          userId: request.userId,
          documentType: request.documentType as any,
          documentNumber: request.documentNumber,
          documentCountry: request.documentCountry,
          documentImage: request.documentImage,
          selfieImage: request.selfieImage,
          gpsLatitude: request.gpsLatitude,
          gpsLongitude: request.gpsLongitude,
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          status: 'PENDING',
          submittedAt: new Date()
        }
      })

      // Record audit log
      logger.audit('identity_verification_submitted', {
        userId: request.userId,
        verificationId: verification.id,
        documentType: request.documentType,
        documentCountry: request.documentCountry
      })

      return {
        isVerified: false,
        verificationId: verification.id,
        status: 'pending'
      }
    } catch (error) {
      logger.error('Error submitting identity verification:', error)
      throw new Error('Failed to submit verification request')
    }
  }

  /**
   * Get user verification status
   */
  static async getVerificationStatus(userId: string): Promise<VerificationResult | null> {
    try {
      const verification = await prisma.identityVerification.findFirst({
        where: { userId },
        orderBy: { submittedAt: 'desc' }
      })

      if (!verification) {
        return null
      }

      return {
        isVerified: verification.status === 'APPROVED',
        verificationId: verification.id,
        status: verification.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
        reason: verification.rejectionReason,
        verifiedAt: verification.verifiedAt
      }
    } catch (error) {
      logger.error('Error getting verification status:', error)
      throw new Error('Failed to get verification status')
    }
  }

  /**
   * Admin review identity verification
   */
  static async reviewVerification(
    verificationId: string,
    adminUserId: string,
    approved: boolean,
    reason?: string
  ): Promise<void> {
    try {
      const verification = await prisma.identityVerification.findUnique({
        where: { id: verificationId }
      })

      if (!verification) {
        throw new Error('Verification not found')
      }

      const status = approved ? 'APPROVED' : 'REJECTED'
      const verifiedAt = approved ? new Date() : null

      await prisma.identityVerification.update({
        where: { id: verificationId },
        data: {
          status,
          rejectionReason: reason,
          verifiedAt,
          reviewedBy: adminUserId,
          reviewedAt: new Date()
        }
      })

      // If verification passes, update user status
      if (approved) {
        await prisma.user.update({
          where: { id: verification.userId },
          data: {
            identityVerified: true,
            identityVerifiedAt: new Date()
          }
        })
      }

      // Record audit log
      logger.audit('identity_verification_reviewed', {
        adminUserId,
        verificationId,
        userId: verification.userId,
        approved,
        reason
      })
    } catch (error) {
      logger.error('Error reviewing verification:', error)
      throw new Error('Failed to review verification')
    }
  }

  /**
   * Get pending verification request list
   */
  static async getPendingVerifications(
    page: number = 1,
    limit: number = 20
  ): Promise<{ verifications: any[], total: number }> {
    try {
      const skip = (page - 1) * limit

      const [verifications, total] = await Promise.all([
        prisma.identityVerification.findMany({
          where: { status: 'PENDING' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
              }
            }
          },
          orderBy: { submittedAt: 'asc' },
          skip,
          take: limit
        }),
        prisma.identityVerification.count({
          where: { status: 'PENDING' }
        })
      ])

      return { verifications, total }
    } catch (error) {
      logger.error('Error getting pending verifications:', error)
      throw new Error('Failed to get pending verifications')
    }
  }

  /**
   * Validate document number format
   */
  static validateDocumentNumber(documentType: string, documentNumber: string, country: string): boolean {
    // Here you can implement document number validation rules for different countries
    // Currently using simple length and format checks
    
    switch (documentType) {
      case 'passport':
        // Passport numbers are usually 6-9 digits or alphanumeric combinations
        return /^[A-Z0-9]{6,9}$/.test(documentNumber)
      
      case 'national_id':
        // National ID number formats vary by country
        if (country === 'CN') {
          // Chinese national ID is 18 digits
          return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(documentNumber)
        }
        return documentNumber.length >= 6 && documentNumber.length <= 20
      
      case 'drivers_license':
        // Driver's license numbers are usually alphanumeric combinations
        return /^[A-Z0-9]{5,15}$/.test(documentNumber)
      
      case 'utility_bill':
        // Utility bill numbers are usually numeric
        return /^\d{6,20}$/.test(documentNumber)
      
      default:
        return false
    }
  }

  /**
   * Check if user has completed identity verification
   */
  static async isUserVerified(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { identityVerified: true }
      })

      return user?.identityVerified || false
    } catch (error) {
      logger.error('Error checking user verification status:', error)
      return false
    }
  }

  /**
   * Get user location verification history
   */
  static async getLocationVerificationHistory(userId: string): Promise<any[]> {
    try {
      return await prisma.locationVerification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    } catch (error) {
      logger.error('Error getting location verification history:', error)
      return []
    }
  }

  /**
   * Record location verification
   */
  static async recordLocationVerification(
    userId: string,
    ipAddress: string,
    isAllowed: boolean,
    gpsLatitude?: number,
    gpsLongitude?: number,
    reason?: string
  ): Promise<void> {
    try {
      await prisma.locationVerification.create({
        data: {
          userId,
          ipAddress,
          gpsLatitude,
          gpsLongitude,
          isAllowed,
          reason,
          createdAt: new Date()
        }
      })
    } catch (error) {
      logger.error('Error recording location verification:', error)
    }
  }
} 