"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  loading: boolean;
  statusMessage: string;
}

export function UploadZone({ onUpload, loading, statusMessage }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && /\.(pdf|docx|txt)$/i.test(dropped.name)) setFile(dropped);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center gap-3 text-center
          min-h-[200px] px-6 py-8
          ${isDragging
            ? "border-violet-400 bg-violet-500/10 scale-[1.01]"
            : file
              ? "border-emerald-500/50 bg-emerald-500/5 cursor-default"
              : "border-white/10 bg-white/[0.02] hover:border-violet-500/40 hover:bg-violet-500/5"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFile}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-3 w-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[220px]">{file.name}</p>
                <p className="text-xs text-white/35 mt-0.5">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={clearFile}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDragging ? "bg-violet-500/25" : "bg-white/[0.04]"}`}>
                <Upload className={`w-7 h-7 transition-colors ${isDragging ? "text-violet-300" : "text-white/30"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/70">Drop your CV here</p>
                <p className="text-xs text-white/30 mt-0.5">
                  or <span className="text-violet-400 hover:underline">click to browse</span> · PDF, DOCX, TXT
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Analyse Button */}
      <Button
        className="w-full py-3.5 text-sm"
        disabled={!file || loading}
        loading={loading}
        onClick={() => file && onUpload(file)}
        icon={<FileText className="w-4 h-4" />}
      >
        {loading ? "Analysing…" : "Analyse Personality"}
      </Button>

      {/* Progress Indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-3 px-4 py-3 bg-violet-500/8 border border-violet-500/15 rounded-xl"
          >
            <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-xs font-medium text-violet-300">{statusMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
