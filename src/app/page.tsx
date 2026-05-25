import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Layers, FileDown, 
  FileUp, FileText, Image as ImageIcon, Video, Minimize2, 
  HelpCircle, Compass, Lock, Sliders, Type, Sparkles, Plus
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AdPlaceholder from "@/components/AdPlaceholder";
import PrivacySection from "@/components/PrivacySection";

export const metadata: Metadata = {
  title: "ConvertOrbit - 100% Free & Secure Online PDF Tools",
  description: "Fast, Secure and Free File Tools for Everyone. Merge, Split, Compress, Convert, Edit, and Sign PDF documents 100% client-side inside your browser safely.",
  alternates: {
    canonical: "https://convertorbit.com",
  },
  openGraph: {
    title: "ConvertOrbit - Secure Client-Side PDF Tools Suite",
    description: "Convert, Compress, Edit, and Optimize PDF Documents Instantly. Safe local browser processing ensures zero file uploads.",
    url: "https://convertorbit.com",
    siteName: "ConvertOrbit",
    type: "website",
  },
};

interface ToolInfo {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

interface CategoryInfo {
  title: string;
  icon: React.ReactNode;
  desc: string;
  tools: ToolInfo[];
}

const CATEGORIES: CategoryInfo[] = [
  {
    title: "Organize PDF",
    icon: <Layers className="h-5 w-5 text-indigo-600" />,
    desc: "Reorder, combine, split, or extract pages.",
    tools: [
      { id: "merge-pdf", name: "Merge PDF", desc: "Combine multiple files into a single PDF.", icon: <Layers className="h-4 w-4 text-indigo-500" /> },
      { id: "split-pdf", name: "Split PDF", desc: "Extract specific page ranges from a PDF.", icon: <FileText className="h-4 w-4 text-blue-500" /> },
      { id: "remove-pages", name: "Remove pages", desc: "Delete unwanted pages from documents.", icon: <FileText className="h-4 w-4 text-red-500" /> },
      { id: "extract-pages", name: "Extract pages", desc: "Save custom page selections as standalone PDFs.", icon: <FileText className="h-4 w-4 text-sky-500" /> },
      { id: "organize-pdf", name: "Organize PDF", desc: "Reorder, delete, and rotate document pages.", icon: <Sliders className="h-4 w-4 text-indigo-500" /> },
      { id: "scan-to-pdf", name: "Scan to PDF", desc: "Compile camera snapshots directly into PDFs.", icon: <ImageIcon className="h-4 w-4 text-sky-500" /> },
    ]
  },
  {
    title: "Optimize PDF",
    icon: <FileDown className="h-5 w-5 text-emerald-600" />,
    desc: "Compress, fix, or run scans on document structures.",
    tools: [
      { id: "pdf-compressor", name: "Compress PDF", desc: "Reduce PDF storage size client-side.", icon: <FileDown className="h-4 w-4 text-emerald-500" /> },
      { id: "repair-pdf", name: "Repair PDF", desc: "Scan and fix damaged or corrupted PDFs.", icon: <FileText className="h-4 w-4 text-rose-500" /> },
      { id: "ocr-pdf", name: "OCR PDF", desc: "Make scanned PDF pages fully searchable.", icon: <Sparkles className="h-4 w-4 text-blue-500" /> },
    ]
  },
  {
    title: "Convert to PDF",
    icon: <FileUp className="h-5 w-5 text-blue-600" />,
    desc: "Compile external files into standardized PDFs.",
    tools: [
      { id: "jpg-to-pdf", name: "JPG to PDF", desc: "Combine multiple images into a single PDF.", icon: <ImageIcon className="h-4 w-4 text-blue-500" /> },
      { id: "word-to-pdf", name: "Word to PDF", desc: "Convert Word DOCX documents into PDF.", icon: <FileText className="h-4 w-4 text-sky-500" /> },
      { id: "ppt-to-pdf", name: "PowerPoint to PDF", desc: "Transcode PPTX slides into PDF slides.", icon: <Layers className="h-4 w-4 text-blue-500" /> },
      { id: "excel-to-pdf", name: "Excel to PDF", desc: "Transform spreadsheets sheets into PDFs.", icon: <Sliders className="h-4 w-4 text-sky-500" /> },
      { id: "html-to-pdf", name: "HTML to PDF", desc: "Render source HTML codes as PDF pages.", icon: <FileText className="h-4 w-4 text-indigo-500" /> },
    ]
  },
  {
    title: "Convert from PDF",
    icon: <FileText className="h-5 w-5 text-indigo-600" />,
    desc: "Export PDF layouts back into office formats.",
    tools: [
      { id: "pdf-to-jpg", name: "PDF to JPG", desc: "Render PDF page sheets as high-res images.", icon: <ImageIcon className="h-4 w-4 text-sky-500" /> },
      { id: "pdf-to-word", name: "PDF to Word", desc: "Extract layout text to editable DOCX format.", icon: <FileText className="h-4 w-4 text-blue-500" /> },
      { id: "pdf-to-ppt", name: "PDF to PowerPoint", desc: "Convert document sheets to PPTX slides.", icon: <Layers className="h-4 w-4 text-indigo-500" /> },
      { id: "pdf-to-excel", name: "PDF to Excel", desc: "Export page data grids into XLS tables.", icon: <Sliders className="h-4 w-4 text-sky-500" /> },
      { id: "pdf-to-pdfa", name: "PDF to PDF/A", desc: "Save PDFs for long-term legal archiving.", icon: <ShieldCheck className="h-4 w-4 text-emerald-500" /> },
    ]
  },
  {
    title: "Edit PDF",
    icon: <Type className="h-5 w-5 text-sky-600" />,
    desc: "Add watermarks, rotations, page numbers, or crops.",
    tools: [
      { id: "rotate-pdf", name: "Rotate PDF", desc: "Rotate individual or all pages instantly.", icon: <Compass className="h-4 w-4 text-indigo-500" /> },
      { id: "add-page-numbers", name: "Add page numbers", desc: "Draw sequential page numbers on margins.", icon: <FileText className="h-4 w-4 text-sky-500" /> },
      { id: "add-watermark", name: "Add watermark", desc: "Stamp diagonal semi-transparent watermarks.", icon: <Type className="h-4 w-4 text-blue-500" /> },
      { id: "crop-pdf", name: "Crop PDF", desc: "Set PDF cropbox viewport margins locally.", icon: <Sliders className="h-4 w-4 text-indigo-500" /> },
      { id: "edit-pdf", name: "Edit PDF", desc: "Add drawing layers or annotations to PDF.", icon: <FileText className="h-4 w-4 text-blue-500" /> },
      { id: "pdf-forms", name: "PDF Forms", desc: "Fill out interactive text form fields.", icon: <FileText className="h-4 w-4 text-sky-500" /> },
    ]
  },
  {
    title: "PDF Security",
    icon: <Lock className="h-5 w-5 text-rose-600" />,
    desc: "Sign, encrypt, password-protect, or redact pages.",
    tools: [
      { id: "unlock-pdf", name: "Unlock PDF", desc: "Strip password encryption off a secure PDF.", icon: <FileText className="h-4 w-4 text-emerald-500" /> },
      { id: "protect-pdf", name: "Protect PDF", desc: "Encrypt document sheets with secure passwords.", icon: <Lock className="h-4 w-4 text-rose-500" /> },
      { id: "sign-pdf", name: "Sign PDF", desc: "Draw and stamp signatures on page layers.", icon: <Sparkles className="h-4 w-4 text-blue-500" /> },
      { id: "redact-pdf", name: "Redact PDF", desc: "Blackout and cryptographically delete sensitive text.", icon: <FileText className="h-4 w-4 text-red-500" /> },
      { id: "compare-pdf", name: "Compare PDF", desc: "Detect visual difference diffs between PDFs.", icon: <Layers className="h-4 w-4 text-indigo-500" /> },
    ]
  },
  {
    title: "PDF Intelligence & Media",
    icon: <Sparkles className="h-5 w-5 text-blue-600" />,
    desc: "AI document smart summaries, translations, and images.",
    tools: [
      { id: "ai-summarizer", name: "AI Summarizer", desc: "Get bullet summaries of lengthy PDF sheets.", icon: <Sparkles className="h-4 w-4 text-blue-500" /> },
      { id: "translate-pdf", name: "Translate PDF", desc: "Translate text structures locally in the browser.", icon: <Sparkles className="h-4 w-4 text-indigo-500" /> },
      { id: "heic-to-jpg", name: "HEIC to JPG", desc: "Convert Apple HEIC photos to JPG format.", icon: <ImageIcon className="h-4 w-4 text-blue-500" /> },
      { id: "compress-image-exact-kb", name: "Compress Image KB", desc: "Shrink images to exact target weights in KB.", icon: <Minimize2 className="h-4 w-4 text-emerald-500" /> },
      { id: "mov-to-mp4", name: "MOV to MP4", desc: "Transcode video files safely inside browser.", icon: <Video className="h-4 w-4 text-indigo-500" /> },
    ]
  }
];

export default function Home() {
  const portalSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ConvertOrbit",
    "url": "https://convertorbit.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://convertorbit.com#search-input-field?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ConvertOrbit",
    "url": "https://convertorbit.com",
    "logo": "https://convertorbit.com/logo.png"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <Header />

      <main className="flex-1 bg-slate-50/20">
        <Hero />

        <div className="my-10">
          <AdPlaceholder slot="homepage-hero-below" format="horizontal" />
        </div>

        {/* Categories columns tools sections */}
        <section id="all-tools" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-12">
          <div className="space-y-4 text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Professional Document & PDF Suite
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Select one of our specialized client-side utilities. Processed 100% locally in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-none">{cat.title}</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{cat.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="group flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:border-accent-blue/20 hover:bg-blue-50/5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:text-accent-blue transition-colors shrink-0">
                            {tool.icon}
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:text-accent-blue transition-colors truncate">
                            {tool.name}
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-accent-blue group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="my-10">
          <AdPlaceholder slot="homepage-tools-below" format="horizontal" />
        </div>

        <section id="how-it-works" className="py-20 border-t border-card-border bg-slate-50/10 scroll-mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Convert Files in 3 Simple Steps
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Fast, seamless, and completely secure processing workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Select File", desc: "Drag & drop or browse to choose files from your hard drive local sandboxes." },
                { step: "2", title: "Configure Settings", desc: "Specify optional parameters such as icon widths, exact KB size weights, or optimization modes." },
                { step: "3", title: "Download Result", desc: "Wait a split-second for the browser memory processes, then click to save your new file immediately." }
              ].map((step, idx) => (
                <div key={idx} className="relative p-6 bg-white border border-card-border rounded-2xl text-center space-y-4 flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-blue to-accent-indigo text-white font-extrabold text-sm shadow-md shadow-accent-blue/15">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PrivacySection />
      </main>

      <Footer />
    </>
  );
}
