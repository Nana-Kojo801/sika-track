import { useState } from "react"
import { User, Bell, Globe, DollarSign, Clock, Pickaxe } from "lucide-react"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SikaBrand } from "@/components/SikaLogo"
import { toast } from "@/components/ui/use-toast"
import { GHANA_REGIONS, MATERIALS, PAYMENT_METHODS } from "@/lib/constants"

const STORAGE_KEY = "sikatrack_settings"

const defaultSettings = {
  minerName: "",
  region: "",
  primaryMaterial: "Gold",
  currency: "GHS",
  updateFrequency: "60",
  defaultPaymentMethod: "Cash",
  language: "en",
  notificationsEnabled: true,
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
  } catch { return defaultSettings }
}

export default function Settings() {
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)

  const set = (k) => (v) => setSettings((s) => ({ ...s, [k]: v }))

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    toast({ title: "Settings saved ✓", variant: "success" })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageWrapper>
      <PageHeader title="Settings" subtitle="Configure SikaTrack for your operations" />

      {/* Profile */}
      <Card className="gold-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-gold-400" />
            Miner Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="minerName">Miner Name</Label>
              <Input
                id="minerName"
                placeholder="Your name"
                value={settings.minerName}
                onChange={(e) => set("minerName")(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Region</Label>
              <Select value={settings.region} onValueChange={set("region")}>
                <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {GHANA_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Primary Material</Label>
              <Select value={settings.primaryMaterial} onValueChange={set("primaryMaterial")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATERIALS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="gold-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-gold-400" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Currency */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Currency Display</p>
              <p className="text-xs text-zinc-500">Primary currency for prices</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${settings.currency === "USD" ? "text-zinc-500" : "text-gold-400"}`}>GHS</span>
              <Switch
                checked={settings.currency === "USD"}
                onCheckedChange={(v) => set("currency")(v ? "USD" : "GHS")}
              />
              <span className={`text-xs font-medium ${settings.currency === "USD" ? "text-gold-400" : "text-zinc-500"}`}>USD</span>
            </div>
          </div>

          <Separator />

          {/* Price update frequency */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Price Update Frequency</p>
              <p className="text-xs text-zinc-500">How often to refresh gold prices</p>
            </div>
            <Select value={settings.updateFrequency} onValueChange={set("updateFrequency")}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
                <SelectItem value="900">15 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Default payment method */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Default Payment Method</p>
              <p className="text-xs text-zinc-500">Pre-filled when recording sales</p>
            </div>
            <Select value={settings.defaultPaymentMethod} onValueChange={set("defaultPaymentMethod")}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">Price Alerts</p>
              <p className="text-xs text-zinc-500">Get notified when price thresholds are hit</p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={set("notificationsEnabled")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="gold-card mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-gold-400" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-300">UI Language</p>
              <p className="text-xs text-zinc-500">Twi support coming soon</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={settings.language === "en" ? "gold" : "outline"}
                size="sm"
                onClick={() => set("language")("en")}
              >
                English
              </Button>
              <Button
                variant={settings.language === "tw" ? "gold" : "outline"}
                size="sm"
                onClick={() => set("language")("tw")}
                disabled
                className="opacity-50"
              >
                Twi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <Button className="w-full" size="lg" onClick={handleSave}>
        {saved ? "Saved ✓" : "Save Settings"}
      </Button>

      {/* About */}
      <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col items-center gap-3">
        <SikaBrand />
        <p className="text-xs text-zinc-600 text-center">
          Know your worth. Own your mine.
        </p>
        <p className="text-[10px] text-zinc-700">
          SikaTrack v1.0.0 · Built for Ghana's Artisanal Miners
        </p>
      </div>
    </PageWrapper>
  )
}
