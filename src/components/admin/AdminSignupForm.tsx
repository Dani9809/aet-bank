'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { signupAdmin, checkEmailUnique, checkUsernameUnique } from '@/actions/adminActions';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Schema for Step 1
const Step1Schema = z.object({
    account_fname: z.string().min(1, "First name is required"),
    account_lname: z.string().min(1, "Last name is required"),
    account_address: z.string().min(1, "Address is required"),
    account_email: z.string().email("Invalid email"),
});

// Schema for Step 2
const Step2Schema = z.object({
    account_uname: z.string().min(4, "Username must be at least 4 chars"),
    account_pword: z.string().min(6, "Password must be at least 6 chars"),
    confirm_pword: z.string(),
    account_pin: z.string().length(6, "PIN must be exactly 6 digits"),
    confirm_pin: z.string(),
}).refine((data) => data.account_pword === data.confirm_pword, {
    message: "Passwords do not match",
    path: ["confirm_pword"],
}).refine((data) => data.account_pin === data.confirm_pin, {
    message: "PINs do not match",
    path: ["confirm_pin"],
});

// Combined Schema for final submission
const FinalSchema = Step1Schema.merge(Step2Schema);
type FormData = z.infer<typeof FinalSchema>;

interface AdminSignupFormProps {
    onSuccess?: () => void;
}

export default function AdminSignupForm({ onSuccess }: AdminSignupFormProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const { register, trigger, getValues, reset, formState: { errors }, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(step === 1 ? Step1Schema : FinalSchema) as any,
        mode: 'onBlur',
    });

    // Handle countdown effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSuccess && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (isSuccess && countdown === 0) {
            if (onSuccess) onSuccess();
            // Optional: Reset form execution state if needed, though unmount usually handles it
            setIsSuccess(false);
            setStep(1);
            reset();
        }
        return () => clearInterval(timer);
    }, [isSuccess, countdown, onSuccess, reset]);

    const handleNext = async () => {
        const valid = await trigger(['account_fname', 'account_lname', 'account_address', 'account_email']);
        if (valid) {
            const email = getValues('account_email');
            const isUnique = await checkEmailUnique(email);
            if (!isUnique) {
                toast.error("Email is already registered");
                return;
            }
            setStep(2);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const isUserUnique = await checkUsernameUnique(data.account_uname);
            if (!isUserUnique) {
                toast.error("Username is already taken");
                setIsLoading(false);
                return;
            }

            const res = await signupAdmin(data);
            if (res.success) {
                toast.success("Admin account created successfully!");
                setIsSuccess(true);
            } else {
                toast.error(res.error || "Signup failed");
            }
        } catch (e) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-6 bg-card/60 border border-border p-8 rounded-xl backdrop-blur-md shadow-lg min-h-[400px]"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <CheckCircle2 size={80} className="text-primary relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-foreground font-heading">Account Created!</h3>
                    <p className="text-muted-foreground">Redirecting to login in...</p>
                </div>
                <div className="text-4xl font-bold text-primary font-mono">{countdown}</div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-md mx-auto p-5 md:p-8 bg-card/60 border border-border rounded-xl backdrop-blur-md shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h2 className="text-xl md:text-2xl font-bold text-primary font-heading">
                    {step === 1 ? 'Personal Information' : 'Account Credentials'}
                </h2>
                <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">Step {step}/2</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">First Name</label>
                            <input {...register('account_fname')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="John" />
                            {errors.account_fname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_fname.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Last Name</label>
                            <input {...register('account_lname')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="Doe" />
                            {errors.account_lname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_lname.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Address</label>
                            <input {...register('account_address')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="123 Main St" />
                            {errors.account_address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_address.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Email</label>
                            <input {...register('account_email')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="john@example.com" />
                            {errors.account_email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_email.message}</p>}
                        </div>
                        <Button type="button" onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 mt-4 shadow-lg shadow-primary/20">Next Step</Button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Username</label>
                            <input {...register('account_uname')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="johndoe" />
                            {errors.account_uname && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_uname.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} {...register('account_pword')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none pr-10 placeholder:text-muted-foreground/50 shadow-sm" placeholder="••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-[40%] text-muted-foreground hover:text-foreground transition-colors">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.account_pword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_pword.message}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Confirm Password</label>
                                <input type={showPassword ? "text" : "password"} {...register('confirm_pword')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="••••••" />
                                {errors.confirm_pword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirm_pword.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">PIN (6 Digits)</label>
                                <div className="relative">
                                    <input type={showPin ? "text" : "password"} maxLength={6} {...register('account_pin')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none pr-10 placeholder:text-muted-foreground/50 shadow-sm" placeholder="••••••" />
                                    <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-[40%] text-muted-foreground hover:text-foreground transition-colors">
                                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.account_pin && <p className="text-red-500 text-xs mt-1 ml-1">{errors.account_pin.message}</p>}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-foreground/80 mb-1.5 ml-1">Confirm PIN</label>
                                <input type={showPin ? "text" : "password"} maxLength={6} {...register('confirm_pin')} className="w-full bg-background/50 border border-muted focus:border-primary rounded-lg p-3 text-sm transition-all outline-none placeholder:text-muted-foreground/50 shadow-sm" placeholder="••••••" />
                                {errors.confirm_pin && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirm_pin.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-muted text-muted-foreground hover:bg-secondary/20 hover:text-foreground">Back</Button>
                            <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                Create Account
                            </Button>
                        </div>
                    </motion.div>
                )}
            </form>
        </div>
    );
}
