"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordless, setIsPasswordless] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const { signIn, sendPasswordlessLink } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Email is required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (value: string) => {
    if (!isPasswordless && !value.trim()) {
      setPasswordError("Password is required")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPasswordValid = isPasswordless || validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)

    try {
      if (isPasswordless) {
        const success = await sendPasswordlessLink(email)
        if (success) {
          toast({
            title: "Magic link sent!",
            description: "Check your email for a sign-in link.",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to send magic link. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        const success = await signIn(email, password)
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          })
          router.push("/dashboard")
        } else {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming soon",
      description: `${provider} login will be available soon.`,
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
            <MapPin className="h-8 w-8 text-accent" />
            TravelShare
          </Link>
          <p className="text-muted-foreground mt-2">Welcome back to your travel community</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              {isPasswordless
                ? "Enter your email to receive a magic sign-in link"
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleSocialLogin("Google")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleSocialLogin("Microsoft")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                Continue with Microsoft
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleSocialLogin("Apple")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    onBlur={() => validateEmail(email)}
                    className={`pl-10 ${emailError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    required
                  />
                </div>
                {emailError && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive">
                    {emailError}
                  </div>
                )}
              </div>

              {!isPasswordless && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (passwordError) setPasswordError("")
                      }}
                      onBlur={() => validatePassword(password)}
                      className={`pl-10 ${passwordError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      required
                    />
                  </div>
                  {passwordError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive">
                      {passwordError}
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !!emailError || !!passwordError}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPasswordless ? "Send Magic Link" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator />
              <div className="text-center mt-4">
                <Button variant="ghost" onClick={() => setIsPasswordless(!isPasswordless)} className="text-sm">
                  {isPasswordless ? "Use password instead" : "Sign in with magic link"}
                </Button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-accent hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-4 bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo credentials:</strong>
              <br />
              Email: john@example.com
              <br />
              Password: 345Andy!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
