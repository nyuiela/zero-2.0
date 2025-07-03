"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { useEffect, useState } from "react"

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

  // Custom animation: ease-in for desktop, drop-down for mobile
  // Custom background: bg-white, shadow, rounded
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      className="toaster group [&_.toast]:bg-white [&_.toast]:shadow-lg [&_.toast]:rounded-lg"
      toastOptions={{
        className:
          `relative bg-white shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-xl border border-gray-200 text-gray-900 px-5 py-4
          [&_.toast-title]:text-gray-900 [&_.toast-title]:font-semibold [&_.toast-title]:text-base [&_.toast-title]:tracking-tight
          [&_.toast-description]:text-gray-900 [&_.toast-description]:font-medium [&_.toast-description]:tracking-tight [&_.toast-description]:opacity-100
          before:content-[''] before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1.5 before:rounded-full before:bg-gradient-to-b before:from-yellow-400 before:to-yellow-300`,
        style: {
          background: 'white',
          color: '#18181b', // even deeper gray
        },
      }}
      closeButton
      {...props}
    />
  )
}

export { Toaster }
