"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

// Super Admin credentials - in production this would be environment variables
const SUPER_ADMIN_EMAILS = ["admin@trustify.com"]

interface PromoCode {
  id: number
  code: string
  discount: number
  usageLimit: number
  usedCount: number
  createdAt: string
  expiresAt: string
  isActive: boolean
}

interface WhitelistedEmail {
  id: number
  email: string
  addedAt: string
  plan: string
  activated: boolean
}

interface PendingUser {
  id: number
  name: string
  email: string
  phone: string
  storeName: string
  registeredAt: string
  status: "pending" | "active" | "suspended"
}

interface AdminContextType {
  isSuperAdmin: (email: string) => boolean
  promoCodes: PromoCode[]
  addPromoCode: (code: Omit<PromoCode, "id">) => void
  deletePromoCode: (id: number) => void
  togglePromoCode: (id: number) => void
  validatePromoCode: (code: string) => { valid: boolean; discount: number }
  whitelist: WhitelistedEmail[]
  addToWhitelist: (emails: string[]) => void
  removeFromWhitelist: (id: number) => void
  isWhitelisted: (email: string) => boolean
  pendingUsers: PendingUser[]
  activateUser: (id: number) => void
  addPendingUser: (user: Omit<PendingUser, "id" | "status">) => void
}

const AdminContext = createContext<AdminContextType | null>(null)

const initialPromoCodes: PromoCode[] = [
  { id: 1, code: "LAUNCH2024", discount: 50, usageLimit: 100, usedCount: 45, createdAt: "2024-01-01", expiresAt: "2024-03-31", isActive: true },
  { id: 2, code: "FAMILY100", discount: 100, usageLimit: 10, usedCount: 3, createdAt: "2024-01-10", expiresAt: "2024-12-31", isActive: true },
  { id: 3, code: "BROTHER100", discount: 100, usageLimit: 5, usedCount: 0, createdAt: "2024-01-15", expiresAt: "2024-12-31", isActive: true },
]

const initialWhitelist: WhitelistedEmail[] = [
  { id: 1, email: "brother@gmail.com", addedAt: "2024-01-01", plan: "Business", activated: true },
  { id: 2, email: "sister@gmail.com", addedAt: "2024-01-05", plan: "Business", activated: false },
]

const initialPendingUsers: PendingUser[] = [
  { id: 1, name: "Sara Hassan", email: "sara@boutique.eg", phone: "01098765432", storeName: "Sara's Boutique", registeredAt: "2024-01-15", status: "pending" },
  { id: 2, name: "Omar Youssef", email: "omar@electronics.eg", phone: "01123456789", storeName: "Omar Tech", registeredAt: "2024-01-15", status: "pending" },
  { id: 3, name: "Layla Ahmed", email: "layla@fashion.eg", phone: "01234567890", storeName: "Layla Fashion", registeredAt: "2024-01-14", status: "pending" },
]

export function AdminProvider({ children }: { children: ReactNode }) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes)
  const [whitelist, setWhitelist] = useState<WhitelistedEmail[]>(initialWhitelist)
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(initialPendingUsers)

  const isSuperAdmin = useCallback((email: string) => {
    return SUPER_ADMIN_EMAILS.includes(email.toLowerCase())
  }, [])

  const addPromoCode = useCallback((code: Omit<PromoCode, "id">) => {
    setPromoCodes((prev) => [{ ...code, id: Date.now() }, ...prev])
  }, [])

  const deletePromoCode = useCallback((id: number) => {
    setPromoCodes((prev) => prev.filter((code) => code.id !== id))
  }, [])

  const togglePromoCode = useCallback((id: number) => {
    setPromoCodes((prev) =>
      prev.map((code) => (code.id === id ? { ...code, isActive: !code.isActive } : code))
    )
  }, [])

  const validatePromoCode = useCallback(
    (code: string) => {
      const promo = promoCodes.find(
        (p) =>
          p.code.toLowerCase() === code.toLowerCase() &&
          p.isActive &&
          p.usedCount < p.usageLimit &&
          new Date(p.expiresAt) > new Date()
      )
      return promo ? { valid: true, discount: promo.discount } : { valid: false, discount: 0 }
    },
    [promoCodes]
  )

  const addToWhitelist = useCallback((emails: string[]) => {
    const newEntries: WhitelistedEmail[] = emails.map((email, index) => ({
      id: Date.now() + index,
      email: email.toLowerCase(),
      addedAt: new Date().toISOString().split("T")[0],
      plan: "Business",
      activated: false,
    }))
    setWhitelist((prev) => [...newEntries, ...prev])
  }, [])

  const removeFromWhitelist = useCallback((id: number) => {
    setWhitelist((prev) => prev.filter((entry) => entry.id !== id))
  }, [])

  const isWhitelisted = useCallback(
    (email: string) => {
      return whitelist.some((entry) => entry.email.toLowerCase() === email.toLowerCase())
    },
    [whitelist]
  )

  const activateUser = useCallback((id: number) => {
    setPendingUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status: "active" as const } : user))
    )
  }, [])

  const addPendingUser = useCallback((user: Omit<PendingUser, "id" | "status">) => {
    setPendingUsers((prev) => [{ ...user, id: Date.now(), status: "pending" }, ...prev])
  }, [])

  return (
    <AdminContext.Provider
      value={{
        isSuperAdmin,
        promoCodes,
        addPromoCode,
        deletePromoCode,
        togglePromoCode,
        validatePromoCode,
        whitelist,
        addToWhitelist,
        removeFromWhitelist,
        isWhitelisted,
        pendingUsers,
        activateUser,
        addPendingUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
