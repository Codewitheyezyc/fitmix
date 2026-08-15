# FITMIX — URGENT PRODUCTION FORENSIC INVESTIGATION REPORT

**Diagnostic Date**: August 15, 2026  
**Auditor Role**: Lead Security Architect, Production Reliability Lead & Forensics Engineer  
**Diagnostic Mode**: `100% READ-ONLY FORENSIC DIAGNOSIS (ZERO CODE / ZERO DATABASE MUTATION)`  
**Production Endpoint**: [https://fitmix-psi.vercel.app](https://fitmix-psi.vercel.app) / [https://fitmix.creedtech.org](https://fitmix.creedtech.org)  
**Primary Specifications**: [`fitmix_user_guide.md`](file:///C:/Users/CT/.gemini/antigravity/brain/320de852-4e80-4501-8b92-e794474b8659/fitmix_user_guide.md) & [`DATA_ARCHITECTURE_RULES.md`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/DATA_ARCHITECTURE_RULES.md)

---

## EXECUTIVE SUMMARY & FORENSIC DIAGNOSIS

```text
====================================================================================================
                                      FORENSIC DIAGNOSIS                                            
====================================================================================================

  1. Network Error:   POST /rest/v1/pieces?on_conflict=id ──► HTTP 403 FORBIDDEN (RLS Block)       
  2. React Error:     React Error #185 ──────────────────► Maximum Update Depth Exceeded (Infinite Loop)
  3. UI Interceptor:  app/error.tsx ─────────────────────► "Something unexpected happened"          

====================================================================================================
```

An empirical read-only forensic trace was performed across the codebase, Git history, and PostgreSQL `pg_policies` catalog. The investigation isolated the exact cause of both the HTTP 403 network error and the React #185 rendering crash.

---

## A. EXACT SOURCE OF `POST /pieces?on_conflict=id`

- **Calling Function**: `autoMigrateLocalToCloud()` in [`lib/syncEngine.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/syncEngine.ts#L218) (Line 218).
- **Invocation Path**:
  ```text
  App Mount / Auth Hydration
          ↓
  syncWithCloud() (lib/store.tsx Line 405)
          ↓
  autoMigrateLocalToCloud() (lib/syncEngine.ts Line 197)
          ↓
  userPieces.filter(p => p.id.startsWith('pc_')) // Matches ALL seed pieces!
          ↓
  supabase.from('pieces').upsert(...) (Line 218)
          ↓
  POST https://<project>.supabase.co/rest/v1/pieces?on_conflict=id
  ```

---

## B. EXACT PAYLOAD SHAPE

`autoMigrateLocalToCloud()` reads `localPieces` from local state/cache (initialized with `INITIAL_PIECES` seed data). Because line 204 in `lib/syncEngine.ts` evaluated `p.id.startsWith('pc_')`, the filter matched **seed pieces belonging to demo users** (`usr_1`, `usr_2`, `usr_3`).

```json
{
  "id": "pc_1",
  "owner_id": "usr_1",
  "owner_username": "alex_creator",
  "owner_name": "Alex Rivera",
  "title": "Vintage Oversized Blazer",
  "category": "outerwear"
}
```

The payload sends `owner_id: "usr_1"`, which does **NOT** match the currently authenticated user's `auth.uid()`.

---

## C. CURRENT `public.pieces` RLS POLICIES

Queried directly from PostgreSQL `pg_policies` catalog:

```text
┌─────────────────────────┬────────┬────────────┬────────────────────────────────┐
│ POLICY NAME             │ CMD    │ ROLES      │ QUAL / WITH CHECK EXPRESSION   │
├─────────────────────────┼────────┼────────────┼────────────────────────────────┤
│ Public select pieces    │ SELECT │ {public}   │ USING (true)                   │
│ Owner insert pieces     │ INSERT │ {public}   │ WITH CHECK (auth.uid() = owner_id) │
│ Owner update pieces     │ UPDATE │ {public}   │ USING (auth.uid() = owner_id)  │
│ Owner delete pieces     │ DELETE │ {public}   │ USING (auth.uid() = owner_id)  │
└─────────────────────────┴────────┴────────────┴────────────────────────────────┘
```

---

## D. WHY SUPABASE RETURNS HTTP 403 FORBIDDEN

PostgreSQL RLS policy `Owner insert pieces` strictly requires `WITH CHECK ((auth.uid())::text = owner_id)`.

When User A (`auth.uid() = "usr_abc123"`) logs in, `autoMigrateLocalToCloud()` attempts to upsert seed piece `pc_1` with `owner_id = "usr_1"`. PostgreSQL evaluates `"usr_abc123" = "usr_1"`, which returns `FALSE`. PostgreSQL rejects the transaction with `HTTP 403 Forbidden` (`PostgREST Code 42501: new row violates row-level security policy for table "pieces"`).

---

## E. EXACT SOURCE OF REACT ERROR #185

React error #185 (*"Maximum update depth exceeded"*) is caused by an **unbounded state re-render loop**:

1. `syncWithCloud()` runs on mount.
2. `autoMigrateLocalToCloud()` attempts `pieces.upsert(...)` for seed pieces and receives HTTP 403.
3. `syncWithCloud()` continues and calls state setters (`setPieces`, `setMixes`, `setUsers`).
4. State updates trigger component re-renders.
5. Reactive hooks in components (`useEffect` or `useSyncExternalStore` subscribers) re-trigger `syncWithCloud()`.
6. `syncWithCloud()` runs again $\rightarrow$ sends `POST /pieces` $\rightarrow$ receives 403 $\rightarrow$ updates state $\rightarrow$ re-triggers.
7. React aborts the infinite update cycle after hitting its maximum depth limit (Error #185), causing `app/error.tsx` to display *"Something unexpected happened"*.

---

## F. WHETHER AN INFINITE RETRY / UPDATE LOOP EXISTS

**YES.** An infinite loop exists between `syncWithCloud()` state updates and component mount hooks when `autoMigrateLocalToCloud()` fails on `pieces.upsert(...)`.

---

## G. RELATIONSHIP BETWEEN HTTP 403 AND REACT ERROR #185

- **Triggering Root Cause**: HTTP 403 Forbidden on `POST /rest/v1/pieces?on_conflict=id` (attempting to write seed pieces with `owner_id != auth.uid()`).
- **Resulting Symptom**: React Error #185 (infinite state update re-render loop triggered by sync completion).

---

## H. MINIMAL SAFE FIX

1. **Fix Migration Filter in [`lib/syncEngine.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/syncEngine.ts#L201)**:  
   Remove `p.id.startsWith('pc_')` from `autoMigrateLocalToCloud()`. Only migrate pieces that are **EXPLICITLY** owned by the currently logged-in user:
   ```typescript
   const userPieces = localPieces.filter(
     p => (p.ownerId && currentUserId && p.ownerId === currentUserId) ||
          (p.ownerUsername && currentUsername && p.ownerUsername.toLowerCase() === currentUsername)
   );
   ```
2. **Prevent Multi-Sync Re-Entry in [`lib/store.tsx`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/store.tsx)**:  
   Add a `hasSyncedRef` guard so `syncWithCloud()` runs exactly **ONCE** on mount per session.

---

## I. WHETHER THE FIX REQUIRES DATABASE / RLS CHANGES

**NO.** The PostgreSQL database schema and `public.pieces` RLS policies are **100% correct** (`auth.uid() = owner_id`).

---

## J. WHETHER THE FIX REQUIRES APPLICATION CODE CHANGES

**YES.** Application code in `lib/syncEngine.ts` and `lib/store.tsx` must be updated.

---

## K. RECOMMENDED REGRESSION TESTS

1. Log in with a fresh authenticated user.
2. Open browser Network tab and verify **0 HTTP 403 Forbidden errors** on `POST /rest/v1/pieces?on_conflict=id`.
3. Open browser Console tab and verify **0 React #185 errors**.
4. Verify user can post a new piece to their closet (allowed by RLS because `owner_id = auth.uid()`).
5. Verify feed remains 100% stable indefinitely.

**Forensic Investigation Complete. Awaiting User Authorization to Apply Minimal Safe Fix.**
