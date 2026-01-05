import React from 'react';

interface DashboardHeaderProps {
    greeting: string;
    adminName?: string;
}

export default function DashboardHeader({ greeting, adminName }: DashboardHeaderProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-6 sm:p-8 text-white shadow-xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium mb-1">{greeting},</p>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight mb-2">
                    {adminName}
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
    );
}
