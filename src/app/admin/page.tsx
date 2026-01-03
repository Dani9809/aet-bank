'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminSignupForm from '@/components/admin/AdminSignupForm';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative font-body overflow-y-auto">
            {/* Back Button */}
            <Link href="/" className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center text-muted-foreground hover:text-primary transition-colors z-50 group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Home</span>
            </Link>
            {/* Background Elements - Subtle organic shapes for Earthy Luxury feel */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-heading">
                        Admin Portal
                    </h1>
                    <p className="text-muted-foreground text-sm tracking-wide">SECURE ACCESS FOR ADMINISTRATORS</p>
                </div>

                {/* Tabs - Styled with border and muted colors */}
                <div className="flex bg-card/50 p-1.5 rounded-xl border border-border backdrop-blur-md relative shadow-sm">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all relative z-10 ${activeTab === 'login'
                            ? 'text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {activeTab === 'login' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary rounded-lg shadow-md"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10">Sign In</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all relative z-10 ${activeTab === 'signup'
                            ? 'text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {activeTab === 'signup' && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-primary rounded-lg shadow-md"
                                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <span className="relative z-10">Register</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'login' ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AdminLoginForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AdminSignupForm onSuccess={() => setActiveTab('login')} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
