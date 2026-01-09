import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
      <p className="text-pink-400 font-semibold tracking-wide mb-2">404</p>
      <h1 className="text-4xl font-bold mb-4">We couldn't find that page</h1>
      <p className="text-gray-300 mb-8 max-w-lg">
        The page you're looking for might have been moved or no longer exists. Try heading
        back to the dashboard or browse our AI tools from the homepage.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/dashboard"
          className="px-5 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 font-semibold"
        >
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="px-5 py-3 rounded-lg border border-white/30 hover:border-white font-semibold"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
