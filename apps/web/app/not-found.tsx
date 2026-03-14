import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <h1 className="font-display text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-muted-foreground mb-8">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="text-primary underline">Back to Home</Link>
    </div>
  );
}
