"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { registry_abi, registry_addr } from "../lib/abi/abi"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { ProofModal } from "./proof-modal"
import { parseEther } from "viem"

// Validation schema for the form
const brandRegistrationSchema = z.object({
  brand: z.string().min(1, "Brand name is required"),
  updateInterval: z.string().min(1, "Update interval is required"),
  deviationThreshold: z.string().min(1, "Deviation threshold is required"),
  heartbeat: z.string().min(1, "Heartbeat is required"),
  minAnswer: z.string().min(1, "Minimum answer is required"),
  maxAnswer: z.string().min(1, "Maximum answer is required"),
  brandAdminAddr: z.string().min(42, "Valid Ethereum address required").max(42),
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  stateUrl: z.string().url("Valid URL required"),
  args: z.string().min(1, "Arguments are required"),
  stake: z.string().min(1, "Stake amount is required"),
})

export type BrandRegistrationFormData = z.infer<typeof brandRegistrationSchema>

// interface BrandRegistrationFormProps {
//   onSubmit: (data: Omit<BrandRegistrationFormData, 'args'> & { args: string[] }) => void
//   isLoading?: boolean
// }

export function BrandSearch() {
  const [argsArray, setArgsArray] = useState<string[]>([])
  const {
    data: hash,
    isPending,
    writeContract
  } = useWriteContract()
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const isRegistered = useReadContract({
    abi: registry_abi,
    address: registry_addr,
    account: address,
    functionName: 'getBrandinfo',
    args: ["kal"]
  })
  console.log("isRegistered ", isRegistered.data)

  // Sample proof data - in real implementation, this would come from the transaction
  const sampleProof: ProofData = {
    receipt: {
      inner: {
        "Fake": {
          "claim": {
            "Value": {
              "exit_code": {
                "Halted": 0
              },
              "input": {
                "Pruned": [0, 0, 0, 0, 0, 0, 0, 0]
              },
              "output": {
                "Value": {
                  "assumptions": {
                    "Value": []
                  },
                  "journal": {
                    "Value": [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
                  }
                }
              },
              "post": {
                "Value": {
                  "merkle_root": [0, 0, 0, 0, 0, 0, 0, 0],
                  "pc": 0
                }
              },
              "pre": {
                "Value": {
                  "merkle_root": [1355755649, 145095981, 1945602564, 1827369077, 346262116, 1637052400, 1857755399, 1497292232],
                  "pc": 0
                }
              }
            }
          }
        }
      },
      journal: {
        bytes: [1, 0, 0, 0, 42, 0, 0, 0, 48, 120, 100, 53, 55, 98, 55, 102, 98, 48, 52, 55, 48, 53, 102, 50, 51, 53, 98, 55, 100, 50, 56, 48, 54, 54, 98, 51, 57, 53, 51, 48, 99, 51, 53, 55, 97, 98, 97, 98, 101, 52, 0, 0, 206, 113, 92, 104, 0, 0, 0, 0, 6, 0, 0, 0, 107, 97, 108, 101, 101, 108, 0, 0]
      },
      metadata: {
        verifier_parameters: [0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    stats: {
      paging_cycles: 227651,
      reserved_cycles: 519606,
      segments: 10,
      total_cycles: 9961472,
      user_cycles: 9214215
    }
  }

  const form = useForm<BrandRegistrationFormData>({
    resolver: zodResolver(brandRegistrationSchema),
    defaultValues: {
      brand: "",
      updateInterval: "",
      deviationThreshold: "",
      heartbeat: "",
      minAnswer: "",
      maxAnswer: "",
      brandAdminAddr: "",
      subscriptionId: "",
      stateUrl: "",
      args: "",
      stake: ""
    },
  })

  const onSubmit = (data: BrandRegistrationFormData) => {
    setIsLoading(true)

    // Convert args string to array
    const argsArray = data.args.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0)

    console.log(data)
    try {
      writeContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'registerBrand',
        args: [
          data.brand,
          {
            "updateInterval": data.updateInterval,
            "deviationThreshold": data.deviationThreshold,
            "heartbeat": data.heartbeat,
            "minAnswer": data.minAnswer,
            "maxAnswer": data.maxAnswer
          },
          data.brandAdminAddr,
          data.subscriptionId,
          data.stateUrl,
          argsArray
        ],
        account: address
      })
      // writeContract({
      //   address: registry_addr,
      //   abi: registry_abi,
      //   functionName: 'stake',
      //   value: parseEther(data.stake),
      //   args: [
      //     data.brand
      //   ],
      //   account: address
      // })
      // writeContract({
      //   address: registry_addr,
      //   abi: registry_abi,
      //   functionName: 'activate',
      //   args: [
      //     data.brand
      //   ],
      //   account: address
      // })

      // Simulate transaction hash - in real implementation, this would come from the transaction
      // const mockHash = "0x" + Math.random().toString(16).substr(2, 64)
      // setTransactionHash(mockHash)

      // Show proof modal after successful transaction
      // setTimeout(() => {
      //   setShowProofModal(true)
      // }, 2000)
      setIsLoading(false)

    } catch (error) {
      console.error("Failed to submit form ", error)
      setIsLoading(false)
    }
  }

  const addArg = () => {
    const currentArgs = form.getValues("args")
    const newArg = `arg${argsArray.length + 1}`
    const updatedArgs = currentArgs ? `${currentArgs}, ${newArg}` : newArg
    form.setValue("args", updatedArgs)
    setArgsArray([...argsArray, newArg])
  }

  return (
    <>


      {/* Proof Modal */}
      <ProofModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        proof={sampleProof}
        transactionHash={transactionHash}
      />
    </>
  )
}

interface ProofData {
  receipt: {
    inner: { /* proof structure */ }
    journal: { bytes: number[] }
    metadata: { verifier_parameters: number[] }
  }
  stats: {
    total_cycles: number
    user_cycles: number
    paging_cycles: number
    reserved_cycles: number
    segments: number
  }
} 