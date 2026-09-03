# ECS Public Deployment Gate

## Status (2026-09-03)

**LIVE_PRODUCTION / CHANGES_HELD_UNTIL_APPROVED.**

The website is already live: GitHub Pages publishes `ECS-MAIN`, and `www.executiveculturesolutions.com` is active. This gate now governs *changes* to the live site, not initial launch.

## Source of truth

- Canonical private source: `thomaskjohnson16/ecs-command-center`, path `website/prototype-v0.1/`.
- This public repository holds only the deployed public files.

## Change control

1. Content changes originate in the private canonical source and are reviewed there.
2. A bounded reconciliation branch in this repository promotes the approved content (never a wholesale copy — private publication controls such as `NO-LAUNCH.md`, internal review/evidence files, and private `noindex`/`Disallow` robots controls must never be promoted).
3. Every production change requires exact-head QA evidence and explicit Thomas approval before merge to `ECS-MAIN`.
4. Before merging any change, record the current `ECS-MAIN` SHA for rollback; rollback is a revert/reset to that SHA.
5. No automatic synchronization from the private source is configured or assumed.

## Standing guardrails

- No merge or deployment without Thomas approval.
- No DNS, domain, `CNAME`, or GitHub Pages settings change without explicit owner authorization.
- No backend, contact form, CRM, scheduling, payment, analytics, tracking, or chatbot runtime without separate approval. Any future VAI voice/chat agent integration is a separate owner-gated workstream.
- Public indexing posture (robots `Allow: /`, sitemap) is preserved; do not reintroduce `noindex` or `Disallow: /` on the live site without an explicit owner order.
- Approved public contacts only: `Contact@executiveculturesolutions.com`, `Intake@executiveculturesolutions.com`, `(910) 315-0436`.

## Historical note

Earlier versions of this gate described pre-launch steps (enable Pages, test the default URL, then connect the domain). Those steps completed; the historical wording remains in git history as evidence and no longer describes the current state.
