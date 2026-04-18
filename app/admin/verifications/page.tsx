"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileCheck,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  User,
  Calendar,
  DollarSign,
  Filter,
} from "lucide-react"

interface Verification {
  id: number
  merchant: string
  email: string
  amount: string
  phone: string
  method: string
  submitted: string
  transactionId: string
  status: "pending" | "approved" | "rejected"
}

const initialVerifications: Verification[] = [
  { id: 1, merchant: "Sara Hassan", email: "sara@boutique.eg", amount: "250 EGP", phone: "01098765432", method: "Vodafone Cash", submitted: "2024-01-15 10:30", transactionId: "VC-2024-001234", status: "pending" },
  { id: 2, merchant: "Omar Youssef", email: "omar@electronics.eg", amount: "250 EGP", phone: "01123456789", method: "Vodafone Cash", submitted: "2024-01-15 08:15", transactionId: "VC-2024-001233", status: "pending" },
  { id: 3, merchant: "Layla Ahmed", email: "layla@fashion.eg", amount: "250 EGP", phone: "01234567890", method: "Vodafone Cash", submitted: "2024-01-14 16:45", transactionId: "VC-2024-001232", status: "pending" },
  { id: 4, merchant: "Khaled Ibrahim", email: "khaled@gadgets.eg", amount: "250 EGP", phone: "01012345678", method: "Vodafone Cash", submitted: "2024-01-14 14:20", transactionId: "VC-2024-001231", status: "approved" },
  { id: 5, merchant: "Nour Mohamed", email: "nour@accessories.eg", amount: "250 EGP", phone: "01198765432", method: "Vodafone Cash", submitted: "2024-01-14 12:00", transactionId: "VC-2024-001230", status: "approved" },
  { id: 6, merchant: "Yasser Ali", email: "yasser@sports.eg", amount: "250 EGP", phone: "01087654321", method: "Vodafone Cash", submitted: "2024-01-13 11:30", transactionId: "VC-2024-001229", status: "rejected" },
]

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>(initialVerifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const handleApprove = (id: number) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "approved" as const } : v))
    )
  }

  const handleReject = (id: number) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "rejected" as const } : v))
    )
  }

  const filteredVerifications = verifications.filter((v) => {
    const matchesSearch =
      v.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || v.status === filter
    return matchesSearch && matchesFilter
  })

  const pendingCount = verifications.filter((v) => v.status === "pending").length
  const approvedCount = verifications.filter((v) => v.status === "approved").length
  const rejectedCount = verifications.filter((v) => v.status === "rejected").length

  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        <h1 className="text-xl font-semibold text-foreground">Payment Verifications</h1>
        <span className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
          <Clock className="h-4 w-4" />
          {pendingCount} Pending
        </span>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or transaction ID..."
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
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={filter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("rejected")}
              >
                Rejected
              </Button>
            </div>
          </div>

          {/* Verifications List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Verification Requests
              </CardTitle>
              <CardDescription>
                Review and approve payment verifications from merchants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVerifications.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No verifications found matching your criteria
                  </div>
                ) : (
                  filteredVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {verification.merchant}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({verification.email})
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {verification.amount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {verification.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {verification.submitted}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Transaction ID: {verification.transactionId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {verification.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:bg-green-500/10 hover:text-green-600"
                                onClick={() => handleApprove(verification.id)}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-500/10 hover:text-red-600"
                                onClick={() => handleReject(verification.id)}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          ) : verification.status === "approved" ? (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Approved
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-600">
                              <XCircle className="h-4 w-4" />
                              Rejected
                            </span>
                          )}
                        </div>
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
