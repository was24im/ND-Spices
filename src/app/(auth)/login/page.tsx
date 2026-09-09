"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "unauthorized" ? "Please sign in to access your account." : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-cinnamon to-secondary items-center justify-center shadow-spice-sm mb-2">
            <span className="text-white font-serif font-black text-xl">ND</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-spice-muted">
            Sign in to access your spice basket, orders, and exclusive member benefits.
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-spice-dark mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-spice-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-spice-dark placeholder:text-spice-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-spice-dark">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-spice-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-cream-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-spice-dark placeholder:text-spice-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-spice-sm hover:bg-primary-600 hover:shadow-spice-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to ND Spices"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-spice-muted">
            <span>Don't have an account yet? </span>
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-spice-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
          <span>Encrypted JWT Sessions • Single-Origin Pure Aromatics</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-spice-muted">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
