"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, CheckCircle, Upload, FileText, Gavel } from "lucide-react"
import Step1BasicInfo from "@/components/sell/step-1-basic-info"
import Step2DetailedInfo from "@/components/sell/step-2-detailed-info"
import Step3AuctionLegal from "@/components/sell/step-3-auction-legal"
import SampleDataButton from "@/components/sell/sample-data-button"
import { CarFormData } from "@/lib/types/car"
import { useAuthStore } from "@/lib/authStore"
import { getJwtToken } from "@/lib/utils"
import { createCar } from "@/lib/api/car"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { zero_abi, zero_addr } from "@/lib/abi/abi"

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Vehicle details and images",
    icon: Upload,
    component: Step1BasicInfo
  },
  {
    id: 2,
    title: "Detailed Information",
    description: "Specifications and features",
    icon: FileText,
    component: Step2DetailedInfo
  },
  {
    id: 3,
    title: "Auction & Legal",
    description: "Pricing and seller details",
    icon: Gavel,
    component: Step3AuctionLegal
  }
]

// Type for form errors that supports nested objects
type FormErrors = Record<string, string[] | Record<string, string[]>>

export default function SellYourCarPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const {
    data: hash,
    isPending,
    writeContract
  } = useWriteContract()
  const { address } = useAccount()
  // const [isLoading, setIsLoading] = useState(false)
  // const [showProofModal, setShowProofModal] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<CarFormData>>({
    images: [],
    highlight: [],
    included: [],
    features: {
      exterior: [],
      interior: [],
      mechanical: []
    },
    specifications: {
      engine_size: '',
      transmission: '',
      fuel_type: '',
      exterior_color: '',
      interior_color: '',
      mileage: 0,
      odometer: 0,
      vin: ''
    },
    report: {
      condition: '',
      inspection: '',
      notes: ''
    }
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const { user } = useAuthStore()

  // Calculate progress based on completed steps (not current step)
  const completedSteps = Math.max(0, currentStep - 1) // Step 1 = 0 completed, Step 2 = 1 completed, etc.
  const progress = (completedSteps / steps.length) * 100

  const handleDataChange = (newData: Partial<CarFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }))
    // Clear errors when data changes
    setErrors({})
  }

  const handleSampleDataFill = (sampleData: Partial<CarFormData>) => {
    setFormData(sampleData)
    setErrors({})
    toast.success('Form filled with sample data!', {
      description: 'You can now review and modify the information as needed.',
    })
  }

  const validateStep = (step: number): boolean => {
    const stepErrors: FormErrors = {}

    switch (step) {
      case 1:
        if (!formData.year || formData.year < 1900) {
          stepErrors.year = ['Valid year is required']
        }
        if (!formData.make?.trim()) {
          stepErrors.make = ['Make is required']
        }
        if (!formData.model?.trim()) {
          stepErrors.model = ['Model is required']
        }
        if (!formData.lot?.trim()) {
          stepErrors.lot = ['Lot number is required']
        }
        if (!formData.location?.trim()) {
          stepErrors.location = ['Location is required']
        }
        if (!formData.country?.trim()) {
          stepErrors.country = ['Country is required']
        }
        if (!formData.images || formData.images.length === 0) {
          stepErrors.images = ['At least one image is required']
        }
        break

      case 2:
        if (!formData.description?.trim()) {
          stepErrors.description = ['Description is required']
        }
        if (!formData.summary?.trim()) {
          stepErrors.summary = ['Summary is required']
        }
        if (!formData.vehicale_overview?.trim()) {
          stepErrors.vehicale_overview = ['Vehicle overview is required']
        }
        if (!formData.specifications?.engine_size?.trim()) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), engine_size: ['Engine size is required'] }
        }
        if (!formData.specifications?.transmission?.trim()) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), transmission: ['Transmission is required'] }
        }
        if (!formData.specifications?.fuel_type?.trim()) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), fuel_type: ['Fuel type is required'] }
        }
        if (!formData.specifications?.exterior_color?.trim()) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), exterior_color: ['Exterior color is required'] }
        }
        if (!formData.specifications?.interior_color?.trim()) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), interior_color: ['Interior color is required'] }
        }
        if (!formData.specifications?.mileage || formData.specifications.mileage < 0) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), mileage: ['Valid mileage is required'] }
        }
        if (!formData.specifications?.odometer || formData.specifications.odometer < 0) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), odometer: ['Valid odometer reading is required'] }
        }
        if (!formData.specifications?.vin?.trim()) {
          stepErrors.specifications = { ...(stepErrors.specifications || {}), vin: ['VIN is required'] }
        }
        break

      case 3:
        if (!formData.starting_price || formData.starting_price <= 0) {
          stepErrors.starting_price = ['Valid starting price is required']
        }
        if (!formData.current_price || formData.current_price <= 0) {
          stepErrors.current_price = ['Valid current price is required']
        }
        if (!formData.seller?.trim()) {
          stepErrors.seller = ['Seller name is required']
        }
        if (!formData.seller_type?.trim()) {
          stepErrors.seller_type = ['Seller type is required']
        }
        if (!formData.owner?.trim()) {
          stepErrors.owner = ['Owner is required']
        }
        if (!formData.report?.condition?.trim()) {
          stepErrors.report = { ...(stepErrors.report || {}), condition: ['Condition is required'] }
        }
        if (!formData.report?.inspection?.trim()) {
          stepErrors.report = { ...(stepErrors.report || {}), inspection: ['Inspection status is required'] }
        }
        break
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return false
    }

    setErrors({})
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast.error('Please fix the errors before proceeding')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fix all errors before submitting')
      console.log("Please fix all errors ")
      return
    }

    if (!user) {
      toast.error('Please login to submit a listing')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare form data for submission
      const submitData = {
        ...formData,
        // Convert images to string array for API submission
        image_url: formData.images
          ?.filter((img): img is { type: 'url'; url: string; preview: string; id: string } => 
            img.type === 'url' && typeof img.url === 'string' && img.url.length > 0
          )
          .map(img => img.url) || []
      }

      // Create FormData for multipart submission
      const formDataToSubmit = new FormData()

      // Add all text fields
      // Object.entries(submitData).forEach(([key, value]) => {
      //   if (key !== 'images' && typeof value === 'object') {
      //     formDataToSubmit.append(key, JSON.stringify(value))
      //   } else if (key !== 'images') {
      //     formDataToSubmit.append(key, String(value))
      //   }
      // })

      // Add images
      if (submitData.images) {
        submitData.images.forEach((image, index) => {
          if (typeof image === 'string') {
            // URL image
            formDataToSubmit.append(`image_urls[${index}]`, image)
          } else if (image instanceof File) {
            // File image
            formDataToSubmit.append(`image_files`, image)
          }
        })
      }

      const result = await createCar(submitData, `${user.jwt}`);

      // Submit to API
      // const response = await fetch('/api/cars', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${getJwtToken() || ''}`
      //   },
      //   body: formDataToSubmit
      // })

      // if (!response.ok) {
      //   throw new Error('Failed to submit listing')
      // }

      // const result = await response.json()
      const brandName = "kal"
      const date = new Date()
      const metadata = {
        brandName: formData.make,
        carModel: formData.model,
        vin: "2dasfsdf343",
        year: formData.year,
        color: "white",
        mileage: 200,
        description: formData.description,
        imageURI: "http",
        mintTimestamp: date.getUTCMilliseconds(),
        isVerified: true
      }

      if (result.status === 'success') {
        writeContract({
          address: zero_addr,
          abi: zero_abi,
          functionName: 'mint',
          args: [
            address,
            brandName,
            metadata,
            "http"
          ],
          account: address
        })

        // Reset form
        setFormData({
          images: [],
          highlight: [],
          included: [],
          features: {
            exterior: [],
            interior: [],
            mechanical: []
          },
          specifications: {
            engine_size: '',
            transmission: '',
            fuel_type: '',
            exterior_color: '',
            interior_color: '',
            mileage: 0,
            odometer: 0,
            vin: ''
          },
          report: {
            condition: '',
            inspection: '',
            notes: ''
          }
        })
        setCurrentStep(1)
        setErrors({})
      } else {
        throw new Error(result.message || 'Submission failed')
      }

    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit listing', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Sell Your Car</h1>
            <SampleDataButton
              onFillForm={handleSampleDataFill}
              disabled={isSubmitting}
            />
          </div>
          <p className="text-muted-foreground">
            List your vehicle for auction on our decentralized platform
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Progress</h2>
              <Badge 
                variant="secondary" 
                className="transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress 
              value={progress} 
              className="mb-4 transition-all duration-500 ease-in-out h-3 bg-gray-200 [&>div]:bg-[#00296b]" 
            />

            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step) => {
                const StepIcon = step.icon
                const isCompleted = currentStep > step.id
                const isCurrent = currentStep === step.id
                const isUpcoming = currentStep < step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white scale-110'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="m-0 border-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const CurrentStepIcon = steps[currentStep - 1].icon
                return <CurrentStepIcon className="w-5 h-5" />
              })()}
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={formData}
              onDataChange={handleDataChange}
              errors={errors as Record<string, string[]>}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 border-[#00296b] text-[#00296b] hover:bg-[#00296b] hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 bg-[#00296b] text-white border border-[#00296b] hover:bg-[#001b47] hover:border-[#001b47]"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                // disabled={isSubmitting}
                className="flex items-center gap-2 cursor-pointer shadow bg-[#00296b] text-white border border-[#00296b] hover:bg-[#001b47] hover:border-[#001b47]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Listing'}
              </Button>
            )}
          </div>
        </div>

        {/* Form Summary */}
        {currentStep === steps.length && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Listing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Vehicle:</strong> {formData.year} {formData.make} {formData.model}</p>
                  <p><strong>Location:</strong> {formData.location}, {formData.country}</p>
                  <p><strong>Starting Price:</strong> ${formData.starting_price?.toLocaleString()}</p>
                  <p><strong>Seller:</strong> {formData.seller}</p>
                </div>
                <div>
                  <p><strong>Images:</strong> {formData.images?.length || 0} uploaded</p>
                  <p><strong>Features:</strong> {Object.values(formData.features || {}).flat().length} total</p>
                  <p><strong>Condition:</strong> {formData.report?.condition}</p>
                  <p><strong>Inspection:</strong> {formData.report?.inspection}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 