"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, X, Settings, MessageSquare, Phone, Calendar, Paperclip, Mic, Globe } from "lucide-react"

// This is the standalone version that can be embedded in any website
export function StandaloneChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<
    Array<{
      text: string
      isUser: boolean
      timestamp: Date
      file?: { name: string; url: string; type: string }
      isVoice?: boolean
    }>
  >([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", phone: "" })
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load config from window object (set by embedding website)
  const config = typeof window !== "undefined" ? (window as any).chatWidgetConfig || {} : {}

  const brandName = config.brandName || "Support"
  const brandColor = config.brandColor || "#8b5cf6"
  const brandLogo = config.brandLogo || null
  const welcomeMessage = config.welcomeMessage || "Hi! How can we help you today?"
  const position = config.position || "bottom-right"
  const businessPhone = config.businessPhone || ""
  const [language, setLanguage] = useState(config.language || "en")
  const quickReplies = config.quickReplies || ["I have a question", "I need support"]
  const enableBooking = config.enableBooking !== false
  const enableEscalation = config.enableEscalation !== false
  const enableOfflineMode = config.enableOfflineMode !== false
  const businessHours = config.businessHours || {}

  const translations = {
    en: {
      typeMessage: "Type a message...",
      send: "Send",
      settings: "Settings",
      close: "Close",
      name: "Name",
      email: "Email",
      phone: "Phone",
      submit: "Submit",
      bookReservation: "Book a Reservation",
      talkToHuman: "Talk to a Human",
      call: "Call Us",
      selectDate: "Select Date",
      selectTime: "Select Time",
      guests: "Number of Guests",
      bookNow: "Book Now",
      offline: "We are currently offline",
      businessHours: "Business Hours",
      language: "Language",
    },
    es: {
      typeMessage: "Escribe un mensaje...",
      send: "Enviar",
      settings: "Configuración",
      close: "Cerrar",
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      submit: "Enviar",
      bookReservation: "Reservar",
      talkToHuman: "Hablar con un Humano",
      call: "Llamar",
      selectDate: "Seleccionar Fecha",
      selectTime: "Seleccionar Hora",
      guests: "Número de Invitados",
      bookNow: "Reservar Ahora",
      offline: "Estamos fuera de línea",
      businessHours: "Horario",
      language: "Idioma",
    },
    fr: {
      typeMessage: "Tapez un message...",
      send: "Envoyer",
      settings: "Paramètres",
      close: "Fermer",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      submit: "Soumettre",
      bookReservation: "Réserver",
      talkToHuman: "Parler à un Humain",
      call: "Appeler",
      selectDate: "Sélectionner la Date",
      selectTime: "Sélectionner l'Heure",
      guests: "Nombre d'Invités",
      bookNow: "Réserver Maintenant",
      offline: "Nous sommes hors ligne",
      businessHours: "Heures d'Ouverture",
      language: "Langue",
    },
    de: {
      typeMessage: "Nachricht eingeben...",
      send: "Senden",
      settings: "Einstellungen",
      close: "Schließen",
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      submit: "Absenden",
      bookReservation: "Reservierung",
      talkToHuman: "Mit einem Menschen sprechen",
      call: "Anrufen",
      selectDate: "Datum auswählen",
      selectTime: "Zeit auswählen",
      guests: "Anzahl der Gäste",
      bookNow: "Jetzt buchen",
      offline: "Wir sind offline",
      businessHours: "Öffnungszeiten",
      language: "Sprache",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ text: welcomeMessage, isUser: false, timestamp: new Date() }])
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedFile) return

    const userMessage = inputValue.trim()
    const file = selectedFile

    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setMessages((prev) => [
        ...prev,
        {
          text: userMessage || `Sent ${file.name}`,
          isUser: true,
          timestamp: new Date(),
          file: { name: file.name, url: fileUrl, type: file.type },
        },
      ])
      setSelectedFile(null)
    } else {
      setMessages((prev) => [...prev, { text: userMessage, isUser: true, timestamp: new Date() }])
    }

    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { text: userMessage, isUser: true }].map((m) => ({
            role: m.isUser ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          aiResponse += decoder.decode(value)
        }
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false, timestamp: new Date() }])
    } catch (error) {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I encountered an error. Please try again.", isUser: false, timestamp: new Date() },
      ])
    }
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    setTimeout(() => handleSend(), 100)
  }

  const handleCustomerInfoSubmit = () => {
    if (customerInfo.name && customerInfo.email) {
      setHasProvidedInfo(true)
      setMessages((prev) => [
        ...prev,
        {
          text: `Thank you, ${customerInfo.name}! How can we assist you?`,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      setTimeout(() => {
        setIsRecording(false)
        setMessages((prev) => [
          ...prev,
          {
            text: "Voice message",
            isUser: true,
            timestamp: new Date(),
            isVoice: true,
          },
        ])
      }, 2000)
    }
  }

  const handleCall = () => {
    if (businessPhone) {
      window.location.href = `tel:${businessPhone}`
    }
  }

  const handleBooking = () => {
    setShowBooking(true)
  }

  const handleEscalation = () => {
    setMessages((prev) => [
      ...prev,
      {
        text: "Connecting you to a human agent...",
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }

  const positionClasses = position === "bottom-left" ? "left-4" : "right-4"

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 ${positionClasses} z-50 rounded-full p-4 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300`}
          style={{ backgroundColor: brandColor }}
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 ${positionClasses} z-50 flex h-[600px] w-[380px] flex-col rounded-2xl bg-white shadow-2xl`}
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between rounded-t-2xl p-4 text-white"
            style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-center gap-3">
              {brandLogo && (
                <img
                  src={brandLogo || "/placeholder.svg"}
                  alt={brandName}
                  className="h-8 w-8 rounded-full bg-white object-cover p-1"
                />
              )}
              <div>
                <h3 className="font-semibold">{brandName}</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-full p-2 transition-colors hover:bg-white/20"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Settings Sidebar */}
          {showSettings && (
            <div className="absolute right-0 top-14 z-10 w-64 rounded-lg bg-white p-4 shadow-xl border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-900">{t.settings}</h4>

              {/* Language Selector */}
              <div className="mb-3">
                <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {t.language}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!hasProvidedInfo ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Please provide your information to continue:</p>
                <input
                  type="text"
                  placeholder={t.name}
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder={t.email}
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder={t.phone}
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleCustomerInfoSubmit}
                  className="w-full rounded-lg p-2 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: brandColor }}
                >
                  {t.submit}
                </button>
              </div>
            ) : showBooking ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">{t.bookReservation}</h4>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder={t.guests}
                  min="1"
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setShowBooking(false)
                    setMessages((prev) => [
                      ...prev,
                      {
                        text: "Your reservation has been submitted! We will confirm shortly.",
                        isUser: false,
                        timestamp: new Date(),
                      },
                    ])
                  }}
                  className="w-full rounded-lg p-2 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: brandColor }}
                >
                  {t.bookNow}
                </button>
                <button
                  onClick={() => setShowBooking(false)}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.isUser ? "text-white" : "bg-gray-100 text-gray-900"
                      }`}
                      style={message.isUser ? { backgroundColor: brandColor } : {}}
                    >
                      {message.file && (
                        <div className="mb-2">
                          {message.file.type.startsWith("image/") ? (
                            <img
                              src={message.file.url || "/placeholder.svg"}
                              alt={message.file.name}
                              className="rounded-lg max-w-full"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-sm">
                              <Paperclip className="h-4 w-4" />
                              <span>{message.file.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {message.isVoice && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mic className="h-4 w-4" />
                          <span>Voice message</span>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <p className={`mt-1 text-xs ${message.isUser ? "text-white/70" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-gray-100 px-4 py-3">
                      <div className="flex gap-1">
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Action Buttons */}
          {hasProvidedInfo && !showBooking && (
            <div className="flex gap-2 border-t border-gray-200 p-3">
              {enableBooking && (
                <button
                  onClick={handleBooking}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4" />
                  {t.bookReservation}
                </button>
              )}
              {enableEscalation && (
                <button
                  onClick={handleEscalation}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {t.talkToHuman}
                </button>
              )}
              {businessPhone && (
                <button
                  onClick={handleCall}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Phone className="h-4 w-4" />
                  {t.call}
                </button>
              )}
            </div>
          )}

          {/* Input Area */}
          {hasProvidedInfo && !showBooking && (
            <div className="border-t border-gray-200 p-4">
              {selectedFile && (
                <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-100 p-2 text-sm">
                  <Paperclip className="h-4 w-4" />
                  <span className="flex-1 truncate">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  onClick={handleVoiceRecord}
                  className={`rounded-lg border p-2 transition-colors ${
                    isRecording
                      ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                  aria-label="Voice message"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={t.typeMessage}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="rounded-lg p-2 text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: brandColor }}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
