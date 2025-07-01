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
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { parseEther } from "viem"
import ProgressTracker from "./modal/progress-tracker"
import OracleConfigSection from './OracleConfigSection'
import AdminSubscriptionSection from './AdminSubscriptionSection'
import ArgumentsSection from './ArgumentsSection'
import StakeSection from './StakeSection'
import ValidationErrors from './ValidationErrors'
import TransactionError from './TransactionError'
import TransactionHash from './TransactionHash'

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
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showStakeActivateModal, setShowStakeActivateModal] = useState(false)
  const [stakeActivateStep, setStakeActivateStep] = useState(0)
  // const [registeredBrandName, setRegisteredBrandName] = useState<string>('')
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      confirmations: 3,
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
  const steps = ["register", "stake", "activate"]
  const currentBrandName = form.watch("brand")

  const isRegistered = useReadContract({
    abi: registry_abi,
    address: registry_addr,
    account: address,
    functionName: 'getBrandinfo',
    args: [form.watch("brand") || "kal"],
    // enabled: !!form.watch("brand") && form.watch("brand").length > 0 // Remove 'enabled' property if not supported
  })
  console.log("isRegistered for brand:", form.watch("brand"), isRegistered.data)



  const handleRegister = () => {
    const data = form.getValues()
    writeContract({
      address: registry_addr,
      abi: registry_abi,
      functionName: 'registerBrand',
      args: [
        data.brand, // string
        {
          updateInterval: BigInt(data.updateInterval),
          deviationThreshold: BigInt(data.deviationThreshold),
          heartbeat: BigInt(data.heartbeat),
          minAnswer: BigInt(data.minAnswer),
          maxAnswer: BigInt(data.maxAnswer)
        }, // OracleConfig struct
        data.brandAdminAddr, // address
        BigInt(data.subscriptionId), // uint64
        data.stateUrl, // string
        argsArray // string[]
      ],
      account: address
    })
    // setTransactionHash(mockHash)
    // setRegisteredBrandName(data.brand)
    // setStakeActivateStep(0)
    // setShowStakeActivateModal(true)
    // setIsLoading(false)
  }
  // Pre-submit validation function
  const onSubmit = async (data: BrandRegistrationFormData) => {
    setIsLoading(true)
    setError(null)
    setValidationErrors([])
    // Convert args string to array
    const argsArray = data.args.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0)
    try {
      writeContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'registerBrand',
        args: [
          data.brand, // string
          {
            updateInterval: BigInt(data.updateInterval),
            deviationThreshold: BigInt(data.deviationThreshold),
            heartbeat: BigInt(data.heartbeat),
            minAnswer: BigInt(data.minAnswer),
            maxAnswer: BigInt(data.maxAnswer)
          }, // OracleConfig struct
          data.brandAdminAddr, // address
          BigInt(data.subscriptionId), // uint64
          data.stateUrl, // string
          argsArray // string[]
        ],
        account: address
      })
      // Simulate transaction hash - in real implementation, this would come from the transaction
      // const mockHash = "0x" + Math.random().toString(16).substr(2, 64)
      if (isConfirmed) {
        setStakeActivateStep(1)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to submit form ", error)
      setIsLoading(false)
      setError(parseError(error))
    }
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
    if (isError && contractError) {
      const errorMessage = parseError(contractError)
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [isError, contractError])

  // Stake function
  const handleStake = async () => {
    if (!form.getValues("brand")) return
    setError(null)
    try {
      await writeContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'stake',
        args: [form.getValues("brand")],
        value: parseEther(form.getValues("stake") || "0.000000000001"),
        account: address
      })
      isConfirmed && setStakeActivateStep(2)
    } catch (error) {
      setError(parseError(error))
    }
  }

  // Activate function
  const handleActivate = async () => {
    if (!form.getValues("brand")) return
    setError(null)
    try {
      await writeContract({
        address: registry_addr,
        abi: registry_abi,
        functionName: 'activate',
        args: [form.getValues("brand")],
        account: address
      })
      if (isConfirmed) {
        setStakeActivateStep(3)
      }
    } catch (error) {
      setError(parseError(error))
    }
  }

  // Handle modal transaction errors
  useEffect(() => {
    if (isModalError && modalContractError) {
      console.log('Modal contract error detected:', modalContractError)
      const errorMessage = parseError(modalContractError)
      setError(errorMessage)
    }
  }, [isModalError, modalContractError])

  const fillSample = () => {
    form.setValue("brand", "lesscars1");
    form.setValue("updateInterval", "3600");
    form.setValue("deviationThreshold", "5");
    form.setValue("heartbeat", "86400");
    form.setValue("minAnswer", "0");
    form.setValue("maxAnswer", "1000000");
    form.setValue("brandAdminAddr", "0x108f8Df99A5edE55ddA08b545db5F6886dc61d74");
    form.setValue("subscriptionId", "1");
    form.setValue("stateUrl", "https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1");
    form.setValue("args", "arg1, arg2, arg3");
    form.setValue("stake", "1");
  }
  console.log("Open ", showStakeActivateModal)
  return (
    <>
      <ProgressTracker steps={steps} open={showStakeActivateModal} onOpenChange={setShowStakeActivateModal} error={error} modalHash={hash} title={"Complete Brand Registration"} description={""} handleSubmit={[() => onSubmit(form.getValues()), handleStake, handleActivate]} step={stakeActivateStep} isLoading={isPending} button={["Register", "Stake", "Activate"]} message={[
        {
          header: 'Step 1: Register',
          body: `Register "${form.getValues("brand")}" on ZE | RO to drive your customers insane`
        },
        {
          header: 'Step 2: Stake',
          body: `Stake ${form.getValues("stake") || "0.01"} ETH for brand "${form.getValues("brand")}" to complete registration.`
        },
        {
          header: 'Step 3: Activate',
          body: `Activate brand "${form.getValues("brand")}" to make it live on the platform`
        }
        // {/* Stake {form.getValues("stake") || "0.01"} ETH for brand "{registeredBrandName}" to complete registration. */}
      ]} />
      <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">


        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-brand">Brand Registration</CardTitle>
          <CardDescription>
            Register a new car brand with oracle configuration and admin settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => setShowStakeActivateModal(true))}
              className="space-y-6">
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
              <OracleConfigSection form={form} />
              <AdminSubscriptionSection form={form} />
              <ArgumentsSection form={form} addArg={addArg} />
              <StakeSection form={form} />
              <div className="flex flex-col space-y-4 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
                  disabled={showStakeActivateModal}
                >
                  {showStakeActivateModal ? "Processing..." : "Register Brand"}
                </Button>
                <ValidationErrors errors={validationErrors} />
                <TransactionError error={error} />
                <TransactionHash hash={hash} />
                {isConfirming && (
                  <div className="text-center text-sm text-gray-600">
                    Waiting for confirmation...
                  </div>
                )}
              </div>
              {process.env.NODE_ENV === 'development' && (
                <Button type="button" onClick={fillSample}>
                  Fill Sample
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card >


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