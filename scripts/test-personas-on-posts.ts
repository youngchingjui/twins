/**
 * Persona validation test v3: Single-tool discriminated union
 *
 * Level 1: Quick stats — single tool call: ignore or engage (like/comment/share combo)
 * Level 2: Aggregate summary
 * Level 3: Individual deep dives
 *
 * Usage: bun run scripts/test-personas-on-posts.ts
 */

import Anthropic from "@anthropic-ai/sdk"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

// Load env
const envPath = join(import.meta.dir, "../.env.local")
const envContent = readFileSync(envPath, "utf-8")
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    let val = match[2].trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    process.env[match[1].trim()] = val
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PERSONAS = [
  { slug: "sophie-chen", name: "Sophie Chen", desc: "28, pharmacist, San Diego" },
  { slug: "marcus-hayes", name: "Marcus Hayes", desc: "38, startup founder, Brooklyn" },
  { slug: "priya-sharma", name: "Priya Sharma", desc: "44, VP Marketing, Chicago" },
  { slug: "derek-morrison", name: "Derek Morrison", desc: "51, IT director, Minneapolis" },
  { slug: "jess-park", name: "Jess Park", desc: "31, content strategist, Austin" },
]

function loadPersonaSystemPrompt(personaSlug: string): string {
  const personasDir = join(import.meta.dir, "../personas")
  const backstory = readFileSync(join(personasDir, `${personaSlug}.md`), "utf-8")
  const responseStyle = readFileSync(join(personasDir, "_response-style.md"), "utf-8")
  return `${backstory}\n\n${responseStyle}`
}

// ── Single tool with discriminated union ─────────────────────────────

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
        description: "'ignore' = scrolled past. 'engage' = you stopped and interacted.",
      },
      gut_reaction: {
        type: "string",
        description: "One sentence — what went through your head.",
      },
      like: {
        type: "boolean",
        description: "Whether you tapped like. Only relevant when reaction is 'engage'.",
      },
      comment: {
        type: "string",
        description: "The actual comment you'd leave. Only if you'd comment. Omit otherwise.",
      },
      share_note: {
        type: "string",
        description: "What you'd write when reposting. Only if you'd share. Omit otherwise.",
      },
    },
    required: ["reaction", "gut_reaction"],
  },
}

const SYSTEM_SUFFIX = `

You are scrolling LinkedIn on your phone. You see a post from someone you follow. React naturally using the react_to_post tool. Be true to your actual social media habits and engagement patterns.

Two options:
- **ignore**: You scrolled past. Most posts get this. Be honest about your threshold.
- **engage**: You stopped. Set like to true/false, optionally write a comment, optionally add a share_note if you'd repost it. You can do any combination.`

// ── Types ────────────────────────────────────────────────────────────

type Reaction = {
  persona: string
  desc: string
  reaction: "ignore" | "engage"
  like: boolean
  comment?: string
  share_note?: string
  gut_reaction: string
}

// ── Level 1 ──────────────────────────────────────────────────────────

async function getQuickReaction(
  personaSlug: string,
  postContent: string
): Promise<Reaction> {
  const persona = PERSONAS.find((p) => p.slug === personaSlug)!
  const baseSystem = loadPersonaSystemPrompt(personaSlug)
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
        content: `Here's the LinkedIn post:\n\n---\n\n${postContent}\n\n---`,
      },
    ],
  })

  const toolUse = response.content.find((b) => b.type === "tool_use")
  if (!toolUse || toolUse.type !== "tool_use") {
    return {
      persona: persona.name,
      desc: persona.desc,
      reaction: "ignore",
      like: false,
      gut_reaction: "(no reaction captured)",
    }
  }

  const input = toolUse.input as Record<string, unknown>
  return {
    persona: persona.name,
    desc: persona.desc,
    reaction: (input.reaction as string) === "engage" ? "engage" : "ignore",
    like: !!input.like,
    comment: input.comment as string | undefined,
    share_note: input.share_note as string | undefined,
    gut_reaction: (input.gut_reaction as string) || "",
  }
}

// ── Level 2 ──────────────────────────────────────────────────────────

async function generateSummary(
  postTitle: string,
  reactions: Reaction[]
): Promise<string> {
  const lines = reactions.map((r) => {
    if (r.reaction === "ignore") {
      return `- **${r.persona}** (${r.desc}): IGNORED — "${r.gut_reaction}"`
    }
    const actions = []
    if (r.like) actions.push("liked")
    if (r.comment) actions.push("commented")
    if (r.share_note) actions.push("shared")
    let line = `- **${r.persona}** (${r.desc}): ${actions.join(" + ").toUpperCase()} — "${r.gut_reaction}"`
    if (r.comment) line += `\n  Comment: "${r.comment}"`
    if (r.share_note) line += `\n  Share note: "${r.share_note}"`
    return line
  })

  const ignored = reactions.filter((r) => r.reaction === "ignore").length
  const liked = reactions.filter((r) => r.like).length
  const commented = reactions.filter((r) => r.comment).length
  const shared = reactions.filter((r) => r.share_note).length

  const prompt = `A LinkedIn post titled "${postTitle}" was shown to ${reactions.length} people.

Stats: ${ignored} ignored, ${liked} liked, ${commented} commented, ${shared} shared (can overlap).

${lines.join("\n")}

Based on these reactions:
1. One-sentence verdict on this post
2. Pattern in who engaged vs who didn't
3. Single most actionable change

Direct prose. Under 100 words.`

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  })

  return response.content[0].type === "text" ? response.content[0].text : ""
}

// ── Level 3 ──────────────────────────────────────────────────────────

async function getDetailedFeedback(
  personaSlug: string,
  postContent: string
): Promise<string> {
  const systemPrompt = loadPersonaSystemPrompt(personaSlug)

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Someone you follow on LinkedIn just posted this. Give your honest, detailed reaction — what worked, what didn't, what you'd change.\n\n---\n\n${postContent}\n\n---`,
      },
    ],
  })

  return response.content[0].type === "text" ? response.content[0].text : ""
}

// ── Display ──────────────────────────────────────────────────────────

function displayReaction(r: Reaction) {
  if (r.reaction === "ignore") {
    console.log(`  🫥 ${r.persona} (${r.desc}) — IGNORED`)
  } else {
    const actions = []
    if (r.like) actions.push("👍")
    if (r.comment) actions.push("💬")
    if (r.share_note) actions.push("🔄")
    console.log(`  ${actions.join("")} ${r.persona} (${r.desc})`)
  }
  console.log(`     "${r.gut_reaction}"`)
  if (r.comment) console.log(`     💬 Comment: "${r.comment}"`)
  if (r.share_note) console.log(`     🔄 Note: "${r.share_note}"`)
  console.log()
}

// ── Posts ─────────────────────────────────────────────────────────────

const POST_1 = {
  title: "AI is the New Excel",
  content: `When Excel first came out, the people who learned it were considered wizards.

Type an equal sign, write a formula, and suddenly you could do in seconds what used to take hours of manual bookkeeping. It seemed like magic. And to most people watching, it was.

I've been getting that same feeling lately with AI agents.

Not the ChatGPT-write-me-an-email kind. More like — I needed to automate a tedious weekly workflow involving a Chinese event platform, image generation, QR codes, and file management. So I sat down with Claude Code and just... walked through it together. Throwaway scripts, quick automations, small apps that solve one specific problem. Things I'd never bother building properly, but that save me hours.

It reminds me of early Excel adopters. They weren't doing anything technically profound — just multiplying cells and summing columns. But they were 10x faster than everyone around them.

That's where we seem to be now. The people who learn to work alongside these tools aren't writing better code. They're getting more done. Quietly, without fanfare.

Excel wiped out certain types of bookkeeping jobs. But it created far more — financial analysts, data modelers, entire industries built on spreadsheets. The tool didn't shrink opportunity. It reshaped it.

I think the same thing is happening now, just faster. The question isn't whether AI agents will change how we work. It's whether you'll be the person in the room who already knows how to use them.

Curious what your "Excel moment" has been with AI — that first time something clicked and felt like a genuine productivity shift.`,
}

const POST_2 = {
  title: "Digital Customer Twins",
  content: `Built a quick experiment with v0.app: digital customer twins.

The idea is to create AI representations of your customers that you can interview, test ideas with, or run through scenarios. Instead of guessing what users might do, you ask their digital twin.

What's interesting is how v0 handles the full stack — I described what I wanted, and it generated the TypeScript app, deployed to Vercel, and set up automatic syncing. The whole prototype took maybe an hour.

Not sure yet if talking to AI versions of customers is actually useful or just feels useful. But the speed of going from idea to deployed app seems notable.

Curious if anyone's tried something similar with customer research or user testing.`,
}

// ── Main ─────────────────────────────────────────────────────────────

async function testPost(post: { title: string; content: string }) {
  console.log(`\n${"━".repeat(60)}`)
  console.log(`  "${post.title}"`)
  console.log(`${"━".repeat(60)}`)

  // Level 1
  console.log(`\n  ⏳ Getting quick reactions...`)
  const reactions = await Promise.all(
    PERSONAS.map((p) => getQuickReaction(p.slug, post.content))
  )

  const ignored = reactions.filter((r) => r.reaction === "ignore").length
  const liked = reactions.filter((r) => r.like).length
  const commented = reactions.filter((r) => r.comment).length
  const shared = reactions.filter((r) => r.share_note).length
  const engaged = reactions.length - ignored

  console.log()
  console.log(`  🫥 ${ignored} ignored  👍 ${liked} liked  💬 ${commented} commented  🔄 ${shared} shared`)
  console.log(`  Engaged: ${engaged}/${reactions.length}`)
  console.log()

  for (const r of reactions) displayReaction(r)

  // Level 2
  console.log(`  ⏳ Generating summary...`)
  const summary = await generateSummary(post.title, reactions)
  console.log(`\n  📊 SUMMARY`)
  console.log(`  ${"-".repeat(40)}`)
  for (const line of summary.split("\n")) console.log(`  ${line}`)

  // Level 3
  console.log(`\n  ⏳ Getting detailed feedback...`)
  const detailed = await Promise.all(
    PERSONAS.map(async (p) => ({
      name: p.name,
      desc: p.desc,
      text: await getDetailedFeedback(p.slug, post.content),
    }))
  )

  console.log(`\n  🔍 INDIVIDUAL DEEP DIVES`)
  console.log(`  ${"-".repeat(40)}`)
  for (const d of detailed) {
    console.log(`\n  ── ${d.name} (${d.desc}) ──`)
    for (const line of d.text.split("\n")) console.log(`  ${line}`)
  }
  console.log()

  return { post: post.title, reactions, summary, detailed }
}

async function main() {
  console.log("🧪 Refolk Persona Test v3 — Discriminated Union")
  console.log(`   ${PERSONAS.length} personas × 2 posts`)
  console.log(`   Single tool: ignore | engage {like, comment, share}`)

  const results = []
  results.push(await testPost(POST_1))
  results.push(await testPost(POST_2))

  // Save results
  let output = `# Persona Test v3 — Discriminated Union\n\nDate: ${new Date().toISOString()}\n\n`

  for (const r of results) {
    const ignored = r.reactions.filter((x) => x.reaction === "ignore").length
    const liked = r.reactions.filter((x) => x.like).length
    const commented = r.reactions.filter((x) => x.comment).length
    const shared = r.reactions.filter((x) => x.share_note).length

    output += `# Post: "${r.post}"\n\n`
    output += `## Level 1: Quick Stats\n\n`
    output += `| Ignored | Liked | Commented | Shared | Engaged |\n`
    output += `|---------|-------|-----------|--------|---------|\n`
    output += `| ${ignored} | ${liked} | ${commented} | ${shared} | ${r.reactions.length - ignored}/${r.reactions.length} |\n\n`

    for (const rx of r.reactions) {
      if (rx.reaction === "ignore") {
        output += `- **${rx.persona}** → IGNORED: "${rx.gut_reaction}"\n`
      } else {
        const acts = []
        if (rx.like) acts.push("liked")
        if (rx.comment) acts.push("commented")
        if (rx.share_note) acts.push("shared")
        output += `- **${rx.persona}** → ${acts.join(" + ").toUpperCase()}: "${rx.gut_reaction}"`
        if (rx.comment) output += `\n  - Comment: "${rx.comment}"`
        if (rx.share_note) output += `\n  - Share note: "${rx.share_note}"`
        output += `\n`
      }
    }

    output += `\n## Level 2: Summary\n\n${r.summary}\n\n`
    output += `## Level 3: Deep Dives\n\n`
    for (const d of r.detailed) {
      output += `### ${d.name} (${d.desc})\n\n${d.text}\n\n`
    }
    output += `---\n\n`
  }

  const outputPath = join(import.meta.dir, "persona-test-results-v3.md")
  writeFileSync(outputPath, output)
  console.log(`\n📄 Results saved to scripts/persona-test-results-v3.md`)
}

main().catch(console.error)
