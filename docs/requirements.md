# Twins - Requirements & Feature Requests

## Overview

This is the master requirements document for the Digital Customer Twins project. All proposed changes and new features should be documented here before implementation.

## Priority Roadmap

Goal: get live fast, get real user feedback, iterate.

### Phase 0 — Prerequisite

- **Create at least 1 real digital customer** and interact with them to understand how they behave. This informs everything else — the demo, the marketing content, the blog posts. Experience it first, then build and write about it.

### Phase 1 — Ship a testable landing page (NOW)

1. **#2 Remove "cis-" references** — 5-min fix, do first
2. **#3 Rework "How it works"** — fix the framing so the page makes sense
3. **#1 Hero interactive demo** — the hook that makes people stay (scripted is fine for v1)
4. **#6 Basic marketing push** — start driving traffic as soon as the page is updated

### Phase 2 — SEO & content

5. **#4 Channel deep-dive pages** — Slack + Email pages for SEO long-tail traffic
6. **#6 Ongoing content** — blog posts, social media cadence

### Phase 3 — Product (later)

7. **#5 Census/survey at scale** — future premium feature, needs validation first

---

## 6. Marketing Plan (Low-Cost / Scrappy)

### What

A basic, low/zero-cost marketing strategy to drive early traffic and test real user interest.

### Why

No point perfecting the product in a vacuum. Need real eyeballs and feedback fast. Keep spend near zero — validate before investing.

### Channels & Tactics

**Blog posts (SEO + shareable content)**

- Publish on the Twins site blog (add a `/blog` section)
- Topics that attract the target audience:
  - "Why focus groups are broken (and what to do instead)"
  - "How to test your messaging before spending a dollar on ads"
  - "What if you could talk to your customer before they exist?"
  - "Digital twins for product teams: a new way to validate ideas"
- Repurpose posts to Medium, Dev.to, Indie Hackers, Hashnode for extra reach

**Social media**

- Twitter/X: share insights, hot takes on customer research, short demos
- LinkedIn: more polished posts targeting product managers, marketers, founders
- Post consistently (3-5x/week), not just announcements
- Engage in relevant communities and conversations, don't just broadcast

**Community & forums**

- Post on Indie Hackers (build in public, share progress)
- Relevant subreddits (r/startups, r/SaaS, r/productmanagement, r/marketing)
- Product Hunt launch when the demo is polished enough

**Other zero-cost tactics**

- Waitlist / email capture on the landing page (measure interest)
- Ask early visitors for 5-min feedback calls
- Share on personal networks (LinkedIn, Twitter, friends in the industry)

### Open Questions

- Do we need a blog built into the site, or start with external platforms (Medium, etc.) to move faster?
- What's the waitlist CTA — just email, or a short survey to learn about the visitor?

### Acceptance Criteria

- [ ] At least 2 blog posts written and published
- [ ] Social media accounts active and posting
- [ ] Waitlist or email capture live on the landing page
- [ ] Traffic is being tracked (Vercel Analytics is already in place)

---

## 1. Hero Interactive Demo — "Try it now"

### What

Add an interactive chat widget directly in the hero section that lets visitors immediately talk to a digital twin. Styled like a mock Slack/chat window so it feels familiar.

### Why

The current hero describes the concept but doesn't prove it. Visitors are skeptical — "show me, don't tell me." An instant hands-on demo converts that skepticism into an aha moment before they even scroll.

### Details

- Embedded in or right below the hero, above the fold
- Looks like a Slack-style chat window (familiar UI, low friction)
- Pre-loaded with a suggested prompt/question so the user isn't staring at a blank input (e.g., "Ask Maya: Would you switch to a new project management tool?")
- Could have a few prompt suggestions as clickable chips to reduce blank-page anxiety
- The twin should respond in a realistic, persona-consistent way
- Keep it simple — one persona to start (e.g., Maya Chen)

### Open Questions

- Should this be a real AI-powered response (requires backend) or a scripted demo for now?
- How many prompt suggestions to show?
- Should the user be able to switch personas in the demo?

### Acceptance Criteria

- [ ] Chat widget visible in the hero section without scrolling
- [ ] At least one suggested prompt is shown to guide the user
- [ ] User can type a message and see a response from the twin
- [ ] Feels like a real conversation, not a canned FAQ

---

## 2. Remove "cis-" references from persona content

### What

Remove any "cis-" terminology from persona backstories and descriptions.

### Why

Feels too political and on the nose. Personas should read naturally without unnecessary identity signaling.

### Acceptance Criteria

- [ ] No "cis-" references remain in any persona content
- [ ] Persona backstories still read naturally after the edit

---

## 3. Rework "How It Works" Section

### What

Rewrite the "How it works" section to reflect the actual product model: we provide a pre-built roster of digital customers. The user's main action is connecting those twins to their existing channels (Slack, email, etc.) — not building personas from scratch.

### Why

The current flow implies the user has to do the heavy lifting of creating customers. That's the old framing. The real value prop is "your customers are already here, just plug them in." Building custom twins is a secondary/advanced feature, not the entry point.

### Details

- Reframe the steps around: Browse/pick twins from our roster → Connect to your channels → Start getting feedback
- De-emphasize "build your own" — it can exist as an option but shouldn't be step 1
- Keep the section brief and punchy on the landing page
- Channels mentioned should include: Slack, email, and other work tools

### Acceptance Criteria

- [ ] "How it works" no longer leads with building/creating a customer
- [ ] Steps clearly convey: pick from roster → connect to channels → get feedback
- [ ] Custom twin creation is positioned as optional/advanced, not the main path

---

## 7. Expand "The Difference" to a 3-Way Comparison

### What

Rework the comparison section from a 2-column layout (traditional personas vs digital twins) into a 3-column layout: **Traditional Personas** vs **Real People** vs **Digital Twins**. Digital twins should clearly win on the combination of both.

### Why

The current comparison only positions against static personas. But the real alternative customers consider is _actual people_ — focus groups, user interviews, beta testers. Adding that column makes the value prop much sharper: real people are the gold standard but come with serious downsides. Digital twins give you most of the upside with almost none of the cost.

### Details

**Traditional Personas (bad at everything)**

- Static documents that never change
- Abstract demographics and stereotypes
- Interpreted differently by each team member
- You imagine their response — it's fiction

**Real People (gold standard but painful)**

- Expensive to recruit and compensate
- Slow — scheduling, no-shows, analysis takes weeks
- Small sample sizes (5-10 people per round)
- Risk brand damage if you test bad ideas publicly
- Can't reuse — each round is a new recruit
- Availability bias — you only hear from people willing to do research
- Legal/privacy overhead (consent forms, data handling)
- Honest feedback is rare — social desirability bias
- Can't test sensitive or controversial ideas safely

**Digital Twins (best of both worlds)**

- Dynamic — they respond, argue, hesitate, change their mind
- Instant and available 24/7
- Consistent — same person, same way, every time
- Zero brand risk — test anything privately
- Scalable — talk to 1 or 1,000
- No recruiting, no scheduling, no no-shows
- Cost-effective — fraction of real research
- Will actually tell you your idea is bad

### Acceptance Criteria

- [ ] Comparison section shows 3 columns (or equivalent layout that works on mobile)
- [ ] "Real People" column clearly conveys the cost, speed, risk, and scale downsides
- [ ] Digital Twins column positions as getting the benefits of real people without the drawbacks
- [ ] Layout works well on both desktop (3-col) and mobile (stacked)

---

## 4. Channel-Specific Deep Dive Pages (SEO)

### What

Create individual pages for each integration channel (e.g., `/channels/slack`, `/channels/email`) with deeper content on how to use twins in that specific context.

### Why

- Landing page should only briefly introduce the channels — too much detail clutters it
- Dedicated pages are better for SEO (target searches like "AI customer feedback in Slack")
- Users who care about a specific channel get a focused, detailed explanation

### Details

- Landing page keeps a brief overview of available channels with links to deep-dive pages
- Each channel page covers: setup, use cases, example conversations, best practices
- Start with Slack and Email as the first two pages
- Consistent layout/template across channel pages for scalability

### Open Questions

- Which channels to launch with? (Slack + Email seem like the obvious first two)
- How much content per page — lightweight or comprehensive guides?

### Acceptance Criteria

- [ ] At least 2 channel-specific pages exist (Slack, Email)
- [ ] Landing page links to them from the integrations/channels section
- [ ] Each page has enough unique content to be valuable for SEO

---

## 5. Census / Survey Polling at Scale (Future)

**Priority:** Later — higher-tier plan feature. Parking this for now.

### What

Allow users to run surveys or polls across hundreds or thousands of digital twins at once, simulating how a real population would respond before going to the actual public.

### Why

One-on-one twin conversations are valuable, but the ability to poll at scale is a different superpower entirely — synthetic focus groups, market sizing, message testing, policy polling, etc. This turns twins from a qualitative tool into a quantitative one.

### Details

- User defines a question or survey → runs it against a large population of twins
- Results come back as aggregated data (percentages, distributions, sentiment breakdowns)
- More compute-intensive = higher pricing tier (not in Starter plan)
- Could be positioned as "Census" or "Survey" feature in the product

### Key Risks / Validation Needed

- Must validate that twin population responses actually correlate with real population data
- Need to run calibration tests against known survey results or sample populations before marketing accuracy claims
- Without validation, this is an interesting experiment; with validation, it's a game-changer

### Open Questions

- What pricing tier does this belong in? (Team? Enterprise? Dedicated "Research" plan?)
- What survey formats to support? (Multiple choice, open-ended, Likert scale, etc.)
- How do we define and compose the twin population for a given poll?
- What's the validation strategy — compare against existing public polling data?

### Acceptance Criteria

- [ ] TBD — not scoped for implementation yet
