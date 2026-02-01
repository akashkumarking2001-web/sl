import { useRef, useEffect, useState } from "react";
import { Check, X, Crown, Compass, Flame, Eye, TrendingUp, Zap, Sparkles, Star, Gem, Trophy } from "lucide-react";
import { usePackages } from "@/hooks/usePackages";

// Map icons to themes or levels if needed
const tierIcons: Record<string, any> = {
  bronze: Star,
  silver: Sparkles,
  gold: Crown,
  platinum: Gem,
  diamond: Trophy
};

const tierGradients: Record<string, string> = {
  bronze: "from-blue-500 to-blue-600",
  silver: "from-emerald-500 to-teal-600",
  gold: "from-amber-600 to-orange-500",
  platinum: "from-violet-400 to-purple-500",
  diamond: "from-emerald-600 to-green-700"
};

// Features matrix
const features = [
  { name: "Course Access", values: ["Basic", "Standard", "Pro", "Expert", "All"] },
  { name: "Community", values: ["Member", "Member", "VIP", "VIP", "Elite"] },
  { name: "Support", values: ["48h", "24h", "Priority", "Priority", "Instant"] },
  { name: "Mentorship", values: [false, false, "Monthly", "Unlimited", "Unlimited"] },
  { name: "Live Webinars", values: [false, true, true, true, true] },
  { name: "Job Support", values: [false, false, true, true, true] },
  { name: "Coaching", values: [false, false, false, true, true] },
  { name: "Rev Share", values: [false, false, false, true, true] },
  { name: "Success Mgr", values: [false, false, false, false, true] },
  { name: "Profit Share", values: [false, false, false, false, true] },
];

const packageSubtitles: Record<number, string> = {
  0: "The Creator’s Asset Vault",
  1: "The Digital Entrepreneur",
  2: "The Growth Hacker",
  3: "The Business Mogul",
  4: "The Empire Builder"
};

const PackageComparisonTable = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [visibleRows, setVisibleRows] = useState<boolean[]>(new Array(features.length).fill(false));

  const { data: packages } = usePackages();

  // Sort packages to ensure columns align with the matrix (Level 1 -> 5)
  const sortedPackages = packages
    ? [...packages].sort((a, b) => (a.level || 0) - (b.level || 0))
    : [];

  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current || !headerRef.current) return;

      const tableRect = tableRef.current.getBoundingClientRect();
      const headerHeight = 88; // Adjusted from 88px spacer

      // Make header sticky when table is in view but header would scroll out
      setIsSticky(tableRect.top < headerHeight && tableRect.bottom > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for row animations
  useEffect(() => {
    const rows = document.querySelectorAll('.comparison-row');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting && !isNaN(index)) {
            setVisibleRows(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    rows.forEach(row => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const getBonusText = (index: number, pkg: any) => {
    if (index === 0) return null;
    if (index === 1) return `BONUS: Includes Level 1 (Worth ₹${sortedPackages[0]?.price}) for FREE`;
    if (index === 2) return `BONUS: Includes Level 1 + 2 (Worth ₹${(sortedPackages[0]?.price || 0) + (sortedPackages[1]?.price || 0)}) for FREE`;
    if (index === 3) return "BONUS: Includes All Previous Packages for FREE";
    if (index === 4) return "ULTIMATE ACCESS: Get Packages 1, 2, 3 & 4 completely FREE";
    return null;
  };

  if (!sortedPackages.length) return null;

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl lg:text-4xl font-black font-display mb-4 text-slate-900 dark:text-white">
          Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Packages</span>
        </h3>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Choose the perfect plan to accelerate your digital journey
        </p>
      </div>

      {/* Desktop Table - Compact & Premium */}
      <div
        ref={tableRef}
        className="hidden lg:block max-w-6xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-2xl overflow-hidden"
      >
        {/* Sticky Header */}
        <div
          className={`transition-all duration-300 ${isSticky
            ? 'fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-6xl w-full rounded-b-3xl shadow-xl border-x border-b border-slate-200 dark:border-slate-800'
            : ''
            }`}
          style={{ width: isSticky && tableRef.current ? tableRef.current.offsetWidth : undefined }}
        >
          <table className="w-full">
            <thead ref={headerRef} className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-6 px-6 font-bold text-xs uppercase tracking-wider text-slate-400 w-[200px]">
                  Feature
                </th>
                {sortedPackages.map((pkg, idx) => {
                  const theme = pkg.color_theme || 'bronze';
                  const Icon = tierIcons[theme] || Star;
                  const gradient = tierGradients[theme] || "from-blue-500 to-blue-600";
                  const bonusText = getBonusText(idx, pkg);

                  return (
                    <th key={pkg.id} className="py-6 px-3 text-center w-[180px] align-top relative group">
                      <div className="flex flex-col items-center gap-2">
                        {/* Badge/Icon */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Wrapper for text */}
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            {pkg.name.split(":")[0]}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {packageSubtitles[idx] || "Premium Package"}
                          </span>
                          <span className="text-lg font-black text-primary mt-1">₹{pkg.price}</span>
                        </div>

                        {/* Bonus Logic */}
                        {bonusText && (
                          <div className="mt-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg">
                            <p className="text-[9px] font-bold text-amber-700 dark:text-amber-400 leading-tight">
                              {bonusText}
                            </p>
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>
        </div>

        {/* Spacer when header is sticky */}
        {isSticky && <div className="h-[140px]" />}

        {/* Table Body */}
        <table className="w-full">
          <tbody className="bg-white dark:bg-slate-950">
            {features.map((feature, idx) => (
              <tr
                key={feature.name}
                data-index={idx}
                className={`comparison-row border-b border-slate-100 dark:border-slate-800 transition-all duration-500 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/50 dark:bg-slate-900/50'
                  } hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${visibleRows[idx]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                  }`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <td className="py-4 px-6 text-sm font-bold text-slate-700 dark:text-slate-300 w-[200px]">
                  {feature.name}
                </td>
                {feature.values.map((value, tierIdx) => (
                  <td key={tierIdx} className="py-4 px-3 text-center">
                    {value === true ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    ) : value === false ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800">
                        <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 whitespace-normal">
                        {value}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Compact */}
      <div className="lg:hidden space-y-4 px-4">
        {sortedPackages.map((pkg, tierIdx) => {
          const theme = pkg.color_theme || 'bronze';
          const Icon = tierIcons[theme] || Star;
          const gradient = tierGradients[theme] || "from-blue-500 to-blue-600";
          const bonusText = getBonusText(tierIdx, pkg);

          return (
            <details key={pkg.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              <summary className="flex flex-col gap-3 p-4 cursor-pointer list-none relative">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-lg text-slate-900 dark:text-white leading-none mb-1">{pkg.name}</h4>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      {packageSubtitles[tierIdx] || "Premium Package"}
                    </p>
                    <p className="text-lg font-black text-primary">₹{pkg.price}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform group-open:rotate-180">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {bonusText && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-2 mt-1">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-500 text-center">
                      {bonusText}
                    </p>
                  </div>
                )}
              </summary>
              <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <ul className="space-y-2 mt-2">
                  {features.map((feature, idx) => {
                    const value = feature.values[tierIdx];
                    return (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        {value === true ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : value === false ? (
                          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <X className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 flex-shrink-0 min-w-[50px] text-center">
                            {value}
                          </span>
                        )}
                        <span className={`font-medium ${value === false ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                          {feature.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
};

export default PackageComparisonTable;
