import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import PrivacySection from "@/components/PrivacySection";
import ToolInterface from "@/components/ToolInterface";

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
  // Column 1: Organize PDF
  "merge-pdf": {
    id: "merge-pdf",
    name: "Merge PDF",
    headline: "Merge PDF Files Online Securely",
    description: "Combine multiple PDF documents into a single PDF file in seconds. Drag-and-drop to reorder pages. Processed 100% locally in your browser.",
    inputAccept: ".pdf",
    metaDescription: "Merge PDF files online for free. Combine multiple PDF documents securely client-side in your browser. Reorder pages instantly with zero file uploads.",
    steps: ["Upload two or more PDF files.", "Drag or click the arrows to reorder your documents.", "Click 'Optimize & Convert' to combine files locally.", "Download your merged PDF file instantly."],
    faqs: [
      { q: "Is it secure to merge sensitive files on ConvertOrbit?", a: "Yes. All merging operations take place entirely client-side using pdf-lib in your browser. Your documents are never uploaded to any external servers." },
      { q: "Can I reorder the files before combining them?", a: "Yes. Our visual files list lets you change the sequence and order of pages with a single click." }
    ],
    related: ["split-pdf", "organize-pdf"]
  },
  "split-pdf": {
    id: "split-pdf",
    name: "Split PDF",
    headline: "Split PDF Files Online into Separate Pages",
    description: "Extract specific page ranges or split a PDF page-by-page into separate documents. Safe, fast, and secure browser-level processing.",
    inputAccept: ".pdf",
    metaDescription: "Split PDF files online for free. Extract pages or split PDF document ranges locally in your browser. Complete document split tools with zero uploads.",
    steps: ["Upload your source PDF document.", "Input the page ranges you want to extract (e.g. 1-3, 5).", "Click 'Optimize & Convert' to slice the pages locally.", "Save and download the split document."],
    faqs: [
      { q: "How do I specify page ranges?", a: "Simply enter the numbers separated by commas and hyphens, for example '1-3, 5' to extract pages 1, 2, 3, and 5." },
      { q: "Are there file limits for split operations?", a: "No. Since calculations run on your own hardware, you can split PDFs of any size." }
    ],
    related: ["merge-pdf", "remove-pages"]
  },
  "remove-pages": {
    id: "remove-pages",
    name: "Remove PDF Pages",
    headline: "Remove Pages from PDF Documents Locally",
    description: "Delete unwanted pages from your PDF file. Streamlines files recursively and compiles a fresh PDF output directly inside your browser.",
    inputAccept: ".pdf",
    metaDescription: "Delete pages from PDF documents online for free. Processed client-side for maximum confidentiality. Zero data uploads, fast results.",
    steps: ["Select your PDF file.", "Specify the page indices you wish to delete (e.g., 2, 4-6).", "Click 'Optimize & Convert'.", "Save your clean PDF to your computer."],
    faqs: [
      { q: "Does deleting pages reduce the file size?", a: "Yes, removing pages strips page resources, text blocks, and images, resulting in a lighter PDF." }
    ],
    related: ["split-pdf", "organize-pdf"]
  },
  "extract-pages": {
    id: "extract-pages",
    name: "Extract PDF Pages",
    headline: "Extract Pages from PDF Files",
    description: "Save individual pages or custom ranges of a PDF as a new standalone document. Secure local browser conversion.",
    inputAccept: ".pdf",
    metaDescription: "Extract specific PDF pages online. Select page numbers and save them as a separate document instantly client-side with zero file leaks.",
    steps: ["Choose your PDF file.", "Enter the page numbers to extract.", "Click 'Optimize & Convert'.", "Save the extracted PDF document."],
    faqs: [
      { q: "Can I extract non-consecutive pages?", a: "Yes. Simply input page numbers separated by commas, like '1, 4, 7'." }
    ],
    related: ["split-pdf", "merge-pdf"]
  },
  "organize-pdf": {
    id: "organize-pdf",
    name: "Organize PDF",
    headline: "Organize, Rotate & Reorder PDF Pages",
    description: "Sort, rotate, delete, or add pages in a visual document catalog. Fully local execution for maximum data privacy.",
    inputAccept: ".pdf",
    metaDescription: "Organize PDF pages online. Reorder, rotate, delete, and manage pages in a visual interface for free client-side.",
    steps: ["Upload your PDF file.", "Use the options configurations to reorder or rotate pages.", "Confirm and compile the new sequence.", "Download your organized PDF."],
    faqs: [
      { q: "Is the visual layout preserved?", a: "Yes. All vector text layers, form fields, and layouts are preserved perfectly." }
    ],
    related: ["merge-pdf", "rotate-pdf"]
  },
  "scan-to-pdf": {
    id: "scan-to-pdf",
    name: "Scan to PDF",
    headline: "Scan Paper Documents directly to PDF",
    description: "Turn mobile or web camera snapshots directly into clean vector PDF pages. Processed 100% locally.",
    inputAccept: "image/*,video/*",
    metaDescription: "Convert web camera scans to PDF online. Safe client-side document compiler converts images directly into clean PDF documents.",
    steps: ["Grant browser access to your device camera.", "Take sharp snapshots of your documents.", "Compile the captured pages into a single PDF.", "Download your PDF document."],
    faqs: [
      { q: "Are my camera snapshots saved on servers?", a: "No. The video stream and pictures are rendered directly inside HTML5 canvas objects on your machine." }
    ],
    related: ["jpg-to-pdf", "pdf-compressor"]
  },

  // Column 2: Optimize PDF
  "pdf-compressor": {
    id: "pdf-compressor",
    name: "PDF Compressor",
    headline: "Compress PDF Files Online Free",
    description: "Reduce PDF storage size while maintaining vector layouts and searchable text. Fast client-side document stream optimization.",
    inputAccept: ".pdf",
    metaDescription: "Compress PDF document size online. Streams and compaction are processed locally in your browser. Maximize storage savings securely.",
    steps: ["Upload your PDF document.", "Choose your optimization preset (Balanced, High Quality, Max Size).", "Click 'Optimize & Convert'.", "Download your lighter PDF."],
    faqs: [
      { q: "Does the PDF text remain sharp?", a: "Yes. All text and vector structures stay fully vector-sharp. Only structural redundant resource indices are stripped." }
    ],
    related: ["word-to-pdf", "ocr-pdf"]
  },
  "repair-pdf": {
    id: "repair-pdf",
    name: "Repair PDF",
    headline: "Repair Corrupted or Damaged PDF Files",
    description: "Scan and reconstruct corrupt internal document tables and objects to make your PDF readable again.",
    inputAccept: ".pdf",
    metaDescription: "Fix and repair corrupted PDF documents online for free. Rebuilds broken tables and objects client-side.",
    steps: ["Upload the corrupted PDF file.", "The local engine scans for damaged stream structures.", "Recompile intact pages.", "Download the repaired document."],
    faqs: [
      { q: "Can all broken PDFs be repaired?", a: "Most PDFs with minor indexing issues can be fully recovered, though heavily corrupted binary files may have page losses." }
    ],
    related: ["pdf-compressor", "ocr-pdf"]
  },
  "ocr-pdf": {
    id: "ocr-pdf",
    name: "OCR PDF",
    headline: "OCR PDF Online: Make Scanned PDF Searchable",
    description: "Overlay searchable text blocks on top of scanned image PDFs entirely in your browser using local parsing wrappers.",
    inputAccept: ".pdf",
    metaDescription: "Convert scanned image PDFs into fully searchable, selectable PDF documents online. High fidelity OCR wrappers execute locally.",
    steps: ["Select your scanned image PDF.", "Click 'Optimize & Convert' to parse text blocks.", "Verify searchable text overlays.", "Download the search-enabled PDF document."],
    faqs: [
      { q: "How is OCR processed locally?", a: "We run intelligent PDF stream wrappers to map the text coordinates without uploading documents." }
    ],
    related: ["pdf-compressor", "pdf-to-word"]
  },

  // Column 3: Convert to PDF
  "jpg-to-pdf": {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    headline: "Convert JPG and PNG Images to PDF Online",
    description: "Combine multiple JPG/PNG images into a single PDF document. Full bleed vector conversion with zero file uploads.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Convert JPG to PDF online for free. Support batch image combination into high-quality PDFs client-side in your browser.",
    steps: ["Select or drag one or more images into the dropzone.", "Reorder image cards as desired.", "Click 'Optimize & Convert'.", "Download your compiled PDF document."],
    faqs: [
      { q: "Is there a limit to the number of images I can combine?", a: "No. You can compile dozens of images into a single PDF book." }
    ],
    related: ["png-to-ico", "pdf-compressor"]
  },
  "word-to-pdf": {
    id: "word-to-pdf",
    name: "Word to PDF",
    headline: "Convert Microsoft DOCX to PDF Online",
    description: "Instantly create high-quality, professional PDF files from Microsoft Word documents. Preserves headings, fonts, and layouts entirely client-side.",
    inputAccept: ".docx",
    metaDescription: "Convert Word DOCX to PDF online for free. 100% client-side conversion protects your legal and personal documents from leaks.",
    steps: ["Select your Word .docx document.", "Our system reads paragraphs and fonts locally in browser memory.", "Click 'Optimize & Convert' to generate vector PDF layouts.", "Download the fully formatted PDF."],
    faqs: [
      { q: "Does ConvertOrbit support doc or docx?", a: "Currently, we support the standard .docx XML format which can be generated by all modern word processors." }
    ],
    related: ["pdf-to-word", "pdf-compressor"]
  },
  "ppt-to-pdf": {
    id: "ppt-to-pdf",
    name: "PowerPoint to PDF",
    headline: "Convert PowerPoint PPTX Slides to PDF",
    description: "Convert Microsoft PowerPoint presentations into standard PDF files client-side. Zero server delays.",
    inputAccept: ".pptx",
    metaDescription: "Convert PPTX to PDF online. Fully secure browser conversion ensures your presentations and business slides stay local and safe.",
    steps: ["Upload your PPTX file.", "Click 'Optimize & Convert' to parse slides.", "Download the high-quality vector PDF."],
    faqs: [
      { q: "Are slide animations preserved?", a: "Animations are converted to clean, sequential static PDF slides for easy reading and printing." }
    ],
    related: ["word-to-pdf", "excel-to-pdf"]
  },
  "excel-to-pdf": {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    headline: "Convert Excel Spreadsheets to PDF Documents",
    description: "Transform XLS and XLSX sheets into print-ready PDF files. Fits charts and sheets cleanly client-side.",
    inputAccept: ".xlsx,.xls",
    metaDescription: "Convert Excel to PDF online. Free, safe client-side conversion maps spreadsheets to layout-perfect PDF page formats.",
    steps: ["Upload your Excel sheet.", "Click 'Optimize & Convert'.", "Save the newly generated PDF spreadsheet."],
    faqs: [
      { q: "Will the gridlines be visible?", a: "Gridlines and font parameters are rendered exactly as configured inside your spreadsheet page setup." }
    ],
    related: ["word-to-pdf", "ppt-to-pdf"]
  },
  "html-to-pdf": {
    id: "html-to-pdf",
    name: "HTML to PDF",
    headline: "Convert Web Pages HTML to PDF Documents",
    description: "Compile source HTML layouts or URLs into portable document PDFs entirely inside your browser.",
    inputAccept: ".html,.htm",
    metaDescription: "Convert HTML files or codes into high-fidelity PDF layouts. Complete local vector drawings with zero server processing.",
    steps: ["Paste HTML code or upload the HTML file.", "Click 'Optimize & Convert'.", "Download the rendered vector PDF."],
    faqs: [
      { q: "Does it render CSS stylesheets?", a: "Yes. Standard inline and mapped CSS styling are parsed to create clean page structures." }
    ],
    related: ["word-to-pdf", "jpg-to-pdf"]
  },

  // Column 4: Convert from PDF
  "pdf-to-jpg": {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    headline: "Convert PDF Document Pages to JPG Images",
    description: "Render PDF page sheets into sharp, high-resolution JPG images visually in your browser. Select specific pages to download instantly.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to JPG images online for free. Uses local canvas renders to export PDF sheets into sharp JPG files with zero uploads.",
    steps: ["Select the PDF document.", "Pages render visually as image canvas cards.", "Select and click download on individual pages or the full set.", "Save the sharp JPG images."],
    faqs: [
      { q: "Can I download individual pages?", a: "Yes. You can click to download only the specific pages you need as separate images." }
    ],
    related: ["jpg-to-pdf", "pdf-to-word"]
  },
  "pdf-to-word": {
    id: "pdf-to-word",
    name: "PDF to Word",
    headline: "Convert PDF Documents to Editable Word Files",
    description: "Extract lines, text alignments, and structures from PDFs, compiling them into a download-ready Word docx document.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to Word DOCX online for free. Processes file text client-side, compiling a brand new DOCX structure right inside your browser.",
    steps: ["Select your source PDF document.", "Our parser analyzes text blocks and page layout elements.", "Click 'Optimize & Convert' to compile the DOCX structure.", "Download your editable Word document."],
    faqs: [
      { q: "Can I edit the converted Word file?", a: "Yes. It generates a fully native Word document with editable paragraphs and formatting runs." }
    ],
    related: ["word-to-pdf", "pdf-compressor"]
  },
  "pdf-to-ppt": {
    id: "pdf-to-ppt",
    name: "PDF to PowerPoint",
    headline: "Convert PDF Pages to PowerPoint Slides",
    description: "Export PDF page layouts as editable vector slides inside a Microsoft PPTX presentation locally.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to PPTX online. Safe client-side document processing extracts shapes and text to build editable PowerPoint slides.",
    steps: ["Select the PDF file.", "Click 'Optimize & Convert'.", "Download the compiled PPTX slide deck."],
    faqs: [
      { q: "Is the vector formatting preserved?", a: "Yes, shapes and text are mapped as vector components where possible for editing." }
    ],
    related: ["pdf-to-word", "pdf-to-excel"]
  },
  "pdf-to-excel": {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    headline: "Convert PDF Tables to Excel Spreadsheets",
    description: "Scan PDF tables and alignments and compile them into editable Microsoft Excel XLS/XLSX worksheets client-side.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to Excel spreadsheets. Fast browser text extraction constructs clean, structured XLSX grids with zero leaks.",
    steps: ["Choose your PDF document containing tables.", "Click 'Optimize & Convert' to map text loops to grids.", "Download your editable Excel sheet."],
    faqs: [
      { q: "Can it extract multiple tables?", a: "Yes, our algorithm handles page boundaries to separate grids into clean consecutive sheets." }
    ],
    related: ["pdf-to-word", "pdf-to-ppt"]
  },
  "pdf-to-pdfa": {
    id: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    headline: "Convert PDF to PDF/A for Long-Term Archiving",
    description: "Format standard PDF files to ISO-compliant PDF/A specifications (e.g. PDF/A-1b or PDF/A-2b) client-side securely.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to PDF/A online for ISO long-term archiving standard compliance. Secure local browser conversion.",
    steps: ["Select your standard PDF.", "Our engine checks and embeds standard fonts and profiles.", "Click 'Optimize & Convert'.", "Save the archived PDF/A document."],
    faqs: [
      { q: "Why use PDF/A?", a: "PDF/A is designed for long-term document preservation, ensuring the document looks exactly the same on any future device." }
    ],
    related: ["pdf-compressor", "protect-pdf"]
  },

  // Column 5: Edit PDF
  "rotate-pdf": {
    id: "rotate-pdf",
    name: "Rotate PDF",
    headline: "Rotate PDF Pages Online Locally",
    description: "Rotate individual or all pages of your PDF document (90°, 180°, 270° degrees) instantly in your browser.",
    inputAccept: ".pdf",
    metaDescription: "Rotate PDF files online for free. Adjust page rotations client-side in your browser. Completely private with zero uploads.",
    steps: ["Upload your PDF file.", "Select the rotation angle (90, 180, or 270 degrees).", "Click 'Optimize & Convert' to rewrite rotations.", "Download the rotated PDF."],
    faqs: [
      { q: "Can I rotate only a single page?", a: "Yes, our visual interface lets you select and rotate specific pages independently." }
    ],
    related: ["organize-pdf", "split-pdf"]
  },
  "add-page-numbers": {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    headline: "Add Page Numbers to PDF Files",
    description: "Number PDF pages recursively at the top or bottom margin. Visual alignment selectors execute entirely in the browser.",
    inputAccept: ".pdf",
    metaDescription: "Add page numbers to PDF documents online. Free, safe client-side stamp draws vector numbers locally on each sheet.",
    steps: ["Upload your PDF document.", "Choose your position (Top or Bottom center).", "Click 'Optimize & Convert'.", "Download your numbered PDF."],
    faqs: [
      { q: "Can I choose the numbering font?", a: "We embed standard highly legible Helvetica and Times New Roman vector fonts for printing." }
    ],
    related: ["add-watermark", "rotate-pdf"]
  },
  "add-watermark": {
    id: "add-watermark",
    name: "Add Watermark",
    headline: "Add Watermark Text to PDF Online",
    description: "Superimpose semi-transparent watermark text (e.g. 'CONFIDENTIAL') diagonally across pages. Opacity sliders execute locally.",
    inputAccept: ".pdf",
    metaDescription: "Watermark PDF files online for free. Add semi-transparent text to document pages client-side with zero file uploads.",
    steps: ["Select your PDF file.", "Enter your custom watermark text.", "Adjust the opacity using the range slider.", "Click 'Optimize & Convert' to draw layers.", "Download the watermarked PDF."],
    faqs: [
      { q: "Is the text watermark permanent?", a: "Yes, it is rendered as a flattened vector object layer, making it extremely difficult to remove." }
    ],
    related: ["add-page-numbers", "protect-pdf"]
  },
  "crop-pdf": {
    id: "crop-pdf",
    name: "Crop PDF",
    headline: "Crop PDF Page Margins and Boundaries",
    description: "Trim unnecessary whitespace or crop pages to specific margins. Set CropBox boundaries client-side instantly.",
    inputAccept: ".pdf",
    metaDescription: "Crop PDF pages online. Set precise margins and boundary coordinates client-side in your browser for free.",
    steps: ["Select the PDF file.", "Adjust margin bounding boxes.", "Click 'Optimize & Convert' to crop.", "Download the cropped PDF."],
    faqs: [
      { q: "Does cropping delete cropped content?", a: "It sets the standard PDF CropBox boundary. Content outside is hidden and not rendered in readers." }
    ],
    related: ["rotate-pdf", "add-page-numbers"]
  },
  "edit-pdf": {
    id: "edit-pdf",
    name: "Edit PDF",
    headline: "Edit PDF Text and Drawing Objects",
    description: "Add annotations, text layers, shapes, or draw directly on your PDF pages locally in the browser.",
    inputAccept: ".pdf",
    metaDescription: "Edit PDF documents online. Free browser-level editor allows adding text, shapes, and markings safely client-side.",
    steps: ["Upload your PDF document.", "Use the drawing and text tools to annotate pages.", "Re-serialize changes.", "Download your edited PDF."],
    faqs: [
      { q: "Is my edit layout preserved?", a: "Yes, all annotations are saved as standard PDF annotation structures compatible with Adobe Reader." }
    ],
    related: ["sign-pdf", "add-watermark"]
  },
  "pdf-forms": {
    id: "pdf-forms",
    name: "PDF Forms Fill & Create",
    headline: "Fill Out & Create PDF Form Fields",
    description: "Fill interactive PDF form text fields, checkboxes, and radio buttons or insert new form inputs locally.",
    inputAccept: ".pdf",
    metaDescription: "Fill out interactive PDF forms online. Secure browser-level form editor updates document fields safely client-side.",
    steps: ["Select the PDF form document.", "Form fields light up. Click and type to fill them.", "Click 'Optimize & Convert' to bake entries.", "Save the completed PDF form."],
    faqs: [
      { q: "Can I save the form and edit it later?", a: "Yes. The entries are saved as standard form field values so they remain interactive in any reader." }
    ],
    related: ["edit-pdf", "sign-pdf"]
  },

  // Column 6: PDF Security
  "unlock-pdf": {
    id: "unlock-pdf",
    name: "Unlock PDF",
    headline: "Unlock Password Protected PDF Files",
    description: "Decrypt and remove password security from your PDF documents if you know the password. Fast, fully client-side.",
    inputAccept: ".pdf",
    metaDescription: "Unlock PDF files online. Remove owner password restrictions from PDF documents client-side in your browser safely.",
    steps: ["Select the encrypted PDF.", "Enter the file password when prompted.", "Click 'Optimize & Convert' to strip the lock.", "Download your unlocked PDF."],
    faqs: [
      { q: "Does ConvertOrbit crack password protection?", a: "No, this is a secure decryptor. You must know the password to authorize and unlock the PDF." }
    ],
    related: ["protect-pdf", "sign-pdf"]
  },
  "protect-pdf": {
    id: "protect-pdf",
    name: "Protect PDF",
    headline: "Protect PDF with Passwords & Encryption",
    description: "Secure confidential PDF contracts and sheets by encrypting them with a password locally inside your browser.",
    inputAccept: ".pdf",
    metaDescription: "Protect PDF files online with password encryption. Complete browser-level security checks with zero server uploads.",
    steps: ["Upload your PDF document.", "Input your secure password in the options panel.", "Click 'Optimize & Convert' to encrypt.", "Save your protected PDF."],
    faqs: [
      { q: "What encryption standard is used?", a: "Our client-side engine uses standard PDF encryption parameters supported by all major PDF software." }
    ],
    related: ["unlock-pdf", "add-watermark"]
  },
  "sign-pdf": {
    id: "sign-pdf",
    name: "Sign PDF",
    headline: "Sign PDF Documents Online Free",
    description: "Draw, save, and stamp your custom signature onto PDF pages visually. Processes 100% locally in your browser sandbox.",
    inputAccept: ".pdf",
    metaDescription: "Sign PDF online. Draw your signature on a drawing pad and place it on document pages client-side with zero files saved on servers.",
    steps: ["Upload your PDF contract or sheet.", "Draw your signature on our drawing pad and click 'Save'.", "Choose page and position quadrants.", "Click 'Optimize & Convert' to bake the signature image.", "Download the signed document."],
    faqs: [
      { q: "Is drawing signatures client-side safe?", a: "Yes. Since your vector signature is drawn directly to local canvases and baked locally, it is completely secure from intercept." }
    ],
    related: ["edit-pdf", "pdf-forms"]
  },
  "redact-pdf": {
    id: "redact-pdf",
    name: "Redact PDF",
    headline: "Redact Sensitive Text & Content from PDF",
    description: "Blackout and cryptographically delete highly sensitive names, numbers, or sections from your PDFs client-side.",
    inputAccept: ".pdf",
    metaDescription: "Redact PDF files online for free. Strip text blocks and draw black bounding box blocks safely client-side in the browser.",
    steps: ["Upload your PDF.", "Highlight or draw rectangles over elements to redact.", "Click 'Optimize & Convert' to remove text elements.", "Download the redacted PDF."],
    faqs: [
      { q: "Does redaction delete the underlying text?", a: "Yes, our engine strips matching text coordinates from page code rather than just painting over it." }
    ],
    related: ["protect-pdf", "edit-pdf"]
  },
  "compare-pdf": {
    id: "compare-pdf",
    name: "Compare PDF",
    headline: "Compare Two PDF Files and Find Differences",
    description: "Scan two versions of a PDF document page-by-page to detect visual changes and text adjustments locally.",
    inputAccept: ".pdf",
    metaDescription: "Compare PDF files online. Detect visual layout changes and text differences between two documents client-side.",
    steps: ["Upload document version A.", "Upload document version B.", "Click 'Optimize & Convert' to scan.", "View visual diff markers."],
    faqs: [
      { q: "How are visual diffs rendered?", a: "We overlay rendered page canvas contexts to highlight color difference thresholds." }
    ],
    related: ["edit-pdf", "organize-pdf"]
  },

  // Column 7: PDF Intelligence
  "ai-summarizer": {
    id: "ai-summarizer",
    name: "AI PDF Summarizer",
    headline: "AI PDF Summarizer: Summarize PDF Instantly",
    description: "Get key summaries, milestones, and bullet points from lengthy PDF articles and reports locally.",
    inputAccept: ".pdf",
    metaDescription: "Summarize PDF documents online using AI. Secure client-side text parsing delivers instant key summaries and takeaways.",
    steps: ["Select your PDF document.", "Click 'Optimize & Convert' to boot our local summarize wrappers.", "View dynamic key takeaways and highlights.", "Save the summary text file."],
    faqs: [
      { q: "Are my document texts sent to AI cloud databases?", a: "No. The text parser processes loops inside local memory safely." }
    ],
    related: ["translate-pdf", "pdf-to-word"]
  },
  "translate-pdf": {
    id: "translate-pdf",
    name: "Translate PDF",
    headline: "Translate PDF Documents Online",
    description: "Translate your PDF texts page-by-page into dozens of foreign languages securely client-side.",
    inputAccept: ".pdf",
    metaDescription: "Translate PDF documents online for free. Local browser parsers extract text blocks and map translations with zero leaks.",
    steps: ["Select your PDF.", "Choose your target language (e.g. Spanish, French, German).", "Click 'Optimize & Convert'.", "Download your translated PDF."],
    faqs: [
      { q: "Is the formatting preserved?", a: "Yes, we map translated text runs exactly back to their original page coordinates." }
    ],
    related: ["ai-summarizer", "pdf-to-word"]
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
    title: `${tool.name} - 100% Free & Secure | ConvertOrbit`,
    description: tool.metaDescription,
    alternates: {
      canonical: `https://convertorbit.com/tools/${tool.id}`,
    },
    openGraph: {
      title: `${tool.name} - Instant Browser Utility | ConvertOrbit`,
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

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${tool.name} by ConvertOrbit`,
    "operatingSystem": "All",
    "applicationCategory": "UtilityApplication",
    "browserRequirements": "Requires HTML5 capabilities.",
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

  const isSmart = tool.id === "ai-summarizer" || tool.id === "translate-pdf";

  return (
    <>
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

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-accent-blue">
              {isSmart ? <Sparkles className="h-3.5 w-3.5 animate-pulse" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
              <span>{isSmart ? "Next-Gen AI Utility" : "100% Client-Side Secure Engine"}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {tool.headline}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              {tool.description}
            </p>
          </div>

          <div className="mb-8">
            <AdPlaceholder slot={`above-tool-${tool.id}`} format="horizontal" />
          </div>

          <div className="mb-14">
            <ToolInterface toolId={tool.id} inputAccept={tool.inputAccept} toolName={tool.name} />
          </div>

          <div className="mb-14">
            <AdPlaceholder slot={`below-tool-${tool.id}`} format="horizontal" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16 border-t border-card-border pt-16">
            <div className="lg:col-span-2 space-y-12">
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
                          <p className="text-[10px] text-slate-400 font-medium">100% Client-side</p>
                        </div>
                        <ArrowLeft className="h-4 w-4 text-slate-400 group-hover:text-accent-blue group-hover:translate-x-0.5 rotate-180 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-emerald-800">Files Processed Securely</p>
                  <p className="text-[10px] text-emerald-600 leading-relaxed font-medium">
                    ConvertOrbit runs calculations inside browser sandboxes. Your documents never touch external databases.
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
