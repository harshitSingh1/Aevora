"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Clock, FileText, Mic, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Timeline", href: "/timeline", icon: Clock },
  { title: "Bills", href: "/bill-review", icon: Receipt },
  { title: "Docs", href: "/documents", icon: FileText },
  { title: "Talk", href: "/talk", icon: Mic },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-surface px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
        const isTalk = item.href === "/talk"

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              isTalk && isActive && "text-accent"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                isActive && !isTalk && "bg-secondary/50",
                isTalk && "bg-accent/10 text-accent",
                isTalk && isActive && "bg-accent text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", isTalk && isActive && "text-primary")} />
            </div>
            <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
              {item.title}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
