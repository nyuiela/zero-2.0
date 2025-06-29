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

export function BrandRegistrationForm() {
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

  const onSubmit = async (data: BrandRegistrationFormData) => {
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
      const mockHash = "0x" + Math.random().toString(16).substr(2, 64)
      setTransactionHash(mockHash)

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
      <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-brand">Brand Registration</CardTitle>
          <CardDescription>
            Register a new car brand with oracle configuration and admin settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Brand Name */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brand name (e.g., Toyota, BMW)" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the car brand to register
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Oracle Configuration Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand">Oracle Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="updateInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Update Interval (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3600" {...field} />
                        </FormControl>
                        <FormDescription>
                          How often the oracle should update prices
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deviationThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deviation Threshold (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum allowed price deviation before triggering update
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heartbeat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heartbeat (seconds)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="86400" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum time between updates before considering stale
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Answer</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Minimum acceptable oracle answer value
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxAnswer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Answer</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1000000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum acceptable oracle answer value
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Admin and Subscription Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand">Admin & Subscription</h3>

                <FormField
                  control={form.control}
                  name="brandAdminAddr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Admin Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          {...field}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormDescription>
                        Ethereum address of the brand administrator
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription ID</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Chainlink VRF subscription ID for random number generation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stateUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://api.example.com/brand-state"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL where the brand state information is stored
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Arguments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand">Arguments</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addArg}
                  >
                    Add Argument
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="args"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arguments (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="arg1, arg2, arg3"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional arguments for the oracle request (comma-separated)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stake */}

              <FormField
                control={form.control}
                name="stake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stake Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Stake USDC as collateral for any damages or misbehavior
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
                  disabled={isPending}
                >
                  {isPending ? "Registering Brand..." : "Register Brand"}

                </Button>
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

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