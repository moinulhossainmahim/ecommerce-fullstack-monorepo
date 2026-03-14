import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="font-display text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="text-primary underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
