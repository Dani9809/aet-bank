import { getAdminSession } from "@/actions/adminActions";
import { supabase } from "@/lib/supabase";
import {
    Users,
    CreditCard,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShieldCheck
} from "lucide-react";

export default async function AdminDashboardPage() {
    const userId = await getAdminSession();

    // Fetch admin details
    const { data: admin } = await supabase
        .from('ACCOUNT')
        .select('account_fname, account_lname')
        .eq('account_id', userId)
        .single();

    // Fetch stats
    const { count: totalAccounts } = await supabase
        .from('ACCOUNT')
        .select('*', { count: 'exact', head: true });

    const { count: activeAccounts } = await supabase
        .from('ACCOUNT')
        .select('*', { count: 'exact', head: true })
        .eq('account_status', 1);

    const { count: adminAccounts } = await supabase
        .from('ACCOUNT')
        .select('*', { count: 'exact', head: true })
        .eq('type_id', 99);

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    const stats = [
        {
            title: 'Total Accounts',
            value: totalAccounts || 0,
            change: '+12%',
            trend: 'up',
            icon: Users,
            gradient: 'from-blue-500 to-cyan-400',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Active Users',
            value: activeAccounts || 0,
            change: '+5%',
            trend: 'up',
            icon: Activity,
            gradient: 'from-emerald-500 to-teal-400',
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
        },
        {
            title: 'Administrators',
            value: adminAccounts || 0,
            change: '0%',
            trend: 'neutral',
            icon: ShieldCheck,
            gradient: 'from-violet-500 to-purple-400',
            iconBg: 'bg-violet-500/10',
            iconColor: 'text-violet-500',
        },
        {
            title: 'Inactive Accounts',
            value: (totalAccounts || 0) - (activeAccounts || 0),
            change: '-3%',
            trend: 'down',
            icon: Clock,
            gradient: 'from-amber-500 to-orange-400',
            iconBg: 'bg-amber-500/10',
            iconColor: 'text-amber-500',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-6 sm:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <p className="text-white/80 text-sm font-medium mb-1">{greeting},</p>
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight mb-2">
                        {admin?.account_fname} {admin?.account_lname}
                    </h1>
                    <p className="text-white/70 text-sm max-w-md">
                        Here&apos;s an overview of your admin dashboard. Monitor accounts and system status.
                    </p>
                </div>

                {/* Decorative shapes */}
                <div className="absolute bottom-4 right-4 opacity-20">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                        <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="group relative bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Gradient accent line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-2xl opacity-80`} />

                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' :
                                    stat.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                                }`}>
                                {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                                {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                                {stat.change}
                            </div>
                        </div>

                        <div>
                            <p className="text-3xl font-bold font-heading text-foreground mb-1">
                                {stat.value.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 font-heading">Quick Actions</h3>
                    <div className="space-y-3">
                        <a
                            href="/admin/accounts"
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Manage Accounts</p>
                                <p className="text-xs text-muted-foreground">View and edit user accounts</p>
                            </div>
                        </a>
                        <a
                            href="/admin/settings"
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                            <div className="p-2 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                                <ShieldCheck className="h-4 w-4 text-violet-500" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Admin Settings</p>
                                <p className="text-xs text-muted-foreground">Configure system preferences</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* System Status */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 font-heading">System Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                            <div className="relative">
                                <span className="flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">Database</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                            <div className="relative">
                                <span className="flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">Authentication</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                            <div className="relative">
                                <span className="flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">API Services</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Operational</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                            <div className="relative">
                                <span className="flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-emerald-700 dark:text-emerald-400">Storage</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
