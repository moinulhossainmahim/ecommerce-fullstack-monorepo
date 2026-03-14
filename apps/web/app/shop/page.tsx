import { ShopClient } from "@/components/ShopClient";
import StoreFooter from "@/components/StoreFooter";

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params?.category ?? "All";
  const initialSearchQuery = params?.search ?? "";

  return (
    <>
      <ShopClient
        initialCategory={initialCategory}
        initialSearchQuery={initialSearchQuery}
      />
      <StoreFooter />
    </>
  );
}
