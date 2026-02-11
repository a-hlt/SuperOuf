"use client";

import { useState } from "react";
import { Sidebar } from "@/components/superouf/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-gradient-to-r from-slate-900 to-slate-800 text-white z-40 px-4 flex items-center justify-between shadow-md">
                <span className="font-bold text-lg flex items-center gap-2">
                    <span className="p-1 bg-primary rounded-full">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-primary-foreground"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    </span>
                    Super OUF
                </span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-white hover:bg-white/10 hover:text-white">
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Spacer for fixed header on mobile */}
            <div className="md:hidden h-16" />

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-out Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
        ${isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"}
      `}>
                {isOpen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 md:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                <Sidebar className="h-full border-r-0" />
            </div>
        </>
    );
}
