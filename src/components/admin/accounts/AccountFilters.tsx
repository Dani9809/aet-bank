
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AccountTypeModal } from "./AccountTypeModal";
import { getAccountTypes, AccountType } from '@/actions/admin/typeActions';
import { getAccountStatuses } from '@/actions/admin/accountActions';
import { toast } from "sonner";

interface AccountFiltersProps {
    onSearchChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    isLoading?: boolean;
}

export function AccountFilters({ onSearchChange, onTypeChange, onStatusChange, isLoading }: AccountFiltersProps) {
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearchChange(searchValue);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onSearchChange]);

    const [types, setTypes] = useState<AccountType[]>([]);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

    const fetchTypes = useCallback(async () => {
        try {
            const res = await getAccountTypes();
            if (res.success && res.data) {
                setTypes(res.data);
            } else {
                console.error("Failed to fetch types:", res.error);
            }
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    }, []);

    const [statuses, setStatuses] = useState<number[]>([]);

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
        <>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
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
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters:</span>
                        </div>

                        <div className="flex gap-2">
                            <Select onValueChange={onTypeChange} defaultValue="all">
                                <SelectTrigger className="w-full sm:w-[160px] h-11 bg-background border-border rounded-xl">
                                    <SelectValue placeholder="Account Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border rounded-xl">
                                    <SelectItem value="all">All Types</SelectItem>
                                    {types.map((type) => (
                                        <SelectItem key={type.type_id} value={type.type_id.toString()}>
                                            {type.type_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11 hover:bg-muted/50 border-dashed"
                                onClick={() => setIsTypeModalOpen(true)}
                                title="Manage Account Types"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <Select onValueChange={onStatusChange} defaultValue="all">
                            <SelectTrigger className="w-full sm:w-[160px] h-11 bg-background border-border rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border rounded-xl">
                                <SelectItem value="all">All Status</SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status.toString()}>
                                        {status === 1 ? 'Active' : status === 0 ? 'Inactive' : `Status ${status}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <AccountTypeModal
                open={isTypeModalOpen}
                onOpenChange={setIsTypeModalOpen}
                onTypeAdded={fetchTypes}
            />
        </>
    );
}
