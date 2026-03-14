"use client";

const mockOrders = [
  { id: "ORD-2026-001", date: "2026-03-10", status: "Delivered", total: 680, items: 2 },
  { id: "ORD-2026-002", date: "2026-02-28", status: "Shipped", total: 320, items: 1 },
  { id: "ORD-2026-003", date: "2026-02-15", status: "Delivered", total: 1090, items: 3 },
];

export default function Orders() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Order History</h2>
      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="border border-border p-5 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-sm">{order.id}</p>
              <p className="text-xs text-muted-foreground">
                {order.date} · {order.items} items
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">${order.total.toFixed(2)}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
