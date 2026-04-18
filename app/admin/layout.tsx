"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useAdmin } from "@/lib/admin-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Loader2, ShieldAlert } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const { isSuperAdmin } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  // Additional security check for Super Admin
  const hasSuperAdminAccess = isSuperAdmin(user.email)

  // Show warning if not super admin trying to access sensitive pages
  if (!hasSuperAdminAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            This area is restricted to Super Administrators only.
            Contact the system administrator if you need access.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-col lg:pl-64">
        {children}
      </div>
    </div>
  )
}
