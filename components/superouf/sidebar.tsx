"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, ShoppingCart, TrendingUp, Lightbulb, Zap, Settings } from "lucide-react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/superouf",
        icon: LayoutDashboard,
    },
    {
        title: "Listes (US12)",
        href: "/superouf/lists",
        icon: ShoppingCart,
    },
    {
        title: "Top Produits (US13)",
        href: "/superouf/top-products",
        icon: TrendingUp,
    },
    {
        title: "Suggestions Promos (US14)",
        href: "/superouf/suggestions",
        icon: Lightbulb,
    },
    {
        title: "Stats Catégories (US15)",
        href: "/superouf/category-stats",
        icon: Users,
    },
    {
        title: "Paramètres",
        href: "/superouf/settings",
        icon: Settings,
    },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("pb-12 w-64 border-r min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-8 px-4">
                        <div className="p-2 bg-primary rounded-full shadow-lg shadow-primary/50">
                            <Zap className="h-5 w-5 text-primary-foreground" fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Super OUF
                        </h2>
                    </div>

                    <div className="space-y-2">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.href}
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start transition-all duration-200",
                                        "hover:bg-white/10 hover:text-white",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 font-medium translate-x-1"
                                            : "text-slate-400"
                                    )}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-slate-400 group-hover:text-white")} />
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <div className="px-7 mt-8">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <p className="text-xs text-slate-400 mb-2">Statut Système</p>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-green-400">Opérationnel</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
