import { Outlet } from "react-router-dom";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function SiteShell() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />
      <main className="relative flex min-h-screen flex-col pt-24">
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute -left-20 top-[-10%] h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
          <div className="absolute right-[-10%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-purple/20 blur-3xl" />
          <div className="absolute bottom-[-15%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex-1">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
