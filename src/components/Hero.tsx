"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Upload, Search, ArrowRight, ShieldCheck, Zap, 
  HelpCircle, Image as ImageIcon, FileText, Video, Layers, 
  CheckCircle2, AlertCircle, Sparkles, Sliders, Compass,
  Lock, Type, Hash
} from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  exts: string[];
  icon: React.ReactNode;
}

const ALL_TOOLS: ToolItem[] = [
  // Exact size image
  { id: "compress-image-20kb", name: "Compress Image to 20KB", desc: "Scale photo exactly under 20KB limit", exts: [".jpg", ".jpeg", ".png"], icon: <ImageIcon className="h-5 w-5 text-emerald-500" /> },
  { id: "compress-image-50kb", name: "Compress Image to 50KB", desc: "Scale photo exactly under 50KB limit", exts: [".jpg", ".jpeg", ".png"], icon: <ImageIcon className="h-5 w-5 text-sky-500" /> },
  { id: "compress-image-100kb", name: "Compress Image to 100KB", desc: "Scale photo exactly under 100KB limit", exts: [".jpg", ".jpeg", ".png"], icon: <ImageIcon className="h-5 w-5 text-indigo-500" /> },
  { id: "signature-resize-20kb", name: "Signature Resize 20KB", desc: "Scale signature under 20KB limit", exts: [".jpg", ".jpeg", ".png"], icon: <Sparkles className="h-5 w-5 text-emerald-500" /> },

  // Passport / Visa
  { id: "passport-photo-maker", name: "Passport Photo Maker", desc: "Create 2x2 inch print passport photos", exts: [".jpg", ".jpeg", ".png"], icon: <ImageIcon className="h-5 w-5 text-blue-500" /> },
  { id: "visa-photo-maker", name: "Visa Photo Resizer", desc: "Format photo for embassy visa rules", exts: [".jpg", ".jpeg", ".png"], icon: <ImageIcon className="h-5 w-5 text-indigo-500" /> },

  // Social crops
  { id: "youtube-thumbnail-resizer", name: "YouTube Thumbnail Resizer", desc: "Scale image to exactly 1280x720 16:9", exts: [".jpg", ".jpeg", ".png"], icon: <Video className="h-5 w-5 text-red-500" /> },
  { id: "linkedin-crop", name: "LinkedIn Banner Crop", desc: "Crop profile banner to 1584x396 (4:1)", exts: [".jpg", ".jpeg", ".png"], icon: <Sliders className="h-5 w-5 text-blue-500" /> },
  { id: "instagram-resize", name: "Instagram Image Resizer", desc: "Scale photo to square or story bounds", exts: [".jpg", ".jpeg", ".png"], icon: <Layers className="h-5 w-5 text-indigo-500" /> },

  // Exact PDF
  { id: "compress-pdf-100kb", name: "Compress PDF to 100KB", desc: "Reduce PDF under strict 100KB limits", exts: [".pdf"], icon: <FileText className="h-5 w-5 text-emerald-500" /> },
  { id: "compress-pdf-500kb", name: "Compress PDF to 500KB", desc: "Reduce PDF under strict 500KB limits", exts: [".pdf"], icon: <FileText className="h-5 w-5 text-indigo-500" /> },

  // Image/Metadata tools
  { id: "strip-metadata", name: "Strip Image Metadata", desc: "Delete location GPS & EXIF markers", exts: [".jpg", ".jpeg", ".png"], icon: <ShieldCheck className="h-5 w-5 text-emerald-500" /> },
  { id: "convert-dpi", name: "Convert Image DPI", desc: "Change image resolution density headers", exts: [".jpg", ".jpeg", ".png"], icon: <Compass className="h-5 w-5 text-indigo-500" /> },
  { id: "checksum-tool", name: "File Checksum Tool", desc: "Generate SHA-256 and MD5 binary hashes", exts: ["*"], icon: <Hash className="h-5 w-5 text-sky-500" /> },

  // Developer tools
  { id: "json-formatter", name: "JSON Formatter", desc: "Lint, validate, and indent JSON code", exts: [".json"], icon: <Type className="h-5 w-5 text-indigo-500" /> },
  { id: "base64-encoder", name: "Base64 Encoder", desc: "Encode & decode string characters online", exts: ["*"], icon: <Type className="h-5 w-5 text-blue-500" /> },
  { id: "hash-generator", name: "Hash Generator", desc: "Calculate MD5 & SHA-256 strings instantly", exts: ["*"], icon: <Hash className="h-5 w-5 text-sky-500" /> },

  // PDF
  { id: "merge-pdf", name: "Merge PDF", desc: "Combine multiple PDF documents", exts: [".pdf"], icon: <Layers className="h-5 w-5 text-indigo-500" /> },
  { id: "split-pdf", name: "Split PDF", desc: "Extract specific page ranges from PDF", exts: [".pdf"], icon: <FileText className="h-5 w-5 text-blue-500" /> },
  { id: "remove-pages", name: "Remove PDF Pages", desc: "Delete unwanted pages in a PDF", exts: [".pdf"], icon: <Trash2Icon className="h-5 w-5 text-red-500" /> },
  { id: "organize-pdf", name: "Organize PDF", desc: "Sort and rotate document sheets", exts: [".pdf"], icon: <Sliders className="h-5 w-5 text-indigo-500" /> },
  { id: "pdf-compressor", name: "PDF Compressor", desc: "Reduce PDF documents weight", exts: [".pdf"], icon: <FileText className="h-5 w-5 text-indigo-500" /> },
  { id: "sign-pdf", name: "Sign PDF", desc: "Draw and stamp signatures on any page", exts: [".pdf"], icon: <Sparkles className="h-5 w-5 text-blue-500" /> },
];

function Trash2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "info", msg: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      routePreloadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      routePreloadedFiles(Array.from(e.target.files));
    }
  };

  const routePreloadedFiles = (files: File[]) => {
    if (files.length === 0) return;

    if (typeof window !== "undefined") {
      (window as any).__preloadedFile = files[0];
      if (files.length > 1) {
        (window as any).__preloadedFiles = files;
      }
    }
    router.push(`/tools/universal-dashboard`);
  };

  const filteredTools = ALL_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.exts.some(ext => ext.includes(searchQuery.toLowerCase()))
  );

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/20 via-white to-transparent">
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-blue-400/5 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-indigo-400/5 blur-3xl" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-accent-blue border border-blue-100 shadow-sm animate-pulse">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>Next-Gen Browser Tools</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Convert, Compress & Optimize Files Instantly
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Fast, Secure and Free File Tools for Everyone.
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full max-w-2xl mx-auto border-2 border-dashed rounded-3xl p-10 cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? "border-accent-blue bg-blue-50/25 scale-[0.99] animate-border-pulse" 
              : "border-slate-200 bg-white/80 hover:border-accent-blue/50 hover:bg-white shadow-xl shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-100"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            multiple
            className="hidden"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100/80 mx-auto mb-4 transition-transform duration-300 hover:scale-105">
            <Upload className="h-6 w-6 text-accent-blue" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Drag & drop files here to analyze instantly
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Supports HEIC, PNG, JPG, MOV, PDF, and DOCX files. Analyze properties or bulk process locally!
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/50">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Files never leave device</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100/50">
              <Zap className="h-3.5 w-3.5" />
              <span>100% Local sandbox</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Auto-purge browser RAM</span>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="max-w-xl mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-slate-600">{feedback.msg}</p>
            </div>
            <button 
              onClick={() => setFeedback(null)} 
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
            >
              Dismiss
            </button>
          </div>
        )}

        <div id="search-input-field" className="max-w-md mx-auto relative scroll-mt-24">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search all 30+ tools... (e.g. Merge, Sign, Rotate)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-card-border bg-white py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-md shadow-slate-100 outline-none transition-all duration-300 focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5"
            aria-label="Search tools"
          />

          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-card-border shadow-xl overflow-hidden z-20 text-left divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      router.push(`/tools/${tool.id}`);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                        {tool.icon}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{tool.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 hover:text-accent-blue transition-colors shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  No matching tools found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
