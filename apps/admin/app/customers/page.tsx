"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Ban, Eye } from "lucide-react";
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { adminCustomers } from "@/lib/adminData";
import type { AdminCustomer } from "@aurum/shared/library";
import { DataTable, exportToCSV } from "@/components/admin/DataTable";

const columns: ColumnDef<AdminCustomer, unknown>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-primary text-xs font-semibold">{row.original.avatar}</span>
        </div>
        <div className="min-w-0">
          <p className="text-foreground font-medium truncate">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  { accessorKey: "orders", header: "Orders", cell: ({ row }) => <span className="text-foreground">{row.original.orders}</span> },
  { accessorKey: "totalSpent", header: "Total Spent", cell: ({ row }) => <span className="text-foreground font-medium">${row.original.totalSpent.toLocaleString()}</span> },
  { accessorKey: "joined", header: "Joined", cell: ({ row }) => <span className="text-muted-foreground">{row.original.joined}</span> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("capitalize text-xs", row.original.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20")}>{row.original.status}</Badge>
    ),
  },
];

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const columnsWithActions: ColumnDef<AdminCustomer, unknown>[] = [
    ...columns,
    {
      id: "actions",
      header: () => <span className="flex justify-end">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCustomer(row.original)}><Eye className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Ban className="w-3.5 h-3.5" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{adminCustomers.length} registered customers</p>
      </div>

      <DataTable
        columns={columnsWithActions}
        data={adminCustomers}
        searchPlaceholder="Search customers..."
        onExportCSV={() => exportToCSV(adminCustomers as unknown as Record<string, unknown>[], "customers", { name: "Name", email: "Email", orders: "Orders", totalSpent: "Total Spent", joined: "Joined", status: "Status" })}
      />

      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="font-display">Customer Details</DialogTitle></DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-primary text-lg font-semibold">{selectedCustomer.avatar}</span>
                </div>
                <div>
                  <p className="text-foreground text-lg font-medium">{selectedCustomer.name}</p>
                  <p className="text-muted-foreground">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-secondary/50">
                <div><p className="text-muted-foreground text-xs mb-1">Total Orders</p><p className="text-foreground text-lg font-semibold">{selectedCustomer.orders}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Total Spent</p><p className="text-foreground text-lg font-semibold">${selectedCustomer.totalSpent.toLocaleString()}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Member Since</p><p className="text-foreground">{selectedCustomer.joined}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Status</p><Badge variant="outline" className={cn("capitalize text-xs", selectedCustomer.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20")}>{selectedCustomer.status}</Badge></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1">View Orders</Button>
                <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10">{selectedCustomer.status === "active" ? "Block User" : "Unblock User"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
