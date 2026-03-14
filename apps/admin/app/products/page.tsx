"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button, Input, Badge, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { adminProducts } from "@/lib/adminData";
import type { AdminProduct } from "@aurum/shared/library";
import { DataTable, exportToCSV } from "@/components/admin/DataTable";

const columns: ColumnDef<AdminProduct, unknown>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-secondary overflow-hidden shrink-0">
          <img src={row.original.image} alt={row.original.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-foreground font-medium truncate">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.sku} · {row.original.category}</p>
        </div>
      </div>
    ),
    enableSorting: true,
  },
  { accessorKey: "price", header: "Price", cell: ({ row }) => <span className="text-foreground">${row.original.price}</span> },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return (
        <Badge variant="outline" className={cn("text-xs", stock === 0 ? "bg-destructive/10 text-destructive border-destructive/20" : stock <= 5 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20")}>
          {stock}
        </Badge>
      );
    },
  },
  { accessorKey: "sales", header: "Sales", cell: ({ row }) => <span className="text-muted-foreground">{row.original.sales}</span> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("text-xs capitalize", row.original.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border")}>
        {row.original.status}
      </Badge>
    ),
  },
];

export default function Products() {
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => ["all", ...new Set(adminProducts.map((p) => p.category))], []);
  const filtered = useMemo(() => (categoryFilter === "all" ? adminProducts : adminProducts.filter((p) => p.category === categoryFilter)), [categoryFilter]);

  const actionColumn: ColumnDef<AdminProduct, unknown> = {
    id: "actions",
    header: () => <span className="flex justify-end">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditProduct(row.original)}>
          <Edit className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{adminProducts.length} products total</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <DataTable
        columns={[...columns, actionColumn]}
        data={filtered}
        searchPlaceholder="Search products or SKU..."
        onExportCSV={() => exportToCSV(adminProducts as unknown as Record<string, unknown>[], "products", { name: "Name", category: "Category", price: "Price", stock: "Stock", sku: "SKU", status: "Status", sales: "Sales" })}
        filterComponent={
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button key={cat} variant="outline" size="sm" onClick={() => setCategoryFilter(cat)} className={cn("capitalize text-xs", categoryFilter === cat && "bg-primary/10 text-primary border-primary/30")}>
                {cat}
              </Button>
            ))}
          </div>
        }
      />

      <Dialog open={showAddModal || !!editProduct} onOpenChange={(open) => { if (!open) { setShowAddModal(false); setEditProduct(null); } }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Product Name</Label><Input defaultValue={editProduct?.name || ""} placeholder="Enter product name" className="bg-secondary border-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Price ($)</Label><Input type="number" defaultValue={editProduct?.price || ""} placeholder="0.00" className="bg-secondary border-none" /></div>
              <div className="space-y-2"><Label>SKU</Label><Input defaultValue={editProduct?.sku || ""} placeholder="SKU-000" className="bg-secondary border-none" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Stock</Label><Input type="number" defaultValue={editProduct?.stock || ""} placeholder="0" className="bg-secondary border-none" /></div>
              <div className="space-y-2"><Label>Category</Label><Input defaultValue={editProduct?.category || ""} placeholder="Category" className="bg-secondary border-none" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); setEditProduct(null); }}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{editProduct ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
