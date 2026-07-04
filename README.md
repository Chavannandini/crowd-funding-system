# ⚡ FundVerse Pro — India's UPI Crowdfunding Platform

![FundVerse](https://img.shields.io/badge/Platform-India%20%F0%9F%87%AE%F0%9F%87%B3-blue)
![UPI](https://img.shields.io/badge/Payments-UPI%20%7C%20PhonePe%20%7C%20GPay-purple)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)

> India-first crowdfunding platform with real UPI QR payments, 3D dashboard,
> 43 Indian banks, SHA-256 security, and 12-platform social sharing.
> **No server required. Deploy in under 2 minutes.**

---

## 📁 Project Structure

```
fundverse/
│
├── index.html          ← Main entry point (open this in browser)
├── manifest.json       ← PWA manifest (Add to Home Screen)
├── netlify.toml        ← Deploy on Netlify (drag & drop)
├── vercel.json         ← Deploy on Vercel
├── _headers            ← GitHub Pages headers
├── .gitignore          ← Git ignore rules
│
├── css/
│   └── style.css       ← All styles (3D cards, UPI modal, dashboard)
│
├── js/
│   ├── app.js          ← Main application logic (~90KB)
│   └── qrcode.js       ← QR code generator (Kazuhiko Arase, MIT, ~58KB)
│
└── assets/
    └── favicon.svg     ← App icon
```

---

## 🚀 Deploy in 2 Minutes

### Option 1 — Netlify (Recommended, Free)

1. Go to **https://netlify.com** → Sign up free
2. Click **"Add new site"** → **"Deploy manually"**
3. **Drag and drop** the entire `fundverse/` folder onto the page
4. Your site is live! Copy the URL (e.g. `https://fundverse-abc123.netlify.app`)

**Or via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --dir=. --prod
```

---

### Option 2 — Vercel (Free)

1. Go to **https://vercel.com** → Sign up free
2. Install Vercel CLI:
```bash
npm install -g vercel
```
3. Run inside the `fundverse/` folder:
```bash
vercel --prod
```
4. Your site is live instantly with a URL like `https://fundverse.vercel.app`

---

### Option 3 — GitHub Pages (Free)

1. Create a new repo on **https://github.com**
2. Upload all project files to the repo
3. Go to **Settings → Pages → Source → main branch → root folder**
4. Click **Save** — your site is live at `https://yourusername.github.io/fundverse`

**Or via Git:**
```bash
git init
git add .
git commit -m "FundVerse Pro - Initial deploy"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/fundverse.git
git push -u origin main
```
Then enable GitHub Pages in repo Settings.

---

### Option 4 — Local (No Internet Needed)

Just open `index.html` directly in your browser:
```bash
# On Windows - double click index.html
# On Mac
open index.html
# On Linux
xdg-open index.html
```

---

## 🔑 Demo Login

| Role   | Email           | Password  |
|--------|-----------------|-----------|
| Admin  | admin@fv.io     | admin123  |
| Backer | backer@fv.io    | backer123 |

---

## ⚙️ Change Your UPI ID

Open `js/app.js` and find line with `MY_UPI` (around line 15):

```javascript
var MY_UPI = '8977980147@fam';
```

Change it to your own UPI ID:
```javascript
var MY_UPI = 'yourname@oksbi';      // SBI
var MY_UPI = '9876543210@ybl';      // Yes Bank
var MY_UPI = 'yourname@okhdfc';     // HDFC
var MY_UPI = 'yourname@paytm';      // Paytm
```

Save and redeploy — all payments now go to your UPI account.

---

## 📧 Email Validation

The project includes strong email validation that blocks:

| Invalid Input | Error Shown |
|---|---|
| `plaintext` | Missing @ — use format: name@gmail.com |
| `user@` | Enter a domain after @ (e.g. gmail.com) |
| `@domain.com` | Enter a name before @ |
| `user @gmail.com` | Email must not contain spaces |
| `user@@gmail.com` | Only one @ symbol is allowed |
| `user@gmail` | Domain needs a dot — e.g. gmail.com |
| `user@gmail.c` | Domain extension too short |
| `user..name@gmail.com` | Must not have consecutive dots |
| `user@gmail.com` ✅ | ✓ Valid email address |

Real-time feedback appears as you type (green ✓ or red ✗).

---

## 🌟 Features

### 🔐 Security
- SHA-256 password hashing via Web Crypto API
- Show/Hide password toggle (eye icon)
- Live password strength meter
- Aadhaar last-4 KYC verification
- Strong email format validation (real-time feedback)
- Role-based access: Admin vs Backer

### 🌐 3D Dashboard
- Animated rotating globe (Canvas, zero libraries)
- 3D tilt stat cards with cursor glow
- Animated count-up numbers
- Sparkline mini-charts per card
- Chart.js: Bar, Doughnut, Line charts
- Live search bar
- Particle network + hexagon background

### 💸 UPI Payment (PhonePe Style)
- 6-step payment flow
- Real scannable QR code (offline, no API needed)
- Enter UPI ID with live verification animation
- Linked bank account selection (43 banks)
- 6-digit UPI PIN entry
- Processing animation
- Success screen with GST invoice + Refund button

### 🏦 43 Indian Banks
- 12 Public Sector (SBI, PNB, BOB, Canara, ...)
- 16 Private Sector (HDFC, ICICI, Axis, Kotak, ...)
- 5 Payment Banks (Paytm, Airtel, Fino, Jio, NSDL)
- 7 Small Finance Banks (AU, Equitas, Ujjivan, ...)
- 3 Regional (Saraswat, APGVB, Baroda UP)
- Add custom bank accounts (persisted per user)

### 📤 Social Sharing (12 Platforms)
WhatsApp, X/Twitter, Facebook, Telegram, LinkedIn,
Email, SMS, Reddit, Pinterest, Tumblr, Skype, LINE
+ Native Web Share API (mobile OS share sheet)

### 📊 Analytics & Exports
- Bar chart: Raised vs Goal per project
- Doughnut: Category breakdown
- Line: 14-day funding trend
- Export CSV (with GST columns)
- Export SQL (full schema)
- Export GST Report

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling (no framework) |
| Vanilla JavaScript (ES5) | All logic |
| Chart.js 4.4.1 | Dashboard charts (CDN) |
| qrcode-generator (MIT) | Local QR rendering |
| Web Crypto API | SHA-256 hashing |
| Web Share API | Native mobile sharing |
| localStorage | Data persistence |
| Canvas API | 3D globe + particles |
| Google Fonts | Orbitron + Exo 2 |

**No framework. No npm. No build step. Just open and deploy.**

---

## 💾 Data Storage

All data is stored in browser localStorage (prefix `fvPRO_`).
Data is per-browser — does not sync between devices.

| Key | Stores |
|---|---|
| `fvPRO_users` | Users + hashed passwords |
| `fvPRO_projects` | All projects + milestones |
| `fvPRO_tx` | All transactions + GST |
| `fvPRO_backers` | Backer directory |
| `fvPRO_hist` | 14-day funding history |
| `fvPRO_userBanks` | User-added bank accounts |

---

## 🔮 Upgrade to Production

| Current | Production Upgrade |
|---|---|
| localStorage | Firebase Firestore (free) |
| Simulated UPI | Razorpay / Cashfree API |
| No emails | EmailJS / SendGrid |
| No hosting | Already deployed! ✅ |
| Single UPI ID | Per-project UPI via Razorpay Route |

---

## 👤 Author

Built with ⚡ — FundVerse Pro  
UPI: `8977980147@fam`  
India 🇮🇳 | June 2026

---

*Deploy once. Share your URL. Start raising funds.*
