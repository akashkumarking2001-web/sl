# Skill Learners Academy - Project Documentation

## 📁 Project Structure

```
ascend-academy-main/
├── 📄 Documentation (Root Level)
│   ├── README.md                          # Main project overview
│   ├── TEST_VERIFICATION_REPORT.md        # Complete test coverage report
│   ├── PROJECT_COMPLETE.md                # Project completion status
│   ├── DEPLOYMENT_CHECKLIST.md            # Deployment guide
│   ├── BUILD_AND_DEPLOY_APPS.md           # App build instructions
│   ├── BUILD_APPS_GUIDE.md                # Detailed build guide
│   ├── MOBILE_BUILD_GUIDE.md              # Mobile-specific build steps
│   ├── MOBILE_TEST_REPORT.md              # Mobile testing results
│   └── MOBILE_PERFORMANCE_CHECKLIST.md    # Performance optimization guide
│
├── 🔧 Configuration Files
│   ├── package.json                       # Node.js dependencies
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── vite.config.ts                     # Vite build configuration
│   ├── tailwind.config.ts                 # Tailwind CSS configuration
│   ├── capacitor.config.ts                # Capacitor mobile configuration
│   ├── playwright.config.ts               # Playwright test configuration
│   ├── vercel.json                        # Vercel deployment settings
│   └── .env                               # Environment variables
│
├── 📱 Mobile Apps
│   ├── Android_App/                       # Android native project
│   ├── iOS_App/                           # iOS native project
│   └── android/                           # Capacitor Android build
│
├── 💻 Source Code
│   └── src/
│       ├── components/                    # React components
│       │   ├── ui/                        # shadcn/ui components
│       │   ├── layout/                    # Layout components (Navbar, Footer)
│       │   ├── admin/                     # Admin-specific components
│       │   └── ...                        # Feature components
│       ├── pages/                         # Page components
│       │   ├── admin/                     # Admin pages
│       │   ├── dashboard/                 # User dashboard pages
│       │   └── ...                        # Public pages
│       ├── hooks/                         # Custom React hooks
│       ├── lib/                           # Utility libraries
│       ├── integrations/                  # Third-party integrations
│       │   └── supabase/                  # Supabase client & types
│       ├── data/                          # Static data & constants
│       └── assets/                        # Images, fonts, etc.
│
├── 🧪 Tests
│   └── tests/
│       ├── suite-admin/                   # Admin functionality tests
│       ├── suite-affiliate/               # Affiliate system tests
│       ├── suite-general/                 # General user flow tests
│       ├── mobile-android.spec.ts         # Android-specific tests
│       └── mobile-ios.spec.ts             # iOS-specific tests
│
├── 🗄️ Database
│   └── supabase/
│       ├── migrations/                    # Database migrations
│       ├── functions/                     # Edge functions
│       └── seed.sql                       # Seed data
│
├── 📜 Scripts
│   └── scripts/                           # Build & utility scripts
│
├── 📦 Build Output
│   ├── dist/                              # Production build
│   ├── playwright-report/                 # Test reports
│   └── test-results/                      # Test artifacts
│
└── 🌐 Public Assets
    └── public/                            # Static public files
        ├── google-play-badge.png
        ├── app-store-badge.png
        └── ...
```

## 📚 Documentation Guide

### For Developers
1. **README.md** - Start here for project overview
2. **src/** - Browse source code structure
3. **tests/** - Review test coverage
4. **TEST_VERIFICATION_REPORT.md** - See what's tested

### For Deployment
1. **DEPLOYMENT_CHECKLIST.md** - Pre-deployment steps
2. **BUILD_AND_DEPLOY_APPS.md** - Build instructions
3. **vercel.json** - Deployment configuration

### For Mobile Development
1. **MOBILE_BUILD_GUIDE.md** - Build mobile apps
2. **MOBILE_TEST_REPORT.md** - Mobile test results
3. **capacitor.config.ts** - Mobile configuration

## 🎯 Key Features

### Admin Panel
- **Location:** `src/pages/admin/`
- **Components:** `src/components/admin/`
- **Features:**
  - Product management
  - Order approval
  - Course management
  - Store settings (shopping toggle)
  - Wallet operations
  - Audit logs

### Affiliate System
- **Location:** `src/pages/dashboard/`
- **Features:**
  - Referral tracking
  - Commission calculation
  - Withdrawal requests
  - Multi-level income (12 levels)
  - Revenue sharing (8 levels)

### E-commerce
- **Location:** `src/pages/ShoppingPage.tsx`
- **Product Detail:** `src/pages/ProductDetailPage.tsx`
- **Features:**
  - Product catalog
  - Shopping cart
  - Wishlist
  - Cashback system
  - Order management

### User Dashboard
- **Location:** `src/pages/UserHome.tsx`
- **Features:**
  - Profile management
  - Course access
  - Wallet balance
  - Referral links
  - Task completion

## 🧪 Testing

**Total Tests:** 55  
**Coverage:**
- Admin functions: 11 tests
- Affiliate system: 4 tests
- User workflows: 7 tests
- Mobile platforms: 33 tests

**Run Tests:**
```bash
npm run test                    # All tests
npm run test:admin             # Admin tests only
npm run test:affiliate         # Affiliate tests only
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npx playwright test

# Build mobile apps
npm run mobile:build
```

## 📝 Recent Updates

- ✅ Type safety improvements in ProductDetailPage
- ✅ Removed debug console logs
- ✅ Fixed registration checkbox interaction
- ✅ All 55 tests passing
- ✅ Production-ready code

## 🔗 Important Links

- **Database:** Supabase
- **Hosting:** Vercel
- **Mobile:** Capacitor (iOS & Android)
- **Testing:** Playwright
- **UI Framework:** React + shadcn/ui
- **Styling:** Tailwind CSS

---

**Last Updated:** 2026-02-07  
**Status:** ✅ Production Ready
