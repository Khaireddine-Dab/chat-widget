"use client"

import { ChatWidget } from "@/components/chat-widget"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

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

export default function Home() {
  const [settings, setSettings] = useState<ChatWidgetSettings>(defaultSettings)

  useEffect(() => {
    const savedSettings = localStorage.getItem("chatWidgetSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="fixed top-4 right-4 z-50">
        <Link href="/settings">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-balance">Welcome to Your Business</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Try our advanced chat widget in the bottom right corner. It includes AI responses, booking forms, human
            escalation, and more!
          </p>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intelligent responses powered by OpenAI with real-time streaming
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-2">Full-Featured</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Booking forms, human escalation, feedback, and offline mode
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border shadow-sm">
              <h3 className="font-semibold mb-2">Customizable</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Brand colors, position, business hours, and welcome messages
              </p>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <h2 className="text-2xl font-semibold">Features Included</h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Booking System</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Customers can book tables directly through the chat widget
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Human Escalation</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Switch from AI to human agent when needed
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Feedback System</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Thumbs up/down on AI responses to improve quality
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Offline Mode</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Shows custom message when business is closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget
        brandColor={settings.brandColor}
        brandName={settings.brandName}
        brandLogo={settings.brandLogo}
        welcomeMessage={settings.welcomeMessage}
        position={settings.position}
        quickReplies={settings.quickReplies}
        enableBooking={settings.enableBooking}
        enableEscalation={settings.enableEscalation}
        enableFeedback={settings.enableFeedback}
        businessHours={{ open: settings.businessHoursOpen, close: settings.businessHoursClose }}
        phoneNumber={settings.phoneNumber}
        defaultLanguage={settings.defaultLanguage}
      />
    </main>
  )
}
