"use client"
import { useState } from "react"
import { Copy, Download, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface ProofData {
  receipt: {
    inner: {
      Fake: {
        claim: {
          Value: {
            exit_code: {
              Halted: number
            }
            input: {
              Pruned: number[]
            }
            output: {
              Value: {
                assumptions: {
                  Value: unknown[]
                }
                journal: {
                  Value: number[]
                }
              }
            }
            post: {
              Value: {
                merkle_root: number[]
                pc: number
              }
            }
            pre: {
              Value: {
                merkle_root: number[]
                pc: number
              }
            }
          }
        }
      }
    }
    journal: {
      bytes: number[]
    }
    metadata: {
      verifier_parameters: number[]
    }
  }
  stats: {
    paging_cycles: number
    reserved_cycles: number
    segments: number
    total_cycles: number
    user_cycles: number
  }
}

interface ProofModalProps {
  isOpen: boolean
  onClose: () => void
  proof: ProofData | null
  transactionHash?: string,
  handleSubmit?: () => void,
  name?: string
}

export function ProofModalTransaction({ isOpen, onClose, proof, transactionHash, handleSubmit, name }: ProofModalProps) {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const handleTransaction = async () => {
    setIsLoading(true)
    try {
      if (handleSubmit) handleSubmit();
      setIsLoading(false)
    } catch (error) {
      console.log("Failed to load error", error)
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadProof = () => {
    if (!proof) return

    const dataStr = JSON.stringify(proof, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `proof-${transactionHash || Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatBytes = (bytes: number[]) => {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const formatMerkleRoot = (merkleRoot: number[]) => {
    return merkleRoot.map(b => b.toString(16).padStart(8, '0')).join('')
  }

  const decodeJournalBytes = (bytes: number[]) => {
    try {
      const hexString = formatBytes(bytes)
      // Convert hex to string, filtering out non-printable characters
      let result = ''
      for (let i = 0; i < hexString.length; i += 2) {
        const byte = parseInt(hexString.substr(i, 2), 16)
        if (byte >= 32 && byte <= 126) { // Printable ASCII range
          result += String.fromCharCode(byte)
        }
      }
      return result || 'No readable text found'
    } catch {
      return 'Unable to decode'
    }
  }


  if (!proof) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Transaction Proof</span>
            <Badge variant="secondary" className="text-xs">
              ZK Proof
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-left">
            Cryptographic proof of transaction execution on the blockchain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Hash */}
          {transactionHash && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Transaction Hash</h4>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono flex-1 break-all">
                  {transactionHash}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transactionHash)}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Execution Stats */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Execution Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-600">Total Cycles</div>
                <div className="font-mono text-sm">{proof.stats.total_cycles.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">User Cycles</div>
                <div className="font-mono text-sm">{proof.stats.user_cycles.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Paging Cycles</div>
                <div className="font-mono text-sm">{proof.stats.paging_cycles.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Reserved Cycles</div>
                <div className="font-mono text-sm">{proof.stats.reserved_cycles.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Segments</div>
                <div className="font-mono text-sm">{proof.stats.segments}</div>
              </div>
            </div>
          </div>

          {/* State Changes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">State Changes</h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Pre-state Merkle Root</div>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  {formatMerkleRoot(proof.receipt.inner.Fake.claim.Value.pre.Value.merkle_root)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Post-state Merkle Root</div>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  {formatMerkleRoot(proof.receipt.inner.Fake.claim.Value.post.Value.merkle_root)}
                </div>
              </div>
            </div>
          </div>

          {/* Journal Data */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Journal Data</h4>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600 mb-1">Decoded Journal</div>
                <div className="font-mono text-xs bg-green-50 p-3 rounded border">
                  {decodeJournalBytes(proof.receipt.journal.bytes)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Raw Bytes (Hex)</div>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  {formatBytes(proof.receipt.journal.bytes)}
                </div>
              </div>
            </div>
          </div>

          {/* Exit Code */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Exit Code</h4>
            <div className="flex items-center gap-2">
              <Badge
                variant={proof.receipt.inner.Fake.claim.Value.exit_code.Halted === 0 ? "default" : "destructive"}
                className="text-xs"
              >
                {proof.receipt.inner.Fake.claim.Value.exit_code.Halted === 0 ? "Success" : "Failed"}
              </Badge>
              <span className="text-sm text-gray-600">
                Code: {proof.receipt.inner.Fake.claim.Value.exit_code.Halted}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={downloadProof}
              className="flex items-center gap-2 p-1"
            >
              <Download className="h-4 w-4" />
              Download Proof
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(JSON.stringify(proof, null, 2))}
              className="flex items-center gap-2 p-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy JSON
            </Button>
          </div>
          <div className="flex flex-col justify-end w-full">
            <Button
              type="button"
              className="w-full bg-[#00296b] text-white text-md hover:bg-[#00296b]/95 disabled:opacity-50 disabled:cursor-not-allowed py-6 cursor-pointer"
              disabled={isLoading}
              onClick={handleTransaction}
            >
              {isLoading ? "Loading..." : name ? name : "Submit"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
} 