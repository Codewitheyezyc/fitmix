# Blueprint Document 6 — User Journey

> **Product**: Fitmix  
> **Authors**: Senior Engineering & UI/UX Design Team (15+ Years Industry Experience)  
> **Status**: Approved  

---

## 1. End-to-End User Flow Architecture

```
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │  1. LANDING     │ ───►  │  2. ONBOARDING  │ ───►  │  3. HOME FEED   │
  │     PAGE        │       │     & AUTH      │       │     (MIXES)     │
  └─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                               │
        ┌──────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┐
        │                                                      │                                                      │
        ▼                                                      ▼                                                      ▼
┌─────────────────┐                                  ┌─────────────────┐                                  ┌─────────────────┐
│ 4. POST A PIECE │                                  │ 5. REMIX CANVAS │                                  │ 6. DISCOVER HUB │
│ (CUTOUT STUDIO) │                                  │ (FLAT-LAY OUTFIT)│                                  │ (SEARCH/TRENDS) │
└────────┬────────┘                                  └────────┬────────┘                                  └────────┬────────┘
         │                                                    │                                                    │
         └──────────────────────────┬─────────────────────────┴───────────────────────────┬────────────────────────┘
                                    │                                                     │
                                    ▼                                                     ▼
                          ┌──────────────────┐                                  ┌──────────────────┐
                          │ 7. MY CLOSET &   │                                  │ 8. NOTIFICATIONS │
                          │    PROFILE PAGE  │                                  │    & MESSAGING   │
                          └──────────────────┘                                  └──────────────────┘
```

---

## 2. Screen-by-Screen User Journey

### Screen 1: Landing Page & Hero Section (Pre-Signup View)
* **User Goal**: Feel an immediate "WOW" visual impression, understand the concept in under 5 seconds, and sign up.
* **15+ Year UI/UX Visual Specification**:
  - **Top Navigation Bar**: Fixed glassmorphic header (`backdrop-blur-xl`), `Fitmix.` wordmark logo with Electric Lime period (`#E2FF66`), Theme Mode Switcher (Dark/Light toggle), "Log In" button.
  - **Centered Hero Layout**:
    - **Headline (`<h1>`)**: Extra-bold editorial typography (Inter/Outfit 800+ weight, 48px-72px responsive font size) centered on screen:  
      **"Your closet. Everyone's creativity."**
    - **Subheadline**: Crisp, high-legibility subtitle centered below the headline:  
      *"Post your clothes. Let the community remix your pieces into stunning outfit collages."*
  - **Ambient Floating Glassmorphic Clothing Canvas**:
    - Suspended around the margins of the centered hero text are 4 to 6 **ambient glassmorphic floating bubbles**.
    - Each bubble contains a pristine cutout clothing item (e.g. Adidas Samba sneaker, vintage leather jacket, designer bag, bottle-cap upcycled shirt).
    - Styled with glassmorphism aesthetics (`background: rgba(255, 255, 255, 0.03)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255, 255, 255, 0.1)`).
    - Keyframe Micro-Animation: Slow, organic floating motion (`transform: translateY(-8px) rotate(2deg)`) that floats smoothly without obscuring the central headline text or buttons.
  - **CTA Button Group**: Centered Primary CTA in Electric Lime (`#E2FF66`) with hover glow: *"Start Remixing — Free Forever"* + Secondary CTA *"Watch How It Works"*.
  - **3-Step Visual Feature Row**: (1) Post a Piece (Auto AI Cutout) → (2) Drag & Remix → (3) Get Notified & Connect.

### Screen 2: Sign Up & Style Onboarding Flow
* **User Goal**: Create an account and state fashion preferences to personalize their feed.
* **Step 2A (Auth Modal)**: One-tap sign-in via Google, Apple, or Email/Password.
* **Step 2B (Profile Creation)**: Choose username (`@handle`), display name, and avatar picture.
* **Step 2C (Style Interest Selector)**: Interactive grid of interest pills (Streetwear, Vintage/Thrift, Minimalist, High Luxury, Avant-Garde, Upcycled/DIY). User selects 2+ pills.
* **Step 2D (First Action Choice)**: Prompted with two choices: *"Post your first piece now"* OR *"Explore the community feed"*.

### Screen 3: Home — Mix Feed (Main Dashboard)
* **User Goal**: Scroll inspiring flat-lay outfit collages, see who styled what, and hit "Remix".
* **UI Layout**:
  - Top Navigation Bar: Logo, Search trigger, Notification bell (with unread badge), Theme switcher, `+ Post Piece` CTA button.
  - Feed Mode Tabs: **For You** (Algorithmic recommendations) | **Following** (Mixes from followed users) | **Trending Pieces** (Items getting remixed most).
  - Mix Card Anatomy:
    - **Header**: Mixer avatar, `@username`, Follow/Following toggle button, timestamp.
    - **Collage Viewport**: Crisp flat-lay collage render showing arranged cutout items.
    - **Tagged Pieces Bar**: Horizontal scrollable drawer at bottom of card showing thumbnails of every piece used, item title, brand tag, and original owner (`@owner`). Tapping an item opens the Piece Showcase.
    - **Fashion Literacy Badge**: E.g., `Streetwear x Formal` or `Color-Blocking`.
    - **Interactive Action Bar**: Like (Heart button + count), Comment (Count), Save/Bookmark, **Remix This Look** (Electric Lime highlighted button), Share.

### Screen 4: Post a Piece Studio (Cutout Studio)
* **User Goal**: Turn a real photo of a clothing item into a background-free transparent cutout piece.
* **Step 4A (Capture/Upload)**: Drag-and-drop or camera snap of item.
* **Step 4B (Auto AI Processing)**: Live animation overlay ("Stripping background..."). In ~2 seconds, the background disappears.
* **Step 4C (Cutout Preview & Tweak)**: View item on transparency checkerboard. Optional slider to adjust edge cutout sensitivity.
* **Step 4D (Metadata Tagging)**:
  - Piece Title (e.g., *"Adidas Samba Black/White"*).
  - Category Dropdown (*Tops, Bottoms, Outerwear, Footwear, Bags, Accessories, Upcycled/DIY*).
  - Dominant Colors (Auto-detected color chips, e.g., `#000000`, `#FFFFFF`).
  - Optional Brand Tag (e.g., *"Adidas"*).
  - Optional Description / Styling notes.
* **Publish Action**: Tapping *"Publish to Closet"* saves the item to the user's closet, making it instantly remixable by the user and the community.

### Screen 5: The Interactive Remix Canvas Studio (Core Product Engine)
* **User Goal**: Drag, resize, rotate, and layer 2+ clothing pieces into a flat-lay outfit collage.
* **Trigger**: Tapping *"Remix"* on any public Piece or existing Mix.
* **UI Layout**:
  - Top Action Header: Back button, Canvas Background Picker (*Obsidian Dark, Studio Paper, Velvet, Dark Grid*), Reset button, **Publish Mix** CTA button.
  - Main Canvas Area: Interactive touch viewport with the starting piece pre-placed.
  - Piece Picker Bottom Drawer:
    - *Tab 1: My Closet* (User's own items).
    - *Tab 2: Community Pieces* (Search & browse items posted by others).
    - *Tab 3: Saved Items*.
  - Layer Control Toolbar (Floating overlay):
    - Bring Forward / Send Backward (Z-Index ordering).
    - Flip Horizontally.
    - Duplicate / Delete Layer.
  - Touch/Mouse Interactions: Smooth drag positioning, corner handles for scale and rotation.
  - Fashion Education Tagging Modal: Select 1+ styling techniques (e.g., *"Monochrome Layering"*) and add an optional plain-English *"Why this mix works"* note.
* **Publish Action**: Generates composite image render → saves Mix → automatically triggers notifications to every user whose piece was featured.

### Screen 6: My Closet & Public User Profiles
* **User Goal**: View a user's closet inventory, their posted mixes, and their remix impact stats.
* **UI Components**:
  - Profile Header: Avatar, Display Name, `@username`, Bio, Follower/Following metrics.
  - Impact Metric Badge: *"Pieces remixed 184 times by the community"*.
  - Action Controls: Edit Profile (for own profile), Follow / Direct Message button (for other users).
  - Content Tabs:
    - **Pieces**: Grid view of all cutout items in the user's closet.
    - **Mixes**: Grid of flat-lay outfit collages published by the user.
    - **Saved**: Bookmarked community lookboards.

### Screen 7: Piece Showcase & Remix Chain Tracker Page
* **User Goal**: Inspect a single clothing item and see every outfit combination created with it across Fitmix.
* **UI Components**:
  - Item Showcase Header: High-res isolated cutout image, title, category, brand tag, original owner attribution (`@owner`).
  - Primary CTA: *"Remix This Piece"* (Opens Remix Canvas with item pre-placed).
  - **"Remixed by (N)" Stream**: Scrolling grid of all community Mixes featuring this item, sortable by *Newest* or *Most Liked*.
  - Fashion Literacy Tooltip: Brief fashion history or styling advice for this item category.

### Screen 8: Discover & Search Hub
* **User Goal**: Find specific clothing items, styles, brands, or trending ideas.
* **UI Components**:
  - Global Search Bar: Real-time search by item name, color, category, brand tag, or user handle.
  - Section 1: **Trending Pieces** (The top 10 clothing items being remixed most this week).
  - Section 2: **Trending Styling Techniques** (Filter feed by techniques like *Contrast Textures* or *Streetwear x Formal*).
  - Section 3: **Mix of the Week Spotlight** (Featured editorial card with expert breakdown of a standout community mix).

### Screen 9: Social Notifications & Direct Messaging Drawer
* **User Goal**: Stay updated on remix interactions and chat directly with fellow fashion lovers.
* **Notifications Tab**: Real-time notifications for:
  - *"@alex remixed your Sambas into a new look!"*
  - *"@taylor liked your Mix"*
  - *"@jordan started following you"*
* **Direct Messaging Drawer**:
  - Mutual Follow Gate: Unlocks chat once two users follow each other.
  - Direct Mix Inquiry: Message button on any Mix allows sending a direct inquiry with the Mix card embedded inside the chat thread.
