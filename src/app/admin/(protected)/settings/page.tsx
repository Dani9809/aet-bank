'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle"; // Verify path
import {
    User,
    Settings,
    Shield,
    Trash2,
    LogOut,
    Palette,
    AlertTriangle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

// Server Actions
import { getAccountDetails, deleteAdminAccount } from '@/actions/admin/accountActions';
import { getAdminSession, logoutAdmin } from '@/actions/adminActions';

// Components
import { ProfileEditModal } from "@/components/admin/settings/ProfileEditModal";
import { SecurityCard } from "@/components/admin/settings/SecurityCard";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchAdminDetails();
    }, []);

    const fetchAdminDetails = async () => {
        try {
            const userId = await checkSession();

            if (userId) {
                const res = await getAccountDetails(userId);
                if (res.success) {
                    setUser(res.data);
                } else {
                    toast.error("Failed to load account details");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkSession = async () => {
        return await getAdminSession();
    }


    const handleLogout = async () => {
        await logoutAdmin();
        router.push('/admin/auth'); // Redirect to login
        toast.success("Logged out successfully");
    };

    const handleDeleteAccount = async () => {
        if (!user) return;
        setIsDeleting(true);
        try {
            const res = await deleteAdminAccount(user.account_id);
            if (res.success) {
                toast.success("Account deleted permanently");
                router.push('/'); // Redirect to landing
            } else {
                toast.error(res.error || "Failed to delete account");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Admin Settings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account preferences and security.
                </p>
            </div>

            <div className="grid gap-8">
                {/* Account Information Card */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20">
                                <User className="h-5 w-5 text-cyan-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Account Information</h3>
                                <p className="text-sm text-muted-foreground">Personal details and contact info.</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setIsEditProfileOpen(true)}>
                            Edit Profile
                        </Button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Type</p>
                            <div className="mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                    {/* Assuming type_name is joined or fetched? 
                                        The getAccountDetails in accountActions.ts does select('*'), 
                                        it might NOT fetch joined type_name unless specified. 
                                        We might need to fetch type_name or just show "Admin" if type_id is 99 
                                        or rely on a separate join. 
                                        For now, if type_id is 99, we show Admin. 
                                    */}
                                    {user.type_id === 99 ? 'Administrator' : 'User'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1 lg:col-span-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                            <p className="font-medium text-base">
                                {[user.account_fname, user.account_mname, user.account_lname].filter(Boolean).join(' ')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                            <p className="font-medium truncate" title={user.account_email}>{user.account_email}</p>
                        </div>
                        <div className="space-y-1 lg:col-span-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin Address</p>
                            <p className="font-medium">{user.account_address}</p>
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <SecurityCard user={user} onUpdate={fetchAdminDetails} />

                {/* Preference Card */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border bg-muted/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20">
                                <Palette className="h-5 w-5 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Preference</h3>
                                <p className="text-sm text-muted-foreground">Customize your interface experience.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">Select your preferred appearance mode.</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-destructive/10 bg-destructive/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                                <p className="text-sm text-destructive/80">Irreversible actions. Tread carefully.</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="space-y-1">
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data.</p>
                        </div>
                        <div className="flex gap-3">

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="cursor-pointer" variant="destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Deleting..." : "Delete Account"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </div>

            <Button variant="outline" onClick={handleLogout} className="w-full border-border bg-red-500 hover:bg-red-500/80 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
            </Button>

            <ProfileEditModal
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
                user={user}
                onUpdate={fetchAdminDetails}
            />
        </div>
    );
}
