"use client";

import { Input, Button, Label, Switch } from "@aurum/shared/ui";
import { Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your store settings</p>
      </div>
      <section className="glass-card rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-display font-medium text-foreground">Store Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Store Name</Label><Input defaultValue="Aurum" className="bg-secondary border-none" /></div>
          <div className="space-y-2"><Label>Store Email</Label><Input defaultValue="hello@aurum.com" className="bg-secondary border-none" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+1 (555) 123-4567" className="bg-secondary border-none" /></div>
          <div className="space-y-2"><Label>Address</Label><Input defaultValue="123 Luxury Ave, New York, NY" className="bg-secondary border-none" /></div>
        </div>
      </section>
      <section className="glass-card rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-display font-medium text-foreground">Payment Gateways</h2>
        <div className="space-y-4">
          {[
            { name: "Stripe", desc: "Credit/debit card payments", enabled: true },
            { name: "PayPal", desc: "PayPal checkout integration", enabled: true },
            { name: "Apple Pay", desc: "Apple Pay express checkout", enabled: false },
            { name: "Google Pay", desc: "Google Pay integration", enabled: false },
          ].map((gw) => (
            <div key={gw.name} className="flex items-center justify-between py-2">
              <div><p className="text-sm text-foreground font-medium">{gw.name}</p><p className="text-xs text-muted-foreground">{gw.desc}</p></div>
              <Switch defaultChecked={gw.enabled} />
            </div>
          ))}
        </div>
      </section>
      <section className="glass-card rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-display font-medium text-foreground">Email Notifications</h2>
        <div className="space-y-4">
          {[
            { name: "Order Confirmation", desc: "Send email when order is placed", enabled: true },
            { name: "Shipping Updates", desc: "Notify customers of shipping status", enabled: true },
            { name: "Promotional Emails", desc: "Marketing and promotional content", enabled: false },
            { name: "Review Requests", desc: "Ask customers to leave reviews", enabled: true },
            { name: "Low Stock Alerts", desc: "Notify admin when stock is low", enabled: true },
          ].map((notif) => (
            <div key={notif.name} className="flex items-center justify-between py-2">
              <div><p className="text-sm text-foreground font-medium">{notif.name}</p><p className="text-xs text-muted-foreground">{notif.desc}</p></div>
              <Switch defaultChecked={notif.enabled} />
            </div>
          ))}
        </div>
      </section>
      <section className="glass-card rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-display font-medium text-foreground">Tax & Currency</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Tax Rate (%)</Label><Input defaultValue="8.5" type="number" className="bg-secondary border-none" /></div>
          <div className="space-y-2"><Label>Currency</Label><Input defaultValue="USD ($)" className="bg-secondary border-none" /></div>
          <div className="space-y-2"><Label>Default Language</Label><Input defaultValue="English" className="bg-secondary border-none" /></div>
          <div className="space-y-2"><Label>Timezone</Label><Input defaultValue="EST (UTC-5)" className="bg-secondary border-none" /></div>
        </div>
      </section>
      <div className="flex justify-end">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><Save className="w-4 h-4 mr-2" /> Save Settings</Button>
      </div>
    </div>
  );
}
