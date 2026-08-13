# FitMix Data Architecture Standard & Specification

> **MANDATORY SYSTEM SPECIFICATION**  
> Every existing and future feature in the FitMix codebase must strictly comply with this document.  
> No developer or AI agent may introduce un-normalized mutable user fields or bypass stable identity resolution.

---

## 1. Core Architectural Hierarchy

```
                      ┌─────────────────────────────────────────┐
                      │        SUPABASE POSTGRESQL DB           │
                      │     (Canonical Source of Truth)         │
                      └────────────────────┬────────────────────┘
                                           │
       ┌───────────────────────────────────┼───────────────────────────────────┐
       ▼                                   ▼                                   ▼
 Supabase Auth                    Supabase Realtime                   REST Query Engine
 Session Validation              Selective Change Events               Optimized SQL Joins
       │                                   │                                   │
       └───────────────────────────────────┼───────────────────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    CANONICAL CLIENT ENTITY CACHE        │
                      │    usersMap[userId] & mixesMap[mixId]   │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │       REACTIVE UI & MEMO SELECTORS      │
                      │   Derived dynamically via stable UUID   │
                      └─────────────────────────────────────────┘
```

---

## 2. Fundamental Architectural Rules

### Rule 1: Stable Identity Above All
- The immutable UUID (`profiles.id` matching `auth.users.id`) is the **only identity mechanism** for a user.
- Usernames, display names, avatars, and bios are **mutable presentation attributes** only.
- Foreign keys in all database tables MUST reference `profiles.id` (UUID). Never use usernames as relational keys.

### Rule 2: Single Source of Truth
- A user's profile metadata (`displayName`, `avatarUrl`, `username`, `bio`) exists authoritatively in `public.profiles`.
- Components MUST resolve profile information dynamically from `usersMap[userId]`.
- Content tables (`mixes`, `pieces`, `stories`, `comments`) MUST NOT store duplicate mutable profile fields for UI display.

### Rule 3: Database & State Hierarchy
- **Supabase PostgreSQL = Source of Truth**.
- **`localStorage` = Transient Cache Only**.
- Stale `localStorage` payloads must NEVER overwrite newer server state. Server state always wins during hydration and reconciliation.

### Rule 4: Fine-Grained Performance Optimization
- `usersMap` is updated immutably at the specific key level: `usersMap[userId] = updatedProfile`.
- Components use memoized selectors (`useUserProfile(userId)`) so that updating User A's profile re-renders **only UI elements displaying User A**, keeping the rest of the application unaffected.

### Rule 5: Scoped Realtime & Disconnection Recovery
- Realtime is enabled selectively for features where automatic background updates add user value (Profile updates, DMs, Comments, 24h Stories, Notifications).
- On Realtime disconnect/reconnect, the client performs a catch-up reconciliation query to re-sync any missed updates before resuming live event streams.

---

## 3. Entity Classification Matrix

| Entity | Canonical Source | Stable Primary Key | Relational Keys | Realtime Classification | Cache Update Strategy |
|---|---|---|---|---|---|
| **Profiles** | `public.profiles` | `id` (UUID) | None | **REALTIME ACTIVE** | `usersMap[userId]` key replacement |
| **Mixes** | `public.mixes` | `id` (string/UUID) | `creator_id -> profiles.id` | **REALTIME ACTIVE** | `mixesMap[mixId]` + `feedMixIds` prepend |
| **Pieces** | `public.pieces` | `id` (string/UUID) | `owner_id -> profiles.id` | **FETCH & CACHE ONLY** | `piecesMap[pieceId]` + closet list |
| **Stories** | `public.stories` | `id` (UUID) | `user_id -> profiles.id` | **REALTIME ACTIVE** | `storiesMap[storyId]` 24h active index |
| **Comments** | `public.comments` | `id` (UUID) | `mix_id -> mixes.id`, `user_id -> profiles.id` | **REALTIME ACTIVE** | `commentsByMix[mixId]` array append |
| **Likes** | `mix_likes` / `mixes` | `(mix_id, user_id)` | `mix_id`, `user_id` | **EVENT BROADCAST** | `likedMixIds` Set + count increment |
| **Follows** | `public.follows` | `(follower_id, following_id)` | `follower_id`, `following_id` | **REALTIME ACTIVE** | `followingUserIds` Set toggle |
| **Notifications**| `public.notifications` | `id` (UUID) | `user_id`, `actor_id -> profiles.id` | **REALTIME ACTIVE** | `notifications` array prepend + unread badge |
| **Direct Messages**| `public.direct_messages` | `id` (UUID) | `sender_id`, `receiver_id -> profiles.id` | **REALTIME ACTIVE** | `messagesByConversation` array append |
| **Saved Items** | `user_saved_items` | `(user_id, mix_id)` | `user_id`, `mix_id` | **FETCH & CACHE ONLY** | `savedMixIds` Set toggle |

---

## 4. Hydration, Cache & Reconciliation Lifecycle

```
1. APP INITIALIZATION
   ├── Load localStorage cache for immediate 0ms visual skeleton.
   └── Flag client state as `isStale: true`.

2. AUTHORITATIVE HYDRATION
   ├── Query Supabase `public.profiles` & core entities.
   ├── Replace stale cache in memory with server response.
   └── Update localStorage with fresh server snapshot.

3. MUTATION LIFECYCLE
   ├── User performs action (e.g. edit profile, like mix).
   ├── Apply OPTIMISTIC update to canonical entity in memory (`usersMap[id]`).
   ├── Execute background Supabase RPC/upsert.
   ├── SUCCESS: Reconcile with server response.
   └── FAILURE: Revert optimistic state and display toast notice.

4. REALTIME DISCONNECTION & RECOVERY
   ├── Event: Socket disconnect detected.
   ├── Action: Queue outgoing mutations; flag realtime connection status `offline`.
   ├── Event: Socket reconnected.
   ├── Action: Execute catch-up delta query: `WHERE updated_at > last_sync_timestamp`.
   └── Action: Merge delta into canonical entity maps and resume subscription stream.
```

---

## 5. Public Presentation Routes (`/closet/[username]`)

- `/closet/[username]` is a **presentation route**. It must never be used as a permanent identity key.
- Route Resolution Workflow:
  1. Component receives `params.username`.
  2. Resolves `username` against `usersMap` or queries Supabase `profiles` for `id`.
  3. Obtains canonical `userId` (UUID).
  4. Renders closet data using `userId`.
- If a user changes their handle from `@eyezyc` to `@eyezyccreed`, existing internal links dynamically resolve to `@eyezyccreed` via `userId`.

---

## 6. Developer Guidelines for Future Features

Before writing code for any new feature:
1. **Identify Stable ID**: Ensure the entity has a UUID primary key.
2. **Use Relational Foreign Keys**: Reference `profiles.id` for user relationships. Do not add `author_username` or `author_avatar` columns.
3. **Use Canonical Selectors**: Use `useUserProfile(userId)` to display user attributes in UI components.
4. **Register with Sync Engine**: Define mutation, Realtime subscription, and fallback reconciliation rules.
