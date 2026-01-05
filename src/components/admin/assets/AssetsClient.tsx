'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAssets } from '@/actions/admin/assetActions';
import { AssetFilters } from './AssetFilters';
import { AssetTable } from './AssetTable';
import { toast } from "sonner";
import { Gem, RefreshCw, Layers, Tag, Briefcase, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ManageAssetCategoriesModal } from './ManageAssetCategoriesModal';
import { ManageAssetTypesModal } from './ManageAssetTypesModal';
import { ManageAvailableAssetsModal } from './ManageAvailableAssetsModal';
import { AssetDetailsModal } from './AssetDetailsModal';

export default function AssetsClient() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("user_asset_id");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0
    });

    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

    // Modal states
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const [showTypesModal, setShowTypesModal] = useState(false);
    const [showAvailableAssetsModal, setShowAvailableAssetsModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAssets({
                page,
                limit: 25,
                query: search,
                type: typeFilter,
                category: categoryFilter,
                sortBy,
                sortOrder
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
                toast.error(res.error || "Failed to fetch assets");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [page, search, typeFilter, categoryFilter, sortBy, sortOrder]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setPage(1);
    }, [search, typeFilter, categoryFilter, sortBy, sortOrder]);

    const handleRowClick = (asset: any) => {
        setSelectedAsset(asset);
        setShowDetailsModal(true);
    };

    // Auto-sync selectedAsset when data changes (for live preview after updates)
    useEffect(() => {
        if (selectedAsset && data.length > 0) {
            const updatedAsset = data.find(item => item.user_asset_id === selectedAsset.user_asset_id);
            if (updatedAsset) {
                setSelectedAsset(updatedAsset);
            }
        }
    }, [data, selectedAsset]);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-4 sm:p-6 md:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                            <Gem className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading tracking-tight">Asset Management</h1>
                            <p className="text-white/70 text-xs sm:text-sm">Manage user assets and listings</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                            {pagination.total} Total Assets
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3">
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-card hover:bg-accent/5"
                    onClick={() => setShowCategoriesModal(true)}
                >
                    <Layers className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">Manage Categories</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-card hover:bg-accent/5"
                    onClick={() => setShowTypesModal(true)}
                >
                    <Tag className="h-5 w-5 text-pink-500" />
                    <span className="font-medium">Manage Types</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 bg-card hover:bg-accent/5"
                    onClick={() => setShowAvailableAssetsModal(true)}
                >
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Manage Assets</span>
                </Button>
            </div>

            {/* Filters */}
            <AssetFilters
                onSearchChange={setSearch}
                onTypeChange={setTypeFilter}
                onCategoryChange={setCategoryFilter}
                onSortChange={setSortBy}
                onSortOrderChange={setSortOrder}
                isLoading={loading}
            />

            {/* Table */}
            <AssetTable
                data={data}
                isLoading={loading}
                pagination={pagination}
                onPageChange={setPage}
                onRowClick={handleRowClick}
            />

            {/* Modals */}
            <ManageAssetCategoriesModal
                open={showCategoriesModal}
                onOpenChange={setShowCategoriesModal}
                onUpdate={fetchData}
            />

            <ManageAssetTypesModal
                open={showTypesModal}
                onOpenChange={setShowTypesModal}
                onUpdate={fetchData}
            />

            <ManageAvailableAssetsModal
                open={showAvailableAssetsModal}
                onOpenChange={setShowAvailableAssetsModal}
                onUpdate={fetchData}
            />

            <AssetDetailsModal
                open={showDetailsModal}
                onOpenChange={(open) => {
                    setShowDetailsModal(open);
                    if (!open) setSelectedAsset(null);
                }}
                asset={selectedAsset}
                onUpdate={fetchData}
            />
        </div>
    );
}
