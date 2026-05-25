import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, Cpu, Lock, Terminal } from "lucide-react";

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-slate-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Security Architecture
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
              How FileForge ensures 100% data safety by executing mathematical and structural manipulations entirely in your local browser sandbox.
            </p>
          </div>

          {/* Core pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Lock className="h-5 w-5 text-rose-600" />, title: "Browser Sandboxing", desc: "Using local HTML5 Canvas, FileReader, and Web Crypto APIs, files are structured, compressed, and transcoded purely within your device's isolated client process." },
              { icon: <Cpu className="h-5 w-5 text-blue-600" />, title: "WebAssembly Processing", desc: "Heavy compression algorithms and transcoders utilize isolated, locally compiled WASM engines, ensuring native performance with absolute data containment." },
              { icon: <Terminal className="h-5 w-5 text-sky-600" />, title: "Sanitized Codebase", desc: "Our codebase is structured with strict Content Security Policies (CSP), preventing inline cross-site scripting (XSS) and database/CSRF inject handles." },
              { icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />, title: "Zero File Retention", desc: "Because we have zero databases or server-side upload handlers, there is no physical server space where your data could leak or be breached." }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white border border-card-border p-6 rounded-2xl shadow-sm space-y-3">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                  {pillar.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800">{pillar.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Technical Specifications */}
          <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50 space-y-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-lg font-bold text-slate-800">Security Specifications & Compliance</h2>
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="min-w-full divide-y divide-slate-100 text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Security Feature</th>
                    <th className="px-6 py-3.5">Implementation Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-800">Transport Security (HSTS)</td>
                    <td className="px-6 py-4">Forced HSTS with max-age=63072000, preload enabled across all subdomains.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-800">COOP & COEP Headers</td>
                    <td className="px-6 py-4">Same-origin policy isolates window processes, enabling high-performance shared memory loops securely.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-800">SHA-256 Integrity</td>
                    <td className="px-6 py-4">Cryptographic integrity checks running locally using the browser's Web Crypto API.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-bold text-slate-800">MIME-Type Protection</td>
                    <td className="px-6 py-4">Local file scanners inspect byte headers to prevent executable injection or sniffing.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
