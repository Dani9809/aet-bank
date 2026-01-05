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
import { getAssetCategories, createAssetCategory, updateAssetCategory, deleteAssetCategory } from '@/actions/admin/assetActions';
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Layers, Search, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertModal } from "@/components/ui/alert-modal";

interface ManageAssetCategoriesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: () => void;
}

export function ManageAssetCategoriesModal({ open, onOpenChange, onUpdate }: ManageAssetCategoriesModalProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'list' | 'view' | 'edit' | 'create'>('list');
    const [currentCategory, setCurrentCategory] = useState<any | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const res = await getAssetCategories();
        if (res.success && res.data) {
            setCategories(res.data);
        }
        setLoading(false);
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (open) {
            fetchCategories();
            setMode('list');
            setSearchTerm("");
            setCurrentPage(1);
        }
    }, [open, fetchCategories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleView = (category: any) => {
        setCurrentCategory(category);
        setName(category.asset_category_name);
        setDesc(category.asset_category_desc || "");
        setStatus(category.asset_category_status ?? 1);
        setMode('view');
    };

    const handleEdit = () => {
        setMode('edit');
    };

    const handleAddNew = () => {
        setCurrentCategory(null);
        setName("");
        setDesc("");
        setStatus(1);
        setMode('create');
    };

    const handleBack = () => {
        if (mode === 'edit') {
            // Cancel edit, go back to view and reset form
            if (currentCategory) {
                setName(currentCategory.asset_category_name);
                setDesc(currentCategory.asset_category_desc || "");
                setStatus(currentCategory.asset_category_status ?? 1);
                setMode('view');
            } else {
                setMode('list');
            }
        } else {
            // Back to list
            setMode('list');
            setCurrentCategory(null);
        }
    };

    const handleSave = async () => {
        if (!name) {
            toast.error("Category name is required");
            return;
        }

        const payload = {
            asset_category_name: name,
            asset_category_desc: desc,
            asset_category_status: status
        };

        let res;
        if (currentCategory && (mode === 'edit' || mode === 'view')) {
            res = await updateAssetCategory(currentCategory.asset_category_id, payload);
        } else {
            res = await createAssetCategory(payload);
        }

        if (res.success) {
            toast.success(mode === 'create' ? "Category created" : "Category updated");

            if (mode === 'edit') {
                setCurrentCategory({
                    ...currentCategory,
                    ...payload
                });
                setMode('view');
            } else {
                setMode('list');
            }

            fetchCategories();
            onUpdate();
        } else {
            toast.error(res.error || "Operation failed");
        }
    };

    const handleDelete = () => {
        setAlertOpen(true);
    };

    const onConfirmDelete = async () => {
        if (!currentCategory) return;
        const res = await deleteAssetCategory(currentCategory.asset_category_id);
        if (res.success) {
            toast.success("Category deleted");
            fetchCategories();
            onUpdate();
            setMode('list');
            setAlertOpen(false);
        } else {
            toast.error(res.error || "Delete failed");
            setAlertOpen(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.asset_category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.asset_category_desc && cat.asset_category_desc.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
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
                                <Layers className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-heading text-white">Manage Categories</DialogTitle>
                                <p className="text-white/70 text-sm">Create and manage asset categories</p>
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
                                        placeholder="Search categories..."
                                        className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all font-light"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleAddNew} className="bg-white text-blue-600 hover:bg-white/90 border-0 shadow-lg shadow-blue-900/20 font-semibold gap-2">
                                    <Plus className="h-4 w-4" /> Add Asset Category
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
                                        <> <Plus className="h-4 w-4 text-primary" /> New Category </>
                                    ) : mode === 'edit' ? (
                                        <> <Pencil className="h-4 w-4 text-primary" /> Edit Category </>
                                    ) : (
                                        <> <Layers className="h-4 w-4 text-primary" /> Category Details </>
                                    )}
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Category Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Real Estate, Crypto, Stocks..."
                                            className="bg-background disabled:opacity-100 disabled:bg-muted/10"
                                            disabled={mode === 'view'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={desc}
                                            onChange={(e) => setDesc(e.target.value)}
                                            placeholder="Describe what this category encompasses..."
                                            className="bg-background min-h-[100px] disabled:opacity-100 disabled:bg-muted/10"
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
                            <div className="min-w-[700px]">
                                {/* Table Header */}
                                <div className="sticky top-0 z-10 border-b bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/60 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    <div className="w-[30%]">Category Name</div>
                                    <div className="w-[50%]">Description</div>
                                    <div className="w-[20%] text-center">Status</div>
                                </div>

                                {/* Table Body */}
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
                                        <p>Loading categories...</p>
                                    </div>
                                ) : filteredCategories.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                                        <Layers className="h-12 w-12 mb-4 opacity-20" />
                                        <p>No categories found matching your search.</p>
                                        {searchTerm && <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground underline" onClick={() => setSearchTerm("")}>Clear search</Button>}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {paginatedCategories.map((cat) => (
                                            <div
                                                key={cat.asset_category_id}
                                                className="flex items-center px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer group gap-4"
                                                onClick={() => handleView(cat)}
                                            >
                                                <div className="w-[30%] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                    {cat.asset_category_name}
                                                </div>
                                                <div className="w-[50%] text-sm text-muted-foreground truncate">
                                                    {cat.asset_category_desc || <span className="opacity-50 italic">No description</span>}
                                                </div>
                                                <div className="w-[20%] flex justify-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${cat.asset_category_status === 1
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : 'bg-red-500/10 text-red-600 border-red-500/20'
                                                        }`}>
                                                        {cat.asset_category_status === 1 ? 'Active' : 'Inactive'}
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
                title="Delete Category"
                description="Are you sure you want to delete this category?"
            />
        </Dialog>
    );
}
