"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! Welcome to Tech Zone. I'm your AI assistant. How can I help you today? I can help you find products, answer questions about shipping, or provide recommendations!",
  },
]

const quickReplies = [
  "What are your best sellers?",
  "Do you offer free shipping?",
  "What's your return policy?",
  "Looking for headphones",
]

// Simulated AI responses based on user input
function getAIResponse(input: string): string {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes("best seller") || lowerInput.includes("popular")) {
    return "Our best sellers right now are the Wireless Headphones Pro (450 EGP) and the Smart Watch Ultra (1,200 EGP). Both have excellent ratings above 4.8 stars! Would you like more details on either of these?"
  }
  
  if (lowerInput.includes("shipping") || lowerInput.includes("delivery")) {
    return "We offer free shipping on orders over 500 EGP within Cairo and Giza. Standard delivery takes 2-3 business days, and express delivery (1 day) is available for an additional 50 EGP. We also ship nationwide across Egypt!"
  }
  
  if (lowerInput.includes("return") || lowerInput.includes("refund")) {
    return "We have a 14-day return policy for all products. Items must be in their original condition with packaging. Refunds are processed within 3-5 business days after we receive the returned item. Would you like me to help you start a return?"
  }
  
  if (lowerInput.includes("headphone") || lowerInput.includes("audio")) {
    return "We have excellent headphone options! Our Wireless Headphones Pro at 450 EGP (on sale from 550 EGP) features premium sound quality and 30-hour battery life. It has a 4.8-star rating from 124 reviews. Would you like to add it to your cart?"
  }
  
  if (lowerInput.includes("watch") || lowerInput.includes("smart")) {
    return "The Smart Watch Ultra at 1,200 EGP is our premium smartwatch with health tracking, GPS, and 5-day battery life. It's rated 4.9 stars and is one of our most popular items. Shall I tell you more about its features?"
  }
  
  if (lowerInput.includes("keyboard") || lowerInput.includes("typing")) {
    return "Our Mechanical Keyboard RGB at 850 EGP (reduced from 1,000 EGP) features Cherry MX switches and customizable RGB lighting. Perfect for both gaming and professional use! It has a 4.8-star rating."
  }
  
  if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("how much")) {
    return "Our products range from 180 EGP (Wireless Charging Pad) to 1,200 EGP (Smart Watch Ultra). We currently have several items on sale! Is there a specific product you'd like to know the price of?"
  }
  
  if (lowerInput.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with? Feel free to ask about any products, shipping, or returns."
  }
  
  return "I'd be happy to help you with that! Could you tell me more about what you're looking for? I can help with product recommendations, shipping information, pricing, or any other questions about our store."
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(message),
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
  }

  const handleQuickReply = (reply: string) => {
    handleSend(reply)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl",
          isOpen && "hidden"
        )}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all",
          isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-primary-foreground">AI Assistant</p>
              <p className="text-xs text-primary-foreground/80">Always here to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies */}
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
