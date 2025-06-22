import { pollVerificationStatus, getJwt } from './api/auth'
import { toast } from 'sonner'

interface VerificationStatus {
  verified: boolean
  receipt?: any
  stats?: any
  error?: string
}

interface VerificationCallback {
  onComplete: (status: VerificationStatus) => void
  onError: (error: string) => void
}

class VerificationService {
  private activePolling: Map<string, NodeJS.Timeout> = new Map()
  private callbacks: Map<string, VerificationCallback> = new Map()

  /**
   * Start polling for verification status
   * @param verificationId - The verification ID from the backend
   * @param callback - Callback functions for completion and error
   * @param interval - Polling interval in milliseconds (default: 2000)
   */
  startPolling(
    verificationId: string, 
    callback: VerificationCallback, 
    interval: number = 2000
  ) {
    // Stop any existing polling for this ID
    this.stopPolling(verificationId)

    // Store callback
    this.callbacks.set(verificationId, callback)

    // Start polling
    const pollInterval = setInterval(async () => {
      try {
        const status = await pollVerificationStatus(verificationId)
        
        if (status.verified === true) {
          // Verification complete
          this.stopPolling(verificationId)
          
          // Show success toast
          toast.success('Identity verification completed!', {
            description: 'Your account has been fully verified with zero-knowledge proof.',
            duration: 5000,
          })
          
          // Call completion callback
          const callback = this.callbacks.get(verificationId)
          if (callback) {
            callback.onComplete(status)
          }
          
          // Clean up
          this.callbacks.delete(verificationId)
        }
      } catch (error) {
        console.error('Error polling verification status:', error)
        // Continue polling on error, but log it
      }
    }, interval)

    // Store the interval
    this.activePolling.set(verificationId, pollInterval)
  }

  /**
   * Stop polling for a specific verification ID
   * @param verificationId - The verification ID to stop polling for
   */
  stopPolling(verificationId: string) {
    const interval = this.activePolling.get(verificationId)
    if (interval) {
      clearInterval(interval)
      this.activePolling.delete(verificationId)
    }
    
    // Clean up callback
    this.callbacks.delete(verificationId)
  }

  /**
   * Stop all active polling
   */
  stopAllPolling() {
    this.activePolling.forEach((interval) => {
      clearInterval(interval)
    })
    this.activePolling.clear()
    this.callbacks.clear()
  }

  /**
   * Check if polling is active for a verification ID
   * @param verificationId - The verification ID to check
   */
  isPolling(verificationId: string): boolean {
    return this.activePolling.has(verificationId)
  }

  /**
   * Get all active verification IDs
   */
  getActiveVerifications(): string[] {
    return Array.from(this.activePolling.keys())
  }
}

// Export singleton instance
export const verificationService = new VerificationService()

// Export types
export type { VerificationStatus, VerificationCallback } 