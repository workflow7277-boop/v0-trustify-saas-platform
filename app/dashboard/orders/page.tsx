"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Filter } from "lucide-react"
import { useState } from "react"

const initialOrders = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    email: "ahmed@example.com",
    items: 2,
    total: "900 EGP",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Sara Mohamed",
    email: "sara@example.com",
    items: 1,
    total: "1,200 EGP",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Omar Khalil",
    email: "omar@example.com",
    items: 3,
    total: "780 EGP",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Nour Ahmed",
    email: "nour@example.com",
    items: 1,
    total: "350 EGP",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Youssef Ali",
    email: "youssef@example.com",
    items: 2,
    total: "1,070 EGP",
    status: "completed",
    date: "2024-01-13",
  },
  {
    id: "ORD-006",
    customer: "Layla Ibrahim",
    email: "layla@example.com",
    items: 4,
    total: "1,850 EGP",
    status: "shipping",
    date: "2024-01-13",
  },
]

const statusStyles = {
  completed: "bg-green-500/10 text-green-500",
  processing: "bg-primary/10 text-primary",
  pending: "bg-yellow-500/10 text-yellow-500",
  shipping: "bg-blue-500/10 text-blue-500",
}

export default function OrdersPage() {
  const [orders] = useState(initialOrders)

  return (
    <>
      <DashboardHeader title="Orders" />
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Order Management</h2>
              <p className="text-sm text-muted-foreground">
                Track and manage customer orders
              </p>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>{orders.length} orders total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Items</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-4 font-medium text-foreground">{order.id}</td>
                        <td className="py-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{order.items} items</td>
                        <td className="py-4 text-sm font-medium text-foreground">{order.total}</td>
                        <td className="py-4">
                          <Badge
                            variant="secondary"
                            className={statusStyles[order.status as keyof typeof statusStyles]}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
                        <td className="py-4">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
