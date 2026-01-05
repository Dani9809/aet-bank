'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateUserBusiness, getBusinessTypeDetails } from '@/actions/admin/businessActions';
import { toast } from "sonner";
import {
    Loader2,
    DollarSign,
    Activity,
    MapPin,
    Building,
    User,
    X,
    Check,
    Pencil,
    Briefcase,
    TrendingUp,
    Shield,
    Calendar,
    MousePointerClick
} from 'lucide-react';

interface BusinessDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    business: any; // Using any for flexibility with joined data
    onUpdate: () => void;
}

export function BusinessDetailsModal({ open, onOpenChange, business, onUpdate }: BusinessDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        user_business_name: "",
        user_business_desc: "",
        user_business_location: "",
        user_business_status: 1,
        business_type_detail_id: ""
    });

    // Reference data
    const [typeDetails, setTypeDetails] = useState<any[]>([]);

    useEffect(() => {
        if (open && business) {
            setFormData({
                user_business_name: business.user_business_name || "",
                user_business_desc: business.user_business_desc || "",
                user_business_location: business.user_business_location || "",
                user_business_status: business.user_business_status,
                business_type_detail_id: business.business_type_detail_id?.toString() || ""
            });
            loadTypeDetails();
        }
    }, [open, business]);

    const loadTypeDetails = async () => {
        const res = await getBusinessTypeDetails();
        if (res.success && res.data) {
            setTypeDetails(res.data);
        }
    };

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        if (business) {
            setFormData({
                user_business_name: business.user_business_name || "",
                user_business_desc: business.user_business_desc || "",
                user_business_location: business.user_business_location || "",
                user_business_status: business.user_business_status,
                business_type_detail_id: business.business_type_detail_id?.toString() || ""
            });
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!formData.user_business_name) {
            toast.error("Business name is required");
            return;
        }

        setSaving(true);
        const payload = {
            ...formData,
            business_type_detail_id: parseInt(formData.business_type_detail_id)
        };

        const res = await updateUserBusiness(business.user_business_id, payload);

        if (res.success) {
            toast.success("Business updated successfully");
            onUpdate();
            setIsEditing(false);
            // Don't close modal, just exit edit mode
        } else {
            toast.error(res.error || "Failed to update business");
        }
        setSaving(false);
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0);
    };

    if (!business) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-2xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                {/* Header with gradient */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
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
                            {/* Icon */}
                            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold flex-shrink-0 text-white">
                                <Building className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>

                            {/* Title and Info */}
                            <div className="flex-1 min-w-0 pt-0.5 text-left">
                                <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-heading text-white leading-tight">
                                    {business.user_business_name}
                                </DialogTitle>

                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mt-2">
                                    <Badge className={formData.user_business_status === 1
                                        ? "bg-emerald-500/80 text-white border-emerald-400/50 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                                        : "bg-red-500/80 text-white border-red-400/50 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                                    }>
                                        {formData.user_business_status === 1 ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                                        ID: {business.user_business_id}
                                    </Badge>
                                </div>
                                <DialogDescription className="text-white/70 text-[10px] sm:text-xs md:text-sm mt-2 flex items-center gap-2">
                                    {business.ACCOUNT ? (
                                        <>
                                            <User className="h-3 w-3" />
                                            Owned by {business.ACCOUNT.account_fname} {business.ACCOUNT.account_lname} (@{business.ACCOUNT.account_uname})
                                        </>
                                    ) : "No Owner"}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Highlights / Stats */}
                        <section className="bg-muted/20 rounded-xl p-4 border border-border">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                                <Activity className="h-4 w-4 text-primary" /> Business Performance
                            </h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <StatCard icon={DollarSign} label="Value" value={formatCurrency(business.user_business_worth)} color="emerald" />
                                <StatCard icon={TrendingUp} label="Income/Mo" value={formatCurrency(business.user_business_monthly_income)} color="sky" />
                                <StatCard icon={Activity} label="Level" value={String(business.user_business_current_level)} color="violet" />
                                <StatCard icon={Briefcase} label="Lifetime Earnings" value={formatCurrency(business.user_business_earnings)} color="amber" />
                            </div>
                        </section>

                        {/* General Information */}
                        <section className="bg-muted/20 rounded-xl p-4 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Building className="h-4 w-4 text-primary" /> General Information
                                </h4>
                                {!isEditing ? (
                                    <Button variant="ghost" size="sm" onClick={handleStartEdit} className="h-8 text-xs">
                                        <Pencil className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-8 text-xs text-red-500">
                                            <X className="h-3 w-3 mr-1" /> Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 text-xs">
                                            {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Check className="h-3 w-3 mr-1" />} Save
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1.5 block">Business Name</Label>
                                            <Input
                                                value={formData.user_business_name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, user_business_name: e.target.value }))}
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-xs text-muted-foreground mb-1.5 block">Type & Category</Label>
                                                <Select
                                                    value={formData.business_type_detail_id}
                                                    onValueChange={(val) => setFormData(prev => ({ ...prev, business_type_detail_id: val }))}
                                                >
                                                    <SelectTrigger className="bg-background">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {typeDetails.map((detail) => (
                                                            <SelectItem key={detail.business_type_detail_id} value={detail.business_type_detail_id.toString()}>
                                                                {detail.BUSINESS_CATEGORY?.business_category_name} - {detail.BUSINESS_TYPE?.business_type_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-muted-foreground mb-1.5 block">Status</Label>
                                                <Select
                                                    value={String(formData.user_business_status)}
                                                    onValueChange={(val) => setFormData(prev => ({ ...prev, user_business_status: parseInt(val) }))}
                                                >
                                                    <SelectTrigger className={`bg-background ${formData.user_business_status === 1 ? 'text-emerald-600' : 'text-red-500'
                                                        }`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">Active</SelectItem>
                                                        <SelectItem value="0">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1.5 block">Description</Label>
                                            <Textarea
                                                value={formData.user_business_desc}
                                                onChange={(e) => setFormData(prev => ({ ...prev, user_business_desc: e.target.value }))}
                                                className="bg-background min-h-[80px]"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-muted-foreground mb-1.5 block">Location</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    value={formData.user_business_location}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, user_business_location: e.target.value }))}
                                                    className="bg-background pl-9"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InfoItem icon={Building} label="Business Name" value={business.user_business_name} />
                                            {/* Type/Category display logic could be better if we found the object from typeDetails, 
                                                but we can rely on what's in 'business' if joined, or just show ID/loading if tricky. 
                                                Ideally 'business' object passed in has the joined tables. 
                                                Let's check if business has BUSINESS_TYPE_DETAIL. 
                                            */}
                                            <InfoItem icon={Briefcase} label="Type" value={
                                                business.BUSINESS_TYPE_DETAIL
                                                    ? `${business.BUSINESS_TYPE_DETAIL.BUSINESS_CATEGORY?.business_category_name} - ${business.BUSINESS_TYPE_DETAIL.BUSINESS_TYPE?.business_type_name}`
                                                    : `Type ID: ${business.business_type_detail_id}`
                                            } />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <InfoItem icon={MapPin} label="Location" value={business.user_business_location} />
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <MousePointerClick className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-muted-foreground">Description</p>
                                                    <p className="text-sm font-medium text-foreground whitespace-pre-wrap">{business.user_business_desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Financial & Maintenance */}
                        <section className="bg-muted/20 rounded-xl p-4 border border-border">
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                                <Shield className="h-4 w-4 text-primary" /> Financial & Maintenance
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                    icon={DollarSign}
                                    label="Monthly Tax"
                                    value={formatCurrency(business.user_business_monthly_tax)}
                                />
                                <InfoItem
                                    icon={DollarSign}
                                    label="Monthly Maintenance"
                                    value={formatCurrency(business.user_business_monthly_maintenance)}
                                />
                                <InfoItem
                                    icon={Calendar}
                                    label="Last Tax Collection"
                                    value={business.last_tax_collection ? new Date(business.last_tax_collection).toLocaleString() : 'Never'}
                                />
                                <InfoItem
                                    icon={Calendar}
                                    label="Last Maintenance Collection"
                                    value={business.last_maintenance_collection ? new Date(business.last_maintenance_collection).toLocaleString() : 'Never'}
                                />
                            </div>
                        </section>
                    </div>
                </ScrollArea>
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
