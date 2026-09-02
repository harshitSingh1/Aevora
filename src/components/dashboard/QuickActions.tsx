import * as React from "react"
import Link from "next/link"
import { Search, Shield, Activity, Mic, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function QuickActions() {
  const actions = [
    {
      title: "Review my bill",
      description: "Check charges and evidence.",
      icon: Search,
      href: "/bill-review",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Understand my insurance",
      description: "See what was approved and what changed.",
      icon: Shield,
      href: "/insurance",
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      title: "Compare care options",
      description: "Explore potential care pathways.",
      icon: Activity,
      href: "/care-options",
      color: "text-info",
      bg: "bg-info/10"
    },
    {
      title: "Talk to Aevora",
      description: "Ask a question about your case.",
      icon: Mic,
      href: "/talk",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, i) => (
        <Link key={i} href={action.href}>
          <Card className="h-full hover:border-border/80 hover:shadow-sm transition-all group">
            <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.bg} ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
