'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User, Shield, DollarSign, MousePointerClick, TrendingUp, Briefcase,
    MapPin, Mail, AtSign, Smartphone, Loader2, Key, Lock, Pencil, X, Check
} from "lucide-react";
import { updateAccountProfile, updateAccountPassword, updateAccountPin, updateAccountStatus, updateAccountType } from "@/actions/admin/accountActions";
import { getAccountTypes, AccountType } from "@/actions/admin/typeActions";
import { toast } from "sonner";

interface AccountDetailsModalProps {
    account: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccountUpdated?: () => void;
}

export function AccountDetailsModal({ account, open, onOpenChange, onAccountUpdated }: AccountDetailsModalProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        account_fname: '',
        account_mname: '',
        account_lname: '',
        account_email: '',
        account_uname: '',
        account_address: '',
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [newPin, setNewPin] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);
    const [savingPin, setSavingPin] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
    const [savingType, setSavingType] = useState(false);

    useEffect(() => {
        const fetchTypes = async () => {
            const res = await getAccountTypes();
            if (res.success && res.data) {
                setAccountTypes(res.data);
            }
        };
        fetchTypes();
    }, []);

    if (!account) return null;

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0);
    };

    const handleStartEditProfile = () => {
        setProfileForm({
            account_fname: account.account_fname || '',
            account_mname: account.account_mname || '',
            account_lname: account.account_lname || '',
            account_email: account.account_email || '',
            account_uname: account.account_uname || '',
            account_address: account.account_address || '',
        });
        setIsEditingProfile(true);
    };

    const handleCancelEditProfile = () => {
        setIsEditingProfile(false);
    };

    const handleSaveProfile = async () => {
        if (!profileForm.account_fname.trim() || !profileForm.account_lname.trim()) {
            toast.error('First and Last name are required');
            return;
        }
        if (!profileForm.account_email.trim() || !profileForm.account_email.includes('@')) {
            toast.error('Valid email is required');
            return;
        }
        if (!profileForm.account_uname.trim() || profileForm.account_uname.length < 4) {
            toast.error('Username must be at least 4 characters');
            return;
        }

        setSavingProfile(true);
        try {
            const res = await updateAccountProfile(account.account_id, profileForm);
            if (res.success) {
                toast.success('Profile updated successfully');
                setIsEditingProfile(false);
                onAccountUpdated?.();
            } else {
                toast.error(res.error || 'Failed to update profile');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setSavingPassword(true);
        try {
            const res = await updateAccountPassword(account.account_id, newPassword);
            if (res.success) {
                toast.success('Password updated');
                setNewPassword('');
            } else {
                toast.error(res.error || 'Failed to update password');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setSavingPassword(false);
        }
    };

    const handleUpdatePin = async () => {
        if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
            toast.error('PIN must be exactly 6 digits');
            return;
        }
        setSavingPin(true);
        try {
            const res = await updateAccountPin(account.account_id, newPin);
            if (res.success) {
                toast.success('PIN updated');
                setNewPin('');
            } else {
                toast.error(res.error || 'Failed to update PIN');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setSavingPin(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        const statusValue = parseInt(newStatus);
        if (statusValue === account.account_status) return;

        setSavingStatus(true);
        try {
            const res = await updateAccountStatus(account.account_id, statusValue);
            if (res.success) {
                toast.success(`Account ${statusValue === 1 ? 'activated' : 'deactivated'} successfully`);
                onAccountUpdated?.();
            } else {
                toast.error(res.error || 'Failed to update status');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setSavingStatus(false);
        }
    };

    const handleUpdateType = async (newTypeId: string) => {
        const typeIdValue = parseInt(newTypeId);
        if (typeIdValue === account.type_id) return;

        setSavingType(true);
        try {
            const res = await updateAccountType(account.account_id, typeIdValue);
            if (res.success) {
                toast.success('Account type updated successfully');
                onAccountUpdated?.();
            } else {
                toast.error(res.error || 'Failed to update account type');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setSavingType(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-2xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                {/* Header with gradient */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-20 text-white/70 hover:text-white hover:bg-white/20 rounded-full"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <DialogHeader className="relative z-10 p-4 sm:p-5 md:p-6 pt-5 sm:pt-6 text-white">
                        <div className="flex items-start gap-3 sm:gap-4 pr-10">
                            {/* Avatar */}
                            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold flex-shrink-0">
                                {account.account_fname?.[0]}{account.account_lname?.[0]}
                            </div>

                            {/* Name and Badges - Stacked */}
                            <div className="flex-1 min-w-0 pt-0.5">
                                <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-heading text-white leading-tight">
                                    {account.account_fname} {account.account_mname ? account.account_mname + ' ' : ''}{account.account_lname}
                                </DialogTitle>

                                {/* Badges below name */}
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-2">
                                    <Badge
                                        className={account.type_id === 99
                                            ? "bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                                            : "bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                                        }
                                    >
                                        {account.type_id === 99 ? 'Admin' : 'User'}
                                    </Badge>
                                    <Badge
                                        className={account.account_status === 1
                                            ? "bg-emerald-500/80 text-white border-emerald-400/50 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                                            : "bg-red-500/80 text-white border-red-400/50 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                                        }
                                    >
                                        {account.account_status === 1 ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <DialogDescription className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-2">
                                    ID: {account.account_id} • @{account.account_uname}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Personal Details */}
                        <section className="bg-muted/20 rounded-xl p-4 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" /> Personal Details
                                </h4>
                                {!isEditingProfile ? (
                                    <Button variant="ghost" size="sm" onClick={handleStartEditProfile} className="h-8 text-xs">
                                        <Pencil className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={handleCancelEditProfile} className="h-8 text-xs text-red-500">
                                            <X className="h-3 w-3 mr-1" /> Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile} className="h-8 text-xs">
                                            {savingProfile ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />} Save
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {isEditingProfile ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <Input placeholder="First Name" value={profileForm.account_fname} onChange={(e) => setProfileForm(p => ({ ...p, account_fname: e.target.value }))} className="h-10" />
                                        <Input placeholder="Middle Name" value={profileForm.account_mname} onChange={(e) => setProfileForm(p => ({ ...p, account_mname: e.target.value }))} className="h-10" />
                                        <Input placeholder="Last Name" value={profileForm.account_lname} onChange={(e) => setProfileForm(p => ({ ...p, account_lname: e.target.value }))} className="h-10" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input type="email" placeholder="Email" value={profileForm.account_email} onChange={(e) => setProfileForm(p => ({ ...p, account_email: e.target.value }))} className="h-10" />
                                        <Input placeholder="Username" value={profileForm.account_uname} onChange={(e) => setProfileForm(p => ({ ...p, account_uname: e.target.value }))} className="h-10" />
                                    </div>
                                    <Input placeholder="Address" value={profileForm.account_address} onChange={(e) => setProfileForm(p => ({ ...p, account_address: e.target.value }))} className="h-10" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoItem icon={User} label="Full Name" value={`${account.account_fname} ${account.account_mname || ''} ${account.account_lname}`.trim()} />
                                    <InfoItem icon={AtSign} label="Username" value={account.account_uname} />
                                    <InfoItem icon={Mail} label="Email" value={account.account_email} />
                                    <InfoItem icon={MapPin} label="Address" value={account.account_address || 'Not provided'} />
                                </div>
                            )}
                        </section>

                        {/* Financial Overview */}
                        <section className="bg-muted/20 rounded-xl p-4 border border-border">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                                <DollarSign className="h-4 w-4 text-primary" /> Financial Overview
                            </h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <StatCard icon={MousePointerClick} label="Total Clicks" value={account.account_total_clicks?.toLocaleString() || '0'} color="sky" />
                                <StatCard icon={Briefcase} label="Business" value={formatCurrency(account.account_business_total_earnings)} color="emerald" />
                                <StatCard icon={TrendingUp} label="Investment" value={formatCurrency(account.account_investment_total_earnings)} color="violet" />
                                <StatCard icon={MousePointerClick} label="Clicker" value={formatCurrency(account.account_clicker_total_earnings)} color="amber" />
                            </div>
                        </section>

                        {/* Security */}
                        <section className="bg-muted/20 rounded-xl p-4 border border-border">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                                <Shield className="h-4 w-4 text-primary" /> Security
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <InfoItem icon={Shield} label="Stage" value={account.account_current_stage || 'N/A'} />
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <Smartphone className="h-3 w-3" /> Device
                                    </div>
                                    <code className="block text-xs bg-background p-2 rounded-lg border border-border font-mono break-all">
                                        {account.account_registered_device || 'None'}
                                    </code>
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="pt-4 border-t border-border mb-4">
                                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                    <Shield className="h-3 w-3" /> Account Status & Type
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Status Select */}
                                    <div className="flex-1">
                                        <label className="text-[10px] text-muted-foreground mb-1.5 block ml-1">Status</label>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={String(account.account_status)}
                                                onValueChange={handleUpdateStatus}
                                                disabled={savingStatus}
                                            >
                                                <SelectTrigger className={`w-full h-10 ${account.account_status === 1
                                                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
                                                    : 'border-red-500/50 bg-red-500/10 text-red-600'
                                                    }`}>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        <span className="flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            Active
                                                        </span>
                                                    </SelectItem>
                                                    <SelectItem value="0">
                                                        <span className="flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-red-500" />
                                                            Inactive
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {savingStatus && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                        </div>
                                    </div>

                                    {/* Type Select */}
                                    <div className="flex-1">
                                        <label className="text-[10px] text-muted-foreground mb-1.5 block ml-1">Account Type</label>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={String(account.type_id)}
                                                onValueChange={handleUpdateType}
                                                disabled={savingType}
                                            >
                                                <SelectTrigger className="w-full h-10 border-border bg-background">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {accountTypes.map((type) => (
                                                        <SelectItem key={type.type_id} value={String(type.type_id)}>
                                                            {type.type_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {savingType && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                    <Key className="h-3 w-3" /> Admin Override - Reset Credentials
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex gap-2">
                                        <Input type="password" placeholder="New Password (min 6)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-9 flex-1" />
                                        <Button size="sm" onClick={handleUpdatePassword} disabled={savingPassword || newPassword.length < 6} className="h-9">
                                            {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input type="password" placeholder="New PIN (6 digits)" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="h-9 flex-1 font-mono tracking-widest" />
                                        <Button size="sm" onClick={handleUpdatePin} disabled={savingPin || newPin.length !== 6} className="h-9">
                                            {savingPin ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
                    <Button onClick={() => onOpenChange(false)} className="px-6">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper components
function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground truncate">{value}</p>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    const colorClasses: Record<string, string> = {
        sky: 'bg-sky-500/10 text-sky-500',
        emerald: 'bg-emerald-500/10 text-emerald-500',
        violet: 'bg-violet-500/10 text-violet-500',
        amber: 'bg-amber-500/10 text-amber-500',
    };

    return (
        <div className="bg-background rounded-xl p-3 border border-border text-center">
            <div className={`p-2 ${colorClasses[color]} rounded-lg inline-flex mb-2`}>
                <Icon className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-bold font-heading text-foreground">{value}</p>
        </div>
    );
}
