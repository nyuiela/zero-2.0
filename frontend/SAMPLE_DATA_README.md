# Sample Data for Auto Form Filling

This document describes the sample data functionality that allows users to quickly populate the car selling form with realistic data for testing and demonstration purposes.

## Overview

The sample data system provides pre-filled form data for different types of vehicles, making it easy to test the form functionality and see how the complete form looks when filled with realistic information.

## Available Sample Data

### 1. Ferrari 488 GTB (Luxury Sports Car)

- **Year:** 2019
- **Make:** Ferrari
- **Model:** 488 GTB
- **Type:** Luxury Sports
- **Price Range:** $200,000 - $215,000
- **Features:** Twin-turbo V8, Carbon fiber body, Sport exhaust, Premium audio
- **Location:** Los Angeles, CA

### 2. Tesla Model S Plaid (Electric Vehicle)

- **Year:** 2022
- **Make:** Tesla
- **Model:** Model S Plaid
- **Type:** Electric
- **Price Range:** $85,000 - $89,000
- **Features:** Tri-motor AWD, Full Self-Driving, Ludicrous mode, 17-inch touchscreen
- **Location:** San Francisco, CA

### 3. 1969 Ford Mustang Boss 302 (Classic Car)

- **Year:** 1969
- **Make:** Ford
- **Model:** Mustang Boss 302
- **Type:** Classic
- **Price Range:** $75,000 - $82,000
- **Features:** Original paint, Matching numbers, Documented history, Investment grade
- **Location:** Detroit, MI

### 4. Land Rover Range Rover Sport (SUV)

- **Year:** 2021
- **Make:** Land Rover
- **Model:** Range Rover Sport
- **Type:** SUV
- **Price Range:** $65,000 - $68,000
- **Features:** Terrain Response, Air suspension, All-wheel drive, Premium package
- **Location:** Miami, FL

### 5. BMW 330i xDrive (Luxury Sedan)

- **Year:** 2020
- **Make:** BMW
- **Model:** 330i xDrive
- **Type:** Luxury Sedan
- **Price Range:** $35,000 - $37,000
- **Features:** M Sport package, xDrive AWD, Premium features, Sport suspension
- **Location:** New York, NY

## How to Use

### 1. In the Sell Form

1. Navigate to the sell page (`/sell`)
2. Look for the "Fill with Sample Data" button in the top-right corner
3. Click the button to open a dropdown menu
4. Select the desired vehicle type from the list
5. The form will be automatically populated with the selected sample data
6. Review and modify the data as needed for your actual vehicle

### 2. Programmatic Usage

You can also use the sample data programmatically in your code:

```typescript
import {
  getSampleData,
  getRandomSampleData,
  getSampleDataKeys,
} from "@/lib/sampleData";

// Get specific sample data
const ferrariData = getSampleData("ferrari-488");

// Get random sample data
const randomData = getRandomSampleData();

// Get all available sample keys
const allKeys = getSampleDataKeys();
```

## File Structure

```
src/
├── lib/
│   ├── sampleData.ts          # Main sample data definitions
│   └── types/
│       └── car.ts             # TypeScript types for car data
├── components/
│   └── sell/
│       └── sample-data-button.tsx  # UI component for sample data selection
└── app/
    ├── sell/
    │   ├── page.tsx           # Main sell form with sample data integration
    │   └── demo.tsx           # Demo page showing all sample data
```

## Sample Data Structure

Each sample data object follows the `CarFormData` interface and includes:

### Basic Information

- Year, Make, Model
- Location and Country
- Lot number
- Images (sample URLs)

### Detailed Information

- Description and Summary
- Vehicle Overview
- Complete specifications (engine, transmission, fuel type, etc.)
- Features (exterior, interior, mechanical)
- Highlights and Included items

### Auction Details

- Starting and Current prices
- Seller information
- Owner details

### Condition Report

- Vehicle condition
- Inspection status
- Additional notes

## Customization

### Adding New Sample Data

To add a new sample vehicle:

1. Open `src/lib/sampleData.ts`
2. Add a new entry to the `sampleCarData` object
3. Follow the existing structure and naming convention
4. Include all required fields from the `CarFormData` interface

Example:

```typescript
"porsche-911": {
  year: 2021,
  make: "Porsche",
  model: "911 Carrera S",
  // ... rest of the data
}
```

### Modifying Existing Data

You can modify any existing sample data by editing the values in `src/lib/sampleData.ts`. The changes will be reflected immediately in the form.

## Demo Page

A demo page is available at `/sell/demo` that shows:

- All available sample data in a card layout
- Detailed view of selected sample data
- Random sample data generation
- Usage instructions

## Benefits

1. **Testing:** Quickly test form validation and submission
2. **Demo:** Show how the complete form looks with real data
3. **Development:** Speed up development and testing cycles
4. **User Experience:** Help users understand what information is needed
5. **Documentation:** Provide examples of proper data formatting

## Technical Notes

- All sample data is typed with TypeScript for type safety
- Images use Unsplash URLs for realistic car photos
- VIN numbers are realistic 17-character strings
- Prices and specifications are realistic for each vehicle type
- The system supports both individual selection and random generation

## Future Enhancements

Potential improvements to consider:

- More vehicle types and categories
- International vehicle examples
- Different price ranges and conditions
- Seasonal or themed sample data
- Integration with external vehicle databases
