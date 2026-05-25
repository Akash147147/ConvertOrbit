"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sliders, Sparkles, ArrowRight, FileImage, FileText } from "lucide-react";

export default function CustomCompressor() {
  const router = useRouter();
  const [fileType, setFileType] = useState<"image" | "pdf">("image");
  const [customSize, setCustomSize] = useState(150);

  const handleCustomCompress = () => {
    if (fileType === "image") {
      router.push(`/tools/compress-image-exact-kb?targetKB=${customSize}`);
    } else {
      router.push(`/tools/pdf-compressor?targetKB=${customSize}`);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent-blue uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
        <span>Create Custom Size Limit</span>
      </div>

      {/* File Type Toggles */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
        <button
          onClick={() => setFileType("image")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
            fileType === "image"
              ? "bg-white text-slate-800 shadow-sm border border-slate-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FileImage className="h-3.5 w-3.5" />
          <span>Image</span>
        </button>
        <button
          onClick={() => setFileType("pdf")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
            fileType === "pdf"
              ? "bg-white text-slate-800 shadow-sm border border-slate-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>PDF Document</span>
        </button>
      </div>

      {/* Slider & Numeric Display */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-extrabold text-slate-500">Target weight</span>
          <span className="text-xs font-extrabold text-accent-blue bg-blue-50 px-2 py-0.5 rounded-md">
            {customSize} KB
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={customSize}
          onChange={(e) => setCustomSize(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
        />
        <div className="flex justify-between text-[8px] font-bold text-slate-400">
          <span>10 KB</span>
          <span>500 KB</span>
          <span>1000 KB</span>
        </div>
      </div>

      {/* Go Button */}
      <button
        onClick={handleCustomCompress}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white text-xs font-bold shadow-md shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
      >
        <span>Convert at Custom Size</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
