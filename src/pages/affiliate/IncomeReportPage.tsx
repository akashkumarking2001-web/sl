import { useParams } from "react-router-dom";
import {
  TrendingUp,
  Layers,
  ArrowDownRight,
  PieChart,
  CheckSquare,
  Zap,
  Crown,
  Calendar,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";

const incomeTypes: Record<string, { icon: any; label: string; color: string; description: string }> = {
  referral: { icon: TrendingUp, label: "Direct Referral Income", color: "from-[#FBBF24] to-[#D97706]", description: "Earn when someone you refer makes a purchase" },
  level: { icon: Layers, label: "Level Income", color: "from-slate-900 to-slate-800", description: "Multi-level team bonuses from your network" },
  spillover: { icon: ArrowDownRight, label: "Spillover Income", color: "from-slate-700 to-slate-600", description: "Overflow earnings from your upline's team" },
  revenue: { icon: PieChart, label: "Revenue Share Income", color: "from-emerald-500 to-emerald-600", description: "Your share of the company's monthly profits" },
  task: { icon: CheckSquare, label: "Task Income", color: "from-emerald-400 to-emerald-500", description: "Rewards for completing promotional tasks" },
  "auto-upgrade": { icon: Zap, label: "Auto Upgrade Income", color: "from-amber-400 to-amber-500", description: "Bonuses when your referrals upgrade their plans" },
  royal: { icon: Crown, label: "Royal Bonus", color: "from-[#FBBF24] via-[#FBBF24] to-[#D97706]", description: "Premium bonuses for top performers" },
};

// Mock transaction data
const generateTransactions = (type: string) => [
  { id: "TXN001", date: "2024-12-28", sourceId: "3T789456", sourceName: "Priya S.", amount: 750, package: "Gold Plan" },
  { id: "TXN002", date: "2024-12-27", sourceId: "3T789457", sourceName: "Rahul V.", amount: 300, package: "Silver Plan" },
  { id: "TXN003", date: "2024-12-26", sourceId: "3T789458", sourceName: "Vikram K.", amount: 1500, package: "Diamond Plan" },
  { id: "TXN004", date: "2024-12-25", sourceId: "3T789459", sourceName: "Ananya P.", amount: 150, package: "Starter Plan" },
  { id: "TXN005", date: "2024-12-24", sourceId: "3T789460", sourceName: "Neha S.", amount: 500, package: "Gold Plan" },
];

const IncomeReportPage = () => {
  const { type = "referral" } = useParams<{ type: string }>();
  const incomeInfo = incomeTypes[type] || incomeTypes.referral;
  const Icon = incomeInfo.icon;
  const transactions = generateTransactions(type);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <AffiliateSidebar>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 rounded-3xl mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${incomeInfo.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold font-display">{incomeInfo.label}</h1>
                <p className="text-sm text-muted-foreground">{incomeInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-3xl font-bold text-gradient-gold">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">This Month</Button>
            <Button variant="ghost" size="sm">Last Month</Button>
            <Button variant="ghost" size="sm">All Time</Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-4 font-semibold text-sm">Transaction ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm">Source</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm hidden md:table-cell">Package</th>
                  <th className="text-right py-4 px-4 font-semibold text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{txn.id}</code>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {txn.date}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-sm">{txn.sourceName}</p>
                        <p className="text-xs text-muted-foreground">{txn.sourceId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {txn.package}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-emerald">+₹{txn.amount.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactions.length === 0 && (
            <div className="py-12 text-center">
              <Icon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </AffiliateSidebar>
  );
};

export default IncomeReportPage;
