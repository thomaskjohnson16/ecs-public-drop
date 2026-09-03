# ECS Public Drop

Public deployment repository for the live Executive Culture Solutions LLC website.

## Current state (2026-09-03)

- The website is **live**. GitHub Pages publishes the `ECS-MAIN` branch.
- The custom domain `www.executiveculturesolutions.com` is **active** and is pinned by the `CNAME` file in this repository.
- The site is publicly indexable (`robots.txt` allows all; `sitemap.xml` lists the public pages).

## Publication chain

- `thomaskjohnson16/ecs-command-center` (private) is the **canonical source** for website content (`website/prototype-v0.1/`).
- `thomaskjohnson16/ecs-public-drop` (this repository) is the **controlled public deployment repository**.
- Changes reach production only through bounded, reviewed promotion: private source → reconciliation branch here → Draft PR → Thomas approval → merge to `ECS-MAIN` → GitHub Pages.
- No automatic source-to-production synchronization exists or is assumed.

## Website contents

- `index.html` — ECS public website (single-page core)
- `privacy.html`, `terms.html`, `advisory-boundary.html`, `contact-intake-notice.html` — public legal/boundary pages
- `css/styles.css` — canonical site styling (promoted from private source)
- `css/polish.css`, `css/contact-access.css` — production-only UX polish and contact-access overlays (keeper IP; to be reconciled back into the private canonical source)
- `js/main.js`, `js/site-config.js` — navigation, contact rendering, and the approved public contact values
- `CNAME`, `robots.txt`, `sitemap.xml` — deployment, indexing, and discovery controls

## Guardrails

- Do not expose private Command Center repository content here.
- Deployment remains owner-gated: production changes require exact-head QA and Thomas approval before merge to `ECS-MAIN`.
- Rollback: preserve the prior `ECS-MAIN` SHA before any merge; rolling back is a reset/revert to that recorded SHA.
- No backend systems, contact form, CRM, scheduling, payments, chatbot runtime, analytics, or tracking without separate written approval.
- Do not change `CNAME`, DNS, or GitHub Pages settings without explicit owner authorization.
- Keep legal and disclaimer pages in place; content changes to them are promoted from the private source only.

## Historical note

Earlier versions of this file described the site as "staged" with the custom domain "not yet connected." That language was accurate before launch and is retained in git history as evidence; it no longer describes production.
