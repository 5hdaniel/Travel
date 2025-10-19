"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordValidatorProps {
  password: string
  className?: string
}

const ALLOWED_SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

export function PasswordValidator({ password, className }: PasswordValidatorProps) {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = new RegExp(`[${ALLOWED_SYMBOLS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`).test(password)
  const hasMinLength = password.length >= 8

  const requirements = [
    { label: "At least one uppercase letter (A-Z)", met: hasUpperCase },
    { label: "At least one lowercase letter (a-z)", met: hasLowerCase },
    { label: "At least one number (0-9)", met: hasNumber },
    { label: `At least one symbol (${ALLOWED_SYMBOLS})`, met: hasSymbol },
    { label: "At least 8 characters long", met: hasMinLength },
  ]

  return (
    <div className={cn("rounded-lg border border-border bg-muted/50 p-4 space-y-2", className)}>
      <p className="text-sm font-medium text-foreground mb-3">Password Requirements:</p>
      <div className="space-y-2">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-start gap-2">
            <div
              className={cn(
                "mt-0.5 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                req.met ? "bg-green-500 text-white" : "bg-muted-foreground/20 text-muted-foreground",
              )}
            >
              {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </div>
            <p
              className={cn(
                "text-sm transition-colors",
                req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
              )}
            >
              {req.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function validatePassword(password: string): boolean {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = new RegExp(`[${ALLOWED_SYMBOLS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`).test(password)
  const hasMinLength = password.length >= 8

  return hasUpperCase && hasLowerCase && hasNumber && hasSymbol && hasMinLength
}
