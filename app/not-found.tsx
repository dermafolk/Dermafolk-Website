import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-900 px-4 text-center text-stone-100">
      <h1 className="font-heading text-6xl font-light tracking-tight">404</h1>
      <p className="mt-4 text-lg text-stone-400">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-stone-100 px-6 py-3 text-sm font-medium text-stone-900 hover:bg-stone-200 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
