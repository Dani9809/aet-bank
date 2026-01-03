import Link from "next/link";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-white/10 pt-24 pb-12 text-zinc-400 text-sm font-body">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-lg" />
                            <span className="text-2xl font-bold font-heading tracking-tight text-white">
                                AET BANK
                            </span>
                        </Link>
                        <p className="max-w-sm text-zinc-500 leading-relaxed mb-8">
                            The world's most advanced virtual banking simulator.
                            Build your empire, manage assets, and secure your legacy in the digital economy.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-heading font-bold text-lg text-white mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#premium" className="hover:text-primary transition-colors">Premium</Link></li>
                            <li><Link href="#security" className="hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-heading font-bold text-lg text-white mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                    {/* <div>
                        <h3 className="font-heading font-bold text-lg text-white mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Licenses</Link></li>
                        </ul>
                    </div> */}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8">
                    <p className="font-mono text-xs text-zinc-600">© 2026 AET Banking System. All rights reserved.</p>
                    <div className="flex gap-8 mt-6 md:mt-0 text-xs font-mono text-zinc-600">
                        <span>AET_OS v2.0.4</span>
                        <span>STATUS: ONLINE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
