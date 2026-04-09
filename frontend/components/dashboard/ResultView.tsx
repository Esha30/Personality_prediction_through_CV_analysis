"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import {
  Sparkles, Users, Brain, Heart, Zap, Shield, Star, Download
} from "lucide-react";

interface ResultViewProps {
  result: {
    mbti: string;
    traits: Record<string, number>;
    filename: string;
  };
}

/* ─── MBTI Data ─── */
interface MbtiInfo {
  title: string;
  tagline: string;
  description: string;
  strengths: string[];
  color: string;
  bg: string;
  emoji: string;
}

const mbtiData: Record<string, MbtiInfo> = {
  INTJ: { title: "The Architect", tagline: "Strategic & Independent", description: "An imaginative and strategic thinker with a plan for everything. Natural at seeing patterns and executing long-term visions.", strengths: ["Strategic thinking", "High standards", "Self-confidence", "Decisive"], color: "#a78bfa", bg: "from-violet-900/30 to-indigo-900/20", emoji: "🏛️" },
  INTP: { title: "The Logician", tagline: "Innovative & Analytical", description: "An innovative inventor with an unquenchable thirst for knowledge. Loves abstract ideas and unravelling complex systems.", strengths: ["Analytical mind", "Objectivity", "Open-mindedness", "Creativity"], color: "#60a5fa", bg: "from-blue-900/30 to-sky-900/20", emoji: "🔭" },
  ENTJ: { title: "The Commander", tagline: "Bold & Natural Leader", description: "A bold, imaginative and strong-willed leader who always finds a way — or makes one. Inspiring and decisive.", strengths: ["Leadership", "Confidence", "Strategic planning", "Drive"], color: "#f87171", bg: "from-red-900/30 to-orange-900/20", emoji: "👑" },
  ENTP: { title: "The Debater", tagline: "Clever & Curious", description: "Smart and curious, loves intellectual challenge and is never afraid to argue a point — just for fun. Sees all angles.", strengths: ["Quick thinking", "Charisma", "Adaptability", "Creativity"], color: "#fb923c", bg: "from-orange-900/30 to-amber-900/20", emoji: "💡" },
  INFJ: { title: "The Advocate", tagline: "Insightful & Principled", description: "A rare and thoughtful individual with a deep sense of empathy and idealism. Quietly powerful and deeply compassionate.", strengths: ["Empathy", "Vision", "Conviction", "Creativity"], color: "#34d399", bg: "from-emerald-900/30 to-teal-900/20", emoji: "🕊️" },
  INFP: { title: "The Mediator", tagline: "Empathetic & Creative", description: "A poetic, kind and altruistic soul, always eager to help a good cause. Guided by their values and imagination.", strengths: ["Empathy", "Creativity", "Passion", "Open-mindedness"], color: "#f9a8d4", bg: "from-pink-900/30 to-rose-900/20", emoji: "🌸" },
  ENFJ: { title: "The Protagonist", tagline: "Charismatic & Inspiring", description: "Charismatic and inspiring leaders, able to mesmerize their listeners. Natural talent for people and communication.", strengths: ["Charisma", "Empathy", "Organisation", "Diplomacy"], color: "#a78bfa", bg: "from-violet-900/30 to-purple-900/20", emoji: "🌟" },
  ENFP: { title: "The Campaigner", tagline: "Enthusiastic & Free-spirited", description: "Enthusiastic, creative and sociable free spirits who can always find a reason to smile. Full of authentic warmth.", strengths: ["Enthusiasm", "Creativity", "Sociability", "Curiosity"], color: "#fbbf24", bg: "from-amber-900/30 to-yellow-900/20", emoji: "🎨" },
  ISTJ: { title: "The Logistician", tagline: "Reliable & Detail-oriented", description: "Practical and fact-minded, extremely responsible and dependable. Takes pride in getting things right.", strengths: ["Reliability", "Thoroughness", "Loyalty", "Patience"], color: "#94a3b8", bg: "from-slate-900/30 to-zinc-900/20", emoji: "📋" },
  ISFJ: { title: "The Defender", tagline: "Warm & Protective", description: "A very dedicated and warm protector, always ready to defend their loved ones. Humble and hardworking.", strengths: ["Supportiveness", "Reliability", "Patience", "Observation"], color: "#6ee7b7", bg: "from-emerald-900/30 to-green-900/20", emoji: "🛡️" },
  ESTJ: { title: "The Executive", tagline: "Organised & Decisive", description: "Excellent administrators, unsurpassed at managing things. Clear about what is right and keep everything in order.", strengths: ["Organisation", "Dedication", "Strong will", "Honesty"], color: "#fbbf24", bg: "from-yellow-900/30 to-amber-900/20", emoji: "⚖️" },
  ESFJ: { title: "The Consul", tagline: "Caring & Social", description: "Extraordinarily caring, social and popular people, always eager to help. Deeply attuned to the feelings of others.", strengths: ["Social skills", "Warmth", "Connection", "Loyalty"], color: "#f9a8d4", bg: "from-rose-900/30 to-pink-900/20", emoji: "🤝" },
  ISTP: { title: "The Virtuoso", tagline: "Bold & Practical", description: "Bold and practical experimenters, masters of tools. Calm and collected, excellent at observing and analysing.", strengths: ["Practicality", "Calm under pressure", "Creativity", "Curiosity"], color: "#67e8f9", bg: "from-cyan-900/30 to-sky-900/20", emoji: "🔧" },
  ISFP: { title: "The Adventurer", tagline: "Flexible & Artistic", description: "Flexible and charming artists, always ready to explore and experience something new. Quietly curious.", strengths: ["Artistic sense", "Flexibility", "Empathy", "Imagination"], color: "#fb923c", bg: "from-orange-900/30 to-red-900/20", emoji: "🎭" },
  ESTP: { title: "The Entrepreneur", tagline: "Energetic & Risk-taker", description: "Smart, energetic and very perceptive people. Will plunge straight into the thick of things and deal with problems quickly.", strengths: ["Boldness", "Sociability", "Perception", "Practicality"], color: "#f87171", bg: "from-red-900/30 to-orange-900/20", emoji: "⚡" },
  ESFP: { title: "The Entertainer", tagline: "Spontaneous & Enthusiastic", description: "Spontaneous, energetic and enthusiastic — life is never boring around them. They love people and new experiences.", strengths: ["Showmanship", "Boldness", "Originality", "Aesthetics"], color: "#fbbf24", bg: "from-yellow-900/30 to-orange-900/20", emoji: "🎉" },
};

const defaultMbti: MbtiInfo = {
  title: "Unique Profile",
  tagline: "One of a kind",
  description: "A distinct cognitive archetype with unique characteristics.",
  strengths: ["Adaptability", "Resilience", "Curiosity"],
  color: "#a78bfa",
  bg: "from-violet-900/30 to-indigo-900/20",
  emoji: "✨",
};

/* ─── Trait Icons and Colours ─── */
const traitMeta: Record<string, { icon: React.ReactNode; color: string; barColor: string; label: string }> = {
  Extraversion:         { icon: <Users className="w-3.5 h-3.5" />,  color: "text-sky-400",    barColor: "#38bdf8", label: "Extraversion" },
  Openness:             { icon: <Sparkles className="w-3.5 h-3.5" />,color: "text-violet-400", barColor: "#a78bfa", label: "Openness" },
  Agreeableness:        { icon: <Heart className="w-3.5 h-3.5" />,   color: "text-pink-400",   barColor: "#f472b6", label: "Agreeableness" },
  Conscientiousness:    { icon: <Shield className="w-3.5 h-3.5" />,  color: "text-emerald-400",barColor: "#34d399", label: "Conscientiousness" },
  "Emotional Stability":{ icon: <Zap className="w-3.5 h-3.5" />,    color: "text-amber-400",  barColor: "#fbbf24", label: "Emotional Stability" },
};

const defaultMeta = { icon: <Brain className="w-3.5 h-3.5" />, color: "text-violet-400", barColor: "#a78bfa", label: "" };

/* ─── Custom Tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1a2e] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
        <p className="text-white/50 mb-0.5">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

/* ─── Component ─── */
export function ResultView({ result }: ResultViewProps) {
  const info = mbtiData[result.mbti] ?? defaultMbti;

  const radarData = Object.entries(result.traits).map(([name, value]) => ({
    name: name.replace("Emotional Stability", "Emotional\nStability"),
    value,
    fullMark: 100,
  }));

  const barData = Object.entries(result.traits).map(([name, value]) => ({ name, value }));

  const topTrait = Object.entries(result.traits).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Personality Hero Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative rounded-2xl bg-gradient-to-br ${info.bg} border border-white/10 p-8 overflow-hidden`}
      >
        {/* Ambient blobs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: `${info.color}18` }} />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: `${info.color}12` }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          {/* Type badge */}
          <div className="flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-2xl border border-white/10"
              style={{ backgroundColor: `${info.color}22` }}
            >
              <span className="text-3xl mb-1">{info.emoji}</span>
              <span className="text-xs font-bold tracking-widest" style={{ color: info.color }}>{result.mbti}</span>
            </div>
          </div>

          {/* Text info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="badge border"
                style={{ color: info.color, backgroundColor: `${info.color}15`, borderColor: `${info.color}30` }}
              >
                <Star className="w-3 h-3" />
                {info.tagline}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">{info.title}</h2>
            <p className="text-sm text-white/55 leading-relaxed max-w-lg">{info.description}</p>
          </div>

          {/* Filename */}
          <div className="flex-shrink-0 text-right hidden md:block">
            <p className="text-xs text-white/25 mb-1">Analysed from</p>
            <p className="text-xs font-medium text-white/50 max-w-[140px] truncate">{result.filename}</p>
          </div>
        </div>

        {/* Strengths row */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/[0.06]">
          {info.strengths.map((s) => (
            <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-white/60">
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/80 font-display">Personality Radar</h3>
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">Big Five OCEAN</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#9490a8", fontSize: 11, fontWeight: 500 }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#a78bfa"
                  strokeWidth={2.5}
                  fill="#a78bfa"
                  fillOpacity={0.18}
                  dot={{ fill: "#a78bfa", r: 4, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Trait Bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white/80 font-display">Trait Breakdown</h3>
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">Scores out of 100</span>
          </div>

          <div className="space-y-4">
            {Object.entries(result.traits).map(([name, value], i) => {
              const meta = traitMeta[name] ?? defaultMeta;
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={meta.color}>{meta.icon}</span>
                      <span className="text-xs font-medium text-white/65">{name}</span>
                    </div>
                    <span className="text-xs font-bold text-white/80">{value}%</span>
                  </div>
                  <div className="trait-bar-track">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: meta.barColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Insights Row ── */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Top strength */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <h4 className="text-sm font-semibold text-white/80">Standout Strength</h4>
          </div>
          <p className="text-sm text-white/45 leading-relaxed">
            This candidate scores highest in{" "}
            <span className="text-white font-semibold">{topTrait?.[0]}</span> ({topTrait?.[1]}%),
            suggesting excellent potential in roles that reward{" "}
            <span className="text-violet-300">{topTrait?.[0].toLowerCase()}</span> and strategic foresight.
          </p>
        </motion.div>

        {/* Team fit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-semibold text-white/80">Team Fit</h4>
          </div>
          <p className="text-sm text-white/45 leading-relaxed">
            As a <span className="text-white font-semibold">{info.title} ({result.mbti})</span>,{" "}
            this individual will likely bring{" "}
            <span className="text-emerald-300">{info.strengths[0].toLowerCase()}</span> and{" "}
            <span className="text-emerald-300">{info.strengths[1]?.toLowerCase()}</span> to team environments.
          </p>
        </motion.div>
      </div>

      {/* ── Bar chart (full width) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80 font-display">Comparative Trait Chart</h3>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#9490a8", fontSize: 11, fontWeight: 500 }}
                width={130}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                {barData.map((entry, index) => {
                  const colors = ["#38bdf8", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];
                  return <Cell key={index} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
