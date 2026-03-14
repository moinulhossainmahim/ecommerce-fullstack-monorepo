"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Globe } from "lucide-react";
import { Button, Input, Badge, Label, Switch, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";

interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  methods: { name: string; cost: number; estimatedDays: string; enabled: boolean }[];
  enabled: boolean;
}

const mockZones: ShippingZone[] = [
  { id: "z1", name: "Domestic (US)", enabled: true, regions: ["United States"], methods: [{ name: "Standard Shipping", cost: 9.99, estimatedDays: "5-7 days", enabled: true }, { name: "Express Shipping", cost: 19.99, estimatedDays: "2-3 days", enabled: true }, { name: "Overnight", cost: 39.99, estimatedDays: "1 day", enabled: true }] },
  { id: "z2", name: "Europe", enabled: true, regions: ["UK", "France", "Germany", "Italy", "Spain"], methods: [{ name: "International Standard", cost: 24.99, estimatedDays: "7-14 days", enabled: true }, { name: "International Express", cost: 49.99, estimatedDays: "3-5 days", enabled: true }] },
  { id: "z3", name: "Asia Pacific", enabled: true, regions: ["Japan", "South Korea", "Australia", "Singapore"], methods: [{ name: "International Standard", cost: 29.99, estimatedDays: "10-18 days", enabled: true }, { name: "International Express", cost: 59.99, estimatedDays: "5-7 days", enabled: false }] },
  { id: "z4", name: "Rest of World", enabled: false, regions: ["All other countries"], methods: [{ name: "International Standard", cost: 34.99, estimatedDays: "14-21 days", enabled: true }] },
];

export default function Shipping() {
  const [zones, setZones] = useState(mockZones);
  const [showModal, setShowModal] = useState(false);
  const toggleZone = (id: string) => setZones((prev) => prev.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Shipping</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure shipping zones and delivery methods</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Zone</Button>
      </div>
      <div className="space-y-4">
        {zones.map((zone) => (
          <div key={zone.id} className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-foreground font-medium">{zone.name}</p>
                  <p className="text-xs text-muted-foreground">{zone.regions.join(", ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={zone.enabled} onCheckedChange={() => toggleZone(zone.id)} />
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs">
                    <th className="text-left font-medium pb-2">Method</th>
                    <th className="text-left font-medium pb-2">Cost</th>
                    <th className="text-left font-medium pb-2">Est. Delivery</th>
                    <th className="text-right font-medium pb-2">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {zone.methods.map((method, i) => (
                    <tr key={i} className="border-t border-border/30">
                      <td className="py-2 text-foreground">{method.name}</td>
                      <td className="py-2 text-foreground">${method.cost}</td>
                      <td className="py-2 text-muted-foreground">{method.estimatedDays}</td>
                      <td className="py-2 text-right">
                        <Badge variant="outline" className={cn("text-xs", method.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "text-muted-foreground border-border")}>{method.enabled ? "Active" : "Off"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="font-display">Add Shipping Zone</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Zone Name</Label><Input placeholder="e.g., South America" className="bg-secondary border-none" /></div>
            <div className="space-y-2"><Label>Regions (comma-separated)</Label><Input placeholder="Brazil, Argentina, Chile" className="bg-secondary border-none" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
