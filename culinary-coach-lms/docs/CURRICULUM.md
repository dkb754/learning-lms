# Level I curriculum — how it is built and what you control

Source: `CE_LevelMap_PlatformBrief.docx`. All course text is **data**, not page code:

| File | What it holds | Edit it to… |
|---|---|---|
| `content/level1.js` | 16 online days + 4 Saturday labs, topics, resources, deliverables, KRP, CST rubric | change dates, topics, links; add full lesson text in a day's `lesson` field (HTML string) |
| `content/level1-quizzes.js` | 14 quizzes (155 draft questions) | fix or replace questions; fill the `todo` items |
| `supabase/functions/lms-api-v2` | server rules (ids, uploads, rubric keys, eligibility) | only if you add/rename a deliverable or quiz id — keep it in sync with `level1.js` |

## Instructor controls (sign in with the admin code)
* **Quiz Review** — every quiz starts as **DRAFT** and is invisible to students. Check the answers, then **Publish**. Students cannot score an unpublished quiz even by calling the API.
* **Student Tracker** — Lab 1–4 attendance toggles (Lab 1 present ⇒ Weeks 2–4 unlock), ServSafe practice score + exam result, CST rubric score, manual unlock, Level II-ready flag, CSV exports, file downloads.
* **CST Rubric** — 25 criteria × 4 pts = 100 (80+ Pass, 70–79 Conditional, <70 Remediation). Section 4 uses the six criteria you approved.

## Decisions made on your behalf (change if wrong)
* Real 2026 calendar: labs Sat Oct 17, 24, 31, Nov 7; Week 4 Mon–Thu = Nov 2–5 (the brief's dates were a day off in places).
* Lab 1 attendance is the Weeks 2–4 gate. Level II-ready = ServSafe exam passed + Concept Brief (Lab 4) submitted + all 14 quizzes passed.
* VCU is not part of this platform. Host kitchen text is Parsley's Kitchen (`LAB_PLACE` in `index.html`) — **confirm**.
* Students from an earlier cohort are archived (`student_progress_archive`) and reset the first time they sign in.

## Not built yet
Level II content and dual-level switching; the 90-day check-in email (needs an email provider key added to Supabase secrets); full lesson bodies; CST-specific quiz items, cut specs and the 25-ingredient library.
