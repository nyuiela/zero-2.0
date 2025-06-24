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

  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { openConnectModal } = useConnectModal()
  const { setUser } = useAuthStore()

  // React Query hooks
  const { data: nonceData, refetch: refetchNonce, isLoading: nonceLoading } = useQuery({
    queryKey: ['auth-nonce'],
    queryFn: fetchNonce,
    enabled: isOpen,
  })
  const verifySignatureMutation = useMutation({ mutationFn: verifySignature })
  const getJwtMutation = useMutation({ mutationFn: getJwt })

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLoading(false)
      setError(null)
      refetchNonce()
    } else {
      // Reset state when modal closes
      setUsername('')
      setNonce(null)
      setMessage(null)
      setLoading(false)
      setError(null)
    }
  }, [isOpen, refetchNonce])

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setUsername('')
      setNonce(null)
      setMessage(null)
      setLoading(false)
      setError(null)
    }
  }, [isConnected])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      verificationService.stopAllPolling()
    }
  }, [])

  useEffect(() => {
    if (nonceData) {
      setNonce(nonceData.nonce)
      setMessage(nonceData.msg)
      setLoading(false)
    }
  }, [nonceData])

  const handleSignAndVerify = async () => {
    console.log(message, nonce, address, username)
    if (!message || !nonce || !address || !username) {
      setError('Missing required information for signing.')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const signature = await signMessageAsync({
        message,
      })
      
      // Step 1: Start verification (returns immediately with status)
      console.log(signature, nonce);
      console.log(signature.slice(2), nonce);
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

  const handleButtonClick = async () => {
    if (!isConnected) {
      openConnectModal?.()
    } else {
      handleSignAndVerify()
    }
  }

  const isButtonDisabled = () => {
    if (loading) return true
    if (!isConnected) return username.length < 4
    return !message
  }

  const getButtonText = () => {
    if (loading) return 'Loading...'
    if (!isConnected) return 'Connect Wallet'
    return 'Sign & Login'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Login to Bid</DialogTitle>
          <DialogDescription>
            Enter a username (min 4 chars) and sign in with your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleButtonClick}
            disabled={isButtonDisabled()}
            className="w-full"
          >
            {getButtonText()}
          </Button>
          {isConnected && (
            <p className="text-sm text-center text-green-400">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 