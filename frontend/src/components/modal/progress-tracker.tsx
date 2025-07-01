"use client"

import React, { useState } from 'react'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'

interface ProgressModalProps {
  steps: Array<string>,
  open: boolean,
  onOpenChange: (n: boolean) => void,
  error: any,
  modalHash: `0x${string}` | undefined,
  message?: {
    header: string,
    body: string
  }[],
  handleSubmit: (() => void)[]
  title: string,
  description: string,
  isLoading?: boolean,
  button: string[],
  step: number
}


//       <p className="text-green-700 text-sm">
//         Activate brand "{registeredBrandName}" to make it live on the platform.
//       </p>
const ProgressTracker = ({ steps, open, onOpenChange, error, modalHash, message, handleSubmit, title, description, isLoading, button, step: activeStep }: ProgressModalProps) => {
  // const [activeStep, setActiveStep] = useState<number>(0)

  return (
    < Dialog open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#00296b]">
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
            Complete the registration process by staking and activating your brand
          </DialogDescription>
        </DialogHeader>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-10 flex-auto px-5 relative">

          {
            steps.map((step, key: number) =>

              <div key={key} className="flex items-center space-x-2 bg-red-00">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold relative ${activeStep >= key
                  ? 'bg-green-500 text-white' : 'bg-[#00296b] text-white'
                  }`}>
                  {key + 1}
                  <span className={`text-sm absolute bottom-[-25] font-medium ${activeStep >= key ? 'text-green-600' : 'text-[#00296b]'
                    }`}>
                    {step}
                  </span>
                </div>
                {steps.length - 1 != key && (
                  <div className="flex-1 h-0.5 bg-gray-200 absolute w-[25%] mx-14">
                    <div className={`h-full transition-all duration-300 ${activeStep >= key ? 'bg-green-500' : 'bg-gray-200'
                      }`} style={{ width: '100%' }}></div>
                  </div>
                )
                }
              </div>
            )
          }


        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {message && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-800 font-semibold text-sm mb-2">{message[activeStep].header}</h4>
                <p className="text-blue-700 text-sm">
                  {message[activeStep].body}

                </p>
              </div>

              <Button
                onClick={handleSubmit[activeStep]}
                disabled={isLoading}
                className="w-full bg-[#00296b] text-white hover:bg-[#00296b]/95 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : button[activeStep]}
              </Button>
            </div>)
          }

        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 overflow-hidden">
            <h4 className="text-red-800 font-semibold text-sm mb-1">Error:</h4>
            <p className="text-red-700 text-sm line-clamp-4">{error}</p>
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
            className="
             rounded-none border-none p-0 m-0 h-0 text-gray-600 underline hover:text-black cursor-pointer"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default ProgressTracker