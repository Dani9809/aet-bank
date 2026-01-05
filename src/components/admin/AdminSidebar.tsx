'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    GripVertical,
    Building2,
    DollarSign,
    Calculator,
    TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';


export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);


    // Sidebar Resize State
    const [sidebarWidth, setSidebarWidth] = useState(250); // Default w-72 (18rem * 16px)
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);

    const routes = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
            color: 'text-sky-500',
        },
        {
            label: 'Accounts',
            icon: Users,
            href: '/admin/accounts',
            color: 'text-violet-500',
        },
        {
            label: 'Businesses',
            icon: Building2,
            href: '/admin/businesses',
            color: 'text-blue-500',
        },
        {
            label: 'Assets',
            icon: DollarSign,
            href: '/admin/assets',
            color: 'text-indigo-500',
        },
        {
            label: 'Investments',
            icon: TrendingUp,
            href: '/admin/investments',
            color: 'text-emerald-500',
        },
        {
            label: 'Taxes',
            icon: Calculator,
            href: '/admin/taxes',
            color: 'text-zinc-500',
        },
        {
            label: 'Settings',
            icon: Settings,
            href: '/admin/settings',
            color: 'text-gray-500',
        },
    ];

    const toggleCollapse = () => {
        if (collapsed) {
            // If uncollapsing, restore to at least default width if it was too small
            if (sidebarWidth < 200) setSidebarWidth(250);
        }
        setCollapsed(!collapsed);
    };

    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            let newWidth = e.clientX;
            // Constraints
            if (newWidth < 80) newWidth = 80;
            if (newWidth > 480) newWidth = 480;

            setSidebarWidth(newWidth);

            // Auto collapse/expand based on width
            if (newWidth < 120 && !collapsed) {
                setCollapsed(true);
            } else if (newWidth > 120 && collapsed) {
                setCollapsed(false);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, collapsed]);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                ref={sidebarRef}
                className={cn(
                    "hidden md:flex fixed md:sticky top-0 left-0 h-full bg-card border-r border-border flex-col z-40 transition-all duration-75 ease-linear",
                    isResizing ? "transition-none select-none" : ""
                )}
                style={{ width: collapsed ? 80 : sidebarWidth }}
            >
                <div className="p-4 flex items-center justify-between overflow-hidden">
                    <div className={cn("flex items-center gap-2 overflow-hidden transition-all duration-300", collapsed && "w-0 opacity-0")}>
                        <div className="w-8 h-8 min-w-[32px] rounded-lg bg-primary/20 flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-xl font-bold font-heading tracking-tight whitespace-nowrap">
                            AET Admin
                        </h1>
                    </div>

                    {/* Collapse Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapse}
                        className={cn("text-muted-foreground hover:text-foreground shrink-0 cursor-pointer", collapsed && "mx-auto")}
                    >
                        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full font-medium cursor-pointer rounded-lg transition-all",
                                pathname === route.href
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                collapsed ? "justify-center" : "justify-start"
                            )}
                            title={collapsed ? route.label : undefined}
                        >
                            <div className={cn("flex items-center", collapsed ? "justify-center" : "flex-1")}>
                                <route.icon className={cn("h-5 w-5 transition-all shrink-0", route.color, !collapsed && "mr-3")} />
                                <span className={cn("whitespace-nowrap overflow-hidden transition-all duration-200", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                                    {route.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>


                {/* Resize Handle */}
                <div
                    className="absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-primary/50 group flex items-center justify-center z-50 transition-colors"
                    onMouseDown={startResizing}
                >
                    <div className="h-8 w-4 bg-card border border-border rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity absolute right-[-8px]">
                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                    </div>
                </div>
            </aside>

            {/* Mobile Hamburger Trigger (Visible only on mobile) */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)} className="bg-card/50 backdrop-blur border-border shadow-sm">
                    <Menu className="h-5 w-5" />
                </Button>
            </div>



            {/* Mobile Sidebar Overlay with Smooth Animation */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Sidebar Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-card border-l border-border shadow-2xl p-4 flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 px-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <LayoutDashboard className="w-5 h-5 text-primary" />
                                    </div>
                                    <h1 className="text-xl font-bold font-heading tracking-tight">
                                        AET Admin
                                    </h1>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="flex-1 space-y-1">
                                {routes.map((route) => (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all",
                                            pathname === route.href
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        )}
                                    >
                                        <div className="flex items-center flex-1">
                                            <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                                            {route.label}
                                        </div>
                                    </Link>
                                ))}
                            </div>


                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
