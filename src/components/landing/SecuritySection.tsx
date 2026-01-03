"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, RefreshCw } from "lucide-react";

export function SecuritySection() {
    return (
        <section id="security" className="py-24 bg-zinc-950 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white">
                            Bank-Grade <span className="text-blue-500">Security</span>
                        </h2>
                        <p className="font-body text-xl text-zinc-400 max-w-2xl mx-auto">
                            We use state-of-the-art encryption and security protocols to ensure your assets and data remain uncompromised.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: End-to-End Encryption */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Lock className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-white mb-3">End-to-End Encryption</h3>
                        <p className="text-zinc-400 font-body leading-relaxed">
                            Every transaction is encrypted with AES-256 standards. Your financial data is unreadable to anyone but you.
                        </p>
                    </motion.div>

                    {/* Card 2: Real-time Monitoring */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Eye className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-white mb-3">24/7 Monitoring</h3>
                        <p className="text-zinc-400 font-body leading-relaxed">
                            Our automated systems monitor for suspicious activity around the clock, freezing potential threats instantly.
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            SYSTEM ACTIVE
                        </div>
                    </motion.div>

                    {/* Card 3: Secure Infrastructure */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Server className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-white mb-3">Redundant Infrastructure</h3>
                        <p className="text-zinc-400 font-body leading-relaxed">
                            Data is replicated across multiple secure servers globally, ensuring zero downtime and 100% data integrity.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
