"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button, Input, Badge, Label, Switch, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";

interface Category {
  id: string;
  name: string;
  image: string;
  enabled: boolean;
  productCount: number;
  subcategories: { id: string; name: string; enabled: boolean }[];
}

const mockCategories: Category[] = [
  { id: "cat-1", name: "Watches", image: "⌚", enabled: true, productCount: 24, subcategories: [{ id: "sub-1", name: "Chronographs", enabled: true }, { id: "sub-2", name: "Dress Watches", enabled: true }, { id: "sub-3", name: "Dive Watches", enabled: false }] },
  { id: "cat-2", name: "Bags", image: "👜", enabled: true, productCount: 18, subcategories: [{ id: "sub-4", name: "Totes", enabled: true }, { id: "sub-5", name: "Briefcases", enabled: true }, { id: "sub-6", name: "Clutches", enabled: true }] },
  { id: "cat-3", name: "Eyewear", image: "🕶️", enabled: true, productCount: 15, subcategories: [{ id: "sub-7", name: "Sunglasses", enabled: true }, { id: "sub-8", name: "Optical", enabled: false }] },
  { id: "cat-4", name: "Accessories", image: "💎", enabled: true, productCount: 32, subcategories: [{ id: "sub-9", name: "Belts", enabled: true }, { id: "sub-10", name: "Scarves", enabled: true }, { id: "sub-11", name: "Cufflinks", enabled: true }, { id: "sub-12", name: "Ties", enabled: false }] },
  { id: "cat-5", name: "Wallets", image: "👛", enabled: false, productCount: 8, subcategories: [{ id: "sub-13", name: "Card Holders", enabled: true }, { id: "sub-14", name: "Bifold", enabled: true }] },
];

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);

  const toggleEnabled = (catId: string) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, enabled: !c.enabled } : c)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} categories</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setEditCat(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronRight className={cn("w-4 h-4 transition-transform", expandedId === cat.id && "rotate-90")} />
                </button>
                <span className="text-2xl">{cat.image}</span>
                <div className="min-w-0">
                  <p className="text-foreground font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.productCount} products · {cat.subcategories.length} subcategories</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={cat.enabled} onCheckedChange={() => toggleEnabled(cat.id)} />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditCat(cat); setShowModal(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            {expandedId === cat.id && (
              <div className="border-t border-border px-4 py-3 bg-secondary/20">
                <div className="space-y-2 pl-10">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between py-1.5">
                      <span className={cn("text-sm", sub.enabled ? "text-foreground" : "text-muted-foreground")}>{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs", sub.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "text-muted-foreground border-border")}>{sub.enabled ? "Active" : "Disabled"}</Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="text-primary text-xs mt-1"><Plus className="w-3 h-3 mr-1" /> Add Subcategory</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="font-display">{editCat ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Category Name</Label><Input defaultValue={editCat?.name || ""} placeholder="Enter category name" className="bg-secondary border-none" /></div>
            <div className="space-y-2"><Label>Category Image URL</Label><Input placeholder="Upload or paste image URL" className="bg-secondary border-none" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">{editCat ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
