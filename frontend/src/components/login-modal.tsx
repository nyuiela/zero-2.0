'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAccount, useSignMessage } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchNonce, verifySignature } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/authStore'
import { verificationService } from '@/lib/verificationService'
import { setJwtToken, getJwtToken } from '@/lib/utils'
import { toast } from 'sonner'

// interface LoginModalProps {
//   open: boolean
//   setOpen: () => void
// }

export function LoginModal() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()
  const { 
    setUser, 
    setOpen, 
    open, 
    authStep, 
    setAuthStep, 
    currentNonce, 
    currentMessage, 
    setNonceAndMessage, 
    clearNonceAndMessage,
    currentUsername,
    setCurrentUsername,
    clearCurrentUsername,
    isConnectingFromModal,
    setIsConnectingFromModal
  } = useAuthStore()

  // Use persisted username or empty string
  const [username, setUsername] = useState(currentUsername)

  // Update local username when persisted username changes
  useEffect(() => {
    setUsername(currentUsername)
  }, [currentUsername])

  // Update persisted username when local username changes
  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername)
    setCurrentUsername(newUsername)
  }

  // React Query hooks
  const { data: nonceData, refetch: refetchNonce, isLoading: nonceLoading, isError: nonceError } = useQuery({
    queryKey: ['auth-nonce'],
    queryFn: fetchNonce,
    enabled: open && !currentNonce, // Only fetch if modal is open and we don't have a nonce
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in newer versions)
  })

  const verifySignatureMutation = useMutation({ mutationFn: verifySignature })

  // Auto-reopen modal after wallet connection
  useEffect(() => {
    console.log('Auto-reopen check:', {
      isConnected,
      address: address?.slice(0, 6) + '...',
      open,
      isConnectingFromModal,
      authStep,
      username: username?.slice(0, 10) + '...'
    })
    
    if (isConnected && address && open === false && isConnectingFromModal) {
      console.log('🎯 Wallet connected from our modal, re-opening login modal')
      setOpen(true)
      setIsConnectingFromModal(false) // Reset the flag
    }
  }, [isConnected, address, open, isConnectingFromModal, setOpen, setIsConnectingFromModal, username])

  // Handle case where modal was closed during connect step but wallet is now connected
  useEffect(() => {
    console.log('Connect step re-open check:', {
      isConnected,
      address: address?.slice(0, 6) + '...',
      open,
      authStep,
      username: username?.slice(0, 10) + '...'
    })
    
    if (isConnected && address && open === false && authStep === 'connect') {
      console.log('🎯 Modal was closed during connect step, but wallet is now connected. Re-opening.')
      setOpen(true)
    }
  }, [isConnected, address, open, authStep, setOpen, username])

  // Initialize modal state when opened
  useEffect(() => {
    if (open) {
      setLoading(false)
      setError(null)
      
      console.log('Modal initialization:', {
        isConnected,
        address,
        currentNonce: !!currentNonce,
        currentMessage: !!currentMessage,
        username: username || 'empty',
        authStep
      })
      
      // If user is already connected and we have stored nonce/message and username, go to sign step
      if (isConnected && address && currentNonce && currentMessage && username && username.length >= 4) {
        console.log('User fully ready, going to sign step')
        setAuthStep('sign')
      } else if (isConnected && address && currentNonce && currentMessage && username && username.length < 4) {
        // User connected and has nonce/message but username is too short, stay at username step
        console.log('User connected with nonce/message but username too short, staying at username step')
        setAuthStep('username')
      } else if (isConnected && address && currentNonce && currentMessage && !username) {
        // User connected and has nonce/message but no username, stay at username step
        console.log('User connected with nonce/message but no username, staying at username step')
        setAuthStep('username')
      } else if (isConnected && address) {
        // User connected but no stored nonce/message, go to connect step to fetch
        console.log('User connected but no nonce/message, going to connect step')
        setAuthStep('connect')
      } else {
        // User not connected, start at username step
        console.log('User not connected, starting at username step')
        setAuthStep('username')
      }
    } else {
      // Clear connecting flag when modal is closed
      setIsConnectingFromModal(false)
    }
  }, [open, isConnected, address, currentNonce, currentMessage, username, setAuthStep, setIsConnectingFromModal])

  // Handle wallet disconnect
  useEffect(() => {
    if (!isConnected && open) {
      setAuthStep('username')
      setLoading(false)
      setError(null)
    }
  }, [isConnected, open, setAuthStep])

  // Handle nonce data - only set once and persist
  useEffect(() => {
    if (nonceData && !currentNonce && 'nonce' in nonceData && 'msg' in nonceData) {
      setNonceAndMessage(nonceData.nonce, nonceData.msg)
      console.log('Nonce and message set:', nonceData.nonce, nonceData.msg)
    }
  }, [nonceData, currentNonce, setNonceAndMessage])

  // Generate fallback message only if no stored message and backend failed
  useEffect(() => {
    if (!currentMessage && !nonceLoading && nonceError && open) {
      const timestamp = new Date().toISOString()
      const fallbackNonce = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const fallbackMessage = `Login at ${timestamp}`
      
      setNonceAndMessage(fallbackNonce, fallbackMessage)
      console.log('Using fallback authentication message:', fallbackMessage)
    }
  }, [currentMessage, nonceLoading, nonceError, open, setNonceAndMessage])

  // Auto-advance to sign step when wallet is connected and we have message and username
  useEffect(() => {
    if (isConnected && currentMessage && username.length >= 4 && authStep === 'connect') {
      setAuthStep('sign')
    }
  }, [isConnected, currentMessage, username, authStep, setAuthStep])

  // Check for existing authentication on mount
  useEffect(() => {
    const checkExistingAuth = () => {
      const token = getJwtToken()
      if (token && isConnected && address) {
        // User has valid token and wallet connected, restore session
        setUser({
          address,
          username: '', // Will be filled from token if needed
          jwt: token,
          verified: true
        })
        setOpen(false)
      }
    }

    checkExistingAuth()
  }, [isConnected, address, setUser, setOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      verificationService.stopAllPolling()
    }
  }, [])

  // Manual advance from username to connect step when user clicks Connect Wallet
  const handleConnectWallet = useCallback(() => {
    console.log('Opening connect modal from our login modal')
    console.log('Current modal state before opening RainbowKit:', { open, authStep })
    
    // If we're on username step and username is valid, advance to connect step
    if (authStep === 'username' && username.length >= 4) {
      console.log('Advancing from username to connect step')
      setAuthStep('connect')
    }
    
    setIsConnectingFromModal(true) // Set flag before opening RainbowKit modal
    openConnectModal?.()
  }, [openConnectModal, setIsConnectingFromModal, open, authStep, username, setAuthStep])

  const handleSignAndVerify = async () => {
    if (!address || !username || !currentMessage || !currentNonce) {
      setError('Missing required information for signing.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('Signing message:', currentMessage)
      const signature = await signMessageAsync({
        message: currentMessage
      })

      console.log('Signature received:', signature)

      // Verify signature and get JWT token
      const verifyRes = await verifySignatureMutation.mutateAsync({
        message: currentMessage,
        signature_bytes: signature,
        expected_addr: address,
        username,
        nonce: currentNonce
      })

      console.log('Verification response:', verifyRes)

      const jwtToken = verifyRes.jwt || verifyRes.token

      if (!jwtToken) {
        throw new Error('No JWT token received from verification')
      }

      // Store JWT token in cookies
      setJwtToken(jwtToken)

      if (verifyRes.verified === true) {
        // Verification completed immediately
        setUser({
          address,
          username,
          jwt: jwtToken,
          verified: true
        })
        
        // Clear stored nonce/message and username after successful auth
        clearNonceAndMessage()
        clearCurrentUsername()
        setIsConnectingFromModal(false) // Clear connecting flag
        setAuthStep('complete')
        
        console.log("Login successful")
        toast.success('Login successful!', {
          description: 'Your account has been verified.',
        })

        setOpen(false)
      } else if (verifyRes.verificationId) {
        // Verification in progress, start polling
        verificationService.startPolling(
          verifyRes.verificationId,
          {
            onComplete: async (status) => {
              setUser({
                address,
                username,
                jwt: jwtToken,
                verified: true
              })
              clearNonceAndMessage()
              clearCurrentUsername()
              setIsConnectingFromModal(false) // Clear connecting flag
              setAuthStep('complete')
            },
            onError: (error) => {
              console.error('Verification failed:', error)
              toast.error('Verification failed', {
                description: error,
              })
            }
          }
        )

        // Log user in immediately with pending verification
        setUser({
          address,
          username,
          jwt: jwtToken,
          verified: false
        })

        toast.info('Login successful!', {
          description: 'Identity verification in progress...',
        })

        setOpen(false)
      } else {
        throw new Error('Unexpected verification response')
      }

    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    console.log('Cancel button clicked, current authStep:', authStep)
    
    // Allow closing if we're at the beginning, end, or during connect step
    if (authStep === 'username' || authStep === 'complete' || authStep === 'connect') {
      console.log('Allowing modal to close')
      setOpen(false)
      // Clear all state when canceling (except during connect step)
      if (authStep !== 'connect') {
        console.log('Clearing all state')
        clearNonceAndMessage()
        clearCurrentUsername()
        setIsConnectingFromModal(false)
        setAuthStep('username')
      }
    } else {
      // If in the middle of signing, prevent closing
      console.log('Cannot cancel during signing process')
      toast.info('Please complete the signing process.')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    console.log('Modal open change:', { newOpen, authStep })
    
    if (!newOpen) {
      // Only allow closing if we're not in the middle of signing
      if (authStep === 'username' || authStep === 'complete' || authStep === 'connect') {
        console.log('Allowing modal to close via outside click')
        setOpen(false)
        // Clear all state when canceling (except during connect step)
        if (authStep !== 'connect') {
          console.log('Clearing all state')
          clearNonceAndMessage()
          clearCurrentUsername()
          setIsConnectingFromModal(false)
          setAuthStep('username')
        }
      } else {
        // If in the middle of signing, prevent closing
        console.log('Cannot close during signing process')
        toast.info('Please complete the signing process.')
        // Keep modal open
        setOpen(true)
      }
    } else {
      setOpen(true)
    }
  }

  const getStepContent = () => {
    switch (authStep) {
      case 'username':
        return (
          <div className="space-y-4">
            <Input
              id="username"
              placeholder="Enter username (min 4 characters)"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="border-gray-700 text-[#202626]"
            />
            {username.length > 0 && username.length < 4 && (
              <p className="text-red-500 text-sm">Username must be at least 4 characters</p>
            )}
            {username.length >= 4 && (
              <p className="text-green-600 text-sm">✓ Username is valid</p>
            )}
            <Button
              onClick={handleConnectWallet}
              disabled={username.length < 4}
              className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
            >
              Connect Wallet
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-2"
            >
              Cancel
            </Button>
          </div>
        )

      case 'connect':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                <span className="font-semibold">Username:</span> {username}
              </p>
            </div>
            {currentMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Message you will sign:</span>
                </p>
                <p className="text-blue-700 text-xs font-mono mt-1 break-all">
                  {currentMessage}
                </p>
              </div>
            )}
            {nonceError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <span className="font-semibold">Note:</span> Using fallback authentication. Backend connection unavailable.
                </p>
              </div>
            )}
            <Button
              onClick={handleConnectWallet}
              className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
            >
              Connect Wallet
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-2"
            >
              Cancel
            </Button>
          </div>
        )

      case 'sign':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                <span className="font-semibold">Connected:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <p className="text-green-800 text-sm">
                <span className="font-semibold">Username:</span> {username}
              </p>
            </div>

            {currentMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Message to sign:</span>
                </p>
                <p className="text-blue-700 text-xs font-mono mt-1 break-all">
                  {currentMessage}
                </p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={handleSignAndVerify}
              disabled={loading}
              className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
            >
              {loading ? 'Signing...' : 'Sign Message & Login'}
            </Button>
          </div>
        )

      case 'complete':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                <span className="font-semibold">Authentication Complete!</span>
              </p>
            </div>
            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 py-2"
            >
              Close
            </Button>
          </div>
        )
    }
  }

  const getStepTitle = () => {
    switch (authStep) {
      case 'username':
        return 'Enter Username'
      case 'connect':
        return 'Connect Wallet'
      case 'sign':
        return 'Sign Message'
      case 'complete':
        return 'Authentication Complete'
    }
  }

  const getStepDescription = () => {
    switch (authStep) {
      case 'username':
        return 'Enter a username (min 4 chars) to continue with wallet authentication.'
      case 'connect':
        return 'Connect your wallet to proceed with the login process.'
      case 'sign':
        return 'Sign the message with your wallet to complete authentication.'
      case 'complete':
        return 'Your authentication has been completed successfully.'
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-gray-800 text-[#202626]">
        <DialogHeader>
          <DialogTitle className='text-xl'>{getStepTitle()}</DialogTitle>
          <DialogDescription className='text-lg'>
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {getStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
} 