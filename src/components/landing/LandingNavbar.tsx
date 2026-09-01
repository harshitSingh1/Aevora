"use client"

import * as React from "react"
import Link from "next/link"
import { HeartPulse, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-surface/80 backdrop-blur-md py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-primary">CareLedger</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#talk-to-ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Talk to AI
          </Link>
          <Link href="#responsible-ai" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Responsible AI
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link href="/dashboard">
            <Button>Get Started &rarr;</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4 z-50">
          <Link href="#how-it-works" className="text-base font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
            How it works
          </Link>
          <Link href="#features" className="text-base font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
            Features
          </Link>
          <Link href="#talk-to-ai" className="text-base font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
            Talk to AI
          </Link>
          <Link href="#responsible-ai" className="text-base font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
            Responsible AI
          </Link>
          <hr className="border-border my-2" />
          <Link href="/dashboard" className="text-base font-medium p-2" onClick={() => setMobileMenuOpen(false)}>
            Sign in
          </Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full justify-center">Get Started &rarr;</Button>
          </Link>
        </div>
      )}
    </header>
  )
}
