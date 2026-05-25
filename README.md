# ConvertOrbit - Premium Client-Side Document & PDF Suite

ConvertOrbit is a premium, ultra-fast, and mobile-first file conversion and compression platform built with **Next.js (App Router)** and **Tailwind CSS**. 

Unlike traditional platforms, ConvertOrbit processes **100% of operations client-side** inside the user's browser sandbox via WebAssembly and Canvas. Files never touch external servers, providing total data confidentiality.

👉 **Live Site**: [https://convertorbit.com](https://convertorbit.com)

---

## 🌟 Strategic Key Differentiators

ConvertOrbit is specifically designed to solve **highly searched, exact-constraint problems** that competitors do not address well:

1. **Exact KB Compressors**: Dedicated utilities designed for governmental and visa portals (`compress-image-20kb`, `compress-image-50kb`, `compress-image-100kb`, `signature-resize-20kb`, `compress-pdf-100kb`, `compress-pdf-500kb`).
2. **Passport & Visa Photo Resizers**: Built-in visual alignment guides (head and chin boundaries) for standard 2x2 inch and 35x45mm Schengen/US visa specifications.
3. **EXIF Metadata Strippers**: Local canvas filters that scan image headers, display exif parameters, and strip location coordinates and device profiles instantly.
4. **Developer Tools**: Fast, browser-local sandboxes for Base64 encodings, JSON linting, and cryptographic checksum generators (SHA-256).

---

## 🛠️ Tool Catalog (40+ Utilities)

Organized under 6 premium columns:
* **Exact KB Compressors**: Target exact KB boundaries for portal uploads.
* **Passport & Sizing**: Sizing crop rules for standard print/visa photos.
* **Social Aspect Crops**: Lock aspect ratios for YouTube, LinkedIn, and Instagram.
* **Advanced PDF**: Merge PDF (with drag-and-drop sort), Split PDF, Rotate PDF, Add Watermarks, Add Page Numbers, protect, and Sign PDF (with drawing pad).
* **Security & Metadata**: EXIF stripping, DPI resolution rewriting, and file integrity check hashes.
* **Developer Sandbox**: Lightning-fast Base64 encoding/decoding and JSON formatting.

---

## 🚀 Technical Architecture

* **Framework**: Next.js (App Router)
* **Styling**: Tailwind CSS
* **Core Libraries**: `pdf-lib`, `browser-image-compression`, `heic2any`, `mammoth.js`, `docx.js`, `framer-motion`, `@ffmpeg/ffmpeg` UMD WASM CDNs.
* **SEO Engine**: 100% Static pre-rendering (SSG) for all 35+ routes. Integrates advanced Google-friendly JSON-LD schemas (`SoftwareApplication`, `HowTo` guides, and `FAQPage` accordions) for top search result rankings.

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Akash147147/ConvertOrbit.git
   cd ConvertOrbit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🌍 Vercel Deployment

Deploy in under a minute without configuring server hosting:
1. Connect your Vercel account to GitHub.
2. Select **"Import"** on the **`ConvertOrbit`** repository.
3. Click **"Deploy"** (Vercel automatically detects Next.js configurations).
