import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          <StatsCards />
          <div className="grid gap-6 lg:grid-cols-3">
            <RevenueChart />
            <RecentOrders />
          </div>
        </div>
      </main>
    </>
  )
}
