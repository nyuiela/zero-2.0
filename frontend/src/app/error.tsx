"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Optionally log error to a service here
    // console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Logo or Illustration */}
      <div className="mb-6">
        <img src="/logo.svg" alt="App Logo" className="w-20 h-20 mx-auto" onError={e => (e.currentTarget.style.display = 'none')} />
      </div>
      <h1 className="text-3xl font-bold text-[#00296b] mb-2">Oops! Something went wrong.</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-xl">
        Sorry, we hit a roadblock. Please try again or return to the homepage.
      </p>

      {/* Dev-only error details */}
      {isDev && error && (
        <pre className="bg-red-100 text-red-800 p-4 rounded mb-4 max-w-xl overflow-x-auto text-sm">
          {error.message}
          {"\n"}
          {error.stack}
        </pre>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => reset()}
          className="bg-[#00296b] text-white px-6 py-2 rounded shadow hover:bg-[#003580] transition"
        >
          Try Again
        </button>
        <a
          href="/"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded shadow hover:bg-gray-300 transition"
        >
          Go Home
        </a>
      </div>
      <p className="mt-4 text-xs text-gray-400 text-center">If the problem persists, contact support.</p>
    </div>
  );
} 