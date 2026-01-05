import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { TaxType } from "@/actions/admin/taxActions";

interface TaxTableProps {
    data: TaxType[];
    isLoading: boolean;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (tax: TaxType) => void;
    onDelete?: (id: number) => void;
}

export function TaxTable({
    data,
    isLoading,
    pagination,
    onPageChange,
    onEdit,
    onDelete
}: TaxTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center border border-dashed rounded-xl border-border/50 bg-card/50">
                <p className="text-muted-foreground">No taxes found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Tax Name</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Auto Applied</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((tax) => (
                            <TableRow
                                key={tax.tax_type_id}
                                className="cursor-pointer hover:bg-muted/30 transition-colors"
                            >
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                    #{tax.tax_type_id}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {tax.tax_name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono bg-zinc-500/10 text-slate-500 border-slate-500/20">
                                        {tax.tax_rate}%
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={tax.is_auto ? "default" : "secondary"}
                                        className={tax.is_auto ? "bg-gradient-to-r from-zinc-800 to-slate-700" : ""}
                                    >
                                        {tax.is_auto ? "Yes" : "No"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(tax);
                                        }}
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    >
                                        <Edit className="h-4 w-4 cursor-pointer" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.(tax.tax_type_id);
                                        }}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4 cursor-pointer" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{data.length}</span> of{" "}
                    <span className="font-medium text-foreground">{pagination.total}</span> taxes
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
                        {Array.from({ length: pagination.totalPages }, (_, i) => {
                            const p = i + 1;
                            // Show first, last, current, and surrounding pages
                            if (
                                p === 1 ||
                                p === pagination.totalPages ||
                                (p >= pagination.page - 1 && p <= pagination.page + 1)
                            ) {
                                return (
                                    <Button
                                        key={p}
                                        variant={pagination.page === p ? "primary" : "ghost"}
                                        size="sm"
                                        onClick={() => onPageChange(p)}
                                        disabled={isLoading}
                                        className={`h-9 w-9 rounded-lg ${pagination.page === p ? 'bg-primary text-primary-foreground' : ''}`}
                                    >
                                        {p}
                                    </Button>
                                );
                            }
                            if (
                                p === pagination.page - 2 ||
                                p === pagination.page + 2
                            ) {
                                return <span key={p} className="px-2 text-muted-foreground">...</span>;
                            }
                            return null;
                        })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
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
