"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Bot, User } from "lucide-react"

const conversations = [
  {
    id: 1,
    customer: "Ahmed Hassan",
    lastMessage: "What are the delivery options?",
    time: "2 min ago",
    unread: 2,
    aiHandled: true,
  },
  {
    id: 2,
    customer: "Sara Mohamed",
    lastMessage: "Can I return this product?",
    time: "15 min ago",
    unread: 0,
    aiHandled: true,
  },
  {
    id: 3,
    customer: "Omar Khalil",
    lastMessage: "I need help with my order",
    time: "1 hour ago",
    unread: 1,
    aiHandled: false,
  },
  {
    id: 4,
    customer: "Nour Ahmed",
    lastMessage: "Thank you for your help!",
    time: "2 hours ago",
    unread: 0,
    aiHandled: true,
  },
  {
    id: 5,
    customer: "Youssef Ali",
    lastMessage: "Is this product available in blue?",
    time: "3 hours ago",
    unread: 0,
    aiHandled: true,
  },
]

const stats = [
  { label: "Total Conversations", value: "1,234" },
  { label: "AI Handled", value: "85%" },
  { label: "Avg Response Time", value: "< 1 min" },
  { label: "Customer Satisfaction", value: "4.8/5" },
]

export default function MessagesPage() {
  return (
    <>
      <DashboardHeader title="Messages" />
      <main className="flex-1 p-4 lg:p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Customer Messages</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered customer support conversations
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Customer inquiries and AI responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.map((convo) => (
                  <div
                    key={convo.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{convo.customer}</p>
                          {convo.unread > 0 && (
                            <Badge variant="default" className="h-5 w-5 justify-center rounded-full p-0 text-xs">
                              {convo.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{convo.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {convo.aiHandled ? (
                          <>
                            <Bot className="h-3.5 w-3.5" />
                            <span>AI</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Manual</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{convo.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
