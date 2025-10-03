"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"

interface ChatWidgetSettings {
  brandColor: string
  brandName: string
  brandLogo: string
  welcomeMessage: string
  position: "bottom-right" | "bottom-left"
  quickReplies: string[]
  enableBooking: boolean
  enableEscalation: boolean
  enableFeedback: boolean
  businessHoursOpen: string
  businessHoursClose: string
  phoneNumber: string
  defaultLanguage: string
}

const defaultSettings: ChatWidgetSettings = {
  brandColor: "#8B5CF6",
  brandName: "Your Business",
  brandLogo: "/abstract-business-logo.png",
  welcomeMessage: "Hi! How can I help you today?",
  position: "bottom-right",
  quickReplies: ["Book a Table", "Opening Hours", "Services", "Contact Us"],
  enableBooking: true,
  enableEscalation: true,
  enableFeedback: true,
  businessHoursOpen: "9:00 AM",
  businessHoursClose: "6:00 PM",
  phoneNumber: "+1 (555) 123-4567",
  defaultLanguage: "en",
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ChatWidgetSettings>(defaultSettings)
  const [quickReplyInput, setQuickReplyInput] = useState("")
  const [saved, setSaved] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("chatWidgetSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("chatWidgetSettings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addQuickReply = () => {
    if (quickReplyInput.trim() && settings.quickReplies.length < 6) {
      setSettings({
        ...settings,
        quickReplies: [...settings.quickReplies, quickReplyInput.trim()],
      })
      setQuickReplyInput("")
    }
  }

  const removeQuickReply = (index: number) => {
    setSettings({
      ...settings,
      quickReplies: settings.quickReplies.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Chat Widget Settings</h1>
              <p className="text-muted-foreground">Customize your chat widget appearance and behavior</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your brand identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={settings.brandName}
                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                    placeholder="Your Business"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandColor">Brand Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="brandColor"
                      type="color"
                      value={settings.brandColor}
                      onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings.brandColor}
                      onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                      placeholder="#8B5CF6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandLogo">Brand Logo URL</Label>
                <Input
                  id="brandLogo"
                  value={settings.brandLogo}
                  onChange={(e) => setSettings({ ...settings, brandLogo: e.target.value })}
                  placeholder="/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  placeholder="Hi! How can I help you today?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Configure widget position and language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Widget Position</Label>
                  <Select
                    value={settings.position}
                    onValueChange={(value: any) => setSettings({ ...settings, position: value })}
                  >
                    <SelectTrigger id="position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select
                    value={settings.defaultLanguage}
                    onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Replies */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Replies</CardTitle>
              <CardDescription>Add quick reply buttons (max 6)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={quickReplyInput}
                  onChange={(e) => setQuickReplyInput(e.target.value)}
                  placeholder="Add quick reply..."
                  onKeyDown={(e) => e.key === "Enter" && addQuickReply()}
                />
                <Button onClick={addQuickReply} disabled={settings.quickReplies.length >= 6}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.quickReplies.map((reply, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                    <span>{reply}</span>
                    <button
                      onClick={() => removeQuickReply(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Enable or disable widget features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking System</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to book tables</p>
                </div>
                <Switch
                  checked={settings.enableBooking}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableBooking: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Human Escalation</Label>
                  <p className="text-sm text-muted-foreground">Switch from AI to human agent</p>
                </div>
                <Switch
                  checked={settings.enableEscalation}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableEscalation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Feedback System</Label>
                  <p className="text-sm text-muted-foreground">Thumbs up/down on responses</p>
                </div>
                <Switch
                  checked={settings.enableFeedback}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableFeedback: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Info */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Configure business hours and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    value={settings.businessHoursOpen}
                    onChange={(e) => setSettings({ ...settings, businessHoursOpen: e.target.value })}
                    placeholder="9:00 AM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    value={settings.businessHoursClose}
                    onChange={(e) => setSettings({ ...settings, businessHoursClose: e.target.value })}
                    placeholder="6:00 PM"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
