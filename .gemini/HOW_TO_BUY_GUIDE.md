# 🛒 How to Buy - Complete Purchase Flow Guide

## Overview

Your application supports **3 types of purchases**:
1. **Digital Products** (Combo Packages/Plans)
2. **Individual Courses**
3. **Physical Products** (Shopping Cart Items)

---

## 🎯 Purchase Flow for Each Type

### 1. **Combo Packages (Digital Products)**

#### User Journey:
```
Home Page → Click "Combo Package" → /plans page → Select Package → Click "Upgrade Now" → /payment page
```

#### Steps:
1. **Browse Packages:**
   - Go to `/plans` page (or click "Combo Package" from UserHome)
   - View all available combo packages (IGNITE, VELOCITY, APEX, etc.)

2. **Select Package:**
   - Click "Upgrade Now" button on any package
   - Redirects to `/payment?plan=PackageName`

3. **Payment Process:**
   - **Step 1: Select Payment Method**
     - Choose UPI Payment (Google Pay, PhonePe, Paytm)
     - OR Choose Crypto (USDT TRC20)
   
   - **Step 2: Make Payment**
     - Scan QR Code OR Copy UPI ID/USDT Address
     - Make payment from your app
     - Get Transaction ID/UTR Number
   
   - **Step 3: Submit Proof**
     - Enter Transaction ID
     - Upload payment screenshot (optional)
     - Click "Confirm & Pay"
   
   - **Step 4: Verification (Auto)**
     - System shows "Verifying Payment..." screen
     - Polls database every 3 seconds for approval
     - Timeout after 60 seconds if not approved
     - Auto-redirects to dashboard when approved

---

### 2. **Individual Courses**

#### User Journey:
```
Home Page → Click "Available Courses" → /courses page → Select Course → Click "Enroll Now" → /course/:id → Click "Buy Now" → /payment
```

#### Steps:
1. **Browse Courses:**
   - Go to `/courses` page
   - Search and filter courses
   - View course details

2. **Select Course:**
   - Click on a course card
   - View full course details on `/course/:id`
   - Click "Enroll Now" or "Buy Now"

3. **Payment Process:**
   - Same as Combo Packages (Steps 1-4 above)
   - Payment is for individual course only

---

### 3. **Physical Products (Shopping)**

#### User Journey:
```
Home Page → Click "Online Shopping" → /shopping → Browse Products → Add to Cart → View Cart → Checkout → /payment
```

#### Steps:
1. **Browse Products:**
   - Go to `/shopping` page
   - Browse categories, search products
   - View product details

2. **Add to Cart:**
   - Click "Add to Cart" on products
   - Cart icon shows item count

3. **Checkout Process:**
   - Click cart icon → View cart
   - Click "Proceed to Checkout"
   - Redirects to `/payment?source=cart`

4. **Multi-Step Checkout:**
   
   **Step 1: Delivery Address**
   - Select or add new shipping address
   - Required fields: Name, Address, City, State, PIN, Phone
   - Click "Proceed to Method"
   
   **Step 2: Payment Method**
   - Choose UPI or Crypto (same as digital products)
   - Click "Continue to Pay"
   
   **Step 3: Complete Payment**
   - Scan QR Code or copy payment details
   - Make payment
   - Enter Transaction ID
   - Upload screenshot
   - Click "Confirm & Pay"
   
   **Step 4: Order Confirmation**
   - Order submitted with "pending" status
   - Admin approves order
   - Order status updates to "approved" → "shipped" → "delivered"

---

## 💳 Payment Methods Supported

### 1. **UPI Payment** (Recommended)
- **Apps:** Google Pay, PhonePe, Paytm, BHIM
- **Process:**
  - Scan QR code OR Copy UPI ID
  - Open payment app
  - Enter amount manually
  - Complete payment
  - Copy Transaction ID (12-digit UTR number)

### 2. **Crypto (USDT)**
- **Network:** TRC20 ONLY (⚠️ Important!)
- **Process:**
  - Copy USDT TRC20 address
  - Send exact amount from your crypto wallet
  - Copy Transaction Hash
  - Submit as Transaction ID

---

## 🔐 Payment Verification Process

### For Digital Products (Packages/Courses):
1. **Instant Verification Screen:**
   - Shows countdown timer (60 seconds)
   - Polls database every 3 seconds
   - Auto-redirects when admin approves

2. **Admin Approval:**
   - Admin receives payment request
   - Verifies transaction ID in payment app
   - Approves or rejects payment
   - User gets instant access upon approval

3. **Timeout Handling:**
   - If not approved within 60 seconds
   - Shows "Taking Longer Than Usual" message
   - User can skip and check later in dashboard
   - Payment still processed, just delayed

### For Physical Products:
1. **Order Submission:**
   - Order created with "pending" status
   - No instant verification screen

2. **Admin Processing:**
   - Admin reviews order
   - Verifies payment
   - Updates status: pending → approved → shipped → delivered

3. **User Tracking:**
   - User can track order status in `/dashboard/orders`
   - Receives updates on each status change

---

## 📊 Order Summary & Pricing

### Price Calculation:
```
Base Price (Package/Course/Product)
- Coupon Discount (if applied)
+ Shipping (FREE for physical products)
= Final Price
```

### Additional Features:
- **Cashback:** Some products offer cashback
- **Affiliate Commission:** Tracked if purchased via referral link
- **Abandoned Cart:** System tracks abandoned checkouts for recovery

---

## 🎁 Special Features

### 1. **Referral/Affiliate Tracking:**
- If user clicks affiliate link before purchase
- Commission automatically tracked
- Credited to affiliate's account upon approval

### 2. **Coupon Codes:**
- Can be applied during checkout
- Validates and applies discount
- Shows discount in order summary

### 3. **Multiple Items (Cart):**
- Can buy multiple products at once
- Single payment for entire cart
- Individual order created for each item

---

## 🚨 Important Notes

### For Users:
1. **Transaction ID is REQUIRED** - Always save your payment receipt
2. **Screenshot is OPTIONAL** - But recommended for faster approval
3. **Exact Amount** - Always pay the exact amount shown
4. **Network for Crypto** - ONLY use TRC20 network for USDT
5. **Don't Refresh** - During verification, don't close or refresh page

### For Admins:
1. **Quick Approval** - Approve within 60 seconds for best UX
2. **Verify Transaction** - Always verify in payment app before approving
3. **Update Status** - Keep order statuses updated for physical products

---

## 📱 Mobile App vs Web

### Web Version:
- Full checkout flow with all steps
- QR code scanning via camera
- Desktop-optimized layout

### Mobile App (Native):
- Streamlined checkout
- Native payment app integration
- Optimized for touch interactions

---

## 🔗 Quick Links

- **Browse Packages:** `/plans`
- **Browse Courses:** `/courses`
- **Shopping Store:** `/shopping`
- **Payment Page:** `/payment`
- **My Orders:** `/dashboard/orders`
- **My Courses:** `/dashboard/courses`

---

## 💡 Tips for Smooth Purchase

1. **Have payment app ready** before starting checkout
2. **Screenshot the QR code** if needed for later
3. **Copy Transaction ID immediately** after payment
4. **Don't navigate away** during verification
5. **Contact support** if payment not approved within 5 minutes

---

## 📞 Support

If you face any issues:
- **WhatsApp Support:** Available in payment page
- **Email:** Contact via dashboard
- **Admin Panel:** For admins to manage payments

---

## Status: ✅ Complete Purchase System

Your application has a fully functional purchase system supporting:
- ✅ Digital products (instant access)
- ✅ Physical products (with shipping)
- ✅ Multiple payment methods
- ✅ Auto-verification
- ✅ Affiliate tracking
- ✅ Order management
