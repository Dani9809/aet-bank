"use client"; // Needs to be client for framer-motion

import { Shield, TrendingUp, Trophy, Globe } from "lucide-react";
import { motion, Variants } from "framer-motion";

const features = [
    {
        title: "Realistic Economy",
        description: "Experience a living, breathing market. Prices fluctuate based on player actions and global events.",
        icon: TrendingUp,
    },
    {
        title: "Competitive Ranking",
        description: "Fight for your spot on the global leaderboard. Only the wealthiest 1% earn the Black Card.",
        icon: Trophy,
    },
    {
        title: "Secure Progress",
        description: "Your empire is safe. Our military-grade encryption ensures your game data is never lost.",
        icon: Shield,
    },
    {
        title: "Global Events",
        description: "Participate in limited-time financial events to earn exclusive rewards and assets.",
        icon: Globe,
    },
];

export function FeaturesSection() {
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <section id="features" className="py-32 bg-secondary/10 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-foreground">
                            More Than Just <span className="text-primary italic">Numbers</span>
                        </h2>
                        <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
                            Dive into deep game mechanics designed to test your financial strategy and management skills.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:gap-12 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className="group p-8 rounded-3xl border border-muted bg-white/50 relative hover:bg-white transition-colors hover:shadow-xl flex flex-col items-start"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center mb-6 text-primary-foreground group-hover:scale-110 transition-transform">
                                <feature.icon className="w-7 h-7 text-secondary-foreground" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold mb-3 text-foreground">{feature.title}</h3>
                            <p className="font-body text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decoration */}
                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
