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
import { getBusinessTypes, createBusinessType, updateBusinessType, deleteBusinessType, getTaxTypes } from '@/actions/admin/businessActions';
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Tag, Search, X, Check, DollarSign, PenTool, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ManageTypesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function ManageTypesModal({ open, onOpenChange, onUpdate }: ManageTypesModalProps) {
    const [types, setTypes] = useState<any[]>([]);
    const [taxTypes, setTaxTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'list' | 'view' | 'edit' | 'create'>('list');
    const [currentType, setCurrentType] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [cost, setCost] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [maintenance, setMaintenance] = useState(0);
    const [maxLevel, setMaxLevel] = useState(1);
    const [status, setStatus] = useState(1);
    const [selectedTaxType, setSelectedTaxType] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [typesRes, taxRes] = await Promise.all([
            getBusinessTypes(),
            getTaxTypes()
        ]);

        if (typesRes.success && typesRes.data) {
            setTypes(typesRes.data);
        }
        if (taxRes.success && taxRes.data) {
            setTaxTypes(taxRes.data);
        }
        setLoading(false);
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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

    const handleView = (type: any) => {
        setCurrentType(type);
        setName(type.business_type_name);
        setDesc(type.business_type_desc || "");
        setCost(type.business_type_cost || 0);
        setEarnings(type.business_type_monthly_earnings || 0);
        setMaintenance(type.business_type_monthly_maintenance || 0);
        setMaxLevel(type.business_type_max_level || 1);
        setStatus(type.business_type_status ?? 1);
        setSelectedTaxType(type.tax_type_id?.toString() || "");
        setMode('view');
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleAddNew = () => {
        setCurrentType(null);
        setName("");
        setDesc("");
        setCost(0);
        setEarnings(0);
        setMaintenance(0);
        setMaxLevel(1);
        setStatus(1);
        setSelectedTaxType("");
        setMode('create');
    };

    const handleBack = () => {
        if (mode === 'edit') {
            // Cancel edit, go back to view and reset form
            if (currentType) {
                // Restore values
                setName(currentType.business_type_name);
                setDesc(currentType.business_type_desc || "");
                setCost(currentType.business_type_cost || 0);
                setEarnings(currentType.business_type_monthly_earnings || 0);
                setMaintenance(currentType.business_type_monthly_maintenance || 0);
                setMaxLevel(currentType.business_type_max_level || 1);
                setStatus(currentType.business_type_status ?? 1);
                setSelectedTaxType(currentType.tax_type_id?.toString() || "");
                setMode('view');
            } else {
                setMode('list');
            }
        } else {
            // Back to list
            setMode('list');
            setCurrentType(null);
        }
    };

    const handleSave = async () => {
        if (!name) {
            toast.error("Type name is required");
            return;
        }

        if (!selectedTaxType) {
            toast.error("Tax Type is required");
            return;
        }

        const payload = {
            business_type_name: name,
            business_type_desc: desc,
            business_type_cost: cost,
            business_type_monthly_earnings: earnings,
            business_type_monthly_maintenance: maintenance,
            business_type_max_level: maxLevel,
            business_type_status: status,
            tax_type_id: parseInt(selectedTaxType)
        };

        let res;
        if (currentType && (mode === 'edit' || mode === 'view')) {
            res = await updateBusinessType(currentType.business_type_id, payload);
        } else {
            res = await createBusinessType(payload);
        }

        if (res.success) {
            toast.success(mode === 'create' ? "Type created" : "Type updated");
            if (mode === 'edit') {
                // Update local state to reflect changes in view mode
                setCurrentType({
                    ...currentType,
                    ...payload,
                    TAX_TYPE: taxTypes.find(t => t.tax_type_id === parseInt(selectedTaxType)) // Manually update joined data for view
                });
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

    const handleDelete = async () => {
        if (!currentType) return;
        if (confirm("Are you sure you want to delete this type?")) {
            const res = await deleteBusinessType(currentType.business_type_id);
            if (res.success) {
                toast.success("Type deleted");
                fetchData();
                onUpdate();
                setMode('list');
            } else {
                toast.error(res.error || "Delete failed");
            }
        }
    };

    const filteredTypes = types.filter(type =>
        type.business_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type.business_type_desc && type.business_type_desc.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredTypes.length / ITEMS_PER_PAGE);
    const paginatedTypes = filteredTypes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-6xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
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

                    <DialogHeader className="relative z-10 p-6 pb-2 text-white">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                <Tag className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-heading text-white">Manage Business Types</DialogTitle>
                                <p className="text-white/70 text-sm">Configure business definitions and economics</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Toolbar - Only in LIST mode */}
                    {mode === 'list' && (
                        <div className="relative z-10 px-6 pb-6 pt-2">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60" />
                                    <Input
                                        placeholder="Search business types..."
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-light"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddNew} className="bg-white text-blue-600 hover:bg-white/90 border-0 shadow-lg shadow-blue-900/20 font-semibold gap-2">
                                    <Plus className="h-4 w-4" /> Add Type
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {mode !== 'list' ? (
                    <>
                        <ScrollArea className="flex-1 bg-background overflow-y-auto">
                            <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    {mode === 'create' ? (
                                        <> <Plus className="h-4 w-4 text-primary" /> New Type </>
                                    ) : mode === 'edit' ? (
                                        <> <Pencil className="h-4 w-4 text-primary" /> Edit Type </>
                                    ) : (
                                        <> <Tag className="h-4 w-4 text-primary" /> Type Details </>
                                    )}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* General Info */}
                                    <div className="space-y-4 md:col-span-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Type Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. Retail Store"
                                                    className="bg-background disabled:opacity-100 disabled:bg-muted/10"
                                                    disabled={mode === 'view'}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tax Scheme <span className="text-red-500">*</span></Label>
                                                <Select value={selectedTaxType} onValueChange={setSelectedTaxType} disabled={mode === 'view'}>
                                                    <SelectTrigger className="bg-background disabled:opacity-100 disabled:bg-muted/10">
                                                        <SelectValue placeholder="Select Tax" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {taxTypes.map((tax) => (
                                                            <SelectItem key={tax.tax_type_id} value={tax.tax_type_id.toString()}>
                                                                {tax.tax_name} ({tax.tax_rate}%)
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={desc}
                                                onChange={(e) => setDesc(e.target.value)}
                                                placeholder="Describe this business type..."
                                                className="bg-background min-h-[80px] disabled:opacity-100 disabled:bg-muted/10"
                                                disabled={mode === 'view'}
                                            />
                                        </div>
                                    </div>

                                    {/* Economics */}
                                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Cost</Label>
                                            <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="bg-background disabled:opacity-100 disabled:bg-muted/10" disabled={mode === 'view'} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Earnings/Mo</Label>
                                            <Input type="number" value={earnings} onChange={(e) => setEarnings(Number(e.target.value))} className="bg-background disabled:opacity-100 disabled:bg-muted/10" disabled={mode === 'view'} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-1"><PenTool className="h-3 w-3" /> Maint/Mo</Label>
                                            <Input type="number" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} className="bg-background disabled:opacity-100 disabled:bg-muted/10" disabled={mode === 'view'} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Max Level</Label>
                                            <Input type="number" value={maxLevel} onChange={(e) => setMaxLevel(Number(e.target.value))} className="bg-background disabled:opacity-100 disabled:bg-muted/10" disabled={mode === 'view'} />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 pt-4 border-t border-border">
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
                        {/* Table Container - Native scroll for reliable sticky headers + bi-directional scroll */}
                        <div className="flex-1 bg-background overflow-auto">
                            <div className="min-w-[1000px]">
                                {/* Table Header */}
                                <div className="sticky top-0 z-10 border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 px-6 py-3 flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <div className="flex-1">Name</div>
                                    <div className="w-[150px]">Tax Scheme</div>
                                    <div className="w-[100px] text-right">Cost</div>
                                    <div className="w-[100px] text-right">Earn/Mo</div>
                                    <div className="w-[100px] text-right">Maint/Mo</div>
                                    <div className="w-[80px] text-center">Max Lvl</div>
                                    <div className="w-[80px] text-center">Status</div>
                                </div>

                                {/* Table Body */}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading types...</p>
                                    </div>
                                ) : filteredTypes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Tag className="h-12 w-12 mb-4 opacity-20" />
                                        <p>No business types found.</p>
                                        {searchTerm && <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground underline" onClick={() => setSearchTerm("")}>Clear search</Button>}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {paginatedTypes.map((type) => (
                                            <div
                                                key={type.business_type_id}
                                                className="flex items-center px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer group text-sm gap-4"
                                                onClick={() => handleView(type)}
                                            >
                                                <div className="flex-1 font-medium text-foreground min-w-0 pr-4 group-hover:text-primary transition-colors">
                                                    <div className="truncate">{type.business_type_name}</div>
                                                    <div className="text-xs text-muted-foreground truncate opacity-70">{type.business_type_desc}</div>
                                                </div>
                                                <div className="w-[150px] text-muted-foreground truncate">
                                                    {type.TAX_TYPE?.tax_name}
                                                </div>
                                                <div className="w-[100px] text-right font-mono">
                                                    ${Number(type.business_type_cost).toLocaleString()}
                                                </div>
                                                <div className="w-[100px] text-right font-mono text-emerald-600">
                                                    +${Number(type.business_type_monthly_earnings).toLocaleString()}
                                                </div>
                                                <div className="w-[100px] text-right font-mono text-amber-600">
                                                    -${Number(type.business_type_monthly_maintenance).toLocaleString()}
                                                </div>
                                                <div className="w-[80px] text-center">
                                                    {type.business_type_max_level}
                                                </div>
                                                <div className="w-[80px] flex justify-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${type.business_type_status === 1
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-600 border-red-500/20'
                                                        }`}>
                                                        {type.business_type_status === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination Controls */}
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
        </Dialog>
    );
}
