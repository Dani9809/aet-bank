'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, User, MoreHorizontal } from "lucide-react";

interface Account {
    account_id: number;
    account_uname: string;
    account_email: string;
    account_fname: string;
    account_lname: string;
    account_status: number;
    type_id: number;
    [key: string]: any;
}

interface AccountTableProps {
    data: Account[];
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onRefresh: () => void;
    onRowClick: (account: Account) => void;
}

export function AccountTable({ data, isLoading, pagination, onPageChange, onRowClick }: AccountTableProps) {
    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border">
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">User</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Username</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Email</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Type</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="text-sm">Loading accounts...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                                            <User className="h-8 w-8 opacity-50" />
                                            <span className="text-sm">No accounts found</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((account) => (
                                    <TableRow
                                        key={account.account_id}
                                        className="cursor-pointer hover:bg-muted/20 border-border transition-colors group"
                                        onClick={() => onRowClick(account)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-semibold text-sm">
                                                    {account.account_fname?.[0]}{account.account_lname?.[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">
                                                        {account.account_fname} {account.account_lname}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground sm:hidden truncate">
                                                        @{account.account_uname}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="sm:table-cell">
                                            <span className="text-foreground font-mono text-sm">@{account.account_uname}</span>
                                        </TableCell>
                                        <TableCell className="md:table-cell">
                                            <span className="text-muted-foreground text-sm truncate max-w-[200px] block">{account.account_email}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={account.type_id === 99
                                                    ? "border-violet-500 text-violet-600 bg-violet-500/10 text-xs" // Admin
                                                    : account.type_id === 1
                                                        ? "border-blue-500 text-blue-600 bg-blue-500/10 text-xs" // User
                                                        : "border-slate-500 text-slate-600 bg-slate-500/10 text-xs" // Default/Other
                                                }
                                            >
                                                {account.TYPE?.type_name || (account.type_id === 99 ? 'Admin' : account.type_id === 1 ? 'User' : `Type ${account.type_id}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={account.account_status === 1
                                                    ? "border-emerald-500 text-emerald-600 bg-emerald-500/10 text-xs"
                                                    : "border-red-500 text-red-600 bg-red-500/10 text-xs"
                                                }
                                            >
                                                {account.account_status === 1 ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{data.length}</span> of{" "}
                    <span className="font-medium text-foreground">{pagination.total}</span> accounts
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page <= 1 || isLoading}
                        className="h-9 px-3 rounded-lg"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Prev
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                                <Button
                                    key={pageNum}
                                    variant={pagination.page === pageNum ? "primary" : "ghost"}
                                    size="sm"
                                    onClick={() => onPageChange(pageNum)}
                                    disabled={isLoading}
                                    className={`h-9 w-9 rounded-lg ${pagination.page === pageNum ? 'bg-primary text-primary-foreground' : ''}`}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages || isLoading}
                        className="h-9 px-3 rounded-lg"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
