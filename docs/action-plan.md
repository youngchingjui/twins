# Twins Project - Action Plan

**Last updated:** 2026-02-09

## Current Status

- **Branch:** `reqs` contains work that needs review and merging
- **GitHub Issues:** None created yet
- **Pricing:** Updated to $50/mo Starter, $300/mo Team
- **Stripe:** Setup guide created, payment links need to be created

## Immediate Next Steps

### 1. Review & Merge `reqs` Branch
- [x] Branch reviewed - contains requirements docs, CLAUDE.md, pricing strategy
- [ ] Merge `reqs` → `main`
- [ ] Push updated pricing to main

### 2. Set Up Stripe Payment Links
- [ ] Log into Stripe dashboard
- [ ] Create products (Starter $50/mo, Team $300/mo)
- [ ] Create payment links
- [ ] Create `.env.local` with payment link URLs
- [ ] Test purchase flow in Stripe test mode
- [ ] Switch to live mode and update links

**Guide:** See `docs/stripe-setup.md` for detailed instructions

### 3. Create GitHub Issues from Requirements

Convert the numbered features from `docs/requirements.md` into GitHub issues for tracking:

**Phase 1 - Priority NOW:**
- [ ] Issue #1: Remove "cis-" references from persona content
- [ ] Issue #2: Rework "How It Works" section
- [ ] Issue #3: Add hero interactive demo
- [ ] Issue #4: Basic marketing push

**Phase 2 - SEO & Content:**
- [ ] Issue #5: Create channel-specific deep dive pages (Slack, Email)
- [ ] Issue #6: Ongoing content strategy (blog posts, social)

**Phase 3 - Later:**
- [ ] Issue #7: Census/survey polling at scale (premium feature)

**Additional:**
- [ ] Issue #8: Expand "The Difference" to 3-way comparison

### 4. Deploy Environment Variables to Vercel
- [ ] Add `NEXT_PUBLIC_STRIPE_STARTER_LINK` to Vercel
- [ ] Add `NEXT_PUBLIC_STRIPE_TEAM_LINK` to Vercel
- [ ] Deploy and test live

## Phase 0 - Prerequisite (From Requirements)

Before diving deep into features:
- [ ] **Build test twins modeled after friends' workplace contacts** (Issue #10)
  - Interview friends about specific colleagues (with permission/anonymization)
  - Capture rich context: motivations, constraints, team dynamics, quirks
  - Set up email accounts for each twin (e.g., maya@twins-demo.com)
  - Friends email the twins and validate if responses match reality
  - Iterate based on feedback
- [ ] Create at least 2-3 real digital customer twins this way
- [ ] Interact with them extensively to understand behavior
- [ ] Use this experience to inform the demo, marketing content, and blog posts

**Rationale:** Authentic experience first → then build and write about it credibly.

**Why this matters:** We need to actually experience how realistic twins respond before we can build a compelling demo or write authentic marketing copy. This validates the core concept and informs everything else.

## Files Created/Updated Today

**New files:**
- `docs/pricing-strategy.md` - Pricing philosophy and tier details
- `docs/stripe-setup.md` - Step-by-step Stripe integration guide
- `docs/action-plan.md` - This file
- `.env.local.example` - Environment variable template

**Updated files:**
- `components/pricing.tsx` - Updated pricing to $50/$300, added Stripe links

## Open Questions

- Should we merge pricing changes to main before creating Stripe links, or after?
- Which Phase 1 feature should we tackle first after pricing is live?
- Do we want to create a `/welcome` page for post-purchase redirect, or use Stripe's default success page initially?

## Resources

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Vercel Dashboard:** https://vercel.com/youngchingjuis-projects/v0-digital-customer-twins
- **v0.app Chat:** https://v0.app/chat/kilQpyBuAiL
- **GitHub Repo:** https://github.com/youngchingjui/twins
