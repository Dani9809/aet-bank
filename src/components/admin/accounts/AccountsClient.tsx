'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccounts } from '@/actions/admin/accountActions';
import { AccountFilters } from './AccountFilters';
import { AccountTable } from './AccountTable';
import { AccountDetailsModal } from './AccountDetailsModal';
import { toast } from "sonner";
import { Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountsClientProps {
    currentUserId: number;
}

export default function AccountsClient({ currentUserId }: AccountsClientProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0
    });

    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAccounts({
                page,
                limit: 25,
                query: search,
                type: typeFilter,
                status: statusFilter,
                excludeId: currentUserId
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
                toast.error(res.error || "Failed to fetch accounts");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, [page, search, typeFilter, statusFilter, currentUserId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setPage(1);
    }, [search, typeFilter, statusFilter]);

    const handleRowClick = (account: any) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    // Auto-sync selectedAccount when data changes (for live preview after updates)
    useEffect(() => {
        if (selectedAccount && data.length > 0) {
            const updatedAccount = data.find(acc => acc.account_id === selectedAccount.account_id);
            if (updatedAccount) {
                setSelectedAccount(updatedAccount);
            }
        }
    }, [data]);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-4 sm:p-6 md:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
                            <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading tracking-tight">Accounts</h1>
                            <p className="text-white/70 text-xs sm:text-sm">Manage and monitor user accounts</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/20 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                            {pagination.total} Total
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
            <AccountFilters
                onSearchChange={setSearch}
                onTypeChange={setTypeFilter}
                onStatusChange={setStatusFilter}
                isLoading={loading}
            />

            {/* Table */}
            <AccountTable
                data={data}
                isLoading={loading}
                pagination={pagination}
                onPageChange={setPage}
                onRefresh={fetchData}
                onRowClick={handleRowClick}
            />

            {/* Modal */}
            <AccountDetailsModal
                account={selectedAccount}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onAccountUpdated={fetchData}
            />
        </div>
    );
}
