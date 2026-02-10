(To delete this whole file once this is done. and btw we created a new stripe account for refolk.co - so need to update everything for that new account)

# Stripe Setup Review & Business Description

**Date:** 2026-02-10
**Account:** acct_1LHOPDJJUWoGcvyB (Young & AI)

---

## Task #32: Business Description for Stripe

### Current Description (in Stripe)

> "We provide consulting services on data analytics and web development"

This is outdated — it describes Young & AI's original consulting business, not Refolk.

### Proposed Business Description

> Refolk provides AI-powered digital customer personas for product and marketing teams. Our pre-built personas respond like real people — with authentic motivations, constraints, and perspectives — letting teams test messaging, validate product ideas, and get instant customer feedback without the cost, time, or risk of traditional user research. Offered as a monthly SaaS subscription under Young & AI.

### Shorter Alternative (if Stripe has a character limit)

> Refolk is an AI-powered SaaS that provides pre-built digital customer personas. Teams interact with realistic personas via Slack and email to test ideas, validate messaging, and get instant customer feedback — replacing expensive, slow traditional research.

---

## Task #28: Stripe Product Setup Review

### Live Mode Products

**Refolk Product** (`prod_TwenCTHmu5udci`):
| Field | Current | Issue |
|---|---|---|
| Name | `Refolk` | OK, but consider `Refolk - Customer Personas` for clarity |
| Description | `Refolk curated personas` | Too vague — needs improvement |
| Images | None | Should add product image/logo |
| Marketing Features | None | Should add feature bullets |
| Statement Descriptor | Not set (inherits account default) | Should set product-specific |
| Prices | Starter $50/mo, Team $300/mo | Correct |

**Other Active Products (from Young & AI's other projects):**

- `Issue To PR` — separate product, fine to leave
- `Build an app or website` — separate product
- `$80 a year` / `$8 a month` — unnamed products, should be archived or renamed
- `StoryCraft Customized Storybook` — separate product
- `Young & AI Newsletter` — separate product
- `File Renamer` — separate product

### Proposed Improved Product Description

> **For the Refolk product:**
>
> "AI-powered digital customer personas that respond like real people. Get instant, authentic feedback on your messaging, product ideas, and presentations — from pre-built personas with real motivations, constraints, and perspectives. Available via Slack and email. Unlimited conversations included."

### Proposed Marketing Features (Stripe supports these as bullet points)

1. Pre-built, battle-tested customer personas
2. Unlimited conversations with your personas
3. Slack and email integration
4. Instant feedback — no scheduling or recruiting
5. Zero brand risk — test anything privately

### Test Mode Products (Naming Issue)

Test mode still has products named `Twins - Starter` and `Twins - Team` (old branding). Update to `Refolk - Starter` and `Refolk - Team` to match live mode naming.

---

## Task #31: Account Settings Cleanup

### Current Account State

| Setting                  | Current Value                                       | Recommended               | Action         |
| ------------------------ | --------------------------------------------------- | ------------------------- | -------------- |
| **Business Name**        | `Denver Black Inc` (legal) / `Young & AI` (display) | Keep as-is (legal entity) | None           |
| **Statement Descriptor** | `YOUNG & AI`                                        | `YOUNG&AI REFOLK`         | Dashboard only |
| **Product Description**  | Old consulting description                          | See proposed above        | Dashboard only |
| **Support Email**        | Not set                                             | `support@refolk.co`       | Dashboard only |
| **Support URL**          | Not set                                             | `https://refolk.co`       | Dashboard only |
| **Business URL**         | Notion page link                                    | `https://refolk.co`       | Dashboard only |
| **Support Phone**        | +16265395134                                        | Keep or update            | Dashboard only |
| **Branding (icon/logo)** | None set                                            | Upload Refolk logo        | Dashboard only |
| **Branding Colors**      | None set                                            | Set primary/secondary     | Dashboard only |
| **Timezone**             | `Asia/Shanghai`                                     | Update if needed          | Dashboard only |

### Statement Descriptor Notes

Per [Stripe docs](https://docs.stripe.com/get-started/account/statement-descriptors), statement descriptors must be **5-22 characters**, Latin characters only, contain at least one letter, and **cannot** contain `< > \ ' " *`. Options:

- `YOUNG&AI*REFOLK` — **invalid**, `*` is a prohibited character
- `YOUNG&AI REFOLK` (15 chars) — recommended, shows parent brand + product
- `YOUNGAI-REFOLK` (14 chars) — alternative with separator
- `REFOLK` (6 chars) — simplest, but loses parent brand context

**Note:** Stripe supports a **statement descriptor prefix** (2-10 chars) at the account level, with dynamic suffixes per transaction via PaymentIntents. You could set account-level prefix to `YOUNGAI` and use `REFOLK` as the suffix on Refolk transactions.

### What Can Be Done via CLI vs Dashboard

Per [Stripe API docs](https://docs.stripe.com/api/accounts/update): the Accounts Update API can update statement descriptors, support email, support URL, business URL, and product description — but **only for connected accounts**. For your own account, Stripe requires using the Dashboard.

The [Stripe CLI](https://docs.stripe.com/stripe-cli/use-cli) supports product-level CRUD operations (`stripe products update --help` for details).

| Action                              | CLI? | Notes                                                                     |
| ----------------------------------- | ---- | ------------------------------------------------------------------------- |
| Update product description          | Yes  | `stripe products update prod_TwenCTHmu5udci --description "..." --live`   |
| Update product name                 | Yes  | `stripe products update prod_TwenCTHmu5udci --name "..." --live`          |
| Set product statement descriptor    | Yes  | `stripe products update prod_TwenCTHmu5udci --statement-descriptor "..."` |
| Set product images                  | Yes  | `--images` flag (URL to hosted image)                                     |
| Change account statement descriptor | No   | Dashboard only (own account, not connected)                               |
| Set support email                   | No   | Dashboard only (own account)                                              |
| Set business URL                    | No   | Dashboard only (own account)                                              |
| Upload branding (logo/colors)       | No   | Dashboard only                                                            |
| Update business description         | No   | Dashboard only (own account)                                              |

### Recommended Actions (Priority Order)

1. **Dashboard** — Update business description (replace consulting text with Refolk description)
2. **Dashboard** — Set support email to `support@refolk.co`
3. **Dashboard** — Set business URL to `https://refolk.co`
4. **Dashboard** — Update statement descriptor to `YOUNG&AI REFOLK`
5. **CLI or Dashboard** — Update Refolk product description to the improved version above
6. **Dashboard** — Upload Refolk logo as branding icon
7. **Dashboard** — Add marketing features to the Refolk product
8. **Optional** — Archive or deactivate old `$8 a month` / `$80 a year` products if unused

### Quick Dashboard Links

- Settings: https://dashboard.stripe.com/settings
- Account details: https://dashboard.stripe.com/settings/account
- Branding: https://dashboard.stripe.com/settings/branding
- Products: https://dashboard.stripe.com/products/prod_TwenCTHmu5udci
- Public details: https://dashboard.stripe.com/settings/public

---

## Summary

The Stripe account is functional with correct pricing, but the account profile still reflects Young & AI's old consulting business. The Refolk product description is too minimal. Most changes require the Stripe Dashboard — the CLI can only update product-level fields, not account-level settings like statement descriptor, support email, or business description.
