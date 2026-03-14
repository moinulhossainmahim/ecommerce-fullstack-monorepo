"use client";

import { useState } from "react";
import { Star, Check, X, Trash2, Download, Search } from "lucide-react";
import { Button, Input, Badge } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { exportToCSV } from "@/components/admin/DataTable";

interface Review {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const mockReviews: Review[] = [
  { id: "rev-1", customer: "Victoria Laurent", product: "Midnight Chronograph", rating: 5, comment: "Absolutely stunning timepiece. The craftsmanship is exceptional and it keeps perfect time.", date: "2026-03-12", status: "approved" },
  { id: "rev-2", customer: "Alexander Chen", product: "Heritage Leather Tote", rating: 4, comment: "Beautiful bag with great quality leather. Slightly smaller than expected but still love it.", date: "2026-03-11", status: "pending" },
  { id: "rev-3", customer: "Sophia Blackwood", product: "Obsidian Aviators", rating: 5, comment: "These sunglasses are perfect. Lightweight, stylish, and great UV protection.", date: "2026-03-11", status: "approved" },
  { id: "rev-4", customer: "James Moretti", product: "Artisan Leather Belt", rating: 2, comment: "Disappointing quality for the price. The buckle feels cheap and the leather creased within a week.", date: "2026-03-10", status: "pending" },
  { id: "rev-5", customer: "Elena Vasquez", product: "Monaco Card Wallet", rating: 4, comment: "Elegant and functional. Fits all my cards perfectly. Great gift option.", date: "2026-03-09", status: "approved" },
  { id: "rev-6", customer: "Marcus Webb", product: "Silk Cashmere Scarf", rating: 1, comment: "This is clearly not real cashmere. Very scratchy and poor quality. Want a refund.", date: "2026-03-08", status: "rejected" },
  { id: "rev-7", customer: "Isabelle Fontaine", product: "Midnight Chronograph", rating: 5, comment: "A masterpiece! Bought one for my husband and now I want one for myself.", date: "2026-03-07", status: "pending" },
];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = reviews.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = r.customer.toLowerCase().includes(search.toLowerCase()) || r.product.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const updateStatus = (id: string, status: Review["status"]) => setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  const deleteReview = (id: string) => setReviews((prev) => prev.filter((r) => r.id !== id));
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">{reviews.length} total reviews · {avgRating} avg rating</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => exportToCSV(reviews as unknown as Record<string, unknown>[], "reviews", { customer: "Customer", product: "Product", rating: "Rating", status: "Status", date: "Date" })}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold text-foreground">{reviews.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
        <div className="glass-card rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold text-yellow-500">{reviews.filter((r) => r.status === "pending").length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
        <div className="glass-card rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold text-emerald-500">{reviews.filter((r) => r.status === "approved").length}</p><p className="text-xs text-muted-foreground">Approved</p></div>
        <div className="glass-card rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold text-destructive">{reviews.filter((r) => r.status === "rejected").length}</p><p className="text-xs text-muted-foreground">Rejected</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." className="pl-9 bg-secondary border-none" />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <Button key={s} variant="outline" size="sm" onClick={() => setFilter(s)} className={cn("capitalize text-xs", filter === s && "bg-primary/10 text-primary border-primary/30")}>{s}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="glass-card rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-primary text-xs font-semibold">{review.customer.split(" ").map((n) => n[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">{review.customer}</p>
                    <p className="text-xs text-muted-foreground">on {review.product} · {review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-3.5 h-3.5", i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className={cn("capitalize text-xs", statusColor[review.status])}>{review.status}</Badge>
                {review.status === "pending" && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-500" onClick={() => updateStatus(review.id, "approved")}><Check className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => updateStatus(review.id, "rejected")}><X className="w-4 h-4" /></Button>
                  </>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteReview(review.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
