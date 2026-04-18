import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ahmed Hassan",
    role: "Owner, Cairo Electronics",
    content: "Trustify transformed my business. The AI chatbot handles 80% of customer inquiries automatically, and my sales have increased by 45% since I started using the platform.",
    rating: 5,
  },
  {
    name: "Sara Mohamed",
    role: "Founder, Fashion Forward",
    content: "The dashboard is incredibly intuitive. I can track everything from inventory to sales analytics in one place. Best decision I made for my online store.",
    rating: 5,
  },
  {
    name: "Omar Khalil",
    role: "Manager, Tech Zone",
    content: "Customer support through the AI chat is amazing. Our customers love getting instant responses, and we love not having to be available 24/7. Highly recommended!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Merchants Across Egypt
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See what our successful merchants have to say about Trustify.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-border/50 bg-card p-8"
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-4 text-foreground">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="mt-6">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
