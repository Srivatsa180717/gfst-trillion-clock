"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/auth/signin?registered=1");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        className="card-glass w-full max-w-md"
        style={{ padding: "40px 32px" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "var(--accent-dim)" }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-1)" }}
          >
            Create Account
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
            Join GFST Economy — track India&apos;s growth story
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-1)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Email <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-1)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Password <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Min. 6 characters"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-1)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--text-3)" }}
            >
              Confirm Password <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-1)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
            style={{
              background: "var(--accent)",
              color: "#fff",
              boxShadow: "0 0 24px var(--accent-glow)",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Footer link */}
        <p
          className="text-center text-sm mt-8"
          style={{ color: "var(--text-2)" }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold transition-colors"
            style={{ color: "var(--accent)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
