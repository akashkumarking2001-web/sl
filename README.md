# Skill Learners Academy

The official platform for **Skill Learners Academy**, a comprehensive ed-tech and affiliate marketing ecosystem. This application is built to provide world-class education in digital skills while offering a robust affiliate earning opportunity.

## 🚀 Technology Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS, Shadcn/UI
- **State Management:** React Query (@tanstack/react-query)
- **Routing:** React Router DOM
- **Backend/Database:** Supabase (Auth, Postgres, Realtime, Edge Functions)
- **Icons:** Lucide React

## ✨ Key Features

### 🎓 Education Portal
- **Course Library:** Access to premium video courses (Bronze to Diamond tiers).
- **Progress Tracking:** Real-time tracking of course completion.
- **Secure Access:** Role-based content locking.

### 💼 Affiliate Dashboard
- **Real-time Earnings:** Track direct and passive income streams.
- **Referral Network:** Visual breakdown of your downstream referrals.
- **Leaderboard:** Live ranking of top performers.
- **Wallet:** Withdrawal requests and transaction history.

### 🛍️ E-commerce & Tools
- **Digital Store:** Shop for templates, assets, and electronics.
- **Cart System:** Fully functional shopping cart integrated with user accounts.

### 🚀 Landing Pages
- **Dynamic Package Pages:** SEO-optimized landing pages for each subscription tier (e.g., `/package/SUMMIT`).
- **High-Conversion Design:** Premium gradients, animations, and clear CTAs.

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ascend-academy-main
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/src/pages` - Main route components (UserHome, AffiliateDashboard, etc.)
- `/src/components` - Reusable UI components & sections
- `/src/hooks` - Custom hooks (useAuth, usePackages)
- `/src/data` - Static data configurations (packages.ts, products.ts)
- `/scripts` - SQL maintenance scripts for Supabase

## 🤝 Contribution

This project is maintained by the Skill Learners Team. Please ensure all PRs are tested against the `main` branch.

---
© 2026 Skill Learners Academy. All rights reserved.
