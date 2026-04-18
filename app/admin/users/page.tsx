"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdmin } from "@/lib/admin-context"
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  Zap,
  Gift,
  Shield,
  UserPlus,
  Copy,
  Trash2,
  Crown,
  Mail,
  Store,
  Calendar,
  CheckCheck,
} from "lucide-react"

export default function UserManagementPage() {
  const {
    promoCodes,
    addPromoCode,
    deletePromoCode,
    togglePromoCode,
    whitelist,
    addToWhitelist,
    removeFromWhitelist,
    pendingUsers,
    activateUser,
  } = useAdmin()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // Promo code form
  const [newPromoCode, setNewPromoCode] = useState("")
  const [newPromoDiscount, setNewPromoDiscount] = useState("100")
  const [newPromoLimit, setNewPromoLimit] = useState("10")
  const [newPromoExpiry, setNewPromoExpiry] = useState("")
  
  // Whitelist form
  const [newWhitelistEmails, setNewWhitelistEmails] = useState("")

  const handleFreePassActivation = (userId: number) => {
    activateUser(userId)
  }

  const handleCreatePromoCode = () => {
    if (!newPromoCode.trim()) return
    
    addPromoCode({
      code: newPromoCode.toUpperCase(),
      discount: parseInt(newPromoDiscount) || 100,
      usageLimit: parseInt(newPromoLimit) || 10,
      usedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt: newPromoExpiry || "2024-12-31",
      isActive: true,
    })
    
    setNewPromoCode("")
    setNewPromoDiscount("100")
    setNewPromoLimit("10")
    setNewPromoExpiry("")
  }

  const handleAddToWhitelist = () => {
    if (!newWhitelistEmails.trim()) return
    
    const emails = newWhitelistEmails
      .split(/[\n,]/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && e.includes("@"))
    
    addToWhitelist(emails)
    setNewWhitelistEmails("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredPendingUsers = pendingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingCount = pendingUsers.filter((u) => u.status === "pending").length
  const activeCount = pendingUsers.filter((u) => u.status === "active").length

  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-foreground">User Management</h1>
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">
            <Shield className="h-3 w-3" />
            Super Admin Only
          </span>
        </div>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
          God Mode
        </span>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Users</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free Pass Given</p>
                  <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Promos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {promoCodes.filter((p) => p.isActive).length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Whitelisted</p>
                  <p className="text-2xl font-bold text-foreground">{whitelist.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manual Activation Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Manual Activation - Free Pass
              </CardTitle>
              <CardDescription>
                Instantly activate users without payment verification. Their store will be generated immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or store name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredPendingUsers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No pending users found
                  </div>
                ) : (
                  filteredPendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{user.name}</span>
                          {user.status === "active" && (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                              Activated
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            {user.storeName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {user.registeredAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user.status === "pending" ? (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                            onClick={() => handleFreePassActivation(user.id)}
                          >
                            <Zap className="mr-1 h-4 w-4" />
                            Free Pass / Activate
                          </Button>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Store Generated
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Promo Code Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Promo Code Generator
              </CardTitle>
              <CardDescription>
                Create custom promo codes for discounts at checkout. 100% discount = completely free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label htmlFor="promoCode">Promo Code</Label>
                    <Input
                      id="promoCode"
                      placeholder="e.g., BROTHER100"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount %</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="100"
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      min="1"
                      placeholder="10"
                      value={newPromoLimit}
                      onChange={(e) => setNewPromoLimit(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expires On</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={newPromoExpiry}
                      onChange={(e) => setNewPromoExpiry(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleCreatePromoCode} className="w-full">
                      <Gift className="mr-2 h-4 w-4" />
                      Create Code
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {promoCodes.map((promo) => (
                  <div
                    key={promo.id}
                    className={`flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                      promo.isActive ? "border-border" : "border-border/50 bg-muted/30"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-primary/10 px-2 py-1 font-mono text-sm font-bold text-primary">
                          {promo.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => copyToClipboard(promo.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {promo.discount === 100 && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                            100% OFF
                          </span>
                        )}
                        {!promo.isActive && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Disabled
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{promo.discount}% discount</span>
                        <span>
                          Used: {promo.usedCount}/{promo.usageLimit}
                        </span>
                        <span>Expires: {promo.expiresAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePromoCode(promo.id)}
                      >
                        {promo.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => handleDeletePromoCode(promo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Whitelisting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                VIP Whitelist - Auto Business Plan
              </CardTitle>
              <CardDescription>
                Add emails that will automatically receive the Business Plan features for free upon registration.
                Perfect for family and friends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="whitelist">Email Addresses</Label>
                    <Textarea
                      id="whitelist"
                      placeholder="Enter emails (one per line or comma-separated):&#10;brother@gmail.com&#10;sister@gmail.com, cousin@gmail.com"
                      value={newWhitelistEmails}
                      onChange={(e) => setNewWhitelistEmails(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddToWhitelist}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add to Whitelist
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {whitelist.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No whitelisted emails yet
                  </div>
                ) : (
                  whitelist.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{entry.email}</span>
                          <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600">
                            {entry.plan}
                          </span>
                          {entry.activated ? (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                              Registered
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                              Awaiting Registration
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Added: {entry.addedAt}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-500/10 hover:text-red-600"
                        onClick={() => handleRemoveFromWhitelist(entry.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
