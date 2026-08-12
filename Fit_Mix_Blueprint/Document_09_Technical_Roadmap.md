# Blueprint Document 9 — Technical Roadmap

> **Product**: Fitmix  
> **Authors**: Senior Engineering & UI/UX Design Team (15+ Years Industry Experience)  
> **Status**: Approved  

---

## 1. Roadmap Architecture & Execution Philosophy

As senior software developers and UI/UX designers with 15+ years of experience, we structure the Fitmix development into **4 distinct engineering phases**. 

Every sprint focuses on deliverable, testable software. We build the core interactive loop first, ensure complete mobile-native readiness, and expand features systematically.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          FITMIX TECHNICAL ROADMAP                               │
└───────┬───────────────┬───────────────┬───────────────┬─────────────────────────┘
        │               │               │               │
        ▼               ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PHASE 1:    │ │  PHASE 2:    │ │  PHASE 3:    │ │  PHASE 4:    │
│  MVP CORE    │ │  SOCIAL &    │ │  NATIVE      │ │  MONETIZATION│
│  FOUNDATION  │ │  LITERACY    │ │  MOBILE APPS │ │  & AI ERA    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## 2. Phase Breakdown & Feature Deliverables

### PHASE 1: MVP Core Foundation (Immediate Build Target)
* **Goal**: Deliver a fully functional, breathtaking web app with local state persistence and Supabase integration.

#### 1. System Architecture & Foundation
- Next.js 16+ App Router setup with Turbopack and React 19.
- Dual Theme System: Obsidian Dark (`#0D0E12`) & Editorial Light (`#FAFAFC`) mode switcher.
- Typography & Theme Token definitions (`Inter`/`Outfit` fonts, Electric Lime `#E2FF66`, Glassmorphism utilities).
- Mobile-First responsive shell & desktop viewport layout.

#### 2. Landing Page & Onboarding Studio
- Hero section with centered bold editorial headline (`<h1>`) and **ambient floating glassmorphic clothing cutout bubbles**.
- Auth Modal (Email/Password, Google, Apple one-tap).
- Onboarding flow with Style Interest Selector pills (Streetwear, Vintage, Upcycled, etc.).

#### 3. Post a Piece Studio (AI Cutout Pipeline)
- Drag-and-drop / camera upload dropzone.
- Client-side WebAssembly AI background removal engine (`@imgly/background-removal`).
- Dominant color extraction & edge tolerance adjustment slider.
- Piece tagging form (Category, Brand Tag, Title, Description) -> Saves to Closet.

#### 4. The Interactive Remix Canvas Studio (Core Engine)
- Touch & Mouse Canvas layer manipulation engine (Drag, Scale, Rotate, Z-Index Bring Forward/Backward, Flip).
- Multi-piece drawer picker (*My Closet*, *Community Items*, *Saved Items*).
- Canvas background picker (*Obsidian, Studio Paper, Velvet*).
- Composite image renderer & publishing engine.

#### 5. Feed, Closet & Piece Showcase Pages
- **Mix Feed**: Scrolling cards with expandable tagged piece drawers & direct "Remix" CTA.
- **My Closet & User Profiles**: Grid of cutout Pieces, posted Mixes, and "Remixed by N" metrics.
- **Piece Showcase & Remix Chain Tracker**: View original piece + grid of all community mixes using it.
- **Real-Time Notification System**: Triggers notifications when a piece owner's item is used in a mix.

---

### PHASE 2: Social Engine & Fashion Literacy (Post-MVP Sprint 1)
* **Goal**: Deepen social retention, direct communication, and passive education.

1. **Direct Messaging System (DMs)**:
   - Mutual follow gate enforcement.
   - Message drawer with embedded Mix card preview attachments.
2. **Fashion Literacy & Education Engine**:
   - Technique tagging pills (*Color-Blocking, Monochrome, Streetwear x Formal*).
   - "Why this mix works" annotation box.
   - Curated **Mix of the Week Spotlight** card.
3. **Advanced Discover & Search**:
   - Search by item name, color hex, category, brand tag, or user handle.
   - Trending Pieces leaderboard.

---

### PHASE 3: Mobile Native App Expansion (Post-MVP Sprint 2)
* **Goal**: Release native iOS & Android apps on the Apple App Store & Google Play Store.

1. **React Native / Expo Native App Build**:
   - Re-use 100% of `/api/v1/` REST APIs and authentication JWT tokens.
   - Shared TypeScript types (`lib/types.ts`) and state logic hooks.
2. **Native Push Notifications**:
   - Apple APNS & Google FCM integration for instant "Someone remixed your piece" lockscreen alerts.
3. **Camera & Device Integration**:
   - Direct iOS/Android camera capture with haptic feedback during canvas drag-and-drop.

---

### PHASE 4: Monetization & Advanced AI Styling (Long-Term Era)
* **Goal**: Sustainable revenue generation & post-MVP AI virtual try-on.

1. **Monetization Engine**:
   - Outbound affiliate link lookups ("Shop Similar").
   - Brand Sponsored Remix Challenge portal.
   - Fitmix Pro subscription tier ($7.99/mo).
2. **Advanced Post-MVP AI Virtual Try-On**:
   - Optional AI visual generator showing flat-lay Mixes rendered worn on a virtual avatar (deliberately deferred post-MVP feature).

---

## 3. Engineering Priorities & Dependency Order

```
[ Dual Theme & UI Tokens ]
          │
          ▼
[ Post Piece Studio (WASM Cutout) ] ──► [ My Closet Grid ]
          │                                   │
          ▼                                   ▼
[ Interactive Remix Canvas Engine ] ──► [ Mix Feed & Piece Attribution ]
                                              │
                                              ▼
                                    [ Notification System ]
```
