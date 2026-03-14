"use client";

import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@aurum/shared/ui";
import { cn } from "@aurum/shared/library";
import { salesData, adminOrders, topSellingProducts, lowStockProducts } from "@/lib/adminData";

const statCards = [
  { label: "Total Revenue", value: "$408,900", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Total Orders", value: "2,086", change: "+8.2%", up: true, icon: ShoppingCart },
  { label: "Total Customers", value: "1,248", change: "+14.1%", up: true, icon: Users },
  { label: "Total Products", value: "86", change: "-2.3%", up: false, icon: Package },
];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                <card.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-display font-semibold text-foreground">{card.value}</span>
              <span className={cn("flex items-center gap-1 text-xs font-medium", card.up ? "text-emerald-500" : "text-destructive")}>
                {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Revenue Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(38 80% 55%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(38 80% 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 16%)", borderRadius: "0.375rem", color: "hsl(40 20% 92%)", fontSize: "12px" }}
                  formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(38 80% 55%)" strokeWidth={2} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Top Selling</h3>
          <div className="space-y-4">
            {topSellingProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sales} sold</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">${p.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted-foreground font-medium py-2 pr-4">Order</th>
                  <th className="text-left text-muted-foreground font-medium py-2 pr-4">Customer</th>
                  <th className="text-left text-muted-foreground font-medium py-2 pr-4">Status</th>
                  <th className="text-right text-muted-foreground font-medium py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{order.id}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{order.customer}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline" className={cn("capitalize text-xs", statusColor[order.status])}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-foreground">${order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-medium text-foreground">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">All products are well-stocked.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-xs shrink-0", p.stock === 0 ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20")}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
