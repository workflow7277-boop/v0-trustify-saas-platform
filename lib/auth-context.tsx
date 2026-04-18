"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "merchant" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  storeName?: string
  storeLogo?: string
  vodafoneCash?: string
  aiEnabled?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: { [email: string]: { password: string; user: User } } = {
  "admin@trustify.com": {
    password: "admin123",
    user: {
      id: "admin-1",
      email: "admin@trustify.com",
      name: "Trustify Admin",
      role: "admin",
    },
  },
  "merchant@demo.com": {
    password: "merchant123",
    user: {
      id: "merchant-1",
      email: "merchant@demo.com",
      name: "Ahmed Hassan",
      role: "merchant",
      storeName: "Tech Zone Egypt",
      storeLogo: "",
      vodafoneCash: "01012345678",
      aiEnabled: true,
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("trustify_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userData = mockUsers[email.toLowerCase()]
    if (userData && userData.password === password) {
      setUser(userData.user)
      localStorage.setItem("trustify_user", JSON.stringify(userData.user))
      return true
    }
    return false
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (mockUsers[email.toLowerCase()]) {
      return false // User already exists
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      name,
      role,
      storeName: role === "merchant" ? `${name}'s Store` : undefined,
      storeLogo: "",
      vodafoneCash: "",
      aiEnabled: true,
    }

    mockUsers[email.toLowerCase()] = { password, user: newUser }
    setUser(newUser)
    localStorage.setItem("trustify_user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("trustify_user")
    router.push("/")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("trustify_user", JSON.stringify(updatedUser))
      if (mockUsers[user.email]) {
        mockUsers[user.email].user = updatedUser
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
