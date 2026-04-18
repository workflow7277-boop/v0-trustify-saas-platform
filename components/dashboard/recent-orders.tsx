import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: "Ahmed Hassan",
    product: "Wireless Headphones",
    amount: "450 EGP",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Sara Mohamed",
    product: "Smart Watch Pro",
    amount: "1,200 EGP",
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Omar Khalil",
    product: "Laptop Stand",
    amount: "280 EGP",
    status: "completed",
  },
  {
    id: "ORD-004",
    customer: "Nour Ahmed",
    product: "USB-C Hub",
    amount: "350 EGP",
    status: "pending",
  },
  {
    id: "ORD-005",
    customer: "Youssef Ali",
    product: "Mechanical Keyboard",
    amount: "850 EGP",
    status: "completed",
  },
]

const statusStyles = {
  completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  processing: "bg-primary/10 text-primary hover:bg-primary/20",
  pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.product}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{order.amount}</span>
                <Badge
                  variant="secondary"
                  className={statusStyles[order.status as keyof typeof statusStyles]}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
