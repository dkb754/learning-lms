# Adam's Build Mode

An adaptive reading-comprehension and multiplication/division tutor, built for one
10-year-old starting 5th grade. One page, one bookmark, no login, no server.

It replaces the two single-purpose apps from last school year (`Case Files` for
reading, `Array Snapper` for math) with a single app that measures where he is,
picks what to give him next, and explains misses in terms of the specific
thinking trap he fell into.

## What's in it

**Skill Scan** — a 14-question adaptive placement. Ten math questions on a ladder that
climbs from adding and subtracting, through what multiplication means and the times
tables, up to factors, primes and order of operations — stepping up on a right answer
and down on a wrong one. Then one short story. It cannot be failed.

**🧮 Math — 24 skills across the grade 4 and grade 5 standards**

| Strand | Grade | Skills |
|---|---|---|
| Whole numbers | 4 | Adding & subtracting (with regrouping), what × really means, word problems |
| Times tables & division | 4 | ×2–×5, ×6–×9, ×10–×12, division facts, tough division, missing factor |
| Bigger numbers | 4 | 2-digit × 1-digit, remainders, rounding & estimating |
| Number sense | 5 | Even & odd, factors & multiples, prime & composite, order of operations |
| Fractions & decimals | 5 | Reading fractions, adding fractions, decimal place value, **comparing decimals (< > =)**, adding decimals, fractions ↔ decimals |
| Data & probability | 5 | Reading bar charts with a real scale, probability & sample space |

Items are generated, so practice never runs out — which is the point, since repetition
is what builds fluency.

**📖 Reading** — 16 original passages across three bands (start of 5th → stretch into
6th): fiction, expository nonfiction, opinion columns, science, and paired sources.
64 questions tagged by skill.

Comparing decimals draws a **number line** at the easiest level, so "which is
bigger" becomes something to look at rather than guess. The trailing-zero case is
deliberate: 0.5 and 0.50 land on the same spot, labelled differently.

**Rule cards — the part that teaches instead of testing.** Every skill has one: the
words defined, the rule written out plainly, how to recognise a question that needs it,
the steps, a worked example, and the mistake that catches most people. A rule card opens
automatically the first time a skill appears, and `📐 The rule` is on every question.

**Lessons tab** — all 31 skills grouped by strand and labelled Grade 4 catch-up or
Grade 5 now. Nothing is locked here, so tonight's homework is always one tap away:
open the topic, read the rule, then practise 8 or drill 15.

**Bolt, the coach** — every wrong answer choice is tagged with the misconception behind
it, so feedback names the trap: *"Added the bottom numbers — the denominator is the size
of the pieces"*, *"Miscounted the factors — 1 has only one factor, so it is neither"*,
*"Went straight left to right — × happens before + wherever it sits"*. 35 named traps.

## How the adaptation actually works

Built around four interventions for a learner with maths fatigue, rather than
around "do more".

**Concrete → Representational → Abstract.** Every math skill carries a stage.
At **Building it** he places the blocks himself; at **Seeing it** the picture is
drawn for him — an array, equal groups, a fraction bar, shaded hundredths, dots
pairing up, a number line; at **Symbols** it is numbers alone. Two right in a
row moves him up a stage, two wrong moves him back down. Two misses in a row
step the *representation* back, not just the difficulty — going back to the
picture is the intervention. A skill with no honest picture starts where it can
rather than being given a decoration that teaches nothing.

**Cognitive offloading.** A 📐 **Tools** button sits on every question: a 12×12
times table that lights up a row and column when tapped, his own prime grid, a
place-value chart and a fraction wall. **Using it costs nothing** — no mastery
reduction, no XP reduction. Support is recorded as its own dimension and
reported separately, so the parent view still tells the truth without the app
punishing the exact behaviour that frees working memory.

**The Sieve of Eratosthenes.** Primes are not a list to memorise. He crosses out
the multiples of 2, 3, 5 and 7 on a 1–100 grid and the 25 primes emerge in gold.
The finished grid is saved and openable from any question — a permanent anchor
he made himself. A "cross the rest for me" button means he is never stuck.

**Interleaving, never massed drills.** Sets are 3–5 questions, not 15. Choosing a
topic gives it every other slot, so it never appears twice running and the gaps
are filled with a genuinely different kind of question. The engine also avoids
repeating a question format back to back. Repetition still happens — spaced
across sets rather than blocked within one.

**Nothing rewards speed.** No speed praise, no timed scoring, and the old
answer-lock is now a quiet "no rush" note rather than a frozen button. Any set
can be stopped early with the run kept.

| Mechanism | What it does |
|---|---|
| Mastery model | Per-skill 0–1 score. Identical gain whether or not he used the tools. |
| Difficulty controller | Rolling accuracy per skill, holding success near 75%. |
| Item selection | Weighted to the productive-struggle zone, with spaced review of misses. |
| Learner profile | Visual vs symbolic, pace, words vs numbers, and independent vs supported. |

## Grown-up view

The Progress tab shows measured mastery per skill (estimates from the scan are
labelled as estimates), the repeating error patterns, the learner profile with
the numbers behind it, a session log, and a copy-out export.

## Files

- `src/app.html` — the app. Body content only, the form the Artifact publisher expects.
- `build.py` — wraps it into `dist/index.html` and writes `dist/manifest.json`.
- `icons.py` — generates the PNG icons (no image library needed). Rarely rerun.
- `netlify.toml` — deploy config: publish `dist/`, rebuild on push, SPA fallback, cache headers.
- `dist/` — the deployable site, committed so it can also be opened or drag-dropped directly.

```sh
python3 build.py                      # rebuild dist/ after editing src/app.html
python3 -m http.server 8000 -d dist   # serve it locally
```

## Deploying to Netlify

`netlify.toml` sets everything, so no build settings need filling in by hand.

**Connect the repo (auto-deploys on every push)**
1. Netlify → **Add new site → Import an existing project → GitHub**
2. Pick `dkb754/learning-lms`, branch `claude/ai-tutor-adam-h1oj2s`
3. Deploy. Build command and publish directory come from `netlify.toml`.
4. **Site configuration → Change site name** to get a clean URL, e.g.
   `adams-build-mode.netlify.app` — that is the one to bookmark.

**Or drag and drop (no Git, instant)** — drop the `dist/` folder on
<https://app.netlify.com/drop>. Redeploying means dropping it again.

### Installing it on Adam's device

Once it is on HTTPS it installs to the home screen with its own icon, opening
full-screen with no browser chrome:

- **iPad / iPhone** — open in Safari, Share → *Add to Home Screen*
- **Android / Chrome** — the *Install app* prompt appears, or ⋮ → *Add to Home screen*

Progress is stored per browser, so install it once and always open it from that
icon — opening the same URL in a different browser starts from zero.

## Saving, and school Chromebooks

Progress lives in `localStorage` under `adamBuildMode.v1`. A managed school Chromebook
can refuse that outright, and can wipe it on sign-out, which **nothing in a web page can
detect in advance**. So there are three independent layers, and the app works if any one
of them survives:

1. **This device** — `localStorage`. The app probes it on load and says plainly on the
   Base and Progress screens when the browser refuses to store anything.
2. **A file or a link** — *Download save file* writes a `.json` (drag it into Google
   Drive and it outlives the device); *Copy save link* packs the whole state into a
   ~420-character URL fragment. Restore by file, by pasted code, or by opening the link,
   including while the app is already open.
3. **Sync** — an optional Supabase row keyed by a random code (below).

A restore never overwrites a copy that is *further along* than the incoming one, so
restoring or syncing from a stale device cannot cost him work. The result screen offers
a save file every fourth session, and every session if the browser is refusing to store.

### Sync backend

Deliberately small: one table and two functions, no SDK, no auth, no email.

```
public.saves (code text pk, state jsonb, answered int, created_at, updated_at)
  RLS enabled with NO policies -> the anon role cannot touch the table directly
public.load_save(p_code)                     security definer, execute granted to anon
public.put_save(p_code, p_state, p_answered) security definer, execute granted to anon
```

Save codes address skills by index in an append-only `SKILL_ORDER`, so a code
written by an older build still lines up — new skills are added to the end, never
inserted. Anything in `SKILLS` missing from that list is appended at runtime, so a
forgotten entry degrades rather than corrupting a restore.

`put_save` validates the code shape, caps the payload, and **refuses an upsert whose
`answered` is lower than the stored row's** — that rule is what makes a late sync from a
stale device harmless. Client side it is two `fetch` calls, so the app still loads zero
libraries.

The page ships a Supabase **publishable** key, which is designed to be public. The real
access control is that the table has no RLS policies at all: the only way in is the two
functions. The save code is a capability — 12 characters from a 31-character alphabet
with no look-alikes. It is not authentication, and it is not treated as such; the payload
is a chosen first name, an avatar emoji, and practice statistics.

Sync is never load-bearing. Every call has an 8-second ceiling enforced independently of
`fetch`, failures are swallowed, and the app behaves exactly as it does offline. If the
project has auto-paused (Supabase pauses free projects after about a week idle), sync
reports that it cannot be reached and everything else carries on; unpausing it in the
Supabase dashboard brings sync straight back.

## Privacy

No account, no email, no password. Save files and save links are generated in the browser
and go wherever you put them. If sync is switched on, one row holds the progress blob
under a random code — a chosen first name, an avatar emoji, and practice statistics.
Turning sync on is an explicit choice; with it off, nothing leaves the device.
