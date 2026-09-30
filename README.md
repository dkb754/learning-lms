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

**🧮 Math — 23 skills across the grade 4 and grade 5 standards**

| Strand | Grade | Skills |
|---|---|---|
| Whole numbers | 4 | Adding & subtracting (with regrouping), what × really means, word problems |
| Times tables & division | 4 | ×2–×5, ×6–×9, ×10–×12, division facts, tough division, missing factor |
| Bigger numbers | 4 | 2-digit × 1-digit, remainders, rounding & estimating |
| Number sense | 5 | Even & odd, factors & multiples, prime & composite, order of operations |
| Fractions & decimals | 5 | Reading fractions, adding fractions, decimal place value, adding decimals, fractions ↔ decimals |
| Data & probability | 5 | Reading bar charts with a real scale, probability & sample space |

Items are generated, so practice never runs out — which is the point, since repetition
is what builds fluency.

**📖 Reading** — 16 original passages across three bands (start of 5th → stretch into
6th): fiction, expository nonfiction, opinion columns, science, and paired sources.
64 questions tagged by skill.

**Rule cards — the part that teaches instead of testing.** Every skill has one: the
words defined, the rule written out plainly, how to recognise a question that needs it,
the steps, a worked example, and the mistake that catches most people. A rule card opens
automatically the first time a skill appears, and `📐 The rule` is on every question.

**Lessons tab** — all 30 skills grouped by strand and labelled Grade 4 catch-up or
Grade 5 now. Nothing is locked here, so tonight's homework is always one tap away:
open the topic, read the rule, then practise 8 or drill 15.

**Bolt, the coach** — every wrong answer choice is tagged with the misconception behind
it, so feedback names the trap: *"Added the bottom numbers — the denominator is the size
of the pieces"*, *"Miscounted the factors — 1 has only one factor, so it is neither"*,
*"Went straight left to right — × happens before + wherever it sits"*. 35 named traps.

## How the adaptation actually works

| Mechanism | What it does |
|---|---|
| Mastery model | Per-skill 0–1 score. Correct answers gain more at higher difficulty; hinted answers earn ~45% credit. Wrong answers decay it. |
| Difficulty controller | Tracks rolling accuracy per skill and steps difficulty up above ~85% and down below ~34%, holding success near 75% — hard enough to matter, not hard enough to hurt. |
| Item selection | Weighted toward the productive-struggle zone (mastery 0.22–0.55), with a spaced-review queue that brings missed items back several questions later. |
| Prerequisites | Remainders stay locked until division facts hold; 2-digit × 1-digit until ×6–×9 holds. |
| Frustration guard | Two misses in a row drops the next item a level and opens the visual scaffold automatically, without him having to ask. |
| Learner profile | Four measured dials — visual vs. symbolic accuracy, pace, words vs. bare numbers, and hint use. |

The profile changes the app, not just the report:
- **Visual builder** → arrays and group diagrams stay switched on.
- **Fast-and-wrong** → "slow-down mode" briefly locks the answer buttons with the reason shown.
- **Story thinker** → more facts arrive wrapped in word problems.

Note on the profile: the app measures the visual channel on purpose early on
(showing brick-built items ~40% of the time on eligible skills) — otherwise there
would be no data to decide from.

**No live AI model is called.** The page is fully offline-capable and the coaching
is a deterministic engine — a mastery model, a difficulty controller, and a
misconception library — not a language model call.

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

Progress lives in `localStorage` under `adamBuildMode.v1` — one browser, one device, no
account, nothing uploaded. A managed school Chromebook can refuse that outright, and can
also wipe it on sign-out, which **nothing in a web page can detect in advance**. So the
app does not rely on it:

- On load it tests whether the browser will store anything at all, and says so plainly
  on the Base and Progress screens if it will not.
- **Download save file** writes a `.json` to Downloads. Drag it into Google Drive and it
  outlives the device. Restore with **Open a save file**.
- **Copy save link** produces a URL with the whole state packed into the fragment (about
  350–450 characters). Opening it anywhere restores that progress — bookmark it, or mail
  it to yourself. Opening one while the app is already open asks before overwriting.
- A restore never overwrites a browser that holds *more* progress than the code carries,
  so restoring on the wrong device cannot cost anything.
- The result screen offers a save file every fourth session, and every session if the
  browser is refusing to store.

None of this needs a network or an account.

## Privacy

Nothing is uploaded and there is no account or back end. Save files and save links are
generated in the browser and go wherever you put them.
