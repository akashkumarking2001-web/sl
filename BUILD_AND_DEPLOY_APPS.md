# 📱 HOW TO BUILD & DEPLOY MOBILE APPS

## 🎯 CURRENT STATUS
✅ Footer updated with app download buttons  
✅ Google Play and App Store badges added  
✅ Download links configured  
⚠️ **Need to build actual APK/IPA files**

---

## 🔨 BUILD ANDROID APK

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Sync to Android
```bash
npx cap sync android
```
*Note: If you get an error about folder names, manually rename `Android_App` to `android` first*

### Step 3: Open in Android Studio
```bash
cd Android_App
# Then open this folder in Android Studio
```

### Step 4: Build APK
In Android Studio:
1. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. Wait for build to complete (~2-3 minutes)
3. Click **"locate"** to find the APK

### Step 5: Copy APK to Public Folder
```bash
copy "Android_App\app\build\outputs\apk\debug\app-debug.apk" "public\downloads\skill-learners.apk"
```

---

## 🍎 BUILD iOS IPA (Mac Only)

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Sync to iOS
```bash
npx cap sync ios
```

### Step 3: Open in Xcode
```bash
cd iOS_App
open App.xcworkspace
```

### Step 4: Configure Signing
1. Select project in navigator
2. Go to "Signing & Capabilities"
3. Select your Development Team

### Step 5: Archive
1. **Product > Archive**
2. Wait for archive to complete
3. In Organizer: **Distribute App > Export**
4. Choose "Development" or "Ad Hoc"

### Step 6: Copy IPA to Public Folder
```bash
cp ~/Desktop/SkillLearners.ipa public/downloads/skill-learners.ipa
```

---

## 🚀 DEPLOY TO WEBSITE

### After Building APK/IPA:

1. **Commit the files:**
```bash
git add public/downloads/
git add public/*.png
git add src/components/layout/Footer.tsx
git commit -m "Add mobile app downloads with actual APK/IPA files"
git push origin main
```

2. **Vercel will automatically deploy** with the new files

3. **Users can now download:**
   - Android: Click Google Play badge → Downloads `skill-learners.apk`
   - iOS: Click App Store badge → Downloads `skill-learners.ipa`

---

## 📦 FILE LOCATIONS

### Source Files:
- **Android APK**: `Android_App/app/build/outputs/apk/debug/app-debug.apk`
- **iOS IPA**: Exported from Xcode Organizer

### Public Files (for download):
- **Android**: `public/downloads/skill-learners.apk`
- **iOS**: `public/downloads/skill-learners.ipa`
- **Google Play Badge**: `public/google-play-badge.png`
- **App Store Badge**: `public/app-store-badge.png`

---

## ⚠️ IMPORTANT NOTES

### Android APK Installation:
- Users must enable "Install from Unknown Sources"
- APK is for testing/beta distribution
- For production, use Google Play Store

### iOS IPA Installation:
- IPA files require TestFlight or enterprise distribution
- Cannot be installed directly like APK
- For production, use Apple App Store

### File Sizes:
- Android APK: ~10-50 MB (typical)
- iOS IPA: ~15-60 MB (typical)
- Consider hosting on CDN for large files

---

## 🎨 FOOTER IMPLEMENTATION

The footer now includes:
- ✅ Official Google Play badge image
- ✅ Official App Store badge image
- ✅ Direct download links
- ✅ Hover effects and animations
- ✅ Download attribution text

### Code Location:
`src/components/layout/Footer.tsx` (lines 71-105)

---

## 🔄 UPDATING APPS

When you update the app:
1. Make code changes
2. Rebuild APK/IPA
3. Copy new files to `public/downloads/`
4. Commit and push
5. Users get updated version on next download

---

## 📱 TESTING

### Test Android APK:
1. Download from website
2. Transfer to Android phone
3. Enable "Unknown Sources"
4. Install and test

### Test iOS IPA:
1. Use TestFlight for distribution
2. Or install via Xcode on development device
3. Test all features

---

## ✅ CHECKLIST

Before deploying to production:

- [ ] Build production APK (not debug)
- [ ] Sign APK with release keystore
- [ ] Build iOS IPA with distribution certificate
- [ ] Test downloads on actual devices
- [ ] Verify app installs correctly
- [ ] Test all native features
- [ ] Update version numbers
- [ ] Create release notes

---

**Once you build the actual APK/IPA files and copy them to `public/downloads/`, users will be able to download and install your apps directly from the website!** 🎉
