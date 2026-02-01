# 🚀 QUICK START - E-Commerce Deployment

## ⚡ 3-Step Deployment (10 minutes)

### STEP 1: Deploy Database (5 min)

1. **Open Supabase**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor" → "New Query"

2. **Run Deployment Script**
   - Open: `scripts/DEPLOY_ECOMMERCE_COMPLETE.sql`
   - Copy ALL content (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" (or Ctrl+Enter)
   - Wait for "Success" ✅

3. **Verify**
   ```sql
   SELECT COUNT(*) FROM product_categories; -- Should return 6
   SELECT COUNT(*) FROM products; -- Should return 7
   ```

---

### STEP 2: Regenerate Types (3 min)

**Option A: CLI (Recommended)**
```bash
# Open NEW terminal (keep npm run dev running)
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

**Option B: Manual**
1. Go to: Project Settings → API
2. Scroll to "Generate TypeScript types"
3. Copy generated code
4. Replace `src/integrations/supabase/types.ts`

---

### STEP 3: Restart & Test (2 min)

```bash
# In terminal running npm run dev:
# Press Ctrl+C

# Restart
npm run dev
```

**Test:**
1. Go to: http://localhost:5173/shopping
2. ✅ Categories appear
3. ✅ Products load
4. ✅ No errors in console

---

## 🎉 DONE!

You now have:
- ✅ 6 Product categories
- ✅ Sample products
- ✅ Shopping page
- ✅ Product details
- ✅ Wishlist
- ✅ Order tracking
- ✅ Affiliate system

---

## 🆘 Quick Troubleshooting

**"Table already exists"**
```sql
DROP TABLE IF EXISTS products CASCADE;
-- Then re-run deployment script
```

**TypeScript errors persist**
```bash
rm -rf node_modules/.vite
npm run dev
# Hard refresh browser (Ctrl+Shift+R)
```

**Need help?**
Check: `DEPLOYMENT_CHECKLIST.md` for detailed steps

---

## 📝 What's Next?

After deployment, you can:
1. Add more products (run `SAMPLE_PRODUCTS_PART1.sql` & `PART2.sql`)
2. Build Admin Product Management
3. Build Affiliate Management Panel
4. Customize product categories
5. Add your own products

---

**Ready? Let's deploy!** 🚀

Run Step 1 in Supabase now →
