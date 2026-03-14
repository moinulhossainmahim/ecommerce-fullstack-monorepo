"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge, Button } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { DataTable, exportToCSV } from "@/components/admin/DataTable";

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "refunded" | "failed";
  date: string;
}

const transactions: Transaction[] = [
  { id: "TXN-9001", orderId: "ORD-7291", customer: "Victoria Laurent", amount: 2840, method: "Visa •••• 4242", status: "completed", date: "2026-03-12" },
  { id: "TXN-9002", orderId: "ORD-7290", customer: "Alexander Chen", amount: 890, method: "PayPal", status: "completed", date: "2026-03-12" },
  { id: "TXN-9003", orderId: "ORD-7289", customer: "Sophia Blackwood", amount: 1650, method: "Visa •••• 1234", status: "pending", date: "2026-03-11" },
  { id: "TXN-9004", orderId: "ORD-7288", customer: "James Moretti", amount: 3420, method: "Apple Pay", status: "completed", date: "2026-03-11" },
  { id: "TXN-9005", orderId: "ORD-7287", customer: "Elena Vasquez", amount: 560, method: "Visa •••• 5678", status: "refunded", date: "2026-03-10" },
  { id: "TXN-9006", orderId: "ORD-7286", customer: "Marcus Webb", amount: 1780, method: "Mastercard •••• 9876", status: "completed", date: "2026-03-10" },
  { id: "TXN-9007", orderId: "ORD-7285", customer: "Isabelle Fontaine", amount: 4200, method: "PayPal", status: "completed", date: "2026-03-09" },
  { id: "TXN-9008", orderId: "ORD-7283", customer: "Charlotte Dubois", amount: 5890, method: "Amex •••• 3456", status: "failed", date: "2026-03-08" },
];

const statusColor: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  refunded: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = useMemo(() => (statusFilter === "all" ? transactions : transactions.filter((t) => t.status === statusFilter)), [statusFilter]);
  const totalRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = transactions.filter((t) => t.status === "refunded").reduce((sum, t) => sum + t.amount, 0);

  const columns: ColumnDef<Transaction, unknown>[] = [
    { accessorKey: "id", header: "Transaction", cell: ({ row }) => <span className="font-medium text-foreground font-mono text-xs">{row.original.id}</span> },
    { accessorKey: "orderId", header: "Order", cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.orderId}</span> },
    { accessorKey: "customer", header: "Customer", cell: ({ row }) => <span className="text-foreground">{row.original.customer}</span> },
    { accessorKey: "method", header: "Method", cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.method}</span> },
    { accessorKey: "date", header: "Date", cell: ({ row }) => <span className="text-muted-foreground">{row.original.date}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="outline" className={cn("capitalize text-xs", statusColor[row.original.status])}>{row.original.status}</Badge> },
    { accessorKey: "amount", header: () => <span className="flex justify-end">Amount</span>, cell: ({ row }) => <span className="flex justify-end text-foreground font-medium">${row.original.amount.toLocaleString()}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Transaction history and management</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-5"><p className="text-sm text-muted-foreground">Completed Revenue</p><p className="text-2xl font-display font-semibold text-foreground mt-1">${totalRevenue.toLocaleString()}</p></div>
        <div className="glass-card rounded-lg p-5"><p className="text-sm text-muted-foreground">Total Refunds</p><p className="text-2xl font-display font-semibold text-destructive mt-1">${totalRefunds.toLocaleString()}</p></div>
        <div className="glass-card rounded-lg p-5"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-display font-semibold text-yellow-500 mt-1">${transactions.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0).toLocaleString()}</p></div>
      </div>
      <DataTable columns={columns} data={filtered} searchPlaceholder="Search transactions..." onExportCSV={() => exportToCSV(transactions as unknown as Record<string, unknown>[], "payments", { id: "Transaction", orderId: "Order", customer: "Customer", method: "Method", date: "Date", status: "Status", amount: "Amount" })} filterComponent={
        <div className="flex gap-2 flex-wrap">
          {["all", "completed", "pending", "refunded", "failed"].map((s) => (
            <Button key={s} variant="outline" size="sm" onClick={() => setStatusFilter(s)} className={cn("capitalize text-xs", statusFilter === s && "bg-primary/10 text-primary border-primary/30")}>{s}</Button>
          ))}
        </div>
      } />
    </div>
  );
}
