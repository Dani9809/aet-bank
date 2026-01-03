'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    getBusinessTypeDetails,
    createBusinessTypeDetail,
    updateBusinessTypeDetail,
    deleteBusinessTypeDetail,
    getBusinessTypes,
    getBusinessCategories
} from '@/actions/admin/businessActions';
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Link2, X, Check, MapPin, Search, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ManageAvailableBusinessesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function ManageAvailableBusinessesModal({ open, onOpenChange, onUpdate }: ManageAvailableBusinessesModalProps) {
    const [details, setDetails] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'list' | 'view' | 'edit' | 'create'>('list');
    const [currentDetail, setCurrentDetail] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Form states
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    // Add logging
    const log = (msg: string, data?: any) => {
        console.log(`[ManageAvailableBusinessesModal] ${msg}`, data || '');
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Sequential fetching to avoid race conditions and easier debugging
            const typesRes = await getBusinessTypes();
            if (typesRes.success) setTypes(typesRes.data || []);

            const categoriesRes = await getBusinessCategories();
            if (categoriesRes.success) setCategories(categoriesRes.data || []);

            const detailsRes = await getBusinessTypeDetails();
            if (detailsRes.success) setDetails(detailsRes.data || []);

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, []);

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

    const handleView = (detail: any) => {
        setCurrentDetail(detail);
        setSelectedType(detail.business_type_id?.toString() || "");
        setSelectedCategory(detail.business_category_id?.toString() || "");
        setMode('view');
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleAddNew = () => {
        setCurrentDetail(null);
        setSelectedType("");
        setSelectedCategory("");
        setMode('create');
    };

    const handleBack = () => {
        if (mode === 'edit') {
            // Cancel edit, go back to view and reset form
            if (currentDetail) {
                // Restore values
                setSelectedType(currentDetail.business_type_id?.toString() || "");
                setSelectedCategory(currentDetail.business_category_id?.toString() || "");
                setMode('view');
            } else {
                setMode('list');
            }
        } else {
            // Back to list
            setMode('list');
            setCurrentDetail(null);
        }
    };

    const handleSave = async () => {
        if (!selectedType || !selectedCategory) {
            toast.error("Business Type and Category are required");
            return;
        }

        const payload = {
            business_type_id: parseInt(selectedType),
            business_category_id: parseInt(selectedCategory)
        };

        log("Saving", payload);

        let res;
        if (currentDetail && (mode === 'edit' || mode === 'view')) {
            res = await updateBusinessTypeDetail(currentDetail.business_type_detail_id, payload);
        } else {
            res = await createBusinessTypeDetail(payload);
        }

        if (res.success) {
            toast.success(mode === 'create' ? "Availability added" : "Availability updated");

            if (mode === 'edit') {
                // Update local state to reflect changes in view mode
                const updatedDetail = {
                    ...currentDetail,
                    ...payload,
                    // Manually patch joined data for view
                    BUSINESS_TYPE: types.find(t => t.business_type_id === parseInt(selectedType)),
                    BUSINESS_CATEGORY: categories.find(c => c.business_category_id === parseInt(selectedCategory))
                };
                setCurrentDetail(updatedDetail);
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
        if (!currentDetail) return;
        if (confirm("Are you sure you want to remove this availability?")) {
            const res = await deleteBusinessTypeDetail(currentDetail.business_type_detail_id);
            if (res.success) {
                toast.success("Availability removed");
                fetchData();
                onUpdate();
                setMode('list');
            } else {
                toast.error(res.error || "Delete failed");
            }
        }
    };

    const filteredDetails = details.filter(detail =>
        detail.BUSINESS_TYPE?.business_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.BUSINESS_CATEGORY?.business_category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDetails.length / ITEMS_PER_PAGE);
    const paginatedDetails = filteredDetails.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-4xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
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
                                <Link2 className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-heading text-white">Manage Business Mappings</DialogTitle>
                                <p className="text-white/70 text-sm">Assign business types to categories</p>
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
                                        placeholder="Search by type or category..."
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-light"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddNew} className="bg-white text-blue-600 hover:bg-white/90 border-0 shadow-lg shadow-blue-900/20 font-semibold gap-2">
                                    <Plus className="h-4 w-4" /> Add Mapping
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {mode !== 'list' ? (
                    <>
                        <ScrollArea className="flex-1 bg-background overflow-y-auto">
                            <div className="p-6 max-w-2xl mx-auto w-full space-y-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    {mode === 'create' ? (
                                        <> <Plus className="h-4 w-4 text-primary" /> New Availability </>
                                    ) : mode === 'edit' ? (
                                        <> <Pencil className="h-4 w-4 text-primary" /> Edit Mapping </>
                                    ) : (
                                        <> <MapPin className="h-4 w-4 text-primary" /> Mapping Details </>
                                    )}
                                </h3>

                                <div className="space-y-4">
                                    {currentDetail && (
                                        <div className="space-y-2">
                                            <Label>Mapping ID</Label>
                                            <Input
                                                value={currentDetail.business_type_detail_id}
                                                disabled
                                                className="bg-muted/50 font-mono text-muted-foreground"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label>Business Type <span className="text-red-500">*</span></Label>
                                        <Select value={selectedType} onValueChange={setSelectedType} disabled={mode === 'view'}>
                                            <SelectTrigger className="bg-background disabled:opacity-100 disabled:bg-muted/10">
                                                <SelectValue placeholder="Select Business Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem key={type.business_type_id} value={type.business_type_id.toString()}>
                                                        {type.business_type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category <span className="text-red-500">*</span></Label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={mode === 'view'}>
                                            <SelectTrigger className="bg-background disabled:opacity-100 disabled:bg-muted/10">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.business_category_id} value={cat.business_category_id.toString()}>
                                                        {cat.business_category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Read-only info about selections */}
                                    {selectedType && (
                                        <div className="p-4 bg-muted/20 rounded-lg border border-border mt-4">
                                            <h4 className="font-medium text-sm mb-2 text-muted-foreground">Selected Type Info</h4>
                                            {(() => {
                                                const type = types.find(t => t.business_type_id.toString() === selectedType);
                                                if (!type) return null;
                                                return (
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div><span className="text-muted-foreground">Cost:</span> <span className="font-mono">${Number(type.business_type_cost).toLocaleString()}</span></div>
                                                        <div><span className="text-muted-foreground">Earnings:</span> <span className="font-mono text-emerald-600">+${Number(type.business_type_monthly_earnings).toLocaleString()}</span></div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
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
                                <div className="sticky top-0 z-10 border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 px-6 py-3 flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <div className="w-[40px] text-center">ID</div>
                                    <div className="flex-1">Business Type</div>
                                    <div className="w-[150px]">Category</div>
                                    <div className="w-[100px] text-right">Base Cost</div>
                                </div>

                                {/* Table Body */}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading available businesses...</p>
                                    </div>
                                ) : filteredDetails.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Layers className="h-12 w-12 mb-4 opacity-20" />
                                        <p>No business mappings configured.</p>
                                        {searchTerm && <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground underline" onClick={() => setSearchTerm("")}>Clear search</Button>}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {paginatedDetails.map((detail) => (
                                            <div
                                                key={detail.business_type_detail_id}
                                                className="flex items-center px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer group gap-4"
                                                onClick={() => handleView(detail)}
                                            >
                                                <div className="w-[40px] text-center font-mono text-xs text-muted-foreground">
                                                    {detail.business_type_detail_id}
                                                </div>
                                                <div className="flex-1 font-medium text-foreground min-w-0 pr-4 group-hover:text-primary transition-colors">
                                                    <div className="truncate">{detail.BUSINESS_TYPE?.business_type_name}</div>
                                                    <div className="text-xs text-muted-foreground font-normal truncate opacity-70">{detail.BUSINESS_TYPE?.business_type_desc}</div>
                                                </div>
                                                <div className="w-[150px] text-muted-foreground flex items-center gap-2 truncate">
                                                    <Layers className="h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate">{detail.BUSINESS_CATEGORY?.business_category_name}</span>
                                                </div>
                                                <div className="w-[100px] text-right font-mono text-sm">
                                                    ${Number(detail.BUSINESS_TYPE?.business_type_cost).toLocaleString()}
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
