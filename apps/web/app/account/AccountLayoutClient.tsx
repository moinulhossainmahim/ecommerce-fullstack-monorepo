"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, LogIn } from "lucide-react";
import { sonnerToast as toast } from "@aurum/shared/ui";
import StoreFooter from "@/components/StoreFooter";

const tabs = [
  { id: "profile", label: "Profile", icon: User, href: "/account" },
  { id: "orders", label: "Orders", icon: Package, href: "/account/orders" },
  { id: "wishlist", label: "Wishlist", icon: Heart, href: "/account/wishlist" },
  { id: "addresses", label: "Addresses", icon: MapPin, href: "/account/addresses" },
];

export default function AccountLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupMode, setSignupMode] = useState(false);

  if (!isLoggedIn) {
    return (
      <>
        <div className="container py-20 max-w-md mx-auto min-h-[60vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-bold text-center mb-2">
              {signupMode ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {signupMode ? "Join Aurum for exclusive access" : "Sign in to your account"}
            </p>

            <div className="space-y-4">
              {signupMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                      First Name
                    </label>
                    <input
                      className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  toast.success(signupMode ? "Account created!" : "Welcome back!");
                }}
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
              >
                {signupMode ? "Create Account" : "Sign In"}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                {signupMode ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setSignupMode(!signupMode)}
                  className="text-primary underline"
                >
                  {signupMode ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
        <StoreFooter />
      </>
    );
  }

  return (
    <>
      <div className="container py-12 min-h-[60vh]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold mb-10"
        >
          My Account
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-colors ${
                    (tab.href === "/account" && pathname === "/account") ||
                    (tab.href !== "/account" && pathname.startsWith(tab.href))
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  toast("Signed out");
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground w-full text-left"
              >
                <LogIn className="h-4 w-4" /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <StoreFooter />
    </>
  );
}
