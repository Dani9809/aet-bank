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
import { useState, useEffect } from "react";
import { TaxFilterParams } from "@/actions/admin/taxActions";

interface TaxFiltersProps {
    onSearchChange: (value: string) => void;
    filters: TaxFilterParams;
    onFiltersChange: (filters: TaxFilterParams) => void;
}

export function TaxFilters({
    onSearchChange,
    filters,
    onFiltersChange,
}: TaxFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [localFilters, setLocalFilters] = useState<TaxFilterParams>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, isOpen]);

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
        const resetFilters: TaxFilterParams = {
            rateFrom: undefined,
            rateTo: undefined,
            isAuto: "all",
            sortBy: "tax_type_id",
            sortOrder: "asc",
        };
        setLocalFilters(resetFilters);
    };

    const activeFilterCount = [
        localFilters.isAuto !== 'all' && localFilters.isAuto !== undefined,
        localFilters.rateFrom !== undefined && localFilters.rateFrom !== ("" as any),
        localFilters.rateTo !== undefined && localFilters.rateTo !== ("" as any),
    ].filter(Boolean).length;

    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex flex-row gap-4">
                {/* Search - Always visible */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search Tax Name..."
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
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Filter Taxes</DialogTitle>
                            <DialogDescription>
                                Apply filters to find specific tax types.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Is Auto</Label>
                                <Select
                                    value={localFilters.isAuto || "all"}
                                    onValueChange={(value) => setLocalFilters({ ...localFilters, isAuto: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tax Rate Range (%)</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={localFilters.rateFrom || ""}
                                        onChange={(e) => setLocalFilters({ ...localFilters, rateFrom: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={localFilters.rateTo || ""}
                                        onChange={(e) => setLocalFilters({ ...localFilters, rateTo: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={handleReset} className="font-source tracking-tight cursor-pointer">
                                Reset Filters
                            </Button>
                            <Button onClick={handleApply} className="gap-2 bg-gradient-to-r from-zinc-800 to-slate-700 text-white border-0 font-source tracking-tight cursor-pointer">
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
