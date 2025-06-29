"use client"

import { useState, useEffect } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
    writeContract,
    error: contractError,
    isError
  } = useWriteContract()
  
  // Separate writeContract for modal transactions
  const {
    data: modalHash,
    isPending: isModalPending,
    writeContract: writeModalContract,
    error: modalContractError,
    isError: isModalError
  } = useWriteContract()
  
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showStakeActivateModal, setShowStakeActivateModal] = useState(false)
  const [stakeActivateStep, setStakeActivateStep] = useState<'stake' | 'activate'>('stake')
  const [registeredBrandName, setRegisteredBrandName] = useState<string>('')
  const [modalTransactionHash, setModalTransactionHash] = useState<string>('')
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

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

  // Get current brand name from form
  const currentBrandName = form.watch("brand")

  const isRegistered = useReadContract({
    abi: registry_abi,
    address: registry_addr,
    account: address,
    functionName: 'getBrandinfo',
    args: [form.watch("brand") || "kal"],
    enabled: !!form.watch("brand") && form.watch("brand").length > 0
  })
  console.log("isRegistered for brand:", form.watch("brand"), isRegistered.data)

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

  // Pre-submit validation function
  const validateFormData = (data: BrandRegistrationFormData): string[] => {
    const errors: string[] = []
    
    // Brand name validation
    if (!data.brand || data.brand.trim().length < 2) {
      errors.push("Brand name must be at least 2 characters long")
    }
    if (data.brand && data.brand.length > 50) {
      errors.push("Brand name must be less than 50 characters")
    }
    
    // Admin address validation
    if (!data.brandAdminAddr || !data.brandAdminAddr.startsWith("0x") || data.brandAdminAddr.length !== 42) {
      errors.push("Invalid brand admin address format")
    }
    if (data.brandAdminAddr === "0x0000000000000000000000000000000000000000") {
      errors.push("Brand admin address cannot be zero address")
    }
    
    // Oracle configuration validation
    const updateInterval = parseInt(data.updateInterval)
    if (isNaN(updateInterval) || updateInterval < 1 || updateInterval > 86400) {
      errors.push("Update interval must be between 1 and 86400 seconds")
    }
    
    const deviationThreshold = parseInt(data.deviationThreshold)
    if (isNaN(deviationThreshold) || deviationThreshold < 0 || deviationThreshold > 100) {
      errors.push("Deviation threshold must be between 0 and 100 percent")
    }
    
    const heartbeat = parseInt(data.heartbeat)
    if (isNaN(heartbeat) || heartbeat < 1 || heartbeat > 604800) {
      errors.push("Heartbeat must be between 1 and 604800 seconds (1 week)")
    }
    
    const minAnswer = parseInt(data.minAnswer)
    const maxAnswer = parseInt(data.maxAnswer)
    if (isNaN(minAnswer) || isNaN(maxAnswer) || minAnswer >= maxAnswer) {
      errors.push("Minimum answer must be less than maximum answer")
    }
    
    // Subscription ID validation
    const subscriptionId = parseInt(data.subscriptionId)
    if (isNaN(subscriptionId) || subscriptionId < 1) {
      errors.push("Subscription ID must be a positive number")
    }
    
    // State URL validation
    if (!data.stateUrl || !data.stateUrl.startsWith("http")) {
      errors.push("State URL must be a valid HTTP/HTTPS URL")
    }
    
    // Stake validation
    const stake = parseFloat(data.stake)
    if (isNaN(stake) || stake <= 0) {
      errors.push("Stake amount must be a positive number")
    }
    
    return errors
  }

  const onSubmit = async (data: BrandRegistrationFormData) => {
    // Clear previous errors
    setError(null)
    setValidationErrors([])
    
    // Pre-submit validation
    const validationErrors = validateFormData(data)
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors)
      console.log('Validation errors:', validationErrors)
      return
    }
    
    setIsLoading(true)

    // Convert args string to array
    const argsArray = data.args.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0)

    console.log('Submitting brand registration:', data)
    console.log('Calling writeContract with args:', [
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
    ])
    
    // Call writeContract - this doesn't throw errors, they come through the hook
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
    
    // Note: We don't set isLoading to false here because wagmi handles the loading state
    // The error will be caught by the useEffect below
  }

  const addArg = () => {
    const currentArgs = form.getValues("args")
    const newArg = `arg${argsArray.length + 1}`
    const updatedArgs = currentArgs ? `${currentArgs}, ${newArg}` : newArg
    form.setValue("args", updatedArgs)
    setArgsArray([...argsArray, newArg])
  }

  // Handle contract errors from wagmi
  useEffect(() => {
    console.log('=== WAGMI STATE DEBUG ===')
    console.log('isError:', isError)
    console.log('contractError:', contractError)
    console.log('isPending:', isPending)
    console.log('hash:', hash)
    console.log('isConfirmed:', isConfirmed)
    console.log('showStakeActivateModal:', showStakeActivateModal)
    console.log('========================')
    
    if (isError && contractError) {
      console.log('Contract error detected:', contractError)
      console.log('Error details:', {
        name: contractError.name,
        message: contractError.message,
        cause: contractError.cause,
        stack: contractError.stack
      })
      
      const errorMessage = parseError(contractError)
      setError(errorMessage)
      setIsLoading(false) // Reset loading state on error
    }
    
    // If we get a hash, transaction was submitted successfully
    if (hash) {
      console.log('Transaction submitted successfully with hash:', hash)
      setIsLoading(false)
      
      // Show stake/activate modal immediately after transaction submission
      if (!showStakeActivateModal) {
        console.log('Registration submitted, showing stake/activate modal')
        const formData = form.getValues()
        setRegisteredBrandName(formData.brand)
        setShowStakeActivateModal(true)
        console.log('Modal state set to true, brand name:', formData.brand)
      } else {
        console.log('Modal already showing, not opening again')
      }
    }
  }, [isError, contractError, isPending, hash, form, showStakeActivateModal])

  // Stake function
  const handleStake = async () => {
    if (!registeredBrandName) return
    
    console.log('Staking for brand:', registeredBrandName)
    setError(null) // Clear previous errors
    
    writeModalContract({
      address: registry_addr,
      abi: registry_abi,
      functionName: 'stake',
      args: [registeredBrandName],
      value: parseEther(form.getValues("stake") || "0.000000000001"), // Use form stake amount or default
      account: address
    })
  }

  // Activate function
  const handleActivate = async () => {
    if (!registeredBrandName) return
    
    console.log('Activating brand:', registeredBrandName)
    setError(null) // Clear previous errors
    
    writeModalContract({
      address: registry_addr,
      abi: registry_abi,
      functionName: 'activate',
      args: [registeredBrandName],
      account: address
    })
  }

  // Handle stake/activate success
  useEffect(() => {
    if (modalHash && showStakeActivateModal) {
      console.log('Modal transaction completed, step:', stakeActivateStep)
      if (stakeActivateStep === 'stake') {
        // Stake completed, move to activate step
        console.log('Stake completed, moving to activate step')
        setStakeActivateStep('activate')
      } else if (stakeActivateStep === 'activate') {
        // Activate completed, close modal
        console.log('Activate completed, closing modal')
        setShowStakeActivateModal(false)
        setStakeActivateStep('stake')
        setRegisteredBrandName('')
        setModalTransactionHash('')
      }
    }
  }, [modalHash, showStakeActivateModal, stakeActivateStep])

  // Handle modal transaction errors
  useEffect(() => {
    if (isModalError && modalContractError) {
      console.log('Modal contract error detected:', modalContractError)
      const errorMessage = parseError(modalContractError)
      setError(errorMessage)
    }
  }, [isModalError, modalContractError])

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
              <div className="flex flex-col space-y-4 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
                  disabled={isPending}
                >
                  {isPending ? "Registering Brand..." : "Register Brand"}
                </Button>
                
                {/* Debug Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log('Debug: Manually opening modal')
                    setRegisteredBrandName('TestBrand')
                    setShowStakeActivateModal(true)
                  }}
                  className="text-xs"
                >
                  Debug: Test Modal
                </Button>
                
                {/* Validation Errors Display */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-semibold text-sm mb-2">Please fix the following errors:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Transaction Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-red-800 font-semibold text-sm mb-2">Transaction Error:</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                {hash && (
                  <div className="text-center">
                    <a 
                      href={`https://sepolia.basescan.org/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                      Transaction Hash: {hash}
                    </a>
                  </div>
                )}
                
                {isConfirming && (
                  <div className="text-center text-sm text-gray-600">
                    Waiting for confirmation...
                  </div>
                )}
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

      {/* Stake/Activate Modal */}
      <Dialog open={showStakeActivateModal} onOpenChange={setShowStakeActivateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00296b]">
              Complete Brand Registration
            </DialogTitle>
            <DialogDescription>
              Complete the registration process by staking and activating your brand
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress Tracker */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                stakeActivateStep === 'stake' 
                  ? 'bg-[#00296b] text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${
                stakeActivateStep === 'stake' ? 'text-[#00296b]' : 'text-green-600'
              }`}>
                Stake
              </span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-4">
              <div className={`h-full transition-all duration-300 ${
                stakeActivateStep === 'activate' ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ width: stakeActivateStep === 'activate' ? '100%' : '0%' }}></div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                stakeActivateStep === 'activate' 
                  ? 'bg-[#00296b] text-white' 
                  : stakeActivateStep === 'stake' 
                    ? 'bg-gray-200 text-gray-500' 
                    : 'bg-green-500 text-white'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${
                stakeActivateStep === 'activate' ? 'text-[#00296b]' : 'text-gray-500'
              }`}>
                Activate
              </span>
            </div>
          </div>
          
          {/* Step Content */}
          <div className="space-y-4">
            {stakeActivateStep === 'stake' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-800 font-semibold text-sm mb-2">Step 1: Stake</h4>
                  <p className="text-blue-700 text-sm">
                    Stake {form.getValues("stake") || "0.01"} ETH for brand "{registeredBrandName}" to complete registration.
                  </p>
                </div>
                
                <Button
                  onClick={handleStake}
                  disabled={isModalPending}
                  className="w-full bg-[#00296b] text-white hover:bg-[#00296b]/95 disabled:opacity-50"
                >
                  {isModalPending ? "Staking..." : "Stake Brand"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-green-800 font-semibold text-sm mb-2">Step 2: Activate</h4>
                  <p className="text-green-700 text-sm">
                    Activate brand "{registeredBrandName}" to make it live on the platform.
                  </p>
                </div>
                
                <Button
                  onClick={handleActivate}
                  disabled={isModalPending}
                  className="w-full bg-[#00296b] text-white hover:bg-[#00296b]/95 disabled:opacity-50"
                >
                  {isModalPending ? "Activating..." : "Activate Brand"}
                </Button>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h4 className="text-red-800 font-semibold text-sm mb-2">Error:</h4>
              <p className="text-red-700 text-sm">An erorr occured try again</p>
            </div>
          )}
          
          {/* Transaction Hash */}
          {modalHash && (
            <div className="text-center mt-4">
              <a 
                href={`https://sepolia.basescan.org/tx/${modalHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                View Transaction: {modalHash.slice(0, 10)}...{modalHash.slice(-8)}
              </a>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowStakeActivateModal(false)
                setStakeActivateStep('stake')
                setRegisteredBrandName('')
                setError(null)
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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