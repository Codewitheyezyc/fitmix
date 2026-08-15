# FITMIX — SECOND-STAGE HYDRATION FORENSIC REPORT

**Diagnostic Date**: August 15, 2026  
**Auditor Role**: Lead Architecture & Hydration Forensics Engineer  
**Diagnostic Mode**: `100% READ-ONLY FORENSIC DIAGNOSIS (ZERO CODE / ZERO DATABASE MUTATION)`  
**Production Endpoint**: [https://fitmix-psi.vercel.app](https://fitmix-psi.vercel.app)  
**Primary Specifications**: [`fitmix_user_guide.md`](file:///C:/Users/CT/.gemini/antigravity/brain/320de852-4e80-4501-8b92-e794474b8659/fitmix_user_guide.md) & [`DATA_ARCHITECTURE_RULES.md`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/DATA_ARCHITECTURE_RULES.md)

---

## EXECUTIVE SUMMARY & PROVEN ROOT CAUSE

```text
====================================================================================================
                                      FORENSIC FINDING                                              
====================================================================================================

  1. Root Cause File:  lib/userStore.ts (Line 174)                                                 
  2. Root Cause Code:  getSnapshot() returns `{ ...u, isFollowing: ... }` (New Object Every Call) 
  3. React Failure:    Object.is(prevSnapshot, nextSnapshot) === FALSE on EVERY render tick          
  4. Hydration Result: Selective Hydration Exception (React #461) & Update Depth Exceeded (#185) 

====================================================================================================
```

Pursuant to your second-stage forensic directive, an exhaustive read-only inspection was performed across `lib/store.tsx`, `lib/userStore.ts`, `app/page.tsx`, `app/layout.tsx`, and all landing page components. 

The investigation **conclusively disproved** that `isAuthReady` skeleton toggling causes a structural SSR mismatch (as Server and Initial Client renders output the **exact same skeleton HTML**). Instead, the investigation isolated the **exact smoking gun** inside [`lib/userStore.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/userStore.ts#L174): `useSyncExternalStore`'s `getSnapshot()` returned a new object reference on every single invocation, violating React's store referential stability contract.

---

## 1. EXACT SERVER RENDER STATE

When Next.js pre-renders `app/page.tsx` on the server:
- `isAuthReady = false`
- `isAuthenticated = false`
- `currentUser = CURRENT_USER` (`id: 'usr_guest'`, `username: 'guest'`)
- `pieces = INITIAL_PIECES`
- `mixes = INITIAL_MIXES`
- `HomePage` Line 24: `if (!isAuthReady) return <LoadingSkeleton />`
- **Output HTML**: `<div className="min-h-screen flex items-center justify-center ...">F.</div>`

---

## 2. EXACT FIRST CLIENT RENDER STATE (BEFORE EFFECTS)

When the browser receives the HTML and mounts `StoreProvider` before `useEffect` executes:
- `isAuthReady = false`
- `isAuthenticated = false`
- `currentUser = CURRENT_USER`
- `pieces = INITIAL_PIECES`
- `mixes = INITIAL_MIXES`
- `HomePage` Line 24: `if (!isAuthReady) return <LoadingSkeleton />`
- **Output VDOM**: `<div className="min-h-screen flex items-center justify-center ...">F.</div>`
- **PROOFS**:
  $$\text{Server Initial Output} \equiv \text{Client First Render Output}$$
  Both render the identical `<LoadingSkeleton />`. Therefore, the `isAuthReady` skeleton pattern is **100% compliant with React's official 2-pass hydration specification**.

---

## 3. EXACT POST-EFFECT STATE

Inside `StoreProvider` (`lib/store.tsx`), `useEffect` runs asynchronously after mount:
1. Hydrates theme, auth token, and cached store objects from `localStorage`.
2. Calls `setIsAuthReady(true)` at line 378.
3. `HomePage` re-renders with `isAuthReady = true`.
4. Evaluates `!isAuthReady` as `FALSE` and renders the full landing page: `<HeroSection>`, `<HowItWorks>`, `<MixOfTheWeek>`, `<MixCard>` list, and `<Footer>`.

---

## 4. `useStore()` IMPLEMENTATION ANALYSIS

`useStore()` in [`lib/store.tsx`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/store.tsx#L1176) is a standard `React.createContext` provider and hook. It manages top-level application state using standard React `useState` hooks. It does NOT use `useSyncExternalStore` or mutable global variables for its primary context value.

---

## 5. `userStore` IMPLEMENTATION ANALYSIS

[`lib/userStore.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/userStore.ts) is an external store that provides fine-grained, per-user profile subscriptions using `useSyncExternalStore`. Every `<MixCard />` component rendered on the landing page calls:
```typescript
const creatorProfile = useUserProfile(mix.creatorId, mix.creatorUsername);
```

---

## 6. `getSnapshot` / `getServerSnapshot` REFERENTIAL INSTABILITY ANALYSIS

Lines 171–185 in [`lib/userStore.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/userStore.ts#L171-L185):

```typescript
// DANGEROUS IMPLEMENTATION IN LIB/USERSTORE.TS LINES 171-185:
() => {
  const u = usersMap.get(userId);
  if (u) {
    return { ...u, isFollowing: followingUserIdsSet.has(userId) }; // 🔴 BUG: CREATES NEW OBJECT ON EVERY CALL!
  }
  return getFallbackProfile(userId, usernameHint);
}
```

### Why This Breaks React Hydration:
React's `useSyncExternalStore` requires `getSnapshot()` to be **referentially stable**:
$$\text{Object.is}(getSnapshot(), getSnapshot()) \equiv \text{TRUE}$$
Because line 174 executed `{ ...u, isFollowing: ... }`, every single call to `getSnapshot()` returned a **brand new object in heap memory**. 

When React mounted `<MixCard />` during hydration, React called `getSnapshot()` twice to verify store stability. Because `Object.is(snapshot1, snapshot2)` evaluated to `FALSE`, React concluded that the external store was mutating continuously during hydration, leaking internal **React Error #461** and triggering infinite update loop **React Error #185**.

---

## 7. LOCAL STORAGE ACCESS AUDIT

All `localStorage` accesses across all application components are correctly placed inside `useEffect` hooks or async action handlers (100% SSR safe):
- `lib/store.tsx`: Lines 170, 175, 178, 187, 190, 392 (Inside `useEffect` or async actions) $\rightarrow$ **SAFE**
- `OnboardingGate.tsx`: Line 13 (Inside `useEffect`) $\rightarrow$ **SAFE**
- `Navbar.tsx`, `HeroSection.tsx`, `MixCard.tsx`, `Footer.tsx`: 0 accesses during render $\rightarrow$ **SAFE**

---

## 8. LANDING COMPONENT HYDRATION AUDIT

- `HeroSection.tsx`: Clean static/props markup $\rightarrow$ **SAFE**
- `HowItWorks.tsx`: Clean static markup $\rightarrow$ **SAFE**
- `MixOfTheWeek.tsx`: Clean static/props markup $\rightarrow$ **SAFE**
- `Footer.tsx`: Clean static markup $\rightarrow$ **SAFE**
- `MixCard.tsx`: Calls `useUserProfile()`, which invokes `useSyncExternalStore` with unstable `getSnapshot()` in `lib/userStore.ts` $\rightarrow$ **UNSTABLE (SOURCE OF FAILURE)**

---

## 9. REACT #461 CALL-STACK MAPPING

```text
React Hydration Scheduler (hydrateRoot)
       │
       ▼
useSyncExternalStore (React Core)
       │
       ▼
getSnapshot() in lib/userStore.ts (Line 174)
       │  └── Returns `{ ...u, isFollowing: ... }` (New Reference)
       │  └── Object.is(prev, next) === FALSE
       │
       ▼
Selective Hydration Exception (React Minified Error #461)
       │
       ▼
app/error.tsx Boundary Interceptor
       │
       ▼
"Something unexpected happened" UI
```

---

## 10. RELATIONSHIP BETWEEN REACT #461 AND REACT #185

- **React Error #461** (*Selective Hydration Exception*):  
  Occurs during initial client hydration when React's selective hydration scheduler runs `getSnapshot()` on `useSyncExternalStore()` in `MixCard.tsx` and receives a new object reference on every call.
- **React Error #185** (*Maximum Update Depth Exceeded*):  
  Occurs when React attempts to recover from the snapshot instability or repeated state updates, looping continuously as `getSnapshot()` returns a new object reference on every single re-render tick until the update depth limit is hit (100 re-renders).

Both errors share a **COMMON ROOT CAUSE**: Unstable object reference returned by `getSnapshot()` in `lib/userStore.ts`.

---

## 11. EXACT ROOT CAUSE

Referential instability in `getSnapshot()` and `getServerSnapshot()` inside `lib/userStore.ts` lines 174 & 182, where a new object literal `{ ...u, isFollowing: ... }` is instantiated on every snapshot evaluation.

---

## 12. EXACT FILE AND LINE NUMBER

- **Primary File**: [`lib/userStore.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/userStore.ts#L174) — Line 174 & Line 182.

---

## 13. MINIMAL SAFE FIX RECOMMENDATION

In [`lib/userStore.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/userStore.ts#L174), return the cached `u` reference directly from `usersMap.get(userId)` inside `getSnapshot()` and `getServerSnapshot()`, since `u.isFollowing` is already computed and stored inside `usersMap` in `setUserProfile()` line 89 (`isFollowing: computedIsFollowing`) and `toggleFollowingUserId()` line 53:

```typescript
// MINIMAL SAFE FIX IN LIB/USERSTORE.TS:
export function useUserProfile(userId: string, usernameHint?: string): UserProfile {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!userId) return () => {};
      let set = userListeners.get(userId);
      if (!set) {
        set = new Set();
        userListeners.set(userId, set);
      }
      set.add(onStoreChange);
      return () => {
        set?.delete(onStoreChange);
        if (set?.size === 0) {
          userListeners.delete(userId);
        }
      };
    },
    () => usersMap.get(userId) || getFallbackProfile(userId, usernameHint),
    () => usersMap.get(userId) || getFallbackProfile(userId, usernameHint)
  );
}
```

---

## 14. REGRESSION TESTS REQUIRED

1. Open `https://fitmix-psi.vercel.app/` in a fresh incognito window.
2. Verify **0 React Error #461** exceptions in Chrome DevTools Console.
3. Verify **0 React Error #185** exceptions in Chrome DevTools Console.
4. Verify unauthenticated landing page renders immediately and stays mounted cleanly.
5. Log in as an authenticated user and verify `<LoggedInDashboard />` renders without error.

**Second-Stage Forensic Investigation Complete. Awaiting User Authorization to Apply Fix.**
