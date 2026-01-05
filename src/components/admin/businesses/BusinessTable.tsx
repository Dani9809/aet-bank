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
import { Loader2, ChevronLeft, ChevronRight, Building2, MoreHorizontal } from "lucide-react";

interface Business {
    user_business_id: number;
    user_business_name: string;
    account_id: number;
    business_type_detail_id: number;
    ACCOUNT?: {
        account_fname: string;
        account_lname: string;
        account_uname: string;
    };
    BUSINESS_TYPE_DETAIL?: {
        BUSINESS_CATEGORY?: {
            business_category_name: string;
        };
        BUSINESS_TYPE?: {
            business_type_name: string;
        };
    };
    [key: string]: any;
}

interface BusinessTableProps {
    data: Business[];
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onRowClick: (business: Business) => void;
}

export function BusinessTable({ data, isLoading, pagination, onPageChange, onRowClick }: BusinessTableProps) {
    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Table */}
            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border">
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Business Name</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Owner</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Category</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Type</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="text-sm">Loading businesses...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                                            <Building2 className="h-8 w-8 opacity-50" />
                                            <span className="text-sm">No businesses found</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((business) => (
                                    <TableRow
                                        key={business.user_business_id}
                                        className="cursor-pointer hover:bg-muted/20 border-border transition-colors group"
                                        onClick={() => onRowClick(business)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                                    <Building2 className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">
                                                        {business.user_business_name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground sm:hidden truncate">
                                                        {business.ACCOUNT?.account_fname} {business.ACCOUNT?.account_lname}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-foreground font-medium text-sm">
                                                    {business.ACCOUNT?.account_fname} {business.ACCOUNT?.account_lname}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    @{business.ACCOUNT?.account_uname}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-xs"
                                            >
                                                {business.BUSINESS_TYPE_DETAIL?.BUSINESS_CATEGORY?.business_category_name || 'Uncategorized'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-violet-500 text-violet-600 bg-violet-500/10 text-xs"
                                            >
                                                {business.BUSINESS_TYPE_DETAIL?.BUSINESS_TYPE?.business_type_name || 'Unknown Type'}
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
                    <span className="font-medium text-foreground">{pagination.total}</span> businesses
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
