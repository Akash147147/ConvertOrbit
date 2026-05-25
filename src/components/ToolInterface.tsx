"use client";

import React, { useState, useRef } from "react";
import { useAnimate, motion } from "framer-motion";
import { 
  Upload, File, CheckCircle2, Download, AlertCircle, 
  RefreshCw, Settings, Sliders, Layers, ChevronRight 
} from "lucide-react";
import { 
  convertHeicToJpg, convertPngToIco, compressImageExactKB, 
  compressPdf, convertMovToMp4, convertWordToPdf, convertPdfToWord 
} from "@/lib/conversion-engines";

interface ToolInterfaceProps {
  toolId: string;
  inputAccept: string;
  toolName: string;
}

export default function ToolInterface({ toolId, inputAccept, toolName }: ToolInterfaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom tool options
  const [targetKB, setTargetKB] = useState(150);
  const [icoSizes, setIcoSizes] = useState<number[]>([16, 32, 48, 64]);
  const [pdfQuality, setPdfQuality] = useState<'low' | 'medium' | 'high'>('medium');

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__preloadedFile) {
      validateAndSetFile((window as any).__preloadedFile);
      delete (window as any).__preloadedFile;
    }
  }, []);

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Basic type boundary validations
    setFile(selectedFile);
    setStatus("idle");
    setResultFile(null);
    setProgress(0);
    setErrorMessage("");
  };

  const executeConversion = async () => {
    if (!file) return;

    setStatus("processing");
    setProgress(5);
    setErrorMessage("");

    try {
      let output: File;

      switch (toolId) {
        case "heic-to-jpg":
          output = await convertHeicToJpg(file, setProgress);
          break;
        case "png-to-ico":
          setProgress(30);
          output = await convertPngToIco(file, icoSizes);
          setProgress(100);
          break;
        case "compress-image-exact-kb":
          output = await compressImageExactKB(file, targetKB, setProgress);
          break;
        case "pdf-compressor":
          output = await compressPdf(file, pdfQuality, setProgress);
          break;
        case "mov-to-mp4":
          output = await convertMovToMp4(file, setProgress);
          break;
        case "word-to-pdf":
          output = await convertWordToPdf(file, setProgress);
          break;
        case "pdf-to-word":
          output = await convertPdfToWord(file, setProgress);
          break;
        default:
          throw new Error("Invalid tool selected");
      }

      setResultFile(output);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during processing. Please try again.");
      setStatus("error");
    }
  };

  const downloadResult = () => {
    if (!resultFile) return;
    const url = URL.createObjectURL(resultFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = resultFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setFile(null);
    setResultFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage("");
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-card-border rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100">
      {status === "idle" && !file && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-14 px-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? "border-accent-blue bg-blue-50/20 scale-[0.99] animate-border-pulse" 
              : "border-slate-200 bg-slate-50/40 hover:border-accent-blue/50 hover:bg-slate-50/80"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept={inputAccept}
            className="hidden"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 mb-4 transition-transform duration-300 hover:scale-105">
            <Upload className="h-6 w-6 text-accent-blue" />
          </div>
          <p className="text-base font-bold text-slate-800">
            Drag & drop file here, or <span className="text-accent-blue hover:underline">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Supported formats: {inputAccept.replace(/\./g, " ").toUpperCase()}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            <span>Client-side secure processing</span>
          </div>
        </div>
      )}

      {file && status !== "success" && (
        <div className="space-y-6">
          {/* File Card */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent-blue">
                <File className="h-5 w-5" />
              </div>
              <div className="max-w-[200px] sm:max-w-[350px]">
                <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 font-medium">{formatBytes(file.size)}</p>
              </div>
            </div>
            {status !== "processing" && (
              <button
                onClick={resetTool}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors hover:underline px-2 py-1"
              >
                Remove
              </button>
            )}
          </div>

          {/* Config options */}
          {status !== "processing" && (
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Settings className="h-3.5 w-3.5" />
                <span>Options Configuration</span>
              </div>

              {toolId === "compress-image-exact-kb" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                    <span>Target Size (KB)</span>
                    <span className="text-accent-blue">{targetKB} KB</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="5"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>10 KB</span>
                    <span>500 KB</span>
                    <span>1000 KB</span>
                  </div>
                </div>
              )}

              {toolId === "png-to-ico" && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-700">Included Icon Sizes</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[16, 32, 48, 64, 128, 256].map((size) => {
                      const active = icoSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (active) {
                              if (icoSizes.length > 1) {
                                setIcoSizes(icoSizes.filter(s => s !== size));
                              }
                            } else {
                              setIcoSizes([...icoSizes, size].sort((a,b) => a - b));
                            }
                          }}
                          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                            active 
                              ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" 
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>{size}x{size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {toolId === "pdf-compressor" && (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-700">Optimization Preset</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'Max Quality', desc: 'Minimal compression' },
                      { id: 'medium', label: 'Balanced', desc: 'Optimal size & quality' },
                      { id: 'high', label: 'Max Size', desc: 'Maximum compression' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setPdfQuality(opt.id as any)}
                        className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                          pdfQuality === opt.id 
                            ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xs font-extrabold">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {toolId !== "compress-image-exact-kb" && toolId !== "png-to-ico" && toolId !== "pdf-compressor" && (
                <p className="text-xs text-slate-500">This tool will convert your file with industry-standard settings for high fidelity results.</p>
              )}
            </div>
          )}

          {/* Processing State */}
          {status === "processing" && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-accent-blue" />
                  <span>Processing file...</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-100">
                <motion.div
                  className="bg-gradient-to-r from-accent-blue to-accent-indigo h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-slate-400 text-center font-medium">Please do not close this browser tab.</p>
            </div>
          )}

          {/* Action button */}
          {status !== "processing" && (
            <button
              onClick={executeConversion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white font-bold text-sm shadow-lg shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Optimize & Convert</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-800">Conversion Failed</p>
            <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => setStatus("idle")} 
              className="text-xs font-bold text-red-600 hover:text-red-700 underline mt-2 block"
            >
              Reset and Try Again
            </button>
          </div>
        </div>
      )}

      {/* Success View */}
      {status === "success" && resultFile && (
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-800">Conversion Completed!</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your download is ready</p>
          </div>

          {/* Comparison table */}
          {file && (
            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-2 gap-4 divide-x divide-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Size</p>
                <p className="text-base font-bold text-slate-700 mt-1">{formatBytes(file.size)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Converted Size</p>
                <p className="text-base font-bold text-emerald-600 mt-1">{formatBytes(resultFile.size)}</p>
              </div>
            </div>
          )}

          {/* Download and reset buttons */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <button
              onClick={downloadResult}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white font-bold text-sm shadow-lg shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={resetTool}
              className="py-4 px-6 rounded-2xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Convert Another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
