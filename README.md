# Titr8 (Nursing Calculator)

An elegant, high-precision, offline-first mobile application for practicing the arithmetic behind medication dosages, drip rates, flow rates, and weight-based pediatric dosing — with clean visual aesthetics and interactive formula math. Titr8 is study/educational-use only: it performs arithmetic on the values you enter and does not recommend medications or doses, assess safety, validate an order, or provide patient-care instructions.

Built using **React 19 (TypeScript)**, **Vite**, **Tailwind CSS v4**, `lucide-react` icons, and `motion` for animation.

---

## Features

- **Medication Dosage Calculator** — the standard Desired/Have × Volume formula, with automatic unit-mismatch detection (mg/mcg/g) and conversion.
- **IV Drip Rate (gtts/min)** — gravity infusion drop-rate calculation from volume, time, and drop factor.
- **IV Flow Rate & Duration** — mL/hour and infusion duration, with bidirectional input and one-tap handoff into the Drip Rate calculator.
- **Pediatric Weight-Based Dosing** — mg/kg math practice, presented as a plain arithmetic result.
- **Favorites** (Dosage & Pediatric calculators) — save, rename, update, and delete frequently-used drug/dose combinations and dosing guidelines for one-tap reuse.
- **100% offline** — every calculation runs on-device; no data is transmitted anywhere.

## Feature status

Shipped:

- Medication Dosage Calculator, IV Drip Rate, IV Flow Rate & Duration, Pediatric Weight-Based Dosing
- Favorites with full CRUD (Dosage + Pediatric)
- 100% offline capability with formula disclosure so every result can be double-checked by hand

Planned (not in the shipped UI):

- **iOS Widget & Quick-Access** — a home-screen-widget-style 1-tap launch experience. A visual mockup of this existed earlier in the app (`WidgetSimulator`) but was just a styled preview inside the web app, not a working widget — a real version requires a native iOS **WidgetKit** extension (Swift/SwiftUI, built in Xcode with its own App Group data-sharing setup), which this codebase can't produce on its own. Removed from the shipped nav until that native work exists.
- **Custom Formula Customizer** — toggle specialized formulas (e.g. BSA, Parkland, or pediatric rule-of-thumb limits) on/off.

Open points:

- iOS is packaged via Capacitor (see below) and v1.0 has been submitted for App Store review. Android is packaged too (see below) — first Play Console submission not yet made.

## Brand assets

- **Titr8 app icon** — `assets/nurse-calc-icon.svg`, the **product** mark (a measured medication droplet cradling a clinical care cross, teal). This is what's used in the launch splash.
- Akky is the parent company. Its corporate mark is intentionally **not** used inside the product UI or splash — product surfaces stay teal-only; reach for the Akky logo only in company/marketing contexts, not calculator screens.
- Body/UI type is **Inter**; numerics (every dose, result, and equation) are set in **JetBrains Mono** for a deliberate safety signal. Both are self-hosted via `@fontsource` (no Google Fonts request, even on first load with no network).

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to use the app. `npm run build` produces a production bundle in `dist/`; `npm run lint` type-checks the project with `tsc --noEmit`.

## iOS app

The app ships natively on iOS via [Capacitor](https://capacitorjs.com/), wrapping the same React build in a WKWebView shell (`ios/App` — Xcode project `App.xcodeproj`, using Capacitor's Swift Package Manager integration, no CocoaPods or `.xcworkspace`).

- **Bundle ID**: `com.akky.titr8ios`
- **Display name**: Titr8
- **Deployment target**: iOS 17.0
- **Signing**: Automatic, Apple Developer team "Akky Technologies FZCO" (`GVRN83LASR`)
- **Status**: v1.0 submitted for App Store review. Full prepared listing copy/metadata lives in `store-assets/submission-package.html` (gitignored, local reference only).

### Building & archiving

1. `npm run build`, then `npx cap sync ios` to copy the web build into the native shell.
2. Open `ios/App/App.xcodeproj` in Xcode — **not** a `.xcworkspace`.
3. **Before archiving, make sure the active scheme is "App", not "CapApp-SPM"** (the scheme selector is in the toolbar next to Run/Stop). `CapApp-SPM` is Capacitor's bundled Swift package, not the app — archiving it produces a useless artifact and Organizer won't show a real app archive.
4. Destination: "Any iOS Device (arm64)" → **Product → Archive** → Organizer → **Distribute App → App Store Connect → Upload**.

### Bundle ID history — don't reuse `com.akky.titr8`

The original bundle ID was `com.akky.titr8`. A manually-created App Store Connect app record was accidentally registered with a typo (`com.akky.tritr8`) instead of matching it. Deleting that mistaken record did **not** free `com.akky.titr8` back up — Apple permanently blocks a Bundle ID from being attached to any *new* App Store Connect app once it has ever been attached to one, even a since-deleted one. The project moved to `com.akky.titr8ios` rather than fight that restriction. **Never try to reuse `com.akky.titr8`** — Apple's API will reject app creation with a "Bundle ID already used" error every time, with no way to clear it short of a support ticket.

### Export compliance

`Info.plist` sets `ITSAppUsesNonExemptEncryption = false` — Titr8 makes no network calls and implements no cryptography, so this skips Apple's encryption questionnaire on every future build upload.

## Android app

The app also ships natively on Android via [Capacitor](https://capacitorjs.com/), wrapping the same React build in a WebView shell (`android/` — Gradle project, `app` module).

- **Application ID**: `com.akky.titr8android`
- **Display name**: Titr8
- **Signing**: release builds are signed via `android/keystore.properties` (gitignored — copy `keystore.properties.example` and fill in your own upload keystore; without it, release builds fall back to unsigned).
- **Status**: signed release `.aab`/`.apk` built locally; not yet submitted to Play Console. Full publishing guide, listing copy, and screenshots live in `store-assets/android-playstore-guide.md` / `.html` and `store-assets/android-screenshots/` (all gitignored, local reference only).

### Building

1. `npm run build`, then `npx cap sync android` to copy the web build into the native shell.
2. `cd android && ./gradlew bundleRelease assembleRelease` (or `assembleDebug` for an unsigned debug build). If the system has no standalone JRE, point `JAVA_HOME` at the JDK bundled inside Android Studio, e.g. `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`.
3. Outputs land in `android/app/build/outputs/bundle/release/app-release.aab` (Play Console upload) and `android/app/build/outputs/apk/release/app-release.apk` (sideloading/testing).

## Legal & support pages (GitHub Pages)

App Store submission requires a live Privacy Policy URL and Support URL. These are **not** part of the React app — they're standalone static HTML pages, hosted separately:

- **Source**: `docs/index.html`, `docs/privacy-policy.html`, `docs/support.html` — plain self-contained HTML/CSS, no build step, no dependency on the React app.
- **Hosting**: GitHub Pages, configured in this repo's GitHub Settings → Pages → Source: `main` branch, `/docs` folder.
- **Custom domain**: `titr8.akky.tech`, set via the `docs/CNAME` file (contents: `titr8.akky.tech`) plus a DNS CNAME record at the domain registrar: `titr8.akky.tech → AkkyTechnologies.github.io`. Both pieces (the `CNAME` file *and* the DNS record) need to stay in place for the custom domain to keep resolving.
- **Live URLs**: `https://titr8.akky.tech/privacy-policy.html` and `https://titr8.akky.tech/support.html` — what's entered in App Store Connect's Privacy Policy URL / Support URL fields.

**To update this content**: edit the files in `docs/` directly and push to `main` — GitHub Pages redeploys automatically within a minute or two. (`store-assets/legal/privacy-policy.html` and `support.html` are the original drafts these were copied from — gitignored, local reference only, and **not** what's actually served live. If you edit one, mirror the change into `docs/`, or just edit `docs/` directly going forward.)

**Why not Google Sites**: the original plan was hosting these via Google Sites (`sites.google.com/akky.tech/titr8`), embedding the custom HTML pages. Google Sites' "Embed" feature wraps custom HTML in a fixed-height iframe inside its own page chrome, which produced broken double-scroll rendering and mismatched theming — it's built for widgets (YouTube, Maps), not full standalone pages. GitHub Pages serves the pages with no wrapper, rendering exactly as designed. Google Sites was dropped entirely for this purpose.

## Educational-use notes

- **Study use only** — Titr8 performs arithmetic on the values you enter. It does not recommend a medication or dose, assess safety, validate an order, or provide patient-care instructions, and it is not a substitute for clinical judgment, a qualified physician or pharmacist, product labeling, or facility policy. A first-launch disclaimer and an always-available About/Educational-use screen (`src/components/StudyUseDisclaimer.tsx`, `src/components/AboutOverlay.tsx`) state this in-app.
- **Interactive formula disclosure** — every calculator has a toggleable `(i)` button showing the exact underlying formula and equation, so results can be checked by hand.
- **No data collection** — all math runs locally on-device; nothing is sent to a server.
