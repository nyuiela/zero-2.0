"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Link, Camera, Image as ImageIcon } from "lucide-react"
import { CarImage } from "@/lib/types/car"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: CarImage[]
  onImagesChange: (images: CarImage[]) => void
  errors?: string[]
}

export default function ImageUpload({ images, onImagesChange, errors }: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'url' | 'capture'>('gallery')
  const [urlInput, setUrlInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  // Handle gallery file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const newImages: CarImage[] = Array.from(files).map((file) => ({
      type: 'gallery' as const,
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`
    }))

    onImagesChange([...images, ...newImages])
  }, [images, onImagesChange])

  // Handle URL input
  const handleUrlAdd = useCallback(async () => {
    if (!urlInput.trim()) return

    setIsLoading(true)
    try {
      // Validate URL and create preview
      const newImage: CarImage = {
        type: 'url',
        url: urlInput,
        preview: urlInput,
        id: `${Date.now()}-${Math.random()}`
      }

      onImagesChange([...images, newImage])
      setUrlInput('')
    } catch (error) {
      console.error('Error adding URL image:', error)
    } finally {
      setIsLoading(false)
    }
  }, [urlInput, images, onImagesChange])

  // Handle camera capture
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            const newImage: CarImage = {
              type: 'capture',
              file,
              preview: URL.createObjectURL(blob),
              id: `${Date.now()}-${Math.random()}`
            }
            onImagesChange([...images, newImage])
            stopCamera()
          }
        }, 'image/jpeg')
      }
    }
  }, [images, onImagesChange])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setShowCamera(false)
    }
  }, [])

  // Remove image
  const removeImage = useCallback((id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
    onImagesChange(images.filter(img => img.id !== id))
  }, [images, onImagesChange])

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'gallery' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('gallery')}
          className={activeTab === "gallery" ? "flex-1 bg-white" : "flex-1 bg-none hover:bg-[#00296b] hover:text-white"}
        >
          <Upload className="w-4 h-4 mr-2" />
          Gallery
        </Button>
        <Button
          variant={activeTab === 'url' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('url')}
          className={activeTab === "url" ? "flex-1 bg-white" : "flex-1 bg-none hover:bg-[#00296b] hover:text-white"}
        >
          <Link className="w-4 h-4 mr-2" />
          URL
        </Button>
        <Button
          variant={activeTab === 'capture' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('capture')}
          className={activeTab === "capture" ? "flex-1 bg-white" : "flex-1 bg-none hover:bg-[#00296b] hover:text-white"}
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera
        </Button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'gallery' && (
          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Select images from your device
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#00296b] text-white hover:bg-[#001b47] hover:text-white transition-colors"
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'url' && (
          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter image URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlAdd()}
                  />
                  <Button
                    onClick={handleUrlAdd}
                    disabled={isLoading || !urlInput.trim()}
                    className="bg-[#00296b] text-white hover:bg-[#001b47] hover:text-white transition-colors"
                  >
                    Add
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a direct link to an image (JPG, PNG, WebP)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'capture' && (
          <Card className="border-none shadow-none">
            <CardContent className="p-6">
              {!showCamera ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Take a photo using your camera
                  </p>
                  <Button
                    onClick={startCamera}
                    className="bg-[#00296b] text-white hover:bg-[#001b47] hover:text-white transition-colors"
                  >
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={capturePhoto}
                      className="btn-gradient flex-1 bg-[#00296b] text-white hover:bg-[#001b47] hover:text-white transition-colors"
                    >
                      Capture Photo
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="border-[#00296b] text-[#00296b] hover:bg-[#00296b] hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={image.preview}
                    alt="Car image"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {image.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors && errors.length > 0 && (
        <div className="text-red-600 text-sm">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  )
} 