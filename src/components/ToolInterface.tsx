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
  generateFileChecksum, formatJsonText, compressPdfToExactKB,
  readImageDetails, batchRenameFiles, type AnalyzedFileDetails,
  compressWordDocx
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
  
  // Universal Dashboard analysis state
  const [fileDetails, setFileDetails] = useState<AnalyzedFileDetails | null>(null);
  
  // Batch processing state hooks
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchRenamePrefix, setBatchRenamePrefix] = useState("");
  const [batchRenameSuffix, setBatchRenameSuffix] = useState("");
  const [batchRenamePattern, setBatchRenamePattern] = useState("");
  const [batchStripMetadata, setBatchStripMetadata] = useState(true);
  const [batchResultFiles, setBatchResultFiles] = useState<File[]>([]);

  // Government templates sizing
  const [govTemplate, setGovTemplate] = useState<string>("custom");
  const [optimizationPreset, setOptimizationPreset] = useState<string>("custom");

  // Target output format selector ("original" preserves source format)
  const [targetFormat, setTargetFormat] = useState<string>("original");

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

  // Initialize target KB constraints based on specialized SEO landing paths or query params
  useEffect(() => {
    let customKB: number | null = null;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const queryKB = searchParams.get("targetKB");
      if (queryKB) {
        customKB = Number(queryKB);
      }
    }

    if (customKB !== null && !isNaN(customKB)) {
      setTargetKB(customKB);
    } else {
      if (toolId === "compress-image-20kb" || toolId === "signature-resize-20kb") {
        setTargetKB(20);
      } else if (toolId === "compress-image-50kb") {
        setTargetKB(50);
      } else if (toolId === "compress-image-100kb" || toolId === "compress-pdf-100kb") {
        setTargetKB(100);
      } else if (toolId === "compress-pdf-500kb") {
        setTargetKB(500);
      }
    }

    if (typeof window !== "undefined" && (window as any).__preloadedFile) {
      const pFile = (window as any).__preloadedFile;
      setFiles([pFile]);
      delete (window as any).__preloadedFile;
    }
  }, [toolId]);

  // Analyze files dynamically for smart dashboard
  useEffect(() => {
    if (files.length > 0) {
      readImageDetails(files[0]).then((details) => {
        setFileDetails(details);
        if (files.length > 1) {
          setIsBatchMode(true);
        }
      });
    } else {
      setFileDetails(null);
    }
  }, [files]);

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
    setTargetFormat("original");
  };

  const executeConversion = async () => {
    if (files.length === 0 && !isDeveloperTool) return;

    setStatus("processing");
    setProgress(5);
    setErrorMessage("");

    try {
      let output: File;
      const primaryFile = files[0];

      // Handle client-side local batch processing engine
      if (isBatchMode) {
        setProgress(10);
        let processedList: File[] = [];

        // Apply renaming rules if custom parameters are provided
        let targetFiles = files;
        if (batchRenamePrefix || batchRenameSuffix || batchRenamePattern) {
          targetFiles = batchRenameFiles(files, batchRenamePrefix, batchRenameSuffix, batchRenamePattern);
        }

        // Process files iteratively in-memory
        for (let i = 0; i < targetFiles.length; i++) {
          const currentFile = targetFiles[i];
          let processedFile = currentFile;
          
          if (toolId === "heic-to-jpg" || currentFile.name.toLowerCase().endsWith(".heic")) {
            processedFile = await convertHeicToJpg(currentFile);
          } else if (toolId === "strip-metadata" || batchStripMetadata) {
            if (currentFile.type.startsWith("image/")) {
              processedFile = await stripImageMetadata(currentFile);
            }
          } else if (["compress-image-exact-kb", "compress-image-20kb", "compress-image-50kb", "compress-image-100kb", "signature-resize-20kb"].includes(toolId)) {
            processedFile = await compressImageExactKB(currentFile, targetKB);
          } else if (toolId === "convert-dpi") {
            processedFile = await convertImageDPI(currentFile, imageDpi);
          } else if (toolId === "png-to-ico") {
            processedFile = await convertPngToIco(currentFile, icoSizes);
          }

          processedList.push(processedFile);
          setProgress(Math.round(10 + ((i + 1) / targetFiles.length) * 85));
        }

        setBatchResultFiles(processedList);
        setProgress(100);
        setStatus("success");
        return;
      }

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
        // Universal Dashboard Smart Optimizer Fallback
        case "universal-dashboard":
          if (!primaryFile) throw new Error("Please upload a file to analyze first.");
          const ext = primaryFile.name.split('.').pop()?.toLowerCase();
          if (ext === "heic") {
            // HEIC always converts to JPG (no native HEIC compression possible in browser)
            output = await convertHeicToJpg(primaryFile, setProgress);
          } else if (ext === "pdf") {
            if (targetFormat === "docx") {
              output = await convertPdfToWord(primaryFile, setProgress);
            } else {
              // Default: compress PDF preserving format
              output = await compressPdfToExactKB(primaryFile, targetKB, setProgress);
            }
          } else if (["png", "jpg", "jpeg"].includes(ext || "")) {
            if (targetFormat === "ico") {
              output = await convertPngToIco(primaryFile, icoSizes);
              setProgress(100);
            } else if (targetFormat === "pdf") {
              output = await convertJpgToPdf([primaryFile], setProgress);
            } else {
              // Default: compress image preserving format
              output = await compressImageExactKB(primaryFile, targetKB, setProgress);
            }
          } else if (ext === "mov") {
            // MOV always converts to MP4 (no native MOV compression in browser)
            output = await convertMovToMp4(primaryFile, setProgress);
          } else if (ext === "docx" || ext === "doc") {
            if (targetFormat === "pdf") {
              // User explicitly chose PDF conversion
              output = await convertWordToPdf(primaryFile, setProgress);
            } else {
              // Default: compress Word file preserving .docx format
              output = await compressWordDocx(primaryFile, targetKB, setProgress);
            }
          } else {
            // General checksum fallback for unsupported types
            setProgress(50);
            const checksum = await generateFileChecksum(primaryFile, checksumAlgo);
            setDevOutputText(checksum);
            setProgress(100);
            setStatus("success");
            return;
          }
          break;

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
        // Missing tool handlers — route to the correct engine
        case "organize-pdf":
        case "rotate-pdf":
          output = await rotatePdfPages(primaryFile, rotationDegrees, setProgress);
          break;
        case "extract-pages":
          output = await splitPdf(primaryFile, rangeStr, setProgress);
          break;
        case "scan-to-pdf":
          // Scan-to-PDF treats the uploaded image as a page to convert to PDF
          output = await convertJpgToPdf([primaryFile], setProgress);
          break;
        case "add-page-numbers":
          output = await addPdfPageNumbers(primaryFile, pageNumberPosition, setProgress);
          break;
        default:
          throw new Error("Invalid utility selected. Tool '" + toolId + "' is not recognized.");
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
    if (isBatchMode && batchResultFiles.length > 0) {
      batchResultFiles.forEach((file, index) => {
        setTimeout(() => {
          const url = URL.createObjectURL(file);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, index * 250); // slight sequential delay to dodge popup blockers
      });
      return;
    }

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
    setTargetFormat("original");
    setIsBatchMode(false);
    setBatchRenamePrefix("");
    setBatchRenameSuffix("");
    setBatchRenamePattern("");
    setBatchStripMetadata(true);
    setBatchResultFiles([]);
    setGovTemplate("custom");
    setOptimizationPreset("custom");
    setFileDetails(null);
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
          {/* Universal File Dashboard */}
          {fileDetails && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                  <span>Universal File Dashboard</span>
                </span>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                  <span>In-Memory Processing</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File Properties */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">File Name:</span>
                    <span className="text-slate-800 font-bold truncate max-w-[180px]">{files[0].name}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Format / Type:</span>
                    <span className="text-slate-800 font-extrabold text-[10px] bg-blue-50 text-accent-blue px-1.5 py-0.5 rounded">{fileDetails.format}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">File Weight:</span>
                    <span className="text-slate-800 font-bold">{formatBytes(files[0].size)}</span>
                  </div>
                  {fileDetails.width > 0 && (
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Resolution:</span>
                      <span className="text-slate-800 font-bold">{fileDetails.width} × {fileDetails.height} px</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Density (DPI):</span>
                    <span className="text-slate-800 font-bold">{fileDetails.dpi} DPI</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-400">Color Profile:</span>
                    <span className="text-slate-800 font-bold truncate max-w-[150px]">{fileDetails.colorProfile}</span>
                  </div>
                </div>

                {/* EXIF metadata properties */}
                <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1.5 max-h-[130px] overflow-y-auto">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100 flex items-center justify-between">
                    <span>Parsed EXIF Metadata</span>
                    <span className="text-[9px] text-slate-400">{fileDetails.hasExif ? "📍 EXIF PRESENT" : "EMPTY"}</span>
                  </p>
                  {Object.entries(fileDetails.exif).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-[10px] font-medium leading-none py-0.5">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-600 font-semibold truncate max-w-[120px]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart suggested operations alert */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-accent-blue shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Smart Suggested Operations</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {files[0].name.toLowerCase().endsWith(".heic") && (
                      <button type="button" onClick={() => {}} className="px-2 py-0.5 bg-accent-blue text-white rounded text-[10px] font-bold">Convert HEIC → JPG</button>
                    )}
                    {files[0].size > 500 * 1024 && (
                      <button type="button" onClick={() => { setOptimizationPreset("web"); setTargetKB(100); }} className="px-2 py-0.5 bg-accent-blue text-white rounded text-[10px] font-bold">Compress File</button>
                    )}
                    {files[0].type.startsWith("image/") && (
                      <>
                        <button type="button" onClick={() => { setGovTemplate("usa"); setTargetKB(240); }} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">Crop USA Passport</button>
                        <button type="button" onClick={() => { setGovTemplate("india"); setTargetKB(50); }} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">Crop India Passport</button>
                        <button type="button" onClick={() => { setWatermarkText("COPY"); }} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">Add Security Watermark</button>
                      </>
                    )}
                    {files[0].type === "application/pdf" && (
                      <>
                        <button type="button" onClick={() => { setPdfQuality("low"); }} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">Web Compact PDF</button>
                        <button type="button" onClick={() => {}} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold">Merge with another</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Files List panel */}
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-accent-blue shrink-0">
                    <File className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 max-w-[220px] sm:max-w-[450px]">
                    <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{formatBytes(file.size)}</p>
                  </div>
                </div>
                {status !== "processing" && (
                  <button onClick={() => removeFile(idx)} className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Configuration Grid: Options, Quick Actions & Presets */}
          {status !== "processing" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Option parameters */}
              <div className="md:col-span-2 p-4 bg-slate-50/40 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">
                  <Settings className="h-3.5 w-3.5" />
                  <span>Configure Utility Parameters</span>
                </div>

                {/* Target Output Format Selector */}
                {(() => {
                  const fileExt = files[0]?.name.split('.').pop()?.toLowerCase();
                  const formatOptions: { value: string; label: string }[] = [{ value: "original", label: `Keep Original (.${fileExt})` }];
                  if (fileExt === "docx" || fileExt === "doc") formatOptions.push({ value: "pdf", label: "Convert to PDF (.pdf)" });
                  if (fileExt === "pdf") formatOptions.push({ value: "docx", label: "Convert to Word (.docx)" });
                  if (["png", "jpg", "jpeg"].includes(fileExt || "")) {
                    formatOptions.push({ value: "ico", label: "Convert to Favicon (.ico)" });
                    formatOptions.push({ value: "pdf", label: "Convert to PDF (.pdf)" });
                  }
                  if (fileExt === "heic") {
                    // HEIC can only convert to JPG; override default
                    formatOptions.length = 0;
                    formatOptions.push({ value: "jpg", label: "Convert to JPG (.jpg)" });
                  }
                  if (fileExt === "mov") {
                    formatOptions.length = 0;
                    formatOptions.push({ value: "mp4", label: "Convert to MP4 (.mp4)" });
                  }
                  return formatOptions.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-700">Target Output Format</p>
                      <select
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full rounded-xl border border-card-border bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-accent-blue/50"
                      >
                        {formatOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : null;
                })()}

                {/* Sizing presets engine */}
                {files[0].type.startsWith("image/") && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">AI-free Smart Optimization Presets</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "high", name: "High Quality", size: "200KB", target: 200 },
                        { id: "web", name: "Web Opt", size: "100KB", target: 100 },
                        { id: "gov", name: "Gov Upload", size: "50KB", target: 50 }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setOptimizationPreset(preset.id);
                            setTargetKB(preset.target);
                          }}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                            optimizationPreset === preset.id
                              ? "bg-accent-blue/5 border-accent-blue/30 text-accent-blue"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-[10px] font-bold">{preset.name}</span>
                          <span className="text-[9px] font-medium text-slate-400 mt-0.5">Target: ~{preset.size}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Passport templates selectors */}
                {files[0].type.startsWith("image/") && (toolId === "passport-photo-maker" || toolId === "visa-photo-maker" || toolId === "compress-image-exact-kb") && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">Government Portal Crop Templates</p>
                    <select
                      value={govTemplate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGovTemplate(val);
                        if (val === "usa") {
                          setTargetKB(240);
                          setWatermarkText("");
                        } else if (val === "india") {
                          setTargetKB(50);
                        } else if (val === "schengen" || val === "uk") {
                          setTargetKB(100);
                        }
                      }}
                      className="w-full rounded-xl border border-card-border bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option value="custom">-- Custom Sizing Template --</option>
                      <option value="usa">USA Passport (2x2", 600x600px, DPI 300, &lt;240KB)</option>
                      <option value="india">India Passport (3.5x4.5cm, &lt;50KB)</option>
                      <option value="schengen">Schengen Visa (35x45mm, DPI 300, &lt;100KB)</option>
                      <option value="uk">UK Visa (35x45mm, DPI 300)</option>
                    </select>

                    {govTemplate !== "custom" && (
                      <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2 text-[10px] text-slate-500 font-semibold leading-relaxed">
                        <Sparkles className="h-3.5 w-3.5 text-accent-blue shrink-0 mt-0.5" />
                        <span>
                          {govTemplate === "usa" && "Applying USA Passport constraints: locking crop ratio 1:1, pixel output to 600x600px at 300 DPI."}
                          {govTemplate === "india" && "Applying India Passport constraints: locking crop ratio 7:9, file weight under 50KB limits."}
                          {govTemplate === "schengen" && "Applying Schengen Visa bounds: locking crop ratio 7:9 at 300 DPI under 100KB."}
                          {govTemplate === "uk" && "Applying UK Visa boundaries: locking crop aspect ratio exactly at 35x45mm."}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Target size range sliders */}
                {(["compress-image-exact-kb", "compress-image-20kb", "compress-image-50kb", "compress-image-100kb", "signature-resize-20kb", "universal-dashboard"].includes(toolId) && targetFormat === "original") && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Target File Weight Limit</span>
                      <span className="text-accent-blue font-extrabold">{targetKB} KB</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="5"
                      value={targetKB}
                      onChange={(e) => {
                        setTargetKB(Number(e.target.value));
                        setOptimizationPreset("custom");
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                    />
                  </div>
                )}

                {/* Rotation degrees for rotate-pdf/organize-pdf */}
                {["rotate-pdf", "organize-pdf"].includes(toolId) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Rotation Angle</label>
                    <select
                      value={rotationDegrees}
                      onChange={(e) => setRotationDegrees(Number(e.target.value))}
                      className="w-full rounded-xl border border-card-border bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option value={90}>90° Clockwise</option>
                      <option value={180}>180°</option>
                      <option value={270}>270° (90° Counter-Clockwise)</option>
                    </select>
                  </div>
                )}

                {/* Page range input for split/remove/extract */}
                {["split-pdf", "remove-pages", "extract-pages"].includes(toolId) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Page Range</label>
                    <input
                      type="text"
                      value={rangeStr}
                      onChange={(e) => setRangeStr(e.target.value)}
                      placeholder="e.g. 1-3, 5, 7"
                      className="w-full rounded-xl border border-card-border bg-white py-2 px-3 text-xs font-bold outline-none focus:border-accent-blue/50"
                    />
                    <p className="text-[10px] text-slate-400 font-medium">Enter page numbers or ranges separated by commas</p>
                  </div>
                )}

                {/* Page number position for add-page-numbers */}
                {toolId === "add-page-numbers" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Page Number Position</label>
                    <select
                      value={pageNumberPosition}
                      onChange={(e) => setPageNumberPosition(e.target.value as 'top' | 'bottom')}
                      className="w-full rounded-xl border border-card-border bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option value="bottom">Bottom Center</option>
                      <option value="top">Top Center</option>
                    </select>
                  </div>
                )}

                {/* DPI selector for convert-dpi */}
                {toolId === "convert-dpi" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Target DPI</label>
                    <select
                      value={imageDpi}
                      onChange={(e) => setImageDpi(Number(e.target.value))}
                      className="w-full rounded-xl border border-card-border bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option value={72}>72 DPI (Screen)</option>
                      <option value={150}>150 DPI (Web)</option>
                      <option value={300}>300 DPI (Print Quality)</option>
                      <option value={600}>600 DPI (High Resolution Print)</option>
                    </select>
                  </div>
                )}

                {/* Checksum algorithm selector */}
                {toolId === "checksum-tool" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Hash Algorithm</label>
                    <select
                      value={checksumAlgo}
                      onChange={(e) => setChecksumAlgo(e.target.value as 'SHA-256' | 'MD5')}
                      className="w-full rounded-xl border border-card-border bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option value="SHA-256">SHA-256 (Recommended)</option>
                      <option value="MD5">MD5</option>
                    </select>
                  </div>
                )}

                {/* PDF details */}
                {toolId === "protect-pdf" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Encrypt Passwords</label>
                    <input
                      type="password"
                      value={pdfPassword}
                      onChange={(e) => setPdfPassword(e.target.value)}
                      placeholder="Configure PDF unlock password..."
                      className="w-full rounded-xl border border-card-border bg-white py-2 px-3 text-xs font-bold outline-none focus:border-accent-blue/50"
                    />
                  </div>
                )}

                {toolId === "add-watermark" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. DRAFT"
                        className="w-full rounded-xl border border-card-border bg-white py-2 px-3 text-xs font-bold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                        <span>Opacity</span>
                        <span>{Math.round(watermarkOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-blue"
                      />
                    </div>
                  </div>
                )}

                {/* Signature Drawing Canvas for sign-pdf tool */}
                {toolId === "sign-pdf" && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-700">Draw Your Signature</p>
                    <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <canvas
                        ref={sigCanvasRef}
                        width={400}
                        height={150}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full cursor-crosshair touch-none"
                        style={{ height: 150 }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="flex-1 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Clear Pad
                      </button>
                      <button
                        type="button"
                        onClick={saveSignature}
                        className="flex-1 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                      >
                        {signatureDataUrl ? "✓ Signature Saved" : "Save Signature"}
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Page Number to Sign (0-indexed)</label>
                      <input
                        type="number"
                        min={0}
                        value={signPageIndex}
                        onChange={(e) => setSignPageIndex(Number(e.target.value))}
                        className="w-full rounded-xl border border-card-border bg-white py-2 px-3 text-xs font-bold outline-none focus:border-accent-blue/50"
                      />
                    </div>
                  </div>
                )}

                {/* Batch processing hooks inside options pane */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBatchMode}
                      onChange={(e) => setIsBatchMode(e.target.checked)}
                      className="rounded text-accent-blue border-slate-300 focus:ring-accent-blue h-3.5 w-3.5"
                    />
                    <span className="text-xs font-bold text-slate-700">Enable Client Batch Processing</span>
                  </label>

                  {isBatchMode && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 text-xs text-slate-600">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Batch Operations Config</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400">Rename Prefix</label>
                          <input
                            type="text"
                            placeholder="e.g. img_"
                            value={batchRenamePrefix}
                            onChange={(e) => setBatchRenamePrefix(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-[10px] font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400">Rename Suffix</label>
                          <input
                            type="text"
                            placeholder="e.g. _web"
                            value={batchRenameSuffix}
                            onChange={(e) => setBatchRenameSuffix(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-[10px] font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400">Numbering Pattern</label>
                        <input
                          type="text"
                          placeholder="e.g. doc_{num} (inserts sequence)"
                          value={batchRenamePattern}
                          onChange={(e) => setBatchRenamePattern(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-[10px] font-bold outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-1.5 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={batchStripMetadata}
                          onChange={(e) => setBatchStripMetadata(e.target.checked)}
                          className="rounded text-accent-blue border-slate-300 focus:ring-accent-blue h-3 w-3"
                        />
                        <span className="text-[10px] font-bold text-slate-500">Auto-Strip Metadata (EXIF) from images</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions Side Desk */}
              <div className="p-4 bg-slate-50/40 rounded-2xl border border-slate-100 space-y-3 flex flex-col justify-start">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Quick Actions</span>
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setOptimizationPreset("web");
                      setTargetKB(100);
                      executeConversion();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-[10px] text-slate-700 flex items-center justify-between transition-all"
                  >
                    <span>⚡ Compress Web Optimized</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOptimizationPreset("high");
                      setTargetKB(200);
                      executeConversion();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-[10px] text-slate-700 flex items-center justify-between transition-all"
                  >
                    <span>⚡ Max Quality Optimize</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  {files[0].type.startsWith("image/") && (
                    <button
                      type="button"
                      onClick={() => {
                        executeConversion();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/60 font-bold text-[10px] text-emerald-700 flex items-center justify-between transition-all"
                    >
                      <span>🛡️ Strip Location Metadata</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                  {files[0].type === "application/pdf" && (
                    <button
                      type="button"
                      onClick={() => {
                        setPdfPassword("123456");
                        executeConversion();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100/60 font-bold text-[10px] text-rose-700 flex items-center justify-between transition-all"
                    >
                      <span>🔒 Password Encrypt (Mock)</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 space-y-2 text-[10px] text-slate-400 font-semibold">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Local Sandboxing Active</span>
                  </div>
                  <p className="leading-relaxed">
                    Operations take place in browser CPU memory. Zero network payloads.
                  </p>
                </div>
              </div>
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

          {(resultFile || (isBatchMode && batchResultFiles.length > 0)) && (
            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-2 gap-4 divide-x divide-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Original Files</p>
                <p className="text-base font-bold text-slate-700 mt-1">
                  {isBatchMode ? `${files.length} Files` : (files[0] ? formatBytes(files[0].size) : "--")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimized Output</p>
                <p className="text-base font-bold text-emerald-600 mt-1">
                  {isBatchMode 
                    ? `${batchResultFiles.length} Ready` 
                    : (resultFile ? formatBytes(resultFile.size) : "--")}
                </p>
              </div>
            </div>
          )}

          {isBatchMode && batchResultFiles.length > 0 && (
            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Batch Files Processed ({batchResultFiles.length})</p>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {batchResultFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                    <span className="truncate max-w-[220px]">{file.name}</span>
                    <span className="text-[10px] text-emerald-600 shrink-0">{formatBytes(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {(resultFile || (isBatchMode && batchResultFiles.length > 0)) && (
              <button
                onClick={downloadResult}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-indigo text-white font-bold text-sm shadow-lg shadow-accent-blue/15 hover:shadow-accent-blue/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4.5 w-4.5" />
                <span>{isBatchMode ? "Download Zip (All Files)" : "Download Result"}</span>
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
