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

const REACT_TOOL: Anthropic.Tool = {
  name: "react_to_post",
  description:
    "Record your reaction to this LinkedIn post. Set reaction to 'ignore' if you'd scroll past, or 'engage' if you'd stop. When engaging, set like/comment/share_note for any combination of actions.",
  input_schema: {
    type: "object" as const,
    properties: {
      reaction: {
        type: "string",
        enum: ["ignore", "engage"],
        description:
          "'ignore' = scrolled past. 'engage' = you stopped and interacted.",
      },
      gut_reaction: {
        type: "string",
        description: "One sentence — what went through your head.",
      },
      like: {
        type: "boolean",
        description:
          "Whether you tapped like. Only relevant when reaction is 'engage'.",
      },
      comment: {
        type: "string",
        description:
          "The actual comment you'd leave. Only if you'd comment. Omit otherwise.",
      },
      share_note: {
        type: "string",
        description:
          "What you'd write when reposting. Only if you'd share. Omit otherwise.",
      },
    },
    required: ["reaction", "gut_reaction"],
  },
}

const SYSTEM_SUFFIX = `

You are scrolling LinkedIn on your phone. You see a post from someone you follow. React naturally using the react_to_post tool. Be true to your actual social media habits and engagement patterns.

Two options:
- **ignore**: You scrolled past. Most posts get this. Be honest about your threshold.
- **engage**: You stopped. Set like to true/false, optionally write a comment, optionally add a share_note if you'd repost it. You can do any combination — like only, like + comment, comment + share, all three, etc.`

export async function POST(req: NextRequest) {
  const { persona, post_content } = await req.json()

  const baseSystem = loadPersonaSystemPrompt(persona)
  const systemPrompt = baseSystem + SYSTEM_SUFFIX

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system: systemPrompt,
    tools: [REACT_TOOL],
    tool_choice: { type: "tool", name: "react_to_post" },
    messages: [
      {
        role: "user",
        content: `Here's the LinkedIn post:\n\n---\n\n${post_content}\n\n---`,
      },
    ],
  })

  const toolUse = response.content.find((b) => b.type === "tool_use")
  if (!toolUse || toolUse.type !== "tool_use") {
    return NextResponse.json({
      reaction: "ignore",
      gut_reaction: "(no reaction captured)",
    })
  }

  const input = toolUse.input as Record<string, unknown>
  return NextResponse.json(input)
}
