"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

interface StoreHeaderProps {
  cartCount?: number
}

export function StoreHeader({ cartCount = 0 }: StoreHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/store" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Tech Zone</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/store" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            All Products
          </Link>
          <Link href="/store?category=electronics" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Electronics
          </Link>
          <Link href="/store?category=accessories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Accessories
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
          <Button variant="ghost" asChild className="hidden md:flex">
            <Link href="/">Back to Trustify</Link>
          </Button>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="flex flex-col gap-4 px-4 py-4">
            <Link href="/store" className="text-sm font-medium text-muted-foreground">
              All Products
            </Link>
            <Link href="/store?category=electronics" className="text-sm font-medium text-muted-foreground">
              Electronics
            </Link>
            <Link href="/store?category=accessories" className="text-sm font-medium text-muted-foreground">
              Accessories
            </Link>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">Back to Trustify</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
