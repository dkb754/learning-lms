# Level I curriculum — how it is built and what you control

Source: `CE_LevelMap_PlatformBrief.docx`. All course text is **data**, not page code:

| File | What it holds | Edit it to… |
|---|---|---|
| `content/level1.js` | 16 online days + 4 Saturday labs, topics, resources, deliverables, KRP, CST rubric | change dates, topics, links; add full lesson text in a day's `lesson` field (HTML string) |
| `content/level1-lessons.js` | Full lesson text for all 20 days (from `LevelI_LessonContent.docx`; developer/instructor-only lines such as "Gate:" and "Automation:" were removed) | edit the HTML for a day, or regenerate from the docx |
| `content/level1-exercises.js` | The three Week 1 scaling exercises (prompts only). Answers and tolerances are in `lms-api-v2` (`EXERCISES`) so students cannot read them | change numbers in BOTH places |
| `content/level1-quizzes.js` | 14 quizzes (160 questions) written to match the lesson text | fix or replace questions; fill the `todo` items |
| `supabase/functions/lms-api-v2` | server rules (ids, uploads, rubric keys, eligibility) | only if you add/rename a deliverable or quiz id — keep it in sync with `level1.js` |

## Lesson activities (practice inside every lesson)
Every PART of every lesson ends with auto-graded practice, plus diagrams where a picture helps (111 graded activities, 15 diagrams):
* **Types:** multiple-choice scenarios (each answer explains why), put-in-order, match, calculate (numbers), and written reflections. Written reflections give feedback on completeness (enough specific entries, enough words, ideas worth adding), then show a model answer to compare with. They do not judge whether the content is "right".
* **Honest Map:** Monday Part 3 is a working tool (Physical / Emotional / Relational / Economic, three entries each). Students download it as a text file and upload it Thursday as the KRP Honest Map. The Concept Brief (Nov 4) and 90-day plan work the same way.
* **Pass mark** 70%, unlimited retries. Best score, attempts and written answers are saved on the student's record; activities count toward week progress and appear in My Grades. The tracker has a **Lesson activities** column; **Export Reflections CSV** gives you every student's written answers.
* **Where it lives:** `content/activities-w1d1.js`, `activities-w1.js` … `activities-w4.js` (data), `activities-engine.js` (behaviour), `level1-diagrams.js` (diagrams). Check your edits with `node tools/check-activities.mjs`.
* The Week 4 and some Week 2 activities draw on standard ServSafe / FDA Food Code knowledge where the lesson text is short. Review them before you rely on them.

## Instructor controls (sign in with the admin code)
* **Quiz Review** — every quiz starts as **DRAFT** and is invisible to students. Check the answers, then **Publish**. Students cannot score an unpublished quiz even by calling the API.
* **Student Tracker** — Lab 1–4 attendance toggles (Lab 1 present ⇒ Weeks 2–4 unlock), ServSafe practice score + exam result, CST rubric score, manual unlock, Level II-ready flag, CSV exports, file downloads.
* **CST Rubric** — 25 criteria × 4 pts = 100 (80+ Pass, 70–79 Conditional, <70 Remediation). Section 4 uses the six criteria you approved.

## Decisions made on your behalf (change if wrong)
* Real 2026 calendar: labs Sat Oct 17, 24, 31, Nov 7; Week 4 Mon–Thu = Nov 2–5 (the brief's dates were a day off in places).
* Lab 1 attendance is the Weeks 2–4 gate. Level II-ready = ServSafe exam passed + Concept Brief (Lab 4) submitted + all 14 quizzes passed.
* VCU is not part of this platform. Host kitchen is Parsley's Kitchen, 2600 Nine Mile Rd (the lesson document confirms it).
* The lesson document's day dates for Wed–Thu of Week 1 and all of Week 4 (and Lab 3/Lab 4: "Nov 1"/"Nov 8") do not match the 2026 calendar; the platform uses Oct 14/15, Oct 31, Nov 3/4/5 and Nov 7.
* The three scaling exercises are graded automatically on the server. Each box is marked right or wrong; the correct answer is never shown, and a student can retry. A pass means every box correct. They count toward Week 1 progress and show in the tracker and CSV.
* Deliverables follow the brief (Honest Map Thu Oct 15, Professional Identity Statement Wed Oct 21, Recipe Cost Sheet Thu Oct 29). The lesson document places the Identity Statement on Week 1 Thursday and the Recipe Cost Sheet on Week 2 Wednesday — tell me if that is the intended schedule.
* Students from an earlier cohort are archived (`student_progress_archive`) and reset the first time they sign in.

## 90-day check-in email (Resend)
* Students opt in on the **KRP Portfolio** page (email + checkbox). Nothing is sent without an opt-in, and they can opt out there any time.
* A daily job (`pg_cron`, 15:00 UTC) calls the `send-checkins` function. Until **Feb 5, 2027** (90 days after Lab 4, Nov 7) it does nothing. After that it emails opted-in students whose Lab 4 attendance you recorded, once each.
* **You must add the secret** `RESEND_API_KEY` (Supabase dashboard → Edge Functions → Secrets). Resend's real endpoint is `https://api.resend.com/emails` (not `resend.com/api/send`); the function already uses it.
* Verify your sending domain in Resend (add the DNS records it shows in Cloudflare). The default sender is `Culinary Coach <checkin@culinarycoach.org>`; to change it set the secret `CHECKIN_FROM`.
* Survey link: `update lms_settings set value = '"https://your-survey-link"' where key = 'checkin_survey_url';` Until you set it, the email asks students to reply instead.
* Test it any time: Student Tracker → **Send test check-in email**.

## Not built yet
Level II content and dual-level switching; a survey form for the 90-day email (link goes in `checkin_survey_url`).
