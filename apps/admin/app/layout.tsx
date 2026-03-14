import type { Metadata } from "next";
import "./globals.css";
import AdminClientWrapper from "@/components/AdminClientWrapper";

export const metadata: Metadata = {
  title: "Aurum Admin",
  description: "Aurum admin dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <AdminClientWrapper>{children}</AdminClientWrapper>
      </body>
    </html>
  );
}
