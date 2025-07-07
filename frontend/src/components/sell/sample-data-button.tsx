"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CarFormData } from "@/lib/types/car"
import { getSampleDataKeys, getSampleData } from "@/lib/sampleData"
import { Database, ChevronDown } from "lucide-react"

interface SampleDataButtonProps {
  onFillForm: (data: Partial<CarFormData>) => void
  disabled?: boolean
}

export default function SampleDataButton({ onFillForm, disabled = false }: SampleDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const sampleKeys = getSampleDataKeys()

  const handleSampleDataSelect = (key: string) => {
    const sampleData = getSampleData(key)
    onFillForm(sampleData)
    setIsOpen(false)
  }

  const getDisplayName = (key: string): string => {
    const data = getSampleData(key)
    return `${data.year} ${data.make} ${data.model}`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          Fill with Sample Data
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border-none shadow-md">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Choose a sample vehicle:
        </div>
        {sampleKeys.map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleSampleDataSelect(key)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex flex-col">
              <span className="font-medium">{getDisplayName(key)}</span>
              <span className="text-xs text-muted-foreground">
                {key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 