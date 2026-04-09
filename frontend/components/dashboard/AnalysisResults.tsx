"use client";

import React from "react";
import { 
  CheckCircle, Target, Users, BrainCircuit, Printer, Sparkles, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from "recharts";

interface AnalysisResult {
  mbti: string;
  traits: Record<string, number>;
  filename: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const traitColors = ["#6366f1", "#a855f7", "#06b6d4", "#10b981", "#f59e0b"];

const mbtiDescriptions: Record<string, string> = {
  INTJ: "The Architect — Strategic, independent, high-standards thinker.",
  INTP: "The Logician — Innovative, analytical, and abstract reasoner.",
  ENTJ: "The Commander — Bold, decisive, natural-born leader.",
  ENTP: "The Debater — Clever, curious, enjoys intellectual challenges.",
  INFJ: "The Advocate — Insightful, principled, rare and empathetic.",
  INFP: "The Mediator — Idealistic, empathetic, deeply creative.",
  ENFJ: "The Protagonist — Charismatic, inspirational, people-focused.",
  ENFP: "The Campaigner — Enthusiastic, creative, free-spirited.",
  ISTJ: "The Logistician — Reliable, detail-oriented, traditionalist.",
  ISFJ: "The Defender — Dedicated, warm, protective of loved ones.",
  ESTJ: "The Executive — Organized, decisive, excellent manager.",
  ESFJ: "The Consul — Caring, social, highly attuned to others.",
  ISTP: "The Virtuoso — Bold, practical, hands-on problem solver.",
  ISFP: "The Adventurer — Flexible, charming, artistic explorer.",
  ESTP: "The Entrepreneur — Smart, energetic, perceptive risk-taker.",
  ESFP: "The Entertainer — Spontaneous, energetic, loves people.",
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const radarData = Object.entries(result.traits).map(([trait, value]) => ({
    subject: trait,
    A: value,
    fullMark: 100,
  }));

  const barData = Object.entries(result.traits).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 pb-10">
      {/* Result Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase mb-4">
            <CheckCircle className="w-3 h-3" />
            Verification Complete
          </div>
          <h2 className="text-4xl font-bold font-outfit text-white mb-2">Psychological Profile</h2>
          <p className="text-muted-foreground font-medium">Derived from: <span className="text-foreground">{result.filename}</span></p>
        </div>
        
        <div className="text-left md:text-right">
          <div className="text-5xl font-black text-primary-gradient mb-2">{result.mbti}</div>
          <p className="text-muted-foreground max-w-[300px] text-sm">
            {mbtiDescriptions[result.mbti] || "Unique cognitive archetype."}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="premium-card p-6 bg-slate-900/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-bold text-white/90">
              <Target className="w-4 h-4 text-primary" />
              Big Five Dynamics
            </h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Vector Mapping</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                />
                <Radar
                  name="Traits"
                  dataKey="A"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="premium-card p-6 bg-slate-900/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-bold text-white/90">
              <TrendingUp className="w-4 h-4 text-secondary" />
                Trait Magnitudes
            </h3>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Quantitative Benchmarks</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: -10, top: 0, right: 30, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {barData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={traitColors[index % traitColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-indigo-300">Strategic Alignment</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            The candidate exhibits a high degree of <span className="text-white font-bold">{Object.entries(result.traits).sort((a,b) => b[1]-a[1])[0][0]}</span>. This alignment suggests potential excellence in roles requiring high cognitive load and strategic foresight.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-emerald-300">Team Dynamics</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            As a <span className="text-white font-bold">{result.mbti}</span>, the individual will likely contribute to team environments through structural clarity and balanced communication.
          </p>
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <button className="btn-premium" onClick={() => window.print()}>
          <Printer className="w-4 h-4" />
          Export Professional Intel
        </button>
      </div>
    </div>
  );
}
