"use client"

import * as React from "react"
import { Bell, Search, Menu, ChevronDown, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCase } from "@/lib/context/CaseContext"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppHeaderProps {
  title?: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { currentCase, cases, setCurrentCase, isDemo } = useCase()

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        {title ? (
          <h2 className="text-lg font-semibold text-foreground hidden sm:block">{title}</h2>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Aevora <span className="text-border">/</span> <span className="text-foreground">Overview</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {isDemo && (
          <div className="hidden sm:flex items-center group relative cursor-help">
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              DEMO MODE
            </Badge>
            <div className="absolute top-full mt-2 w-48 right-0 p-2 bg-popover border border-border shadow-md rounded-md text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              This case uses synthetic data for demonstration purposes.
            </div>
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 border-border/60 bg-surface shadow-sm px-3">
              <span className="truncate max-w-[120px] font-medium text-sm">
                {currentCase?.patientName || "Select Case"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground uppercase tracking-wider">
              Available Demo Cases
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cases.map((c) => (
              <DropdownMenuItem 
                key={c.id} 
                onClick={() => setCurrentCase(c.id)}
                className="flex flex-col items-start p-3 focus:bg-muted cursor-pointer"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium text-foreground">{c.patientName}</span>
                  {currentCase?.id === c.id && <Check className="h-4 w-4 text-accent" />}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{c.title}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                if (window.confirm("Reset this demo case and restore the original sample data?")) {
                  window.location.reload();
                }
              }}
              className="text-destructive focus:bg-destructive/10 cursor-pointer p-3"
            >
              Reset Demo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
        
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="h-8 w-8 overflow-hidden rounded-full border border-border bg-muted flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-border transition-all">
          <div className="h-full w-full bg-accent/20 flex items-center justify-center text-primary font-medium text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  )
}
