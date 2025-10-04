"use client"

import { ChatWidget } from "@/components/chat-widget"
import { useEffect, useState } from "react"

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
    <main className="min-h-screen">
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
