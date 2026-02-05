import { Users, UserCheck, UserPlus, Wallet } from "lucide-react";

interface StatItem {
    icon: any;
    label: string;
    value: string | number;
    color: string;
}

interface AffiliateStatsProps {
    referralsCount: number;
    activeCount: number;
    pendingCount: number;
    walletBalance: number;
}

const AffiliateStats = ({ referralsCount, activeCount, pendingCount, walletBalance }: AffiliateStatsProps) => {
    const stats: StatItem[] = [
        { icon: Users, label: "Total Referrals", value: referralsCount, color: "from-[#FBBF24] to-[#D97706]" },
        { icon: UserCheck, label: "Active Members", value: activeCount, color: "from-emerald-500 to-emerald-600" },
        { icon: UserPlus, label: "Pending", value: pendingCount, color: "from-slate-400 to-slate-500" },
        { icon: Wallet, label: "Wallet Balance", value: `₹${walletBalance.toLocaleString()}`, color: "from-[#FBBF24] via-[#FBBF24] to-[#D97706]" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:border-primary/30 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export default AffiliateStats;
