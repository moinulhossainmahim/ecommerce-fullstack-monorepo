"use client";

import { sonnerToast as toast } from "@aurum/shared/ui";

export default function AccountProfile() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Profile Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
            First Name
          </label>
          <input
            defaultValue="John"
            className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
            Last Name
          </label>
          <input
            defaultValue="Doe"
            className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
            Email
          </label>
          <input
            defaultValue="john@example.com"
            className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            onClick={() => toast.success("Profile updated!")}
            className="bg-primary text-primary-foreground px-8 py-3 text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
