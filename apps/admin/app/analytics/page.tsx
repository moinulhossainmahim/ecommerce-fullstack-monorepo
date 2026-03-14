"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@aurum/shared/ui";
import { Download, TrendingUp } from "lucide-react";
import { salesData } from "@/lib/adminData";
import { exportToCSV } from "@/components/admin/DataTable";

const categoryRevenue = [
  { name: "Watches", value: 126380, color: "hsl(38 80% 55%)" },
  { name: "Bags", value: 63700, color: "hsl(38 60% 45%)" },
  { name: "Eyewear", value: 88200, color: "hsl(38 90% 65%)" },
  { name: "Accessories", value: 53040, color: "hsl(0 0% 40%)" },
  { name: "Wallets", value: 44460, color: "hsl(0 0% 25%)" },
];

const customerGrowth = [
  { month: "Jul", customers: 120 }, { month: "Aug", customers: 185 }, { month: "Sep", customers: 240 }, { month: "Oct", customers: 380 },
  { month: "Nov", customers: 520 }, { month: "Dec", customers: 710 }, { month: "Jan", customers: 860 }, { month: "Feb", customers: 1050 }, { month: "Mar", customers: 1248 },
];

const tooltipStyle = { background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 16%)", borderRadius: "0.375rem", color: "hsl(40 20% 92%)", fontSize: "12px" };

export default function Analytics() {
  const totalRev = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalOrd = salesData.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance insights and data exports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToCSV(salesData as unknown as Record<string, unknown>[], "sales-report", { month: "Month", revenue: "Revenue", orders: "Orders" })}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          <Button variant="outline" size="sm" onClick={() => exportToCSV(categoryRevenue as unknown as Record<string, unknown>[], "category-revenue", { name: "Category", value: "Revenue" })}><Download className="w-4 h-4 mr-2" /> Categories CSV</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-lg p-4"><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-xl font-display font-semibold text-foreground mt-1">${totalRev.toLocaleString()}</p></div>
        <div className="glass-card rounded-lg p-4"><p className="text-xs text-muted-foreground">Total Orders</p><p className="text-xl font-display font-semibold text-foreground mt-1">{totalOrd.toLocaleString()}</p></div>
        <div className="glass-card rounded-lg p-4"><p className="text-xs text-muted-foreground">Avg Order Value</p><p className="text-xl font-display font-semibold text-foreground mt-1">${Math.round(totalRev / totalOrd).toLocaleString()}</p></div>
        <div className="glass-card rounded-lg p-4"><p className="text-xs text-muted-foreground">Total Customers</p><p className="text-xl font-display font-semibold text-foreground mt-1">1,248</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(38 80% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Revenue by Category</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryRevenue} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
                  {categoryRevenue.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryRevenue.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} /><span className="text-muted-foreground">{cat.name}</span></div>
                <span className="text-foreground">${(cat.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-lg p-5">
          <h3 className="text-sm font-medium text-foreground mb-4">Orders Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs><linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(38 80% 55%)" stopOpacity={0.2} /><stop offset="100%" stopColor="hsl(38 80% 55%)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="orders" stroke="hsl(38 80% 55%)" strokeWidth={2} fill="url(#ordersGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4"><h3 className="text-sm font-medium text-foreground">Customer Growth</h3><TrendingUp className="w-4 h-4 text-emerald-500" /></div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerGrowth}>
                <defs><linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.2} /><stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 16%)" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(0 0% 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="customers" stroke="hsl(142 71% 45%)" strokeWidth={2} fill="url(#custGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
