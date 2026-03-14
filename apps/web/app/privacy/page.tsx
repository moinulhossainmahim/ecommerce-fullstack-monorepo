import StoreFooter from "@/components/StoreFooter";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect personal information you provide when creating an account, placing an order, or contacting us. This includes your name, email, shipping address, and payment details. We also collect usage data through cookies and analytics.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use your information to process orders, provide customer support, send order updates, improve our services, and (with your consent) send marketing communications. We never sell your personal data to third parties.",
  },
  {
    title: "Data Protection",
    content:
      "We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information from unauthorized access.",
  },
  {
    title: "Cookies",
    content:
      "We use essential cookies for site functionality and analytics cookies to understand how visitors use our site. You can manage cookie preferences through your browser settings.",
  },
  {
    title: "Third-Party Services",
    content:
      "We work with trusted partners for payment processing (Stripe, PayPal), shipping, and analytics. These partners are bound by strict data protection agreements.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time. Contact us at privacy@aurum.com to exercise these rights.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal data for as long as necessary to fulfill orders and comply with legal obligations. Account data is retained until you request deletion.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy periodically. We will notify you of significant changes via email or a notice on our website.",
  },
];

export default function Privacy() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-display font-semibold text-foreground mb-2">
          Privacy Policy
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

        <div className="glass-card rounded-lg p-6 mt-12">
          <p className="text-foreground font-medium mb-2">
            Questions about your privacy?
          </p>
          <p className="text-sm text-muted-foreground">
            Contact our Data Protection Officer at{" "}
            <a
              href="mailto:privacy@aurum.com"
              className="text-primary hover:underline"
            >
              privacy@aurum.com
            </a>
          </p>
        </div>
      </div>
      <StoreFooter />
    </>
  );
}
