import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import StoreHeader from "@/components/StoreHeader";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Aurum — Timeless Luxury",
  description: "Timeless luxury accessories crafted with precision and intention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-background">
            <StoreHeader />
            {children}
            <CartDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
