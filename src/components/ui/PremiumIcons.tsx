// Premium SVG Icons with 3D effects

export const BookIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <rect x="12" y="8" width="40" height="48" rx="4" fill="url(#book-grad)" />
    <rect x="16" y="12" width="32" height="40" rx="2" fill="white" opacity="0.9" />
    <path d="M20 20h24M20 28h20M20 36h16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="32" cy="32" rx="30" ry="30" fill="url(#book-grad)" opacity="0.1" />
  </svg>
);

export const CommunityIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="comm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="20" r="10" fill="url(#comm-grad)" />
    <circle cx="16" cy="32" r="8" fill="url(#comm-grad)" opacity="0.7" />
    <circle cx="48" cy="32" r="8" fill="url(#comm-grad)" opacity="0.7" />
    <path d="M32 30c10 0 18 8 18 18H14c0-10 8-18 18-18z" fill="url(#comm-grad)" />
    <path d="M16 40c6 0 10 5 10 12H6c0-7 4-12 10-12z" fill="url(#comm-grad)" opacity="0.7" />
    <path d="M48 40c6 0 10 5 10 12H38c0-7 4-12 10-12z" fill="url(#comm-grad)" opacity="0.7" />
  </svg>
);

export const VideoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="vid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <rect x="8" y="14" width="48" height="36" rx="6" fill="url(#vid-grad)" />
    <polygon points="28,24 28,40 42,32" fill="white" />
  </svg>
);

export const MobileIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="mob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <rect x="16" y="4" width="32" height="56" rx="6" fill="url(#mob-grad)" />
    <rect x="20" y="10" width="24" height="38" rx="2" fill="white" opacity="0.9" />
    <circle cx="32" cy="54" r="3" fill="white" opacity="0.9" />
  </svg>
);

export const LifetimeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="life-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="26" stroke="url(#life-grad)" strokeWidth="4" fill="none" />
    <path d="M32 16v16l10 6" stroke="url(#life-grad)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="32" cy="32" r="4" fill="url(#life-grad)" />
    <path d="M32 8l2 4-2-1-2 1 2-4z" fill="url(#life-grad)" />
  </svg>
);

export const MentorshipIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="mentor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="18" r="10" fill="url(#mentor-grad)" />
    <path d="M24 28c12 0 20 10 20 20H4c0-10 8-20 20-20z" fill="url(#mentor-grad)" />
    <circle cx="48" cy="24" r="8" fill="url(#mentor-grad)" opacity="0.6" />
    <path d="M48 32c8 0 12 6 12 14H36c0-8 4-14 12-14z" fill="url(#mentor-grad)" opacity="0.6" />
    <path d="M36 20l8 8m0-8l-8 8" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LightbulbIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="bulb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>
    <path d="M32 6C20 6 12 16 12 26c0 8 6 14 10 18v8h20v-8c4-4 10-10 10-18 0-10-8-20-20-20z" fill="url(#bulb-grad)" />
    <rect x="22" y="52" width="20" height="4" rx="2" fill="url(#bulb-grad)" />
    <rect x="24" y="58" width="16" height="2" rx="1" fill="url(#bulb-grad)" opacity="0.7" />
    <path d="M28 30v10m8-10v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TrendIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="trend-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3A5F" />
        <stop offset="100%" stopColor="#2D4A6F" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#trend-grad)" />
    <path d="M16 44l12-16 8 8 12-16" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="48" cy="20" r="6" fill="#FBBF24" />
    <path d="M42 20h6m-3-3v6" stroke="url(#trend-grad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const VerifiedBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="verified-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
    </defs>
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      fill="url(#verified-grad)"
      stroke="white"
      strokeWidth="1"
    />
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
