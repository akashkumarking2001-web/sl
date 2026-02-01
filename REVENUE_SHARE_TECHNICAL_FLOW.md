# Revenue Share (Auto Pool) - Technical Workflow Explanation

## 1. Tree Formation & Structure
*   **Table Used**: `revenue_share_tree`
*   **Structure Type**: **3x Matrix** (Ternary Tree).
    *   Each user is a "Node".
    *   Each Node has exactly **3 Slots** below it: `left_pos`, `mid_pos`, and `right_pos`.
*   **Entry Rule**:
    *   **Single Entry**: A user enters the tree **ONCE** per Package Type.
    *   If you buy "Spark", you get one spot in the "Spark Tree".
    *   If you later buy "Momentum", you get a new separate spot in the "Momentum Tree".
    *   **Current Logic**: You cannot have multiple "Spark" positions.

## 2. Positioning & Seniority
*   **Seniority**: Strictly based on **Joining Timestamp** (First Come, First Served) relative to the Sponsor.
*   **Positioning Logic**:
    *   The system looks at your **Direct Sponsor's Node**.
    *   It checks slots in this specific order:
        1.  **Left** (Is it empty? Put new user here).
        2.  **Mid**  (Is Left full? Put new user here).
        3.  **Right** (Is Mid full? Put new user here).
    *   **Spillover Note**: The current implementation places you directly under your *Sponsor*. If your Sponsor's 3 slots are full, the current code **does not automatically spill** to the next level down (Grandchild).
    *   **Warning**: The current code (`processRevenueShareTree`) only checks the *immediate* sponsor's 3 slots. If the sponsor has >3 directs, the 4th, 5th, etc., might not be placed in the tree correctly or might overwrite. *This is a potential logic gap compared to a Global Auto-Fill pool.*

## 3. Step-by-Step Income Flow (1 Unit)
Let's trace **₹1,000** assigned as Revenue Share for Level 2.

*   **Step 1: Action**
    *   User B buys a package.
    *   Admin approves the package.
*   **Step 2: Tree Entry**
    *   System finds User B's Sponsor (User A).
    *   System puts User B in User A's `revenue_share_tree` row (e.g., in `mid_pos`).
    *   System increments User A's `downline_count`.
*   **Step 3: Check Completion**
    *   System checks User A's total count.
    *   *Example*: If User A just hit **12 members** (Level 2 threshold).
*   **Step 4: Payout**
    *   System looks up `revenue_share_level_2` amount in Admin Settings (e.g., ₹1,000).
    *   System calculates Net: ₹900 (Wallet) + ₹100 (Upgrade Fee).
    *   Credits ₹900 to User A's Wallet.
    *   Logs transaction: "Revenue Share Income - Level 2 Complete".

## 4. Sustainability & Limits
*   **Cycle Break**: **YES**.
    *   The system only pays for fixed levels (Level 1 to Level 8).
    *   **Max Level**: Level 8 (9,840 members).
    *   Once a user completes Level 8, they stop earning Revenue Share from that specific position. There is no infinite loop.

## 5. Critical Technical Note
The current implementation in `incomeDistribution.ts` places users **only** in their direct Sponsor's row (`left`, `mid`, `right`).
*   **Scenario**: Sponsor A refers 4 people.
    *   Person 1 -> Left.
    *   Person 2 -> Mid.
    *   Person 3 -> Right.
    *   Person 4 -> **Will fail to place or overwrite** because the logic doesn't "search deep" for the next empty spot in the global tree.
*   **Is this different from your Old Site?**
    *   If your old site was a "Global Auto Pool" (Company fills top-to-bottom, left-to-right regardless of sponsor), **this logic is different**. This is currently a "Sponsor-forced 3x Matrix".
    *   **Recommendation**: If you wanted a true "Global Company Autopill", we need to change the logic to fetch the *Global Root* and find the absolute next empty spot, ignoring who the sponsor is.
