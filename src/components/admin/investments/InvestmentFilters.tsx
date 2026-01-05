import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

interface InvestmentFiltersProps {
    onSearchChange: (value: string) => void;
    filters: any;
    onFiltersChange: (filters: any) => void;
    categories: any[];
    types: any[];
    isLoading: boolean;
}

export function InvestmentFilters({
    onSearchChange,
    filters,
    onFiltersChange,
    categories,
    types,
    isLoading
}: InvestmentFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [localFilters, setLocalFilters] = useState(filters);

    // Sync local filters when modal opens or props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, isOpen]);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearchChange(searchValue);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchValue, onSearchChange]);

    const handleApply = () => {
        onFiltersChange(localFilters);
        setIsOpen(false);
    };

    const handleReset = () => {
        const resetFilters = {
            type: "all",
            category: "all",
            focus: "",
            priceFrom: "",
            priceTo: "",
            capitalizationFrom: "",
            capitalizationTo: "",
            status: "all",
            sortBy: "user_investment_id",
            sortOrder: "desc" as const,
        };
        setLocalFilters(resetFilters);
    };

    const activeFilterCount = [
        localFilters.type !== 'all',
        localFilters.category !== 'all',
        localFilters.focus !== '',
        localFilters.status !== 'all',
        localFilters.priceFrom !== '',
        localFilters.priceTo !== '',
        localFilters.capitalizationFrom !== '',
        localFilters.capitalizationTo !== ''
    ].filter(Boolean).length;

    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex flex-row gap-4">
                {/* Search - Always visible */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by User..."
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
                            <DialogTitle>Filter Investments</DialogTitle>
                            <DialogDescription>
                                Apply filters to find specific user investments.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {/* Classification */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">Classification</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Investment Type</Label>
                                        <Select
                                            value={localFilters.type?.toString() || "all"}
                                            onValueChange={(value) => setLocalFilters({ ...localFilters, type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                {types.map((type) => (
                                                    <SelectItem key={type.investment_type_id} value={type.investment_type_id.toString()}>
                                                        {type.investment_type_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={localFilters.category?.toString() || "all"}
                                            onValueChange={(value) => setLocalFilters({ ...localFilters, category: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.investment_category_id} value={cat.investment_category_id.toString()}>
                                                        {cat.investment_category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Focus</Label>
                                        <Input
                                            placeholder="Search focus..."
                                            value={localFilters.focus || ""}
                                            onChange={(e) => setLocalFilters({ ...localFilters, focus: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Type Status</Label>
                                        <Select
                                            value={localFilters.status?.toString() || "all"}
                                            onValueChange={(value) => setLocalFilters({ ...localFilters, status: value })}
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

                            {/* Financials */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm text-muted-foreground">Financials</h4>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground tracking-wider">Price Per Unit</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="number"
                                            placeholder="Min Price"
                                            value={localFilters.priceFrom || ""}
                                            onChange={(e) => setLocalFilters({ ...localFilters, priceFrom: e.target.value })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max Price"
                                            value={localFilters.priceTo || ""}
                                            onChange={(e) => setLocalFilters({ ...localFilters, priceTo: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground tracking-wider">Capitalization</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="number"
                                            placeholder="Min Cap"
                                            value={localFilters.capitalizationFrom || ""}
                                            onChange={(e) => setLocalFilters({ ...localFilters, capitalizationFrom: e.target.value })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max Cap"
                                            value={localFilters.capitalizationTo || ""}
                                            onChange={(e) => setLocalFilters({ ...localFilters, capitalizationTo: e.target.value })}
                                        />
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
                                                <SelectItem value="user_investment_id">Recently Added</SelectItem>
                                                <SelectItem value="user_investment_owned_units">Units Owned</SelectItem>
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
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={handleReset} className="font-source tracking-tight cursor-pointer">
                                Reset Filters
                            </Button>
                            <Button onClick={handleApply} className="gap-2 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 text-white border-0 font-source tracking-tight cursor-pointer">
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
