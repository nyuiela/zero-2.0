"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
})

type BrandRegistrationFormData = z.infer<typeof brandRegistrationSchema>

interface BrandRegistrationFormProps {
  onSubmit: (data: Omit<BrandRegistrationFormData, 'args'> & { args: string[] }) => void
  isLoading?: boolean
}

export function BrandRegistrationForm({ onSubmit, isLoading = false }: BrandRegistrationFormProps) {
  const [argsArray, setArgsArray] = useState<string[]>([])

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
    },
  })

  const handleSubmit = (data: BrandRegistrationFormData) => {
    // Convert args string to array
    const argsArray = data.args.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0)

    const formData = {
      ...data,
      args: argsArray,
    }

    onSubmit(formData)
  }

  const addArg = () => {
    const currentArgs = form.getValues("args")
    const newArg = `arg${argsArray.length + 1}`
    const updatedArgs = currentArgs ? `${currentArgs}, ${newArg}` : newArg
    form.setValue("args", updatedArgs)
    setArgsArray([...argsArray, newArg])
  }
  console.log(form)

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-brand">Brand Registration</CardTitle>
        <CardDescription>
          Register a new car brand with oracle configuration and admin settings
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                // onClick={handleConnectWallet}
                className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
                disabled={isLoading}
              >
                {isLoading ? "Fill the form" : "Register Brand"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 