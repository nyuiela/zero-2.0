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

  async function getNonce() {
    const result = await fetchNonce();
    return result;
  }

  useEffect(() => {

    // if (nonceData) {
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
        // message: { raw: '0x68656c6c6f20776f726c64' },
        // message: '0x68656c6c6f20776f726c64',
        message,
      })
      // Step 2: Verify signature (zk proof)
      console.log(signature, nonce);
      console.log(signature.slice(2), nonce);
      const verifyRes: any = await verifySignatureMutation.mutateAsync({
        message,
        // message: "0x68656c6c6f20776f726c64",
        // message: "Login",
        signature_bytes: signature,
        expected_addr: address,
        username,
        nonce
      })
      // const verifyRes: any = await verifySignatureMutation.mutateAsync({
      //   message: "Login at 1750465371",
      //   signature_bytes: "5c778bc0c8d1c68b64cfb8a9d3c3796a3f2e4b6c92a4e3d176dfb7be61b7307d4ea2d8e96563bb071c7b9d3f223f5f8198d56f787159d69e6ec8ff49039eb7761b",
      //   expected_addr: "f0830060f836B8d54bF02049E5905F619487989e",
      //   username: "kaleel",
      //   nonce: "7440c859-0c16-4231-8b75-7535471b65fa:1750467617"

      // })
      console.log(verifyRes)
      // Step 3: Get JWT
      // const jwtRes: any = await getJwtMutation.mutateAsync({
      //   receipt: verifyRes.receipt,
      //   stats: verifyRes.stats
      // })
      // Success: set user in Zustand store
      setUser({
        address,
        username,
        jwt: jwtRes.token || 'mock-jwt'
      })
      onClose()
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

      const nonceData = await fetchNonce();
      setNonce(nonceData.nonce)
      setMessage(nonceData.msg)

      await handleSignAndVerify();
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
          // disabled={loading || isConnected}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleButtonClick}
            // disabled={isButtonDisabled()}
            className="w-full"
          >
            {/* Sign and login */}
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