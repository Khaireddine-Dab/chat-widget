"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  MessageCircle,
  X,
  Send,
  Phone,
  User,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Users,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Languages,
  ImageIcon,
  FileText,
  Mic,
  MicOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  feedback?: "positive" | "negative"
  file?: {
    name: string
    type: string
    url: string
  }
}

const translations = {
  en: {
    support: "Support",
    online: "Online now",
    offline: "Offline",
    humanAgent: "Human Agent",
    placeholder: "Type your message...",
    shareInfo: "Share Info",
    callUs: "Call Us",
    talkToHuman: "Talk to Human",
    welcomeMessage: "Hi! How can I help you today?",
    quickReplies: ["Book a Table", "Opening Hours", "Services", "Contact Us"],
    offlineTitle: "We're currently offline",
    offlineMessage: "We'll get back to you tomorrow at",
    bookTable: "Book a Table",
    date: "Date",
    time: "Time",
    guests: "Number of Guests",
    specialRequests: "Special Requests (Optional)",
    cancel: "Cancel",
    bookNow: "Book Now",
    submit: "Submit",
    yourName: "Your name",
    yourEmail: "Your email",
    yourPhone: "Your phone",
    getToKnow: "Let's get to know you better",
    connectingAgent: "I'm connecting you with a human agent. They'll be with you shortly!",
    agentWillRespond: "A human agent will respond to you shortly. Please hold on.",
  },
  es: {
    support: "Soporte",
    online: "En línea ahora",
    offline: "Desconectado",
    humanAgent: "Agente Humano",
    placeholder: "Escribe tu mensaje...",
    shareInfo: "Compartir Info",
    callUs: "Llámanos",
    talkToHuman: "Hablar con Humano",
    welcomeMessage: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    quickReplies: ["Reservar Mesa", "Horario", "Servicios", "Contacto"],
    offlineTitle: "Actualmente estamos desconectados",
    offlineMessage: "Te responderemos mañana a las",
    bookTable: "Reservar Mesa",
    date: "Fecha",
    time: "Hora",
    guests: "Número de Invitados",
    specialRequests: "Solicitudes Especiales (Opcional)",
    cancel: "Cancelar",
    bookNow: "Reservar Ahora",
    submit: "Enviar",
    yourName: "Tu nombre",
    yourEmail: "Tu correo",
    yourPhone: "Tu teléfono",
    getToKnow: "Conozcámonos mejor",
    connectingAgent: "Te estoy conectando con un agente humano. ¡Estarán contigo en breve!",
    agentWillRespond: "Un agente humano te responderá en breve. Por favor espera.",
  },
  fr: {
    support: "Support",
    online: "En ligne maintenant",
    offline: "Hors ligne",
    humanAgent: "Agent Humain",
    placeholder: "Tapez votre message...",
    shareInfo: "Partager Info",
    callUs: "Appelez-nous",
    talkToHuman: "Parler à un Humain",
    welcomeMessage: "Salut! Comment puis-je vous aider aujourd'hui?",
    quickReplies: ["Réserver Table", "Horaires", "Services", "Contact"],
    offlineTitle: "Nous sommes actuellement hors ligne",
    offlineMessage: "Nous vous répondrons demain à",
    bookTable: "Réserver une Table",
    date: "Date",
    time: "Heure",
    guests: "Nombre d'Invités",
    specialRequests: "Demandes Spéciales (Optionnel)",
    cancel: "Annuler",
    bookNow: "Réserver",
    submit: "Soumettre",
    yourName: "Votre nom",
    yourEmail: "Votre email",
    yourPhone: "Votre téléphone",
    getToKnow: "Faisons connaissance",
    connectingAgent: "Je vous connecte avec un agent humain. Ils seront avec vous sous peu!",
    agentWillRespond: "Un agent humain vous répondra sous peu. Veuillez patienter.",
  },
  de: {
    support: "Support",
    online: "Jetzt online",
    offline: "Offline",
    humanAgent: "Menschlicher Agent",
    placeholder: "Geben Sie Ihre Nachricht ein...",
    shareInfo: "Info teilen",
    callUs: "Rufen Sie uns an",
    talkToHuman: "Mit Mensch sprechen",
    welcomeMessage: "Hallo! Wie kann ich Ihnen heute helfen?",
    quickReplies: ["Tisch reservieren", "Öffnungszeiten", "Dienstleistungen", "Kontakt"],
    offlineTitle: "Wir sind derzeit offline",
    offlineMessage: "Wir melden uns morgen um",
    bookTable: "Tisch reservieren",
    date: "Datum",
    time: "Zeit",
    guests: "Anzahl der Gäste",
    specialRequests: "Besondere Wünsche (Optional)",
    cancel: "Abbrechen",
    bookNow: "Jetzt buchen",
    submit: "Einreichen",
    yourName: "Ihr Name",
    yourEmail: "Ihre E-Mail",
    yourPhone: "Ihre Telefonnummer",
    getToKnow: "Lernen wir uns kennen",
    connectingAgent: "Ich verbinde Sie mit einem menschlichen Agenten. Sie werden in Kürze bei Ihnen sein!",
    agentWillRespond: "Ein menschlicher Agent wird Ihnen in Kürze antworten. Bitte warten Sie.",
  },
}

type Language = keyof typeof translations

interface ChatWidgetProps {
  brandColor?: string
  brandName?: string
  brandLogo?: string
  welcomeMessage?: string
  position?: "bottom-right" | "bottom-left"
  quickReplies?: string[]
  enableBooking?: boolean
  enableEscalation?: boolean
  enableFeedback?: boolean
  businessHours?: {
    open: string
    close: string
  }
  phoneNumber?: string
  defaultLanguage?: Language
}

export function ChatWidget({
  brandColor = "#8B5CF6",
  brandName = "Support",
  brandLogo,
  welcomeMessage,
  position = "bottom-right",
  quickReplies,
  enableBooking = true,
  enableEscalation = true,
  enableFeedback = true,
  businessHours = { open: "9:00 AM", close: "6:00 PM" },
  phoneNumber = "+1 (555) 123-4567",
  defaultLanguage = "en",
}: ChatWidgetProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const t = translations[language]

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: welcomeMessage || t.welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showInfoForm, setShowInfoForm] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isHumanAgent, setIsHumanAgent] = useState(false)
  const [isRecording, setIsRecording] = useState(false) // Added state for voice recording
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    time: "",
    guests: "2",
    notes: "",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null) // Added ref for media recorder
  const audioChunksRef = useRef<Blob[]>([]) // Added ref for audio chunks

  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === 0 && msg.sender === "bot" ? { ...msg, text: welcomeMessage || t.welcomeMessage } : msg,
      ),
    )
  }, [language, welcomeMessage, t.welcomeMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileUrl = URL.createObjectURL(file)

    const fileMessage: Message = {
      id: Date.now().toString(),
      text: `Sent a file: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
      file: {
        name: file.name,
        type: file.type,
        url: fileUrl,
      },
    }

    setMessages((prev) => [...prev, fileMessage])

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing the file! I've received it and will review it shortly.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    if (isHumanAgent) {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t.agentWillRespond,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)
      return
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          context: customerInfo.name ? `Customer name: ${customerInfo.name}` : undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let botResponseText = ""

      const botMessageId = (Date.now() + 1).toString()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          botResponseText += chunk

          setMessages((prev) => {
            const existingBotMessage = prev.find((m) => m.id === botMessageId)
            if (existingBotMessage) {
              return prev.map((m) => (m.id === botMessageId ? { ...m, text: botResponseText } : m))
            } else {
              return [
                ...prev,
                {
                  id: botMessageId,
                  text: botResponseText,
                  sender: "bot" as const,
                  timestamp: new Date(),
                },
              ]
            }
          })
        }
      }

      setIsTyping(false)
    } catch (error) {
      console.error("[v0] Error fetching AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleQuickReply = (reply: string) => {
    if (reply === t.quickReplies[0] && enableBooking) {
      setShowBookingForm(true)
      return
    }
    if (reply === t.quickReplies[1]) {
      const hoursMessage: Message = {
        id: Date.now().toString(),
        text: `Our business hours are ${businessHours.open} to ${businessHours.close}. ${
          isBusinessOpen() ? "We're currently open!" : "We're currently closed."
        }`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, hoursMessage])
      return
    }
    handleSendMessage(reply)
  }

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault()
    setShowInfoForm(false)
    const infoMessage: Message = {
      id: Date.now().toString(),
      text: `Great! I've saved your information. How can I assist you, ${customerInfo.name}?`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, infoMessage])
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setShowBookingForm(false)
    const bookingMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect! I've received your booking request for ${bookingInfo.guests} guests on ${bookingInfo.date} at ${bookingInfo.time}. We'll send you a confirmation shortly!`,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, bookingMessage])
  }

  const handleEscalateToHuman = () => {
    setIsHumanAgent(true)
    const escalationMessage: Message = {
      id: Date.now().toString(),
      text: t.connectingAgent,
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, escalationMessage])
  }

  const handleFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, feedback } : m)))
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  const isBusinessOpen = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const openHour = Number.parseInt(businessHours.open.split(":")[0])
    const closeHour = Number.parseInt(businessHours.close.split(":")[0])
    return currentHour >= openHour && currentHour < closeHour
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)

        const voiceMessage: Message = {
          id: Date.now().toString(),
          text: "Sent a voice message",
          sender: "user",
          timestamp: new Date(),
          file: {
            name: "voice-message.webm",
            type: "audio/webm",
            url: audioUrl,
          },
        }

        setMessages((prev) => [...prev, voiceMessage])

        stream.getTracks().forEach((track) => track.stop())

        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "Thank you for your voice message! I've received it and will respond shortly.",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        }, 1000)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("[v0] Error accessing microphone:", error)
      alert("Unable to access microphone. Please check your permissions.")
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      handleStopRecording()
    } else {
      handleStartRecording()
    }
  }

  return (
    <>
      <style>{`
        .chat-widget-button {
          background-color: ${brandColor} !important;
        }
        .chat-widget-button:hover {
          background-color: ${brandColor} !important;
          filter: brightness(1.1);
        }
        .chat-widget-header {
          background-color: ${brandColor} !important;
        }
      `}</style>

      <div className={cn("fixed z-50", position === "bottom-right" ? "bottom-6 right-6" : "bottom-6 left-6")}>
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="chat-widget-button h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}

        {isOpen && (
          <div className="flex flex-col bg-card rounded-2xl shadow-2xl w-[380px] h-[600px] animate-in slide-in-from-bottom-4 duration-300">
            <div className="chat-widget-header flex items-center justify-between p-4 text-primary-foreground rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  {brandLogo ? (
                    <img
                      src={brandLogo || "/placeholder.svg"}
                      alt={brandName}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <MessageSquare className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-balance">{brandName}</h3>
                  <p className="text-xs opacity-90">
                    {isHumanAgent ? t.humanAgent : isBusinessOpen() ? t.online : t.offline}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="hover:bg-primary-foreground/20 text-primary-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-primary-foreground/20 text-primary-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="p-4 border-b bg-card">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="language" className="text-sm font-medium">
                      Language
                    </Label>
                  </div>
                  <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {!isBusinessOpen() && messages.length === 1 && (
                <div className="bg-card rounded-xl p-4 border shadow-sm text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-semibold mb-1">{t.offlineTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.offlineMessage} {businessHours.open}
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id}>
                  <div className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        message.sender === "user"
                          ? "bg-[var(--chat-bubble-user)] text-[var(--chat-text-user)] rounded-br-md"
                          : "bg-[var(--chat-bubble-bot)] text-[var(--chat-text-bot)] rounded-bl-md",
                      )}
                    >
                      {message.text}
                      {message.file && (
                        <div className="mt-2 p-2 bg-background/50 rounded-lg">
                          {message.file.type.startsWith("image/") ? (
                            <div className="space-y-1">
                              <img
                                src={message.file.url || "/placeholder.svg"}
                                alt={message.file.name}
                                className="max-w-full h-auto rounded"
                              />
                              <div className="flex items-center gap-1 text-xs opacity-75">
                                <ImageIcon className="h-3 w-3" />
                                <span>{message.file.name}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-xs">{message.file.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {enableFeedback && message.sender === "bot" && message.id !== "1" && (
                    <div className="flex gap-1 mt-1 ml-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6",
                          message.feedback === "positive" && "text-green-600 dark:text-green-400",
                        )}
                        onClick={() => handleFeedback(message.id, "positive")}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-6 w-6", message.feedback === "negative" && "text-red-600 dark:text-red-400")}
                        onClick={() => handleFeedback(message.id, "negative")}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[var(--chat-bubble-bot)] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {(quickReplies || t.quickReplies).map((reply) => (
                <Button
                  key={reply}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply)}
                  className="rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {reply}
                </Button>
              ))}

              {showInfoForm && (
                <div className="bg-card rounded-xl p-4 border shadow-sm">
                  <h4 className="font-semibold mb-3 text-sm">{t.getToKnow}</h4>
                  <form onSubmit={handleSubmitInfo} className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t.yourName}
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={t.yourEmail}
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="pl-9"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder={t.yourPhone}
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                    <Button type="submit" className="w-full" size="sm">
                      {t.submit}
                    </Button>
                  </form>
                </div>
              )}

              {showBookingForm && (
                <div className="bg-card rounded-xl p-4 border shadow-sm">
                  <h4 className="font-semibold mb-3 text-sm">{t.bookTable}</h4>
                  <form onSubmit={handleSubmitBooking} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="date" className="text-xs">
                        {t.date}
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          value={bookingInfo.date}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, date: e.target.value })}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="time" className="text-xs">
                        {t.time}
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="time"
                          type="time"
                          value={bookingInfo.time}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, time: e.target.value })}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="guests" className="text-xs">
                        {t.guests}
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max="20"
                          value={bookingInfo.guests}
                          onChange={(e) => setBookingInfo({ ...bookingInfo, guests: e.target.value })}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="notes" className="text-xs">
                        {t.specialRequests}
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any dietary restrictions or special occasions?"
                        value={bookingInfo.notes}
                        onChange={(e) => setBookingInfo({ ...bookingInfo, notes: e.target.value })}
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setShowBookingForm(false)}
                      >
                        {t.cancel}
                      </Button>
                      <Button type="submit" className="flex-1">
                        {t.bookNow}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-card rounded-b-2xl">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceButtonClick}
                  className={cn(
                    "rounded-full shrink-0",
                    isRecording && "bg-red-500 hover:bg-red-600 text-white animate-pulse",
                  )}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full shrink-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder={t.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(inputValue)
                    }
                  }}
                  className="flex-1 rounded-full"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  size="icon"
                  className="rounded-full shrink-0"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Button variant="ghost" size="sm" onClick={() => setShowInfoForm(!showInfoForm)} className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  {t.shareInfo}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCall} className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  {t.callUs}
                </Button>
                {enableEscalation && !isHumanAgent && (
                  <Button variant="ghost" size="sm" onClick={handleEscalateToHuman} className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {t.talkToHuman}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
