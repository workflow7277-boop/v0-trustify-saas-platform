"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface StoreSettings {
  storeName: string
  storeLogo: string
  vodafoneCash: string
  aiEnabled: boolean
  storeSlug: string
}

interface StoreContextType {
  settings: StoreSettings
  updateSettings: (updates: Partial<StoreSettings>) => void
  isLoading: boolean
}

const defaultSettings: StoreSettings = {
  storeName: "Tech Zone Egypt",
  storeLogo: "",
  vodafoneCash: "01012345678",
  aiEnabled: true,
  storeSlug: "tech-zone",
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load store settings from localStorage
    const savedSettings = localStorage.getItem("trustify_store_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    setIsLoading(false)
  }, [])

  const updateSettings = (updates: Partial<StoreSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    localStorage.setItem("trustify_store_settings", JSON.stringify(newSettings))
  }

  return (
    <StoreContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
