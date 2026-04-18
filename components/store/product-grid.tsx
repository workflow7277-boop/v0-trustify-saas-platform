"use client"

import { ProductCard, type Product } from "./product-card"

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: 450,
    originalPrice: 550,
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: 1200,
    rating: 4.9,
    reviews: 89,
    category: "Electronics",
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: "Laptop Stand Aluminum",
    price: 280,
    rating: 4.6,
    reviews: 67,
    category: "Accessories",
    inStock: true,
  },
  {
    id: 4,
    name: "USB-C Hub 7-in-1",
    price: 350,
    rating: 4.7,
    reviews: 156,
    category: "Accessories",
    inStock: false,
  },
  {
    id: 5,
    name: "Mechanical Keyboard RGB",
    price: 850,
    originalPrice: 1000,
    rating: 4.8,
    reviews: 203,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 6,
    name: "Wireless Mouse Ergonomic",
    price: 220,
    rating: 4.5,
    reviews: 98,
    category: "Accessories",
    inStock: true,
  },
  {
    id: 7,
    name: "4K Webcam HD Pro",
    price: 680,
    rating: 4.7,
    reviews: 45,
    category: "Electronics",
    inStock: true,
  },
  {
    id: 8,
    name: "Wireless Charging Pad",
    price: 180,
    originalPrice: 220,
    rating: 4.4,
    reviews: 178,
    category: "Accessories",
    inStock: true,
  },
]

interface ProductGridProps {
  onAddToCart?: (product: Product) => void
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
