import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Zap, Layers, FileDown, 
  FileUp, FileText, Image as ImageIcon, Video, Minimize2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AdPlaceholder from "@/components/AdPlaceholder";
import PrivacySection from "@/components/PrivacySection";

export const metadata: Metadata = {
  title: "ConvertOrbit - Convert, Compress & Optimize Files Instantly",
  description: "Fast, Secure and Free File Tools for Everyone. Process images, PDFs, and videos 100% client-side inside your browser for maximum data privacy.",
  alternates: {
    canonical: "https://convertorbit.com",
  },
  openGraph: {
    title: "ConvertOrbit - Instant Client-Side File Tools",
    description: "Convert, Compress & Optimize Files Instantly. Secure browser-based execution means zero file uploads.",
    url: "https://convertorbit.com",
    siteName: "ConvertOrbit",
    type: "website",
  },
};

const POPULAR_TOOLS = [
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    desc: "Convert Apple HEIC photos to compatible JPG files instantly.",
    icon: <ImageIcon className="h-6 w-6 text-blue-600" />,
    badge: "Fastest"
  },
  {
    id: "png-to-ico",
    name: "PNG to ICO Generator",
    desc: "Create multi-resolution favicon Windows .ico files from PNG.",
    icon: <Layers className="h-6 w-6 text-indigo-600" />,
    badge: "Favicons"
  },
  {
    id: "compress-image-exact-kb",
    name: "Compress Image Exact KB",
    desc: "Reduce JPG/PNG file sizes to exact target weights in KB.",
    icon: <Minimize2 className="h-6 w-6 text-sky-600" />,
    badge: "Government Portals"
  },
  {
    id: "mov-to-mp4",
    name: "MOV to MP4 Converter",
    desc: "Transcode Apple QuickTime MOV recordings to web-compatible MP4.",
    icon: <Video className="h-6 w-6 text-blue-600" />,
    badge: "WASM Tech"
  },
  {
    id: "pdf-compressor",
    name: "PDF Compressor",
    desc: "Reduce PDF storage size while maintaining crisp vector layouts.",
    icon: <FileDown className="h-6 w-6 text-indigo-600" />,
    badge: "PDF Utility"
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    desc: "Extract Microsoft DOCX and generate standard printable PDFs.",
    icon: <FileUp className="h-6 w-6 text-sky-600" />,
    badge: "Client Safe"
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word DOCX",
    desc: "Convert vector PDF documents into fully editable Word paragraphs.",
    icon: <FileText className="h-6 w-6 text-indigo-600" />,
    badge: "Text OCR"
  }
];

export default function Home() {
  // Homepage organization & portal schemas
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
      {/* Schema Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Ad block below Hero */}
        <div className="my-10">
          <AdPlaceholder slot="homepage-hero-below" format="horizontal" />
        </div>

        {/* Popular Tools Grid cards */}
        <section id="all-tools" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-12">
          <div className="space-y-4 text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Popular File Utilities
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Select one of our specialized client-side converters below to get started immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group relative p-6 bg-white border border-card-border rounded-2xl hover:border-accent-blue/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors flex items-center justify-center shrink-0">
                      {tool.icon}
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-accent-blue transition-colors">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800 mt-6 group-hover:text-accent-blue transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                    {tool.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent-blue mt-6 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  <span>Start Converting</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Compliant Ad slot below tools list */}
        <div className="my-10">
          <AdPlaceholder slot="homepage-tools-below" format="horizontal" />
        </div>

        {/* How It Works unified roadmap */}
        <section id="how-it-works" className="py-20 border-t border-card-border bg-slate-50/20 scroll-mt-12">
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

        {/* Privacy trust Panel */}
        <PrivacySection />
      </main>

      <Footer />
    </>
  );
}
