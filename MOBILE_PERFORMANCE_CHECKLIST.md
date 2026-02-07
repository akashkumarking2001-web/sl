# 📱 Mobile Performance & Testing Checklist
### Optimize your 'Skill Learners' experience for edge networks and diverse devices.

---

## 🚀 1. Speed & Loading Performance
- [ ] **Image Optimization**: Ensure all banners and product images are under 150KB. Use WebP format where possible.
- [ ] **Lazy Loading**: Verify that off-screen images (like those in the Courses or Reviews sections) only load when scrolled into view.
- [ ] **Bundle Size**: Run `npm run build` and check the size of the main JS/CSS chunks. Aim for < 200KB for the initial chunk.
- [ ] **Critical CSS**: Ensure the Hero section styling is in the main bundle to avoid "Layout Shift" (CLS) on slow 3G.
- [ ] **Caching**: Verify Service Worker or Browser caching is active for static assets.

## 📱 2. UI/UX Consistency (Responsive Check)
- [ ] **No Horizontal Scroll**: Swipe left/right on every page. There should be zero side-to-side jitter.
- [ ] **Touch Targets**: All buttons, links, and icons must be at least 44x44 pixels in effective click area.
- [ ] **Safe Areas**: Content should not be clipped by the iPhone Notch or the Dynamic Island.
- [ ] **Font Scalability**: Ensure text is readable without zooming. 16px is the minimum for input fields to prevent iOS auto-zoom.
- [ ] **Input Types**: Verify that numeric fields trigger the number pad and email fields trigger the email keyboard.

## 🛠️ 3. App-Specific Experience
- [ ] **Navigation Transition**: Log in and verify the top Navbar hides and the Bottom Nav appears smoothly.
- [ ] **Loading States**: Check the Skeleton loaders on the Course and Product pages. They should feel "instant" and match the layout.
- [ ] **Offline Mode**: Test if the app shows a "Connection Lost" graceful fallback when Wi-Fi is toggled off.

## 🧪 4. Real-World Testing Environments
- [ ] **iPhone (Safari/Chrome)**: Test on a physical iOS device.
- [ ] **Android (Chrome/Samsung Internet)**: Test on a physical Android device.
- [ ] **Throttled 3G**: Use Chrome DevTools to throttle network speeds and test the Splash Screen / Skeleton loaders.

---
*Created for Skill Learners Mobile Excellence Initiative (Feb 2026)*
