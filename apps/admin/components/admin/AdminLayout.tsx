"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Tag, Truck, Star, Ticket, CreditCard, FileText, Bell, Search, Menu, LogOut } from "lucide-react";
import { cn } from "@aurum/shared/library";
import { Button, Input } from "@aurum/shared/ui";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Customers", icon: Users, path: "/customers" },
  { label: "Categories", icon: Tag, path: "/categories" },
  { label: "Inventory", icon: Package, path: "/inventory" },
  { label: "Reviews", icon: Star, path: "/reviews" },
  { label: "Coupons", icon: Ticket, path: "/coupons" },
  { label: "Payments", icon: CreditCard, path: "/payments" },
  { label: "Shipping", icon: Truck, path: "/shipping" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Content", icon: FileText, path: "/content" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center"><span className="text-primary-foreground font-display font-bold text-sm">A</span></div>
          {sidebarOpen && <span className="font-display font-semibold text-foreground tracking-wider text-lg">AURUM</span>}
        </Link>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors", isActive(item.path) ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
            <item.icon className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <a href="http://localhost:3000" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <LogOut className="w-4 h-4" />
          {sidebarOpen && <span>Back to Store</span>}
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={cn("hidden md:flex flex-col border-r border-border bg-card shrink-0", sidebarOpen ? "w-60" : "w-16")}>
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-card border-r border-border z-10"><SidebarContent /></aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu className="w-5 h-5" /></Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64 bg-secondary border-none h-9 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-primary text-xs font-semibold">AD</span></div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">admin@aurum.com</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
