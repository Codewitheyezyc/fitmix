# FITMIX — PHASE 3.4 STORAGE ARCHITECTURE & OWNERSHIP COMPATIBILITY AUDIT

**Audit Date**: August 14, 2026  
**Auditor Role**: Lead Security Architect & Storage Infrastructure Auditor  
**Audit Mode**: `READ-ONLY AUDIT (0 CODE OR DATABASE MUTATIONS EXECUTED)`  
**Primary Specifications**: [`fitmix_user_guide.md`](file:///C:/Users/CT/.gemini/antigravity/brain/320de852-4e80-4501-8b92-e794474b8659/fitmix_user_guide.md) & [`DATA_ARCHITECTURE_RULES.md`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/DATA_ARCHITECTURE_RULES.md)  
**Status**: `READ-ONLY AUDIT COMPLETE (AWAITING MIGRATION AUTHORIZATION)`

---

## 1. EXECUTIVE SUMMARY & KEY FINDINGS

```text
====================================================================================================
                                      READ-ONLY AUDIT STATUS                                        
====================================================================================================

                     READ-ONLY COMPLETED — AWAITING MIGRATION AUTHORIZATION                         

====================================================================================================
```

Pursuant to instructions, a **READ-ONLY empirical audit** of the FitMix storage architecture was conducted across `lib/storageUpload.ts`, `lib/storage.ts`, and live PostgreSQL `storage.objects` catalog records.

### Critical Discoveries
1. **Flat Storage Path Structure**: FitMix currently generates flat file names without subfolders:
   - Avatars: `avatar_{userId}_{timestamp}_{random}.jpg`
   - Pieces: `piece_{pieceId}_{timestamp}_{random}.jpg`
   - Mixes/Stories: `story_{storyId}_{timestamp}_{random}.jpg`
2. **Incompatibility with `storage.foldername()` Policy**: Because uploaded files are stored flat (e.g. `avatars/avatar_123.jpg`), the expression `auth.uid()::text = (storage.foldername(name))[1]` evaluates to `NULL`. Applying folder-based RLS policies without refactoring upload code would immediately **BLOCK ALL USER UPLOADS**.
3. **Supabase Native `storage.objects.owner` Column**: Supabase Storage automatically populates `storage.objects.owner` (type `uuid`) with `auth.uid()` upon upload by an authenticated user.
4. **Two Available Hardening Paths**:
   - **Path A (Zero Code Change)**: Enforce strict per-user ownership using PostgreSQL column condition `auth.uid() = owner` on UPDATE and DELETE.
   - **Path B (Folder Path Refactoring)**: Update `lib/storageUpload.ts` to format file paths as `${userId}/avatar.webp` and apply `(storage.foldername(name))[1] = auth.uid()`.

---

## 2. EMPIRICAL STORAGE OBJECT PATH INSPECTION

Verified directly against PostgreSQL `storage.objects` table:

```text
┌──────────────────────────────────────┬─────────────┬────────────────────────────────────────────────────────┬──────────────────────────────────────┐
│ OBJECT ID                            │ BUCKET ID   │ ACTUAL STORED OBJECT NAME (`name`)                     │ OWNER UUID (`storage.objects.owner`) │
├──────────────────────────────────────┼─────────────┼────────────────────────────────────────────────────────┼──────────────────────────────────────┤
│ 78c2cb28-16d9-4da7-834a-075de2c5e095 │ avatars     │ avatar_80b577eb-7e56-4177-90fc-ca3431ad62ea_...jpg     │ 80b577eb-7e56-4177-90fc-ca3431ad62ea │
│ 99da5004-7246-4388-8d31-29303b381c9c │ pieces      │ piece_pc_1786523627477_1786568418616_0pamq.jpg         │ 80b577eb-7e56-4177-90fc-ca3431ad62ea │
│ 2c21ae1b-9d8c-44ad-95be-c1c35de53d83 │ avatars     │ avatar_80b577eb-7e56-4177-90fc-ca3431ad62ea_...jpg     │ 80b577eb-7e56-4177-90fc-ca3431ad62ea │
└──────────────────────────────────────┴─────────────┴────────────────────────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 3. EXISTING STORAGE RLS POLICIES AUDIT

Verified directly against `pg_policies` catalog for table `storage.objects`:

```text
┌───────────────────────────────────────┬────────┬────────────────────────────────────────────────────────┐
│ POLICY NAME                           │ CMD    │ CURRENT QUALIFICATION / CHECK EXPRESSION               │
├───────────────────────────────────────┼────────┼────────────────────────────────────────────────────────┤
│ Public avatars access                 │ SELECT │ (bucket_id = 'avatars'::text)                          │
│ Public mixes access                   │ SELECT │ (bucket_id = 'mixes'::text)                            │
│ Public pieces access                  │ SELECT │ (bucket_id = 'pieces'::text)                           │
├───────────────────────────────────────┼────────┼────────────────────────────────────────────────────────┤
│ Authenticated insert avatars bucket   │ INSERT │ (bucket_id = 'avatars' AND auth.role() = 'authenticated')│
│ Authenticated update avatars bucket   │ UPDATE │ (bucket_id = 'avatars' AND auth.role() = 'authenticated')│
│ Authenticated delete avatars bucket   │ DELETE │ (bucket_id = 'avatars' AND auth.role() = 'authenticated')│
├───────────────────────────────────────┼────────┼────────────────────────────────────────────────────────┤
│ Authenticated insert pieces bucket    │ INSERT │ (bucket_id = 'pieces' AND auth.role() = 'authenticated') │
│ Authenticated update pieces bucket    │ UPDATE │ (bucket_id = 'pieces' AND auth.role() = 'authenticated') │
│ Authenticated delete pieces bucket    │ DELETE │ (bucket_id = 'pieces' AND auth.role() = 'authenticated') │
├───────────────────────────────────────┼────────┼────────────────────────────────────────────────────────┤
│ Authenticated insert mixes bucket     │ INSERT │ (bucket_id = 'mixes' AND auth.role() = 'authenticated')  │
│ Authenticated update mixes bucket     │ UPDATE │ (bucket_id = 'mixes' AND auth.role() = 'authenticated')  │
│ Authenticated delete mixes bucket     │ DELETE │ (bucket_id = 'mixes' AND auth.role() = 'authenticated')  │
└───────────────────────────────────────┴────────┴────────────────────────────────────────────────────────┘
```

### Current Vulnerability Window
While anonymous users cannot insert, update, or delete objects, any authenticated user can currently update or delete an object owned by another user if they specify its exact file name, because `UPDATE` and `DELETE` policies do not verify `auth.uid() = owner`.

---

## 4. PROPOSED HARDENING OPTIONS & COMPARISON

### Option A: `owner` Column Hardening (Zero Code Modifications Required)

We can update `storage.objects` RLS policies to check `auth.uid() = owner` directly:

```sql
-- Hardening via Supabase Native owner column:
CREATE POLICY "Owner update avatars bucket" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Owner delete avatars bucket" ON storage.objects 
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Owner update pieces bucket" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'pieces' AND auth.uid() = owner);

CREATE POLICY "Owner delete pieces bucket" ON storage.objects 
  FOR DELETE USING (bucket_id = 'pieces' AND auth.uid() = owner);

CREATE POLICY "Owner update mixes bucket" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'mixes' AND auth.uid() = owner);

CREATE POLICY "Owner delete mixes bucket" ON storage.objects 
  FOR DELETE USING (bucket_id = 'mixes' AND auth.uid() = owner);
```

**Pros**:
- Works instantly with existing stored objects and existing client code.
- Zero risk of breaking current file URLs.
- Prevents Account B from updating or deleting Account A's uploaded storage objects.

---

### Option B: Folder Path Refactoring (`{userId}/filename`)

Update client code in `lib/storageUpload.ts` to prepend `${userId}/`:

```typescript
const filePath = `${userId}/${fileNamePrefix}_${Date.now()}.webp`;
```

And apply folder-based RLS policies:
```sql
CREATE POLICY "Owner insert avatars" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);
```

**Affected Code Locations for Option B**:
1. [`lib/storageUpload.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/storageUpload.ts)
2. [`lib/storage.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/storage.ts)
3. [`app/settings/page.tsx`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/app/settings/page.tsx)
4. [`components/piece/UploadPieceModal.tsx`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/components/piece/UploadPieceModal.tsx)
5. [`lib/syncEngine.ts`](file:///c:/Users/CT/Documents/Applications/Creed%20Tech%20Products/fitmix/lib/syncEngine.ts)

---

## 5. RECOMMENDED NEXT STEPS

1. **User Decision & Authorization**: Choose Option A (`auth.uid() = owner` column check) for zero-breakage native protection, or Option B (folder refactoring).
2. **Execution**: Execute the chosen migration upon explicit authorization.
3. **Attack Suite Regression**: Test Anonymous $\rightarrow$ Owner (Account A) $\rightarrow$ Attacker (Account B) operations.
