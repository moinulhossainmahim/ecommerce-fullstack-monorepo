"use client";

const mockAddresses = [
  {
    id: "1",
    label: "Home",
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
  },
  {
    id: "2",
    label: "Office",
    line1: "456 Business Ave",
    line2: "Suite 200",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
  },
];

export default function Addresses() {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-6">Saved Addresses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockAddresses.map((addr) => (
          <div key={addr.id} className="border border-border p-5">
            <p className="font-medium text-sm mb-1">{addr.label}</p>
            <p className="text-sm text-muted-foreground">{addr.line1}</p>
            {addr.line2 && (
              <p className="text-sm text-muted-foreground">{addr.line2}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {addr.city}, {addr.state} {addr.zip}
            </p>
            <button className="text-primary text-xs mt-3 underline">Edit</button>
          </div>
        ))}
        <button className="border border-dashed border-border p-5 flex items-center justify-center text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
          + Add New Address
        </button>
      </div>
    </div>
  );
}
