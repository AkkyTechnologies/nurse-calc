# Nurse Calc (Nursing Calculator)

An elegant, high-precision, offline-first mobile application designed for nurses, practitioners, and clinical students to calculate medication dosages, drip rates, flow rates, and weight-based pediatric dosing with clean visual aesthetics, safe adult dose capping, and interactive formula math.

Built using **React (TypeScript)**, **Vite**, **Tailwind CSS**, and **Capacitor**.

---

## 🚀 1. Strategic Architecture: Capacitor vs. Flutter

Since you are preparing to compile this app on your upcoming **MacBook Pro**, here is a deep architectural breakdown of why the current **React + Vite + Capacitor** tech stack is highly advantageous compared to **Flutter**, particularly for a medical/utility app.

### Key Advantages of React + Capacitor over Flutter

| Feature | React + Vite + Capacitor (Current Stack) | Flutter (Dart) |
| :--- | :--- | :--- |
| **Language & Ecosystem** | Standard **TypeScript / React**. Access to the largest ecosystem of libraries, components, and standard web tools. | **Dart**. A specialized language with a separate, smaller ecosystem of custom widgets. |
| **Development Velocity** | **Vite Engine**. Instantaneous hot reloading in any standard web browser. Extremely fast, lightweight feedback loops. | **Flutter Compiler**. Highly optimized, but compiles to a device or simulator. Testing in a web browser can be heavy. |
| **Cross-Platform Portability** | **100% Shared Web Base**. Run as a standard PWA, web application, iOS native app, or Android native app using a single, unified codebase. | Compiles to native pixels via its own rendering engine. Web deployment is historically heavier and lacks standard SEO/browser compatibility. |
| **App Size & Resources** | **Super Lightweight**. Leverages the device's native system WebView (WebKit on iOS, Chrome on Android). Starts up instantly; small package size. | Bundles the entire Flutter rendering engine inside your binary. Minimum app size starts around ~15-20MB. |
| **Styling & UI Freedom** | **Tailwind CSS**. Infinite flexibility using modern CSS utility classes. Pixel-perfect layout adjustments without nested widget trees. | Deeply nested widget hierarchies (`Column(children: [Padding(child: ...)])`), which can quickly become complex to read and write. |
| **Universal Compilation** | **Build Anywhere**. You can code and test 95% of your app on a standard Windows PC or Linux machine using simple web tools, compiling only the final native bundles on your MacBook Pro or Cloud service. | Highly coupled to native compilation loops, making rapid testing on mismatched host machines (e.g., Windows targeting iOS) more complex. |

### Summary for Your App
For **Nurse Calc**, which is a high-utility, form-based app requiring extreme responsiveness, pristine typography, and fast formulas:
* **Capacitor** is the superior choice. It allows you to build the core app in standard web technologies (React) and seamlessly deploy it to the web, iOS, and Android.
* Because the app is **100% offline-first** and runs entirely locally, standard modern web views are incredibly efficient and consume negligible device memory.

---

## 📁 2. Step-by-Step GitHub Setup Guide

Follow these commands to push this code repository from your computer up to a fresh repository on **GitHub**:

### Step 2.1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and log in.
2. Click the green **New** button to create a repository.
3. Set the repository name to `nurse-calc`.
4. Keep it **Public** or **Private**, but **DO NOT** select "Add a README file", "Add .gitignore", or "Choose a license" (we already have pristine files prepared here).
5. Click **Create repository**.

### Step 2.2: Initialize and Push from Your Computer
Open your command prompt or terminal in this project's root folder and run:

```bash
# 1. Initialize local Git repository
git init -b main

# 2. Stage all project files (our .gitignore handles ignoring unnecessary files)
git add .

# 3. Create your first commit
git commit -m "initial: elegant nursing calculator with high-precision formulas"

# 4. Link your local project to your remote GitHub repository
# Replace 'YOUR_USERNAME' with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/nurse-calc.git

# 5. Push your code to GitHub
git push -u origin main
```

---

## 🍏 3. Compilation Guide on Your MacBook Pro

Once you receive your new **MacBook Pro**, setting up your development environment to compile native `.ipa` (iOS) and `.apk` (Android) binaries locally is simple.

### Step 3.1: Install macOS Prerequisites
Open the terminal on your MacBook Pro and run:

```bash
# 1. Install Homebrew (macOS package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js (v18+)
brew install node

# 3. Install Cocoapods (essential for native iOS dependencies)
brew install cocoapods
```

### Step 3.2: Install Xcode (for iOS Compilation)
1. Open the Mac App Store and download **Xcode** (free).
2. Once installed, open Xcode, accept the terms, and let it download the iOS simulators.
3. Install Xcode Command Line Tools by running this in terminal:
   ```bash
   xcode-select --install
   ```

### Step 3.3: Local Build & Sync Workflow
Clone your repository onto your MacBook Pro and run:

```bash
# 1. Install dependencies
npm install

# 2. Build the production React assets
npm run build

# 3. Add Capacitor platforms (if not already added)
npx cap add ios
npx cap add android

# 4. Sync web assets into the native iOS/Android shell projects
npx cap sync
```

### Step 3.4: Running and Compiling the iOS App
To open your native project in Xcode:
```bash
npx cap open ios
```
1. Xcode will launch automatically with your project open.
2. In the top toolbar, select a simulator (e.g., iPhone 15) or your connected physical iPhone.
3. Click the **Play** button (or press `Cmd + R`) to run the app in the simulator.
4. **To Publish:**
   * Go to Xcode settings, click **Accounts**, and sign in with your Apple ID (linked to your Developer Account).
   * In the left panel, select the root `App` target.
   * Under **Signing & Capabilities**, select your Team.
   * Change your target device to **Any iOS Device (arm64)**.
   * In the top menu, select **Product > Archive**.
   * Click **Distribute App** to upload it directly to TestFlight / App Store Connect.

### Step 3.5: Running and Compiling the Android App (Optional)
To set up local Android compiling on macOS:
1. Download and install [Android Studio](https://developer.android.com/studio).
2. Install the **Android SDK** and create a Virtual Device (Emulator) inside Android Studio.
3. Open the Android project from your terminal:
   ```bash
   npx cap open android
   ```
4. Click the **Run** button inside Android Studio to deploy to your emulator or physical Android device.

---

## 💻 4. Running & Testing on a Windows PC

If you need to code or test on your Windows computer, you can run the entire workspace locally as a high-performance web application:

```bash
# Install local packages
npm install

# Run Vite local development server
npm run dev
```
Open `http://localhost:3000` on any browser to test and refine the React app.

---

## 🛡️ 5. Medical Safety & Store Review Strategy

Because the App Store has strict review policies for medical tools, we have already built-in key features to pass review on the first attempt:
* **Interactive Formula Disclosure:** Every calculator screen includes a toggleable `(i)` button that shows the exact underlying clinical formula and active equation. This transparency is highly valued by Apple medical reviewers.
* **Adult Dosage Capping:** Pediatric weight-based calculations include automatic checks and clear warnings when a dose exceeds the maximum recommended adult capacity, preventing clinical user error.
* **100% HIPAA Compliance:** The app performs all calculations locally on-device. Since no patient identifiers or calculations are transmitted to external servers, you can state that **No User Data is Collected**, which speeds up the privacy review process.
