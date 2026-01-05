import React from 'react';
import { Users, ShieldCheck } from "lucide-react";

export default function DashboardQuickActions() {
    return (
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
    );
}
