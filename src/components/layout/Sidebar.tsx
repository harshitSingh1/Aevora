"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  HeartPulse, 
  LayoutDashboard, 
  Clock, 
  Activity, 
  Receipt, 
  ShieldCheck, 
  Stethoscope, 
  FileText, 
  Mic, 
  Settings, 
  HelpCircle,
  LogOut,
  User
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AIIndicator } from "@/components/aevora/AIIndicator"

const mainNavItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Care Timeline", href: "/timeline", icon: Clock },
  { title: "Financial Analysis", href: "/financial-analysis", icon: Activity },
  { title: "Bill Review", href: "/bill-review", icon: Receipt },
  { title: "Insurance", href: "/insurance", icon: ShieldCheck },
  { title: "Care Options", href: "/care-options", icon: Stethoscope },
  { title: "Documents", href: "/documents", icon: FileText },
]

const advocacyNavItems = [
  { title: "Advocacy Center", href: "/advocacy", icon: Mic },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface px-4 py-6 hidden md:flex">
      <Link href="/" className="flex items-center gap-2 px-2 mb-10 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartPulse className="h-5 w-5" />
        </div>
        <span className="text-xl font-semibold tracking-tight text-primary">Aevora</span>
      </Link>

      <div className="flex-1 overflow-y-auto space-y-6 hide-scrollbar pb-6">
        <div>
          <h4 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main
          </h4>
          <nav className="flex flex-col gap-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10 px-2 transition-colors",
                      isActive 
                        ? "bg-muted text-primary font-semibold relative" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-accent" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-muted-foreground")} />
                    <span className="truncate">{item.title}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <h4 className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Patient Advocacy
          </h4>
          <nav className="flex flex-col gap-1">
            {advocacyNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-10 px-2 transition-colors",
                      isActive 
                        ? "bg-muted text-primary font-semibold relative" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-md bg-accent" />
                    )}
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-muted-foreground")} />
                    <span className="truncate">{item.title}</span>
                  </Button>
                </Link>
              )
            })}
            <Link href="/talk">
              <div
                className={cn(
                  "w-full flex flex-col items-start gap-2 p-3 rounded-lg border border-border/50 transition-colors cursor-pointer",
                  pathname === "/talk" 
                    ? "bg-accent/10 border-accent/20" 
                    : "bg-surface hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <Mic className={cn("h-4 w-4", pathname === "/talk" ? "text-accent" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", pathname === "/talk" ? "text-primary" : "text-foreground")}>
                    Talk to Aevora
                  </span>
                </div>
                <div className="pl-6 w-full flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Have a question?</span>
                  <AIIndicator text="" className="scale-75 origin-right" />
                </div>
              </div>
            </Link>
          </nav>
        </div>
        
        <div className="space-y-1">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground h-10 px-2">
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground h-10 px-2">
            <HelpCircle className="h-4 w-4 shrink-0" />
            Help
          </Button>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border shrink-0 space-y-4">
        <div className="px-2">
          <p className="text-[10px] text-muted-foreground leading-tight">
            <span className="font-semibold text-foreground">Privacy-first:</span> Your healthcare documents are sensitive. Aevora is designed to minimize unnecessary data exposure.
          </p>
        </div>
        <div className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
              AS
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-foreground truncate">Ananya Sharma</span>
              <span className="text-xs text-muted-foreground truncate">Demo Patient</span>
            </div>
          </div>
          <LogOut className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </aside>
  )
}
