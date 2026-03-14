"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button, Input, Badge, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  position: number;
  active: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  lastUpdated: string;
  published: boolean;
}

const mockBanners: Banner[] = [
  { id: "b1", title: "Spring Collection 2026", subtitle: "Discover timeless elegance", imageUrl: "https://placehold.co/96x56/1a1a1a/666?text=Banner+1", link: "/shop", position: 1, active: true },
  { id: "b2", title: "Exclusive Member Sale", subtitle: "Up to 30% off for VIP members", imageUrl: "https://placehold.co/96x56/1a1a1a/666?text=Banner+2", link: "/shop?sale=true", position: 2, active: true },
  { id: "b3", title: "New Arrivals", subtitle: "Fresh styles just landed", imageUrl: "https://placehold.co/96x56/1a1a1a/666?text=Banner+3", link: "/shop?sort=newest", position: 3, active: false },
];

const mockPages: Page[] = [
  { id: "p1", title: "About Us", slug: "/about", lastUpdated: "2026-03-10", published: true },
  { id: "p2", title: "Terms & Conditions", slug: "/terms", lastUpdated: "2026-02-15", published: true },
  { id: "p3", title: "Privacy Policy", slug: "/privacy", lastUpdated: "2026-02-15", published: true },
  { id: "p4", title: "Contact Us", slug: "/contact", lastUpdated: "2026-03-01", published: true },
  { id: "p5", title: "Size Guide", slug: "/size-guide", lastUpdated: "2026-01-20", published: false },
];

export default function Content() {
  const [showBannerModal, setShowBannerModal] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Content Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage banners, promotions, and pages</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-medium text-foreground">Homepage Banners</h2>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setShowBannerModal(true)}><Plus className="w-4 h-4 mr-2" /> Add Banner</Button>
        </div>
        <div className="space-y-3">
          {mockBanners.map((banner) => (
            <div key={banner.id} className="glass-card rounded-lg p-4 flex items-center gap-4">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
              <div className="w-24 h-14 rounded bg-secondary overflow-hidden shrink-0">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{banner.title}</p>
                <p className="text-xs text-muted-foreground">{banner.subtitle}</p>
              </div>
              <Badge variant="outline" className={cn("text-xs shrink-0", banner.active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "text-muted-foreground border-border")}>{banner.active ? "Active" : "Hidden"}</Badge>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-medium text-foreground">Website Pages</h2>
          <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Page</Button>
        </div>
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted-foreground font-medium py-3 pl-5 pr-4">Title</th>
                  <th className="text-left text-muted-foreground font-medium py-3 pr-4">Slug</th>
                  <th className="text-left text-muted-foreground font-medium py-3 pr-4">Updated</th>
                  <th className="text-left text-muted-foreground font-medium py-3 pr-4">Status</th>
                  <th className="text-right text-muted-foreground font-medium py-3 pr-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPages.map((page) => (
                  <tr key={page.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 pl-5 pr-4 text-foreground font-medium">{page.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground font-mono text-xs">{page.slug}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{page.lastUpdated}</td>
                    <td className="py-3 pr-4"><Badge variant="outline" className={cn("text-xs", page.published ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "text-muted-foreground border-border")}>{page.published ? "Published" : "Draft"}</Badge></td>
                    <td className="py-3 pr-5"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog open={showBannerModal} onOpenChange={setShowBannerModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle className="font-display">Add Banner</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="Banner title" className="bg-secondary border-none" /></div>
            <div className="space-y-2"><Label>Subtitle</Label><Input placeholder="Short description" className="bg-secondary border-none" /></div>
            <div className="space-y-2"><Label>Image URL</Label><Input placeholder="Upload or paste URL" className="bg-secondary border-none" /></div>
            <div className="space-y-2"><Label>Link</Label><Input placeholder="/shop" className="bg-secondary border-none" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowBannerModal(false)}>Cancel</Button><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
