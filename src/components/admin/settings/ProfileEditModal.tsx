'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserCog, Save, X } from "lucide-react";
import { updateAccountProfile } from '@/actions/admin/accountActions';

interface ProfileEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any; // Using any for flexibility or define a specific type
    onUpdate: () => void;
}

export function ProfileEditModal({ open, onOpenChange, user, onUpdate }: ProfileEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fname: '',
        mname: '',
        lname: '',
        address: '',
        email: '',
        username: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fname: user.account_fname || '',
                mname: user.account_mname || '',
                lname: user.account_lname || '',
                address: user.account_address || '',
                email: user.account_email || '',
                username: user.account_uname || ''
            });
        }
    }, [user, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateAccountProfile(user.account_id, {
                account_fname: formData.fname,
                account_mname: formData.mname,
                account_lname: formData.lname,
                account_address: formData.address,
                account_email: formData.email,
                account_uname: formData.username
            });

            if (res.success) {
                toast.success("Profile updated successfully");
                onUpdate();
                onOpenChange(false);
            } else {
                toast.error(res.error || "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during update");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-md bg-card text-foreground border-border">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600/20 via-violet-500/20 to-purple-500/20">
                            <UserCog className="h-5 w-5 text-indigo-500" />
                        </div>
                        <DialogTitle>Edit Profile Information</DialogTitle>
                    </div>
                    <DialogDescription>
                        Update your personal details and contact information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fname">First Name</Label>
                            <Input
                                id="fname"
                                value={formData.fname}
                                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                                required
                                className="bg-background border-border"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lname">Last Name</Label>
                            <Input
                                id="lname"
                                value={formData.lname}
                                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                                required
                                className="bg-background border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mname">Middle Name (Optional)</Label>
                        <Input
                            id="mname"
                            value={formData.mname}
                            onChange={(e) => setFormData({ ...formData, mname: e.target.value })}
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            className="bg-background border-border"
                        />
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 text-white border-0 hover:from-violet-700 hover:via-violet-600 hover:to-purple-600">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
