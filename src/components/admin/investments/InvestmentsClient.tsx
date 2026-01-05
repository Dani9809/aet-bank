'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvestmentFilters } from './InvestmentFilters';
import { InvestmentTable } from './InvestmentTable';
import { toast } from "sonner";
import { Briefcase, RefreshCw, Layers, Tag, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getUserInvestments,
    getInvestmentCategories,
    getInvestmentTypes
} from '@/actions/admin/investmentActions';

// Import Modals (Placeholders for now)
import { ManageInvestmentCategoriesModal } from './ManageInvestmentCategoriesModal';
import { ManageInvestmentTypesModal } from './ManageInvestmentTypesModal';
import { ManageInvestmentsModal } from './ManageInvestmentsModal';
import { InvestmentDetailsModal } from './InvestmentDetailsModal';

export default function InvestmentsClient() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    // Filter Options
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);

    const [filters, setFilters] = useState({
        type: "all",
        category: "all",
        focus: "",
        priceFrom: "",
        priceTo: "",
        capitalizationFrom: "",
        capitalizationTo: "",
        status: "all",
        sortBy: "user_investment_id",
        sortOrder: "desc" as "asc" | "desc",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0
    });

    const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);

    // Modal states
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const [showTypesModal, setShowTypesModal] = useState(false);
    const [showManageInvestmentsModal, setShowManageInvestmentsModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Initial load for filter options
    useEffect(() => {
        const loadOptions = async () => {
            const [catRes, typeRes] = await Promise.all([
                getInvestmentCategories(),
                getInvestmentTypes()
            ]);

            if (catRes.success) setCategories(catRes.data || []);
            if (typeRes.success) setTypes(typeRes.data || []);
        };
        loadOptions();
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getUserInvestments({
                page,
                limit: 25,
                query: search,
                ...filters,
                priceFrom: filters.priceFrom ? Number(filters.priceFrom) : undefined,
                priceTo: filters.priceTo ? Number(filters.priceTo) : undefined,
                capitalizationFrom: filters.capitalizationFrom ? Number(filters.capitalizationFrom) : undefined,
                capitalizationTo: filters.capitalizationTo ? Number(filters.capitalizationTo) : undefined,
            });

            if (res.success && res.data) {
                setData(res.data);
                if (res.meta) {
                    setPagination({
                        ...res.meta,
                        total: res.meta.total ?? 0
                    });
                }
            } else {
                toast.error(res.error || "Failed to fetch investments");
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

    useEffect(() => {
        setPage(1);
    }, [search, filters]);

    const handleRowClick = (investment: any) => {
        setSelectedInvestment(investment);
        setShowDetailsModal(true);
    };

    // Auto-sync selectedInvestment when data changes
    useEffect(() => {
        if (selectedInvestment && data.length > 0) {
            const updated = data.find(item => item.user_investment_id === selectedInvestment.user_investment_id);
            if (updated) setSelectedInvestment(updated);
        }
    }, [data, selectedInvestment]);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 p-4 sm:p-6 md:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading tracking-tight">Investment Management</h1>
                            <p className="text-white/70 text-xs sm:text-sm">Monitor user portfolios and investment offerings</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                            {pagination.total} Total Investments
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

            {/* Management Buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-card hover:bg-accent/5 font-source"
                    onClick={() => setShowCategoriesModal(true)}
                >
                    <Layers className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium tracking-tight">Manage Categories</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-card hover:bg-accent/5 font-source"
                    onClick={() => setShowTypesModal(true)}
                >
                    <Tag className="h-5 w-5 text-pink-500" />
                    <span className="font-medium tracking-tight">Manage Types</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-card hover:bg-accent/5 font-source"
                    onClick={() => setShowManageInvestmentsModal(true)}
                >
                    <Briefcase className="h-5 w-5 text-blue-500" />
                    <span className="font-medium tracking-tight">Manage Investments</span>
                </Button>
            </div>

            {/* Filters */}
            <InvestmentFilters
                onSearchChange={setSearch}
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                types={types}
                isLoading={loading}
            />

            {/* Table */}
            <InvestmentTable
                data={data}
                isLoading={loading}
                pagination={pagination}
                onPageChange={setPage}
                onRowClick={handleRowClick}
            />

            {/* Modals */}
            <ManageInvestmentCategoriesModal
                open={showCategoriesModal}
                onOpenChange={setShowCategoriesModal}
                onUpdate={() => {
                    getInvestmentCategories().then(res => res.success && setCategories(res.data || []));
                }}
            />

            <ManageInvestmentTypesModal
                open={showTypesModal}
                onOpenChange={setShowTypesModal}
                onUpdate={() => {
                    getInvestmentTypes().then(res => res.success && setTypes(res.data || []));
                }}
            />

            <ManageInvestmentsModal
                open={showManageInvestmentsModal}
                onOpenChange={setShowManageInvestmentsModal}
                onUpdate={() => { }}
            />

            <InvestmentDetailsModal
                open={showDetailsModal}
                onOpenChange={(open) => {
                    setShowDetailsModal(open);
                    if (!open) setSelectedInvestment(null);
                }}
                investment={selectedInvestment}
            />
        </div>
    );
}
