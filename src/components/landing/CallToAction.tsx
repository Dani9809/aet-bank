"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CallToAction() {
    return (
        <section className="py-32 bg-foreground text-background relative overflow-hidden">
            {/* Background Pattern - Moving */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-50%] opacity-10 origin-center"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-7xl 2xl:text-8xl font-heading font-bold text-background mb-8">
                        Ready to Build Your <br />
                        <span className="text-accent">Virtual Empire?</span>
                    </h2>
                    <p className="text-lg md:text-2xl 2xl:text-3xl font-body text-background/80 mb-12 leading-relaxed max-w-2xl 2xl:max-w-4xl mx-auto">
                        Join the simulation. Compete with thousands of other players.
                        There is no risk, only the thrill of the deal.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block w-full sm:w-auto"
                    >
                        <Button href="/auth/signup" size="lg" variant="accent" className="w-full h-20 text-xl font-bold shadow-[0_0_30px_rgba(237,180,88,0.3)]">
                            Create Free Account
                        </Button>
                    </motion.div>

                    <p className="font-mono text-background/60 text-sm mt-8">
                        v2.0.1 (Stable) &bull; <span className="text-green-400">Servers Online</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
