# Adam's Build Mode

An adaptive reading-comprehension and multiplication/division tutor, built for one
10-year-old starting 5th grade. One page, one bookmark, no login, no server.

It replaces the two single-purpose apps from last school year (`Case Files` for
reading, `Array Snapper` for math) with a single app that measures where he is,
picks what to give him next, and explains misses in terms of the specific
thinking trap he fell into.

## v15 — fractions to decimals, and tonight's homework

School set fraction-to-decimal conversion, so that topic got rebuilt properly
and a way to pin homework got added.

**The topic.** It used to be nine pairs to recognise from a multiple-choice
list. It now teaches the idea that does the work, which is JUMP's: *tenths and
hundredths are decimals already*. 3/10 is 0.3; 47/100 is 0.47; you read one
straight off the other. Anything else becomes one of those first, and dividing
is the last resort rather than the opening move. Three rungs:

| Rung | What he does |
|---|---|
| Hands-on | Drags fractions into the decimal they match — 3/4, 75/100 and 6/8 all land on 0.75. Equivalent fractions and the decimal link in one move. |
| Picture | A hundred-square grid with the fraction shaded, and the decimal read off it. Distractors are the real slips: 0.04, 0.410, 4.10. |
| Written | "3/4 = ? out of 100" as its own question, then the conversion, then decimal back to fraction. |

The keypad also grew a decimal point, which it had never had — before this,
a typed decimal answer was literally untypeable.

**Tonight's homework.** Grown-ups has a picker that pins whatever school set to
the top of Adam's home screen for that day, above the sequence's own
suggestion. It clears itself tomorrow.

## v14 — the scratch pad

Adam again, after a full lesson: *he needs a scratch pad for addition and
subtraction*, and he had been stacking the numbers top to bottom himself.

He is right, and for a better reason than he knows. Holding a carried ten in
your head while you work the next column is the heaviest load in written
arithmetic, and it is the first thing a child with number trouble drops.
Writing it down is not a crutch — it is the method.

So adding and subtracting now has a proper **column workspace** at the written
stage: a row of small dashed boxes for carries and crossings-out, the two
numbers right-aligned by place value, a rule, and one box per column for the
answer. Typing a digit walks the cursor **left**, the way the algorithm runs.
The small boxes are never marked; they are his working, not his answer. Check
a wrong answer and the boxes stay live with a diagnosis — he fixes his own
work rather than being told.

The same pad, blank and with both numbers editable, is now the first tab of the
📐 tools drawer, so it is one tap away from **any** question in the app — a word
problem, a story, anything he wants to stack.

Adding & subtracting now runs the full concrete-to-abstract ladder in one
sitting: **trade the blocks → stack the columns → straight answer.**

## v13 — Adam's own notes

Adam asked for three things, in his words: *more interactive*, *moving stuff
around*, *having a character*, and *picking the lessons he kind of wants*. All
three are in.

**A builder he makes himself.** The emoji avatar is now a character built out of
CSS: colour, hat and eyes, with some parts unlocked by level. It lives in the top
bar — so it is on screen during a lesson — and it **reacts**: it jumps on a right
answer and tilts its head on a wrong one. It takes a bow on the results screen.

**Choice, inside the rails.** The single "Today's lesson" button is now a short
chooser: *Next up* (the one the sequence says), *Something I'm good at*, *Mixed
review*, and *Read a story*. He picks. Every option is a legitimate next move, so
choosing freely cannot undo the teaching order — which is the thing closing the
gap.

**Things you move with your hands.** Three manipulatives open the topics that
have them, and all three work by dragging *or* by tap-to-pick-up and
tap-to-put-down, because a school Chromebook might be a touchscreen, a trackpad
or a mouse:

| Widget | Topic | What he does |
|---|---|---|
| **Sort** | Even & odd, prime & composite | Drags numbers into two buckets. A wrong bucket is not a wrong answer — it bounces back with the reason, and the slip is recorded as support, never as a miss. |
| **Number line** | Rounding & estimating | Drags the number onto the ten it is closest to. This is JUMP's own grade-4 rounding page. |
| **Trade** | Adding & subtracting | Taps to swap ten loose ones for a rod. The carried 1 in the written method *is* that trade, and most children who "can't regroup" have never seen it happen. |

A lesson now climbs **stage 0 → 1 → 2 inside one sitting**: do it with your
hands, then with the picture, then with the symbols.

## v12 — rebuilt around the JUMP Math method

Two facts set the direction for this version:

- Adam scored **330 on the Virginia math SOL** — the pass line is 400 — in the same
  year he got an **A in 4th grade math**. A grade can be earned with effort, neatness
  and turning work in. The state test asks whether the grade-4 standards are actually
  secure. When those two disagree this hard, the content is not secure and he has been
  carried along on top of gaps.
- The app had grown too big. Six blocks on the home screen, five tabs, a seven-section
  rule card in front of every new topic, three taps to start practising anything.

JUMP Math's answer to the first problem is also the answer to the second. Working from
JUMP's own grade 3–5 Teacher Resource and Assessment & Practice books, four things
changed:

| JUMP principle | What it changed here |
|---|---|
| **One lesson is one move** | A sitting is now a single topic: two mental-math warm-ups, four questions on one idea, the sentence that names it, one optional bonus. ~8 questions, about five minutes. |
| **The rule comes last** | A JUMP page opens with the easiest version and a picture; the generalisation is printed at the *end*, after the child has seen the pattern. The rule card no longer greets him before he has done anything — it arrives as a green "So —" card once the work is done. |
| **The smallest possible first step** | JUMP's first exercise is usually a two-way choice on a picture ("is 27 closer to 20 or 30?"). Every topic now opens with two options, not four — and for adding and subtracting, the two options are the regrouped and the un-regrouped answer, over a base-ten picture. |
| **Prior knowledge is checked, not assumed** | Every JUMP lesson plan lists what the child must already be able to do. Today's lesson is the first topic *in teaching order* that is not secure, and if the thing underneath it is weak, that becomes the lesson instead — quietly, with no "locked" label. |

Topics are now ordered the way JUMP orders them — ×10 before ×6–×9, factors before
primes, fractions before decimals, brackets before order of operations — rather than
by how weak a score looks. Teaching out of order is how a child ends up with an A and
a failing state test at the same time.

**No JUMP material is reproduced here.** Their books informed the structure, the
sequence and the size of the steps; every question in this app is generated by its own
code.

### What got cut

| Before | After |
|---|---|
| Welcome: 4 cards, a 3-step setup | One card, one button |
| Home: coach, 3 daily quests, 2 realm cards, XP card, know board, storage banner | A greeting line, **one** Start button, two small links |
| 5 nav tabs | 3 — Today, Topics, Grown-ups |
| Lessons: 7 collapsible strands → skill page → practise (3 taps) | One flat list in teaching order, 1 tap |
| A 7-section rule card before the first question on a topic | One sentence, after the practice |
| Confidence tap on every question | Once a sitting, on the question where the scaffold comes off |
| Three buttons after every answer (Why / Next / Stop) | One — and on a right answer it moves on by itself after a beat |
| Result: 3 stat boxes, 3 paragraphs, a movement list | One line, one button |

Roughly **2 taps per question** instead of 4, and about a third of the words.

## What's in it

**Skill Scan** — a 14-question adaptive placement. Ten math questions on a ladder that
climbs from adding and subtracting, through what multiplication means and the times
tables, up to factors, primes and order of operations — stepping up on a right answer
and down on a wrong one. Then one short story. It cannot be failed.

**🧮 Math — 25 skills across the grade 4 and grade 5 standards**

| Strand | Grade | Skills |
|---|---|---|
| Whole numbers | 4 | Adding & subtracting (with regrouping), what × really means, word problems |
| Times tables & division | 4 | ×2–×5, ×6–×9, ×10–×12, division facts, tough division, missing factor |
| Bigger numbers | 4 | 2-digit × 1-digit, remainders, rounding & estimating |
| Number sense | 5 | Even & odd, factors & multiples, prime & composite, order of operations |
| Fractions & decimals | 5 | Reading fractions, adding fractions, decimal place value, comparing decimals (< > =), adding decimals, fractions ↔ decimals, **improper → mixed numbers** |
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

**Lessons tab** — all 32 skills grouped by strand and labelled Grade 4 catch-up or
Grade 5 now. Nothing is locked here, so tonight's homework is always one tap away:
open the topic, read the rule, then practise 8 or drill 15.

**Bolt, the coach** — every wrong answer choice is tagged with the misconception behind
it, so feedback names the trap: *"Added the bottom numbers — the denominator is the size
of the pieces"*, *"Miscounted the factors — 1 has only one factor, so it is neither"*,
*"Went straight left to right — × happens before + wherever it sits"*. 35 named traps.

**💬 Ask Bolt — a question box on every screen.** Adam asked for a chatbot, so there is
one, with one firm rule: it never invents an answer. It runs entirely in the browser —
no account, no API key, no network, nothing typed ever leaves the Chromebook — and what
it knows, it knows properly:

- **It works sums out, rather than printing answers.** `7 × 8` comes back as *"7 groups
  of 8. You know 5 × 8 = 40. 7 is two groups more, so add two more 8s: 40 + 16 = 56."*
  Division turns into *"what times 8 gives 56?"*. Subtraction names the regrouping.
  Several operations in one line gets the order of operations narrated a step at a time.
  Nothing is `eval`'d — the expression goes through a parser written for this.
- **It answers the number questions he actually types**: is 51 prime, factors of 24,
  is 34 even, 7/3 as a mixed number, 0.25 as a fraction, which is bigger 0.5 or 0.45,
  round 3.47 to the nearest tenth.
- **It explains any topic in the app** from that skill's rule card, then offers the
  steps, the worked example, the trap, or five questions to try.
- **It answers questions about him**: what to do next, how he is doing, what is on his
  Things I Know board, whether using the times table is cheating (it is not).
- **When it does not know, it says so** and offers to save the question for a grown-up.

Every question he asks is logged to **Progress → What Adam asked Bolt**, marked answered
or not. For a parent or a teacher that list is the most honest signal in the app: not a
score, but the sentences he typed when he was stuck.

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

**Improper fractions lean on what he already has.** 11/4 is taught as "how many
whole groups of 4 fit into 11" — which is `11 ÷ 4 = 2 r3`, a remainder question
he can already answer. The quotient is the whole number, the remainder is the new
top, the bottom never moves. At the concrete stage he drops loose pieces into
frames and watches wholes form; the frame that will not fill *is* the leftover.

**Prime and composite is a shape question.** The picture is every rectangle you
can build from the number: 7 makes only 1×7, so it is prime; 12 makes 1×12, 2×6
and 3×4, so it is not.

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

**Knowing that he knows.** After he picks an answer, and *before* the verdict,
the app asks how sure he is: **I know this / I think so / Just guessing**.
Certainty then scales what gets banked — a right answer he called a guess is not
yet knowing, and banks about half. Guessing is never punished; it simply does not
count as mastered, and the coach treats it warmly. Sure-and-wrong is recorded
separately, because a misconception he believes is the single most useful thing
a grown-up can see.

**Things I Know.** A topic earns a card on the Base screen only when he can do it
*and* has twice said "I know this" before seeing the answer. Progress reads as a
shelf of things he owns rather than a row of percentages.

**Two ways to practise a topic.** The short set mixes it with other kinds of
question — that is the default, and it is what stops autopilot. The **deep dive**
stays on one topic for ten and climbs the ladder: build it, see it drawn, do it in
symbols, then name which rule it was. Long and focused, without being ten of the
same sum.

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
the numbers behind it, a session log, everything he has asked Ask Bolt, and a
copy-out export.

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

Ask Bolt is local. There is no model call, no API key and no request — the questions
Adam types are answered by code in the page and stored only in his own browser.
