'use client'

import { useState, useEffect } from 'react'
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
import { fetchNonce, verifySignature, getJwt } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/authStore'
import { verificationService } from '@/lib/verificationService'
import { toast } from 'sonner'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [nonce, setNonce] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'username' | 'connect' | 'sign'>('username')

  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()
  const { setUser } = useAuthStore()

  // React Query hooks
  const { data: nonceData, refetch: refetchNonce, isLoading: nonceLoading, isError: nonceError } = useQuery({
    queryKey: ['auth-nonce'],
    queryFn: fetchNonce,
    enabled: isOpen,
  })
  const verifySignatureMutation = useMutation({ mutationFn: verifySignature })
  const getJwtMutation = useMutation({ mutationFn: getJwt })

  // Reset state when modal opens/closes
  useEffect(() => {
    console.log('Modal open/close effect:', { isOpen, isConnected, address })
    if (isOpen) {
      setLoading(false)
      setError(null)
      // If user is already connected, start at sign step
      if (isConnected && address) {
        console.log('User already connected, starting at sign step')
        setStep('sign')
      } else {
        console.log('User not connected, starting at username step')
        setStep('username')
      }
      refetchNonce()
    } else {
      // Reset state when modal closes
      setUsername('')
      setNonce(null)
      setMessage(null)
      setLoading(false)
      setError(null)
      setStep('username')
    }
  }, [isOpen, refetchNonce, isConnected, address])

  // Reset state when wallet disconnects
  useEffect(() => {
    console.log('Wallet disconnect effect:', { isConnected, step })
    if (!isConnected) {
      setStep('username')
      setLoading(false)
      setError(null)
    }
  }, [isConnected])

  // Handle nonce data or generate fallback message
  useEffect(() => {
    console.log('Nonce effect:', { nonceData, nonceError, nonceLoading })
    if (nonceData) {
      // Backend responded successfully
      setNonce(nonceData.nonce)
      setMessage(nonceData.msg)
    } else if (nonceError || (!nonceLoading && !nonceData)) {
      // Backend failed or didn't respond - generate fallback message
      const timestamp = new Date().toISOString()
      const fallbackNonce = `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const fallbackMessage = `Login at ${timestamp}`
      
      setNonce(fallbackNonce)
      setMessage(fallbackMessage)
      
      console.log('Using fallback authentication message:', fallbackMessage)
    }
  }, [nonceData, nonceError, nonceLoading])

  // Auto-advance to connect step when username is valid and message is ready
  useEffect(() => {
    console.log('Username validation effect:', { username: username.length, message: !!message, step })
    if (username.length >= 4 && message && step === 'username') {
      console.log('Auto-advancing to connect step')
      setStep('connect')
    }
  }, [username, message, step])

  // Auto-advance to sign step when wallet is connected
  useEffect(() => {
    console.log('Wallet connection effect:', { isConnected, step, address })
    if (isConnected && step === 'connect') {
      console.log('Auto-advancing to sign step')
      setStep('sign')
    }
  }, [isConnected, step])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      verificationService.stopAllPolling()
    }
  }, [])

  const handleConnectWallet = () => {
    console.log('Opening connect modal')
    openConnectModal?.()
  }

  const handleSignAndVerify = async () => {
    console.log('Starting sign and verify process')
    if (!message || !nonce || !address || !username) {
      setError('Missing required information for signing.')
      return
    }
    try {
      setLoading(true)
      setError(null)
      
      console.log('Signing message:', message)
      const signature = await signMessageAsync({
        message,
      })
      
      console.log('Signature received:', signature)
      
      // Step 1: Start verification (returns immediately with status)
      const verifyRes: any = await verifySignatureMutation.mutateAsync({
        message,
        signature_bytes: signature,
        expected_addr: address,
        username,
        nonce
      })
      
      console.log('Verification response:', verifyRes)
      
      // Check if verification is complete or needs polling
      if (verifyRes.verified === true) {
        // Verification completed immediately
        const jwtRes: any = await getJwtMutation.mutateAsync({
          receipt: verifyRes.receipt,
          stats: verifyRes.stats
        })
        
        setUser({
          address,
          username,
          jwt: jwtRes.token || 'mock-jwt',
          verified: true
        })
        
        toast.success('Login successful!', {
          description: 'Your account has been verified.',
        })
        
        onClose()
      } else if (verifyRes.verificationId) {
        // Verification in progress, start polling using service
        verificationService.startPolling(
          verifyRes.verificationId,
          {
            onComplete: async (status) => {
              // Get JWT with the completed verification
              const jwtRes: any = await getJwtMutation.mutateAsync({
                receipt: status.receipt,
                stats: status.stats
              })
              
              // Update user with JWT
              setUser({
                address,
                username,
                jwt: jwtRes.token || 'mock-jwt',
                verified: true
              })
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
          jwt: 'pending-verification',
          verified: false
        })
        
        toast.info('Login successful!', {
          description: 'Identity verification in progress...',
        })
        
        onClose()
      } else {
        throw new Error('Unexpected verification response')
      }
      
    } catch (err: any) {
      setError(err?.message || 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStepContent = () => {
    switch (step) {
      case 'username':
        return (
          <div className="space-y-4">
            <Input
              id="username"
              placeholder="Enter username (min 4 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-700 text-[#202626]"
            />
            {username.length > 0 && username.length < 4 && (
              <p className="text-red-500 text-sm">Username must be at least 4 characters</p>
            )}
            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Message you will sign:</span>
                </p>
                <p className="text-blue-700 text-xs font-mono mt-1 break-all">
                  {message}
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
            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Message you will sign:</span>
                </p>
                <p className="text-blue-700 text-xs font-mono mt-1 break-all">
                  {message}
                </p>
              </div>
            )}
            <Button
              onClick={handleConnectWallet}
              className="w-full bg-amber-400 text-white text-xl hover:bg-amber-600"
            >
              Connect Wallet
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
            </div>
            
            {/* Username input if not already set */}
            {!username && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <Input
                  id="username"
                  placeholder="Enter username (min 4 characters)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-gray-700 text-[#202626]"
                />
                {username.length > 0 && username.length < 4 && (
                  <p className="text-red-500 text-sm mt-1">Username must be at least 4 characters</p>
                )}
              </div>
            )}
            
            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Message to sign:</span>
                </p>
                <p className="text-blue-700 text-xs font-mono mt-1 break-all">
                  {message}
                </p>
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={handleSignAndVerify}
              disabled={loading || !username || username.length < 4}
              className="w-full bg-amber-400 text-white text-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing...' : 'Sign Message & Login'}
            </Button>
          </div>
        )
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'username':
        return 'Enter Username'
      case 'connect':
        return 'Connect Wallet'
      case 'sign':
        return 'Sign Message'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 'username':
        return 'Enter a username (min 4 chars) to continue with wallet authentication.'
      case 'connect':
        return 'Connect your wallet to proceed with the login process.'
      case 'sign':
        return 'Sign the message with your wallet to complete authentication.'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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