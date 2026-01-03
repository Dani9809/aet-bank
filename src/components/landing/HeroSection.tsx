"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function HeroSection() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
            {/* Organic Background Blobs - Animated */}
            <div className="absolute inset-0 z-0 opacity-40">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary rounded-full blur-[120px] mix-blend-multiply"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/40 rounded-full blur-[120px] mix-blend-multiply"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/40 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 mx-auto text-center max-w-5xl flex flex-col items-center">

                {/* Game Stats Ticker */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-muted bg-white/50 px-4 py-1.5 text-sm font-mono text-muted-foreground backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    System Status: ONLINE | Active Players: 12,402
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col items-center"
                >
                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-8xl 2xl:text-9xl font-bold font-heading tracking-tight text-foreground mb-6"
                    >
                        The Ultimate <br />
                        <span className="text-primary italic">
                            Banking Simulator.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg md:text-2xl 2xl:text-3xl font-body text-muted-foreground mb-10 max-w-2xl 2xl:max-w-4xl mx-auto leading-relaxed"
                    >
                        Master the art of wealth management in a hyper-realistic virtual economy.
                        Climb the leaderboards, manage assets, and build your empire.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center w-full"
                    >
                        <Button href="/auth/signup" size="lg" className="w-full sm:w-auto text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                            Start Your Empire
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto text-lg border-muted-foreground text-foreground hover:scale-105 transition-transform duration-300"
                            onClick={() => toast.info("Coming Soon", {
                                description: "We are currently finishing up the trailer. Stay tuned!",
                                duration: 3000,
                            })}
                            title="Coming Soon"
                        >
                            Watch Trailer
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Abstract Card Visual - 3D Tilt Effect */}
                <motion.div
                    className="mt-20 w-full max-w-4xl relative perspective-1000"
                    initial={{ opacity: 0, rotateX: 20, scale: 0.9 }}
                    animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1.2, type: "spring" }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="relative rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md aspect-[16/9] shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Dashboard Simulation UI */}
                        <div className="absolute top-0 left-0 right-0 h-14 border-b border-white/20 flex items-center justify-between px-6 bg-white/20">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="font-mono text-xs text-muted-foreground/70">AET_OS v2.0</div>
                        </div>

                        <div className="p-10 flex flex-col justify-center items-center h-full gap-6">
                            <div className="text-center">
                                <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-2">Total Virtual Balance</div>
                                <div className="text-5xl md:text-7xl font-heading font-bold text-foreground">$12,450,920.00</div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-8 opacity-60">
                                <div className="h-2 bg-foreground/10 rounded-full w-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "70%" }}
                                        transition={{ delay: 1.5, duration: 1 }}
                                    />
                                </div>
                                <div className="h-2 bg-foreground/10 rounded-full w-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-secondary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "45%" }}
                                        transition={{ delay: 1.7, duration: 1 }}
                                    />
                                </div>
                                <div className="h-2 bg-foreground/10 rounded-full w-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "90%" }}
                                        transition={{ delay: 1.9, duration: 1 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
