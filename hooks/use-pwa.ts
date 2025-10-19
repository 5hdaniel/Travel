"use client"

import { useEffect, useState } from "react"

interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface UsePWAReturn {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  installApp: () => Promise<void>
  showInstallPrompt: boolean
  dismissInstallPrompt: () => void
}

export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    // Check network status
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as any)
      setIsInstallable(true)

      // Show install prompt after a delay if not installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true)
        }
      }, 10000) // Show after 10 seconds
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setShowInstallPrompt(false)
      console.log("[PWA] App installed successfully")
    }

    checkInstalled()
    updateOnlineStatus()

    // Event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration)
        })
        .catch((error) => {
          console.log("[PWA] Service Worker registration failed:", error)
        })
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [isInstalled])

  const installApp = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        console.log("[PWA] User accepted install prompt")
      } else {
        console.log("[PWA] User dismissed install prompt")
      }

      setInstallPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error("[PWA] Install failed:", error)
    }
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
  }

  return {
    isInstallable,
    isInstalled,
    isOffline,
    installApp,
    showInstallPrompt,
    dismissInstallPrompt,
  }
}
