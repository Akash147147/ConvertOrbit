import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import PrivacySection from "@/components/PrivacySection";
import ToolInterface from "@/components/ToolInterface";

// Core static configuration database for all 7 popular tools
interface ToolData {
  id: string;
  name: string;
  headline: string;
  description: string;
  inputAccept: string;
  metaDescription: string;
  steps: string[];
  faqs: { q: string; a: string }[];
  related: string[];
}

const TOOLS_DATABASE: Record<string, ToolData> = {
  "heic-to-jpg": {
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    headline: "Convert Apple HEIC Images to JPG Instantly",
    description: "Transform your iOS HEIC photos into highly compatible JPG/JPEG format directly inside your browser. No size limits, fast, and completely secure.",
    inputAccept: ".heic",
    metaDescription: "Convert HEIC to JPG online for free. Local client-side conversion ensures maximum privacy. No uploads, fast conversions, high compatibility.",
    steps: [
      "Select or drag & drop your Apple HEIC photo into the dropzone.",
      "The system initializes the local converter engine.",
      "Click 'Optimize & Convert' to transcode the image client-side.",
      "Click 'Download File' to save your new JPG photo instantly."
    ],
    faqs: [
      { q: "Is my privacy protected with ConvertOrbit HEIC to JPG?", a: "Absolutely. The conversion takes place entirely client-side using heic2any in your browser. Your images never leave your local device." },
      { q: "Are there file size or daily limits?", a: "No. Since calculations run locally in your web browser, there are zero server processing costs. You can convert unlimited files of any size." },
      { q: "Will I lose image quality?", a: "No. Our engine uses standard rendering metrics (90% quality scale) to maintain beautiful details while converting." }
    ],
    related: ["compress-image-exact-kb", "png-to-ico"]
  },
  "png-to-ico": {
    id: "png-to-ico",
    name: "PNG to ICO Generator",
    headline: "Convert PNG to Multi-Size Favicon ICO Files",
    description: "Create standard, high-quality Windows multi-resolution icon files (.ico) from your transparent PNG files. Ideal for website favicons and application icons.",
    inputAccept: ".png",
    metaDescription: "Generate multi-size .ico favicon files from PNG images for free. Supports standard sizes (16, 32, 48, 64) and runs entirely in your browser.",
    steps: [
      "Select your transparent PNG file from your computer.",
      "Select the icon dimensions (e.g. 16x16, 32x32, 48x48) you want to package.",
      "Click 'Optimize & Convert' to assemble the ICO binary structure.",
      "Download your completed favicon.ico file."
    ],
    faqs: [
      { q: "Why does a favicon need multiple sizes?", a: "Favicons are displayed in various places like browser tabs (16x16), bookmarks (32x32), and desktop shortcuts (48x48+). An ICO packages these sizes together." },
      { q: "Can I convert transparent PNGs?", a: "Yes. The alpha channel transparency is preserved perfectly inside the generated ICO file." }
    ],
    related: ["heic-to-jpg", "compress-image-exact-kb"]
  },
  "compress-image-exact-kb": {
    id: "compress-image-exact-kb",
    name: "Compress Image Exact KB",
    headline: "Compress JPG/PNG Images to an Exact Target KB",
    description: "Achieve the exact file size constraints needed for governmental portals, job applications, or visa uploads. Simply input your target KB.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Compress images to an exact file size in KB (e.g., 50KB, 100KB, 150KB) online. Uses intelligent client-side binary search algorithms.",
    steps: [
      "Upload your JPG or PNG image.",
      "Slide or enter your precise target weight in KB (e.g. 150 KB).",
      "Click 'Optimize & Convert'. The engine adjusts parameters dynamically.",
      "Verify the exact output size and download your compressed file."
    ],
    faqs: [
      { q: "How does exact KB compression work?", a: "Our algorithm runs a client-side binary search on the quality parameters and dimensions, generating test canvases to narrow in on the target size." },
      { q: "What is the margin of accuracy?", a: "Our binary search checks size margins repeatedly, typically achieving within +/- 3% accuracy of your requested KB weight." }
    ],
    related: ["heic-to-jpg", "png-to-ico"]
  },
  "mov-to-mp4": {
    id: "mov-to-mp4",
    name: "MOV to MP4 Converter",
    headline: "Convert MOV Videos to HTML5 MP4 in Browser",
    description: "Transcode Apple QuickTime (.mov) video recordings into widely supported MPEG-4 (.mp4) format entirely local in your browser via FFmpeg.wasm.",
    inputAccept: ".mov",
    metaDescription: "Convert MOV to MP4 online using browser-level WebAssembly. Fast, highly secure, and process-safe. Files never leave your local computer.",
    steps: [
      "Upload your MOV video clip.",
      "Click 'Optimize & Convert' to boot our local WebAssembly transcoder.",
      "Watch the progress bar update as transcoding runs client-side.",
      "Download your completed, web-ready MP4 video."
    ],
    faqs: [
      { q: "Does this require downloading desktop software?", a: "No. The system loads FFmpeg.wasm dynamically inside your browser environment to convert files securely and locally." },
      { q: "Does the video upload to a server?", a: "Absolutely not. All transcoding steps occur on your local hardware's CPU via WebAssembly." }
    ],
    related: ["pdf-compressor", "heic-to-jpg"]
  },
  "pdf-compressor": {
    id: "pdf-compressor",
    name: "PDF Compressor",
    headline: "Compress PDF Document Weight Online Free",
    description: "Shrink massive PDF brochures, school presentations, or legal documents. Optimizes internal text streams, fonts, and structures locally.",
    inputAccept: ".pdf",
    metaDescription: "Compress PDF file sizes online without uploading them to remote servers. Client-side PDF-lib compaction secures your privacy.",
    steps: [
      "Upload your PDF document.",
      "Choose your optimization preset: Balanced, High Quality, or Max Size.",
      "Click 'Optimize & Convert'.",
      "Download the compressed PDF file."
    ],
    faqs: [
      { q: "Will the PDF text quality decrease?", a: "No. The text remains fully searchable and vector-sharp. The compressor streamlines resource tables and serializations." },
      { q: "Can I compress password protected PDFs?", a: "Currently, our client-side tool requires standard unencrypted PDFs for parsing." }
    ],
    related: ["word-to-pdf", "pdf-to-word"]
  },
  "word-to-pdf": {
    id: "word-to-pdf",
    name: "Word to PDF",
    headline: "Convert Microsoft Word DOCX to Portable PDF",
    description: "Instantly create high-quality, professional PDF files from Microsoft Word documents. Preserves headings, fonts, and layouts entirely client-side.",
    inputAccept: ".docx",
    metaDescription: "Convert Word DOCX to PDF online for free. 100% client-side conversion protects your legal and personal documents from leaks.",
    steps: [
      "Select your Word .docx document.",
      "Our system reads paragraphs and fonts locally in browser memory.",
      "Click 'Optimize & Convert' to generate vector PDF layouts.",
      "Download the fully formatted PDF."
    ],
    faqs: [
      { q: "Does ConvertOrbit support doc or docx?", a: "Currently, we support the standard .docx XML format which can be generated by all modern word processors." },
      { q: "Is it safe to convert business contracts here?", a: "Yes. Since there are no uploads, your documents remain private to you." }
    ],
    related: ["pdf-to-word", "pdf-compressor"]
  },
  "pdf-to-word": {
    id: "pdf-to-word",
    name: "PDF to Word DOCX",
    headline: "Convert PDF Documents to Editable Word Files",
    description: "Extract paragraphs, lines, and typographic structures from PDF document pages and compile them into editable Microsoft Word (.docx) formats.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to Word DOCX online for free. Processes file text client-side, compiling a brand new DOCX structure right inside your browser.",
    steps: [
      "Select your source PDF document.",
      "Our parser analyzes text blocks and page layout elements.",
      "Click 'Optimize & Convert' to compile the DOCX structure.",
      "Download your editable Word document."
    ],
    faqs: [
      { q: "Can I edit the converted Word file?", a: "Yes. It generates a fully native Word document with editable paragraphs and formatting runs." },
      { q: "Does it support OCR for scanned PDFs?", a: "Currently, it converts standard digital PDFs that contain embedded text structures." }
    ],
    related: ["word-to-pdf", "pdf-compressor"]
  }
};

interface RouteProps {
  params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
  return Object.keys(TOOLS_DATABASE).map((tool) => ({
    tool,
  }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = TOOLS_DATABASE[resolvedParams.tool];
  if (!tool) return {};

  return {
    title: `${tool.name} - Instantly Convert & Compress Files | ConvertOrbit`,
    description: tool.metaDescription,
    alternates: {
      canonical: `https://convertorbit.com/tools/${tool.id}`,
    },
    openGraph: {
      title: `${tool.name} - Instant File Tools | ConvertOrbit`,
      description: tool.metaDescription,
      url: `https://convertorbit.com/tools/${tool.id}`,
      siteName: "ConvertOrbit",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: RouteProps) {
  const resolvedParams = await params;
  const tool = TOOLS_DATABASE[resolvedParams.tool];

  if (!tool) {
    notFound();
  }

  // Generate Structured Data Schema Markups
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${tool.name} by ConvertOrbit`,
    "operatingSystem": "All",
    "applicationCategory": "UtilityApplication",
    "browserRequirements": "Requires HTML5 Canvas and WebAssembly capabilities.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://convertorbit.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://convertorbit.com#all-tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://convertorbit.com/tools/${tool.id}`
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${tool.name}`,
    "description": tool.description,
    "step": tool.steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "text": step
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": tool.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      {/* Schema Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1 py-10 bg-slate-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation UI */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent-blue transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/#all-tools" className="hover:text-accent-blue transition-colors">
              Tools
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 truncate">{tool.name}</span>
          </nav>

          {/* Title Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {tool.headline}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Ad Slot Above tool */}
          <div className="mb-8">
            <AdPlaceholder slot="above-tool" format="horizontal" />
          </div>

          {/* Core Interactive Tool UI */}
          <div className="mb-14">
            <ToolInterface toolId={tool.id} inputAccept={tool.inputAccept} toolName={tool.name} />
          </div>

          {/* Ad Slot Below tool */}
          <div className="mb-14">
            <AdPlaceholder slot="below-tool" format="horizontal" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16 border-t border-card-border pt-16">
            {/* Guide & FAQs (Left side) */}
            <div className="lg:col-span-2 space-y-12">
              {/* How it works */}
              <section id="how-it-works" className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tool.steps.map((step, idx) => (
                    <div key={idx} className="p-5 bg-white border border-card-border rounded-2xl flex gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-accent-blue shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-5.5 w-5.5 text-accent-blue" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <div className="space-y-4">
                  {tool.faqs.map((faq, idx) => (
                    <div key={idx} className="p-6 bg-white border border-card-border rounded-2xl space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-800">{faq.q}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Side Column (Right side) - Related Tools */}
            <div className="space-y-8">
              <div className="p-6 bg-white border border-card-border rounded-2xl space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Related Tools</h3>
                <div className="space-y-3">
                  {tool.related.map((relId) => {
                    const relTool = TOOLS_DATABASE[relId];
                    if (!relTool) return null;
                    return (
                      <Link
                        key={relId}
                        href={`/tools/${relId}`}
                        className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-accent-blue/30 hover:bg-slate-50 transition-all duration-200"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-accent-blue transition-colors">
                            {relTool.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">Free client-side tool</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-accent-blue group-hover:translate-x-0.5 rotate-180 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Secure banner */}
              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-emerald-800">Files Processed Securely</p>
                  <p className="text-[10px] text-emerald-600 leading-relaxed font-medium">
                    ConvertOrbit runs calculations in your browser sandboxes. Your documents never touch external databases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PrivacySection />
      <Footer />
    </>
  );
}
