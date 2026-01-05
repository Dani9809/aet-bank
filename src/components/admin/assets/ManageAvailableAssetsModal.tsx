'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    getAvailableAssets,
    createAvailableAsset,
    updateAvailableAsset,
    deleteAvailableAsset,
    getAssetTypes,
    getTaxTypes
} from '@/actions/admin/assetActions';
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, DollarSign, Search, X, Check, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertModal } from "@/components/ui/alert-modal";

interface ManageAvailableAssetsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function ManageAvailableAssetsModal({ open, onOpenChange, onUpdate }: ManageAvailableAssetsModalProps) {
    const [assets, setAssets] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [taxTypes, setTaxTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'list' | 'view' | 'edit' | 'create'>('list');
    const [currentAsset, setCurrentAsset] = useState<any | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [maintenance, setMaintenance] = useState("");
    const [location, setLocation] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [maxUpgrades, setMaxUpgrades] = useState("");
    const [typeId, setTypeId] = useState<string>("");
    const [taxTypeId, setTaxTypeId] = useState("1"); // Default to 1
    const [status, setStatus] = useState(1);
    const [details, setDetails] = useState<{ asset_detail_id?: number, label: string, value: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [assetsRes, typesRes, taxTypesRes] = await Promise.all([
            getAvailableAssets(),
            getAssetTypes(),
            getTaxTypes()
        ]);

        if (assetsRes.success && assetsRes.data) {
            setAssets(assetsRes.data);
        }
        if (typesRes.success && typesRes.data) {
            setTypes(typesRes.data);
        }
        if (taxTypesRes.success && taxTypesRes.data) {
            setTaxTypes(taxTypesRes.data);
        }
        setLoading(false);
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (open) {
            fetchData();
            setMode('list');
            setSearchTerm("");
            setCurrentPage(1);
        }
    }, [open, fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleView = (asset: any) => {
        setCurrentAsset(asset);
        setName(asset.asset_detail_name);
        setDesc(asset.asset_detail_short_desc || "");
        setPrice(asset.asset_price?.toString() || "");
        setMaintenance(asset.asset_monthly_maintenance?.toString() || "");
        setLocation(asset.asset_location || "");
        setImagePath(asset.asset_image_path || "");
        setMaxUpgrades(asset.asset_max_upgrades?.toString() || "0");
        setTypeId(asset.asset_type_id?.toString() || "");
        setTaxTypeId(asset.tax_type_id?.toString() || "1");
        setStatus(asset.asset_status ?? 1);

        // Populate details
        const mappedDetails = asset.ASSET_DETAIL?.map((ad: any) => ({
            asset_detail_id: ad.asset_detail_id,
            label: ad.DETAIL?.detail_label || '',
            value: ad.DETAIL?.detail || ''
        })) || [];
        setDetails(mappedDetails);

        setMode('view');
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleAddNew = () => {
        setCurrentAsset(null);
        setName("");
        setDesc("");
        setPrice("");
        setMaintenance("");
        setLocation("");
        setImagePath("");
        setMaxUpgrades("0");
        setTypeId("");
        setTaxTypeId("1");
        setTaxTypeId("1");
        setStatus(1);
        setDetails([]);
        setMode('create');
    };

    const handleBack = () => {
        if (mode === 'edit') {
            if (currentAsset) {
                // Revert to view mode with original data
                handleView(currentAsset);
            } else {
                setMode('list');
            }
        } else {
            setMode('list');
            setCurrentAsset(null);
        }
    };

    const handleSave = async () => {
        if (!name) {
            toast.error("Name is required");
            return;
        }
        if (!typeId) {
            toast.error("Type is required");
            return;
        }
        if (!price) {
            toast.error("Price is required");
            return;
        }

        const payload = {
            asset_detail_name: name,
            asset_detail_short_desc: desc,
            asset_price: parseFloat(price) || 0,
            asset_monthly_maintenance: parseFloat(maintenance) || 0,
            asset_location: location,
            asset_image_path: imagePath,
            asset_max_upgrades: parseInt(maxUpgrades) || 0,
            asset_type_id: parseInt(typeId),
            tax_type_id: parseInt(taxTypeId) || 1,
            asset_status: status,
            details: details.filter(d => d.label && d.value)
        };

        let res;
        if (currentAsset && (mode === 'edit' || mode === 'view')) {
            res = await updateAvailableAsset(currentAsset.asset_id, payload);
        } else {
            res = await createAvailableAsset(payload);
        }

        if (res.success) {
            toast.success(mode === 'create' ? "Asset created" : "Asset updated");

            if (mode === 'edit') {
                // Update current asset local state so view mode is correct
                setCurrentAsset({ ...currentAsset, ...payload });
                setMode('view');
            } else {
                setMode('list');
            }

            fetchData();
            onUpdate();
        } else {
            toast.error(res.error || "Operation failed");
        }
    };

    const handleDelete = () => {
        setAlertOpen(true);
    };

    const onConfirmDelete = async () => {
        if (!currentAsset) return;
        const res = await deleteAvailableAsset(currentAsset.asset_id);
        if (res.success) {
            toast.success("Asset deleted");
            fetchData();
            onUpdate();
            setMode('list');
            setAlertOpen(false);
        } else {
            toast.error(res.error || "Delete failed");
            setAlertOpen(false);
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.asset_detail_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.asset_detail_short_desc && asset.asset_detail_short_desc.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
    const paginatedAssets = filteredAssets.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getTypeName = (id: number) => {
        const type = types.find(t => t.asset_type_id === id);
        return type ? type.asset_type_name : 'Unknown';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-4xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                {/* Header */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500" />
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
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-heading text-white">Manage Assets</DialogTitle>
                                <p className="text-white/70 text-sm">Create and manage purchasable assets</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Toolbar */}
                    {mode === 'list' && (
                        <div className="relative z-10 px-6 pb-6 pt-2">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60" />
                                    <Input
                                        placeholder="Search assets..."
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-light"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddNew} className="bg-white text-blue-600 hover:bg-white/90 border-0 shadow-lg shadow-blue-900/20 font-semibold gap-2">
                                    <Plus className="h-4 w-4" /> Add Asset
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {mode !== 'list' ? (
                    <>
                        <ScrollArea className="flex-1 bg-background overflow-y-auto">
                            <div className="p-6 max-w-3xl mx-auto w-full space-y-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    {mode === 'create' ? (
                                        <> <Plus className="h-4 w-4 text-primary" /> New Asset </>
                                    ) : mode === 'edit' ? (
                                        <> <Pencil className="h-4 w-4 text-primary" /> Edit Asset </>
                                    ) : (
                                        <> <Briefcase className="h-4 w-4 text-primary" /> Asset Details </>
                                    )}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Asset Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Modern Apartment"
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Asset Type <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={typeId}
                                            onValueChange={setTypeId}
                                            disabled={mode === 'view'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((t) => (
                                                    <SelectItem key={t.asset_type_id} value={t.asset_type_id.toString()}>
                                                        {t.asset_type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Monthly Maintenance</Label>
                                        <Input
                                            type="number"
                                            value={maintenance}
                                            onChange={(e) => setMaintenance(e.target.value)}
                                            placeholder="0.00"
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. New York, NY"
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Image Path</Label>
                                        <Input
                                            value={imagePath}
                                            onChange={(e) => setImagePath(e.target.value)}
                                            placeholder="/assets/images/..."
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max Upgrades</Label>
                                        <Input
                                            type="number"
                                            value={maxUpgrades}
                                            onChange={(e) => setMaxUpgrades(e.target.value)}
                                            placeholder="0"
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tax Type <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={taxTypeId}
                                            onValueChange={setTaxTypeId}
                                            disabled={mode === 'view'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Tax Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {taxTypes.length > 0 ? (
                                                    taxTypes.map((t) => (
                                                        <SelectItem key={t.tax_type_id} value={t.tax_type_id.toString()}>
                                                            {t.tax_name} ({t.tax_rate ?? '?'}%)
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="1">Default Tax Type (1)</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Short Description</Label>
                                    <Textarea
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Brief description..."
                                        className="min-h-[80px]"
                                        disabled={mode === 'view'}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${status === 1 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className="text-sm font-medium">{status === 1 ? 'Active' : 'Inactive'}</span>
                                        </div>
                                        <Switch
                                            checked={status === 1}
                                            onCheckedChange={(checked) => setStatus(checked ? 1 : 0)}
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                </div>

                                {/* Asset Details Section */}
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-medium">Asset Details</Label>
                                        {mode !== 'view' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDetails([...details, { label: '', value: '' }])}
                                                className="h-8 gap-2"
                                            >
                                                <Plus className="h-3 w-3" /> Add Detail
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {details.map((detail, index) => (
                                            <div key={index} className="flex gap-3 items-start">
                                                <div className="grid grid-cols-2 gap-3 flex-1">
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground mb-1.5 block">Label</Label>
                                                        <Input
                                                            value={detail.label}
                                                            onChange={(e) => {
                                                                const newDetails = [...details];
                                                                newDetails[index].label = e.target.value;
                                                                setDetails(newDetails);
                                                            }}
                                                            placeholder="e.g. Color"
                                                            disabled={mode === 'view'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground mb-1.5 block">Value</Label>
                                                        <Input
                                                            value={detail.value}
                                                            onChange={(e) => {
                                                                const newDetails = [...details];
                                                                newDetails[index].value = e.target.value;
                                                                setDetails(newDetails);
                                                            }}
                                                            placeholder="e.g. Red"
                                                            disabled={mode === 'view'}
                                                        />
                                                    </div>
                                                </div>
                                                {mode !== 'view' && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mt-6 h-10 w-10 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                        onClick={() => {
                                                            const newDetails = details.filter((_, i) => i !== index);
                                                            setDetails(newDetails);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {details.length === 0 && (
                                            <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground text-sm">
                                                No details added yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <div className="flex-none flex items-center justify-end gap-3 p-4 border-t bg-background z-10">
                            <Button variant="outline" onClick={handleBack}>
                                {mode === 'edit' ? 'Cancel' : 'Back'}
                            </Button>

                            {mode === 'view' && (
                                <>
                                    <Button variant="destructive" onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                    <Button onClick={handleEdit}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </>
                            )}

                            {(mode === 'create' || mode === 'edit') && (
                                <Button onClick={handleSave} className="min-w-[100px]">
                                    <Check className="h-4 w-4 mr-2" /> {mode === 'create' ? 'Create' : 'Save'}
                                </Button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Table */}
                        <div className="flex-1 bg-background overflow-auto">
                            <div className="min-w-[800px]">
                                <div className="sticky top-0 z-10 border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <div className="w-[30%]">Asset Name</div>
                                    <div className="w-[20%]">Type</div>
                                    <div className="w-[15%] text-right">Price</div>
                                    <div className="w-[15%] text-right">Maintenance</div>
                                    <div className="w-[20%] text-center">Status</div>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading assets...</p>
                                    </div>
                                ) : filteredAssets.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <DollarSign className="h-12 w-12 mb-4 opacity-20" />
                                        <p>No assets found.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {paginatedAssets.map((asset) => (
                                            <div
                                                key={asset.asset_id}
                                                className="flex items-center px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer group gap-4"
                                                onClick={() => handleView(asset)}
                                            >
                                                <div className="w-[30%] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {asset.asset_detail_name}
                                                </div>
                                                <div className="w-[20%] text-sm text-muted-foreground truncate">
                                                    {getTypeName(asset.asset_type_id)}
                                                </div>
                                                <div className="w-[15%] text-sm font-mono text-right">
                                                    ${asset.asset_price?.toLocaleString()}
                                                </div>
                                                <div className="w-[15%] text-sm font-mono text-right text-muted-foreground">
                                                    ${asset.asset_monthly_maintenance?.toLocaleString()}/mo
                                                </div>
                                                <div className="w-[20%] flex justify-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${asset.asset_status === 1
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-600 border-red-500/20'
                                                        }`}>
                                                        {asset.asset_status === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex-none border-t bg-muted/20 p-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
            <AlertModal
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                onConfirm={onConfirmDelete}
                loading={loading}
                title="Delete Asset"
                description="Are you sure you want to delete this asset? This action cannot be undone."
            />
        </Dialog>
    );
}
