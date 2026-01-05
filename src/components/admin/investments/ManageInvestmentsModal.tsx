'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getInvestmentTypeDetails, createInvestmentTypeDetail, deleteInvestmentTypeDetail, getInvestmentTypes, getInvestmentCategories } from '@/actions/admin/investmentActions';
import { toast } from "sonner";
import { Trash2, Plus, Loader2, Sparkles, Search, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertModal } from "@/components/ui/alert-modal";
import { Input } from "@/components/ui/input";

interface ManageInvestmentsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function ManageInvestmentsModal({ open, onOpenChange, onUpdate }: ManageInvestmentsModalProps) {
    const [details, setDetails] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'list' | 'create'>('list');

    // Form states
    const [selectedTypeId, setSelectedTypeId] = useState<string>("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [detailToDelete, setDetailToDelete] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [detailsRes, typesRes, categoriesRes] = await Promise.all([
            getInvestmentTypeDetails(),
            getInvestmentTypes(),
            getInvestmentCategories()
        ]);

        if (detailsRes.success && detailsRes.data) setDetails(detailsRes.data);
        if (typesRes.success && typesRes.data) setTypes(typesRes.data);
        if (categoriesRes.success && categoriesRes.data) setCategories(categoriesRes.data);

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

    const handleAddNew = () => {
        setSelectedTypeId("");
        setSelectedCategoryId("");
        setMode('create');
    };

    const handleBack = () => {
        setMode('list');
        setSelectedTypeId("");
        setSelectedCategoryId("");
    };

    const handleSave = async () => {
        if (!selectedTypeId || !selectedCategoryId) {
            toast.error("Please select both an Investment Type and a Category");
            return;
        }

        const payload = {
            investment_type_id: parseInt(selectedTypeId),
            investment_category_id: parseInt(selectedCategoryId)
        };

        const res = await createInvestmentTypeDetail(payload);

        if (res.success) {
            toast.success("Investment offering created");
            setMode('list');
            fetchData();
            onUpdate();
        } else {
            toast.error(res.error || "Operation failed");
        }
    };

    const handleDelete = (id: string) => {
        setDetailToDelete(id);
        setAlertOpen(true);
    };

    const onConfirmDelete = async () => {
        if (!detailToDelete) return;
        const res = await deleteInvestmentTypeDetail(parseInt(detailToDelete));
        if (res.success) {
            toast.success("Investment offering deleted");
            fetchData();
            onUpdate();
            setDetailToDelete(null);
            setAlertOpen(false);
        } else {
            toast.error(res.error || "Delete failed");
            setAlertOpen(false);
        }
    };

    // Filter logic
    const filteredDetails = details.filter(detail => {
        const typeName = detail.INVESTMENT_TYPE?.investment_type_name || "";
        const catName = detail.INVESTMENT_CATEGORY?.investment_category_name || "";
        const searchLower = searchTerm.toLowerCase();
        return typeName.toLowerCase().includes(searchLower) || catName.toLowerCase().includes(searchLower);
    });

    const totalPages = Math.ceil(filteredDetails.length / ITEMS_PER_PAGE);
    const paginatedDetails = filteredDetails.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-3xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl [&>button]:hidden">
                {/* Header with gradient */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-green-500" />
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
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-heading text-white">Manage Offerings</DialogTitle>
                                <p className="text-white/70 text-sm">Combine types and categories to create sellable investments</p>
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
                                        placeholder="Search offerings..."
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-light"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddNew} className="bg-white text-emerald-600 hover:bg-white/90 border-0 shadow-lg shadow-emerald-900/20 font-semibold gap-2 font-source tracking-tight">
                                    <Plus className="h-4 w-4" /> Create Offering
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {mode !== 'list' ? (
                    <>
                        <ScrollArea className="flex-1 bg-background overflow-y-auto">
                            <div className="p-6 max-w-xl mx-auto w-full space-y-6">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-primary" /> New Investment Offering
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Select an Investment Type and a Category to link them together. This will make this combination available for assignment to users.
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Investment Type <span className="text-red-500">*</span></Label>
                                        <Select value={selectedTypeId} onValueChange={setSelectedTypeId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem key={type.investment_type_id} value={type.investment_type_id.toString()}>
                                                        {type.investment_type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Investment Category <span className="text-red-500">*</span></Label>
                                        <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.investment_category_id} value={cat.investment_category_id.toString()}>
                                                        {cat.investment_category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <div className="flex-none flex items-center justify-end gap-3 p-4 border-t bg-background z-10">
                            <Button variant="outline" onClick={handleBack}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="min-w-[100px]">
                                <Check className="h-4 w-4 mr-2" /> Create
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Table Container - Native scroll + sticky headers */}
                        <div className="flex-1 bg-background overflow-auto">
                            <div className="min-w-[600px]">
                                {/* Table Header */}
                                <div className="sticky top-0 z-10 border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <div className="w-[40%]">Investment Type</div>
                                    <div className="w-[40%]">Category</div>
                                    <div className="w-[20%] text-center">Actions</div>
                                </div>

                                {/* Table Body */}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading offerings...</p>
                                    </div>
                                ) : filteredDetails.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Sparkles className="h-12 w-12 mb-4 opacity-20" />
                                        <p>No offerings found matching your search.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {paginatedDetails.map((item) => (
                                            <div
                                                key={item.investment_type_detail_id}
                                                className="flex items-center px-6 py-4 hover:bg-muted/20 transition-colors"
                                            >
                                                <div className="w-[40%] font-medium text-foreground">
                                                    {item.INVESTMENT_TYPE?.investment_type_name || "Unknown"}
                                                </div>
                                                <div className="w-[40%] text-sm text-muted-foreground">
                                                    {item.INVESTMENT_CATEGORY?.investment_category_name || "Unknown"}
                                                </div>
                                                <div className="w-[20%] flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(item.investment_type_detail_id.toString())}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                title="Delete Offering"
                description="Are you sure you want to delete this investment offering? This may affect users who hold this investment."
            />
        </Dialog>
    );
}
