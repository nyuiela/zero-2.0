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
import Link from 'next/link'
import AuthStepContent from './connect-modal'

// interface LoginModalProps {
//   open: boolean
//   setOpen: () => void
// }

export function LoginModal() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTypingUsername, setIsTypingUsername] = useState(false)

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
    console.log('Username changed:', newUsername)
    setIsTypingUsername(true) // Set typing flag
    setCurrentUsername(newUsername)
    
    // Clear typing flag after a short delay
    setTimeout(() => {
      setIsTypingUsername(false)
    }, 1000)
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
        authStep,
        isTypingUsername
      })
      
      // Don't auto-advance if user is currently typing their username
      if (isTypingUsername) {
        console.log('User is typing username, preventing auto-advance during initialization')
        return
      }
      
      // ALWAYS start at username step if no username is stored, regardless of wallet connection
      if (!username || username.trim().length === 0) {
        console.log('No username stored, starting at username step')
        setAuthStep('username')
        return
      }
      
      // If we have a username and wallet is connected, go to sign step (nonce/message will be fetched)
      if (isConnected && address && username.trim().length > 0) {
        console.log('User has username and wallet connected, going to sign step')
        setAuthStep('sign')
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
  }, [open, isConnected, address, currentNonce, currentMessage, username, setAuthStep, setIsConnectingFromModal, isTypingUsername])

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
    // Don't auto-advance if user is currently typing their username
    if (isTypingUsername) {
      console.log('User is typing username, preventing auto-advance')
      return
    }
    
    if (isConnected && currentMessage && username.trim().length > 0 && authStep === 'connect') {
      setAuthStep('sign')
    }
  }, [isConnected, currentMessage, username, authStep, setAuthStep, isTypingUsername])

  // Auto-fetch nonce/message when on sign step but don't have them
  useEffect(() => {
    if (authStep === 'sign' && isConnected && address && username.trim().length > 0 && (!currentNonce || !currentMessage)) {
      console.log('On sign step but missing nonce/message, triggering fetch')
      refetchNonce()
    }
  }, [authStep, isConnected, address, username, currentNonce, currentMessage, refetchNonce])

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
    
    // If we're on username step and username is not empty, advance to connect step
    if (authStep === 'username' && username.trim().length > 0) {
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
        console.log('Clearing all state including username')
        clearNonceAndMessage()
        clearCurrentUsername() // Only clear username when user explicitly cancels
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
      // Allow closing at any step - users should be able to close the modal
      console.log('Allowing modal to close')
      setOpen(false)
      
      // Only clear nonce/message when closing, keep username stored
      if (authStep !== 'connect') {
        console.log('Clearing nonce/message but keeping username')
        clearNonceAndMessage()
        setIsConnectingFromModal(false)
        setAuthStep('username')
      }
    } else {
      setOpen(true)
    }
  }

  const getStepContent = () => {
    switch (authStep) {
      case 'username':
        return (
          <AuthStepContent
          inputPlaceholder="Enter username"
          inputValue={username}
          onInputChange={handleUsernameChange}
          inputId="username"
          primaryButton={{
            text: "Connect Wallet",
            onClick: handleConnectWallet,
            disabled: username.trim().length === 0,
            className: "bg-[#7400b8] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed"
          }}
          secondaryButton={{
            text: "cancel",
            onClick: handleCancel,
            isLink: true
          }}
        />
      );

      case 'connect':
        return (
          <AuthStepContent
          infoBoxes={[
            {
              type: "green",
              content: (
                <p className="text-sm">
                  <span className="font-semibold">Username:</span> {username}
                </p>
              )
            },
            ...(currentMessage ? [{
              type: "blue" as const,
              content: (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Message you will sign:</span>
                  </p>
                  <p className="text-xs font-mono mt-1 break-all text-blue-700">
                    {currentMessage}
                  </p>
                </>
              )
            }] : []),
            ...(nonceError ? [{
              type: "yellow" as const,
              content: (
                <p className="text-sm">
                  <span className="font-semibold">Note:</span> Using fallback authentication. Backend connection unavailable.
                </p>
              )
            }] : [])
          ]}
          primaryButton={{
            text: "Connect Wallet",
            onClick: handleConnectWallet,
            className: "bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed"
          }}
          secondaryButton={{
            text: "Cancel",
            onClick: handleCancel,
            variant: "outline"
          }}
        />
      );

      case 'sign':
        return (
          <AuthStepContent
          infoBoxes={[
            {
              type: "green",
              content: (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Connected:</span> {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Username:</span> {username}
                  </p>
                </>
              )
            },
            ...(currentMessage ? [{
              type: "blue" as const,
              content: (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Message to sign:</span>
                  </p>
                  <p className="text-xs font-mono mt-1 break-all text-blue-700">
                    {currentMessage}
                  </p>
                </>
              )
            }] : [])
          ]}
          error={error ?? undefined}
          primaryButton={{
            text: loading ? 'Signing...' : 'Sign Message & Login',
            onClick: handleSignAndVerify,
            disabled: loading,
            className: "bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed"
          }}
        />
      );

      case 'complete':
        return (
          <AuthStepContent
          infoBoxes={[
            {
              type: "green",
              content: (
                <p className="text-sm">
                  <span className="font-semibold">Authentication Complete!</span>
                </p>
              )
            }
          ]}
          primaryButton={{
            text: "Close",
            onClick: () => setOpen(false),
            className: "bg-[#00296b] text-white text-md hover:bg-[#00296b]/95"
          }}
        />
      );
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
        return 'Enter a username to continue with wallet authentication.'
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
      <DialogContent className="sm:max-w-[425px] border-gray-800 text-[#202626] max-h-[90vh] overflow-y-auto">
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