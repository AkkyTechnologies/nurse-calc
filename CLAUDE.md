# CLAUDE.md

Guidance for Claude Code working in this repository. See also `CONTEXT.md` for domain vocabulary and `docs/adr/` for recorded architecture decisions — check both before re-deriving a design question that may already have an answer.

## What this is

Titr8 — an offline-first nursing calculator (medication dosage, IV drip rate, IV flow rate, weight-based pediatric dosing) built by Christian (Akky) as a personal project for his girlfriend Ruth, a nurse. It's a single-page React app styled and behaving like a native iOS app, rendered inside a fixed-size simulated iPhone frame (currently 393×852 — the iPhone 16's logical point resolution, chosen deliberately as a realistic non-Pro device).

**Current state: shipping natively.** The app is wrapped via Capacitor and built as real `ios/` and `android/` Xcode/Gradle projects (bundle id `com.akky.titr8ios`, iOS 17.0 deployment target) — see `README.md`'s "iOS app" section for build/signing/submission details. The "Next: first iOS build" section below is now historical context, not open work.

## Tech stack

- React 19 + TypeScript, Vite 6, Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css` — there is no `tailwind.config.js`)
- `lucide-react` for icons, `motion` (Framer Motion) for animation
- Fonts are self-hosted via `@fontsource` (Inter, JetBrains Mono) — no network font requests, which matters for the "100% offline" claim
- No backend, no API calls. All state beyond component state lives in `localStorage`; everything computes client-side.

## Architecture

- `src/App.tsx` — the whole app shell: one fixed-size simulated iPhone frame containing a status bar, a title bar (tap the app icon to return to the dashboard; long-press it for the Ruth easter egg), the active calculator, a bottom tab bar, and a home indicator. `activeTab` (a `CalculatorType`) drives which screen renders and persists to `localStorage` (`nurse_calc_last_tab`) so the app reopens where the user left off.
- `src/components/BottomTabBar.tsx` — 4 tabs: Dosage, Drip Rate, Flow Rate, Pediatric. There's a 5th internal screen, `'planner'`, the dashboard/welcome screen — reachable via the home indicator or the title-bar icon, not a tab.
- Calculators: `DosageCalculator.tsx`, `DripRateCalculator.tsx`, `FlowRateCalculator.tsx`, `PediatricCalculator.tsx` — each self-contained, no shared calculator state. `DripRateCalculator` has a tap-to-magnify realistic drip-chamber visualization, presented as a labeled demo, not a real-time infusion guide.
- `src/calculations/` — the pure arithmetic behind each calculator (`dosage.ts`, `dripRate.ts`, `flowRate.ts`, `pediatric.ts`), one module per calculator, each with a co-located `*.test.ts`. Components own parsing raw input strings and formatting results for display; these modules own only the formula in between. See `CONTEXT.md` ("Calculation module") and `docs/adr/0001-independent-calculation-modules.md` for why these aren't shared across calculators. Run `npm run test` (Vitest) to check them.
- `src/hooks/useFavorites.ts` — generic CRUD + `localStorage` hook (add/update/rename/remove), shared by any screen with a favorites list. Currently used by Dosage (`nurse_calc_presets`) and Pediatric (`nurse_calc_pediatric_presets`). Drip Rate and Flow Rate deliberately do **not** have user-editable favorites (just fixed quick-select buttons) — that's a scope decision, not an oversight; don't "fix" it without asking.
- `src/components/PresetCarousel.tsx` — generic (`<T extends FavoriteItem>`) center-emphasis snap-scroll carousel, fixed height regardless of item count, used by both favorites screens. Tap any visible card to load it immediately; an "Edit" toggle reveals rename/delete per card.
- `src/components/FavoriteNameForm.tsx` — shared inline add/rename form for favorites.
- `src/components/SplashScreen.tsx` — launch splash (product icon grayscale→teal morph, wordmark, then an Akky corporate signature band). This is the **one** product surface where the Akky corporate mark is allowed to appear — read the brand note at the top of that file before touching branding anywhere else. Auto-dismisses at 1.9s, tap anywhere to skip.
- `src/components/RuthEasterEgg.tsx` — a personal dedication triggered by a long-press on the dashboard's app icon. Leave the message and behavior as-is unless Christian asks to change it.
- `src/types.ts` / `src/presetsData.ts` — shared types (`CalculatorType`, `FavoriteItem`, `MedicationPreset`, `PediatricPreset`) and seed data for the two favorites lists.

## Conventions

- Tailwind utility classes inline — no CSS modules, no styled-components. Brand color is `teal-600` (`#0d9488`); neutrals are the `slate` scale.
- Every number, unit, and formula is set in `font-mono` (JetBrains Mono) — a deliberate clinical-safety signal, not just style. Preserve this in any new calculator UI.
- Field/result labels follow one pattern everywhere: uppercase, wide tracking, small (`text-[10px] uppercase tracking-widest`).
- Most interactive elements carry an `id="..."` — used for browser-based verification during development (Claude Preview tooling). Keep adding them on new interactive elements.
- Every calculator has a toggleable formula-disclosure `(i)` button — required for any new calculator (see "Medical safety notes" in README.md).

## Known cruft (leftover from the original AI Studio scaffold — safe to ignore or clean up opportunistically)

- `package.json` lists `@google/genai`, `express`, `dotenv`, `tsx` — none are imported anywhere in `src/`. Dead weight from the original scaffold.
- `index.html`'s `<title>` still reads "My Google AI Studio App".
- `.env.example` documents a `GEMINI_API_KEY` / `APP_URL` the app doesn't use.

## Commands

- `npm install`
- `npm run dev` — Vite dev server (see `.claude/launch.json` for the Claude Preview launch config; port auto-picked)
- `npm run build` — production build to `dist/`
- `npm run lint` — `tsc --noEmit` (no eslint)
- `npm run test` — Vitest, currently covering `src/calculations/*` only (no component/UI tests yet)

## Working style (Christian's standing preferences)

- **Always plan first, settle every open decision explicitly, then implement.** Don't start writing code on a multi-step or ambiguous request without confirming the approach — ask, don't assume.
- Verify UI/UX changes by actually running the dev server and clicking through the app, not just by reading code — this app is visual and interaction-heavy, and "it type-checks" is not the same as "it works."
- Keep scope disciplined: don't extend a change to screens or features beyond what's asked, even when a "consistency" argument exists (e.g. Drip Rate/Flow Rate intentionally don't have favorites — see above).
- Commit messages should explain *why*, not just *what*; this repo's history is a good style reference.

## Next: first iOS build

The app is 100% web today. Rough shape of the work ahead — **confirm the specifics below with Christian before executing anything; they're open decisions, not settled defaults**:

1. **Mac prerequisites**: Xcode (App Store) + `xcode-select --install`; CocoaPods (`brew install cocoapods` or `sudo gem install cocoapods`); Node/npm (no version pinned in the repo — use whatever's on the machine, note it if it causes friction).
2. **Add Capacitor**: `npm i @capacitor/core @capacitor/cli @capacitor/ios`, then `npx cap init` — needs an app display name and a bundle identifier (e.g. `com.akky.titr8`; not yet decided).
3. **Point Capacitor at the build**: `webDir: 'dist'` in `capacitor.config.ts`; always `npm run build` before `npx cap sync`.
4. **App icon**: `assets/nurse-calc-icon.svg` is the only icon asset today. iOS needs a full-bleed 1024×1024 PNG (no pre-rounded corners — iOS applies its own mask) for Xcode's single-size App Icon slot. This needs to be exported/rasterized from the SVG, or redesigned specifically for iOS.
5. `npx cap add ios` → `npx cap sync` → `npx cap open ios` — first run in the Xcode Simulator.
6. Sanity-check offline behavior inside the native WKWebView shell — fonts are already self-hosted so this should just work, but verify; it's the app's core selling point.
7. Minimum iOS deployment target isn't decided yet either — ask.
