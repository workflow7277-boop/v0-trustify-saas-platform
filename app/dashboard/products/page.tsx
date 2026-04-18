"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { useState } from "react"

const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: "450 EGP",
    stock: 25,
    category: "Electronics",
    status: "active",
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: "1,200 EGP",
    stock: 15,
    category: "Electronics",
    status: "active",
  },
  {
    id: 3,
    name: "Laptop Stand Aluminum",
    price: "280 EGP",
    stock: 50,
    category: "Accessories",
    status: "active",
  },
  {
    id: 4,
    name: "USB-C Hub 7-in-1",
    price: "350 EGP",
    stock: 0,
    category: "Accessories",
    status: "out_of_stock",
  },
  {
    id: 5,
    name: "Mechanical Keyboard RGB",
    price: "850 EGP",
    stock: 12,
    category: "Electronics",
    status: "active",
  },
  {
    id: 6,
    name: "Wireless Mouse Ergonomic",
    price: "220 EGP",
    stock: 35,
    category: "Accessories",
    status: "active",
  },
]

export default function ProductsPage() {
  const [products] = useState(initialProducts)

  return (
    <>
      <DashboardHeader title="Products" />
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Product Catalog</h2>
              <p className="text-sm text-muted-foreground">
                Manage your products and inventory
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>{products.length} products in your catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Product</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium text-foreground">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{product.category}</td>
                        <td className="py-4 text-sm font-medium text-foreground">{product.price}</td>
                        <td className="py-4 text-sm text-muted-foreground">{product.stock} units</td>
                        <td className="py-4">
                          <Badge
                            variant="secondary"
                            className={
                              product.status === "active"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }
                          >
                            {product.status === "active" ? "Active" : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
