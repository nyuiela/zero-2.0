import { z } from "zod"

// Zod schemas for validation
export const carImageSchema = z.object({
  type: z.enum(['gallery', 'url', 'capture']),
  file: z.instanceof(File).optional(),
  url: z.string().url().optional(),
  preview: z.string(),
  id: z.string()
})

export const carSpecificationsSchema = z.object({
  engine_size: z.string().min(1, "Engine size is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuel_type: z.string().min(1, "Fuel type is required"),
  exterior_color: z.string().min(1, "Exterior color is required"),
  interior_color: z.string().min(1, "Interior color is required"),
  mileage: z.number().min(0, "Mileage must be positive"),
  odometer: z.number().min(0, "Odometer must be positive"),
  vin: z.string().min(17, "VIN must be at least 17 characters").max(17, "VIN must be exactly 17 characters")
})

export const carFeaturesSchema = z.object({
  exterior: z.array(z.string()),
  interior: z.array(z.string()),
  mechanical: z.array(z.string())
})

export const carReportSchema = z.object({
  condition: z.string().min(1, "Condition is required"),
  inspection: z.string().min(1, "Inspection status is required"),
  notes: z.string()
})

export const carFormSchema = z.object({
  // Basic Information
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),

  // Images
  images: z.array(carImageSchema).min(1, "At least one image is required"),

  // Detailed Information
  description: z.string().min(10, "Description must be at least 10 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  vehicale_overview: z.string().min(10, "Vehicle overview must be at least 10 characters"),

  // Specifications
  specifications: carSpecificationsSchema.optional(),

  // Features
  features: carFeaturesSchema.optional(),

  // Report
  report: carReportSchema.optional(),

  // Auction Details
  starting_price: z.number().min(1, "Starting price must be positive"),
  current_price: z.number().min(1, "Current price must be positive"),

  // Additional Information
  highlight: z.array(z.string()),
  included: z.array(z.string()),
  lot: z.string().min(1, "Lot number is required"),

  // Seller Information
  seller: z.string().min(1, "Seller name is required"),
  seller_type: z.enum(['Dealer', 'Private', 'Auction House']),
  owner: z.string().min(1, "Owner information is required")
})

// TypeScript types derived from Zod schemas
export type CarImage = z.infer<typeof carImageSchema>
export type CarSpecifications = z.infer<typeof carSpecificationsSchema>
export type CarFeatures = z.infer<typeof carFeaturesSchema>
export type CarReport = z.infer<typeof carReportSchema>
export type CarFormData = z.infer<typeof carFormSchema>

// Form step types
export type FormStep = 1 | 2 | 3

export interface FormStepData {
  step1: Partial<CarFormData>
  step2: Partial<CarFormData>
  step3: Partial<CarFormData>
}

// Validation result type
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
} 