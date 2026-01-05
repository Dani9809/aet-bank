import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { getAssetCategories, getAssetTypes } from '@/actions/admin/assetActions';

interface AssetFiltersProps {
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onSortOrderChange: (value: 'asc' | 'desc') => void;
    isLoading?: boolean;
}

export function AssetFilters({
    onSearchChange,
    onTypeChange,
    onCategoryChange,
    onSortChange,
    onSortOrderChange,
    isLoading
}: AssetFiltersProps) {
    const [searchValue, setSearchValue] = useState("");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

    const toggleSortOrder = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        onSortOrderChange(newOrder);
    };

    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by asset name..."
                        className="pl-10 h-11 bg-background border-border rounded-xl focus-visible:ring-primary/50"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-full sm:w-auto">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters:</span>
                    </div>

                    <Select onValueChange={onCategoryChange} defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[150px] h-11 bg-background border-border rounded-xl">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.asset_category_id} value={cat.asset_category_id.toString()}>
                                    {cat.asset_category_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={onTypeChange} defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[150px] h-11 bg-background border-border rounded-xl">
                            <SelectValue placeholder="Asset Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl">
                            <SelectItem value="all">All Types</SelectItem>
                            {types.map((type) => (
                                <SelectItem key={type.asset_type_id} value={type.asset_type_id.toString()}>
                                    {type.asset_type_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="h-8 w-[1px] bg-border hidden sm:block mx-1"></div>

                    <Select onValueChange={onSortChange} defaultValue="user_asset_id">
                        <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background border-border rounded-xl">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl">
                            <SelectItem value="user_asset_id">Recently Added</SelectItem>
                            {/* Add more sort keys if available */}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={toggleSortOrder}
                        className="h-11 w-11 p-0 bg-background border-border rounded-xl"
                        title={sortOrder === 'asc' ? "Sort Ascending" : "Sort Descending"}
                    >
                        {sortOrder === 'asc' ? (
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold">ASC</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold">DESC</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
