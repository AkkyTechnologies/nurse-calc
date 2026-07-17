# CONTEXT.md

Domain glossary for Titr8 (nurse-calc). Read this alongside `CLAUDE.md` (tech stack, conventions, working style) — this file exists to name the concepts the code and any future design work should agree on, so "the app" and "the code" don't quietly drift apart again. Started 2026-07-17 as part of the calculation-module extraction; add to it as new terms get sharpened, don't let it go stale.

## Architecture vocabulary

This project uses the `/codebase-design` glossary (module, interface, depth, seam, adapter) for any architecture discussion. See `docs/adr/` for recorded decisions.

**Calculation module** — a pure function (or small set of them) that takes already-parsed numeric inputs and returns a structured result, with no DOM, no `useState`, no parsing, and no formatting. Lives in `src/calculations/`, one file per calculator, each independently testable via Vitest with a co-located `*.test.ts`. A calculator component owns parsing raw form-field strings into numbers and formatting results for display; the calculation module owns only the arithmetic between those two steps. See `docs/adr/0001-independent-calculation-modules.md` for why these modules aren't shared across calculators even where a formula looks similar.

## Calculator domain terms

**Dosage** (`DosageCalculator` / `src/calculations/dosage.ts`) — Desired dose ÷ Have dose × Quantity. *Desired Dose* is the prescribed amount to give; *Have Dose* is the stock concentration/strength on hand; *Quantity* is the vehicle amount (mL, tablet, etc.) the Have Dose is expressed per. Supports automatic unit conversion between mg/mcg/g when Desired and Have units differ — this is the app's only unit-conversion table, and it deliberately covers mass units only (not "units", "mL", or "mEq", which the unit dropdowns also offer but which have no defined conversion between each other).

**Drip Rate** (`DripRateCalculator` / `src/calculations/dripRate.ts`) — gravity IV infusion rate in gtts/min (drops per minute), computed from total Volume, infusion time (hours + minutes), and the tubing's Drop Factor (gtts/mL, e.g. 10/15/20 "macro" or 60 "micro"). The on-screen drip-chamber animation is a labeled visual demo, not a real-time infusion guide — see `CLAUDE.md`.

**Flow Rate & Duration** (`FlowRateCalculator` / `src/calculations/flowRate.ts`) — two independent, bidirectional formulas sharing one screen: *Rate* mode computes mL/hr from a Volume and a delivery time; *Duration* mode computes delivery time (hours + minutes) from a Volume and a target Rate. These are inverses of each other but implemented as two separate calculation functions, not one generic solver — each mode's inputs and outputs are shaped differently enough (Duration mode returns a split hours/minutes pair, not a decimal) that a shared abstraction would be a shallow wrapper, not a deepening.

**Pediatric Weight-Based Dosing** (`PediatricCalculator` / `src/calculations/pediatric.ts`) — mg/kg arithmetic. *Weight* converts to kilograms first (lb ÷ 2.20462) if entered in pounds. *Dosage Multiplier* is the mg/kg (or mg/kg/day) rate. *Dosing Type* toggles whether the multiplier is a "Per Dose" or "Per Day" figure; when "Per Day," *Divided By* splits the daily total into that many single doses. The result is the literal computed value — never clamped to any adult or safety cap; see the Educational-use notes in `README.md`.

**Favorites / Presets** — user-saved input sets for one-tap reuse, currently on Dosage and Pediatric only (Drip Rate and Flow Rate deliberately don't have them — a scope decision, not an oversight; see `CLAUDE.md`). Backed by the shared `useFavorites` hook (generic CRUD + `localStorage`).

**Study-use-only math** — every calculator performs arithmetic on entered values only. It does not recommend a dose, assess safety, validate a clinical order, or substitute for a clinician's judgment. This framing applies to every calculation module in `src/calculations/` — none of them are, or should become, a safety-check or dose-validation layer.
