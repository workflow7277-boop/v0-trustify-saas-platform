import { 
  LayoutDashboard, 
  MessageSquareText, 
  TrendingUp, 
  Package, 
  CreditCard, 
  Shield 
} from "lucide-react"

const features = [
  {
    icon: LayoutDashboard,
    title: "Merchant Dashboard",
    description: "Complete control over your store with real-time analytics, order management, and inventory tracking.",
  },
  {
    icon: MessageSquareText,
    title: "AI Customer Support",
    description: "24/7 intelligent chatbot that answers customer questions, processes orders, and provides product recommendations.",
  },
  {
    icon: TrendingUp,
    title: "Sales Analytics",
    description: "Deep insights into your business performance with detailed reports and actionable recommendations.",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Automatic stock tracking, low inventory alerts, and seamless product catalog management.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Multiple payment options with bank-level security for you and your customers.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Built-in fraud detection and secure transaction processing to protect your business.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Powerful features designed specifically for Egyptian merchants to grow their online business.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
