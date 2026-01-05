'use client';

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Receipt, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaxTable } from "./TaxTable";
import { TaxFilters } from "./TaxFilters";
import { ManageTaxTypeModal } from "./ManageTaxTypeModal";
import { AlertModal } from "@/components/ui/alert-modal";
import { getTaxTypes, getTaxTypeStats, deleteTaxType, TaxType, TaxFilterParams } from "@/actions/admin/taxActions";

export default function TaxesClient() {
    // Data State
    const [data, setData] = useState<TaxType[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ count: 0 });

    // Filter State
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState<TaxFilterParams>({
        limit: 25,
        sortOrder: 'asc'
    });

    // Pagination State
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 25,
        totalPages: 0
    });

    // Modal State
    const [showManageModal, setShowManageModal] = useState(false);
    const [selectedTax, setSelectedTax] = useState<TaxType | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [listRes, statsRes] = await Promise.all([
                getTaxTypes({
                    page,
                    query: search,
                    ...filters
                }),
                getTaxTypeStats()
            ]);

            if (listRes.success && listRes.data) {
                setData(listRes.data);
                if (listRes.meta) {
                    setPagination(listRes.meta as any);
                }
            } else {
                toast.error(listRes.error || "Failed to fetch taxes");
            }

            if (statsRes.success) {
                setStats({ count: statsRes.count || 0 });
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [page, search, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [search, filters]);

    const handleEdit = (tax: TaxType) => {
        setSelectedTax(tax);
        setShowManageModal(true);
    };

    const handleCreate = () => {
        setSelectedTax(null);
        setShowManageModal(true);
    };

    // Delete Logic
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const res = await deleteTaxType(deleteId);
            if (res.success) {
                toast.success("Tax type deleted successfully");
                fetchData();
                setShowDeleteModal(false);
            } else {
                toast.error(res.error || "Failed to delete tax type");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during deletion");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-zinc-800 to-slate-700 p-4 sm:p-6 md:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                            <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading tracking-tight">Tax Management</h1>
                            <p className="text-white/70 text-xs sm:text-sm">Manage system tax types and rates</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                            {stats.count} Total Tax Types
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchData}
                            disabled={loading}
                            className="text-white hover:bg-white/20 hover:text-white h-8 w-8 p-0"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <TaxFilters
                onSearchChange={setSearch}
                filters={filters}
                onFiltersChange={setFilters}
            />

            {/* Table */}
            <TaxTable
                data={data}
                isLoading={loading}
                pagination={pagination}
                onPageChange={setPage}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            {/* Floating Add Button */}
            <button
                onClick={handleCreate}
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-zinc-800 to-slate-700 shadow-lg shadow-zinc-500/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
                <Receipt className="h-7 w-7" />
            </button>

            {/* Modals */}
            <ManageTaxTypeModal
                open={showManageModal}
                onOpenChange={setShowManageModal}
                initialData={selectedTax}
                onUpdate={fetchData}
            />
            <AlertModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title="Delete Tax Type"
                description="Are you sure you want to delete this tax type? This action cannot be undone."
            />
        </div>
    );
}
