"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download, ExternalLink, FileText, Clock, DollarSign, Shield } from 'lucide-react'

interface TransactionReceipt {
  transactionHash: string
  timestamp: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  eulerIncrement?: string
  collateralAmount?: string
  selectedNFTs?: string[]
  repayPeriod: string
  gasUsed: string
  gasPrice: string
  totalCost: string
  status: 'success' | 'pending' | 'failed'
}

interface TransactionReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  receipt: TransactionReceipt | null
}

export default function TransactionReceiptModal({ 
  open, 
  onOpenChange, 
  receipt 
}: TransactionReceiptModalProps) {
  const [downloading, setDownloading] = useState(false)

  const downloadPDF = async () => {
    if (!receipt) return
    
    setDownloading(true)
    try {
      // Simulate PDF generation and download
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a mock PDF download
      const blob = new Blob([`Transaction Receipt\n\nHash: ${receipt.transactionHash}\nTimestamp: ${receipt.timestamp}\nFrom: ${receipt.fromAmount} ${receipt.fromToken}\nTo: ${receipt.toAmount} ${receipt.toToken}\nRepay Period: ${receipt.repayPeriod}\nGas Used: ${receipt.gasUsed}\nTotal Cost: ${receipt.totalCost}`], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transaction-receipt-${receipt.transactionHash.slice(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setDownloading(false)
    }
  }

  const viewOnIPFS = () => {
    // This will be implemented later
    console.log('View on IPFS - coming soon')
  }

  if (!receipt) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 rounded-2xl overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Transaction Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Transaction Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant={receipt.status === 'success' ? 'default' : receipt.status === 'pending' ? 'secondary' : 'destructive'}
                className="text-sm"
              >
                {receipt.status === 'success' ? 'Success' : receipt.status === 'pending' ? 'Pending' : 'Failed'}
              </Badge>
              <span className="text-sm text-gray-500">{receipt.timestamp}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                disabled={downloading}
                className="flex items-center gap-1"
              >
                {downloading ? (
                  <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={viewOnIPFS}
                className="flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                IPFS
              </Button>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Transaction Hash</span>
              <span className="text-sm font-mono text-gray-900 break-all">
                {receipt.transactionHash}
              </span>
            </div>
          </div>

          {/* Swap Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Swap Details</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{receipt.fromAmount} {receipt.fromToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{receipt.toAmount} {receipt.toToken}</span>
                </div>
                {receipt.eulerIncrement && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Euler Increment:</span>
                    <span className="font-medium">{receipt.eulerIncrement} {receipt.toToken}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Collateral Details</span>
              </div>
              <div className="space-y-2 text-sm">
                {receipt.collateralAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collateral:</span>
                    <span className="font-medium">{receipt.collateralAmount} ETH</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Repay Period:</span>
                  <span className="font-medium">{receipt.repayPeriod}</span>
                </div>
                {receipt.selectedNFTs && receipt.selectedNFTs.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">NFTs Locked:</span>
                    <span className="font-medium">{receipt.selectedNFTs.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gas Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Gas Details</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Gas Used:</span>
                <div className="font-medium">{receipt.gasUsed}</div>
              </div>
              <div>
                <span className="text-gray-600">Gas Price:</span>
                <div className="font-medium">{receipt.gasPrice} Gwei</div>
              </div>
              <div>
                <span className="text-gray-600">Total Cost:</span>
                <div className="font-medium">{receipt.totalCost} ETH</div>
              </div>
            </div>
          </div>

          {/* Repayment Reminder */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900 mb-1">Repayment Reminder</p>
                <p className="text-yellow-800">
                  Repay within <strong>20 business days</strong> to receive <strong>20% off collateral</strong> for your next swap!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-100">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 