'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertModal } from "@/components/ui/alert-modal";
import { updateUserAsset, deleteUserAsset } from '@/actions/admin/assetActions';
import { toast } from "sonner";
import { X, MapPin, DollarSign, Image as ImageIcon, Briefcase, FileText, Settings, Pencil, Trash2, Check, Calendar, ListChecks, TrendingUp, Maximize2 } from "lucide-react";
import Image from "next/image";

interface AssetDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    asset: any;
    onUpdate?: () => void;
}

export function AssetDetailsModal({ open, onOpenChange, asset, onUpdate }: AssetDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState<number>(1);

    // New Editable Fields
    const [editMonthlyTax, setEditMonthlyTax] = useState<number>(0);
    const [editMonthlyMaintenance, setEditMonthlyMaintenance] = useState<number>(0);
    const [editMarketValue, setEditMarketValue] = useState<number>(0);
    const [editCurrentUpgrade, setEditCurrentUpgrade] = useState<number>(0);

    const [alertOpen, setAlertOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (asset) {
            setEditName(asset.user_asset_custom_name || asset.ASSET?.asset_detail_name || '');
            setEditStatus(asset.user_asset_status ?? 1);
            setEditMonthlyTax(asset.user_asset_monthly_tax || 0);
            setEditMonthlyMaintenance(asset.user_asset_monthly_maintenance || 0);
            setEditMarketValue(asset.user_asset_market_value || 0);
            setEditCurrentUpgrade(asset.user_asset_current_upgrade || 0);
        }
        setIsEditing(false); // Reset edit mode when asset changes
    }, [asset]);

    if (!asset) return null;

    // Helper to safely get nested values
    const assetName = asset.user_asset_custom_name || asset.ASSET?.asset_detail_name || 'Unnamed Asset';
    const assetImage = asset.ASSET?.asset_image_path || '';
    const location = asset.ASSET?.asset_location || 'N/A';
    const description = asset.ASSET?.asset_detail_short_desc || '';
    const typeName = asset.ASSET?.ASSET_TYPE?.asset_type_name || 'N/A';
    const categoryName = asset.ASSET?.ASSET_TYPE?.ASSET_CATEGORY?.asset_category_name || 'N/A';
    const taxType = asset.ASSET?.TAX_TYPE?.tax_name
        ? `${asset.ASSET.TAX_TYPE.tax_name} (${asset.ASSET.TAX_TYPE.tax_rate}%)`
        : 'N/A';
    const maxUpgrades = asset.ASSET?.asset_max_upgrades || 0;
    const status = asset.user_asset_status === 1 ? 'Active' : 'Inactive';

    // New Display Fields (Read-Only from ASSET)
    const assetPrice = asset.ASSET?.asset_price || 0;
    const assetMaintenance = asset.ASSET?.asset_monthly_maintenance || 0;

    // New Display Fields (Read-Only from USER_ASSET)
    const lastTaxCollection = asset.last_tax_collection ? new Date(asset.last_tax_collection).toLocaleDateString() : 'Never';
    const lastMaintenancePaid = asset.last_maintenance_paid ? new Date(asset.last_maintenance_paid).toLocaleDateString() : 'Never';


    const handleSave = async () => {
        setLoading(true);
        const res = await updateUserAsset(asset.user_asset_id, {
            user_asset_custom_name: editName,
            user_asset_status: editStatus,
            user_asset_monthly_tax: editMonthlyTax,
            user_asset_monthly_maintenance: editMonthlyMaintenance,
            user_asset_market_value: editMarketValue,
            user_asset_current_upgrade: editCurrentUpgrade
        });

        if (res.success) {
            toast.success("Asset updated successfully");
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } else {
            toast.error(res.error || "Failed to update asset");
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!asset) return;
        setLoading(true);
        const res = await deleteUserAsset(asset.user_asset_id);
        if (res.success) {
            toast.success("Asset deleted successfully");
            setAlertOpen(false);
            onOpenChange(false);
            if (onUpdate) onUpdate();
        } else {
            toast.error(res.error || "Failed to delete asset");
            setAlertOpen(false);
        }
        setLoading(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[95vw] max-w-2xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                    <div
                        className="relative w-full aspect-[21/9] min-h-[160px] bg-muted text-white cursor-pointer group"
                        onClick={() => assetImage && setIsImageExpanded(true)}
                    >
                        {assetImage ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={`/assets/images/${assetImage}`}
                                    alt={assetName}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/30 text-white shadow-lg transform transition-transform group-hover:scale-110">
                                        <Maximize2 className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                <ImageIcon className="h-12 w-12 opacity-20" />
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-20 text-white/70 hover:text-white hover:bg-white/20 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenChange(false);
                            }}
                        >
                            <X className="h-5 w-5" />
                        </Button>

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10 pointer-events-none">
                            <DialogTitle className="text-2xl sm:text-3xl font-heading font-bold drop-shadow-md">{assetName}</DialogTitle>

                            <div className="flex items-center gap-2 text-white/90 text-sm mt-1 font-medium drop-shadow-sm">
                                <MapPin className="h-3.5 w-3.5" />
                                {location}
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${status === 'Active'
                                    ? 'bg-emerald-500/80 border-emerald-500/30 text-white'
                                    : 'bg-red-500/80 border-red-500/30 text-white'
                                    }`}>
                                    {status}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-white/20 border-white/20 text-white backdrop-blur-md shadow-sm">
                                    {categoryName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">

                        {/* Description */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Description
                            </h4>
                            <p className="text-sm text-foreground/90 leading-relaxed">
                                {description || <span className="italic text-muted-foreground">No description provided.</span>}
                            </p>
                        </div>

                        {/* Features List */}
                        {asset.ASSET?.ASSET_DETAIL && asset.ASSET.ASSET_DETAIL.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <ListChecks className="h-4 w-4" /> Details {`(${asset.ASSET.ASSET_DETAIL.length})`}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {asset.ASSET.ASSET_DETAIL.map((detail: any, index: number) => (
                                        <div key={detail.asset_detail_id || index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                                            <span className="text-sm font-medium text-foreground">
                                                {detail.DETAIL?.detail_label || 'Detail'}
                                            </span>
                                            {detail.DETAIL?.detail && (
                                                <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                    {detail.DETAIL.detail}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* User Configuration Section (Edit Mode Only or Display) */}
                        <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2 pb-2 border-b">
                                <Settings className="h-4 w-4" /> Specific Configuration
                            </h4>
                            {isEditing ? (
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Asset Status</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">{editStatus === 1 ? 'Active' : 'Inactive'}</span>
                                            <Switch
                                                checked={editStatus === 1}
                                                onCheckedChange={(checked) => setEditStatus(checked ? 1 : 0)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Custom Name</label>
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Enter custom asset name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Monthly Tax</label>
                                            <Input
                                                type="number"
                                                value={editMonthlyTax}
                                                onChange={(e) => setEditMonthlyTax(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Monthly Maintenance</label>
                                            <Input
                                                type="number"
                                                value={editMonthlyMaintenance}
                                                onChange={(e) => setEditMonthlyMaintenance(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Market Value</label>
                                            <Input
                                                type="number"
                                                value={editMarketValue}
                                                onChange={(e) => setEditMarketValue(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-muted-foreground">Current Upgrade Level</label>
                                            <Input
                                                type="number"
                                                value={editCurrentUpgrade}
                                                onChange={(e) => setEditCurrentUpgrade(Number(e.target.value))}
                                                max={maxUpgrades}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-1">Monthly Tax</span>
                                        <span className="text-sm font-medium bg-muted/50 px-2 py-1 rounded inline-block">
                                            ${asset.user_asset_monthly_tax?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-1">Maintenance</span>
                                        <span className="text-sm font-medium bg-muted/50 px-2 py-1 rounded inline-block">
                                            ${asset.user_asset_monthly_maintenance?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-1">Market Value</span>
                                        <span className="text-sm font-medium bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded inline-block">
                                            ${asset.user_asset_market_value?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground block mb-1">Upgrades</span>
                                        <span className="text-sm font-medium bg-indigo-500/10 text-indigo-600 px-2 py-1 rounded inline-block">
                                            {asset.user_asset_current_upgrade || 0} / {maxUpgrades}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* General Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> General Info
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <span className="text-sm font-medium">{typeName}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Category</span>
                                        <span className="text-sm font-medium">{categoryName}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Max Upgrades</span>
                                        <span className="text-sm font-medium">{maxUpgrades}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Default Price</span>
                                        <span className="text-sm font-medium">${assetPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Default Maintenance</span>
                                        <span className="text-sm font-medium">${assetMaintenance.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" /> Collections
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Tax Scheme</span>
                                        <span className="text-sm font-medium">{taxType}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Last Tax Collection</span>
                                        <span className="text-sm font-medium flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" /> {lastTaxCollection}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Last Maintenance</span>
                                        <span className="text-sm font-medium flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" /> {lastMaintenancePaid}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
                        {isEditing ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={loading}>
                                    <Check className="h-4 w-4 mr-2" /> Save Changes
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-2">
                                    <Button variant="destructive" size="sm" onClick={() => setAlertOpen(true)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </div>
                                <Button variant="outline" onClick={() => onOpenChange(false)}>
                                    Close
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>

                <AlertModal
                    isOpen={alertOpen}
                    onClose={() => setAlertOpen(false)}
                    onConfirm={handleDelete}
                    loading={loading}
                    title="Delete User Asset"
                    description="Are you sure you want to remove this asset from the user's portfolio? This action cannot be undone."
                />
            </Dialog>

            {/* Image Expansion Lightbox */}
            <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
                <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center [&>button]:hidden">
                    <DialogTitle className="sr-only">Expanded Asset Image</DialogTitle>
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={() => setIsImageExpanded(false)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsImageExpanded(false);
                            }}
                        >
                            <X className="h-8 w-8" />
                        </Button>
                        {assetImage && (
                            <Image
                                src={`/assets/images/${assetImage}`}
                                alt={assetName}
                                fill
                                className="object-contain drop-shadow-2xl"
                                quality={100}
                                priority
                            />
                        )}
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                            <h2 className="text-white/90 text-2xl font-bold font-heading drop-shadow-lg">{assetName}</h2>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
