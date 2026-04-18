"use client"

import { useState } from "react"
import { StoreHeader } from "@/components/store/store-header"
import { ProductGrid } from "@/components/store/product-grid"
import { AIChatWidget } from "@/components/store/ai-chat-widget"
import { type Product } from "@/components/store/product-card"

export default function StorePage() {
  const [cartItems, setCartItems] = useState<Product[]>([])

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product])
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader cartCount={cartItems.length} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Tech Zone Store</h1>
          <p className="mt-2 text-muted-foreground">
            Discover the latest tech accessories and electronics
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            All
          </button>
          <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80">
            Electronics
          </button>
          <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80">
            Accessories
          </button>
          <button className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80">
            On Sale
          </button>
        </div>

        <ProductGrid onAddToCart={handleAddToCart} />
      </main>
      
      <AIChatWidget />
    </div>
  )
}
