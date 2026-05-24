# 🌐 TravelBridge — Tourist Language Translation & AI Travel Assistant

> Real-time translation + AI Trip Planning for tourists. Voice, text, camera, payments & more — breaking language barriers across the world.

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [App Flow (User Journey)](#4-app-flow-user-journey)
5. [Code Flow (How Everything Connects)](#5-code-flow-how-everything-connects)
6. [Payment Gateway — Where & How](#6-payment-gateway--where--how)
7. [AI Trip Planner — Feature Deep Dive](#7-ai-trip-planner--feature-deep-dive)
8. [API & Services Setup](#8-api--services-setup)
9. [Building From Scratch — Step by Step](#9-building-from-scratch--step-by-step)
10. [Environment Variables](#10-environment-variables)
11. [Running the Project](#11-running-the-project)
12. [Deployment Guide](#12-deployment-guide)
13. [MVP vs Full Version Roadmap](#13-mvp-vs-full-version-roadmap)
14. [Key Notes for Development](#14-key-notes-for-development)

---

## 1. Project Overview

**TravelBridge** solves real problems tourists face every day:
- Cannot read local signs, menus, or directions
- Cannot communicate in emergencies
- Spend hours planning trips manually across 10 different apps
- Pay full price when premium travel tools are hidden behind paywalls

TravelBridge provides:
- **Voice Translation** — speak, get real-time translated audio back
- **Camera/OCR Translation** — point at signs/menus, get instant overlay translation
- **Offline Phrasebook** — essential phrases that work with zero internet
- **Emergency Mode** — one-tap SOS help in any language
- **AI Travel Chat Assistant** — ask about food, places, transport in natural language
- **AI Trip Planner** — enter destination + dates → get a full day-by-day itinerary with hotels, food, transport, budget estimate
- **Payment Gateway** — users pay for Premium plan (unlimited translations, trip plans, offline packs)

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, component-based UI |
| Styling | Tailwind CSS | Utility-first, rapid development |
| UI Components | shadcn/ui + Radix UI | Accessible, headless components |
| Animations | Framer Motion | Production-grade motion |
| State Management | Zustand | Lightweight global state (simpler than Redux) |
| Routing | React Router v6 | Client-side routing |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | Flexible document store |
| Auth | JWT + bcrypt | Stateless auth with refresh tokens |
| File Upload | Multer + Cloudinary | Audio/image uploads for STT and OCR |
| Translation | Google Translate API / DeepL | Best multilingual accuracy |
| Speech-to-Text | OpenAI Whisper API | Best multilingual STT |
| Text-to-Speech | Google Cloud TTS | Natural voice playback |
| OCR | Google Cloud Vision API | Sign and menu text detection |
| AI Assistant + Trip Planner | OpenAI GPT-4o | Natural language Q&A + trip planning |
| Payment Gateway | Razorpay (India) / Stripe (Global) | Subscription + one-time purchases |
| Real-Time | Socket.io | Live voice conversation translation |
| Deployment | Render / Railway (backend) + Vercel (frontend) + MongoDB Atlas | Free/affordable tiers |

---

## 3. Folder Structure

MERN projects split into two root folders: `client/` (React) and `server/` (Express).

```
travelbridge/
│
├── client/                              ← React + Vite frontend
│   ├── index.html                       ← Vite entry HTML
│   ├── vite.config.js                   ← Vite config (proxy API calls to :5000)
│   ├── tailwind.config.js
│   ├── package.json
│   │
│   └── src/
│       ├── main.jsx                     ← ReactDOM.createRoot entry point
│       ├── App.jsx                      ← Root component + React Router routes
│       │
│       ├── pages/                       ← One file per route/screen
│       │   ├── Landing.jsx              ← Public home page (/)
│       │   ├── Login.jsx                ← Login form (/login)
│       │   ├── Register.jsx             ← Register form (/register)
│       │   ├── Dashboard.jsx            ← App home after login (/dashboard)
│       │   ├── TextTranslate.jsx        ← Text translation (/translate)
│       │   ├── VoiceTranslate.jsx       ← Voice translation (/voice)
│       │   ├── CameraTranslate.jsx      ← OCR camera translation (/camera)
│       │   ├── Phrasebook.jsx           ← Offline phrasebook (/phrasebook)
│       │   ├── Emergency.jsx            ← SOS screen (/emergency)
│       │   ├── TripPlanner.jsx          ← AI Trip Planner (/trip-planner)
│       │   ├── TripDetail.jsx           ← Single saved trip (/trip/:id)
│       │   ├── History.jsx              ← Translation history (/history)
│       │   ├── Pricing.jsx              ← Subscription plans (/pricing)
│       │   ├── Checkout.jsx             ← Payment screen (/checkout)
│       │   └── Settings.jsx             ← User settings (/settings)
│       │
│       ├── components/                  ← Reusable UI components
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx          ← Desktop nav sidebar
│       │   │   ├── Header.jsx           ← Top bar: search, notifs, avatar
│       │   │   ├── MobileNav.jsx        ← Bottom tab bar for mobile
│       │   │   └── ProtectedRoute.jsx   ← Redirects to /login if no token
│       │   │
│       │   ├── translation/
│       │   │   ├── LanguageSelector.jsx ← Source/target language dropdowns
│       │   │   ├── TranslationBox.jsx   ← Textarea input + output with copy
│       │   │   ├── SwapLanguages.jsx    ← Animated ↔ swap button
│       │   │   └── TranslationCard.jsx  ← History item card
│       │   │
│       │   ├── voice/
│       │   │   ├── MicButton.jsx        ← Hold-to-record with pulse animation
│       │   │   ├── AudioWaveform.jsx    ← Animated bars while recording
│       │   │   ├── LiveTranscript.jsx   ← Shows transcript in real time
│       │   │   └── PlaybackButton.jsx   ← Plays translated audio
│       │   │
│       │   ├── camera/
│       │   │   ├── CameraView.jsx       ← Live camera preview (<video>)
│       │   │   ├── CaptureButton.jsx    ← Shutter button
│       │   │   ├── TextOverlay.jsx      ← Bounding box overlay on image
│       │   │   └── TranslationPanel.jsx ← Slide-up results panel
│       │   │
│       │   ├── phrasebook/
│       │   │   ├── CategoryTabs.jsx     ← Hotel / Food / Emergency tabs
│       │   │   ├── PhraseCard.jsx       ← Phrase row with speaker icon
│       │   │   └── PhraseSearch.jsx     ← Filter phrases by keyword
│       │   │
│       │   ├── emergency/
│       │   │   ├── SOSButton.jsx        ← Large pulsing red SOS button
│       │   │   ├── EmergencyCard.jsx    ← Police / Ambulance / Hospital cards
│       │   │   └── SpeakToLocal.jsx     ← Plays pre-recorded local audio
│       │   │
│       │   ├── trip/
│       │   │   ├── TripForm.jsx         ← Destination + dates + budget form
│       │   │   ├── TripDayCard.jsx      ← Single day itinerary card
│       │   │   ├── TripTimeline.jsx     ← Visual timeline of all trip days
│       │   │   ├── HotelSuggestion.jsx  ← Hotel recommendation card
│       │   │   ├── FoodSuggestion.jsx   ← Local food recommendation card
│       │   │   ├── BudgetBreakdown.jsx  ← Pie chart: hotel/food/transport %
│       │   │   └── SavedTrips.jsx       ← List of user's saved trip plans
│       │   │
│       │   ├── payment/
│       │   │   ├── PricingCard.jsx      ← Free / Pro / Business plan cards
│       │   │   ├── RazorpayButton.jsx   ← Triggers Razorpay checkout popup
│       │   │   ├── StripeButton.jsx     ← Triggers Stripe checkout redirect
│       │   │   └── PaymentSuccess.jsx   ← Success screen after payment
│       │   │
│       │   └── shared/
│       │       ├── LoadingSpinner.jsx
│       │       ├── SkeletonCard.jsx     ← Shimmer placeholder while loading
│       │       ├── ErrorMessage.jsx
│       │       ├── LanguageBadge.jsx    ← "EN → HI" pill badge
│       │       ├── CopyButton.jsx
│       │       └── PremiumBadge.jsx     ← Lock icon overlay for free users
│       │
│       ├── hooks/                       ← Custom React hooks
│       │   ├── useTranslation.js        ← API call state for translation
│       │   ├── useMicrophone.js         ← MediaRecorder setup + state
│       │   ├── useCamera.js             ← getUserMedia + frame capture
│       │   ├── useTextToSpeech.js       ← Audio playback from API response
│       │   ├── useTripPlanner.js        ← Trip generation + save state
│       │   ├── usePayment.js            ← Razorpay / Stripe trigger logic
│       │   └── useOfflineMode.js        ← Network status detection
│       │
│       ├── store/                       ← Zustand global state stores
│       │   ├── authStore.js             ← user, token, login(), logout()
│       │   ├── languageStore.js         ← sourceLang, targetLang, setLang()
│       │   └── tripStore.js             ← currentTrip, savedTrips, addTrip()
│       │
│       ├── lib/
│       │   ├── api.js                   ← Axios instance with base URL + auth header
│       │   ├── languages.js             ← Full list of language codes + names
│       │   ├── phrases.js               ← Static offline phrasebook JSON
│       │   └── utils.js                 ← formatDate, truncateText, etc.
│       │
│       └── assets/
│           ├── icons/                   ← Flag SVGs, feature icons
│           ├── audio/                   ← Pre-recorded emergency MP3 files
│           └── images/                  ← Landing page illustrations
│
│
└── server/                              ← Node.js + Express backend
    ├── package.json
    ├── .env                             ← All secrets (never commit)
    ├── .env.example
    ├── server.js                        ← Entry: creates Express app, connects DB, starts server
    │
    ├── config/
    │   ├── db.js                        ← Mongoose connection function
    │   └── cloudinary.js                ← Cloudinary config for file uploads
    │
    ├── models/                          ← Mongoose schemas
    │   ├── User.js                      ← name, email, password (hashed), plan, createdAt
    │   ├── Translation.js               ← userId, originalText, translatedText, langs, type, timestamp
    │   ├── Trip.js                      ← userId, destination, dates, budget, itinerary (JSON), saved
    │   └── Payment.js                   ← userId, orderId, amount, currency, status, gateway, timestamp
    │
    ├── routes/                          ← Express routers (URL prefix → controller)
    │   ├── auth.routes.js               ← POST /api/auth/register, /login, /refresh, /logout
    │   ├── translate.routes.js          ← POST /api/translate/text
    │   ├── voice.routes.js              ← POST /api/voice/stt, /api/voice/tts
    │   ├── ocr.routes.js                ← POST /api/ocr/scan
    │   ├── assistant.routes.js          ← POST /api/assistant/chat
    │   ├── trip.routes.js               ← POST /api/trip/generate, GET /api/trip, DELETE /api/trip/:id
    │   ├── payment.routes.js            ← POST /api/payment/create-order, /api/payment/verify
    │   ├── history.routes.js            ← GET /api/history, DELETE /api/history/:id
    │   └── user.routes.js               ← GET /api/user/profile, PUT /api/user/settings
    │
    ├── controllers/                     ← Business logic (routes call these)
    │   ├── auth.controller.js
    │   ├── translate.controller.js
    │   ├── voice.controller.js
    │   ├── ocr.controller.js
    │   ├── assistant.controller.js
    │   ├── trip.controller.js           ← Core: GPT-4o trip generation logic here
    │   ├── payment.controller.js        ← Razorpay/Stripe order creation + verification
    │   ├── history.controller.js
    │   └── user.controller.js
    │
    ├── middleware/
    │   ├── auth.middleware.js           ← Verifies JWT, attaches req.user
    │   ├── plan.middleware.js           ← Checks if user has Premium plan (for gated routes)
    │   ├── upload.middleware.js         ← Multer config for audio/image uploads
    │   └── rateLimit.middleware.js      ← Prevents API abuse (express-rate-limit)
    │
    └── services/                        ← Pure functions that call external APIs
        ├── translate.service.js         ← Calls Google Translate / DeepL
        ├── speechToText.service.js      ← Calls OpenAI Whisper
        ├── textToSpeech.service.js      ← Calls Google Cloud TTS
        ├── ocr.service.js               ← Calls Google Cloud Vision
        ├── assistant.service.js         ← Calls OpenAI GPT-4o for chat
        ├── tripPlanner.service.js       ← Calls OpenAI GPT-4o for trip generation
        ├── razorpay.service.js          ← Razorpay order creation + HMAC verification
        └── stripe.service.js            ← Stripe session creation + webhook handling
```

---

## 4. App Flow (User Journey)

```
[Landing Page /]
      |
      | Click "Get Started" or "Sign Up Free"
      ↓
[Register /register]  ←——→  [Login /login]
      |
      | POST /api/auth/register → JWT stored in localStorage
      ↓
[Dashboard /dashboard]  ←————————————————————————————┐
      |                                               |
      |—→ [Text Translate /translate]                 |
      |       User types → POST /api/translate/text  |
      |       ← Returns translatedText               |
      |       Auto-saves to history                  |
      |                                               |
      |—→ [Voice Translate /voice]                    |
      |       Hold mic → MediaRecorder records       |
      |       POST /api/voice/stt (audio blob)        |
      |       ← transcript text                       |
      |       POST /api/translate/text                |
      |       POST /api/voice/tts                     |
      |       ← audio plays automatically             |
      |                                               |
      |—→ [Camera Translate /camera]                  |
      |       Camera preview → tap capture            |
      |       POST /api/ocr/scan (base64 image)       |
      |       ← detected text + bounding boxes        |
      |       POST /api/translate/text (each chunk)   |
      |       ← overlay drawn on image                |
      |                                               |
      |—→ [Phrasebook /phrasebook]  [fully offline]   |
      |       Static JSON, no API call                |
      |       Tap speaker → plays local MP3           |
      |                                               |
      |—→ [Emergency /emergency]  [fully offline]     |
      |       Tap card → plays pre-recorded audio     |
      |       "Speak to Local" → plays in local lang  |
      |                                               |
      |—→ [AI Trip Planner /trip-planner]  🌟 NEW     |
      |       User fills TripForm:                    |
      |         Destination, Start Date, End Date,    |
      |         Budget (₹/$/€), Interests, Group Size |
      |       POST /api/trip/generate                 |
      |       ← GPT-4o returns full itinerary JSON   |
      |       TripTimeline renders day-by-day         |
      |       User clicks "Save Trip" → stored in DB  |
      |       User can view saved trips any time      |
      |                                               |
      |—→ [Pricing /pricing]  💳 PAYMENT              |
      |       Three plans: Free / Pro / Business      |
      |       User clicks "Upgrade to Pro"            |
      |       POST /api/payment/create-order          |
      |       ← orderId returned                      |
      |       Razorpay popup opens (or Stripe page)   |
      |       User pays → webhook fired               |
      |       POST /api/payment/verify                |
      |       User plan updated to "pro" in MongoDB   |
      |       User redirected to /dashboard           |
      |                                               |
      |—→ [History /history]                          |
      |       GET /api/history                        |
      |       Lists all translations grouped by date  |
      |                                               |
      └—→ [Settings /settings]                        |
              GET /api/user/profile                   |
              PUT /api/user/settings ————————————————┘
              Change language, download offline pack
```

---

## 5. Code Flow (How Everything Connects)

### Text Translation — End to End

```
TranslationBox.jsx (React)
  User types text
        ↓
useTranslation.js hook fires
  debounced 500ms → calls api.js
        ↓
lib/api.js
  axios.post('/api/translate/text', { text, sourceLang, targetLang })
  Authorization: Bearer <JWT token from Zustand authStore>
        ↓
server/routes/translate.routes.js
  POST /api/translate/text
  → auth.middleware.js (verifies JWT)
  → translate.controller.js
        ↓
server/controllers/translate.controller.js
  calls translate.service.js
        ↓
server/services/translate.service.js
  fetch → Google Translate API
  returns { translatedText }
        ↓
controller sends response back
  → also saves to Translation model in MongoDB
        ↓
React receives { translatedText }
  TranslationBox.jsx shows result
  CopyButton.jsx available
```

### Voice Translation — End to End

```
MicButton.jsx (hold to record)
        ↓
useMicrophone.js hook
  navigator.mediaDevices.getUserMedia({ audio: true })
  new MediaRecorder(stream)
  records chunks into Blob (audio/webm)
        ↓
User releases button
  FormData { audio: blob }
  api.js → POST /api/voice/stt
        ↓
server/routes/voice.routes.js
  upload.middleware.js (Multer stores file temporarily)
  → voice.controller.js → speechToText.service.js
        ↓
speechToText.service.js
  openai.audio.transcriptions.create({ file, model: 'whisper-1' })
  returns { transcript: "Where is the station?" }
        ↓
controller → calls translate.service.js automatically
  returns { transcript, translatedText }
        ↓
controller → calls textToSpeech.service.js
  returns audio buffer → stored in Cloudinary
  returns { audioUrl }
        ↓
React: LiveTranscript.jsx shows both texts
       useTextToSpeech.js auto-plays audioUrl
```

### AI Trip Planner — End to End

```
TripForm.jsx (React)
  User fills: destination="Paris", startDate, endDate,
              budget=50000 INR, interests=["museums","food"],
              groupSize=2
        ↓
useTripPlanner.js hook
  api.js → POST /api/trip/generate (body: formData)
        ↓
server/routes/trip.routes.js
  → auth.middleware.js
  → plan.middleware.js (check if user can generate — free: 2/month, pro: unlimited)
  → trip.controller.js
        ↓
server/controllers/trip.controller.js
  calls tripPlanner.service.js
        ↓
server/services/tripPlanner.service.js
  Calls GPT-4o with structured prompt (see Section 7)
  Response parsed as JSON
  Returns:
  {
    destination: "Paris, France",
    days: [
      {
        day: 1,
        title: "Arrival & Eiffel Tower",
        morning: { activity, location, duration, cost },
        afternoon: { activity, location, duration, cost },
        evening: { activity, location, duration, cost },
        hotel: { name, area, estimatedCost, rating },
        food: [{ meal: "lunch", place, dish, cost }]
      },
      ...
    ],
    budgetBreakdown: { hotel: 45%, food: 25%, transport: 20%, activities: 10% },
    totalEstimatedCost: "₹48,500",
    travelTips: ["Best metro card...", "..."],
    packingList: ["Adapter plug", "Comfortable shoes", ...]
  }
        ↓
Trip saved to MongoDB Trip collection
        ↓
React receives trip JSON
  TripTimeline.jsx renders day cards
  BudgetBreakdown.jsx renders pie chart (recharts)
  User clicks "Save" → already saved, shows confirmation
  User can share as PDF (jsPDF)
```

### Payment Flow — End to End (Razorpay)

```
PricingCard.jsx (user clicks "Upgrade to Pro ₹499/month")
        ↓
usePayment.js hook
  api.js → POST /api/payment/create-order
  body: { plan: "pro", amount: 49900, currency: "INR" }
        ↓
server/controllers/payment.controller.js
  calls razorpay.service.js
        ↓
razorpay.service.js
  razorpay.orders.create({ amount: 49900, currency: "INR", receipt: uuid })
  returns { orderId, amount, currency }
        ↓
React: RazorpayButton.jsx receives orderId
  Opens Razorpay popup with:
    key: RAZORPAY_KEY_ID
    orderId, amount, currency
    prefill: { name, email }
  User completes payment
        ↓
Razorpay fires onSuccess callback with:
  { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        ↓
api.js → POST /api/payment/verify
  body: { paymentId, orderId, signature }
        ↓
razorpay.service.js
  HMAC SHA256 verify: orderId + "|" + paymentId
  Compare with razorpay_signature
  If valid → User.findByIdAndUpdate({ plan: "pro" })
             Payment record saved to MongoDB
        ↓
React: PaymentSuccess.jsx shown
  authStore updated with new plan
  Premium features unlocked immediately
```

---

## 6. Payment Gateway — Where & How

### Why Add a Payment Gateway?

Free users get limited features. Paid plans unlock:
- Unlimited voice + text translations (free: 50/day)
- Unlimited AI Trip Plans (free: 2/month)
- Camera OCR translation (Pro only)
- Offline language pack downloads (Pro only)
- Priority AI response speed (Business only)

### Which Gateway to Use?

| Gateway | Best For | Monthly Fee | India UPI Support |
|---|---|---|---|
| **Razorpay** | Indian users (₹) | Free + 2% per txn | ✅ Yes |
| **Stripe** | International ($) | Free + 2.9% + 30¢ | ❌ No |
| Use **both** | Full global coverage | — | — |

**Recommendation**: Use Razorpay as primary (for Indian tourists using the app), Stripe as secondary for international cards.

### Pricing Plans (Suggested)

```
FREE PLAN
├── 50 text translations / day
├── 10 voice translations / day
├── 2 AI trip plans / month
├── Phrasebook access
└── Emergency mode

PRO PLAN — ₹499/month or ₹3,999/year
├── Unlimited text + voice translation
├── Camera OCR translation
├── Unlimited AI trip plans
├── Offline language packs (5 languages)
├── Save unlimited trips
└── Ad-free experience

BUSINESS PLAN — ₹1,499/month
├── Everything in Pro
├── Group translation rooms (up to 20 people)
├── API access for tour operators
├── Priority support
└── White-label option
```

### Step-by-Step Razorpay Integration

**Step 1: Install**
```bash
# Server
npm install razorpay crypto

# Client (load via CDN in index.html — NOT npm)
# Add to client/index.html:
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**Step 2: Create Razorpay account**
- Go to razorpay.com → Sign up
- Dashboard → Settings → API Keys → Generate Test Keys
- Copy `Key ID` and `Key Secret` to server `.env`

**Step 3: server/services/razorpay.service.js**
```js
const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Create order — call this before showing payment popup
exports.createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100,    // Razorpay takes paise (₹499 = 49900 paise)
    currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1
  }
  return await razorpay.orders.create(options)
}

// Verify payment — call this after user completes payment
exports.verifyPayment = (orderId, paymentId, signature) => {
  const body = orderId + '|' + paymentId
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')
  return expectedSig === signature   // true = payment is genuine
}
```

**Step 4: server/controllers/payment.controller.js**
```js
const { createOrder, verifyPayment } = require('../services/razorpay.service')
const Payment = require('../models/Payment')
const User = require('../models/User')

exports.createOrder = async (req, res) => {
  const { plan, amount } = req.body
  const order = await createOrder(amount)
  res.json({ orderId: order.id, amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID })
}

exports.verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature, plan } = req.body
  const isValid = verifyPayment(orderId, paymentId, signature)

  if (!isValid) return res.status(400).json({ message: 'Payment verification failed' })

  // Upgrade user plan in database
  await User.findByIdAndUpdate(req.user.id, { plan, planExpiresAt: getExpiryDate(plan) })

  // Save payment record
  await Payment.create({
    userId: req.user.id,
    orderId, paymentId,
    amount: req.body.amount,
    currency: 'INR',
    status: 'success',
    gateway: 'razorpay',
    plan
  })

  res.json({ success: true, message: 'Plan upgraded successfully' })
}
```

**Step 5: client/hooks/usePayment.js**
```js
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'

export function usePayment() {
  const { user } = useAuthStore()

  const initiatePayment = async (plan, amount) => {
    // Step 1: Create order on your server
    const { data } = await api.post('/payment/create-order', { plan, amount })

    // Step 2: Open Razorpay popup
    const options = {
      key: data.keyId,
      amount: data.amount * 100,
      currency: 'INR',
      order_id: data.orderId,
      name: 'TravelBridge',
      description: `${plan} Plan Subscription`,
      prefill: { name: user.name, email: user.email },
      theme: { color: '#2563EB' },
      handler: async (response) => {
        // Step 3: Verify payment on your server
        await api.post('/payment/verify', {
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          plan
        })
        window.location.href = '/dashboard?upgraded=true'
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return { initiatePayment }
}
```

**Step 6: client/components/payment/RazorpayButton.jsx**
```jsx
import { usePayment } from '../../hooks/usePayment'

export default function RazorpayButton({ plan, amount, label }) {
  const { initiatePayment } = usePayment()

  return (
    <button
      onClick={() => initiatePayment(plan, amount)}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
    >
      {label || `Upgrade to ${plan}`}
    </button>
  )
}
```

### Where Payment Fits in the App

```
/pricing page
  → PricingCard.jsx (Free / Pro / Business)
  → RazorpayButton.jsx on Pro + Business cards
  → usePayment hook → server order → Razorpay popup
  → verify → User.plan updated in MongoDB

Protected features in the app:
  plan.middleware.js on server gates:
    POST /api/ocr/scan           (Pro only)
    POST /api/trip/generate      (Free: 2/month, Pro: unlimited)
    GET  /api/offline/pack       (Pro only)

  PremiumBadge.jsx on client shows lock icon
    if (user.plan === 'free') show upgrade prompt
```

---

## 7. AI Trip Planner — Feature Deep Dive

### What It Does

User provides:
- Destination (e.g., "Goa, India")
- Travel dates (e.g., Dec 20 – Dec 27)
- Total budget (e.g., ₹25,000)
- Number of travelers (e.g., 2 adults)
- Interests (e.g., beaches, nightlife, local food)
- Accommodation preference (budget / mid-range / luxury)

TravelBridge returns:
- Day-by-day itinerary with morning, afternoon, evening activities
- Hotel suggestions with estimated costs per night
- Local food spots for each day (breakfast, lunch, dinner)
- Transport plan (how to get around each day)
- Budget breakdown chart
- Emergency contacts for the destination
- Packing checklist
- Local cultural tips

### The GPT-4o Prompt (server/services/tripPlanner.service.js)

```js
const OpenAI = require('openai')
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

exports.generateTrip = async ({ destination, startDate, endDate, budget, currency, travelers, interests, accommodation }) => {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))

  const prompt = `
You are an expert travel planner. Generate a detailed ${days}-day trip itinerary for the following request.

TRIP DETAILS:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate} (${days} days)
- Total Budget: ${currency} ${budget} for ${travelers} traveler(s)
- Interests: ${interests.join(', ')}
- Accommodation: ${accommodation}

RULES:
1. Be specific — use real place names, real restaurants, real hotels.
2. Stay within the budget.
3. Include realistic travel times between places.
4. Suggest local food (not tourist traps).
5. Provide estimated cost in ${currency} for every item.

Respond ONLY in this exact JSON format, no extra text:
{
  "destination": "string",
  "totalDays": number,
  "currency": "string",
  "days": [
    {
      "day": 1,
      "date": "2024-12-20",
      "title": "string",
      "theme": "string",
      "schedule": {
        "morning": { "time": "8:00 AM", "activity": "string", "location": "string", "duration": "2 hours", "estimatedCost": number, "tips": "string" },
        "afternoon": { "time": "1:00 PM", "activity": "string", "location": "string", "duration": "3 hours", "estimatedCost": number, "tips": "string" },
        "evening": { "time": "7:00 PM", "activity": "string", "location": "string", "duration": "2 hours", "estimatedCost": number, "tips": "string" }
      },
      "meals": [
        { "type": "breakfast", "place": "string", "dish": "string", "estimatedCost": number },
        { "type": "lunch", "place": "string", "dish": "string", "estimatedCost": number },
        { "type": "dinner", "place": "string", "dish": "string", "estimatedCost": number }
      ],
      "accommodation": { "name": "string", "area": "string", "estimatedCostPerNight": number, "rating": "4.2/5", "bookingTip": "string" },
      "transport": { "mode": "string", "details": "string", "estimatedCost": number },
      "dayTotal": number
    }
  ],
  "budgetBreakdown": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "miscellaneous": number
  },
  "totalEstimatedCost": number,
  "travelTips": ["string"],
  "emergencyContacts": { "police": "string", "ambulance": "string", "touristHelpline": "string" },
  "packingList": ["string"],
  "bestTimeToVisit": "string",
  "localPhrases": [{ "phrase": "string", "meaning": "string", "pronunciation": "string" }]
}
`
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000
  })

  const raw = response.choices[0].message.content
  return JSON.parse(raw.replace(/```json|```/g, '').trim())
}
```

### Trip Planner Frontend Components

**client/pages/TripPlanner.jsx** — main page:
```
[TripForm]          ← user fills destination, dates, budget, interests
      ↓ submit
[SkeletonCard]      ← loading state while GPT generates (~5-8 seconds)
      ↓ response
[TripTimeline]      ← horizontal scroll through all days
[BudgetBreakdown]   ← pie chart using recharts
[HotelSuggestions]  ← cards for each day's hotel
[FoodSuggestions]   ← local restaurants day by day
[PackingList]       ← checklist, user can tick items
[TravelTips]        ← cultural tips + emergency contacts
[SavedTrips]        ← user's previously generated trip plans
```

**client/components/trip/TripDayCard.jsx** structure:
```
Day 1 — "Arrival & Beaches"
├── Morning: Baga Beach (₹200 entry)
├── Afternoon: Calangute Market (₹0 entry, shopping ~₹500)
├── Evening: Tito's Lane (₹1500 dinner + drinks)
├── Stay: Zostel Goa North — ₹1,200/night
├── Transport: Rent scooter — ₹400/day
└── Day Total: ₹3,800
```

**MongoDB Trip Schema (server/models/Trip.js)**:
```js
const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  currency: { type: String, default: 'INR' },
  travelers: Number,
  interests: [String],
  accommodation: String,
  itinerary: mongoose.Schema.Types.Mixed,    // Full GPT-4o JSON response stored here
  totalEstimatedCost: Number,
  isSaved: { type: Boolean, default: false },
  sharedLink: String,                        // Optional: shareable public link
  createdAt: { type: Date, default: Date.now }
})
```

---

## 8. API & Services Setup

### Google Cloud Setup (Translation + TTS + Vision)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Create Project
2. Enable these three APIs:
   - **Cloud Translation API**
   - **Cloud Text-to-Speech API**
   - **Cloud Vision API**
3. Go to Credentials → Create API Key
4. Copy key to server `.env` as `GOOGLE_API_KEY`

### OpenAI Setup (Whisper + GPT-4o)

1. Go to [platform.openai.com](https://platform.openai.com) → API Keys → Create new key
2. Copy to server `.env` as `OPENAI_API_KEY`
3. Whisper endpoint: `POST https://api.openai.com/v1/audio/transcriptions`
4. GPT-4o endpoint: `POST https://api.openai.com/v1/chat/completions`

### Razorpay Setup

1. Go to [razorpay.com](https://razorpay.com) → Sign up → Activate account
2. Dashboard → Settings → API Keys → Generate Key (test mode first)
3. Copy `Key ID` → `RAZORPAY_KEY_ID` and `Key Secret` → `RAZORPAY_KEY_SECRET`

### Cloudinary Setup (File Uploads)

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up (free tier: 25GB)
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Used to temporarily store audio files from Whisper upload and OCR images

### MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add user with readWrite role
3. Network Access → Allow `0.0.0.0/0` (for deployment)
4. Connect → Copy connection string → paste into `MONGODB_URI`

---

## 9. Building From Scratch — Step by Step

### Phase 1 — Project Initialization (Day 1)

```bash
mkdir travelbridge && cd travelbridge

# ── CLIENT (React + Vite) ──────────────────────
npm create vite@latest client -- --template react
cd client
npm install
npm install react-router-dom axios zustand framer-motion
npm install recharts lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# ── SERVER (Node + Express) ────────────────────
mkdir server && cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install multer cloudinary razorpay openai
npm install express-rate-limit express-validator
npm install -D nodemon
cd ..
```

**client/vite.config.js** — proxy all `/api` calls to Express:
```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
}
```

**server/server.js** — Express entry point:
```js
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()

connectDB()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth',       require('./routes/auth.routes'))
app.use('/api/translate',  require('./routes/translate.routes'))
app.use('/api/voice',      require('./routes/voice.routes'))
app.use('/api/ocr',        require('./routes/ocr.routes'))
app.use('/api/assistant',  require('./routes/assistant.routes'))
app.use('/api/trip',       require('./routes/trip.routes'))
app.use('/api/payment',    require('./routes/payment.routes'))
app.use('/api/history',    require('./routes/history.routes'))
app.use('/api/user',       require('./routes/user.routes'))

app.listen(5000, () => console.log('Server running on port 5000'))
```

**server/config/db.js**:
```js
const mongoose = require('mongoose')

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected')
}

module.exports = connectDB
```

### Phase 2 — Auth System (Day 2)

**server/models/User.js**:
```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nativeLang: { type: String, default: 'en' },
  travelLang: { type: String, default: 'es' },
  plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
  planExpiresAt: Date,
  translationCount: { type: Number, default: 0 },
  tripCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})
```

**server/middleware/auth.middleware.js**:
```js
const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id).select('-password')
  next()
}
```

**server/middleware/plan.middleware.js**:
```js
module.exports = (requiredPlan) => (req, res, next) => {
  const plans = { free: 0, pro: 1, business: 2 }
  if (plans[req.user.plan] >= plans[requiredPlan]) return next()
  res.status(403).json({ message: 'Upgrade to access this feature', upgrade: true })
}
```

**client/store/authStore.js** (Zustand):
```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    token: null,
    login: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
    updatePlan: (plan) => set((state) => ({ user: { ...state.user, plan } }))
  }),
  { name: 'auth' }   // persists to localStorage
))
```

**client/lib/api.js** (Axios with auth header):
```js
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

**client/App.jsx** (routing):
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/pricing"     element={<Pricing />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/translate"     element={<TextTranslate />} />
          <Route path="/voice"         element={<VoiceTranslate />} />
          <Route path="/camera"        element={<CameraTranslate />} />
          <Route path="/phrasebook"    element={<Phrasebook />} />
          <Route path="/emergency"     element={<Emergency />} />
          <Route path="/trip-planner"  element={<TripPlanner />} />
          <Route path="/trip/:id"      element={<TripDetail />} />
          <Route path="/history"       element={<History />} />
          <Route path="/settings"      element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### Phase 3 — Dashboard & Layout (Day 3)

Build in this order:
1. `components/layout/Sidebar.jsx` — nav links to all pages
2. `components/layout/Header.jsx` — user avatar + plan badge
3. `components/layout/MobileNav.jsx` — 5 bottom tabs for mobile
4. `pages/Dashboard.jsx` — feature cards grid + quick stats
5. `store/languageStore.js` — sourceLang/targetLang global state
6. `components/translation/LanguageSelector.jsx` — dropdown with all 100+ languages from `lib/languages.js`

### Phase 4 — Text Translation (Day 4)

Build: `server/routes` → `controller` → `service` → React page and components.

Key server route (`server/routes/translate.routes.js`):
```js
const router = require('express').Router()
const auth = require('../middleware/auth.middleware')
const { translateText } = require('../controllers/translate.controller')

router.post('/text', auth, translateText)
module.exports = router
```

### Phase 5 — Voice Translation (Day 5)

Key considerations:
- Multer must be configured with `memoryStorage()` so audio stays in RAM before upload to Cloudinary
- Send to Whisper as a `File` object (use the `File` constructor from the `buffer` in Node)
- Return `audioUrl` from Cloudinary so React can play directly (no binary streaming needed)

### Phase 6 — Camera OCR (Day 6)

Key considerations:
- Send image as base64 string in JSON body (no file upload needed — Cloud Vision accepts base64)
- Vision returns `responses[0].textAnnotations` — first item is the full text, rest are individual words with bounding polygons
- Group words into logical lines before translating
- Normalize bounding box coordinates as percentages of image dimensions for responsive overlay

### Phase 7 — Phrasebook & Emergency (Day 7)

- `client/lib/phrases.js` — 200+ static phrases in all 6 categories
- No API calls — phrases file bundled with app
- Pre-generate emergency audio files using Google TTS, store in `client/assets/audio/`
- `new Audio('/audio/need-help-hi.mp3').play()` — no server call for emergency

### Phase 8 — AI Trip Planner (Day 8–9)

Build in order:
1. `server/models/Trip.js`
2. `server/services/tripPlanner.service.js` (the GPT prompt above)
3. `server/controllers/trip.controller.js`
4. `server/routes/trip.routes.js` — protect with `plan.middleware('free')` (free users get 2/month)
5. `client/hooks/useTripPlanner.js`
6. `client/components/trip/TripForm.jsx` — multi-step form
7. `client/components/trip/TripDayCard.jsx`
8. `client/components/trip/TripTimeline.jsx`
9. `client/components/trip/BudgetBreakdown.jsx` — recharts PieChart
10. `client/pages/TripPlanner.jsx` — assemble all

**Install recharts for budget chart**:
```bash
cd client && npm install recharts
```

### Phase 9 — Payment Gateway (Day 10)

Follow the complete Razorpay integration in Section 6.
- Build `server/services/razorpay.service.js`
- Build `server/controllers/payment.controller.js`
- Build `server/routes/payment.routes.js`
- Build `client/pages/Pricing.jsx`
- Build `client/components/payment/PricingCard.jsx`
- Build `client/hooks/usePayment.js`
- Build `client/components/payment/RazorpayButton.jsx`

### Phase 10 — History, Settings & Polish (Day 11–12)

- `pages/History.jsx` + `GET /api/history` route
- `pages/Settings.jsx` + `PUT /api/user/settings` route
- Add PremiumBadge to gated components (Camera, Trip Planner beyond 2)
- Responsive mobile layout across all pages
- Loading skeletons (SkeletonCard.jsx) on all async data
- Error boundaries on main page components

---

## 10. Environment Variables

### server/.env

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/travelbridge

# Auth
JWT_SECRET=your-long-random-secret-string-min-32-chars
JWT_EXPIRES_IN=7d

# Google Cloud (Translation + TTS + Vision all use same key)
GOOGLE_API_KEY=your-google-api-key

# OpenAI (Whisper STT + GPT-4o Trip Planner + AI Assistant)
OPENAI_API_KEY=sk-your-openai-api-key

# Cloudinary (audio + image storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Razorpay (Payment)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Stripe (optional — for international users)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

### client/.env

```env
# Only public variables here (no secrets!)
VITE_APP_NAME=TravelBridge
VITE_API_BASE_URL=http://localhost:5000/api
```

Create `.env.example` files in both `client/` and `server/` showing variable names without values, and commit those. **Never commit the actual `.env` files.**

---

## 11. Running the Project

### Development (run both servers simultaneously)

```bash
# Terminal 1 — Backend
cd server
npm run dev          # nodemon server.js, runs on :5000

# Terminal 2 — Frontend
cd client
npm run dev          # Vite, runs on :5173 (proxies /api to :5000)
```

Or install concurrently in root:
```bash
# root package.json
npm install -D concurrently
# Add script: "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""
npm run dev          # starts both
```

### Production Build

```bash
cd client && npm run build   # outputs to client/dist/
```

In production, Express can serve the built React app:
```js
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')))
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  )
}
```

---

## 12. Deployment Guide

### Option A — Render (Free tier, recommended for MERN)

**Backend:**
1. Push code to GitHub
2. Go to render.com → New Web Service → Connect your repo
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `server/.env`
7. Copy the service URL (e.g., `https://travelbridge-api.onrender.com`)

**Frontend:**
1. render.com → New Static Site → Connect your repo
2. Root directory: `client`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_API_BASE_URL=https://travelbridge-api.onrender.com/api`

### Option B — Railway (paid, faster)

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy server
cd server && railway up

# Deploy client separately
cd client && railway up
```

### MongoDB Atlas

1. Free cluster at mongodb.com/atlas (512MB storage, good for MVP)
2. Database Access → Add user
3. Network Access → `0.0.0.0/0`
4. Connect → copy URI → paste into `MONGODB_URI`

### Razorpay Production

Switch from test keys to live keys when launching:
- `rzp_test_xxx` → `rzp_live_xxx`
- All logic stays exactly the same

---

## 13. MVP vs Full Version Roadmap

### ✅ MVP — Week 1–2 (Build This First)
- [ ] Landing page with hero, features, pricing preview
- [ ] Register + Login with JWT auth
- [ ] Text translation (100+ languages)
- [ ] Language selector (source ↔ target swap)
- [ ] Voice translation (mic → Whisper → translate → TTS)
- [ ] Offline phrasebook (Hotel, Restaurant, Transport, Emergency)
- [ ] Emergency SOS screen with audio playback
- [ ] Basic translation history
- [ ] Mobile responsive layout

### 🚀 Phase 2 — Week 3–4
- [ ] Camera OCR translation (Pro feature)
- [ ] AI Travel Chat Assistant
- [ ] AI Trip Planner (basic version — free users: 2/month)
- [ ] Pricing page + Razorpay payment integration
- [ ] Plan gating (lock Pro features for free users)
- [ ] Settings page + language preferences
- [ ] Save favorite phrases

### 🌟 Phase 3 — Month 2
- [ ] Trip Planner — PDF export (jsPDF)
- [ ] Trip Planner — shareable public link
- [ ] Stripe integration for international payments
- [ ] Group translation rooms (Socket.io)
- [ ] Currency + unit converter
- [ ] PWA — installable on mobile
- [ ] Offline language pack download (Pro)
- [ ] Nearby attractions (Google Places API)
- [ ] AR camera overlay (canvas over live video stream)

---

## 14. Key Notes for Development

### Security
- **Never expose** `RAZORPAY_KEY_SECRET` or `OPENAI_API_KEY` to the client
- Always verify Razorpay payments server-side with HMAC — never trust the client's claim of success
- Add `express-rate-limit` on all API routes (especially `/api/translate` and `/api/trip/generate`) to prevent abuse and runaway API costs
- Hash passwords with `bcryptjs` (saltRounds: 12) — never store plain text

### Performance
- Debounce text translation input by 500ms — don't fire API on every keystroke
- Cache common translations in MongoDB for 24 hours (same text + same lang pair = skip external API call)
- GPT-4o trip generation takes 5–15 seconds — always show a loading skeleton with animated progress steps

### Mobile-Specific
- Camera: always use `{ facingMode: 'environment' }` to default to rear camera on mobile
- MediaRecorder outputs `audio/webm` on Chrome and `audio/mp4` on Safari — handle both MIME types
- Test emergency audio playback on iOS: requires a user gesture to trigger `audio.play()`

### Cost Management (Keep API Bills Low)
- Whisper: ~$0.006/minute — limit free users to 10 voice translations/day
- GPT-4o: ~$0.005/1K input tokens — trip plan prompt is ~500 tokens, response ~2000 tokens = ~$0.015/trip
- Google Translate: $20 per 1M characters — 50 free translations/day per user is safe
- Google Vision: $1.50 per 1000 images — camera feature is Pro-only which limits volume

### Code Quality
- Separate **routes** (URL definitions) from **controllers** (business logic) from **services** (external API calls)
- Keep React components under 150 lines — split large components into smaller pieces
- Use Zustand stores only for truly global state (auth, language preference) — local component state for everything else

---

*Built with ❤️ for travelers everywhere. Break the language barrier, plan your perfect trip.*
