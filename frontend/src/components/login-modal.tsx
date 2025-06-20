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

    useEffect(() => {
        if (nonceData) {
            setNonce(nonceData.token)
            setMessage(nonceData.msg)
            setLoading(false)
        }
    }, [nonceData])

    const handleSignAndVerify = async () => {
        if (!message || !nonce || !address || !username) {
            setError('Missing required information for signing.')
            return
        }
        try {
            setLoading(true)
            setError(null)
            const signature = await signMessageAsync({ message })
            // Step 2: Verify signature (zk proof)
            const verifyRes: any = await verifySignatureMutation.mutateAsync({
                message,
                signature_bytes: signature,
                expected_addr: address,
                username,
                nonce
            })
            // Step 3: Get JWT
            const jwtRes: any = await getJwtMutation.mutateAsync({
                receipt: verifyRes.receipt,
                stats: verifyRes.stats
            })
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

    const handleButtonClick = () => {
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
                        disabled={loading || isConnected}
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