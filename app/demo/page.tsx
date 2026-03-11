import Link from "next/link"

const DEMOS = [
  {
    href: "/demo/linkedin",
    title: "LinkedIn Post Tester",
    description:
      "Paste a LinkedIn post and see how 5 personas react — ignore, like, comment, or share. Three levels of feedback: quick stats, aggregate summary, and individual deep dives.",
    personas: "5 personas",
    status: "Live",
  },
  {
    href: "/demo/chat",
    title: "1:1 Persona Chat",
    description:
      "Have a conversation with Sophie Chen — a 28-year-old pharmacist in San Diego. Send text or images and get authentic, in-character responses.",
    personas: "1 persona",
    status: "Live",
  },
]

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            ← refolk
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-300">Demos</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-white mb-2">Demos</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Live experiments with Refolk personas. Each demo shows a different way
          to get feedback from AI personas.
        </p>

        <div className="space-y-4">
          {DEMOS.map((demo) => (
            <Link
              key={demo.href}
              href={demo.href}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg font-medium text-white">
                  {demo.title}
                </h2>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="text-xs text-zinc-600">{demo.personas}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400">
                    {demo.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {demo.description}
              </p>
            </Link>
          ))}
        </div>

        <p className="text-xs text-zinc-700 mt-12 text-center">
          Powered by{" "}
          <Link href="/" className="text-zinc-500 hover:text-zinc-400">
            Refolk
          </Link>
        </p>
      </main>
    </div>
  )
}
