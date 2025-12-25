//app/page.tsx

"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/gallery");
    }
  }, [router, status]);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/gallery" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-3xl w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 text-center space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200">8Ball Gallery</p>
          <h1 className="text-3xl sm:text-4xl font-semibold">Sign in to view your Drive photos</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Connect with Google to launch NextAuth and browse the gallery pulled directly from your Drive folder.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={handleSignIn}
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-medium shadow-lg shadow-blue-500/30 transition disabled:opacity-60"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M21.6 12.23c0-.63-.06-1.24-.17-1.83H12v3.47h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.23c1.9-1.75 2.99-4.33 2.99-7.17"
              />
              <path
                fill="currentColor"
                d="M12 22c2.7 0 4.96-.89 6.61-2.4l-3.23-2.5c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.14H3.05v2.6A9.99 9.99 0 0 0 12 22"
              />
              <path
                fill="currentColor"
                d="M6.41 13.92A5.98 5.98 0 0 1 6.1 12c0-.66.11-1.3.3-1.92V7.48H3.05A9.99 9.99 0 0 0 2 12c0 1.62.39 3.16 1.05 4.52l3.36-2.6"
              />
              <path
                fill="currentColor"
                d="M12 6.01c1.47 0 2.78.5 3.81 1.48l2.86-2.85C16.96 2.83 14.7 2 12 2A9.99 9.99 0 0 0 3.05 7.48l3.35 2.6C7.2 7.78 9.4 6 12 6"
              />
            </svg>
            {status === "loading" ? "Preparing..." : "Continue with Google"}
          </button>
          <p className="text-sm text-white/70">We&apos;ll redirect you to the gallery once signed in.</p>
        </div>
      </div>
    </main>
  );
}