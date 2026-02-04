import { Sparkles, Rocket, Crown, Gem, Trophy, Zap, Target, Users, TrendingUp, DollarSign, Award, Star, Clock, Smartphone, BookOpen } from "lucide-react";

export const packages = [
  {
    id: 1,
    name: "SPARK",
    displayName: "Basic Package",
    nickname: "Basic",
    tagline: "The Digital Content Creator Vault",
    icon: Star,
    price: 699,
    mrp: 1398,
    period: "one-time",
    description: "Essential foundational courses for digital creation.",
    shortDesc: "Content Creator Bundle",
    coreContent: "5 Fundamental Modules for Digital Creation.",
    features: [
      "200GB+ Master Library: Rebrand and sell immediately.",
      "Pro Video Editing Suite: 5000+ assets for Premiere/Ae.",
      "Graphic Design Empire: 10,000+ editable PSD/Canva files.",
      "Royalty-Free Media Bank: 1,000+ HD footage & scores.",
      "[NEW] Monetization Blueprint: Sell on Etsy/Gumroad.",
    ],
    modules: [
      { title: "Module 1: 200GB+ Master Library", description: "Premium PLR articles, niche-specific eBooks, and 50+ business templates you can rebrand and sell immediately." },
      { title: "Module 2: Pro Video Editing Suite", description: "5000+ Motion Graphics, LUTS for color grading, and transition packs for Premiere Pro & After Effects." },
      { title: "Module 3: Graphic Design Empire", description: "10,000+ editable PSD/Canva files including social media posters, thumbnails, and logo kits." },
      { title: "Module 4: Royalty-Free Media Bank", description: "1,000+ HD stock footages and cinematic background scores for commercial use." },
      { title: "Module 5: Monetization Blueprint", description: "A step-by-step guide on how to sell these assets on platforms like Etsy or Gumroad.", new: true }
    ],
    includes: [],
    savings: 699,
    color: "from-blue-400 to-blue-500",
    glowColor: "#3b82f6",
    bonus: null,
    level: "Foundation",
    theme: "bronze",
  },
  {
    id: 2,
    name: "MOMENTUM",
    displayName: "Starter Package",
    nickname: "Starter",
    tagline: "YouTube Mastery & Traffic Engine",
    icon: Sparkles,
    price: 1499,
    mrp: 2998,
    period: "one-time",
    description: "Growth-focused strategies for traffic and views.",
    shortDesc: "Traffic Engine Bundle",
    coreContent: "5 Strategic Modules for Viral Growth.",
    features: [
      "Algorithm Hacking Secrets: Trigger YouTube recommendations.",
      "Faceless Channel Blueprint: 'Cash-Cow' niche strategies.",
      "Multi-Platform Dominance: Repurpose for Shorts/Reels.",
      "AI Content Fast-Track: 30 days of content in 2 hours.",
      "[NEW] Brand Deals & Sponsorships: Secure paid deals.",
    ],
    modules: [
      { title: "Module 1: Algorithm Hacking Secrets", description: "Deep dive into CTR (Click-Through Rate) and AVD (Average View Duration) to trigger the YouTube recommendation engine." },
      { title: "Module 2: Faceless Channel Blueprint", description: "5 specific niches for \"Cash-Cow\" channels that don't require showing your face." },
      { title: "Module 3: Multi-Platform Dominance", description: "How to repurpose 1 long-form video into 20+ Shorts/Reels for TikTok, Instagram, and Facebook." },
      { title: "Module 4: AI Content Fast-Track", description: "Using AI to script, voice-over, and edit 30 days of content in just 2 hours." },
      { title: "Module 5: Brand Deals & Sponsorships", description: "How to reach out to brands even with a small subscriber base and secure paid deals.", new: true }
    ],
    includes: ["SPARK"],
    savings: 1499,
    color: "from-emerald-400 to-teal-500",
    glowColor: "#10b981",
    bonus: "Includes Basic Package for FREE",
    level: "Growth",
    theme: "silver",
  },
  {
    id: 3,
    name: "SUMMIT",
    displayName: "Professional Package",
    nickname: "Professional",
    tagline: "Sales Automation & Funnel King",
    icon: Crown,
    price: 2850,
    mrp: 5700,
    period: "one-time",
    description: "Advanced systems for automated sales.",
    shortDesc: "Sales Automation Bundle",
    coreContent: "5 Advanced Modules for High-Ticket Sales.",
    features: [
      "High-Ticket Affiliate Marketing: Promote $100-$500 products.",
      "Sales Psychology & Closing: 'Inception Selling' mastery.",
      "Automated Email Funnels: 'Set-and-Forget' nurturing.",
      "E-Commerce & Dropshipping 2.0: No-inventory store launch.",
      "[NEW] WhatsApp Marketing Automation: 98% open rate bots.",
    ],
    modules: [
      { title: "Module 1: High-Ticket Affiliate Marketing", description: "How to find and promote products that pay $100 - $500 per single sale." },
      { title: "Module 2: Sales Psychology & Closing", description: "Master the art of \"Inception Selling\"—making the customer feel like buying was their idea." },
      { title: "Module 3: Automated Email Funnels", description: "Setting up \"Set-and-Forget\" systems that nurture leads and close sales 24/7." },
      { title: "Module 4: E-Commerce & Dropshipping 2.0", description: "Launching a store without inventory using local and international suppliers." },
      { title: "Module 5: WhatsApp Marketing Automation", description: "Using bots to handle customer queries and broadcast offers with 98% open rates.", new: true }
    ],
    includes: ["SPARK", "MOMENTUM"],
    savings: 2850,
    color: "from-amber-400 to-orange-500",
    glowColor: "#f59e0b",
    bonus: "Includes Basic + Starter Packages for FREE",
    level: "Business",
    theme: "gold",
    popular: true,
  },
  {
    id: 4,
    name: "TITAN",
    displayName: "Premium Package",
    nickname: "Premium",
    tagline: "The Digital Agency Titan",
    icon: Gem,
    price: 4880,
    mrp: 9760,
    period: "one-time",
    description: "Sophisticated agency-level marketing strategies.",
    shortDesc: "Agency Titan Bundle",
    coreContent: "5 Expert Modules for Agency Scaling.",
    features: [
      "Advanced SEO & Semantic Search: Rank for User Intent.",
      "High-ROAS Performance Marketing: 5x-10x Returns on Ads.",
      "Conversion Rate Optimization (CRO): Fix sales funnel leaks.",
      "AI Marketing Tools Mastery: Automate agency operations.",
      "[NEW] Client Acquisition Blueprint: Find high-paying clients.",
    ],
    modules: [
      { title: "Module 1: Advanced SEO & Semantic Search", description: "Moving beyond keywords—how to rank for \"User Intent\" and beat big competitors on Google." },
      { title: "Module 2: High-ROAS Performance Marketing", description: "Advanced Facebook & Google Ads strategies for 5x to 10x Returns on Ad Spend." },
      { title: "Module 3: Conversion Rate Optimization (CRO)", description: "Analyzing heatmaps to see where users click and fixing \"leaks\" in your sales funnel." },
      { title: "Module 4: AI Marketing Tools Mastery", description: "Automating copywriting, ad creatives, and customer support using custom-trained AI models." },
      { title: "Module 5: Client Acquisition Blueprint", description: "How to find high-paying international clients for your own digital marketing agency.", new: true }
    ],
    includes: ["SPARK", "MOMENTUM", "SUMMIT"],
    savings: 4880,
    color: "from-violet-400 to-purple-500",
    glowColor: "#8b5cf6",
    bonus: "Includes Basic, Starter + Professional for FREE",
    level: "Expert",
    theme: "platinum",
  },
  {
    id: 5,
    name: "LEGACY",
    displayName: "Enterprise Package",
    nickname: "Enterprise",
    tagline: "Wealth Creation & Trading Mastery",
    icon: Trophy,
    price: 8200, // Kept previous diamond price or user's high ticket price
    mrp: 16400,
    period: "lifetime",
    description: "Elite financial strategies for generational wealth.",
    shortDesc: "Wealth Mastery Bundle",
    coreContent: "5 Elite Modules for Financial Freedom.",
    features: [
      "Binary & Forex Masterclass: Market structure & psychology.",
      "Naked Chart Price Action: Trading without indicators.",
      "Professional Risk Management: The '1% Rule' strategy.",
      "Live Market Case Studies: Real-time trade analysis.",
      "[NEW] Investment Scaling: Diversify into Real Estate/Stocks.",
    ],
    modules: [
      { title: "Module 1: Binary & Forex Masterclass", description: "Understanding market structure, supply/demand zones, and candlestick psychology." },
      { title: "Module 2: Naked Chart Price Action", description: "Trading without lagging indicators to get the most accurate entries and exits." },
      { title: "Module 3: Professional Risk Management", description: "The \"1% Rule\" and portfolio protection strategies to ensure long-term survival." },
      { title: "Module 4: Live Market Case Studies", description: "Real-time analysis of historical trades to understand \"Why\" and \"When\" to enter." },
      { title: "Module 5: Investment Scaling", description: "How to diversify trading profits into long-term assets like Real Estate or Stocks for generational wealth.", new: true }
    ],
    includes: ["SPARK", "MOMENTUM", "SUMMIT", "TITAN"],
    savings: 8799,
    color: "from-emerald-700 to-green-900", // Deep Forest Green
    glowColor: "#15803d",
    bonus: "Ultimate Access - Get ALL Previous Packages FREE",
    level: "Legendary",
    theme: "diamond",
  },
];


export const incomeTypes = [
  {
    name: "Affiliate Income",
    description: "Earn 10-30% on direct referrals",
    icon: Users,
    iconColor: "from-emerald-500 to-teal-600",
    details: "Get commission on every successful referral you make."
  },
  {
    name: "Level Income",
    description: "Multi-tier team earnings",
    icon: TrendingUp,
    iconColor: "from-blue-500 to-indigo-600",
    details: "Earn from your team's performance across multiple levels."
  },
  {
    name: "Seniority-Based Profit Share",
    description: "Instant profit sharing on every sale",
    icon: DollarSign,
    iconColor: "from-amber-500 to-orange-500",
    details: "For every sale in the business, a share of profit is distributed instantly based on your seniority/hierarchy in the system."
  },
  {
    name: "Task Income",
    description: "Earn within 1 hour of task completion",
    icon: Target,
    iconColor: "from-violet-500 to-purple-600",
    details: "Complete tasks like App Installs, Article Reading, and WhatsApp Status updates. Earnings credited within an hour of task completion. This is variable income, not fixed."
  },
  {
    name: "Spillover Income",
    description: "Overflow from your upline",
    icon: Zap,
    iconColor: "from-cyan-500 to-blue-600",
    details: "Benefit from excess referrals placed by your upline."
  },
  {
    name: "Auto Upgrade System",
    description: "Automatic growth without extra investment",
    icon: Award,
    iconColor: "from-rose-500 to-pink-600",
    details: "A user starting at the Bronze (₹600) can automatically reach Diamond packages through system progression without further manual investment."
  },
  {
    name: "Royal Bonus",
    description: "Top performer rewards",
    icon: Star,
    iconColor: "from-amber-400 to-yellow-500",
    upcoming: true,
    details: "Exclusive rewards for top performers."
  },
];

export const futureIncomeTypes = [
  { name: "App Watching Income", description: "Earn by watching app content", icon: Smartphone, comingSoon: true },
  { name: "Article Reading Income", description: "Get paid to read & learn", icon: BookOpen, comingSoon: true },
];