"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { SearchBar } from "@/components/search-bar"
import { ArrowLeft } from "lucide-react"
import type { User } from "@/lib/types"

interface AppHeaderProps {
  user: User
  title?: string
  showBack?: boolean
  showSearch?: boolean
  onSearch?: (query: string) => void
  rightContent?: React.ReactNode
}

export function AppHeader({
  user,
  title,
  showBack = false,
  showSearch = false,
  onSearch,
  rightContent,
}: AppHeaderProps) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMinimized, setShowMinimized] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (window.innerWidth < 768) {
        // Scrolling down past threshold - show minimized
        if (currentScrollY > 150 && currentScrollY > lastScrollY + 50) {
          setShowMinimized(true)
        }
        // Scrolling up significantly - show full header
        else if (currentScrollY < lastScrollY - 50 || currentScrollY < 100) {
          setShowMinimized(false)
        }
      } else {
        setShowMinimized(false)
      }

      setIsScrolled(currentScrollY > 10)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      <header
        className={`border-b border-border bg-card sticky top-0 z-30 transition-all duration-500 ease-in-out ${
          showMinimized ? "md:translate-y-0 -translate-y-full md:opacity-100 opacity-0" : "translate-y-0 opacity-100"
        } ${isScrolled ? "shadow-sm" : ""}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left section: Back button and title */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {showBack && (
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              )}
              {title && <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>}
            </div>

            {/* Center section: Search bar (only on tablet/desktop) */}
            {showSearch && (
              <div className="hidden md:flex flex-1 justify-center">
                <div className="w-full max-w-md">
                  <SearchBar onSearch={onSearch || (() => {})} variant="desktop" />
                </div>
              </div>
            )}

            {/* Right section: Actions and user dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              {rightContent}
              <UserDropdown user={user} />
            </div>
          </div>
        </div>
      </header>

      <header
        className={`md:hidden border-b border-border bg-card/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out shadow-md ${
          showMinimized ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {showBack ? (
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <h1 className="text-lg font-bold text-foreground">TravelShare</h1>
            )}
            <UserDropdown user={user} />
          </div>
        </div>
      </header>
    </>
  )
}
