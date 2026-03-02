import Anthropic from "@anthropic-ai/sdk"
import { readFileSync } from "fs"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function loadPersonaSystemPrompt(personaSlug: string): string {
  const personasDir = join(process.cwd(), "personas")
  const backstory = readFileSync(
    join(personasDir, `${personaSlug}.md`),
    "utf-8"
  )
  const responseStyle = readFileSync(
    join(personasDir, "_response-style.md"),
    "utf-8"
  )
  return `${backstory}\n\n${responseStyle}`
}

export async function POST(req: NextRequest) {
  const { persona, messages } = await req.json()

  const systemPrompt = loadPersonaSystemPrompt(persona)

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  return NextResponse.json({ response: response.content[0] })
}
