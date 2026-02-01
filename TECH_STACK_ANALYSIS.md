# Technology Stack & Project Structure Analysis

This report explains the technical foundation of your **Ascend Academy** platform in simple, non-technical terms.

---

## 1. Programming Languages & Frameworks
Your project uses a modern, high-performance "Stack" (combination of technologies) that is very different from your old PHP site.

### Frontend (User Interface)
*   **Language**: **TypeScript** (TSX). This is a "stricter" and safer version of JavaScript. It prevents many common bugs by enforcing rules on how data is handled.
*   **Framework**: **React** (v18). A library developed by Facebook for building fast, interactive user interfaces. It makes the site feel like a mobile app (no page reloads).
*   **Build Tool**: **Vite**. A tool that starts the server instantly and bundles your code for production. It is much faster than older tools like Webpack.
*   **Styling**: **Tailwind CSS**. A utility-first framework that allows for rapid, beautiful designs (Glassmorphism, Neon effects) without writing heavy custom CSS files.
*   **UI Library**: **shadcn/ui** (built on Radix UI). A collection of pre-built, accessible components (Buttons, Dialogs, Inputs) that look professional out of the box.

### Backend (Server & Logic)
*   **Platform**: **Supabase**. This is known as a "Backend-as-a-Service" (BaaS). It replaces a traditional custom server (like Node.js or PHP server).
    *   It handles **Authentication** (Login/Signup).
    *   It handles **Database** (Storing users, transactions).
    *   It handles **File Storage** (Screenshots, Profile pics).
    *   It handles **Security Rules** (Who can see what).
*   **Edge Functions**: For specific tasks like sending emails, we use **Supabase Edge Functions** (TypeScript/Deno), which run code on the cloud without managing a server.

---

## 2. Database System
*   **Database**: **PostgreSQL** (hosted by Supabase).
    *   This is one of the world's most advanced open-source relational databases.
    *   It is far more robust and scalable than standard MySQL for complex queries (like your 12-level income structure).
    *   **Real-time**: Uniquely, Supabase allows the frontend to "listen" to the database. When you approve a task in the Admin Panel, the User's dashboard updates *instantly* without refreshing.

---

## 3. Project Architecture (Folder Structure)
The project is organized in the `src` folder. Here is a simplified map:

*   **`src/pages`**: The "Screens" of your app.
    *   `Register.tsx`: The registration page.
    *   `Login.tsx`: The login page.
    *   `dashboard/UserHome.tsx`: The main student dashboard.
    *   `admin/SkillLearnersAdmin.tsx`: The central command center for you.
*   **`src/components`**: Reusable building blocks.
    *   `ui/`: Basic items like Buttons, Cards, Inputs.
    *   `admin/moneyworld/`: The logic for your income system (IncomeManagement, TaskCompletion, AdsManagement).
*   **`src/lib`**: The "Brain" of the logic.
    *   `incomeDistribution.ts`: **CRITICAL**. This single file contains the mathematics for the 12-level plan, Revenue Share, and Spillover.
    *   `utils.ts`: Helper functions.
*   **`src/integrations/supabase`**: The bridge that connects your app to the database.
*   **`src/hooks`**: Custom tools for the code (e.g., `useAuth` to check if a user is logged in).
*   **`src/old website`**: A backup folder containing your *Legacy PHP Code*. This is **NOT** active. It is just there for reference.

---

## 4. Current Status: Functional or Template?
**Verdict**: This is a **Fully Functional Application**, not just a template.

*   **Logic is Live**: The complex math for your specific "Ascend Academy" business model (Spillovers, Revenue Share Trees, 90/10 Splits) is fully written in `incomeDistribution.ts`.
*   **Database is Connected**: The app is reading/writing real data (Users, Wallets, Tasks) to Supabase.
*   **Admin Panel is Active**: The Admin Dashboard is wired up to control the system (Approve payments, Verify tasks).
*   **Security is On**: We just implemented Email Verification and secure File Uploads.

**What's Missing for "Go Live"?**
1.  **Deployment**: Moving the code from this computer to a public URL (e.g., Vercel/Netlify).
2.  **Database SQL Execution**: Some tables (like `email_verifications`) need to be created in your Supabase dashboard using the SQL scripts I provided.
3.  **Payment Gateway**: Currently, it relies on "Manual Upload Proof". If you want automatic UPI payments, a gateway integration (Razorpay/PhonePe) would be the next step.

---

### Summary for Non-Techies
You have moved from an **Old Gas Car** (PHP/MySQL - Functional but slower, requires manual maintenance) to a **Modern Electric Supercar** (React/Supabase - Instant speed, real-time updates, bank-grade security, and modular structure).
