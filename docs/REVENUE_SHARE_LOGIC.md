# Ascend Academy: Revenue Share vs. Auto Pool/Global Income Analysis

## 1. Terminology Decoding
*   **Old PHP Website**: Used `Auto Pool` and `Global Income` interchangeably.
*   **New Architecture**: Consistently uses `Revenue Share` as the unified term for the "Global Company Structure" income.

## 2. Logic Comparison: Is it Identical?
**YES.** The logic has been ported directly. The `processRevenueShareTree` function in `incomeDistribution.ts` implements the exact structured tree logic found in typical "Auto Pool" systems.

### The "Auto Pool" Logic (Now "Revenue Share"):
1.  **Placement**: When a user joins, they are placed in a **Company-Wide Tree** (Not just their sponsor's tree).
    *   It looks for a spot under their Sponsor's "Revenue Share Node".
    *   It fills: Left -> Mid -> Right (3x Matrix Structure).
2.  **Trigger**: Income is NOT triggered by views. It is triggers by **Tree Completion**.
    *   When a node gets 3 people under it => Level 1 Complete.
    *   When those 3 get 3 each (Total 12) => Level 2 Complete.
3.  **Milestones**: The code checks specifically for:
    *   3 Members (Level 1)
    *   12 Members (Level 2)
    *   39 Members (Level 3)
    *   ...up to 9840 Members (Level 8)

## 3. Income Split Breakdown (The "Rupee Split")
When a Commission is calculated (e.g., ₹1000 Revenue Share Bonus):

| Component | Share | Logic Used |
| :--- | :--- | :--- |
| **User Wallet** | **90%** (₹900) | `amount * 0.90` inside `creditWallet()` |
| **System/Admin/Upgrade** | **10%** (₹100) | `amount * 0.10` implicitly deducted |
| **Global Pool** | **N/A** | This specific income *is* the payout from the pool. It doesn't feed another pool. |

**Note**: The "10% System Fee" is technically labeled as "Auto-Upgrade Deduction" in the logs, which matches your old "Auto Pool Upgrade" terminology.

## 4. Consistency Check
*   **Database**: Uses table `revenue_share_tree` and column `revenue_share_level_X`. (Clean).
*   **Admin Panel**: Uses label "Revenue Share Income".
*   **User Dashboard**: Uses label "Revenue Share" in the wallet history.
*   **Old Terms**: searched for "Auto Pool" -> **0 Results**. The migration to "Revenue Share" is complete and consistent.

## 5. Workflow Trigger (Critical)
*   **Does a Video View trigger this?** **NO.**
*   **What triggers this?** **New Package Purchases.**
    *   User A buys Package -> User A is placed in Tree -> Upline's Team Count increases -> If Upline hits 3/12/39/etc -> **Upline gets Revenue Share Income**.
*   **Video Income** is a completely separate stream called "Task Income".

### Summary
The `Revenue Share` system is your old `Auto Pool`. It is a **3x Matrix Company Tree** that pays out milestones based on how many people fall into your structure. It is separate from the Video/Task income.
