# 0001. Independent calculation modules, no shared cross-calculator conversion module

Date: 2026-07-17
Status: Accepted

## Context

The app's core dosage/rate arithmetic (Dosage, Drip Rate, Flow Rate, Pediatric) was buried inline inside the four calculator components, computed as plain variables recomputed on every render, with no unit tests anywhere in the repo. `DosageCalculator.tsx` additionally had its mg/mcg/g unit-conversion table written out twice, independently — once in a `useEffect` building a unit-mismatch preview message, once in the render-time volume calculation. The two copies agreed at the time, but nothing enforced that; a future edit to add a unit pair could update one and miss the other.

An architecture review (`/improve-codebase-architecture`) surfaced this as a deepening candidate: extract each calculator's math behind a small, pure, testable interface (see `/codebase-design` glossary — module, interface, seam).

## Decision

Extract one calculation module per calculator into `src/calculations/` — `dosage.ts`, `dripRate.ts`, `flowRate.ts`, `pediatric.ts` — each a pure function (or small set of them) taking already-parsed numbers and returning a structured result object. No shared cross-calculator module (e.g. a general `unitConversion.ts`) was introduced, even though Dosage's mg/mcg/g table is conceptually "unit conversion" and could theoretically apply elsewhere.

Specifically:

- The mg/mcg/g conversion table now lives once, inside `dosage.ts`, and both of Dosage's former call sites (the mismatch-preview message and the render-time calculation) call the same `convertMassUnit()` function.
- Parsing (`parseFloat(x) || 0`, Pediatric's `parseInt(x) || 1`) stays in the components, unchanged. The calculation modules accept numbers, not raw form-field strings — parsing untrusted input and computing a formula are different jobs, and folding both into one interface would make it do two unrelated things.
- Each module's scope was preserved exactly as it was before extraction — this was a refactor, not a formula or coverage change. Dosage's conversion table still only covers mass units (mcg/mg/g); picking "units", "mL", or "mEq" against a mismatched unit still produces no conversion. Widening that coverage is a separate, later decision.
- Each function returns a structured result (e.g. `{ volume, effectiveDose, wasConverted }` for Dosage) rather than a bare number, so the formula-disclosure UI can render the converted-value/equation line without re-deriving the conversion itself.
- Vitest was introduced (new dependency + `vitest.config.ts`, `npm run test`) specifically to write characterization tests pinning the pre-extraction behavior before the code moved, so the tests prove the refactor is behavior-identical.

## Why not one shared unit-conversion module

Only Dosage needs mass-unit conversion today. Drip Rate, Flow Rate, and Pediatric each have their own formula with no overlapping math (Pediatric's weight lb→kg conversion is a different, single-purpose helper, not a generalization of Dosage's mg/mcg/g table). Per the `/codebase-design` principle "one adapter means a hypothetical seam, two adapters means a real one" — introducing a shared module for a concern only one caller has would be designing for a seam nothing currently varies across. If a second calculator later needs mass-unit conversion, that's when `convertMassUnit` (already exported from `dosage.ts`) is worth promoting to a shared module — at that point there are two real call sites to design the shared interface around, not a guess.

## Consequences

- One conversion table, not two that can silently disagree.
- The four formulas are unit-testable for the first time; `src/calculations/*.test.ts` pins today's behavior.
- The numeric-parsing inconsistency across calculators (`|| 0` vs Pediatric's `|| 1` fallback, `parseFloat` vs `parseInt`) is untouched by this decision — it remains open, tracked as a separate future candidate ("deepen numeric input parsing," rated "Worth exploring" in the architecture review), not resolved here.
- If a future calculator needs mass-unit conversion, revisit this ADR rather than re-deriving the "shared vs. per-calculator" question from scratch.
