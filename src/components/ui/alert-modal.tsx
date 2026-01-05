'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    title?: string;
    description?: string;
    variant?: 'primary' | 'destructive';
}

export const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    variant = 'destructive'
}: AlertModalProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md border-border bg-card">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-6 w-full flex justify-end gap-x-2">
                    <Button
                        disabled={loading}
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading}
                        variant={variant}
                        onClick={onConfirm}
                    >
                        {loading ? 'Processing...' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
