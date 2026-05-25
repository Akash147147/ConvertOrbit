import Link from "next/link";
import { Orbit, ShieldCheck, Heart } from "lucide-react";
import AdPlaceholder from "./AdPlaceholder";

export default function Footer() {
  return (
    <footer className="w-full border-t border-card-border bg-slate-50/50 mt-auto">
      {/* Optional AdSense slot */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <AdPlaceholder slot="footer-banner" format="horizontal" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-accent-blue to-accent-indigo text-white shadow-md shadow-accent-blue/10">
                <Orbit className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                Convert<span className="bg-gradient-to-r from-accent-blue to-accent-indigo bg-clip-text text-transparent">Orbit</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Fast, secure, and fully client-side files conversion and compression utilities. Your files never leave your computer.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md">
              <ShieldCheck className="h-4 w-4" />
              <span>Files processed securely</span>
            </div>
          </div>

          {/* Quick Links: Tools */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/heic-to-jpg" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  HEIC to JPG
                </Link>
              </li>
              <li>
                <Link href="/tools/png-to-ico" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  PNG to ICO
                </Link>
              </li>
              <li>
                <Link href="/tools/compress-image-exact-kb" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  Compress Image Exact KB
                </Link>
              </li>
              <li>
                <Link href="/tools/mov-to-mp4" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  MOV to MP4
                </Link>
              </li>
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Document Utilities</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/pdf-compressor" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/word-to-pdf" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-to-word" className="text-sm text-slate-600 hover:text-accent-blue transition-colors">
                  PDF to Word
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trust & Safety</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <span>No File Size Limits</span>
              </li>
              <li>
                <span>No User Accounts Required</span>
              </li>
              <li>
                <span>100% Free Forever</span>
              </li>
              <li>
                <span>Open Source Privacy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} ConvertOrbit. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for a faster, safer web.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
