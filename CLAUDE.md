# Twins Project - Claude Guidelines

## Development Workflow

All changes to the app follow this process:

### 1. Requirements Document First
- Before any code changes, create or update a requirements/objectives `.md` doc describing what we want to build.
- Start with a single master doc: `docs/requirements.md`
- Branch into smaller, feature-specific docs if any section gets too long.
- No code is written until the requirements doc is reviewed and approved by the user.

### 2. Technical Planning (When Needed)
- For now, the app is simple enough to go straight from requirements to code.
- As the app grows, add an interim technical spec / planning doc before coding to identify how to implement changes (architecture, affected files, data models, etc.).

### 3. Implementation
- Code changes are made only after requirements are approved.
- Keep changes focused on what was specified in the requirements.

### 4. User Feedback & Feelings
- The user will share general impressions, feelings, and reactions about the current app.
- Capture these in `docs/feedback.md` as they come up.
- Use this feedback to inform future requirements and improvements.
- Don't discard vague feelings — they often point to real UX or product issues worth solving.

## Project Context

- **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Radix UI / shadcn/ui
- **Runtime:** Bun (dev server: `bun run dev`)
- **Current state:** Static marketing landing page — no backend, no database, no auth, no real AI integration
- **Deployment:** Vercel (auto-synced from v0.app)

## Docs Structure

```
docs/
  requirements.md    # Master requirements & feature requests
  feedback.md        # User feelings, impressions, and reactions
```
