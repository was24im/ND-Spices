"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-spice-dark">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-spice-muted">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <div className="rounded-3xl border border-cream-300 bg-white p-6 sm:p-8 shadow-spice-sm">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="h-14 w-14 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-spice-dark">Check Your Inbox</h3>
              <p className="text-xs text-spice-muted leading-relaxed">
                We have dispatched password reset instructions to <strong>{email}</strong>.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-600"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-spice-sm hover:bg-primary-600 hover:shadow-spice-md transition-all active:scale-[0.99]"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-spice-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
