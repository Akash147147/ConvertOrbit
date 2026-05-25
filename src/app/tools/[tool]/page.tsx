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
      { q: "How do I specify page ranges?", a: "Simply enter the numbers separated by commas and hyphens, for example '1-3, 5' to extract pages 1, 2, 3, and 5." }
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

  // Column 2: Optimize PDF & Exact sizes
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
  "compress-pdf-100kb": {
    id: "compress-pdf-100kb",
    name: "Compress PDF to 100KB",
    headline: "Compress PDF to Exactly 100KB Online",
    description: "Shrink heavy PDF documents exactly under the 100KB threshold to pass strict governmental or visa upload portals recursively.",
    inputAccept: ".pdf",
    metaDescription: "Compress PDF documents exactly below 100KB online for free. Highly optimized client-side compaction runs directly in your browser.",
    steps: ["Select your PDF document.", "Click 'Optimize & Convert' to run our local adaptive compressor.", "Verify the final size matches the 100KB cap.", "Download your optimized PDF document."],
    faqs: [
      { q: "How does it compress exactly to 100KB?", a: "Our algorithm runs local stream compaction and rasterizes high-resolution image resources to align with the 100KB threshold." }
    ],
    related: ["compress-pdf-500kb", "pdf-compressor"]
  },
  "compress-pdf-500kb": {
    id: "compress-pdf-500kb",
    name: "Compress PDF to 500KB",
    headline: "Compress PDF to Exactly 500KB Online",
    description: "Reduce the weight of large PDF portfolios and books exactly below the 500KB cap client-side.",
    inputAccept: ".pdf",
    metaDescription: "Compress PDF files exactly below 500KB online for free. Secure browser-based stream processing ensures total data privacy.",
    steps: ["Select your PDF file.", "Click 'Optimize & Convert' to boot our local adaptive compressor.", "Verify size bounds match the 500KB limit.", "Save and download the compressed PDF."],
    faqs: [
      { q: "Does the text quality remain sharp?", a: "Yes. Text blocks remain vector sharp and searchable; only visual elements are optimized." }
    ],
    related: ["compress-pdf-100kb", "pdf-compressor"]
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

  // Column 3: Exact Image resizers
  "compress-image-20kb": {
    id: "compress-image-20kb",
    name: "Compress Image to 20KB",
    headline: "Compress JPG/PNG Images to Exactly 20KB",
    description: "Shrink photos, passport uploads, or signatures exactly below the 20KB threshold for online registration portals.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Resize and compress images exactly below 20KB online. Fast client-side binary search adjusts quality directly in your browser.",
    steps: ["Upload your JPG or PNG image.", "The target KB is automatically locked to exactly 20KB.", "Click 'Optimize & Convert'.", "Download your exact 20KB image."],
    faqs: [
      { q: "Why is 20KB important?", a: "Many government and job portals cap photo uploads to strictly under 20KB." }
    ],
    related: ["compress-image-50kb", "signature-resize-20kb"]
  },
  "compress-image-50kb": {
    id: "compress-image-50kb",
    name: "Compress Image to 50KB",
    headline: "Compress JPG/PNG Images to Exactly 50KB",
    description: "Scale photos, visa applications, or profile pictures exactly under the 50KB limit client-side.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Resize and compress image files exactly below 50KB online. Client-side canvas binary search ensures perfect size accuracy.",
    steps: ["Select your image file.", "The target size is locked to 50KB.", "Click 'Optimize & Convert'.", "Download your clean 50KB JPG."],
    faqs: [
      { q: "Is PNG supported?", a: "Yes, our canvas engine processes PNGs and automatically compresses them to optimized JPGs to hit 50KB." }
    ],
    related: ["compress-image-20kb", "compress-image-100kb"]
  },
  "compress-image-100kb": {
    id: "compress-image-100kb",
    name: "Compress Image to 100KB",
    headline: "Compress JPG/PNG Images to Exactly 100KB",
    description: "Resize high-resolution pictures to exactly under 100KB for school portals, visa uploads, or web forms recursively.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Resize images to exactly 100KB online for free. Highly optimized client-side resizing guarantees perfect results.",
    steps: ["Select your source picture.", "Target KB is locked to 100KB.", "Click 'Optimize & Convert'.", "Save the optimized 100KB image file."],
    faqs: [
      { q: "Does this upload my image?", a: "No, all binary search processes run client-side in browser memory." }
    ],
    related: ["compress-image-50kb", "compress-image-exact-kb"]
  },
  "signature-resize-20kb": {
    id: "signature-resize-20kb",
    name: "Signature Resize 20KB",
    headline: "Resize Signature Images to Exactly 20KB",
    description: "Shrink signatures or transparent sign snippets exactly below 20KB to comply with governmental portal limits.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Resize signature images to exactly under 20KB online. Perfect size adjustments client-side for secure uploads.",
    steps: ["Upload your signature JPG/PNG snippet.", "The target size is set to 20KB.", "Click 'Optimize & Convert'.", "Download your optimized signature."],
    faqs: [
      { q: "Does it keep the signature sharp?", a: "Yes. Our binary search preserves sharp contours and high legibility even under 20KB." }
    ],
    related: ["compress-image-20kb", "sign-pdf"]
  },

  // Column 4: Passport & Visa maker
  "passport-photo-maker": {
    id: "passport-photo-maker",
    name: "Passport Photo Maker",
    headline: "Create standard 2x2 inch Passport Photos",
    description: "Align, crop, and resize your face photo to standard 2x2 inch (51x51mm) dimensions. Includes chin-crown boundary alignment grids.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Passport photo maker online. Crop your photo to standard 2x2 inch boundaries client-side in your browser for free.",
    steps: ["Select your portrait photo.", "Align your crown and chin within our visual guides.", "Click 'Optimize & Convert' to crop and scale.", "Download print-ready passport photos."],
    faqs: [
      { q: "What are the dimensions?", a: "Standard US passport photos require exactly 2x2 inches (51x51mm) at 300 DPI." }
    ],
    related: ["visa-photo-maker", "compress-image-20kb"]
  },
  "visa-photo-maker": {
    id: "visa-photo-maker",
    name: "Visa Photo Resizer",
    headline: "Resize Visa Photos Online Free",
    description: "Format portrait pictures to customized European Schengen, US, or Asian embassy visa specifications.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Embassy visa photo resizer online. Crop and format photos to standard visa sizes client-side securely.",
    steps: ["Upload your portrait picture.", "Select your target visa size (e.g. 35x45mm).", "Align your face inside crop grids.", "Save your optimized visa photo."],
    faqs: [
      { q: "What is the standard Schengen visa size?", a: "Schengen visas require exactly 35x45mm color photos with a light background." }
    ],
    related: ["passport-photo-maker", "compress-image-50kb"]
  },

  // Column 5: Social Crop Aspect Resizers
  "youtube-thumbnail-resizer": {
    id: "youtube-thumbnail-resizer",
    name: "YouTube Thumbnail Resizer",
    headline: "Resize YouTube Thumbnails to 1280x720",
    description: "Lock aspect ratios to exactly 16:9 and output exactly 1280x720 pixel JPG thumbnails under the 2MB cap.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "YouTube thumbnail resizer online. Scale and resize images to standard 1280x720 format client-side in browser.",
    steps: ["Upload your thumbnail design.", "Our engine locks aspect parameters to 1280x720.", "Click 'Optimize & Convert'.", "Save the ready YouTube thumbnail."],
    faqs: [
      { q: "Why is 1280x720 important?", a: "YouTube requires exactly 1280x720 dimensions at 16:9 aspect ratio, keeping files under 2MB." }
    ],
    related: ["linkedin-crop", "instagram-resize"]
  },
  "linkedin-crop": {
    id: "linkedin-crop",
    name: "LinkedIn Banner Crop",
    headline: "Format LinkedIn Banners to 1584x396",
    description: "Lock aspect ratios to 4:1 and crop backgrounds exactly to standard 1584x396 pixel banner layouts.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "LinkedIn banner crop online. Scale images to exactly 1584x396 pixel grids client-side for free.",
    steps: ["Select your background banner image.", "Crop bounds are locked to 4:1 aspect parameters.", "Adjust crop viewport and compile.", "Download the LinkedIn banner."],
    faqs: [
      { q: "What is the banner size?", a: "LinkedIn profiles require exactly 1584x396 pixel dimensions." }
    ],
    related: ["youtube-thumbnail-resizer", "instagram-resize"]
  },
  "instagram-resize": {
    id: "instagram-resize",
    name: "Instagram Image Resizer",
    headline: "Resize Images for Instagram Square & Story",
    description: "Scale pictures to 1:1 square (1080x1080) or 9:16 vertical parameters client-side instantly.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Instagram resizer online. Crop and format photos to standard square or story bounds client-side.",
    steps: ["Select your portrait or landscape photo.", "Select Square (1:1) or Story (9:16) aspect ratios.", "Click 'Optimize & Convert'.", "Download your Instagram-ready photo."],
    faqs: [
      { q: "Will the background blur?", a: "Our canvas engine lets you fit layouts cleanly to avoid cropping details." }
    ],
    related: ["youtube-thumbnail-resizer", "linkedin-crop"]
  },

  // Column 6: Security & Metadata
  "strip-metadata": {
    id: "strip-metadata",
    name: "Strip Metadata",
    headline: "Remove EXIF Metadata from Images Online",
    description: "Delete geolocation coordinates, camera model tags, and creation date headers to protect your online privacy completely.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Remove EXIF metadata online for free. Delete GPS coordinates and camera profiles client-side. Zero server uploads.",
    steps: ["Select your JPG/PNG image.", "Review the embedded EXIF parameter list.", "Click 'Strip EXIF Data' to wipe headers.", "Download the clean metadata-free image."],
    faqs: [
      { q: "What metadata is stripped?", a: "Our local canvas stripper removes GPS coordinates, timestamps, camera models, exposure settings, and color profiles." }
    ],
    related: ["protect-pdf", "convert-dpi"]
  },
  "convert-dpi": {
    id: "convert-dpi",
    name: "Convert DPI",
    headline: "Change Image DPI Resolution Online",
    description: "Alter hardware-level resolution metadata density headers (e.g. 72, 150, 300 DPI) client-side in the browser.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Change image DPI online. Edit resolution density parameters in your browser safely with zero uploads.",
    steps: ["Upload your image.", "Select your target density: 72 DPI, 150 DPI, or 300 DPI.", "Click 'Optimize & Convert'.", "Download the high-density image file."],
    faqs: [
      { q: "Why convert to 300 DPI?", a: "300 DPI is the industry printing standard, ensuring sharp physical details." }
    ],
    related: ["strip-metadata", "passport-photo-maker"]
  },
  "checksum-tool": {
    id: "checksum-tool",
    name: "File Checksum Tool",
    headline: "Generate SHA-256 and MD5 File Checksums",
    description: "Compute cryptographic hashes client-side in browser memory using the secure Web Crypto API.",
    inputAccept: "*",
    metaDescription: "Generate file checksums online. Securely calculate SHA-256 and MD5 hashes client-side in your browser.",
    steps: ["Select any file from your computer.", "Choose SHA-256 or MD5 hashing algorithms.", "Click 'Optimize & Convert' to parse binary loops.", "Copy your completed file hash instantly."],
    faqs: [
      { q: "Are my files uploaded for hashing?", a: "No. The browser reads files locally into array buffer arrays and hashes them on your own CPU." }
    ],
    related: ["hash-generator", "protect-pdf"]
  },

  // Column 7: Developer tools
  "json-formatter": {
    id: "json-formatter",
    name: "JSON Formatter",
    headline: "Format & Lint JSON Code Client-Side",
    description: "Validate, clean, and indent messy JSON text codes locally in your browser inside milliseconds.",
    inputAccept: ".json,text/plain",
    metaDescription: "Format and lint JSON online. Clean and indent code structures client-side in your browser securely.",
    steps: ["Paste raw JSON code into our text editor.", "Click 'Process Text' to validate rules.", "Copy the clean indented output."],
    faqs: [
      { q: "Is my JSON text private?", a: "Yes, it is parsed locally in the browser sandbox with zero database uploads." }
    ],
    related: ["base64-encoder", "hash-generator"]
  },
  "base64-encoder": {
    id: "base64-encoder",
    name: "Base64 Encoder",
    headline: "Base64 Encode & Decode Text Online",
    description: "Convert string characters to standard Base64 encoding schemas client-side instantly.",
    inputAccept: "text/plain",
    metaDescription: "Encode and decode Base64 online. Free, safe client-side browser text converter.",
    steps: ["Enter source text characters.", "Click 'Process Text' to transcode.", "Copy your Base64 encoded result."],
    faqs: [
      { q: "Does it support decoding?", a: "Yes, you can easily select encode or decode operations in the workspace panel." }
    ],
    related: ["json-formatter", "hash-generator"]
  },
  "hash-generator": {
    id: "hash-generator",
    name: "Hash Generator",
    headline: "Generate MD5 & Cryptographic Hashes",
    description: "Instantly compile cryptographic string hashes locally inside the browser memory.",
    inputAccept: "text/plain",
    metaDescription: "Generate text hashes online. Instantly calculate MD5 and SHA-256 strings client-side.",
    steps: ["Type your source string.", "Click 'Process Text'.", "Copy the generated hash string."],
    faqs: [
      { q: "What algorithms are supported?", a: "We compile standard SHA-256 and MD5 hash values." }
    ],
    related: ["json-formatter", "base64-encoder"]
  },
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
      { q: "Is my privacy protected with ConvertOrbit HEIC to JPG?", a: "Yes. The conversion takes place entirely client-side using heic2any in your browser. Your images never leave your local device." }
    ],
    related: ["compress-image-exact-kb", "png-to-ico"]
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
      { q: "How does exact KB compression work?", a: "Our algorithm runs a client-side binary search on the quality parameters and dimensions, generating test canvases to narrow in on the target size." }
    ],
    related: ["compress-image-20kb", "png-to-ico"]
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
      { q: "Does this require downloading desktop software?", a: "No. The system loads FFmpeg.wasm dynamically inside your browser environment to convert files securely and locally." }
    ],
    related: ["pdf-compressor", "heic-to-jpg"]
  },

  // Security tools
  "protect-pdf": {
    id: "protect-pdf",
    name: "Protect PDF",
    headline: "Password Protect PDF Files Online Free",
    description: "Encrypt and password-lock your PDF documents entirely inside your browser. No server uploads, no third-party access to your sensitive data.",
    inputAccept: ".pdf",
    metaDescription: "Password protect PDF online for free. Encrypt PDF documents with secure passwords client-side in your browser. Zero file uploads.",
    steps: [
      "Upload the PDF document you want to protect.",
      "Enter a strong password in the password field.",
      "Click 'Optimize & Convert' to encrypt the PDF locally.",
      "Download your password-protected PDF file."
    ],
    faqs: [
      { q: "Is the encryption secure?", a: "Yes. The PDF is encrypted using standard PDF encryption algorithms directly in your browser memory. Your file and password never leave your device." },
      { q: "Can I remove the password later?", a: "You will need the original password to open the file. Use any PDF reader to remove the password protection after opening." }
    ],
    related: ["sign-pdf", "merge-pdf"]
  },
  "sign-pdf": {
    id: "sign-pdf",
    name: "Sign PDF",
    headline: "Draw & Stamp Signatures on PDF Documents",
    description: "Draw your signature on a built-in canvas pad, then stamp it as a transparent overlay on any page of your PDF document. 100% client-side.",
    inputAccept: ".pdf",
    metaDescription: "Sign PDF online for free. Draw signatures and stamp them on PDF pages client-side in your browser. No uploads, fully private.",
    steps: [
      "Upload the PDF document you want to sign.",
      "Draw your signature on the signature pad below.",
      "Click 'Save Signature' to lock your handwriting.",
      "Click 'Optimize & Convert' to stamp the signature on the specified page.",
      "Download your signed PDF document."
    ],
    faqs: [
      { q: "Is my signature stored on a server?", a: "No. Your signature is drawn on a local HTML5 canvas element and only exists in your browser's memory. It is never uploaded." },
      { q: "Can I choose which page to sign?", a: "Yes. You can specify the page number where you want the signature to appear." }
    ],
    related: ["protect-pdf", "merge-pdf"]
  },

  // Image converters
  "png-to-ico": {
    id: "png-to-ico",
    name: "PNG to ICO Converter",
    headline: "Convert PNG Images to ICO Favicon Format",
    description: "Transform standard PNG images into multi-resolution ICO favicon files for websites and applications. Processed entirely client-side.",
    inputAccept: ".png",
    metaDescription: "Convert PNG to ICO online for free. Create multi-resolution favicon files from PNG images client-side in your browser.",
    steps: [
      "Upload your PNG image file.",
      "Select the desired icon sizes (16x16, 32x32, 48x48, 64x64).",
      "Click 'Optimize & Convert' to generate the ICO file.",
      "Download your new ICO favicon file."
    ],
    faqs: [
      { q: "What sizes are included in the ICO file?", a: "By default, our converter generates 16x16, 32x32, 48x48, and 64x64 pixel resolutions packed into a single ICO file." },
      { q: "Can I use this for my website favicon?", a: "Absolutely. The generated ICO file is ready to use as a favicon in any website or web application." }
    ],
    related: ["heic-to-jpg", "compress-image-exact-kb"]
  },

  // Document converters
  "word-to-pdf": {
    id: "word-to-pdf",
    name: "Word to PDF",
    headline: "Convert Word Documents to PDF Online",
    description: "Transform Microsoft Word (.docx) documents into universally portable PDF format directly inside your browser using local rendering.",
    inputAccept: ".doc,.docx",
    metaDescription: "Convert Word to PDF online for free. Transform DOCX documents into PDF files securely client-side. No file uploads, instant results.",
    steps: [
      "Upload your Word (.docx) document.",
      "Click 'Optimize & Convert' to render the document locally.",
      "Preview the converted PDF output.",
      "Download your new PDF file."
    ],
    faqs: [
      { q: "Does formatting stay intact?", a: "Our local rendering engine preserves text formatting, headings, and basic layouts during conversion." },
      { q: "Are my documents uploaded to a server?", a: "No. The entire conversion happens client-side in your browser's memory." }
    ],
    related: ["pdf-to-word", "merge-pdf"]
  },
  "pdf-to-word": {
    id: "pdf-to-word",
    name: "PDF to Word",
    headline: "Convert PDF Documents to Editable Word Files",
    description: "Extract text and layouts from PDF documents and convert them into editable Microsoft Word (.docx) format entirely client-side.",
    inputAccept: ".pdf",
    metaDescription: "Convert PDF to Word online for free. Extract text from PDF files into editable DOCX documents client-side in your browser.",
    steps: [
      "Upload your PDF document.",
      "Click 'Optimize & Convert' to parse and extract text content.",
      "The engine converts the extracted content into a DOCX format.",
      "Download your editable Word document."
    ],
    faqs: [
      { q: "Can it handle scanned PDFs?", a: "For scanned image PDFs, we recommend using our OCR PDF tool first to make the text searchable, then convert to Word." },
      { q: "Is the formatting preserved?", a: "Basic text formatting and paragraphs are preserved. Complex layouts may require minor adjustments." }
    ],
    related: ["word-to-pdf", "ocr-pdf"]
  },
  "jpg-to-pdf": {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    headline: "Convert JPG Images to PDF Documents",
    description: "Combine one or multiple JPG/JPEG images into a single, clean PDF document. Drag and drop multiple images to create multi-page PDFs locally.",
    inputAccept: ".jpg,.jpeg,.png",
    metaDescription: "Convert JPG to PDF online for free. Combine multiple images into a single PDF document client-side in your browser.",
    steps: [
      "Upload one or more JPG/PNG images.",
      "Drag to reorder the images in your preferred sequence.",
      "Click 'Optimize & Convert' to compile the PDF.",
      "Download your new multi-page PDF document."
    ],
    faqs: [
      { q: "Can I add multiple images?", a: "Yes. You can upload and arrange multiple images to create a multi-page PDF document." },
      { q: "What image formats are supported?", a: "We support JPG, JPEG, and PNG image formats for PDF conversion." }
    ],
    related: ["merge-pdf", "compress-image-exact-kb"]
  },
  "universal-dashboard": {
    id: "universal-dashboard",
    name: "Universal File Dashboard",
    headline: "Universal File Dashboard & Deep Sandbox Inspector",
    description: "Analyze, inspect metadata EXIF segments, strip privacy coordinates, and run batch optimizations on HEIC, PDFs, PNGs, and videos. 100% in-browser sandboxed processing.",
    inputAccept: "*",
    metaDescription: "Universal File Dashboard online. Deep local browser sandbox to inspect metadata, strip EXIF details, and compress or optimize files securely with zero server uploads.",
    steps: [
      "Upload any file (image, PDF, video, or document).",
      "Inspect detailed specifications: size, format, DPI, resolution, and EXIF segments.",
      "Review the Smart Suggested Operations list based on MIME-type.",
      "Execute quick actions or bulk configurations in a single click."
    ],
    faqs: [
      { q: "Is the universal file inspection secure?", a: "Yes. All file analytical scanners and image properties checks are executed locally inside browser RAM memory sandbox. Absolutely zero network uploads." }
    ],
    related: ["compress-image-exact-kb", "pdf-compressor", "strip-metadata"]
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
    title: `${tool.name} - 100% Free & Secure | FileForge`,
    description: tool.metaDescription,
    alternates: {
      canonical: `https://convertorbit.com/tools/${tool.id}`,
    },
    openGraph: {
      title: `${tool.name} - Instant Browser Utility | FileForge`,
      description: tool.metaDescription,
      url: `https://convertorbit.com/tools/${tool.id}`,
      siteName: "FileForge",
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

  const isSmart = tool.id === "ai-summarizer" || tool.id === "translate-pdf" || tool.id === "json-formatter";

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
              <span>{isSmart ? "Next-Gen Sandbox Tool" : "100% Client-Side Secure Engine"}</span>
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
