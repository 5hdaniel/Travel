"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserDropdown } from "@/components/ui/user-dropdown"
import { useToast } from "@/hooks/use-toast"
import { PasswordValidator, validatePassword } from "@/components/password-validator"
import {
  MapPin,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Upload,
  Navigation,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [locationSharing, setLocationSharing] = useState<"live" | "manual" | "disabled">("disabled")

  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isSaving2FA, setIsSaving2FA] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  const [originalTwoFactorEnabled, setOriginalTwoFactorEnabled] = useState(false)
  const [originalLocationSharing, setOriginalLocationSharing] = useState<"live" | "manual" | "disabled">("disabled")
  const [originalEmailNotifications, setOriginalEmailNotifications] = useState(true)
  const [originalPushNotifications, setOriginalPushNotifications] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      setName(user.name)
      setEmail(user.email)
      // In a real app, you'd fetch these settings from the backend
      const initialTwoFactor = false
      const initialEmailNotif = true
      const initialPushNotif = true
      const initialLocationSharing = "disabled" as const

      setTwoFactorEnabled(initialTwoFactor)
      setEmailNotifications(initialEmailNotif)
      setPushNotifications(initialPushNotif)
      setLocationSharing(initialLocationSharing)

      setOriginalTwoFactorEnabled(initialTwoFactor)
      setOriginalEmailNotifications(initialEmailNotif)
      setOriginalPushNotifications(initialPushNotif)
      setOriginalLocationSharing(initialLocationSharing)
    }
  }, [user, loading, router])

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    // TODO: Implement profile update API call
    console.log("[v0] Saving profile:", { name, email })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    })

    setIsSavingProfile(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords don't match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (!validatePassword(newPassword)) {
      toast({
        title: "Invalid password",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      })
      return
    }

    setIsSavingPassword(true)
    // TODO: Implement password change API call
    console.log("[v0] Changing password")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsSavingPassword(false)
  }

  const handleSave2FA = async () => {
    setIsSaving2FA(true)
    // TODO: Implement 2FA settings API call
    console.log("[v0] Saving 2FA settings:", twoFactorEnabled)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOriginalTwoFactorEnabled(twoFactorEnabled)

    toast({
      title: "Security settings saved",
      description: "Two-factor authentication settings have been updated.",
    })

    setIsSaving2FA(false)
  }

  const handleSaveLocationSharing = async () => {
    setIsSavingLocation(true)
    // TODO: Implement location sharing API call
    console.log("[v0] Saving location sharing:", locationSharing)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOriginalLocationSharing(locationSharing)

    localStorage.setItem("locationSharingMode", locationSharing)

    toast({
      title: "Location settings saved",
      description: "Your location sharing preferences have been updated.",
    })

    setIsSavingLocation(false)
  }

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true)
    // TODO: Implement notification settings API call
    console.log("[v0] Saving notification settings:", { emailNotifications, pushNotifications })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setOriginalEmailNotifications(emailNotifications)
    setOriginalPushNotifications(pushNotifications)

    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    })

    setIsSavingNotifications(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const has2FAChanges = twoFactorEnabled !== originalTwoFactorEnabled
  const hasLocationChanges = locationSharing !== originalLocationSharing
  const hasNotificationChanges =
    emailNotifications !== originalEmailNotifications || pushNotifications !== originalPushNotifications

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
            </div>
          </div>
          <UserDropdown user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>Update your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Password validation helper */}
                {newPassword && <PasswordValidator password={newPassword} className="mt-4" />}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleChangePassword}
                  disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Enable 2FA</p>
                    <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes.
                  </p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSave2FA} disabled={isSaving2FA || !has2FAChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving2FA ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Sharing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Location Sharing
              </CardTitle>
              <CardDescription>Control how your location is shared with trip viewers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={locationSharing}
                onValueChange={(value) => setLocationSharing(value as "live" | "manual" | "disabled")}
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="live" id="live" />
                    <div className="flex-1">
                      <Label htmlFor="live" className="font-medium cursor-pointer">
                        Live Location Sharing
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Your location is automatically updated in real-time while you're on a trip. Viewers can see your
                        current position on the map.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="manual" id="manual" />
                    <div className="flex-1">
                      <Label htmlFor="manual" className="font-medium cursor-pointer">
                        Manually Updated Location
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        You control when to share your location. Update it manually whenever you want viewers to see
                        where you are.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="disabled" id="disabled" />
                    <div className="flex-1">
                      <Label htmlFor="disabled" className="font-medium cursor-pointer">
                        Location Sharing Disabled
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Your location will not be shared with viewers. They won't see your position on the map.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveLocationSharing} disabled={isSavingLocation || !hasLocationChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingLocation ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive notifications about your trips.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <p className="font-medium">Email Notifications</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Receive updates about your trips via email.</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <p className="font-medium">Push Notifications</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Receive real-time notifications on your device.</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSaveNotifications} disabled={isSavingNotifications || !hasNotificationChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingNotifications ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
