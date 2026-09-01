import * as React from "react"
import Link from "next/link"
import { HeartPulse } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-primary">CareLedger</span>
            </Link>
            <p className="text-lg text-muted-foreground max-w-sm">
              Know what you&apos;re agreeing to. Before you pay for it.
            </p>
          </div>

          {/* Links: Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground text-sm">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#talk-to-ai" className="text-muted-foreground hover:text-foreground text-sm">
                  Talk to CareLedger
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Trust & Resources */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Trust</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#responsible-ai" className="text-muted-foreground hover:text-foreground text-sm">
                    Responsible AI
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                    Help
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareLedger
          </p>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            Built for healthcare clarity. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
