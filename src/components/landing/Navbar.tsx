"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {


    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const targetId = href.replace("#", "");
            const elem = document.getElementById(targetId);
            elem?.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container flex items-center justify-between h-20 px-4 md:px-6 2xl:px-0 mx-auto max-w-7xl 2xl:max-w-screen-xl">
                <Link href="/" className="flex items-center gap-2 z-50" onClick={scrollToTop}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg" />
                    <span className="text-2xl font-bold font-heading tracking-tight text-foreground">
                        AET BANK
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 items-center text-sm font-medium font-body text-muted-foreground uppercase tracking-widest">
                    <Link
                        href="#features"
                        className="hover:text-primary transition-colors"
                        onClick={(e) => handleScroll(e, "#features")}
                    >
                        Features
                    </Link>
                    <Link
                        href="#security"
                        className="hover:text-primary transition-colors"
                        onClick={(e) => handleScroll(e, "#security")}
                    >
                        Security
                    </Link>
                    <Link
                        href="#premium"
                        className="hover:text-primary transition-colors"
                        onClick={(e) => handleScroll(e, "#premium")}
                    >
                        Premium
                    </Link>

                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/auth/login" className="text-sm font-medium font-body text-muted-foreground hover:text-primary transition-colors hidden sm:block uppercase tracking-widest">
                        Sign In
                    </Link>
                    <Button variant="primary" size="sm" href="/auth/signup" className="bg-primary text-white hover:bg-primary/90">
                        Open Account
                    </Button>
                </div>


            </div>
        </nav>
    );
}
