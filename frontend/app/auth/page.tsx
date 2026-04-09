"use client";

import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

const authErrorMessages: Record<string, string> = {
  Configuration: "Server configuration error. Please check your Google OAuth credentials.",
  AccessDenied: "Access denied. You don't have permission to sign in.",
  Verification: "The sign-in link has expired. Please request a new one.",
  OAuthCallbackError: "Google sign-in failed. Please try again.",
  OAuthSignin: "Couldn't start Google sign-in. Please try again.",
  Default: "Something went wrong. Please try again.",
};

const features = [
  "MBTI personality type prediction",
  "Big Five OCEAN trait scores",
  "Analyzes writing style, not just keywords",
  "Instant results from any CV",
];

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError ? (authErrorMessages[urlError] ?? authErrorMessages.Default) : null
  );
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed.");
        await signIn("credentials", { redirect: false, email: formData.email, password: formData.password });
        router.push("/");
      } else {
        const res = await signIn("credentials", { redirect: false, email: formData.email, password: formData.password });
        if (res?.error) throw new Error("Incorrect email or password.");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] dot-grid flex items-center justify-center p-4 relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full blur-[200px] bg-violet-800/12 animate-subtle-pulse" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full blur-[200px] bg-indigo-800/10 animate-subtle-pulse [animation-delay:2.5s]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-0 card overflow-hidden shadow-2xl">

        {/* ── Left Panel — Brand ── */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-violet-900/30 via-[#1c1a2e] to-[#1c1a2e] border-r border-white/[0.06]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-white font-display">PersonaAI</span>
          </div>

          {/* Hero text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-white font-display leading-tight mb-4">
                Read personality <br />
                <span className="text-violet-gradient">from any CV.</span>
              </h1>
              <p className="text-sm text-white/40 leading-relaxed mb-8">
                Upload a resume and get instant MBTI + Big Five personality analysis — powered by AI and language understanding.
              </p>
            </motion.div>

            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-center gap-2.5 text-sm text-white/50"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/20">© 2025 PersonaAI · All rights reserved</p>
        </div>

        {/* ── Right Panel — Form ── */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-white font-display">PersonaAI</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white font-display mb-1">
              {isRegister ? "Create an account" : "Welcome back"}
            </h2>
            <p className="text-sm text-white/35">
              {isRegister ? "Start analysing CVs in minutes." : "Sign in to access your dashboard."}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {isRegister && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <label className="block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wider">Full name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={isRegister}
                      placeholder="Jane Doe"
                      className="input-field pl-11"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3.5 mt-2 text-sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isRegister ? "Create account" : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-1 border-t border-white/[0.07]" />
            <span className="px-4 text-xs text-white/25 font-medium">or continue with</span>
            <div className="flex-1 border-t border-white/[0.07]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.03] text-sm font-medium text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Google
          </button>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-white/30">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
