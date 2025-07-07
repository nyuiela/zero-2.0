"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { registry_abi, registry_addr } from '@/lib/abi/abi'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface StakeButtonProps {
  onStake?: () => void
  stakeAmount?: string
  brandName?: string
  className?: string
}

// Enhanced error parsing function
const parseError = (error: any): string => {
  console.log('=== PARSING ERROR ===')
  console.log('Error object:', error)
  console.log('Error type:', typeof error)
  console.log('Error constructor:', error?.constructor?.name)
  console.log('Error message:', error?.message)
  console.log('Error name:', error?.name)
  console.log('Error cause:', error?.cause)
  console.log('Error details:', error?.details)
  console.log('Error reason:', error?.reason)
  console.log('Error code:', error?.code)
  console.log('Error data:', error?.data)
  console.log('====================')

  if (error?.message?.includes("execution reverted")) {
    // Try to extract revert reason
    const revertReason = error.message.match(/reason: (.+)/)?.[1] ||
      error.message.match(/reverted: (.+)/)?.[1] ||
      error.message.match(/reverted with reason: (.+)/)?.[1] ||
      error.message.match(/execution reverted: (.+)/)?.[1]

    if (revertReason) {
      return `Transaction failed: ${revertReason}`
    }

    // Check for common revert patterns
    if (error.message.includes("Brand already exists")) {
      return "Brand name already exists. Please choose a different name."
    }
    if (error.message.includes("Invalid admin address")) {
      return "Invalid brand admin address. Please check the address format."
    }
    if (error.message.includes("Insufficient stake")) {
      return "Insufficient stake amount. Please increase the stake value."
    }
    if (error.message.includes("Invalid subscription")) {
      return "Invalid subscription ID. Please verify the Chainlink VRF subscription."
    }

    return "Transaction failed: Contract execution reverted"
  }

  if (error?.message?.includes("insufficient funds")) {
    return "Insufficient ETH for gas fees. Please add more ETH to your wallet."
  }

  if (error?.message?.includes("user rejected")) {
    return "Transaction was cancelled by user"
  }

  if (error?.message?.includes("nonce too low")) {
    return "Transaction nonce error. Please try again."
  }

  if (error?.message?.includes("gas required exceeds allowance")) {
    return "Gas limit too low. Please try with higher gas limit."
  }

  // Handle wagmi specific errors
  if (error?.name === "ContractFunctionExecutionError") {
    return `Contract error: ${error.message}`
  }

  if (error?.name === "UserRejectedRequestError") {
    return "Transaction was rejected by user"
  }

  if (error?.name === "SwitchChainError") {
    return "Network switch error. Please switch to Base Sepolia network."
  }

  if (error?.name === "ConnectorNotFoundError") {
    return "Wallet not connected. Please connect your wallet first."
  }

  return `Transaction failed: ${error?.message || 'Unknown error'}`
}

export default function StakeButton({ 
  onStake, 
  stakeAmount = "0.0000005", 
  brandName = "default_brand",
  className = ""
}: StakeButtonProps) {
  const { address } = useAccount()
  const [isStaking, setIsStaking] = useState(false)
  
  const {
    data: hash,
    isPending,
    writeContract,
    error: contractError,
    isError
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      confirmations: 3,
      hash,
    })

  const handleStake = async () => {
    if (!address) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsStaking(true)
    try {
      writeContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'stake',
        args: [brandName],
        value: parseEther(stakeAmount),
        account: address
      })
      
      if (onStake) {
        onStake()
      }
    } catch (error) {
      console.error('Stake error:', error)
      toast.error("Staking failed", {
        description: parseError(error),
        duration: 5000,
      })
    } finally {
      setIsStaking(false)
    }
  }

  // Handle contract errors from wagmi
  if (isError && contractError) {
    const errorMessage = parseError(contractError)
    toast.error("Staking failed", {
      description: errorMessage,
      duration: 5000,
    })
  }

  // Handle successful stake
  if (isConfirmed) {
    toast.success("Stake successful!", {
      description: `Successfully staked ${stakeAmount} ETH for ${brandName}`,
      duration: 5000,
    })
  }

  return (
    <Button
      onClick={handleStake}
      disabled={isPending || isStaking || !address}
      className={`w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6 ${className}`}
    >
      {isPending || isStaking ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Staking...
        </div>
      ) : (
        `Stake ${stakeAmount} ETH`
      )}
    </Button>
  )
} 