# Blueprint Document 5 — Technical & AI Architecture

> **Product**: Fitmix  
> **Authors**: Senior Engineering & UI/UX Design Team (15+ Years Industry Experience)  
> **Status**: Approved (Next.js 16+ Architecture)  

---

## 1. System Architecture Overview

Built by senior software engineers with 15+ years of production experience, Fitmix uses a modern, high-performance **decoupled web & API architecture** powered by **Next.js 16+**.

```
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                                CLIENT LAYER                                     │
 │   ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────┐   │
 │   │  Next.js 16+ Web App   │  │ Interactive Flat-Lay   │  │ Client AI Cutout │   │
 │   │ (React 19 / Turbopack) │  │ Touch Canvas Engine    │  │ WASM Pipeline    │   │
 │   └────────────────────────┘  └────────────────────────┘  └──────────────────┘   │
 └────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                HTTP REST / WebSocket JSON APIs
                                (Supabase Auth JWT Bearer)
                                          │
 ┌────────────────────────────────────────▼────────────────────────────────────────┐
 │                                BACKEND SERVICES                                 │
 │   ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────┐   │
 │   │   Supabase Postgres    │  │  Storage Buckets       │  │ Realtime Engine  │   │
 │   │ (RLS Security Policies)│  │ (CDN Image Cutouts)    │  │ (WebSockets)     │   │
 │   └────────────────────────┘  └────────────────────────┘  └──────────────────┘   │
 └─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                         [ Future React Native / Expo Native Apps ]
                         (Reuses 100% of /api/v1 REST Endpoints)
```

---

## 2. AI Image Cutout & Processing Pipeline

### How Background Removal Works (Zero-Server-Cost Model)
To keep cloud costs near zero while delivering instant cutouts, Fitmix implements a **Hybrid AI Cutout Engine**:

1. **Primary (In-Browser WASM AI)**:
   - On photo upload, the client initializes `@imgly/background-removal` (a light WebAssembly model running directly inside the user's browser).
   - Processing time: 1.2 to 2.5 seconds on mobile & desktop devices.
   - Server cost: **$0.00 per image**.
2. **Secondary / Edge Fallback (Cloudinary / Edge API)**:
   - For low-spec mobile devices or browser fallbacks, the raw image is routed to Cloudinary AI Background Removal or a serverless endpoint.
   - Generates a optimized transparent PNG with alpha transparency (`image/png` or `.webp`).
3. **Color Palette & Edge Analysis**:
   - An in-browser HTML5 Canvas `getImageData()` parser extracts the 3 dominant HSL color tags (e.g., `#E2FF66` Electric Lime, `#000000` Black, `#FFFFFF` White) automatically to populate item search tags without user typing.

---

## 3. Database Schema & Data Models

### Supabase Postgres Entity-Relationship Model

```sql
-- 1. USERS & PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  style_interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PIECES (Individual Clothing Items in Closet)
CREATE TABLE pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'top', 'bottom', 'outerwear', 'footwear', 'bag', 'accessory', 'upcycled'
  original_image_url TEXT NOT NULL,
  cutout_image_url TEXT NOT NULL,
  dominant_colors TEXT[] DEFAULT '{}',
  brand_name TEXT,
  description TEXT,
  remix_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MIXES (Outfit Collages)
CREATE TABLE mixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rendered_image_url TEXT NOT NULL,
  technique_tags TEXT[] DEFAULT '{}', -- 'monochrome', 'color-blocking', 'streetwear x formal'
  likes_count INT DEFAULT 0,
  remix_chain_parent_id UUID REFERENCES mixes(id) ON DELETE SET NULL, -- Fork/Remix chain link
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MIX_PIECES (Junction table mapping pieces inside a mix collage)
CREATE TABLE mix_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id UUID NOT NULL REFERENCES mixes(id) ON DELETE CASCADE,
  piece_id UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  layer_order INT NOT NULL, -- Z-Index order (0 = back, N = front)
  transform_data JSONB NOT NULL -- { x, y, width, height, scale, rotation, flipX }
);

-- 5. SOCIAL FOLLOWS & ATTRIBUTION
CREATE TABLE follows (
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, following_id)
);

-- 6. DIRECT MESSAGES (Mutual follow gate enforced)
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attached_mix_id UUID REFERENCES mixes(id),
  attached_piece_id UUID REFERENCES pieces(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'remix', 'like', 'follow', 'comment'
  target_mix_id UUID REFERENCES mixes(id),
  target_piece_id UUID REFERENCES pieces(id),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Cost Management & Caching Strategy

| Resource | Caching / Cost Strategy | Expected Monthly Cost (MVP Stage) |
| :--- | :--- | :--- |
| **AI Cutout Engine** | 100% Client-side WASM processing (`@imgly/background-removal`). Zero server GPU cost. | **$0.00** |
| **Image CDN (Cutouts & Mixes)** | Cloudinary / Supabase Storage with aggressive WebP compression and long-tail browser cache headers (`Cache-Control: public, max-age=31536000`). | **Free Tier / < $10/mo** |
| **Database & Auth** | Supabase Postgres + RLS. Queries cached client-side via React Query / SWR with optimistic UI updates. | **Free Tier / $25/mo** |
| **Hosting** | Vercel Edge Network hosting for Next.js 16+ App Router. | **Free Tier / $20/mo** |

---

## 5. What Gets Cached vs. Generated Fresh

* **Cached Aggressively (Edge CDN / Browser)**:
  - Piece transparent cutout PNGs.
  - Final published Mix collage images.
  - User avatars and static asset graphics.
  - Category, color, and technique taxonomy lists.
* **Generated Fresh (Real-Time)**:
  - Mix Feed rankings (For You / Following algorithmic updates).
  - Unread notification badges and live socket counts.
  - Direct message conversation streams.
  - Interactive Remix Canvas live drag transform state (held in browser memory until publish).

---

## 6. Mobile-Native Decoupled API Contracts

All endpoints live cleanly under `/api/v1/` returning JSON payloads. This guarantees that when building the native iOS/Android mobile app in React Native / Expo, zero backend refactoring will be required.

* `GET /api/v1/feed?tab=for-you&page=1` -> Returns list of Mixes with nested piece owner details.
* `POST /api/v1/pieces` -> Accepts raw cutout image & metadata; returns newly created Piece object.
* `POST /api/v1/mixes` -> Accepts array of `mix_pieces` transform data + composite preview; handles automated notifications to all piece owners.
* `GET /api/v1/pieces/:id/remixes` -> Returns all Mixes featuring a specific Piece ("Remixed by N").
* `POST /api/v1/social/follow` -> Toggles user follow status.
* `GET /api/v1/messages/conversations` -> Fetches active chats (enforcing mutual follow logic).
