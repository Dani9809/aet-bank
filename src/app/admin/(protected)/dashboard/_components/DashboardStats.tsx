import React from 'react';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardStatItem } from '../dashboardUtils';

interface DashboardStatsProps {
    stats: DashboardStatItem[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="group relative bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-1 right-1 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-2xl opacity-80`} />

                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${stat.iconBg}`}>
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
    );
}
