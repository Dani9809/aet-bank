"use client";

import { motion } from "framer-motion";
import { Check, Star, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
    {
        title: "Zero Transaction Fees",
        description: "Keep 100% of your earnings. No hidden costs or transfer fees.",
        icon: Zap,
    },
    {
        title: "Priority Concierge",
        description: "24/7 dedicated support team access for all your financial needs.",
        icon: Crown,
    },
    {
        title: "Exclusive Rates",
        description: "Access higher interest rates on your savings and investments.",
        icon: Star,
    },
];

export function PremiumSection() {
    return (
        <section id="premium" className="py-24 bg-gradient-to-b from-black via-zinc-900 to-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-amber-100">The Black Card Membership</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                            Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Ultimate</span> Status
                        </h2>

                        <p className="font-body text-xl text-zinc-400 mb-10 leading-relaxed max-w-lg">
                            Join the elite 1%. The Black Card isn't just a payment method—it's a statement of power, granting access to privileges reserved for the few.
                        </p>

                        <div className="space-y-6 mb-10">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                        <benefit.icon className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold font-heading text-white">{benefit.title}</h4>
                                        <p className="text-zinc-500 font-body text-sm select-none">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-14 px-8 rounded-full">
                            Apply for Membership
                        </Button>
                    </motion.div>

                    {/* Card Visual */}
                    <div className="relative perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotateY: -15, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                            whileHover={{ rotateY: 0, scale: 1.05 }}
                            className="w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl relative overflow-hidden bg-gradient-to-br from-zinc-800 to-black border border-white/10 shadow-2xl group cursor-pointer"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Card Texture */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                            {/* Card Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-8 rounded bg-gradient-to-r from-amber-200 to-yellow-600 opacity-80" />
                                    <Crown className="w-8 h-8 text-white/80" />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-2xl font-mono text-white/80 tracking-widest">
                                        •••• •••• •••• 1092
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Card Holder</div>
                                            <div className="text-sm font-medium text-white tracking-wide">ALEXANDER PIERCE</div>
                                        </div>
                                        <div className="text-xl font-bold italic text-white/90">AET</div>
                                    </div>
                                </div>
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                        </motion.div>

                        {/* Floating elements backdrop */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/20 rounded-full blur-xl"
                        />
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
