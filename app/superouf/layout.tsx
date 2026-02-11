import { MobileNav } from "@/components/superouf/mobile-nav";

export default function SuperOUFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <MobileNav />
            {/* 
         MobileNav contains the Sidebar for both Mobile (hidden by default) and Desktop (static).
         Actually, MobileNav wraps the Sidebar logic better for response. 
         Wait, my MobileNav implementation renders Sidebar inside it. 
         So I don't need <Sidebar /> here directly if MobileNav handles the desktop static view too? 
         Let's check MobileNav implementation again: 
         It has `md:static` on the sidebar container, so yes it displays it on desktop too.
      */}
            <main className="flex-1 p-8 bg-slate-50/30">
                {children}
            </main>
        </div>
    );
}
