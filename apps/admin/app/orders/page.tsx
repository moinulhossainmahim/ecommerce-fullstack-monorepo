"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { adminOrders } from "@/lib/adminData";
import type { AdminOrder } from "@aurum/shared/library";
import { DataTable, exportToCSV } from "@/components/admin/DataTable";

const statusOptions = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;
const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filtered = useMemo(() => (statusFilter === "all" ? adminOrders : adminOrders.filter((o) => o.status === statusFilter)), [statusFilter]);
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: adminOrders.length };
    adminOrders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, []);

  const columns: ColumnDef<AdminOrder, unknown>[] = [
    { accessorKey: "id", header: "Order", cell: ({ row }) => <span className="font-medium text-foreground">{row.original.id}</span> },
    { accessorKey: "customer", header: "Customer", cell: ({ row }) => <div><p className="text-foreground">{row.original.customer}</p><p className="text-xs text-muted-foreground">{row.original.email}</p></div> },
    { accessorKey: "date", header: "Date", cell: ({ row }) => <span className="text-muted-foreground">{row.original.date}</span> },
    { accessorKey: "items", header: "Items", cell: ({ row }) => <span className="text-muted-foreground">{row.original.items}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline" className={cn("capitalize text-xs", statusColor[row.original.status])}>{row.original.status}</Badge> },
    { accessorKey: "paymentMethod", header: "Payment", cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.paymentMethod}</span> },
    { accessorKey: "total", header: () => <span className="flex justify-end">Total</span>, cell: ({ row }) => <span className="flex justify-end text-foreground font-medium">${row.original.total.toLocaleString()}</span> },
    {
      id: "actions",
      header: () => <span className="flex justify-end">Action</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(row.original)}><Eye className="w-3.5 h-3.5" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{adminOrders.length} orders total</p>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search order ID or customer..."
        onExportCSV={() => exportToCSV(adminOrders as unknown as Record<string, unknown>[], "orders", { id: "Order ID", customer: "Customer", date: "Date", items: "Items", status: "Status", total: "Total", paymentMethod: "Payment" })}
        filterComponent={
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <Button key={status} variant="outline" size="sm" onClick={() => setStatusFilter(status)} className={cn("capitalize text-xs", statusFilter === status && "bg-primary/10 text-primary border-primary/30")}>
                {status} <span className="ml-1.5 text-muted-foreground">{statusCounts[status] || 0}</span>
              </Button>
            ))}
          </div>
        }
      />

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="font-display">Order {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground text-xs mb-1">Customer</p><p className="text-foreground">{selectedOrder.customer}</p><p className="text-xs text-muted-foreground">{selectedOrder.email}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Status</p><Badge variant="outline" className={cn("capitalize text-xs", statusColor[selectedOrder.status])}>{selectedOrder.status}</Badge></div>
                <div><p className="text-muted-foreground text-xs mb-1">Date</p><p className="text-foreground">{selectedOrder.date}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Payment</p><p className="text-foreground">{selectedOrder.paymentMethod}</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Items</p><p className="text-foreground">{selectedOrder.items} items</p></div>
                <div><p className="text-muted-foreground text-xs mb-1">Total</p><p className="text-foreground font-semibold">${selectedOrder.total.toLocaleString()}</p></div>
              </div>
              {selectedOrder.trackingNumber && (
                <div className="p-3 rounded-md bg-secondary/50">
                  <p className="text-muted-foreground text-xs mb-1">Tracking Number</p>
                  <p className="text-foreground font-mono text-xs">{selectedOrder.trackingNumber}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1">Update Status</Button>
                <Button size="sm" variant="outline" className="flex-1">Process Refund</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
