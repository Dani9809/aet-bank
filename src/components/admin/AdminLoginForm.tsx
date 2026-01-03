'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { loginAdmin, verifyAdminPin } from '@/actions/adminActions'; // Need to export verifyAdminPin
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Step 1: Account Info (Prompt required)
const Step1Schema = z.object({
    account_fname: z.string().min(1, "First name is required"),
    account_lname: z.string().min(1, "Last name is required"),
    account_address: z.string().min(1, "Address is required"),
    account_email: z.string().email("Invalid email"),
});

// Step 2: Credentials
const Step2Schema = z.object({
    account_uname: z.string().min(1, "Username is required"),
    account_pword: z.string().min(1, "Password is required"),
});

// Step 3: PIN (Single field)
const PinSchema = z.object({
    account_pin: z.string().length(6, "PIN must be 6 digits"),
});

export default function AdminLoginForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const router = useRouter();

    // We use separate forms or just one big form? One big form state is easier to keep track.
    // But validation differs per step.
    const { register, trigger, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(step === 1 ? Step1Schema : (showPinModal ? PinSchema : Step2Schema)) as any,
        mode: 'onBlur',
        defaultValues: {
            account_fname: '',
            account_lname: '',
            account_address: '',
            account_email: '',
            account_uname: '',
            account_pword: '',
            account_pin: ''
        }
    });

    const pinValue = watch('account_pin');

    useEffect(() => {
        if (showPinModal && pinValue?.length === 6) {
            handleSubmit(handlePinSubmit)();
        }
    }, [pinValue, showPinModal, handleSubmit]);

    const handleNext = async () => {
        const valid = await trigger(['account_fname', 'account_lname', 'account_address', 'account_email']);
        if (valid) {
            setStep(2);
        }
    };

    const handleLoginAttempt = async (data: any) => {
        setIsLoading(true);
        // Construct FormData for the server action
        const formData = new FormData();
        formData.append('account_uname', data.account_uname);
        formData.append('account_pword', data.account_pword);

        try {
            const res = await loginAdmin(null, formData);
            if (res.success && res.requirePin) {
                setUserId(res.userId);
                setShowPinModal(true);
            } else {
                toast.error(res.error || "Login failed");
            }
        } catch (e) {
            toast.error("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinSubmit = async (data: any) => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const res = await verifyAdminPin(userId, data.account_pin);
            if (res.success) {
                toast.success("Login Successful!");
                router.push('/admin/dashboard'); // Assuming dashboard
            } else {
                toast.error(res.error || "Invalid PIN");
            }
        } catch (e) {
            toast.error("Error verifying PIN");
        } finally {
            setIsLoading(false);
        }
    };

    // Wrapper for form submit to route to correct handler
    const onFormSubmit = (data: any) => {
        if (showPinModal) {
            handlePinSubmit(data);
        } else {
            handleLoginAttempt(data);
        }
    };

    return (
        <>
            <div className="space-y-6 w-full max-w-md mx-auto p-5 md:p-8 bg-card/60 border border-border rounded-xl backdrop-blur-md shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-primary font-heading">
                        {step === 1 ? 'Verify Identity' : 'Admin Credentials'}
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">Step {step}/2</span>
                </div>

                <form onSubmit={handleSubmit(step === 1 ? handleNext : onFormSubmit)} className="space-y-5">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">First Name</label>
                                <input {...register('account_fname')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="Admin First Name" />
                                {errors.account_fname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_fname.message?.toString()}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Last Name</label>
                                <input {...register('account_lname')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="Admin Last Name" />
                                {errors.account_lname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_lname.message?.toString()}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Address</label>
                                <input {...register('account_address')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="Business Address" />
                                {errors.account_address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_address.message?.toString()}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Email</label>
                                <input {...register('account_email')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="admin@aetbank.com" />
                                {errors.account_email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_email.message?.toString()}</p>}
                            </div>
                            <Button type="button" onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 mt-4 shadow-lg shadow-primary/20">Next Step</Button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Username</label>
                                <input {...register('account_uname')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="Admin Username" />
                                {errors.account_uname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_uname.message?.toString()}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} {...register('account_pword')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none pr-10 placeholder:text-muted-foreground/50 shadow-sm" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-[40%] text-muted-foreground hover:text-foreground transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.account_pword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_pword.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-muted text-muted-foreground hover:bg-secondary/20 hover:text-foreground">Back</Button>
                                <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                    {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                    Proceed to PIN
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </form>
            </div>

            {/* PIN Confirmation Modal */}
            <AnimatePresence>
                {showPinModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-secondary-foreground/40 flex items-center justify-center z-50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-card border border-border p-6 md:p-8 rounded-2xl w-full max-w-sm relative shadow-2xl"
                        >
                            <button onClick={() => setShowPinModal(false)} className="absolute right-4 top-4 text-muted-foreground hover:text-destructive transition-colors">
                                <X size={20} />
                            </button>
                            <h3 className="text-2xl font-bold text-foreground mb-2 text-center font-heading">Security Check</h3>
                            <p className="text-muted-foreground text-sm mb-8 text-center px-4">Enter your 6-digit secure PIN to confirm access.</p>

                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <input
                                        type="password"
                                        maxLength={6}
                                        {...register('account_pin')}
                                        className="bg-background border-b-2 border-muted focus:border-primary rounded-t-lg p-4 text-center text-3xl tracking-[0.5em] w-full outline-none font-mono text-foreground transition-all placeholder:text-muted/20"
                                        placeholder="••••••"
                                        autoFocus
                                    />
                                </div>
                                {errors.account_pin && <p className="text-red-500 text-xs text-center font-medium">{errors.account_pin.message?.toString()}</p>}

                                <Button onClick={handleSubmit(handlePinSubmit)} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg shadow-xl shadow-primary/20">
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify PIN"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
