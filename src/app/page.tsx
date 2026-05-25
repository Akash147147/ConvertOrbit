import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Layers, FileDown, 
  FileUp, FileText, Image as ImageIcon, Video, Minimize2, 
  HelpCircle, Compass, Lock, Sliders, Type, Sparkles, Hash
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AdPlaceholder from "@/components/AdPlaceholder";
import PrivacySection from "@/components/PrivacySection";

export const metadata: Metadata = {
  title: "ConvertOrbit - 100% Free & Secure Online PDF & Exact KB Tools",
  description: "Fast, Secure and Free File Tools for Everyone. Resize image to exact KB, create passport size photos, compress PDF to exactly 100KB/500KB client-side inside your browser safely.",
  alternates: {
    canonical: "https://convertorbit.com",
  },
  openGraph: {
    title: "ConvertOrbit - Secure Exact Sizing Document Utilities",
    description: "Compress PDFs to exactly 100KB/500KB, resize images to 20KB/50KB/100KB, and crop passport photos client-side safely in browser.",
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
    title: "Exact KB Compressors",
    icon: <Minimize2 className="h-5 w-5 text-emerald-600" />,
    desc: "Target exact portal constraints locally.",
    tools: [
      { id: "compress-image-20kb", name: "Compress Image to 20KB", desc: "Scale photo under 20KB limits.", icon: <ImageIcon className="h-4 w-4 text-emerald-500" /> },
      { id: "compress-image-50kb", name: "Compress Image to 50KB", desc: "Scale photo under 50KB limits.", icon: <ImageIcon className="h-4 w-4 text-sky-500" /> },
      { id: "compress-image-100kb", name: "Compress Image to 100KB", desc: "Scale photo under 100KB limits.", icon: <ImageIcon className="h-4 w-4 text-indigo-500" /> },
      { id: "signature-resize-20kb", name: "Signature Resize 20KB", desc: "Scale signatures under 20KB limits.", icon: <Sparkles className="h-4 w-4 text-emerald-500" /> },
      { id: "compress-pdf-100kb", name: "Compress PDF to 100KB", desc: "Reduce PDF under strict 100KB caps.", icon: <FileText className="h-4 w-4 text-emerald-500" /> },
      { id: "compress-pdf-500kb", name: "Compress PDF to 500KB", desc: "Reduce PDF under strict 500KB caps.", icon: <FileText className="h-4 w-4 text-indigo-500" /> },
    ]
  },
  {
    title: "Passport & Sizing Utilities",
    icon: <ImageIcon className="h-5 w-5 text-blue-600" />,
    desc: "Create compliant print & embassy files.",
    tools: [
      { id: "passport-photo-maker", name: "Passport Photo Maker", desc: "Format standard 2x2 inch prints.", icon: <ImageIcon className="h-4 w-4 text-blue-500" /> },
      { id: "visa-photo-maker", name: "Visa Photo Resizer", desc: "Sizing for Schengen & US embassy.", icon: <ImageIcon className="h-4 w-4 text-indigo-500" /> },
      { id: "heic-to-jpg", name: "HEIC to JPG", desc: "Convert iOS photos into JPG format.", icon: <ImageIcon className="h-4 w-4 text-blue-500" /> },
      { id: "compress-image-exact-kb", name: "Compress Image Exact KB", desc: "Scale images to target KBs.", icon: <Minimize2 className="h-4 w-4 text-sky-500" /> },
      { id: "mov-to-mp4", name: "MOV to MP4 Converter", desc: "Convert video files in browser.", icon: <Video className="h-4 w-4 text-indigo-500" /> },
    ]
  },
  {
    title: "Social & Platform Crop",
    icon: <Sliders className="h-5 w-5 text-indigo-600" />,
    desc: "Lock aspect ratios to standard feeds.",
    tools: [
      { id: "youtube-thumbnail-resizer", name: "YouTube Thumbnail Resizer", desc: "Scale design precisely to 1280x720.", icon: <Video className="h-4 w-4 text-red-500" /> },
      { id: "linkedin-crop", name: "LinkedIn Banner Crop", desc: "Crop profile banner to 1584x396 (4:1).", icon: <Sliders className="h-4 w-4 text-blue-500" /> },
      { id: "instagram-resize", name: "Instagram Image Resizer", desc: "Scale photo to square or story bounds.", icon: <Layers className="h-4 w-4 text-indigo-500" /> },
    ]
  },
  {
    title: "Advanced PDF Utilities",
    icon: <Layers className="h-5 w-5 text-indigo-600" />,
    desc: "Secure, edit, convert, merge or split.",
    tools: [
      { id: "merge-pdf", name: "Merge PDF", desc: "Combine multiple files into one PDF.", icon: <Layers className="h-4 w-4 text-indigo-500" /> },
      { id: "split-pdf", name: "Split PDF", desc: "Extract specific page ranges safely.", icon: <FileText className="h-4 w-4 text-blue-500" /> },
      { id: "remove-pages", name: "Remove pages", desc: "Delete unwanted pages client-side.", icon: <FileText className="h-4 w-4 text-red-500" /> },
      { id: "organize-pdf", name: "Organize PDF", desc: "Reorder and rotate pages visually.", icon: <Sliders className="h-4 w-4 text-indigo-500" /> },
      { id: "pdf-compressor", name: "PDF Compressor", desc: "Streamline PDF structures locally.", icon: <FileDown className="h-4 w-4 text-emerald-500" /> },
      { id: "ocr-pdf", name: "OCR PDF", desc: "Make scanned PDF text fully searchable.", icon: <Sparkles className="h-4 w-4 text-blue-500" /> },
    ]
  },
  {
    title: "Security & Metadata",
    icon: <Lock className="h-5 w-5 text-rose-600" />,
    desc: "Protect location details and encrypt data.",
    tools: [
      { id: "strip-metadata", name: "Strip Image Metadata", desc: "Wipe location coordinates and EXIF.", icon: <ShieldCheck className="h-4 w-4 text-emerald-500" /> },
      { id: "convert-dpi", name: "Convert Image DPI", desc: "Rewrite resolution density headers.", icon: <Compass className="h-4 w-4 text-indigo-500" /> },
      { id: "checksum-tool", name: "File Checksum Tool", desc: "Generate SHA-256 and MD5 hashes.", icon: <Hash className="h-4 w-4 text-sky-500" /> },
      { id: "protect-pdf", name: "Protect PDF", desc: "Password encrypt document sheets.", icon: <Lock className="h-4 w-4 text-rose-500" /> },
      { id: "sign-pdf", name: "Sign PDF", desc: "Stamp transparent drawn signatures.", icon: <Sparkles className="h-4 w-4 text-blue-500" /> },
    ]
  },
  {
    title: "Developer Sandbox",
    icon: <Sparkles className="h-5 w-5 text-blue-600" />,
    desc: "Lint JSON or compute cryptographic hashes.",
    tools: [
      { id: "json-formatter", name: "JSON Formatter", desc: "Lint, validate and indent JSON files.", icon: <Type className="h-4 w-4 text-indigo-500" /> },
      { id: "base64-encoder", name: "Base64 Encoder", desc: "Encode & decode string text online.", icon: <Type className="h-4 w-4 text-blue-500" /> },
      { id: "hash-generator", name: "Hash Generator", desc: "Calculate MD5 & SHA-256 strings.", icon: <Hash className="h-4 w-4 text-sky-500" /> },
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
              Highly Searched Specialized Utilities
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Select one of our precise constraint templates. Processed 100% locally in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
