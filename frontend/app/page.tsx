"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { BrainCircuit, LogOut, ChevronDown, UploadCloud, FileSearch, Sparkles, User, History, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { ResultView } from "@/components/dashboard/ResultView";

const analysisSteps = [
  "Reading your document…",
  "Extracting key language patterns…",
  "Mapping personality dimensions…",
  "Synthesising MBTI profile…",
  "Preparing your report…",
];

const howItWorksItems = [
  {
    icon: <UploadCloud className="w-5 h-5" />,
    title: "Upload a CV",
    desc: "Drop in any PDF, DOCX or TXT resume file.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: <FileSearch className="w-5 h-5" />,
    title: "AI Reads the Text",
    desc: "Our model extracts linguistic signals from the writing style.",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Get Your Profile",
    desc: "Receive a full MBTI type with Big-Five trait scores.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  // Fetch History on mount
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/scans")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHistory(data);
        setFetchingHistory(false);
      })
      .catch(err => {
        console.error("Failed to fetch history:", err);
        setFetchingHistory(false);
      });
  }, [session]);

  // Loading animation for upload states
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStepIndex((s) => Math.min(s + 1, analysisSteps.length - 1)), 2600);
    return () => clearInterval(t);
  }, [loading]);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setStepIndex(0);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append("cv", file);

    try {
      const res = await fetch("http://localhost:5000/analyze", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      
      setTimeout(() => { 
        setResult(data); 
        setLoading(false); 
        
        // Save to DB History in the background
        fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(saved => {
          if (saved.success) {
            setHistory(prev => [saved.record, ...prev]);
          }
        })
        .catch(console.error);

      }, 800);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] dot-grid selection:bg-violet-500/25">

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full blur-[160px] bg-violet-800/10 animate-subtle-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full blur-[160px] bg-indigo-800/10 animate-subtle-pulse [animation-delay:2s]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="navbar sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/30 cursor-pointer" onClick={() => setResult(null)}>
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white font-display leading-none">PersonaAI</span>
            <p className="text-[10px] text-white/30 leading-none mt-0.5">CV Personality Analysis</p>
          </div>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-violet-300" />
              )}
            </div>
            <span className="text-sm font-medium text-white/70 hidden sm:block">
              {session?.user?.name?.split(" ")[0] || "You"}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-52 card shadow-2xl py-2"
              >
                <div className="px-4 py-2 mb-1 border-b border-white/[0.05]">
                  <p className="text-xs font-semibold text-white/70 truncate">{session?.user?.name || "User"}</p>
                  <p className="text-[11px] text-white/30 truncate">{session?.user?.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth" })}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Personality Prediction
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-display leading-tight mb-4">
              Understand a person <br />
              <span className="text-violet-gradient">through their CV</span>
            </h1>
            <p className="text-base text-white/40 max-w-md mx-auto leading-relaxed">
              Upload any resume and our AI predicts MBTI type and Big Five personality traits from the writing style — in seconds.
            </p>
          </motion.div>
        )}

        {/* Two-column layout */}
        <div className={`grid gap-8 ${result ? "lg:grid-cols-12" : "lg:grid-cols-5"} items-start`}>

          {/* Left column — Upload & Extras */}
          <div className={result ? "lg:col-span-4" : "lg:col-span-2"}>
            <Card title="Upload a CV" subtitle="PDF, DOCX or TXT · Max 16 MB">
              <UploadZone
                onUpload={handleUpload}
                loading={loading}
                statusMessage={analysisSteps[stepIndex]}
              />
            </Card>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 rounded-xl bg-rose-500/8 border border-rose-500/20 flex gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-rose-400 text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-rose-300">Analysis failed</p>
                    <p className="text-xs text-rose-400/70 mt-0.5">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Section (Shows if history exists) */}
            {!fetchingHistory && history.length > 0 && (
               <motion.div
                 initial={{ opacity: 0, y: 12 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="mt-6"
               >
                 <div className="flex items-center justify-between mb-4">
                   <p className="text-xs font-semibold text-white/30 uppercase tracking-widest flex items-center gap-2">
                     <History className="w-3.5 h-3.5" /> Recent Scans
                   </p>
                   <span className="text-[10px] text-white/20">{history.length} Saved</span>
                 </div>
                 
                 <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                   {history.map((record, i) => (
                     <button
                       key={record._id || i}
                       onClick={() => setResult(record)}
                       className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group flex items-center justify-between"
                     >
                       <div className="min-w-0 pr-3">
                         <div className="flex items-center gap-2 mb-1.5">
                           <span className="text-xs font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md leading-none">{record.mbti}</span>
                           <span className="text-[10px] text-white/30 truncate">{new Date(record.createdAt).toLocaleDateString()}</span>
                         </div>
                         <p className="text-sm font-medium text-white/80 truncate leading-tight">{record.filename}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors shrink-0" />
                     </button>
                   ))}
                 </div>
               </motion.div>
            )}

            {/* How it works (shown when no result and no history taking over the whole screen) */}
            {!result && history.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 space-y-3"
              >
                <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-4">How it works</p>
                {howItWorksItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] transition-all"
                  >
                    <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/70">{item.title}</p>
                      <p className="text-xs text-white/30 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right column — results */}
          <div className={result ? "lg:col-span-8" : "lg:col-span-3"}>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={"result-" + (result._id || result.filename)}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.35 }}
                >
                  <ResultView result={result} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] text-center rounded-2xl border-2 border-dashed border-white/[0.05] p-12"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                    <BrainCircuit className="w-9 h-9 text-white/15" />
                  </div>
                  <p className="text-base font-semibold text-white/20 mb-2">Your results will appear here</p>
                  <p className="text-xs text-white/15 max-w-[200px] leading-relaxed">
                    Upload a CV on the left to get started
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full mt-12 py-8 border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/30 font-medium">
            © {new Date().getFullYear()} PersonaAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-white/20 font-medium">
            <span>Powered by Next.js & Machine Learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
