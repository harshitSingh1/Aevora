import Link from "next/link"
import { HeartPulse, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CareFlow } from "@/components/careledger/CareFlow"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left side - Product context */}
      <div className="hidden lg:flex flex-col flex-1 bg-surface border-r border-border p-12 justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-6 w-6" />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-primary">CareLedger</span>
          </Link>

          <h1 className="text-4xl font-bold tracking-tight text-foreground max-w-lg mb-6">
            Understand your healthcare journey.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mb-12">
            CareLedger connects your treatment, estimates, insurance, and bills into one clear financial story.
          </p>

          <div className="max-w-lg">
            <Card className="border-border/60 shadow-sm bg-background/50">
              <CardContent className="pt-6 pb-2">
                <CareFlow />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CareLedger. Built for healthcare clarity.
        </div>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="h-7 w-7" />
            </div>
          </div>
          
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="#" className="text-sm text-accent hover:underline">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            
            <Button className="w-full h-11 text-base mt-2">
              Sign in <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-semibold">Or</span>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <Link href="/dashboard" className="block">
              <Button variant="outline" className="w-full h-11 text-base bg-surface shadow-sm border-border">
                Continue with Demo
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              No real patient data is required for demo mode.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
