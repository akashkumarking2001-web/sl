# ⚡ 3 CRITICAL BLOCKERS - 30 MINUTE FIX

**Status:** 🔴 Must complete before launch  
**Time Required:** 30 minutes  
**Impact:** Prevents production issues

---

## 🎯 BLOCKER #1: VERIFY ENVIRONMENT VARIABLES (5 minutes)

### Why Critical:
Without proper environment variables, your app won't connect to Supabase in production.

### Steps:

#### 1. Check if .env file exists:
```bash
# In your project root
ls .env
ls .env.production
```

#### 2. Verify .env contains:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 3. Get your Supabase credentials:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** key → VITE_SUPABASE_ANON_KEY

#### 4. Create/Update .env file:
```bash
# Create .env in project root
echo VITE_SUPABASE_URL=https://your-project.supabase.co > .env
echo VITE_SUPABASE_ANON_KEY=your-anon-key >> .env
```

#### 5. Verify .gitignore includes .env:
```bash
# Check .gitignore
cat .gitignore | grep .env
# Should show: .env or .env*
```

### ✅ Verification:
```bash
# Test that env vars are loaded
npm run dev
# Open browser console, check for Supabase connection
```

**Status:** ⏳ PENDING

---

## 🎯 BLOCKER #2: TEST PRODUCTION BUILD (10 minutes)

### Why Critical:
Production build may have errors that don't appear in development.

### Steps:

#### 1. Clean previous builds:
```bash
# Remove old build
rm -rf dist
# Or on Windows:
rmdir /s /q dist
```

#### 2. Run production build:
```bash
npm run build
```

#### 3. Check for errors:
Look for:
- ✅ "Build completed successfully"
- ❌ Any TypeScript errors
- ❌ Any module not found errors
- ❌ Any build warnings

#### 4. Check bundle size:
```bash
# On Windows:
dir dist\assets

# Should see:
# - index-[hash].js (main bundle, should be < 2MB)
# - index-[hash].css (styles, should be < 500KB)
```

#### 5. Test production preview:
```bash
npm run preview
```

#### 6. Open http://localhost:4173 and test:
- [ ] Homepage loads
- [ ] Can navigate to different pages
- [ ] Images load
- [ ] Can login
- [ ] No console errors

### Common Issues & Fixes:

**Issue: "Module not found"**
```bash
# Fix: Install missing dependency
npm install
npm run build
```

**Issue: "Out of memory"**
```bash
# Fix: Increase Node memory
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Issue: Build succeeds but preview shows blank page**
```bash
# Fix: Check browser console for errors
# Usually a missing environment variable
```

### ✅ Verification:
- [ ] Build completes without errors
- [ ] Preview works on http://localhost:4173
- [ ] No console errors
- [ ] All pages load correctly

**Status:** ⏳ PENDING

---

## 🎯 BLOCKER #3: SET UP DATABASE BACKUPS (10 minutes)

### Why Critical:
Without backups, you risk losing all user data if something goes wrong.

### Steps:

#### 1. Enable Point-in-Time Recovery (Recommended):

**In Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Point-in-Time Recovery (PITR)**
5. Click **Enable PITR**

**Benefits:**
- ✅ Automatic backups every second
- ✅ Restore to any point in last 7 days
- ✅ No manual intervention needed

**Cost:** ~$100/month (recommended for production)

---

#### 2. Alternative: Manual Backup Script (Free):

**Create backup script:**

```bash
# Create scripts folder
mkdir -p scripts

# Create backup script
cat > scripts/backup-database.sh << 'EOF'
#!/bin/bash

# Supabase Database Backup Script
# Run daily via cron or manually

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="backups"
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Get Supabase connection string from .env
source .env

# Backup database (requires pg_dump)
pg_dump "$DATABASE_URL" > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
EOF

# Make executable
chmod +x scripts/backup-database.sh
```

**Run backup:**
```bash
./scripts/backup-database.sh
```

**Schedule daily backups (optional):**
```bash
# Add to crontab (Linux/Mac)
crontab -e
# Add line:
0 2 * * * /path/to/your/project/scripts/backup-database.sh

# On Windows, use Task Scheduler
```

---

#### 3. Test Backup & Restore:

**Create test backup:**
```bash
# In Supabase Dashboard:
# Settings → Database → Database Settings
# Click "Download backup"
```

**Test restore (in development):**
1. Create a test Supabase project
2. Upload backup file
3. Verify data is restored

### ✅ Verification:
- [ ] PITR enabled OR manual backup script created
- [ ] Test backup created successfully
- [ ] Backup file exists and is not empty
- [ ] Restore process tested (optional but recommended)

**Status:** ⏳ PENDING

---

## 📋 COMPLETION CHECKLIST

### After Completing All 3 Blockers:

- [ ] ✅ Environment variables verified and working
- [ ] ✅ Production build successful
- [ ] ✅ Production preview tested
- [ ] ✅ Database backups configured
- [ ] ✅ Test backup created

### Next Steps:
1. Run final tests (see PRE_LAUNCH_CHECKLIST.md)
2. Deploy to production
3. Monitor for issues

---

## 🚀 QUICK COMMAND SEQUENCE

**Run these in order:**

```bash
# 1. Verify environment
cat .env
# Should show VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 2. Build for production
npm run build

# 3. Test production build
npm run preview
# Visit http://localhost:4173

# 4. Enable backups in Supabase Dashboard
# (Manual step - see instructions above)

# 5. Verify everything
echo "✅ All blockers resolved!"
```

---

## ⚠️ TROUBLESHOOTING

### Environment Variables Not Working:
```bash
# Restart dev server
npm run dev

# Check if vars are loaded
# In browser console:
console.log(import.meta.env.VITE_SUPABASE_URL)
# Should show your URL, not undefined
```

### Build Fails:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Preview Shows Blank Page:
```bash
# Check browser console for errors
# Usually missing environment variables
# Make sure .env file exists
```

---

## 📊 TIME BREAKDOWN

| Task | Time | Status |
|------|------|--------|
| Verify environment variables | 5 min | ⏳ |
| Test production build | 10 min | ⏳ |
| Set up database backups | 10 min | ⏳ |
| Verification | 5 min | ⏳ |
| **TOTAL** | **30 min** | **⏳** |

---

## ✅ SUCCESS CRITERIA

### You're ready to launch when:
- ✅ `npm run build` succeeds without errors
- ✅ `npm run preview` shows working site
- ✅ Environment variables are set correctly
- ✅ Database backups are configured
- ✅ No console errors in production preview

---

## 🎯 AFTER COMPLETION

**You'll be able to:**
- ✅ Deploy to production safely
- ✅ Handle production traffic
- ✅ Recover from disasters
- ✅ Scale with confidence

**Your launch readiness:** 95% → 100% ✅

---

**Status:** 🔴 Critical - Complete before launch  
**Priority:** Highest  
**Time:** 30 minutes  
**Impact:** Production stability

🚀 **Complete these 3 tasks and you're ready to launch!**
