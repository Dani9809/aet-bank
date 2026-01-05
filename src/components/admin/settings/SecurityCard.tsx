'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, KeyRound, Lock, ShieldAlert } from "lucide-react";
import { updateAccountPassword, updateAccountPin, updateAccountUsername } from '@/actions/admin/accountActions';

interface SecurityCardProps {
    user: any;
    onUpdate?: () => void;
}

export function SecurityCard({ user, onUpdate }: SecurityCardProps) {
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [username, setUsername] = useState('');
    const [loadingPass, setLoadingPass] = useState(false);
    const [loadingPin, setLoadingPin] = useState(false);
    const [loadingUsername, setLoadingUsername] = useState(false);

    useEffect(() => {
        if (user?.account_uname) {
            setUsername(user.account_uname);
        }
    }, [user]);

    const handleUpdateUsername = async () => {
        if (!username || username.trim().length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        setLoadingUsername(true);
        try {
            const res = await updateAccountUsername(user.account_id, username);
            if (res.success) {
                toast.success("Username updated successfully");
                onUpdate?.();
            } else {
                toast.error(res.error || "Failed to update username");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoadingUsername(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!password || password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoadingPass(true);
        try {
            const res = await updateAccountPassword(user.account_id, password);
            if (res.success) {
                toast.success("Password updated successfully");
                setPassword('');
                onUpdate?.();
            } else {
                toast.error(res.error || "Failed to update password");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoadingPass(false);
        }
    };

    const handleUpdatePin = async () => {
        if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
            toast.error("PIN must be exactly 6 digits");
            return;
        }

        setLoadingPin(true);
        try {
            const res = await updateAccountPin(user.account_id, pin);
            if (res.success) {
                toast.success("PIN updated successfully");
                setPin('');
                onUpdate?.();
            } else {
                toast.error(res.error || "Failed to update PIN");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoadingPin(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20">
                        <Lock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Security</h3>
                        <p className="text-sm text-muted-foreground">Manage your account credentials and access.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Username & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</Label>
                        <div className="flex gap-2">
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-background border-border"
                                placeholder="Username"
                            />
                            <Button
                                onClick={handleUpdateUsername}
                                disabled={loadingUsername || username === user.account_uname}
                                size="sm"
                                className="shrink-0"
                            >
                                {loadingUsername ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Status</Label>
                        <div>
                            {user.account_status === 1 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-600 border border-green-500/20">
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-600 border border-red-500/20">
                                    Inactive
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Password Update */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Change Password</h4>
                    </div>
                    <div className="flex gap-3">
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background border-border"
                        />
                        <Button
                            onClick={handleUpdatePassword}
                            disabled={loadingPass || !password}
                            className="bg-primary text-primary-foreground shrink-0"
                        >
                            {loadingPass && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Update Password
                        </Button>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* PIN Update */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Change Security PIN</h4>
                    </div>
                    <div className="flex gap-3">
                        <Input
                            type="password" // or text with maxLength
                            placeholder="6-Digit PIN"
                            maxLength={6}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="bg-background border-border"
                        />
                        <Button
                            onClick={handleUpdatePin}
                            disabled={loadingPin || !pin}
                            className="bg-primary text-primary-foreground shrink-0"
                        >
                            {loadingPin && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Update PIN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
