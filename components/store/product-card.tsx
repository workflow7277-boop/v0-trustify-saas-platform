"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Package } from "lucide-react"

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  category: string
  inStock: boolean
  featured?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square bg-muted">
        <div className="flex h-full w-full items-center justify-center">
          <Package className="h-16 w-16 text-muted-foreground/50" />
        </div>
        {product.featured && (
          <Badge className="absolute left-3 top-3">Featured</Badge>
        )}
        {product.originalPrice && (
          <Badge variant="destructive" className="absolute right-3 top-3">
            Sale
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-semibold text-foreground line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{product.price} EGP</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice} EGP
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={() => onAddToCart?.(product)}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
