# Nurse Calc (Nursing Calculator)

An elegant, high-precision, offline-first mobile application for nurses, practitioners, and clinical students to calculate medication dosages, drip rates, flow rates, and weight-based pediatric dosing — with clean visual aesthetics, safe adult dose capping, and interactive formula math.

Built using **React 19 (TypeScript)**, **Vite**, **Tailwind CSS v4**, `lucide-react` icons, and `motion` for animation.

---

## Features

- **Medication Dosage Calculator** — the standard Desired/Have × Volume formula, with automatic unit-mismatch detection (mg/mcg/g) and conversion.
- **IV Drip Rate (gtts/min)** — gravity infusion drop-rate calculation from volume, time, and drop factor.
- **IV Flow Rate & Duration** — mL/hour and infusion duration, with bidirectional input and one-tap handoff into the Drip Rate calculator.
- **Pediatric Weight-Based Dosing** — mg/kg dosing with adult safety-cap warnings.
- **Favorites** (Dosage & Pediatric calculators) — save, rename, update, and delete frequently-used drug/dose combinations and dosing guidelines for one-tap reuse.
- **100% offline** — every calculation runs on-device; no patient data is transmitted anywhere.

## Navigation & UX

- **Launch splash** — the Nurse Calc product icon morphs from grayscale into full teal on every launch (~1.4s), tap anywhere to skip.
- **Bottom tab bar** — all 4 calculators are always visible (no scrolling), with a clear active-state indicator, matching native iOS navigation conventions.
- **Auto-resume** — the app reopens on whichever calculator was open last, rather than always landing on the dashboard.
- **Favorites carousel** — a fixed-height, center-emphasis horizontal snap-scroll picker. Tapping any visible card (center or side) loads it immediately. An "Edit" toggle reveals per-card rename and delete. Height stays constant no matter how many favorites are saved, so it never crowds out the calculator below it.

## Feature status

Shipped:

- Medication Dosage Calculator, IV Drip Rate, IV Flow Rate & Duration, Pediatric Weight-Based Dosing
- Favorites with full CRUD (Dosage + Pediatric)
- 100% offline capability with formula disclosure for double-checked clinical accuracy

Planned (not in the shipped UI):

- **iOS Widget & Quick-Access** — a home-screen-widget-style 1-tap launch experience. A visual mockup of this existed earlier in the app (`WidgetSimulator`) but was just a styled preview inside the web app, not a working widget — a real version requires a native iOS **WidgetKit** extension (Swift/SwiftUI, built in Xcode with its own App Group data-sharing setup), which this codebase can't produce on its own. Removed from the shipped nav until that native work exists.
- **Custom Formula Customizer** — toggle specialized formulas (e.g. BSA, Parkland, or pediatric rule-of-thumb limits) on/off.

Open points:

- Fonts (Inter, JetBrains Mono) are currently loaded from Google Fonts — self-hosting them would make the "100% offline" claim literally true even with no network at first load.
- No native iOS/Android packaging yet (no Capacitor dependency or `ios/`/`android/` project); the app currently ships as a web app only.

## Brand assets

- **Nurse Calc app icon** — `assets/nurse-calc-icon.svg`, the **product** mark (a measured medication droplet cradling a clinical care cross, teal). This is what's used in the launch splash.
- Akky is the parent company. Its corporate mark is intentionally **not** used inside the product UI or splash — product surfaces stay teal-only; reach for the Akky logo only in company/marketing contexts, not calculator screens.
- Body/UI type is **Inter**; numerics (every dose, result, and equation) are set in **JetBrains Mono** for a deliberate safety signal. Both are loaded from Google Fonts.

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to use the app. `npm run build` produces a production bundle in `dist/`; `npm run lint` type-checks the project with `tsc --noEmit`.

## Medical safety notes

- **Interactive formula disclosure** — every calculator has a toggleable `(i)` button showing the exact underlying formula and equation.
- **Adult dosage capping** — pediatric weight-based calculations flag doses that exceed the recommended adult maximum.
- **No data collection** — all math runs locally on-device; nothing is sent to a server.
