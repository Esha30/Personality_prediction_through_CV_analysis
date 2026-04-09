"use client";

import React, { useState } from "react";
import { Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadSectionProps {
  onUpload: (file: File) => Promise<void>;
  loading: boolean;
  currentStepMessage: string;
}

export function UploadSection({ onUpload, loading, currentStepMessage }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && /\.(pdf|docx|txt)$/i.test(dropped.name)) setFile(dropped);
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative group h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
          dragOver ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"
        } ${file ? "border-success/50 bg-success/5" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="cv-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
        />
        <label htmlFor="cv-upload" className="w-full h-full flex flex-col items-center justify-center px-6">
          <motion.div
            animate={file ? { scale: [1, 1.1, 1] } : {}}
            className={`w-16 h-16 rounded-full flex-center mb-4 ${file ? "bg-success/20 text-success" : "bg-primary/10 text-primary"}`}
          >
            {file ? <Check className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
          </motion.div>
          
          <div className="text-center">
            <h4 className="text-lg font-bold text-white mb-1">
              {file ? file.name : "Upload Candidate CV"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {file ? "File ready for analysis" : "Drag and drop or click to browse"}
            </p>
          </div>
        </label>
      </div>

      <button
        className="btn-premium w-full !py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!file || loading}
        onClick={() => file && onUpload(file)}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Start Analysis Engine</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-medium text-primary-gradient">{currentStepMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
