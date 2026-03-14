import StoreFooter from "@/components/StoreFooter";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using the Aurum website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our services.",
  },
  {
    title: "2. Products & Pricing",
    content:
      "All products displayed on Aurum are subject to availability. Prices are listed in USD and may change without notice. We reserve the right to correct any pricing errors and cancel orders placed at incorrect prices.",
  },
  {
    title: "3. Orders & Payment",
    content:
      "By placing an order, you agree to provide accurate billing and shipping information. We accept major credit cards, PayPal, and Apple Pay. All payments are processed securely through our payment partners.",
  },
  {
    title: "4. Shipping & Delivery",
    content:
      "We offer domestic and international shipping. Delivery times vary by location and shipping method selected. We are not responsible for delays caused by customs or third-party carriers.",
  },
  {
    title: "5. Returns & Refunds",
    content:
      "Items may be returned within 30 days of delivery in original condition with tags attached. Refunds are processed within 5-7 business days after we receive the returned item. Personalized items are non-refundable.",
  },
  {
    title: "6. Intellectual Property",
    content:
      "All content on the Aurum website, including logos, images, text, and designs, is the property of Aurum and protected by copyright laws. Unauthorized use is strictly prohibited.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "Aurum shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the product in question.",
  },
  {
    title: "8. Privacy",
    content:
      "Your privacy is important to us. Please review our Privacy Policy for information on how we collect, use, and protect your personal data.",
  },
  {
    title: "9. Changes to Terms",
    content:
      "We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of the updated terms.",
  },
];

export default function Terms() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground mb-10">
          Last updated: March 14, 2026
        </p>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-display font-medium text-foreground mb-2">
                {s.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
      <StoreFooter />
    </>
  );
}
