import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher'
import { PreferencesForm } from '@/components/settings/PreferencesForm'
import { LocationSettings } from '@/components/settings/LocationSettings'
import { Palette, Moon, Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          </div>
          <p className="text-text-secondary">Customize your calendar experience</p>
        </div>

        {/* Theme Settings */}
        <section className="surface p-6 rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
          </div>

          <div className="space-y-6">
            {/* Theme Switcher */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Theme</h3>
              <ThemeSwitcher />
            </div>

            {/* Dark Mode Info */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-text-primary">Dark Mode</h3>
              </div>

              <div className="space-y-2 text-sm text-text-secondary">
                <p>Dark mode can be toggled using the 🌙/☀️ button in the header.</p>
                <p>
                  Dark mode works independently from your chosen theme. Each theme has its own light
                  and dark color palette.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location Settings */}
        <LocationSettings />

        {/* Preferences Form */}
        <PreferencesForm />

        {/* Footer Info */}
        <div className="text-center text-sm text-text-muted pt-8 border-t border-border">
          <p>Settings are automatically saved to the database.</p>
        </div>
      </div>
    </main>
  )
}
