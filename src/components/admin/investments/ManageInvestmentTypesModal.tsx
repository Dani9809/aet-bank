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
import { getInvestmentTypes, createInvestmentType, updateInvestmentType, deleteInvestmentType } from '@/actions/admin/investmentActions';
import { getTaxTypes } from '@/actions/admin/assetActions'; // Reusing existing action
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Tag, Search, X, Check, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
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
import { formatCurrency } from "@/lib/utils";

interface ManageInvestmentTypesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function ManageInvestmentTypesModal({ open, onOpenChange, onUpdate }: ManageInvestmentTypesModalProps) {
    const [types, setTypes] = useState<any[]>([]);
    const [taxTypes, setTaxTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'list' | 'view' | 'edit' | 'create'>('list');
    const [currentType, setCurrentType] = useState<any | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [taxTypeId, setTaxTypeId] = useState<string>("");
    const [pricePerUnit, setPricePerUnit] = useState<string>("");
    const [capitalization, setCapitalization] = useState<string>("");
    const [availableUnits, setAvailableUnits] = useState<string>("");
    const [status, setStatus] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [typesRes, taxRes] = await Promise.all([
            getInvestmentTypes(),
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

    const handleView = (type: any) => {
        setCurrentType(type);
        setName(type.investment_type_name);
        setDesc(type.investment_type_desc || "");
        setTaxTypeId(type.tax_type_id?.toString() || "");
        setPricePerUnit(type.investment_type_price_per_unit?.toString() || "");
        setCapitalization(type.investment_type_capitalization?.toString() || "");
        setAvailableUnits(type.investment_type_available_units?.toString() || "");
        setStatus(type.investment_type_status ?? 1);
        setMode('view');
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleAddNew = () => {
        setCurrentType(null);
        setName("");
        setDesc("");
        setTaxTypeId("");
        setPricePerUnit("");
        setCapitalization("");
        setAvailableUnits("");
        setStatus(1);
        setMode('create');
    };

    const handleBack = () => {
        if (mode === 'edit') {
            if (currentType) {
                setName(currentType.investment_type_name);
                setDesc(currentType.investment_type_desc || "");
                setTaxTypeId(currentType.tax_type_id?.toString() || "");
                setPricePerUnit(currentType.investment_type_price_per_unit?.toString() || "");
                setCapitalization(currentType.investment_type_capitalization?.toString() || "");
                setAvailableUnits(currentType.investment_type_available_units?.toString() || "");
                setStatus(currentType.investment_type_status ?? 1);
                setMode('view');
            } else {
                setMode('list');
            }
        } else {
            setMode('list');
            setCurrentType(null);
        }
    };

    const handleSave = async () => {
        if (!name) {
            toast.error("Type name is required");
            return;
        }
        if (!taxTypeId) {
            toast.error("Tax Type is required");
            return;
        }
        if (!pricePerUnit) {
            toast.error("Price per unit is required");
            return;
        }

        const payload = {
            investment_type_name: name,
            investment_type_desc: desc,
            tax_type_id: parseInt(taxTypeId),
            investment_type_price_per_unit: parseFloat(pricePerUnit),
            investment_type_capitalization: parseInt(capitalization || "0"),
            investment_type_available_units: parseInt(availableUnits || "0"),
            investment_type_status: status
        };

        let res;
        if (currentType && (mode === 'edit' || mode === 'view')) {
            res = await updateInvestmentType(currentType.investment_type_id, payload);
        } else {
            res = await createInvestmentType(payload);
        }

        if (res.success) {
            toast.success(mode === 'create' ? "Type created" : "Type updated");

            if (mode === 'edit') {
                setCurrentType({
                    ...currentType,
                    ...payload
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

    const handleDelete = () => {
        setAlertOpen(true);
    };

    const onConfirmDelete = async () => {
        if (!currentType) return;
        const res = await deleteInvestmentType(currentType.investment_type_id);
        if (res.success) {
            toast.success("Type deleted");
            fetchData();
            onUpdate();
            setMode('list');
            setAlertOpen(false);
        } else {
            toast.error(res.error || "Delete failed");
            setAlertOpen(false);
        }
    };

    const filteredTypes = types.filter(type =>
        type.investment_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type.investment_type_desc && type.investment_type_desc.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredTypes.length / ITEMS_PER_PAGE);
    const paginatedTypes = filteredTypes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getTaxTypeName = (id: number) => {
        const tax = taxTypes.find(t => t.tax_type_id === id);
        return tax ? tax.tax_name : 'Unknown';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-4xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                {/* Header with gradient */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-500 to-red-500" />
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
                                <DialogTitle className="text-2xl font-heading text-white">Manage Investment Types</DialogTitle>
                                <p className="text-white/70 text-sm">Create and manage investment types and pricing</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Toolbar (Search & Add) - Only show when in LIST mode */}
                    {mode === 'list' && (
                        <div className="relative z-10 px-6 pb-6 pt-2">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/60" />
                                    <Input
                                        placeholder="Search types..."
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-light"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddNew} className="bg-white text-pink-600 hover:bg-white/90 border-0 shadow-lg shadow-pink-900/20 font-semibold gap-2 font-source tracking-tight">
                                    <Plus className="h-4 w-4" /> Add Investment Type
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
                                        <> <Plus className="h-4 w-4 text-primary" /> New Type </>
                                    ) : mode === 'edit' ? (
                                        <> <Pencil className="h-4 w-4 text-primary" /> Edit Type </>
                                    ) : (
                                        <> <Tag className="h-4 w-4 text-primary" /> Type Details </>
                                    )}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Type Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Series A, Gold ETF..."
                                                className="bg-background disabled:opacity-100 disabled:bg-muted/10"
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
                                                <SelectTrigger className="bg-background disabled:opacity-100 disabled:bg-muted/10">
                                                    <SelectValue placeholder="Select Tax Type" />
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
                                        <div className="space-y-2">
                                            <Label>Price Per Unit <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="number"
                                                    value={pricePerUnit}
                                                    onChange={(e) => setPricePerUnit(e.target.value)}
                                                    placeholder="0.00"
                                                    className="pl-9 bg-background disabled:opacity-100 disabled:bg-muted/10"
                                                    disabled={mode === 'view'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Capitalization</Label>
                                            <Input
                                                type="number"
                                                value={capitalization}
                                                onChange={(e) => setCapitalization(e.target.value)}
                                                placeholder="Total Cap"
                                                className="bg-background disabled:opacity-100 disabled:bg-muted/10"
                                                disabled={mode === 'view'}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Available Units</Label>
                                            <Input
                                                type="number"
                                                value={availableUnits}
                                                onChange={(e) => setAvailableUnits(e.target.value)}
                                                placeholder="Units"
                                                className="bg-background disabled:opacity-100 disabled:bg-muted/10"
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
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Description of this investment type..."
                                        className="bg-background min-h-[100px] disabled:opacity-100 disabled:bg-muted/10"
                                        disabled={mode === 'view'}
                                    />
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
                        {/* Table Container - Native scroll + sticky headers */}
                        <div className="flex-1 bg-background overflow-auto">
                            <div className="min-w-[800px]">
                                {/* Table Header */}
                                <div className="sticky top-0 z-10 border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <div className="w-[20%]">Type Name</div>
                                    <div className="w-[15%] text-right pr-4">Price</div>
                                    <div className="w-[15%] text-right pr-4">Cap</div>
                                    <div className="w-[15%] text-right pr-4">Units</div>
                                    <div className="w-[15%]">Tax</div>
                                    <div className="w-[10%] text-center">Status</div>
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
                                        <p>No types found matching your search.</p>
                                        {searchTerm && <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground underline" onClick={() => setSearchTerm("")}>Clear search</Button>}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {paginatedTypes.map((type) => (
                                            <div
                                                key={type.investment_type_id}
                                                className="flex items-center px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer group gap-4"
                                                onClick={() => handleView(type)}
                                            >
                                                <div className="w-[20%] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {type.investment_type_name}
                                                </div>
                                                <div className="w-[15%] text-right pr-4 font-mono text-sm">
                                                    {formatCurrency(type.investment_type_price_per_unit || 0)}
                                                </div>
                                                <div className="w-[15%] text-right pr-4 font-mono text-sm">
                                                    {type.investment_type_capitalization?.toLocaleString() || '-'}
                                                </div>
                                                <div className="w-[15%] text-right pr-4 font-mono text-sm">
                                                    {type.investment_type_available_units?.toLocaleString() || '-'}
                                                </div>
                                                <div className="w-[15%] text-sm text-muted-foreground truncate">
                                                    {getTaxTypeName(type.tax_type_id)}
                                                </div>
                                                <div className="w-[10%] flex justify-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${type.investment_type_status === 1
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-600 border-red-500/20'
                                                        }`}>
                                                        {type.investment_type_status === 1 ? 'Active' : 'Inactive'}
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
            <AlertModal
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                onConfirm={onConfirmDelete}
                loading={loading}
                title="Delete Investment Type"
                description="Are you sure you want to delete this investment type?"
            />
        </Dialog>
    );
}
