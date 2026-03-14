"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { Button, Input, Label, Switch, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aurum/shared/ui";
import { DataTable, exportToCSV } from "@/components/admin/DataTable";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  enabled: boolean;
  minOrder: number;
}

const mockCoupons: Coupon[] = [
  { id: "c1", code: "LUXURY20", type: "percentage", value: 20, usageLimit: 100, usedCount: 47, expiryDate: "2026-04-30", enabled: true, minOrder: 200 },
  { id: "c2", code: "WELCOME50", type: "fixed", value: 50, usageLimit: 500, usedCount: 312, expiryDate: "2026-06-30", enabled: true, minOrder: 100 },
  { id: "c3", code: "VIP15", type: "percentage", value: 15, usageLimit: 50, usedCount: 50, expiryDate: "2026-03-15", enabled: false, minOrder: 500 },
  { id: "c4", code: "SPRING10", type: "percentage", value: 10, usageLimit: 200, usedCount: 89, expiryDate: "2026-05-31", enabled: true, minOrder: 0 },
  { id: "c5", code: "FREESHIP", type: "fixed", value: 25, usageLimit: 1000, usedCount: 678, expiryDate: "2026-12-31", enabled: true, minOrder: 150 },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [showModal, setShowModal] = useState(false);
  const toggleCoupon = (id: string) => setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  const columns: ColumnDef<Coupon, unknown>[] = [
    { accessorKey: "code", header: "Code", cell: ({ row }) => <div className="flex items-center gap-2"><span className="font-mono text-foreground font-medium">{row.original.code}</span><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(row.original.code)}><Copy className="w-3 h-3" /></Button></div> },
    { accessorKey: "value", header: "Discount", cell: ({ row }) => <span className="text-foreground">{row.original.type === "percentage" ? `${row.original.value}%` : `$${row.original.value}`}</span> },
    { accessorKey: "usedCount", header: "Usage", cell: ({ row }) => <span className="text-muted-foreground">{row.original.usedCount} / {row.original.usageLimit}</span> },
    { accessorKey: "minOrder", header: "Min Order", cell: ({ row }) => <span className="text-muted-foreground">{row.original.minOrder > 0 ? `$${row.original.minOrder}` : "None"}</span> },
    { accessorKey: "expiryDate", header: "Expires", cell: ({ row }) => <span className="text-muted-foreground">{row.original.expiryDate}</span> },
    { accessorKey: "enabled", header: "Status", cell: ({ row }) => <Switch checked={row.original.enabled} onCheckedChange={() => toggleCoupon(row.original.id)} /> },
    { id: "actions", header: () => <span className="flex justify-end">Actions</span>, cell: () => <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></div> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Coupons & Discounts</h1>
          <p className="text-sm text-muted-foreground mt-1">{coupons.length} discount codes</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Create Coupon</Button>
      </div>
      <DataTable columns={columns} data={coupons} searchPlaceholder="Search coupon codes..." onExportCSV={() => exportToCSV(coupons as unknown as Record<string, unknown>[], "coupons", { code: "Code", type: "Type", value: "Value", usedCount: "Used", usageLimit: "Limit", expiryDate: "Expires", enabled: "Active" })} />
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="font-display">Create Coupon</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Coupon Code</Label><Input placeholder="e.g., SAVE20" className="bg-secondary border-none font-mono" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Discount Type</Label><Input defaultValue="Percentage" className="bg-secondary border-none" /></div><div className="space-y-2"><Label>Value</Label><Input type="number" placeholder="20" className="bg-secondary border-none" /></div></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Usage Limit</Label><Input type="number" placeholder="100" className="bg-secondary border-none" /></div><div className="space-y-2"><Label>Min Order ($)</Label><Input type="number" placeholder="0" className="bg-secondary border-none" /></div></div>
            <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" className="bg-secondary border-none" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
