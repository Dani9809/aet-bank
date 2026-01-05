import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Filter, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getAssetCategories, getAssetTypes } from '@/actions/admin/assetActions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AssetFiltersProps {
    // Search is still independent/live
    onSearchChange: (value: string) => void;
    // Filter state
    filters: {
        type: string;
        category: string;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        lastTaxCollectionFrom: string;
        lastTaxCollectionTo: string;
        lastMaintenancePaidFrom: string;
        lastMaintenancePaidTo: string;
    };
    onFiltersChange: (newFilters: any) => void;
    isLoading?: boolean;
}

export function AssetFilters({
    onSearchChange,
    filters,
    onFiltersChange,
    isLoading
}: AssetFiltersProps) {
    const [searchValue, setSearchValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Local state for the modal form
    const [localFilters, setLocalFilters] = useState(filters);

    // Sync local filters when modal opens or props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, isOpen]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearchChange(searchValue);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onSearchChange]);

    const [types, setTypes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const fetchFilters = useCallback(async () => {
        try {
            const [typesRes, catsRes] = await Promise.all([
                getAssetTypes(),
                getAssetCategories()
            ]);

            if (typesRes.success && typesRes.data) {
                setTypes(typesRes.data);
            }
            if (catsRes.success && catsRes.data) {
                setCategories(catsRes.data);
            }
        } catch (error) {
            console.error("Error fetching filters:", error);
        }
    }, []);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    const handleApply = () => {
        onFiltersChange(localFilters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetFilters = {
            type: "all",
            category: "all",
            sortBy: "user_asset_id",
            sortOrder: "desc" as const,
            lastTaxCollectionFrom: "",
            lastTaxCollectionTo: "",
            lastMaintenancePaidFrom: "",
            lastMaintenancePaidTo: ""
        };
        setLocalFilters(resetFilters);
        // Optional: Apply immediately or wait for user to click Apply?
        // Usually, Reset inside a modal implies resetting the form. User still needs to click Apply.
        // But to be user friendly, let's keep it in local state.
    };

    const activeFilterCount = [
        localFilters.category !== 'all',
        localFilters.type !== 'all',
        localFilters.lastTaxCollectionFrom !== '',
        localFilters.lastTaxCollectionTo !== '',
        localFilters.lastMaintenancePaidFrom !== '',
        localFilters.lastMaintenancePaidTo !== ''
    ].filter(Boolean).length;

    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex flex-row gap-4">
                {/* Search - Always visible */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by asset name..."
                        className="pl-10 h-11 bg-background border-border rounded-xl focus-visible:ring-primary/50"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                {/* Filter Modal Trigger */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-11 w-11 sm:w-auto px-0 sm:px-4 gap-2 rounded-xl bg-background border-border shrink-0">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline font-source tracking-tight">Filters</span>
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="h-5 px-1.5 ml-1 rounded-md text-[10px] hidden sm:flex">
                                    {activeFilterCount}
                                </Badge>
                            )}
                            {activeFilterCount > 0 && (
                                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary sm:hidden" />
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Filter Assets</DialogTitle>
                            <DialogDescription>
                                Apply filters to find specific assets.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {/* Classification */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">Classification</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={localFilters.category}
                                            onValueChange={(val) => setLocalFilters({ ...localFilters, category: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.asset_category_id} value={cat.asset_category_id.toString()}>
                                                        {cat.asset_category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select
                                            value={localFilters.type}
                                            onValueChange={(val) => setLocalFilters({ ...localFilters, type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                {types.map((type) => (
                                                    <SelectItem key={type.asset_type_id} value={type.asset_type_id.toString()}>
                                                        {type.asset_type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Sorting */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">Sorting</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sort By</Label>
                                        <Select
                                            value={localFilters.sortBy}
                                            onValueChange={(val) => setLocalFilters({ ...localFilters, sortBy: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sort By" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user_asset_id">Recently Added</SelectItem>
                                                <SelectItem value="user_asset_custom_name">Asset Name</SelectItem>
                                                <SelectItem value="user_asset_monthly_tax">Monthly Tax</SelectItem>
                                                <SelectItem value="user_asset_monthly_maintenance">Monthly Maintenance</SelectItem>
                                                <SelectItem value="user_asset_market_value">Market Value</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Order</Label>
                                        <div className="flex bg-muted p-1 rounded-lg">
                                            <button
                                                className={`flex-1 text-sm py-1.5 px-3 rounded-md transition-all ${localFilters.sortOrder === 'asc' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() => setLocalFilters({ ...localFilters, sortOrder: 'asc' })}
                                            >
                                                Ascending
                                            </button>
                                            <button
                                                className={`flex-1 text-sm py-1.5 px-3 rounded-md transition-all ${localFilters.sortOrder === 'desc' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() => setLocalFilters({ ...localFilters, sortOrder: 'desc' })}
                                            >
                                                Descending
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Date Ranges */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">Date Ranges</h4>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground tracking-wider">Last Tax Collection</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs">From</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.lastTaxCollectionFrom}
                                                onChange={(e) => setLocalFilters({ ...localFilters, lastTaxCollectionFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">To</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.lastTaxCollectionTo}
                                                onChange={(e) => setLocalFilters({ ...localFilters, lastTaxCollectionTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground tracking-wider">Last Maintenance Paid</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs">From</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.lastMaintenancePaidFrom}
                                                onChange={(e) => setLocalFilters({ ...localFilters, lastMaintenancePaidFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">To</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.lastMaintenancePaidTo}
                                                onChange={(e) => setLocalFilters({ ...localFilters, lastMaintenancePaidTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={handleReset} className="font-source tracking-tight">
                                Reset Filters
                            </Button>
                            <Button onClick={handleApply} className="gap-2 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 text-white hover:from-violet-700 hover:to-indigo-700 border-0 font-source tracking-tight">
                                <CheckCircle2 className="h-4 w-4" />
                                Apply Filters
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
