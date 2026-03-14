"use client";

import { ThemeProvider } from "@aurum/shared/ui";
import AdminLayout from "./admin/AdminLayout";

export default function AdminClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark">
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  );
}
