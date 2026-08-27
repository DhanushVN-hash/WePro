"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Create the Supabase client only once
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already logged in, skip straight to dashboard
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/admin/dashboard");
      }
    });
  }, [router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    setErrorMsg("");
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        {/* WE PRO Logo */}
        <div className="flex justify-center mb-7">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-[3px]">
                <span
                  className="block w-[8px] h-[22px] bg-yellow-500"
                  style={{ transform: "skewX(-18deg)" }}
                />

                <span
                  className="block w-[8px] h-[15px] bg-[#101820]"
                  style={{ transform: "skewX(-18deg)" }}
                />
              </div>

              <span className="text-xl font-extrabold tracking-[0.14em] text-[#101820]">
                WE PRO
              </span>
            </div>

            <p className="mt-1 text-[8px] font-medium tracking-[0.2em] uppercase text-gray-500">
              Industrial Products
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              className="text-yellow-600"
              aria-hidden="true"
            >
              <path
                d="M12 3.5 5 6v5.3c0 4.5 2.8 7.9 7 9.2 4.2-1.3 7-4.7 7-9.2V6l-7-2.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[9px] font-bold tracking-[0.16em] text-yellow-600">
              SECURE ACCESS
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#101820]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your WE PRO workspace.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.6"
              />

              <path
                d="M12 8v5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />

              <circle
                cx="12"
                cy="16.2"
                r="0.9"
                fill="currentColor"
              />
            </svg>

            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-xs font-semibold text-gray-700"
          >
            Email Address
          </label>

          <div className="relative">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
              />

              <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              required
              disabled={submitting}
              className="w-full h-12 border border-gray-300 bg-gray-50 pl-11 pr-4 rounded-md outline-none text-sm text-[#101820] placeholder:text-gray-400 transition-colors focus:border-gray-400 focus:bg-white disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block mb-2 text-xs font-semibold text-gray-700"
          >
            Password
          </label>

          <div className="relative">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              <rect
                x="4.5"
                y="10"
                width="15"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.6"
              />

              <path
                d="M8 10V7.5a4 4 0 0 1 8 0V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={submitting}
              className="w-full h-12 border border-gray-300 bg-gray-50 pl-11 pr-12 rounded-md outline-none text-sm text-[#101820] placeholder:text-gray-400 transition-colors focus:border-gray-400 focus:bg-white disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Custom password visibility button */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded text-gray-400 hover:text-[#101820] hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                /* Eye Off */
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 3.5 20.5 20.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9.8 5.2A9.7 9.7 0 0 1 12 5c6 0 9.5 6.5 9.5 6.5a17.5 17.5 0 0 1-3.4 4.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M6.5 6.9C4 8.7 2.5 11.5 2.5 11.5S6 18 12 18c1.1 0 2.1-.15 3-.43"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Eye */
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end mb-5">
          <a
            href="/forgot-password"
            className="text-xs font-semibold text-gray-500 hover:text-yellow-600 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Login */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#101820] rounded-md font-bold text-xs tracking-wider uppercase transition-colors"
        >
          {submitting ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="animate-spin"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  opacity="0.3"
                />

                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>

              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>

        {/* Security information */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-gray-400">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-500"
            aria-hidden="true"
          >
            <rect
              x="4.5"
              y="10"
              width="15"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <path
              d="M8 10V7.5a4 4 0 0 1 8 0V10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          <span>Secure access to your WE PRO workspace</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100 text-[9px] uppercase tracking-wider text-gray-400">
          <span>© {new Date().getFullYear()} WE PRO</span>

          <span>•</span>

          <span>Industrial Products</span>
        </div>
      </form>

      {/* Hide Microsoft Edge's built-in password reveal icon.
          This leaves only the custom eye button above. */}
      <style jsx global>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>
    </div>
  );
}