import {
    Users,
    Briefcase,
    Landmark,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from "lucide-react";
import { DashboardStats } from "@/actions/admin/dashboardActions";

export type DashboardStatItem = {
    title: string;
    value: number;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: any;
    gradient: string;
    iconBg: string; // Keep utilizing these for now, or derive from gradient
    iconColor: string;
}

export function formatDashboardStats(data: DashboardStats): DashboardStatItem[] {
    const formatGrowth = (growth: number) => {
        const val = Math.round(growth);
        if (val > 0) return `+${val}%`;
        if (val < 0) return `${val}%`;
        return '0%';
    };

    const getTrend = (growth: number): 'up' | 'down' | 'neutral' => {
        if (growth > 0) return 'up';
        if (growth < 0) return 'down';
        return 'neutral';
    };

    return [
        {
            title: 'Total Accounts',
            value: data.accounts.count,
            change: formatGrowth(data.accounts.growth),
            trend: getTrend(data.accounts.growth),
            icon: Users,
            gradient: 'from-blue-500 to-cyan-400',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Total Businesses',
            value: data.businesses.count,
            change: formatGrowth(data.businesses.growth),
            trend: getTrend(data.businesses.growth),
            icon: Briefcase,
            gradient: 'from-amber-500 to-orange-400',
            iconBg: 'bg-amber-500/10',
            iconColor: 'text-amber-500',
        },
        {
            title: 'Total Assets',
            value: data.assets.count,
            change: formatGrowth(data.assets.growth),
            trend: getTrend(data.assets.growth),
            icon: Landmark,
            gradient: 'from-emerald-500 to-teal-400',
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
        },
        {
            title: 'Total Investments',
            value: data.investments.count,
            change: formatGrowth(data.investments.growth),
            trend: getTrend(data.investments.growth),
            icon: TrendingUp,
            gradient: 'from-violet-500 to-purple-400',
            iconBg: 'bg-violet-500/10',
            iconColor: 'text-violet-500',
        },
    ];
}
