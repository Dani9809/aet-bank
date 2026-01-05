
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Filter, X, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getBusinessCategories, getBusinessTypes } from '@/actions/admin/businessActions';
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

interface BusinessFiltersProps {
    onSearchChange: (value: string) => void;
    filters: {
        type: string;
        category: string;
        status: string;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        // Ranges
        worthMin?: number;
        worthMax?: number;
        incomeMin?: number;
        incomeMax?: number;
        earningsMin?: number;
        earningsMax?: number;
        // Dates
        lastTaxCollectionFrom?: string;
        lastTaxCollectionTo?: string;
        lastMaintenanceCollectionFrom?: string;
        lastMaintenanceCollectionTo?: string;
    };
    onFiltersChange: (newFilters: any) => void;
    isLoading?: boolean;
}

// Helper for Range Inputs
const RangeFilter = ({
    label,
    minVal,
    maxVal,
    onChange
}: {
    label: string,
    minVal?: number,
    maxVal?: number,
    onChange: (min?: number, max?: number) => void
}) => {
    return (
        <div className="space-y-3">
            <Label className="text-xs uppercase text-muted-foreground tracking-wider">{label}</Label>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    placeholder="Min"
                    value={minVal ?? ''}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined, maxVal)}
                    className="h-8 text-xs"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    type="number"
                    placeholder="Max"
                    value={maxVal ?? ''}
                    onChange={(e) => onChange(minVal, e.target.value ? Number(e.target.value) : undefined)}
                    className="h-8 text-xs"
                />
            </div>
        </div>
    );
};

export function BusinessFilters({
    onSearchChange,
    filters,
    onFiltersChange,
    isLoading
}: BusinessFiltersProps) {
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
                getBusinessTypes(),
                getBusinessCategories()
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
        setLocalFilters({
            type: "all",
            category: "all",
            status: "all",
            sortBy: "user_business_worth",
            sortOrder: "desc",
            worthMin: undefined,
            worthMax: undefined,
            incomeMin: undefined,
            incomeMax: undefined,
            earningsMin: undefined,
            earningsMax: undefined,
            lastTaxCollectionFrom: "",
            lastTaxCollectionTo: "",
            lastMaintenanceCollectionFrom: "",
            lastMaintenanceCollectionTo: ""
        });
    };

    const activeFilterCount = [
        localFilters.category !== 'all',
        localFilters.type !== 'all',
        localFilters.status !== 'all',
        localFilters.worthMin !== undefined || localFilters.worthMax !== undefined,
        localFilters.incomeMin !== undefined || localFilters.incomeMax !== undefined,
        localFilters.earningsMin !== undefined || localFilters.earningsMax !== undefined,
        localFilters.lastTaxCollectionFrom !== '',
        localFilters.lastTaxCollectionTo !== '',
        localFilters.lastMaintenanceCollectionFrom !== '',
        localFilters.lastMaintenanceCollectionTo !== ''
    ].filter(Boolean).length;



    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by business name..."
                        className="pl-10 h-11 bg-background border-border rounded-xl focus-visible:ring-primary/50"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                {/* Filters Trigger */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-11 w-11 sm:w-auto px-0 sm:px-4 gap-2 rounded-xl bg-background border-border shrink-0">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
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
                            <DialogTitle>Filter Businesses</DialogTitle>
                            <DialogDescription>
                                Apply advanced filters to find specific businesses.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {/* General */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">General</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                                    <SelectItem key={cat.business_category_id} value={cat.business_category_id.toString()}>
                                                        {cat.business_category_name}
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
                                                    <SelectItem key={type.business_type_id} value={type.business_type_id.toString()}>
                                                        {type.business_type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={localFilters.status}
                                            onValueChange={(val) => setLocalFilters({ ...localFilters, status: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="1">Active</SelectItem>
                                                <SelectItem value="0">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Financial Ranges */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground">Financials</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <RangeFilter
                                        label="Business Worth"
                                        minVal={localFilters.worthMin}
                                        maxVal={localFilters.worthMax}
                                        onChange={(min, max) => setLocalFilters(prev => ({ ...prev, worthMin: min, worthMax: max }))}
                                    />
                                    <RangeFilter
                                        label="Monthly Income"
                                        minVal={localFilters.incomeMin}
                                        maxVal={localFilters.incomeMax}
                                        onChange={(min, max) => setLocalFilters(prev => ({ ...prev, incomeMin: min, incomeMax: max }))}
                                    />
                                    <RangeFilter
                                        label="Total Earnings"
                                        minVal={localFilters.earningsMin}
                                        maxVal={localFilters.earningsMax}
                                        onChange={(min, max) => setLocalFilters(prev => ({ ...prev, earningsMin: min, earningsMax: max }))}
                                    />
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
                                                <SelectItem value="user_business_worth">Business Worth</SelectItem>
                                                <SelectItem value="user_business_monthly_income">Monthly Income</SelectItem>
                                                <SelectItem value="user_business_earnings">Total Earnings</SelectItem>
                                                <SelectItem value="user_business_monthly_tax">Monthly Tax</SelectItem>
                                                <SelectItem value="user_business_monthly_maintenance">Monthly Maintenance</SelectItem>
                                                <SelectItem value="last_tax_collection">Last Tax Collection</SelectItem>
                                                <SelectItem value="last_maintenance_collection">Last Maintenance</SelectItem>
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
                                                value={localFilters.lastMaintenanceCollectionFrom}
                                                onChange={(e) => setLocalFilters({ ...localFilters, lastMaintenanceCollectionFrom: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">To</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.lastMaintenanceCollectionTo}
                                                onChange={(e) => setLocalFilters({ ...localFilters, lastMaintenanceCollectionTo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={handleReset}>
                                Reset Filters
                            </Button>
                            <Button onClick={handleApply} className="gap-2 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white hover:from-violet-700 hover:to-indigo-700 border-0">
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
