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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomBtn from "./custom-btn"
import { auction_abi, auction_addr } from "@/lib/abi/abi"
import { useAccount } from "wagmi"

// Validation schema for the auction registration form
const auctionRegistrationSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  initialBid: z.string().min(1, "Initial bid is required").refine(val => parseFloat(val) > 0, "Initial bid must be positive"),
  bidThreshold: z.string().min(1, "Bid threshold is required").refine(val => parseFloat(val) > 0, "Bid threshold must be positive"),
  bidToken: z.string().min(42, "Valid Ethereum address required").max(42),
  nftTokenId: z.string().min(1, "NFT Token ID is required").refine(val => !isNaN(Number(val)), "NFT Token ID must be a number"),
}).refine((data) => {
  const startTime = new Date(data.startTime).getTime()
  const endTime = new Date(data.endTime).getTime()
  const now = Date.now()

  return startTime >= now
}, {
  message: "Start time must be in the future",
  path: ["startTime"]
}).refine((data) => {
  const startTime = new Date(data.startTime).getTime()
  const endTime = new Date(data.endTime).getTime()

  return endTime > startTime
}, {
  message: "End time must be after start time",
  path: ["endTime"]
}).refine((data) => {
  const initialBid = parseFloat(data.initialBid)
  const bidThreshold = parseFloat(data.bidThreshold)

  return bidThreshold > initialBid
}, {
  message: "Bid threshold must be greater than initial bid",
  path: ["bidThreshold"]
})

type AuctionRegistrationFormData = z.infer<typeof auctionRegistrationSchema>

interface AuctionRegistrationFormProps {
  onSubmit: (data: AuctionRegistrationFormData) => void
  isLoading?: boolean
  availableBrands?: string[]
  userNFTs?: Array<{
    tokenId: string
    brandName: string
    isLocked: boolean
  }>
}

export function AuctionRegistrationForm({
  onSubmit,
  isLoading = false,
  availableBrands = [],
  userNFTs = []
}: AuctionRegistrationFormProps) {
  const [selectedNFT, setSelectedNFT] = useState<string>("")
  const { address } = useAccount();
  const form = useForm<AuctionRegistrationFormData>({
    resolver: zodResolver(auctionRegistrationSchema),
    defaultValues: {
      brandName: "",
      startTime: "",
      endTime: "",
      initialBid: "",
      bidThreshold: "",
      bidToken: "",
      nftTokenId: "",
    },
  })

  const handleSubmit = (data: AuctionRegistrationFormData) => {

    // Convert dates to timestamps
    const formData = {
      ...data,
      startTime: Math.floor(new Date(data.startTime).getTime() / 1000).toString(),
      endTime: Math.floor(new Date(data.endTime).getTime() / 1000).toString(),
    }

    onSubmit(formData)
  }

  const handleNFTSelect = (tokenId: string) => {
    setSelectedNFT(tokenId)
    const nft = userNFTs.find(nft => nft.tokenId === tokenId)
    if (nft) {
      form.setValue("nftTokenId", tokenId)
      form.setValue("brandName", nft.brandName)
    }
  }

  // Filter available NFTs (not locked)
  const availableUserNFTs = userNFTs.filter(nft => !nft.isLocked)

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-brand">Create Auction</CardTitle>
        <CardDescription>
          Register a new auction for your NFT with bidding parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* NFT Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand">NFT Selection</h3>

              {availableUserNFTs.length > 0 ? (
                <div className="space-y-3">
                  <FormLabel>Select Your NFT</FormLabel>
                  <div className="grid gap-3">
                    {availableUserNFTs.map((nft) => (
                      <div
                        key={nft.tokenId}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedNFT === nft.tokenId
                          ? "border-brand bg-brand/5"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => handleNFTSelect(nft.tokenId)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Token ID: {nft.tokenId}</p>
                            <p className="text-sm text-gray-600">Brand: {nft.brandName}</p>
                          </div>
                          {selectedNFT === nft.tokenId && (
                            <div className="w-4 h-4 bg-brand rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    No available NFTs found. Make sure you own NFTs that are not locked.
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="nftTokenId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Token ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter NFT Token ID"
                        {...field}
                        readOnly={selectedNFT !== ""}
                      />
                    </FormControl>
                    <FormDescription>
                      The token ID of the NFT you want to auction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Brand Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand">Brand Information</h3>

              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      {availableBrands.length > 0 ? (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableBrands.map((brand) => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder="Enter brand name"
                          {...field}
                          readOnly={selectedNFT !== ""}
                        />
                      )}
                    </FormControl>
                    <FormDescription>
                      The brand associated with the NFT
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Auction Timing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand">Auction Timing</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                      <FormDescription>
                        When the auction should start
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                      <FormDescription>
                        When the auction should end
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bidding Parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand">Bidding Parameters</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initialBid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Bid (ETH)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum starting bid amount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bidThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Threshold (ETH)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1.0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum bid to reach threshold
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bidToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bid Token Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0x..."
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormDescription>
                      Ethereum address of the token used for bidding
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <CustomBtn name="Create Auction" functionName="createAuction" args={[
                // string memory brandName,
                // form.getValues()
                // uint256 startTime,
                // uint256 endTime,
                // uint256 initialBid,
                // uint256 bidThreshold,
                // address bidToken,
                // uint256 nftTokenId,
                // string memory proofHash
              ]} abi={auction_abi} address={auction_addr} account={address!} />
              {/* <Button
                type="submit"
                disabled={isLoading || availableUserNFTs.length === 0}
                className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6"
              >
                {isLoading ? "Creating Auction..." : "Create Auction"}
              </Button> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 