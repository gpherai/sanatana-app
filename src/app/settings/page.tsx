/**
 * Settings Page
 * User preferences and settings
 */

'use client'

import { Container } from '@/shared/components/layout/Container'
import { Button } from '@/shared/components/ui/Button'
import { ThemeSwitcher } from '@/features/themes/components/ThemeSwitcher'

export default function SettingsPage() {
  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
            <p className="text-muted-foreground mb-4">
              Settings functionality will be implemented in the next phase.
            </p>
            <p className="text-sm text-muted-foreground">
              Available settings:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Default calendar view (month/week/day)</li>
              <li>Show lunar information</li>
              <li>Show holidays</li>
              <li>Notification preferences</li>
              <li>Saved locations</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Saved Locations</h2>
            <p className="text-muted-foreground">
              Manage your saved locations for accurate lunar calculations.
            </p>
            <Button variant="outline" className="mt-4">
              Add Location
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Themes</h2>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </Container>
  )
}
