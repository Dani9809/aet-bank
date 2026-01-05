'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, TrendingUp, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvestmentDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    investment: any | null;
}

export function InvestmentDetailsModal({ open, onOpenChange, investment }: InvestmentDetailsModalProps) {
    if (!investment) return null;

    const typeName = investment.INVESTMENT_TYPE_DETAIL?.INVESTMENT_TYPE?.investment_type_name || "Unknown";
    const categoryName = investment.INVESTMENT_TYPE_DETAIL?.INVESTMENT_CATEGORY?.investment_category_name || "Unknown";
    const pricePerUnit = investment.INVESTMENT_TYPE_DETAIL?.INVESTMENT_TYPE?.investment_type_price_per_unit || 0;
    const totalValue = investment.user_investment_owned_units * pricePerUnit;

    // User Info
    const userName = investment.ACCOUNT ? `${investment.ACCOUNT.account_fname} ${investment.ACCOUNT.account_lname}` : "Unknown User";
    const userEmail = investment.ACCOUNT?.account_email || "N/A";
    const userUsername = investment.ACCOUNT?.account_uname || "N/A";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-2xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                {/* Header with gradient */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-20 text-white/70 hover:text-white hover:bg-white/20 rounded-full"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <DialogHeader className="relative z-10 p-6 pb-2 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-heading text-white">Investment Details</DialogTitle>
                                <p className="text-white/70 text-sm">View details of user investment</p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <ScrollArea className="flex-1 bg-background overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Investment Info Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                <Info className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-lg">Investment Information</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Investment Type</Label>
                                    <div className="font-medium text-lg">{typeName}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Category</Label>
                                    <div className="font-medium text-lg">{categoryName}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Owned Units</Label>
                                    <div className="font-medium text-lg">{investment.user_investment_owned_units}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Current Value</Label>
                                    <div className="font-medium text-lg text-emerald-500">{formatCurrency(totalValue)}</div>
                                    <p className="text-xs text-muted-foreground">@ {formatCurrency(pricePerUnit)} / unit</p>
                                </div>
                            </div>
                        </div>

                        {/* User Info Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-lg">Holder Information</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">User Name</Label>
                                    <div className="font-medium text-lg">{userName}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Username</Label>
                                    <div className="font-medium text-lg">@{userUsername}</div>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Email Address</Label>
                                    <div className="font-medium text-lg truncate" title={userEmail}>{userEmail}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex-none flex items-center justify-end gap-3 p-4 border-t bg-background z-10">
                    <Button onClick={() => onOpenChange(false)} className="min-w-[100px]">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
