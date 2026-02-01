### Security Audit & Hardening Report

#### 1. Rate Limiting
- **Current State**: Client-side logic acts directly with Supabase via `@supabase/supabase-js`.
- **Recommendation**: Since the application is a Single Page Application (SPA), true rate limiting must be enforced at the Edge (Cloudflare) or Supabase level.
- **Action Taken**: 
    - The Supabase client in `src/integrations/supabase/client.ts` is configured correctly.
    - **Future Step**: Users should enable "Rate Limiting" in the Supabase Dashboard under *Settings > API*.

#### 2. Input Validation (Harden Register.tsx)
- **Current State**: Basic HTML5 validation (`required`) and simple password checks.
- **Action Taken**: I will implement strict Zod Validation in `Register.tsx` to prevent invalid data from reaching the API.

#### 3. API Key Security
- **Current State**: Keys are accessed via `import.meta.env`, which is correct for Vite.
- **Action Taken**: I have created a `.env` template file to encourage moving keys out of code if they were ever hardcoded (checked and they are not).

#### 4. Income Logic Comparison

| Feature | Old Website (PHP) | New Website (React/Supabase) | Difference |
| :--- | :--- | :--- | :--- |
| **Trigger** | Instant on payment gateway callback (or manual approval) | Admin Manual Approval | **New: Safer.** Admin verifies payment first. |
| **Logic Location** | `function.php` | `src/lib/incomeDistribution.ts` | **New: Modular & Typed.** |
| **Split Logic** | 90% Wallet / 10% Upgrade (Hardcoded) | 90% Wallet / 10% Upgrade (Hardcoded) | **Identical Behavior.** |
| **Referral Income** | Fixed amount based on package | Fixed amount based on Package Settings | **New: Dynamic Admin Settings.** |
| **Level Income** | 12 Levels deep loop | 12 Levels deep loop | **Identical Behavior.** |
| **Spillover** | Checks specific downline counts (5, 30, etc.) | Checks `spillover_count` column | **Identical Logic**, new implementation. |
| **History** | Logs gross amount in history | Logs gross amount + explicit deduction note | **New: Transparent.** Logs deduction clearly. |

---
### Next Steps
I will now apply the **Zod Validation** to the Registration form to complete the security hardening request.
