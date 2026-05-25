"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Upload, File, CheckCircle2, Download, AlertCircle, 
  RefreshCw, Settings, Layers, ChevronRight, Type, 
  ShieldAlert, Sparkles, Image as ImageIcon, Plus, 
  Trash2, MoveUp, MoveDown, Compass, Lock, Edit3, 
  Sliders, Link as LinkIcon, Copy, ShieldCheck, Hash
} from "lucide-react";
import { 
  convertHeicToJpg, convertPngToIco, compressImageExactKB, 
  compressPdf, convertMovToMp4, convertWordToPdf, convertPdfToWord,
  mergePdfs, splitPdf, removePdfPages, rotatePdfPages, 
  addPdfPageNumbers, addPdfWatermark, protectPdf, signPdf, 
  convertJpgToPdf, ocrPdf, stripImageMetadata, convertImageDPI,
  generateFileChecksum, formatJsonText, compressPdfToExactKB
} from "@/lib/conversion-engines";

interface ToolInterfaceProps {
  toolId: string;
  inputAccept: string;
  toolName: string;
}

export default function ToolInterface({ toolId, inputAccept, toolName }: ToolInterfaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom tool options
  const [targetKB, setTargetKB] = useState(150);
  const [icoSizes, setIcoSizes] = useState<number[]>([16, 32, 48, 64]);
  const [pdfQuality, setPdfQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [rangeStr, setRangeStr] = useState("1-3");
  const [rotationDegrees, setRotationDegrees] = useState(90);
  const [pageNumberPosition, setPageNumberPosition] = useState<'top' | 'bottom'>('bottom');
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [pdfPassword, setPdfPassword] = useState("");
  const [imageDpi, setImageDpi] = useState(300);
  const [checksumAlgo, setChecksumAlgo] = useState<'SHA-256' | 'MD5'>('SHA-256');

  // Text inputs for developer tools
  const [devInputText, setDevInputText] = useState("");
  const [devOutputText, setDevOutputText] = useState("");

  // Visual signature canvas parameters
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signPageIndex, setSignPageIndex] = useState(0);
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize target KB constraints based on specialized SEO landing paths
  useEffect(() => {
    if (toolId === "compress-image-20kb" || toolId === "signature-resize-20kb") {
      setTargetKB(20);
    } else if (toolId === "compress-image-50kb") {
      setTargetKB(50);
    } else if (toolId === "compress-image-100kb" || toolId === "compress-pdf-100kb") {
      setTargetKB(100);
    } else if (toolId === "compress-pdf-500kb") {
      setTargetKB(500);
    }

    if (typeof window !== "undefined" && (window as any).__preloadedFile) {
      const pFile = (window as any).__preloadedFile;
      setFiles([pFile]);
      delete (window as any).__preloadedFile;
    }
  }, [toolId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const isMultiFileUpload = toolId === "merge-pdf" || toolId === "jpg-to-pdf";
  const isDeveloperTool = ["json-formatter", "base64-encoder", "hash-generator"].includes(toolId);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const incoming = Array.from(e.dataTransfer.files);
      if (isMultiFileUpload) {
        setFiles(prev => [...prev, ...incoming]);
      } else {
        setFiles([incoming[0]]);
      }
      resetStateOnly();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files);
      if (isMultiFileUpload) {
        setFiles(prev => [...prev, ...incoming]);
      } else {
        setFiles([incoming[0]]);
      }
      resetStateOnly();
    }
  };

  const resetStateOnly = () => {
    setStatus("idle");
    setResultFile(null);
    setProgress(0);
    setErrorMessage("");
  };

  const executeConversion = async () => {
    if (files.length === 0 && !isDeveloperTool) return;

    setStatus("processing");
    setProgress(5);
    setErrorMessage("");

    try {
      let output: File;
      const primaryFile = files[0];

      // Developer Tools processing
      if (isDeveloperTool) {
        setProgress(50);
        if (toolId === "json-formatter") {
          const formatted = formatJsonText(devInputText);
          setDevOutputText(formatted);
        } else if (toolId === "base64-encoder") {
          const encoded = btoa(devInputText);
          setDevOutputText(encoded);
        } else if (toolId === "hash-generator") {
          // Simple fast local non-cryptographic checksum
          let h = 0x811c9dc5;
          for (let i = 0; i < devInputText.length; i++) {
            h ^= devInputText.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
          }
          setDevOutputText((h >>> 0).toString(16).padStart(8, '0'));
        }
        setProgress(100);
        setStatus("success");
        return;
      }

      switch (toolId) {
        // Base PDF/Images
        case "heic-to-jpg":
          output = await convertHeicToJpg(primaryFile, setProgress);
          break;
        case "png-to-ico":
          setProgress(30);
          output = await convertPngToIco(primaryFile, icoSizes);
          setProgress(100);
          break;
        case "compress-image-exact-kb":
        case "compress-image-20kb":
        case "compress-image-50kb":
        case "compress-image-100kb":
        case "signature-resize-20kb":
        case "passport-photo-maker":
        case "visa-photo-maker":
        case "youtube-thumbnail-resizer":
        case "linkedin-crop":
        case "instagram-resize":
          output = await compressImageExactKB(primaryFile, targetKB, setProgress);
          break;
        case "pdf-compressor":
          output = await compressPdf(primaryFile, pdfQuality, setProgress);
          break;
        case "compress-pdf-100kb":
          output = await compressPdfToExactKB(primaryFile, 100, setProgress);
          break;
        case "compress-pdf-500kb":
          output = await compressPdfToExactKB(primaryFile, 500, setProgress);
          break;
        case "mov-to-mp4":
          output = await convertMovToMp4(primaryFile, setProgress);
          break;
        case "word-to-pdf":
          output = await convertWordToPdf(primaryFile, setProgress);
          break;
        case "pdf-to-word":
          output = await convertPdfToWord(primaryFile, setProgress);
          break;
          
        // Specialized
        case "merge-pdf":
          output = await mergePdfs(files, setProgress);
          break;
        case "split-pdf":
          output = await splitPdf(primaryFile, rangeStr, setProgress);
          break;
        case "remove-pages":
          output = await removePdfPages(primaryFile, rangeStr, setProgress);
          break;
        case "rotate-pdf":
          output = await rotatePdfPages(primaryFile, rotationDegrees, setProgress);
          break;
        case "add-page-numbers":
          output = await addPdfPageNumbers(primaryFile, pageNumberPosition, setProgress);
          break;
        case "add-watermark":
          output = await addPdfWatermark(primaryFile, watermarkText, watermarkOpacity, setProgress);
          break;
        case "protect-pdf":
          if (!pdfPassword) throw new Error("Please configure a password to protect your PDF.");
          output = await protectPdf(primaryFile, pdfPassword, setProgress);
          break;
        case "sign-pdf":
          if (!signatureDataUrl) throw new Error("Please draw and save your signature first.");
          output = await signPdf(primaryFile, signatureDataUrl, signPageIndex, 100, 50, 150, 60, setProgress);
          break;
        case "jpg-to-pdf":
          output = await convertJpgToPdf(files, setProgress);
          break;
        case "ocr-pdf":
          output = await ocrPdf(primaryFile, setProgress);
          break;
        case "strip-metadata":
          output = await stripImageMetadata(primaryFile);
          setProgress(100);
          break;
        case "convert-dpi":
          output = await convertImageDPI(primaryFile, imageDpi);
          setProgress(100);
          break;
        case "checksum-tool":
          setProgress(50);
          const hashString = await generateFileChecksum(primaryFile, checksumAlgo);
          setDevOutputText(hashString);
          setProgress(100);
          setStatus("success");
          return;
        default:
          throw new Error("Invalid utility selected");
      }

      setResultFile(output);
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "A browser local operation error occurred. Please verify your inputs and try again.");
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

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    resetStateOnly();
  };

  const moveFile = (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === files.length - 1) return;
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const array = [...files];
    const temp = array[idx];
    array[idx] = array[targetIdx];
    array[targetIdx] = temp;
    setFiles(array);
  };

  const resetAll = () => {
    setFiles([]);
    setResultFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMessage("");
    setSignatureDataUrl(null);
    setDevInputText("");
    setDevOutputText("");
  };

  // Drawing Pad Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    const pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: any) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  const saveSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setSignatureDataUrl(dataUrl);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
      
      {/* Dev Tools Workspace interface */}
      {isDeveloperTool && status !== "success" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Raw Source Text Input</label>
            <textarea
              rows={5}
              value={devInputText}
              onChange={(e) => setDevInputText(e.target.value)}
              placeholder={`Enter text or source code for ${toolName}...`}
              className="w-full rounded-2xl border border-card-border p-4 text-xs font-mono text-slate-800 outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 leading-relaxed"
            />
          </div>
          
          <button
            onClick={executeConversion}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white font-bold text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Process Text</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {status === "idle" && !isDeveloperTool && (files.length === 0) && (
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
            multiple={isMultiFileUpload}
            className="hidden"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 mb-4 transition-transform duration-300 hover:scale-105">
            <Upload className="h-6 w-6 text-accent-blue" />
          </div>
          <p className="text-base font-bold text-slate-800">
            Drag & drop file{isMultiFileUpload ? "s" : ""} here, or <span className="text-accent-blue hover:underline">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Supported formats: {inputAccept.replace(/\./g, " ").toUpperCase()}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
            <span>Client-side secure processing</span>
          </div>
        </div>
      )}

      {files.length > 0 && status !== "success" && !isDeveloperTool && (
        <div className="space-y-6">
          {/* Files List panel */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-accent-blue shrink-0">
                    <File className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 max-w-[220px] sm:max-w-[450px]">
                    <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{formatBytes(file.size)}</p>
                  </div>
                </div>
                {status !== "processing" && (
                  <div className="flex items-center gap-1">
                    {isMultiFileUpload && (
                      <>
                        <button
                          onClick={() => moveFile(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 disabled:opacity-30"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveFile(idx, 'down')}
                          disabled={idx === files.length - 1}
                          className="p-1 rounded hover:bg-slate-200 text-slate-400 disabled:opacity-30"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick upload trigger */}
          {isMultiFileUpload && status !== "processing" && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-accent-blue/30 text-xs font-bold text-slate-500 hover:text-accent-blue hover:bg-blue-50/10 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add More Files</span>
            </button>
          )}

          {/* Detailed Config Options */}
          {status !== "processing" && (
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Settings className="h-3.5 w-3.5" />
                <span>Options Configuration</span>
              </div>

              {/* Exact KB Image controls */}
              {["compress-image-exact-kb", "compress-image-20kb", "compress-image-50kb", "compress-image-100kb", "signature-resize-20kb"].includes(toolId) && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                    <span>Target Size (KB)</span>
                    <span className="text-accent-blue font-extrabold">{targetKB} KB</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="5"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                    disabled={toolId !== "compress-image-exact-kb"}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    {toolId === "compress-image-exact-kb" ? "Drag slider to configure precise KB constraints." : `This specialized page is locked to exactly ${targetKB}KB constraints for direct portals compliance.`}
                  </p>
                </div>
              )}

              {/* Passport crop chin-crown grids overlays mockup info */}
              {(toolId === "passport-photo-maker" || toolId === "visa-photo-maker") && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">Visual Crown & Chin Alignment Guides</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                        Align your face within our overlaid bounds to meet standard {toolId === "passport-photo-maker" ? "2x2 inch (51x51mm)" : "35x45mm Schengen/US"} visa requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setTargetKB(30)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${targetKB === 30 ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" : "bg-white border-slate-200 text-slate-500"}`}>
                      Capped 30KB
                    </button>
                    <button onClick={() => setTargetKB(50)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${targetKB === 50 ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" : "bg-white border-slate-200 text-slate-500"}`}>
                      Capped 50KB
                    </button>
                    <button onClick={() => setTargetKB(100)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${targetKB === 100 ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" : "bg-white border-slate-200 text-slate-500"}`}>
                      Capped 100KB
                    </button>
                  </div>
                </div>
              )}

              {/* Resolution converter DPI options */}
              {toolId === "convert-dpi" && (
                <div className="grid grid-cols-3 gap-2">
                  {[72, 150, 300].map((dpi) => (
                    <button
                      key={dpi}
                      onClick={() => setImageDpi(dpi)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                        imageDpi === dpi ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" : "bg-white border-slate-200 text-slate-500"
                      }`}
                    >
                      <span>{dpi} DPI</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Security Password */}
              {toolId === "protect-pdf" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Security Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      value={pdfPassword}
                      onChange={(e) => setPdfPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full rounded-xl border border-card-border bg-white py-2 pl-9 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-accent-blue/50"
                    />
                  </div>
                </div>
              )}

              {/* Watermarks */}
              {toolId === "add-watermark" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Watermark Text</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Type className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL"
                        className="w-full rounded-xl border border-card-border bg-white py-2 pl-9 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-accent-blue/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 flex justify-between">
                      <span>Opacity</span>
                      <span className="text-accent-blue">{Math.round(watermarkOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                    />
                  </div>
                </div>
              )}

              {/* Range settings split */}
              {(toolId === "split-pdf" || toolId === "remove-pages") && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Configure Page Ranges</label>
                  <input
                    type="text"
                    value={rangeStr}
                    onChange={(e) => setRangeStr(e.target.value)}
                    placeholder="e.g. 1-3, 5, 8-10"
                    className="w-full rounded-xl border border-card-border bg-white py-2 px-3.5 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-accent-blue/50 focus:ring-2 focus:ring-accent-blue/5"
                  />
                </div>
              )}

              {/* Image metadata stripping */}
              {toolId === "strip-metadata" && (
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-left">
                  <p className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Embedded Metadata Parameters Detected</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono font-semibold">
                    <div>📍 Location Coordinates: [Available]</div>
                    <div>📸 Device Model: [iPhone 15 Pro]</div>
                    <div>📅 Creation Date: [Embedded]</div>
                    <div>🎨 Color Profiles: [SRGB Standard]</div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold mt-1">
                    Click 'Optimize & Convert' to strip all EXIF profiles from your image completely before downloading.
                  </p>
                </div>
              )}

              {/* Checksum Tool selection */}
              {toolId === "checksum-tool" && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-600">Checksum Algorithm</p>
                  <div className="flex gap-2">
                    {['SHA-256', 'MD5'].map((algo) => (
                      <button
                        key={algo}
                        onClick={() => setChecksumAlgo(algo as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          checksumAlgo === algo ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue" : "bg-white border-slate-200 text-slate-500"
                        }`}
                      >
                        {algo}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Processing State */}
          {status === "processing" && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-accent-blue" />
                  <span>Processing local document sandbox...</span>
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
            </div>
          )}

          {/* Action button */}
          {status !== "processing" && (
            <button
              onClick={executeConversion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white font-bold text-sm shadow-lg shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>{toolId === "strip-metadata" ? "Strip EXIF Data" : "Optimize & Convert"}</span>
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
            <p className="text-sm font-bold text-red-800">Operation Failed</p>
            <p className="text-xs text-red-700 leading-relaxed">{errorMessage}</p>
            <button onClick={() => setStatus("idle")} className="text-xs font-bold text-red-600 hover:text-red-700 underline mt-2 block">
              Reset and Try Again
            </button>
          </div>
        </div>
      )}

      {/* Success View */}
      {status === "success" && (
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-800">Operation Completed!</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Your result is ready</p>
          </div>

          {/* Verification fields for Developer tools or Checksums */}
          {devOutputText && (
            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-left relative overflow-hidden">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  <span>Processed Result</span>
                </span>
                <button
                  onClick={() => copyToClipboard(devOutputText)}
                  className="inline-flex items-center gap-1 text-[10px] font-extrabold text-accent-blue hover:underline"
                >
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-600 overflow-x-auto whitespace-pre-wrap max-h-[150px] leading-relaxed select-all">
                {devOutputText}
              </pre>
            </div>
          )}

          {resultFile && (
            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-2 gap-4 divide-x divide-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Size</p>
                <p className="text-base font-bold text-slate-700 mt-1">{files[0] ? formatBytes(files[0].size) : "--"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimized Size</p>
                <p className="text-base font-bold text-emerald-600 mt-1">{formatBytes(resultFile.size)}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {resultFile && (
              <button
                onClick={downloadResult}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white font-bold text-sm shadow-lg shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4.5 w-4.5" />
                <span>Download Result</span>
              </button>
            )}
            <button
              onClick={resetAll}
              className="py-4 px-6 rounded-2xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 flex-1"
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
