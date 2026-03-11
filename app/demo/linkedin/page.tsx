"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

// ── Data ─────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    slug: "sophie-chen",
    name: "Sophie Chen",
    headline: "Pharmacist · San Diego, CA",
  },
  {
    slug: "marcus-hayes",
    name: "Marcus Hayes",
    headline: "Founder & CEO · Brooklyn, NY",
  },
  {
    slug: "priya-sharma",
    name: "Priya Sharma",
    headline: "VP of Marketing · Chicago, IL",
  },
  {
    slug: "derek-morrison",
    name: "Derek Morrison",
    headline: "Director of IT · Minneapolis, MN",
  },
  {
    slug: "jess-park",
    name: "Jess Park",
    headline: "Content Strategist · Austin, TX",
  },
]

// ── Types ────────────────────────────────────────────────────────────

type Reaction = {
  slug: string
  reaction: "ignore" | "engage"
  like: boolean
  comment?: string
  share_note?: string
  gut_reaction: string
  loading: boolean
  done: boolean
}

type DetailedFeedback = {
  slug: string
  text: string
  loading: boolean
  done: boolean
}

// ── Small components ─────────────────────────────────────────────────

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  )
}

function ActionBadges({ r }: { r: Reaction }) {
  if (r.reaction === "ignore") {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        Scrolled past
      </span>
    )
  }
  const badges: { label: string; cls: string }[] = []
  if (r.like) badges.push({ label: "👍 Liked", cls: "bg-blue-50 text-blue-700" })
  if (r.comment) badges.push({ label: "💬 Commented", cls: "bg-emerald-50 text-emerald-700" })
  if (r.share_note) badges.push({ label: "🔄 Shared", cls: "bg-purple-50 text-purple-700" })
  if (badges.length === 0) badges.push({ label: "👀 Stopped", cls: "bg-muted text-muted-foreground" })
  return (
    <span className="flex gap-1.5 flex-wrap">
      {badges.map((b) => (
        <span key={b.label} className={`text-xs px-2 py-0.5 rounded-full ${b.cls}`}>
          {b.label}
        </span>
      ))}
    </span>
  )
}

const AUTHOR = {
  name: "Ching-Jui Young",
  headline: "Building Refolk — AI personas for real customer feedback",
  photo:
    "https://media.licdn.com/dms/image/v2/D5603AQHiGXQtjgjibA/profile-displayphoto-scale_400_400/B56Zvo8FriIUAg-/0/1769139627369?e=1775088000&v=beta&t=wviUQDJ0viAy-rJjY9rBmj2jEl02pTnoj4KPa7_63Xk",
}

/** LinkedIn-style post card with fade + "see more" for long content */
function LinkedInPostPreview({ content }: { content: string }) {
  const MAX_LINES = 8
  const lines = content.split("\n")
  const isTruncated = lines.length > MAX_LINES
  const visibleText = isTruncated ? lines.slice(0, MAX_LINES).join("\n") : content

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Author header */}
      <div className="p-4 pb-0">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AUTHOR.photo}
            alt={AUTHOR.name}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {AUTHOR.name}
            </p>
            <p className="text-xs text-gray-500">{AUTHOR.headline}</p>
            <p className="text-xs text-gray-400">Just now · 🌐</p>
          </div>
        </div>
      </div>
      {/* Post body — faded */}
      <div className="px-4 py-3 relative pb-10">
        <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
          {visibleText}
        </div>
        {isTruncated && (
          <>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            <p className="absolute bottom-3 left-4 text-sm font-medium text-gray-500">
              …see more
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────

export default function LinkedInDemoPage() {
  const [postContent, setPostContent] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const [reactions, setReactions] = useState<Reaction[]>([])
  const [reactionsLoading, setReactionsLoading] = useState(false)

  const [summary, setSummary] = useState("")
  const [summaryLoading, setSummaryLoading] = useState(false)

  const [detailed, setDetailed] = useState<DetailedFeedback[]>([])
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [monologueVisible, setMonologueVisible] = useState<Set<string>>(new Set())

  const postRef = useRef("")

  const handleSubmit = useCallback(async () => {
    const text = postContent.trim()
    if (!text) return

    postRef.current = text
    setSubmitted(true)
    setReactionsLoading(true)
    setSummary("")
    setSummaryLoading(false)
    setDetailed([])
    setExpandedSlug(null)
    setMonologueVisible(new Set())

    const initial: Reaction[] = PERSONAS.map((p) => ({
      slug: p.slug,
      reaction: "ignore",
      like: false,
      gut_reaction: "",
      loading: true,
      done: false,
    }))
    setReactions(initial)

    const results: Reaction[] = await Promise.all(
      PERSONAS.map(async (persona) => {
        try {
          const res = await fetch("/api/react", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ persona: persona.slug, post_content: text }),
          })
          const data = await res.json()
          return {
            slug: persona.slug,
            reaction: data.reaction || "ignore",
            like: data.like || false,
            comment: data.comment,
            share_note: data.share_note,
            gut_reaction: data.gut_reaction || "",
            loading: false,
            done: true,
          }
        } catch {
          return {
            slug: persona.slug,
            reaction: "ignore" as const,
            like: false,
            gut_reaction: "(error)",
            loading: false,
            done: true,
          }
        }
      })
    )

    setReactions(results)
    setReactionsLoading(false)

    // All accordions start collapsed — user expands as needed

    // Generate summary
    setSummaryLoading(true)
    try {
      const reactionData = results.map((r) => {
        const persona = PERSONAS.find((p) => p.slug === r.slug)!
        if (r.reaction === "ignore") {
          return `${persona.name} (${persona.headline}): IGNORED — "${r.gut_reaction}"`
        }
        const actions = []
        if (r.like) actions.push("liked")
        if (r.comment) actions.push("commented")
        if (r.share_note) actions.push("shared")
        let detail = `${persona.name} (${persona.headline}): ${actions.join(" + ").toUpperCase() || "ENGAGED"} — "${r.gut_reaction}"`
        if (r.comment) detail += ` Comment: "${r.comment}"`
        if (r.share_note) detail += ` Share note: "${r.share_note}"`
        return detail
      })

      const ignored = results.filter((r) => r.reaction === "ignore").length
      const liked = results.filter((r) => r.like).length
      const commented = results.filter((r) => r.comment).length
      const shared = results.filter((r) => r.share_note).length

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          responses: [
            {
              name: "Panel reactions",
              text: `Stats: ${ignored} ignored, ${liked} liked, ${commented} commented, ${shared} shared (out of ${results.length} personas).\n\nIndividual reactions:\n${reactionData.join("\n")}`,
            },
          ],
        }),
      })
      const data = await res.json()
      setSummary(data.summary || "")
    } catch {
      setSummary("(summary unavailable)")
    } finally {
      setSummaryLoading(false)
    }
  }, [postContent])

  // Separated so we can call it without toggle behavior for auto-expand
  const loadDetailedFor = useCallback(
    async (slug: string) => {
      setExpandedSlug(slug)
      setDetailed((prev) => [
        ...prev.filter((d) => d.slug !== slug),
        { slug, text: "", loading: true, done: false },
      ])

      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona: slug,
            messages: [
              {
                role: "user",
                content: `Someone you follow on LinkedIn just posted this. Give your honest, detailed reaction — what worked, what didn't, what you'd change. React like you're texting a friend about it.\n\n---\n\n${postRef.current}\n\n---`,
              },
            ],
          }),
        })

        if (!res.ok || !res.body) throw new Error("Stream failed")
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          const current = accumulated
          setDetailed((prev) =>
            prev.map((d) => (d.slug === slug ? { ...d, text: current } : d))
          )
        }
        setDetailed((prev) =>
          prev.map((d) =>
            d.slug === slug ? { ...d, loading: false, done: true } : d
          )
        )
      } catch {
        setDetailed((prev) =>
          prev.map((d) =>
            d.slug === slug
              ? { ...d, text: "(error loading feedback)", loading: false, done: true }
              : d
          )
        )
      }
    },
    []
  )

  const toggleDetailed = useCallback(
    (slug: string) => {
      setExpandedSlug(expandedSlug === slug ? null : slug)
    },
    [expandedSlug]
  )

  function handleReset() {
    setPostContent("")
    setSubmitted(false)
    setReactions([])
    setReactionsLoading(false)
    setSummary("")
    setSummaryLoading(false)
    setDetailed([])
    setExpandedSlug(null)
    setMonologueVisible(new Set())
  }

  const doneReactions = reactions.filter((r) => r.done)
  const stats = {
    ignored: doneReactions.filter((r) => r.reaction === "ignore").length,
    liked: doneReactions.filter((r) => r.like).length,
    commented: doneReactions.filter((r) => !!r.comment).length,
    shared: doneReactions.filter((r) => !!r.share_note).length,
  }
  const engaged = doneReactions.filter((r) => r.reaction === "engage").length
  const allDone = reactions.length > 0 && reactions.every((r) => r.done)

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-medium text-lg tracking-tight text-foreground"
            >
              refolk
            </Link>
            <span className="text-border">/</span>
            <Link
              href="/demo"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              demos
            </Link>
            <span className="text-border">/</span>
            <span className="text-sm text-foreground">LinkedIn</span>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {!submitted ? (
          /* ── Input screen ── */
          <div className="py-16 md:py-24 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground text-balance">
              Test your LinkedIn post before you publish
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Paste a draft. Five LinkedIn personas will scroll past it and
              decide whether to engage — like, comment, share, or keep scrolling.
            </p>

            <div className="mt-10">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Paste your LinkedIn post here..."
                rows={8}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground resize-none outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground">⌘ + Enter to submit</p>
                <button
                  onClick={handleSubmit}
                  disabled={!postContent.trim()}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  Test with 5 personas →
                </button>
              </div>
            </div>

            {/* Persona preview */}
            <div className="mt-12">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Your focus group
              </p>
              <div className="space-y-3">
                {PERSONAS.map((p) => (
                  <div key={p.slug} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-foreground">
                        {p.name[0]}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                        <LinkedInIcon className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.headline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Results screen ── */
          <div className="py-10 md:py-16">
            {/* Title */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                Simulated LinkedIn Audience reactions
              </h1>
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Test another post
              </button>
            </div>

            {/* Two-column: Post + Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Left: LinkedIn post preview */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Your draft
                </p>
                <LinkedInPostPreview content={postContent} />

              </div>

              {/* Right: Engagement stats */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Engagement
                </p>

                {reactionsLoading && !allDone ? (
                  <div className="flex items-center gap-3 p-6 border border-border rounded-lg bg-card">
                    <TypingDots />
                    <span className="text-sm text-muted-foreground">
                      Personas are scrolling through your post...
                    </span>
                  </div>
                ) : null}

                {allDone && (
                  <div className="border-2 border-primary/20 rounded-lg bg-card p-6 shadow-sm">
                    {/* Big number */}
                    <div className="mb-6 text-center">
                      <p className="text-5xl font-bold text-foreground tracking-tight">
                        {engaged}
                        <span className="text-2xl font-normal text-muted-foreground">
                          /{reactions.length}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        personas engaged with your post
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {(
                        [
                          ["Ignored", stats.ignored, "text-muted-foreground", "bg-muted"],
                          ["Liked", stats.liked, "text-blue-600", "bg-blue-50"],
                          ["Commented", stats.commented, "text-emerald-600", "bg-emerald-50"],
                          ["Shared", stats.shared, "text-purple-600", "bg-purple-50"],
                        ] as const
                      ).map(([label, count, color, bg]) => (
                        <div key={label} className={`${bg} rounded-lg py-3 px-2`}>
                          <p className={`text-2xl font-bold ${color}`}>{count}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    {(summaryLoading || summary) && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Reaction summary
                        </p>
                        {summaryLoading ? (
                          <div className="flex items-center gap-2">
                            <TypingDots />
                            <span className="text-sm text-muted-foreground">
                              Synthesizing reactions...
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-foreground leading-relaxed">
                            {summary}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Individual feedback accordion */}
                    <div className="mt-6 pt-6 border-t border-border -mx-6 -mb-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-6">
                        Individual feedback
                      </p>
                      <div className="divide-y divide-border">
                        {[...reactions].sort((a, b) => {
                          if (a.reaction === "engage" && b.reaction !== "engage") return -1
                          if (a.reaction !== "engage" && b.reaction === "engage") return 1
                          return 0
                        }).map((r) => {
                          const persona = PERSONAS.find((p) => p.slug === r.slug)!
                          const isExpanded = expandedSlug === r.slug
                          const detailedData = detailed.find((d) => d.slug === r.slug)

                          const showMonologue = monologueVisible.has(r.slug)

                          return (
                            <div key={r.slug}>
                              <button
                                onClick={() => toggleDetailed(r.slug)}
                                className="w-full px-6 py-3 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
                              >
                                <div className="relative shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-foreground">
                                    {persona.name[0]}
                                  </div>
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                                    <LinkedInIcon className="w-2 h-2" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-medium text-foreground">
                                      {persona.name.split(" ")[0]}
                                    </span>
                                    <ActionBadges r={r} />
                                  </div>
                                  {r.reaction === "engage" && r.gut_reaction && (
                                    <p className="text-xs text-muted-foreground mt-0.5 italic leading-relaxed">
                                      &ldquo;{r.gut_reaction}&rdquo;
                                    </p>
                                  )}
                                </div>
                                <ChevronDown
                                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              {isExpanded && (
                                <div className="px-6 pb-5 pt-1 ml-11">
                                  {r.comment && (
                                    <div className="mb-3 pl-3 border-l-2 border-emerald-300">
                                      <p className="text-sm text-emerald-700 leading-relaxed">
                                        {r.comment}
                                      </p>
                                    </div>
                                  )}
                                  {r.share_note && (
                                    <div className="mb-3 pl-3 border-l-2 border-purple-300">
                                      <p className="text-sm text-purple-700 leading-relaxed">
                                        {r.share_note}
                                      </p>
                                    </div>
                                  )}

                                  {!showMonologue ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setMonologueVisible((prev) => new Set([...prev, r.slug]))
                                        if (!detailed.find((d) => d.slug === r.slug)) {
                                          loadDetailedFor(r.slug)
                                        }
                                      }}
                                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      See internal monologue →
                                    </button>
                                  ) : (
                                    <div className="bg-muted/30 rounded-lg p-4">
                                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                                        Internal monologue
                                      </p>
                                      {detailedData?.text ? (
                                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                          {detailedData.text}
                                          {detailedData.loading && (
                                            <span className="inline-block w-0.5 h-4 bg-muted-foreground ml-0.5 animate-pulse align-text-bottom" />
                                          )}
                                        </p>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <TypingDots />
                                          <span className="text-xs text-muted-foreground">
                                            Loading...
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pb-8">
              <p className="text-xs text-muted-foreground">
                Powered by{" "}
                <Link href="/" className="text-foreground hover:underline">
                  Refolk
                </Link>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
