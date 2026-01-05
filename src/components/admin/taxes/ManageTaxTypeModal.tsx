import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Receipt } from "lucide-react";
import { createTaxType, updateTaxType, TaxType } from "@/actions/admin/taxActions";
import { Switch } from "@/components/ui/switch";

interface ManageTaxTypeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: TaxType | null;
    onUpdate?: () => void;
}

export function ManageTaxTypeModal({
    open,
    onOpenChange,
    initialData,
    onUpdate
}: ManageTaxTypeModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tax_type_id: "",
        tax_name: "",
        tax_rate: "",
        is_auto: false,
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    tax_type_id: initialData.tax_type_id.toString(),
                    tax_name: initialData.tax_name,
                    tax_rate: initialData.tax_rate.toString(),
                    is_auto: initialData.is_auto,
                });
            } else {
                setFormData({
                    tax_type_id: "",
                    tax_name: "",
                    tax_rate: "",
                    is_auto: false,
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.tax_name) {
            toast.error("Tax name is required");
            return;
        }
        if (!formData.tax_rate) {
            toast.error("Tax rate is required");
            return;
        }

        setLoading(true);
        try {
            const payload: any = {
                tax_name: formData.tax_name,
                tax_rate: parseFloat(formData.tax_rate),
                is_auto: formData.is_auto
            };

            // Only include ID if explicitly provided during creation
            if (!initialData && formData.tax_type_id) {
                payload.tax_type_id = parseInt(formData.tax_type_id);
            }

            const res = initialData
                ? await updateTaxType(initialData.tax_type_id, payload)
                : await createTaxType(payload);

            if (res.success) {
                toast.success(initialData ? "Tax updated successfully" : "Tax created successfully");
                onOpenChange(false);
                onUpdate?.();
            } else {
                toast.error(res.error || "Failed to save tax");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-hidden p-0 border-0 bg-zinc-950 text-white shadow-2xl">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/20 via-zinc-900/50 to-zinc-950 pointer-events-none" />

                <div className="relative z-10 p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-zinc-800 to-slate-700 flex items-center justify-center shadow-lg shadow-zinc-500/20">
                            <Receipt className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-heading text-white">
                                {initialData ? "Edit Tax Type" : "Add Tax Type"}
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                {initialData ? "Update tax details below" : "Create a new tax type"}
                            </DialogDescription>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">Tax ID (Optional)</Label>
                            <Input
                                disabled={!!initialData}
                                placeholder="Generated Automatically"
                                className="bg-white/5 border-white/10 text-white disabled:opacity-50"
                                value={formData.tax_type_id}
                                onChange={(e) => handleChange("tax_type_id", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">Tax Name</Label>
                            <Input
                                placeholder="e.g. VAT, Sales Tax"
                                value={formData.tax_name}
                                onChange={(e) => handleChange("tax_name", e.target.value)}
                                className="bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">Tax Rate (%)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.tax_rate}
                                onChange={(e) => handleChange("tax_rate", e.target.value)}
                                className="bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="space-y-0.5">
                                <Label className="text-base text-white">Auto Tax</Label>
                                <p className="text-xs text-zinc-400">Automatically apply this tax</p>
                            </div>
                            <Switch
                                checked={formData.is_auto}
                                onCheckedChange={(checked) => handleChange("is_auto", checked)}
                            />
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-zinc-800 to-slate-700 hover:from-zinc-700 hover:to-slate-600 text-white border-0 cursor-pointer"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (initialData ? "Save Changes" : "Create Tax")}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
