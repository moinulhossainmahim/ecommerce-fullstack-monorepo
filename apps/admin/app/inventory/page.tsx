"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, PackageX } from "lucide-react";
import { Button, Input, Badge } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { adminProducts } from "@/lib/adminData";
import { DataTable, exportToCSV } from "@/components/admin/DataTable";

type Filter = "all" | "low" | "out";

export default function Inventory() {
  const [filter, setFilter] = useState<Filter>("all");
  const outOfStock = adminProducts.filter((p) => p.stock === 0).length;
  const lowStock = adminProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const filtered = useMemo(() => {
    if (filter === "low") return adminProducts.filter((p) => p.stock > 0 && p.stock <= 10);
    if (filter === "out") return adminProducts.filter((p) => p.stock === 0);
    return adminProducts;
  }, [filter]);

  const columns: ColumnDef<typeof adminProducts[0], unknown>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-secondary overflow-hidden shrink-0">
            <img src={row.original.image} alt={row.original.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-foreground font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "sku", header: "SKU", cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.original.sku}</span> },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const s = row.original.stock;
        return <Badge variant="outline" className={cn("text-xs", s === 0 ? "bg-destructive/10 text-destructive border-destructive/20" : s <= 10 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>{s} units</Badge>;
      },
    },
    { id: "statusLabel", header: "Status", cell: ({ row }) => { const s = row.original.stock; return <span className={cn("text-xs", s === 0 ? "text-destructive" : s <= 10 ? "text-yellow-500" : "text-emerald-500")}>{s === 0 ? "Out of Stock" : s <= 10 ? "Low Stock" : "In Stock"}</span>; } },
    { id: "update", header: () => <span className="flex justify-end">Update</span>, cell: ({ row }) => <div className="flex justify-end"><Input type="number" defaultValue={row.original.stock} className="w-20 h-8 text-xs bg-secondary border-none" /></div> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Inventory</h1>
        <p className="text-sm text-muted-foreground mt-1">Track and manage stock levels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center"><span className="text-emerald-500 text-lg font-semibold">{adminProducts.length}</span></div>
          <div><p className="text-sm text-foreground font-medium">Total Products</p><p className="text-xs text-muted-foreground">In catalog</p></div>
        </div>
        <div className="glass-card rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-yellow-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-yellow-500" /></div>
          <div><p className="text-sm text-foreground font-medium">{lowStock} Low Stock</p><p className="text-xs text-muted-foreground">≤10 units remaining</p></div>
        </div>
        <div className="glass-card rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-destructive/10 flex items-center justify-center"><PackageX className="w-5 h-5 text-destructive" /></div>
          <div><p className="text-sm text-foreground font-medium">{outOfStock} Out of Stock</p><p className="text-xs text-muted-foreground">Needs restocking</p></div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search products..."
        onExportCSV={() => exportToCSV(adminProducts as unknown as Record<string, unknown>[], "inventory", { name: "Product", sku: "SKU", stock: "Stock" })}
        filterComponent={
          <div className="flex gap-2">
            {(["all", "low", "out"] as Filter[]).map((f) => (
              <Button key={f} variant="outline" size="sm" onClick={() => setFilter(f)} className={cn("capitalize text-xs", filter === f && "bg-primary/10 text-primary border-primary/30")}>
                {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
              </Button>
            ))}
          </div>
        }
      />
    </div>
  );
}
