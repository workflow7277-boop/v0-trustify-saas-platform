"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Zap, Crown, Gift } from "lucide-react"

const stats = [
  {
    title: "Total Subscribers",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active merchants",
  },
  {
    title: "Total Revenue",
    value: "711,750 EGP",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "This month",
  },
  {
    title: "Monthly Growth",
    value: "+156",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "New subscribers",
  },
  {
    title: "Pending Verifications",
    value: "18",
    change: "-5",
    changeType: "neutral" as const,
    icon: Clock,
    description: "Awaiting review",
  },
]

const recentSubscribers = [
  { id: 1, name: "Mohamed Ali", email: "mohamed@shop.eg", plan: "Professional", date: "2024-01-15", status: "active" },
  { id: 2, name: "Sara Hassan", email: "sara@boutique.eg", plan: "Professional", date: "2024-01-15", status: "pending" },
  { id: 3, name: "Ahmed Mahmoud", email: "ahmed@tech.eg", plan: "Professional", date: "2024-01-14", status: "active" },
  { id: 4, name: "Fatma Ibrahim", email: "fatma@fashion.eg", plan: "Professional", date: "2024-01-14", status: "active" },
  { id: 5, name: "Omar Youssef", email: "omar@electronics.eg", plan: "Professional", date: "2024-01-13", status: "pending" },
]

const pendingVerifications = [
  { id: 1, merchant: "Sara Hassan", amount: "250 EGP", method: "Vodafone Cash", submitted: "2 hours ago", phone: "01098765432" },
  { id: 2, merchant: "Omar Youssef", amount: "250 EGP", method: "Vodafone Cash", submitted: "5 hours ago", phone: "01123456789" },
  { id: 3, merchant: "Layla Ahmed", amount: "250 EGP", method: "Vodafone Cash", submitted: "1 day ago", phone: "01234567890" },
]

export default function AdminDashboard() {
  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
        <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600">
          God Mode
        </span>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-green-600"
                          : stat.changeType === "negative"
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions - Super Admin Tools */}
          <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-amber-600/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Super Admin Quick Actions
              </CardTitle>
              <CardDescription>
                Powerful tools for managing users, promos, and VIP access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Link href="/admin/users">
                    <Zap className="h-6 w-6 text-amber-500" />
                    <span className="font-medium">Free Pass Activation</span>
                    <span className="text-xs text-muted-foreground">Bypass payment verification</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Link href="/admin/users">
                    <Gift className="h-6 w-6 text-primary" />
                    <span className="font-medium">Promo Codes</span>
                    <span className="text-xs text-muted-foreground">Create 100% discount codes</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Link href="/admin/users">
                    <Crown className="h-6 w-6 text-purple-600" />
                    <span className="font-medium">VIP Whitelist</span>
                    <span className="text-xs text-muted-foreground">Auto Business Plan access</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending Verifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Pending Verifications
                </CardTitle>
                <CardDescription>
                  Payment verifications awaiting your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{item.merchant}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.amount} via {item.method}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Phone: {item.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.submitted}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-500/20">
                          Approve
                        </button>
                        <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-500/20">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Subscribers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Subscribers
                </CardTitle>
                <CardDescription>
                  Latest merchants who joined the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSubscribers.map((subscriber) => (
                    <div
                      key={subscriber.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{subscriber.name}</p>
                        <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {subscriber.plan} - {subscriber.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {subscriber.status === "active" ? (
                          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
