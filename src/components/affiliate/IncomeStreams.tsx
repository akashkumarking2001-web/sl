import { TrendingUp } from "lucide-react";

interface IncomeCardProps {
    icon: any;
    label: string;
    value: number;
    color: string;
}

const IncomeCard = ({ icon: Icon, label, value, color }: IncomeCardProps) => (
    <div className="group relative overflow-hidden rounded-xl bg-card border border-border/50 p-4 hover:border-primary/30 transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg font-bold">₹{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
    </div>
);

interface IncomeStreamsProps {
    incomeCards: any[];
    totalIncome: number;
}

const IncomeStreams = ({ incomeCards, totalIncome }: IncomeStreamsProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Income Streams
                </h2>
                <p className="text-sm text-muted-foreground">
                    Total: <span className="text-primary font-bold">₹{totalIncome.toLocaleString()}</span>
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {incomeCards.map((card) => (
                    <IncomeCard key={card.label} {...card} />
                ))}
            </div>
        </div>
    );
};

export default IncomeStreams;
