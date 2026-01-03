'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAccountTypes, addAccountType, deleteAccountType, updateAccountTypeDetails, AccountType } from '@/actions/admin/typeActions';
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, Loader2, Pencil, Save, X } from "lucide-react";

interface AccountTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTypeAdded?: () => void; // Callback to refresh parent filters if needed
}

export function AccountTypeModal({ open, onOpenChange, onTypeAdded }: AccountTypeModalProps) {
    const [types, setTypes] = useState<AccountType[]>([]);
    const [loading, setLoading] = useState(false);

    // Add Form State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeId, setNewTypeId] = useState(""); // Input as string for easier handling
    const [newTypeDesc, setNewTypeDesc] = useState("");
    const [newTypeMaxStage, setNewTypeMaxStage] = useState("");
    const [newTypeStatus, setNewTypeStatus] = useState("1"); // Default Active

    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<AccountType | null>(null);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [editForm, setEditForm] = useState({
        typeName: '',
        typeDesc: '',
        typeMaxStage: '',
        status: '1'
    });
    const [savingEdit, setSavingEdit] = useState(false);

    useEffect(() => {
        if (selectedType) {
            setEditForm({
                typeName: selectedType.type_name,
                typeDesc: selectedType.type_desc || '',
                typeMaxStage: selectedType.type_max_stage?.toString() || '',
                status: selectedType.status?.toString() || '1'
            });
            setIsEditingDetails(false);
        }
    }, [selectedType]);

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAccountTypes();
            if (res.success && res.data) {
                setTypes(res.data);
            } else {
                toast.error(res.error || "Failed to fetch account types");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching types");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchTypes();
        }
    }, [open, fetchTypes]);

    const handleAddType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeName.trim()) return;

        setAdding(true);
        try {
            const typeId = newTypeId ? parseInt(newTypeId) : undefined;
            const maxStage = newTypeMaxStage ? parseInt(newTypeMaxStage) : undefined;
            const status = parseInt(newTypeStatus);

            const res = await addAccountType(newTypeName, typeId, newTypeDesc, maxStage, status);

            if (res.success) {
                toast.success("Account type added successfully");
                // Reset form
                setNewTypeName("");
                setNewTypeId("");
                setNewTypeDesc("");
                setNewTypeMaxStage("");
                setNewTypeStatus("1");
                setIsAddModalOpen(false); // Close add modal

                fetchTypes();
                if (onTypeAdded) onTypeAdded();
            } else {
                toast.error(res.error || "Failed to add account type");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while adding account type");
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteType = async (id: number) => {
        setDeletingId(id);
        try {
            const res = await deleteAccountType(id);
            if (res.success) {
                toast.success("Account type deleted");
                fetchTypes();
                if (onTypeAdded) onTypeAdded();
            } else {
                toast.error(res.error || "Failed to delete account type");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while deleting account type");
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdateTypeDetails = async () => {
        if (!selectedType) return;
        if (!editForm.typeName.trim()) {
            toast.error("Type Name is required");
            return;
        }

        setSavingEdit(true);
        try {
            const res = await updateAccountTypeDetails(selectedType.type_id, {
                typeName: editForm.typeName,
                typeDesc: editForm.typeDesc,
                typeMaxStage: editForm.typeMaxStage ? parseInt(editForm.typeMaxStage) : undefined,
                status: parseInt(editForm.status)
            });

            if (res.success) {
                toast.success("Account type updated successfully");
                setIsEditingDetails(false);
                fetchTypes();
                // Update local selectedType to reflect changes
                setSelectedType(prev => prev ? ({
                    ...prev,
                    type_name: editForm.typeName,
                    type_desc: editForm.typeDesc,
                    type_max_stage: editForm.typeMaxStage ? parseInt(editForm.typeMaxStage) : undefined,
                    status: parseInt(editForm.status)
                }) : null);

                if (onTypeAdded) onTypeAdded();
            } else {
                toast.error(res.error || "Failed to update account type");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during update");
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[95vw] sm:max-w-md bg-card text-foreground border-border max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between pr-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                </div>
                                <DialogTitle>Manage Account Types</DialogTitle>
                            </div>

                        </div>
                        <DialogDescription>
                            View and manage the available account types in the system.
                        </DialogDescription>
                        {/* Add Button replacing the inline form */}
                        <Button onClick={() => setIsAddModalOpen(true)} size="sm">
                            <Plus className="h-4 w-4 sm:mr-1" />
                            <span className="sm:inline">Add Type</span>
                        </Button>
                    </DialogHeader>

                    <div className="space-y-6 py-2">
                        {/* Types List Table */}
                        <div className="border border-border rounded-xl overflow-hidden bg-background/50">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <Table>
                                    <TableHeader className="bg-muted/50 sticky top-0 backdrop-blur-sm z-10">
                                        <TableRow className="hover:bg-transparent border-b-border">
                                            <TableHead className="w-[80px]">ID</TableHead>
                                            <TableHead>Type Name</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center">
                                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                                </TableCell>
                                            </TableRow>
                                        ) : types.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                                    No account types found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            types.map((type) => (
                                                <TableRow
                                                    key={type.type_id}
                                                    className="border-b-border hover:bg-muted/30 cursor-pointer"
                                                    onClick={() => setSelectedType(type)}
                                                >
                                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                                        #{type.type_id}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {type.type_name}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteType(type.type_id);
                                                            }}
                                                            disabled={deletingId === type.type_id}
                                                        >
                                                            {deletingId === type.type_id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Type Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="w-[95vw] sm:max-w-md bg-card text-foreground border-border max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Account Type</DialogTitle>
                        <DialogDescription>
                            Create a new account type with specific configurations.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddType} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Type ID (Optional)</label>
                                <Input
                                    type="number"
                                    placeholder="Auto-generated"
                                    value={newTypeId}
                                    onChange={(e) => setNewTypeId(e.target.value)}
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Type Name</label>
                                <Input
                                    placeholder="e.g. Premium"
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    className="bg-background border-border"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            <Input
                                placeholder="Brief description of privileges..."
                                value={newTypeDesc}
                                onChange={(e) => setNewTypeDesc(e.target.value)}
                                className="bg-background border-border"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Max Stage</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={newTypeMaxStage}
                                    onChange={(e) => setNewTypeMaxStage(e.target.value)}
                                    className="bg-background border-border"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newTypeStatus}
                                    onChange={(e) => setNewTypeStatus(e.target.value)}
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={adding}>
                                {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Type
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>


            {/* Details Modal */}
            <Dialog open={!!selectedType} onOpenChange={(open) => !open && setSelectedType(null)}>
                <DialogContent className="w-[95vw] sm:max-w-md bg-card text-foreground border-border max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Account Type Details</DialogTitle>
                        <DialogDescription>
                            Detailed information for account type #{selectedType?.type_id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedType && (
                        <div className="space-y-4">
                            {!isEditingDetails ? (
                                <>
                                    <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type ID</p>
                                                <p className="text-lg font-mono font-bold mt-1">#{selectedType.type_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type Name</p>
                                                <p className="text-lg font-bold mt-1 text-primary">{selectedType.type_name}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                                                <p className="text-sm mt-1 text-muted-foreground">
                                                    {selectedType.type_desc || "No description available."}
                                                </p>
                                            </div>
                                            {selectedType.type_max_stage !== undefined && (
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max Stage</p>
                                                    <p className="text-sm mt-1 font-medium">{selectedType.type_max_stage}</p>
                                                </div>
                                            )}
                                            {selectedType.status !== undefined && (
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                                                    <p className="text-sm mt-1 font-medium">
                                                        {selectedType.status === 1 ? (
                                                            <span className="text-green-500">Active</span>
                                                        ) : (
                                                            <span className="text-muted-foreground">Inactive</span>
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <Button variant="outline" onClick={() => setIsEditingDetails(true)}>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button onClick={() => setSelectedType(null)}>Close</Button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-border space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Type Name</label>
                                            <Input
                                                value={editForm.typeName}
                                                onChange={(e) => setEditForm({ ...editForm, typeName: e.target.value })}
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                                            <Input
                                                value={editForm.typeDesc}
                                                onChange={(e) => setEditForm({ ...editForm, typeDesc: e.target.value })}
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Max Stage</label>
                                                <Input
                                                    type="number"
                                                    value={editForm.typeMaxStage}
                                                    onChange={(e) => setEditForm({ ...editForm, typeMaxStage: e.target.value })}
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                >
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2 gap-2">
                                        <Button variant="ghost" onClick={() => setIsEditingDetails(false)} disabled={savingEdit}>
                                            <X className="h-4 w-4 mr-2" /> Cancel
                                        </Button>
                                        <Button onClick={handleUpdateTypeDetails} disabled={savingEdit}>
                                            {savingEdit ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
