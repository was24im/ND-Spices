"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ShieldAlert, ArrowRight, Building2, Store, RefreshCw } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/staff/crm";
  const errorParam = searchParams.get("error");
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("staff@ndspices.com");
  const [password, setPassword] = useState("Staff@1234");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === "unauthorized" ? "Access restricted to authorized staff personnel." : null
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
        setErrorMessage("Invalid staff email or authorization code.");
        addToast("Authentication failed. Please check credentials.", "error");
      } else {
        addToast("Staff authentication verified. Welcome back!", "success");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#212121] py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/10 space-y-6">
      {errorMessage && (
        <div className="rounded-2xl bg-red-950/60 border border-red-800 p-3.5 flex items-center gap-3 text-xs text-red-300">
          <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-cream-200 mb-1.5 uppercase tracking-wider">
            Staff Email ID
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-400/60" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@ndspices.com"
              className="w-full rounded-xl border border-white/10 bg-[#171717] pl-10 pr-4 py-2.5 text-xs text-white placeholder-cream-400/40 focus:border-cardamom focus:outline-none focus:ring-1 focus:ring-cardamom font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-cream-200 mb-1.5 uppercase tracking-wider">
            Access Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-400/60" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-[#171717] pl-10 pr-4 py-2.5 text-xs text-white placeholder-cream-400/40 focus:border-cardamom focus:outline-none focus:ring-1 focus:ring-cardamom"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cardamom hover:bg-cardamom-600 text-white font-bold py-3 text-xs flex items-center justify-center gap-2 shadow-lg shadow-cardamom/20 transition-all disabled:opacity-50"
          >
            <span>{loading ? "Authenticating Staff..." : "Sign In to Staff Console"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Quick Demo Credentials Info */}
      <div className="rounded-2xl bg-white/5 p-3.5 border border-white/5 text-[11px] text-cream-300/80 space-y-1">
        <p className="font-bold text-white">Default Staff Demo Login:</p>
        <p>Email: <code className="text-turmeric-300 font-mono">staff@ndspices.com</code></p>
        <p>Password: <code className="text-turmeric-300 font-mono">Staff@1234</code></p>
      </div>

      <div className="text-center pt-2 border-t border-white/5">
        <Link
          href="/"
          className="text-xs text-cream-400 hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <Store className="h-3.5 w-3.5" />
          <span>Back to Public Store</span>
        </Link>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-[#171717] text-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-cardamom/20 border border-cardamom/30 px-3.5 py-1 text-xs font-bold text-cardamom-300">
          <Building2 className="h-4 w-4 text-cardamom" />
          <span>ND Spices Operations &amp; Billing Terminal</span>
        </div>

        <h1 className="font-serif text-3xl font-extrabold text-white tracking-tight">
          Staff Portal Access
        </h1>
        <p className="text-xs text-cream-300/70 max-w-sm mx-auto">
          Authorized console for CRM lead management, B2B spice inquiries, and invoice generation.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Suspense fallback={
          <div className="bg-[#212121] py-12 px-6 rounded-3xl text-center text-cream-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-cardamom mb-2" />
            <p className="text-xs">Loading staff login portal...</p>
          </div>
        }>
          <StaffLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
