"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useStore } from "@/lib/store-context"
import { Upload, Check, Loader2, Smartphone, Bot, Store, ImageIcon } from "lucide-react"

export default function SettingsPage() {
  const { settings, updateSettings } = useStore()
  const [storeName, setStoreName] = useState(settings.storeName)
  const [vodafoneCash, setVodafoneCash] = useState(settings.vodafoneCash)
  const [aiEnabled, setAiEnabled] = useState(settings.aiEnabled)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.storeLogo || null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setLogoPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveStore = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    updateSettings({
      storeName,
      storeLogo: logoPreview || "",
      vodafoneCash,
    })
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleAiToggle = (enabled: boolean) => {
    setAiEnabled(enabled)
    updateSettings({ aiEnabled: enabled })
  }

  return (
    <>
      <DashboardHeader title="Settings" />
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Store Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure your store preferences and payment settings
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Store Information
                </CardTitle>
                <CardDescription>Basic details about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Your Store Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Store logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <label htmlFor="logo-upload">
                        <Button variant="outline" size="sm" asChild className="cursor-pointer">
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </span>
                        </Button>
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveStore} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Payment Settings
                </CardTitle>
                <CardDescription>Configure your Vodafone Cash for receiving payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500">
                      <span className="text-xs font-bold text-white">VC</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Vodafone Cash</p>
                      <p className="text-sm text-muted-foreground">
                        Customers will send payments to this number
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vodafoneCash">Vodafone Cash Number</Label>
                  <Input
                    id="vodafoneCash"
                    value={vodafoneCash}
                    onChange={(e) => setVodafoneCash(e.target.value)}
                    placeholder="01012345678"
                    maxLength={11}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 11-digit Vodafone Cash number
                  </p>
                </div>

                <Button onClick={handleSaveStore} disabled={isSaving} variant="outline" className="w-full">
                  Update Payment Info
                </Button>
              </CardContent>
            </Card>

            {/* AI Chatbot Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Assistant Settings
                </CardTitle>
                <CardDescription>Configure your AI-powered customer support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable AI Assistant</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow AI to automatically respond to customer inquiries
                    </p>
                  </div>
                  <Switch
                    checked={aiEnabled}
                    onCheckedChange={handleAiToggle}
                  />
                </div>

                {aiEnabled && (
                  <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium text-foreground">AI Features Active:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Auto-respond to FAQs
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Product recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Shipping inquiries
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        Return policy support
                      </li>
                    </ul>
                  </div>
                )}

                {!aiEnabled && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">
                      AI Assistant is disabled. Customers will see a contact form instead of the chat widget.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Your current plan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Professional Plan</p>
                      <p className="text-sm text-muted-foreground">250 EGP/month</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Active
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your next billing date is February 15, 2024
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="ghost" className="text-destructive hover:text-destructive">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
