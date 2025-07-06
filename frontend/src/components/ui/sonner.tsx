"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const [position, setPosition] = useState<ToasterProps["position"]>("top-right")

  // Responsive position: top-right on desktop, top-center on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 640) {
        setPosition("top-center")
      } else {
        setPosition("top-right")
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <Sonner
      theme="light"
      position={position}
      className="toaster group"
      toastOptions={{
        className: `
          group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 
          group-[.toaster]:border group-[.toaster]:border-gray-200 
          group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg
          data-[type=success]:border-green-200 data-[type=success]:bg-green-50
          data-[type=error]:border-red-200 data-[type=error]:bg-red-50
          data-[type=warning]:border-yellow-200 data-[type=warning]:bg-yellow-50
          data-[type=info]:border-blue-200 data-[type=info]:bg-blue-50
        `,
        classNames: {
          toast: `
            bg-white text-gray-900 border border-gray-200 shadow-lg rounded-lg p-4
            data-[type=success]:bg-green-50 data-[type=success]:border-green-200
            data-[type=error]:bg-red-50 data-[type=error]:border-red-200  
            data-[type=warning]:bg-yellow-50 data-[type=warning]:border-yellow-200
            data-[type=info]:bg-blue-50 data-[type=info]:border-blue-200
          `,
          title: 'text-gray-900 font-semibold text-sm',
          description: 'text-gray-700 text-sm',
          closeButton: 'text-gray-500 hover:text-gray-700',
          icon: 'w-5 h-5',
        },
        duration: 6000,
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5 text-green-600" />,
        error: <XCircle className="w-5 h-5 text-red-600" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
        info: <Info className="w-5 h-5 text-blue-600" />,
      }}
      closeButton
      {...props}
    />
  )
}

export { Toaster }