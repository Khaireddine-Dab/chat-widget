# Chat Widget Embed Instructions

## Quick Start

To embed the chat widget on any website, follow these steps:

### Option 1: Simple Embed (Recommended)

Add this code before the closing `</body>` tag of your website:

\`\`\`html
<!-- Chat Widget -->
<div id="chat-widget-root"></div>
<script>
  window.chatWidgetConfig = {
    brandName: "Your Business",
    brandColor: "#8b5cf6",
    brandLogo: "/logo.png",
    welcomeMessage: "Hi! How can we help you today?",
    position: "bottom-right",
    businessPhone: "+1234567890",
    language: "en",
    quickReplies: [
      "I have a question",
      "I need support",
      "Book a reservation"
    ],
    enableBooking: true,
    enableEscalation: true,
    enableOfflineMode: true,
    businessHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    }
  };
</script>
<script src="https://your-domain.com/chat-widget.js"></script>
\`\`\`

### Option 2: React Component

If you're using React/Next.js, you can import the component directly:

\`\`\`tsx
import { StandaloneChatWidget } from '@/components/standalone-chat-widget'

export default function YourPage() {
  return (
    <div>
      {/* Your page content */}
      <StandaloneChatWidget />
    </div>
  )
}
\`\`\`

## Configuration Options

### Required Settings

- **brandName**: Your business name (string)
- **brandColor**: Primary color in hex format (string, e.g., "#8b5cf6")

### Optional Settings

- **brandLogo**: URL to your logo image (string)
- **welcomeMessage**: First message users see (string)
- **position**: Widget position - "bottom-right" or "bottom-left" (string)
- **businessPhone**: Phone number for call feature (string)
- **language**: Default language - "en", "es", "fr", or "de" (string)
- **quickReplies**: Array of quick reply button texts (string[])
- **enableBooking**: Enable reservation form (boolean)
- **enableEscalation**: Enable human agent escalation (boolean)
- **enableOfflineMode**: Show offline message (boolean)
- **businessHours**: Object with hours for each day (object)

## Features

✅ AI-powered responses with streaming
✅ File upload (images, documents)
✅ Voice message recording
✅ Multi-language support (EN, ES, FR, DE)
✅ Customer info capture
✅ Booking/reservation form
✅ Human agent escalation
✅ Click-to-call functionality
✅ Offline mode with business hours
✅ Message feedback (thumbs up/down)
✅ Fully customizable branding
✅ Mobile responsive
✅ Dark mode support

## API Endpoint

The widget requires an API endpoint at `/api/chat` that accepts POST requests with the following format:

\`\`\`json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
\`\`\`

The endpoint should return a streaming response with AI-generated text.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Need Help?

Visit `/settings` to customize your widget through a visual interface, or contact support for assistance.
