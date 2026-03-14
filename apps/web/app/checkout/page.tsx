"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sonnerToast as toast } from "@aurum/shared/ui";
import { useCart } from "@/contexts/CartContext";
import StoreFooter from "@/components/StoreFooter";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
    />
  </div>
);

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const shipping = totalPrice > 250 ? 0 : 15;
  const tax = totalPrice * 0.08;
  const total = totalPrice + shipping + tax;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.address ||
      !form.city ||
      !form.zip
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Order placed successfully! 🎉");
    clearCart();
    router.push("/");
  };

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center min-h-[60vh]">
        <h1 className="font-display text-3xl font-bold mb-4">No items to checkout</h1>
        <Link href="/shop" className="text-primary underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold mb-10"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Shipping form */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-lg font-semibold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="First Name *" value={form.firstName} onChange={(v) => update("firstName", v)} />
                  <InputField label="Last Name *" value={form.lastName} onChange={(v) => update("lastName", v)} />
                  <InputField label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} />
                  <InputField label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} />
                  <div className="sm:col-span-2">
                    <InputField label="Address *" value={form.address} onChange={(v) => update("address", v)} />
                  </div>
                  <InputField label="City *" value={form.city} onChange={(v) => update("city", v)} />
                  <InputField label="State" value={form.state} onChange={(v) => update("state", v)} />
                  <InputField label="ZIP Code *" value={form.zip} onChange={(v) => update("zip", v)} />
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2">
                      Country
                    </label>
                    <select
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold mb-6">Payment Method</h2>
                <div className="flex gap-4 mb-6">
                  {[
                    { id: "card", label: "Credit Card" },
                    { id: "paypal", label: "PayPal" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => update("paymentMethod", m.id)}
                      className={`flex-1 py-3 text-sm border transition-colors ${
                        form.paymentMethod === m.id
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {form.paymentMethod === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3">
                      <InputField
                        label="Card Number"
                        value={form.cardNumber}
                        onChange={(v) => update("cardNumber", v)}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <InputField
                      label="Expiry"
                      value={form.cardExpiry}
                      onChange={(v) => update("cardExpiry", v)}
                      placeholder="MM/YY"
                    />
                    <InputField
                      label="CVV"
                      value={form.cardCvv}
                      onChange={(v) => update("cardCvv", v)}
                      placeholder="123"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-6 sticky top-24">
                <h2 className="font-display text-lg font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="h-16 w-14 bg-secondary rounded-sm overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 text-sm border-t border-border pt-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-display font-semibold text-lg border-t border-border pt-4 mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide uppercase hover:bg-primary/90 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <StoreFooter />
    </>
  );
}
