"use client"

import { usePWA } from "@/hooks/use-pwa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Zap, Wifi } from "lucide-react"

export function InstallPrompt() {
  const { showInstallPrompt, installApp, dismissInstallPrompt } = usePWA()

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="border-accent shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent rounded-lg">
                <Download className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">Install Travel Share</CardTitle>
                <CardDescription className="text-xs">Get the full app experience</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={dismissInstallPrompt}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <Smartphone className="h-5 w-5 text-accent mx-auto" />
              <p className="text-xs text-muted-foreground">Native Feel</p>
            </div>
            <div className="space-y-1">
              <Wifi className="h-5 w-5 text-accent mx-auto" />
              <p className="text-xs text-muted-foreground">Works Offline</p>
            </div>
            <div className="space-y-1">
              <Zap className="h-5 w-5 text-accent mx-auto" />
              <p className="text-xs text-muted-foreground">Fast Loading</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={installApp} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
            <Button variant="outline" onClick={dismissInstallPrompt}>
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
