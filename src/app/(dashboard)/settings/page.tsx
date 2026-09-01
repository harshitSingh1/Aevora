import { PageHeader } from "@/components/layout/PageHeader"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <PageHeader title="Settings" description="Manage your account preferences and API keys." />
      <div className="mt-8 text-muted-foreground">Your settings will appear here.</div>
    </div>
  )
}
