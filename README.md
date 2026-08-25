# Adam's Build Mode

An adaptive reading-comprehension and multiplication/division tutor, built for one
10-year-old starting 5th grade. One page, one bookmark, no login, no server.

It replaces the two single-purpose apps from last school year (`Case Files` for
reading, `Array Snapper` for math) with a single app that measures where he is,
picks what to give him next, and explains misses in terms of the specific
thinking trap he fell into.

## What's in it

**Skill Scan** — a 12-question adaptive placement (8 math on a ladder that steps
up on a right answer and down on a wrong one, then one short story with four
questions). It sets the starting level for every skill and cannot be failed.

**Two realms**
- 🧮 **Build Mode** — ×2 through ×12, division facts, missing factors,
  remainders, 2-digit × 1-digit, and word problems. Items are generated, so they
  never run out.
- 📖 **Story Servers** — eight original passages across three difficulty bands
  (start of 5th → stretch into 6th): fiction, expository nonfiction, an opinion
  column, a science article, and a paired-source comparison. 34 questions tagged
  by skill.

**Bolt, the coach** — every wrong answer choice is tagged with the misconception
behind it, so feedback names the trap ("Added instead of multiplied", "Matched a
word, not an idea", "Went further than the text") instead of just saying no.
Hints come in three tiers: a nudge, a strategy, then the worked answer.

**Daily build order** — three quests a day, about ten to fifteen minutes.

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

## Privacy

Progress lives in `localStorage` under `adamBuildMode.v1`, in one browser on one
device — including once it is deployed, since the site has no back end. Nothing is uploaded and there is no account. Clearing site data clears
progress — the Progress tab has an export for keeping a copy.
