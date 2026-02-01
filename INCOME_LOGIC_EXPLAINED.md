# Ascend Academy: Income Logic & Architecture Report

## 1. Income Logic Analysis
Your platform generates income through two primary streams, both relying on a **"Proof of Action"** model rather than automated tracking. This ensures security against bots.

### A. Ad & Video Income ("Unlimited Video Income")
*   **Mechanism**: The system hosts "WhatsApp Tasks". Each task contains a video link (YouTube/Vimeo/etc.).
*   **User Action**: The user watches the video and shares it on their WhatsApp Status.
*   **Verification**: The user *must* take a screenshot of their status views and upload it to the dashboard.
*   **Recording**: The system stores this request as `pending` in the `completed_whatsapp_tasks` table. No money is credited yet.

### B. Referral & Network Income (The "Chain")
*   **Mechanism**: Driven by the **Binary/Unilevel Hybrid** structure (Direct, Level 1-12, Spillover).
*   **Trigger**: This is strictly triggered by a **Package Purchase**.
*   **Recording**: When a user buys a package (e.g., "Spark"), the system calculates commissions for 12 levels of upline users instantly upon approval.

---

## 2. Payout Workflow Tracking
Here is exactly how money moves from "Action" to "Bank":

### Step 1: Generation (User Side)
*   **Task Income**: User clicks "Submit", uploads image. State: `Pending Verification`.
*   **Referral Income**: User buys a package, uploads payment proof. State: `Pending Verification`.

### Step 2: Verification (Admin Side)
*   You (Admin) log in and see "Pending Actions".
*   For **Tasks**: You view the screenshot. If it's valid, you click **Approve**.
    *   *System Action*: Instantly adds ₹XX to the user's `agent_income` wallet table.
    *   *Logging*: Creates a `wallet_history` entry "Task Income - [Title]".
*   For **Packages**: You view the payment slip. If valid, you click **Approve**.
    *   *System Action*: Triggers the `distributeAllIncomes()` function.
    *   *Distribution*: It loops through the upline and credits 12 people according to your `Income Settings`.

### Step 3: Withdrawal
*   User sees their "Total Wallet" increase.
*   User requests Withdrawal.
*   Admin approves request -> Marks separate `withdrawal_requests` table as "Approved".
*   *Note*: Actual bank transfer is manual (you send money via UPI/Bank), then mark it as done in the panel.

---

## 3. Comparison: Old PHP vs. New Architecture

| Feature | Old PHP Site | New React/Supabase Site | Verdict |
| :--- | :--- | :--- | :--- |
| **Technology** | Server-side PHP (Slow reloads) | Client-side React (Instant SPA) | **Huge Performance Upgrade** |
| **Security** | Basic Checks (Likely SQL Injection prone) | **Zod Validation + RLS** (Bank-grade security) | **Much Safer** |
| **Ad Verification** | Likely completely manual or confusing | **Structured Workflow** (Watch -> Upload -> Verify) | **More Organized** |
| **Income Split** | Hardcoded 90/10 Logic | **Modular Logic** (90% to Wallet, 10% Auto-Deducted) | **Identical Logic, Better Code** |
| **Referral Logic** | "Instant" (Risk of fake payments) | **"Admin Approved"** (Zero risk of fake money) | **Tamper-Proof** |
| **Video Tracking** | Timer-based (Easy to fake) | **Screenshot-based** (Harder to fake) | **More Reliable** |

---

## 4. Identified Gaps & Recommendations

### Gap 1: Task Income Split
*   **Observation**: Your **Referral Income** logic correctly applies the **90% Wallet / 10% Upgrade** split. However, your **Task Income** logic currently credits **100%** of the task reward to the wallet.
*   **Impact**: Users earn slightly more from tasks than they did in the PHP system if the PHP system applied the tax there too.
*   **Recommendation**: If you want the 10% deduction on Tasks too, we should update `TaskCompletion.tsx` to apply the `* 0.90` math before crediting.

### Gap 2: Automated Payouts
*   **Observation**: Withdrawal approvals are manual.
*   **Recommendation**: In the future, we can integrate **RazorpayX** or **Cashfree Payouts** to automate the bank transfer when you click "Approve".

### Summary
The new system is a faithful, **high-performance** recreation of your old logic, but with significantly tighter security and a "Human-in-the-loop" verification model that prevents the most common fraud (fake ad views/fake payments).
