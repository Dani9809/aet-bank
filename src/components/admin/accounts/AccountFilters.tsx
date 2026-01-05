
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAccountTypes, AccountType } from '@/actions/admin/typeActions';
import { getAccountStatuses } from '@/actions/admin/accountActions';

export interface AccountFiltersState {
    type: string;
    status: string;
    clicksMin?: number;
    clicksMax?: number;
    investEarningsMin?: number;
    investEarningsMax?: number;
    bizEarningsMin?: number;
    bizEarningsMax?: number;
    clickerEarningsMin?: number;
    clickerEarningsMax?: number;
}

interface AccountFiltersProps {
    onSearchChange: (value: string) => void;
    filters: AccountFiltersState;
    onFiltersChange: (filters: AccountFiltersState) => void;
    isLoading?: boolean;
}

export function AccountFilters({ onSearchChange, filters, onFiltersChange, isLoading }: AccountFiltersProps) {
    const [searchValue, setSearchValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<AccountFiltersState>(filters);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearchChange(searchValue);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onSearchChange]);

    // Sync local filters when modal opens or parent filters change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, isOpen]);

    const handleApplyFilters = () => {
        onFiltersChange(localFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        const resetState: AccountFiltersState = {
            type: "all",
            status: "all",
            clicksMin: undefined,
            clicksMax: undefined,
            investEarningsMin: undefined,
            investEarningsMax: undefined,
            bizEarningsMin: undefined,
            bizEarningsMax: undefined,
            clickerEarningsMin: undefined,
            clickerEarningsMax: undefined
        };
        setLocalFilters(resetState);
        onFiltersChange(resetState);
        setIsOpen(false);
    };

    const countActiveFilters = () => {
        let count = 0;
        if (filters.type !== 'all') count++;
        if (filters.status !== 'all') count++;
        if (filters.clicksMin !== undefined || filters.clicksMax !== undefined) count++;
        if (filters.investEarningsMin !== undefined || filters.investEarningsMax !== undefined) count++;
        if (filters.bizEarningsMin !== undefined || filters.bizEarningsMax !== undefined) count++;
        if (filters.clickerEarningsMin !== undefined || filters.clickerEarningsMax !== undefined) count++;
        return count;
    };

    const activeCount = countActiveFilters();

    const [types, setTypes] = useState<AccountType[]>([]);
    const [statuses, setStatuses] = useState<number[]>([]);

    const fetchTypes = useCallback(async () => {
        try {
            const res = await getAccountTypes();
            if (res.success && res.data) {
                setTypes(res.data);
            }
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    }, []);

    const fetchStatuses = useCallback(async () => {
        try {
            const res = await getAccountStatuses();
            if (res.success && res.data) {
                setStatuses(res.data);
            }
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    }, []);

    useEffect(() => {
        fetchTypes();
        fetchStatuses();
    }, [fetchTypes, fetchStatuses]);

    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or username..."
                        className="pl-10 h-11 bg-background border-border rounded-xl focus-visible:ring-primary/50"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className={`h-11 ${activeCount > 0 ? 'border-primary/50 bg-primary/5 text-primary' : 'border-border'} rounded-xl px-3 sm:px-4 shrink-0`}
                        >
                            <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Filters</span>
                            {activeCount > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                                    {activeCount}
                                </Badge>
                            )}
                            <span className="sr-only sm:not-sr-only sm:hidden inline-block w-2 h-2 ml-1 rounded-full bg-primary" style={{ display: activeCount > 0 ? 'inline-block' : 'none' }}></span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5 text-primary" />
                                Filter Accounts
                            </DialogTitle>
                            <DialogDescription>
                                Apply filters to narrow down the account list.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            {/* General filters */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Account Type</Label>
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
                                                <SelectItem key={type.type_id} value={type.type_id.toString()}>
                                                    {type.type_name}
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
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status.toString()}>
                                                    {status === 1 ? 'Active' : status === 0 ? 'Inactive' : `Status ${status}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            {/* Range Filters */}
                            <div className="space-y-4">
                                <h4 className="font-medium flex items-center text-sm text-muted-foreground">Range Filters</h4>

                                <div className="space-y-3">
                                    <Label>Total Clicks</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={localFilters.clicksMin ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, clicksMin: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={localFilters.clicksMax ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, clicksMax: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Investment Total Earnings</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={localFilters.investEarningsMin ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, investEarningsMin: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={localFilters.investEarningsMax ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, investEarningsMax: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Business Total Earnings</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={localFilters.bizEarningsMin ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, bizEarningsMin: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={localFilters.bizEarningsMax ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, bizEarningsMax: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Clicker Total Earnings</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={localFilters.clickerEarningsMin ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, clickerEarningsMin: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={localFilters.clickerEarningsMax ?? ''}
                                            onChange={(e) => setLocalFilters({ ...localFilters, clickerEarningsMax: e.target.value ? Number(e.target.value) : undefined })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={handleResetFilters} className="gap-2">
                                <Trash2 className="h-4 w-4" />
                                Reset
                            </Button>
                            <Button onClick={handleApplyFilters} className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 border-0">
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
