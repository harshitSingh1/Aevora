import { AppShell } from "@/components/layout/AppShell"
import { CaseProvider } from "@/lib/context/CaseContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CaseProvider>
      <AppShell>{children}</AppShell>
    </CaseProvider>
  )
}
