"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'

interface CustomBtnProps {
  name: string,
  value?: number,
  args: string[],
  functionName: string,
  abi: any,
  account: `0x${string}`,
  address: `0x${string}`,
  data?: any,
  beforeSubmit?: () => void
  // handleSubmit: () => void
}
const CustomBtn = ({ name, args, value, address, account, abi, beforeSubmit }: CustomBtnProps) => {
  const {
    data: hash,
    isPending,
    writeContract
  } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handleSubmit = async () => {

    // console.log(data)
    try {
      if (beforeSubmit) await beforeSubmit();
      writeContract({
        address,
        account,
        abi,
        functionName: 'registerBrand',
        args,
        value: parseEther(value) || undefined
      })

    } catch (error) {
      console.error("Failed to submit form ", error)
    }

  }

  return (
    <div className="flex flex-col justify-end w-full">
      <Button
        type="submit"
        className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6 cursor-pointer"
        disabled={isPending}
        onClick={handleSubmit}
      >
        {isPending ? "Loading..." : name ? name : "Register"}
      </Button>
      {isConfirmed &&
        <p className='text-center text-sm p-2'>Transaction Succesfully : {hash}</p>
      }
    </div>
  )
}

export default CustomBtn