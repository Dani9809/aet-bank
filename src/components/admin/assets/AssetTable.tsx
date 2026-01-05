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
import { Loader2, ChevronLeft, ChevronRight, Gem, MoreHorizontal } from "lucide-react";

import { Tables } from "@/types/database.types";

interface Asset extends Tables<'USER_ASSET'> {
    ACCOUNT?: Pick<Tables<'ACCOUNT'>, 'account_fname' | 'account_lname' | 'account_uname'>;
    ASSET?: Tables<'ASSET'> & {
        ASSET_TYPE?: Tables<'ASSET_TYPE'> & {
            ASSET_CATEGORY?: Tables<'ASSET_CATEGORY'>;
        };
        ASSET_DETAIL?: (Tables<'ASSET_DETAIL'> & {
            DETAIL?: Tables<'DETAIL'>;
        })[];
    };
}

interface AssetTableProps {
    data: Asset[];
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onRowClick: (asset: Asset) => void;
}

export function AssetTable({ data, isLoading, pagination, onPageChange, onRowClick }: AssetTableProps) {
    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border">
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">Asset Name</TableHead>
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
                                            <span className="text-sm">Loading assets...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                                            <Gem className="h-8 w-8 opacity-50" />
                                            <span className="text-sm">No assets found</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((asset) => (
                                    <TableRow
                                        key={asset.user_asset_id}
                                        className="cursor-pointer hover:bg-muted/20 border-border transition-colors group"
                                        onClick={() => onRowClick(asset)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                                    <Gem className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate">
                                                        {asset.ASSET?.asset_detail_name || asset.user_asset_custom_name || 'Unnamed Asset'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground sm:hidden truncate">
                                                        {asset.ACCOUNT?.account_fname} {asset.ACCOUNT?.account_lname}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-foreground font-medium text-sm">
                                                    {asset.ACCOUNT?.account_fname} {asset.ACCOUNT?.account_lname}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    @{asset.ACCOUNT?.account_uname}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-xs"
                                            >
                                                {asset.ASSET?.ASSET_TYPE?.ASSET_CATEGORY?.asset_category_name || 'Uncategorized'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-violet-500 text-violet-600 bg-violet-500/10 text-xs"
                                            >
                                                {asset.ASSET?.ASSET_TYPE?.asset_type_name || 'Unknown Type'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRowClick(asset);
                                                }}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
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
                    <span className="font-medium text-foreground">{pagination.total}</span> assets
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
