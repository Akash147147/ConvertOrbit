import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity, CheckCircle2, Server, Smartphone, Monitor } from "lucide-react";

export default function StatusPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-slate-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-md">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              System Status
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
              Live status dashboard. Because processing occurs entirely in your browser, our conversion services are always 100% online.
            </p>
          </div>

          {/* Uptime Box */}
          <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/50 space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">All Browser Services Operational</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Uptime: 100%</p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            </div>

            {/* Individual component status grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Service Health</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Local Image Compressors", desc: "Canvas, EXIF stripper, scaling loops", icon: <Monitor className="h-4.5 w-4.5 text-blue-500" /> },
                  { name: "Browser PDF Editors", desc: "pdf-lib streams, split, merge, numbers", icon: <Server className="h-4.5 w-4.5 text-indigo-500" /> },
                  { name: "WASM Video Transcoder", desc: "ffmpeg.wasm quick chunks", icon: <Smartphone className="h-4.5 w-4.5 text-sky-500" /> },
                  { name: "Crypto Checksum APIs", desc: "Web Crypto SHA-256 and MD5 hashing", icon: <Activity className="h-4.5 w-4.5 text-emerald-500" /> }
                ].map((s, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-100 shrink-0">
                        {s.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{s.name}</h4>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
