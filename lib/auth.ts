import type { User } from "./types"
import { mockUsers } from "./mock-data"

// Mock authentication service - in production this would integrate with a real auth provider
export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signIn(email: string, password: string): Promise<{ user: User; token: string } | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - find user by email
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "345Andy!") {
      this.currentUser = user
      const token = `mock-token-${user.id}-${Date.now()}`
      localStorage.setItem("auth-token", token)
      localStorage.setItem("current-user", JSON.stringify(user))
      return { user, token }
    }
    return null
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: User; token: string } | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      avatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUsers.push(newUser)
    this.currentUser = newUser
    const token = `mock-token-${newUser.id}-${Date.now()}`
    localStorage.setItem("auth-token", token)
    localStorage.setItem("current-user", JSON.stringify(newUser))

    return { user: newUser, token }
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem("auth-token")
    localStorage.removeItem("current-user")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser
    }

    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("current-user")
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
        return this.currentUser
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("auth-token") && !!this.getCurrentUser()
  }

  async sendPasswordlessLink(email: string): Promise<boolean> {
    // Simulate sending passwordless login link
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Passwordless login link sent to ${email}`)
    return true
  }
}

export const authService = AuthService.getInstance()
