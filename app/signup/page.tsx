"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Lock, Mail, Building } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, businessName }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user_email", data.user.email);
        localStorage.setItem("business_name", data.user.businessName);
        router.push("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-600/30">
            <FileText className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-sm text-slate-400">Start generating cloud invoices</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Business Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="DevCorp Tech"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm mt-2"
          >
            {loading ? "Creating Account..." : "Get Started"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}