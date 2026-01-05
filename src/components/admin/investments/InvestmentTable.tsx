
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvestmentTableProps {
    data: any[];
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onRowClick: (investment: any) => void;
}

export function InvestmentTable({
    data,
    isLoading,
    pagination,
    onPageChange,
    onRowClick
}: InvestmentTableProps) {
    if (isLoading) {
        return (
            <div className="rounded-xl border border-border/50 overflow-hidden bg-card">
                <div className="p-8 space-y-4">
                    <div className="h-10 bg-accent/20 rounded animate-pulse w-full" />
                    <div className="h-10 bg-accent/10 rounded animate-pulse w-full" />
                    <div className="h-10 bg-accent/10 rounded animate-pulse w-full" />
                    <div className="h-10 bg-accent/10 rounded animate-pulse w-full" />
                    <div className="h-10 bg-accent/10 rounded animate-pulse w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Investment</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Units Owned</TableHead>
                            <TableHead className="text-right">Total Value</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                    No investments found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => {
                                const typeName = item.INVESTMENT_TYPE_DETAIL?.INVESTMENT_TYPE?.investment_type_name || "Unknown";
                                const categoryName = item.INVESTMENT_TYPE_DETAIL?.INVESTMENT_CATEGORY?.investment_category_name || "Unknown";
                                const user = item.ACCOUNT ? `${item.ACCOUNT.account_fname} ${item.ACCOUNT.account_lname}` : "Unknown User";
                                const email = item.ACCOUNT?.account_email;

                                // Calculating Total Value: Owned Units * Price Per Unit (from Type)
                                // Note: item.user_investment_owned_unit_cost might be the cost at purchase.
                                // Current value usually uses current price. Let's use current price from TYPE.
                                const currentPrice = item.INVESTMENT_TYPE_DETAIL?.INVESTMENT_TYPE?.investment_type_price_per_unit || 0;
                                const totalValue = item.user_investment_owned_units * currentPrice;

                                return (
                                    <TableRow
                                        key={item.user_investment_id}
                                        className="cursor-pointer hover:bg-accent/5 transition-colors"
                                        onClick={() => onRowClick(item)}
                                    >
                                        <TableCell className="font-medium text-muted-foreground">
                                            #{item.user_investment_id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{user}</span>
                                                <span className="text-xs text-muted-foreground">{email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{typeName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">
                                                {categoryName}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono">{item.user_investment_owned_units}</span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium text-emerald-500">
                                            {formatCurrency(totalValue)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={item.user_investment_status === 1 ? 'default' : 'secondary'}
                                                className={
                                                    item.user_investment_status === 1
                                                        ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
                                                        : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20"
                                                }
                                            >
                                                {item.user_investment_status === 1 ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1 || isLoading}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium">
                        Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page === pagination.totalPages || isLoading}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
