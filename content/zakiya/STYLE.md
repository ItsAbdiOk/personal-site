# Writing rules for Zakiya's study guide

Every subchapter file (`content/zakiya/<module>/<slug>.ts`, typed by `lib/zakiya/types.ts`) follows these.
Reader: a Year 12 student who is new to the topic. Aim for "I could explain this to a friend".

## 1. Ramp up: numbers → words → symbols → general formula
- Introduce every idea with a concrete example first. E.g. "A football is kicked at 20 m/s at 30°.
  17.3 m/s of that is sideways and 10 m/s is upwards." Only then: "In symbols, vₓ = u cos θ".
- Then give the plain-English rule, then the symbols, then the data-sheet general form.
- Never land the reader on bare notation. If a line is only symbols, the line before it must say in
  words (with numbers) what it means.

## 2. Each section opens with a `lead` block
- One sentence: where this section is going and why it matters. E.g.
  `{ type: "lead", body: "Split the launch speed into sideways and upwards parts, because each part obeys its own simple rule." }`

## 3. Explain every symbol, term and bit of working wherever it appears (every mention is tappable)
- Mark it inline as `{{key}}` or `{{key|display text}}` and add `explain[key] = { label, body }` to the subchapter.
  - `{{vx}}` shows `explain.vx.label`; `{{vx|sideways speed}}` shows the given text.
  - Every mention is tappable (Notes, questions, captions), so use the markup on every symbol, every
    time — she shouldn't have to hunt back for the first mention. Display text can't contain `{` or `}`.
- `body` is plain English, 1–2 short sentences, with a number where it helps:
  `"g cos 90°": "The gravity part that acts sideways. cos 90° = 0, so gravity adds nothing sideways."`
- Explain working too, not just letters: "u sin θ", "÷ 2", "why the time cancels".
- Keys are short and stable (`vx`, `theta`, `u-sin-theta`). Every key used must exist in `explain`.

## 4. Every equation in three layers
```ts
{ type: "equation", latexless: "vₓ = u cos θ",
  words: "Sideways speed = launch speed × cos(launch angle)",
  general: "v = u + at (with a = 0 sideways)", dataSheet: false }
```
- `latexless`: the symbol version (Unicode, no LaTeX).
- `words`: the same equation as a human sentence. Always present.
- `general`: the data-sheet form it comes from, when there is one. `dataSheet` = whether `latexless` itself is on the sheet.

## 5. Tone
- Non-verbose. Short sentences, one idea each. No padding ("It is important to note that…").
- Analogies only for abstract ideas, not for things a number already makes clear.
- Use [[term]] for glossary words and ==phrase== for wording a mark scheme credits.

## 6. Existing rules (unchanged)
- Tag every section and definition with its source: `both`, `spec-only` or `textbook-only`.
- `sayIt`, `examiners` and `tip` blocks only with evidence: `sayIt.source` and `examiners.cite` name a real
  mark scheme / examiners' report (series + paper + question). `tip` is our advice and must not claim to be the examiners'.
- Questions are original remixes, never copied. Set `basedOn` to the real paper they're modelled on.
  Past papers: link to them, never reproduce the question text.
- Flashcards: full natural questions, front ≤ 25 words, back ≤ 40 words, Unicode units (m s⁻², 30°, vₓ).
  Flashcards have no popovers: `{{key}}` becomes its label, so write fronts and backs that read fine without it.
- Equations and units in Unicode throughout (θ, ², ⁻¹, ×), never `^2` in equations.

## Diagrams: every number gets a picture
- Every worked example gets a diagram where **each number is drawn where it lives** (the height on the cliff, the speed on its arrow, the distance along the ground, the time on the path).
- Label quantities in three layers, example → plain words → exam term, e.g. `13.0 m/s · sideways speed · horizontal velocity vₓ`. On narrow diagrams, stack them on two lines, or put the plain + exam layers in a small key under the diagram.
- Unknowns being solved for appear as `?` on the "before" diagram and with their value on the answer.
