"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useWriteContract } from 'wagmi'

interface CustomBtnProps {
  name: string,
  handleSubmit: () => void
}
const CustomBtn = ({ name, }: CustomBtnProps) => {
  const [isLoading, setIsLoading] = useState();
  const { writeContract } = useWriteContract();

  // const handleSubmit = () => {
  //   setIsLoading(true)

  //   // Convert args string to array
  //   const argsArray = data.args.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0)

  //   console.log(data)
  //   try {
  //     writeContract({
  //       address: registry_addr,
  //       abi: registry_abi,
  //       functionName: 'registerBrand',
  //       args: [
  //         data.brand,
  //         {
  //           "updateInterval": data.updateInterval,
  //           "deviationThreshold": data.deviationThreshold,
  //           "heartbeat": data.heartbeat,
  //           "minAnswer": data.minAnswer,
  //           "maxAnswer": data.maxAnswer
  //         },
  //         data.brandAdminAddr,
  //         data.subscriptionId,
  //         data.stateUrl,
  //         argsArray
  //       ],
  //       account: address
  //     })
  //     writeContract({
  //       address: registry_addr,
  //       abi: registry_abi,
  //       functionName: 'stake',
  //       value: parseEther(data.stake),
  //       args: [
  //         data.brand
  //       ],
  //       account: address
  //     })
  //     writeContract({
  //       address: registry_addr,
  //       abi: registry_abi,
  //       functionName: 'activate',
  //       args: [
  //         data.brand
  //       ],
  //       account: address
  //     })

  //     // Simulate transaction hash - in real implementation, this would come from the transaction
  //     // const mockHash = "0x" + Math.random().toString(16).substr(2, 64)
  //     // setTransactionHash(mockHash)

  //     // Show proof modal after successful transaction
  //     // setTimeout(() => {
  //     //   setShowProofModal(true)
  //     // }, 2000)
  //     setIsLoading(false)

  //   } catch (error) {
  //     console.error("Failed to submit form ", error)
  //     setIsLoading(false)
  //   }

  // }

  return (
    <div className="flex justify-end pt-4">
      <Button
        type="submit"
        className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : name ? name : "Register Brand"}
      </Button>
    </div>
  )
}

export default CustomBtn