import React from 'react';

export default function DashboardSystemStatus() {
    return (
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
    );
}
