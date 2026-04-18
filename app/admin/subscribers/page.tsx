"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Store,
  MoreVertical,
  Eye,
  Ban,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Subscriber {
  id: number
  name: string
  email: string
  storeName: string
  plan: string
  joinedDate: string
  status: "active" | "pending" | "suspended"
  revenue: string
}

const subscribers: Subscriber[] = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed@techzone.eg", storeName: "Tech Zone Egypt", plan: "Professional", joinedDate: "2024-01-01", status: "active", revenue: "12,500 EGP" },
  { id: 2, name: "Sara Hassan", email: "sara@boutique.eg", storeName: "Sara Boutique", plan: "Professional", joinedDate: "2024-01-15", status: "pending", revenue: "0 EGP" },
  { id: 3, name: "Mohamed Ali", email: "mohamed@shop.eg", storeName: "Ali Electronics", plan: "Professional", joinedDate: "2023-12-20", status: "active", revenue: "8,750 EGP" },
  { id: 4, name: "Fatma Ibrahim", email: "fatma@fashion.eg", storeName: "Fatma Fashion", plan: "Professional", joinedDate: "2023-12-15", status: "active", revenue: "15,200 EGP" },
  { id: 5, name: "Omar Youssef", email: "omar@electronics.eg", storeName: "Omar Tech", plan: "Professional", joinedDate: "2024-01-14", status: "pending", revenue: "0 EGP" },
  { id: 6, name: "Layla Ahmed", email: "layla@fashion.eg", storeName: "Layla Style", plan: "Professional", joinedDate: "2023-11-10", status: "active", revenue: "22,100 EGP" },
  { id: 7, name: "Khaled Ibrahim", email: "khaled@gadgets.eg", storeName: "Gadget World", plan: "Professional", joinedDate: "2023-10-05", status: "active", revenue: "18,600 EGP" },
  { id: 8, name: "Nour Mohamed", email: "nour@accessories.eg", storeName: "Nour Accessories", plan: "Professional", joinedDate: "2023-09-20", status: "suspended", revenue: "5,400 EGP" },
]

export default function SubscribersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "suspended">("all")

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.storeName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || s.status === filter
    return matchesSearch && matchesFilter
  })

  const activeCount = subscribers.filter((s) => s.status === "active").length
  const pendingCount = subscribers.filter((s) => s.status === "pending").length
  const suspendedCount = subscribers.filter((s) => s.status === "suspended").length

  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        <h1 className="text-xl font-semibold text-foreground">Subscribers</h1>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {subscribers.length} Total
        </span>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-foreground">{suspendedCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "suspended" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("suspended")}
              >
                Suspended
              </Button>
            </div>
          </div>

          {/* Subscribers List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Subscribers
              </CardTitle>
              <CardDescription>
                Manage and monitor all merchants on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubscribers.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No subscribers found matching your criteria
                  </div>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {subscriber.name}
                            </span>
                            {subscriber.status === "active" && (
                              <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </span>
                            )}
                            {subscriber.status === "pending" && (
                              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                                <Clock className="h-3 w-3" />
                                Pending
                              </span>
                            )}
                            {subscriber.status === "suspended" && (
                              <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-600">
                                <Ban className="h-3 w-3" />
                                Suspended
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {subscriber.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Store className="h-4 w-4" />
                              {subscriber.storeName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Joined {subscriber.joinedDate}
                            </span>
                          </div>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Total Revenue: </span>
                            <span className="font-medium text-foreground">{subscriber.revenue}</span>
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Store className="mr-2 h-4 w-4" />
                              View Store
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-amber-600">
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
