import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { message, context } = await req.json()

  const result = streamText({
    model: "openai/gpt-5-mini",
    prompt: `You are a helpful customer support assistant for a business. 
    
Context: ${context || "General customer support"}

Customer message: ${message}

Provide a friendly, helpful response. Keep it concise and professional.`,
    maxOutputTokens: 500,
    temperature: 0.7,
    abortSignal: req.signal,
  })

  const stream = result.textStream

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
