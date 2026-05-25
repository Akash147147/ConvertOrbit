import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Compass, Check, Users, ShieldAlert } from "lucide-react";

export default function TransparencyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-slate-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-md">
              <Compass className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Transparency Report
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
              Our ongoing commitment to complete openness. Confirming zero user file logs, zero government data orders, and 100% transparent client code execution.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Check className="h-5 w-5 text-emerald-600" />, title: "0 Files Logged", desc: "Since our launch, zero user files have been uploaded to or cached on our servers." },
              { icon: <Users className="h-5 w-5 text-blue-600" />, title: "0 Government Orders", desc: "We have received zero national security letters, subpoenas, or data disclosure orders." },
              { icon: <ShieldAlert className="h-5 w-5 text-rose-600" />, title: "0 Backdoors", desc: "No backdoors, decryption keys, or intercept configurations exist within our browser sandbox." }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-card-border p-6 rounded-2xl shadow-sm space-y-3">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                  {stat.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800">{stat.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Report body */}
          <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50 space-y-8 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">1. Data Requests and Disclosures</h2>
              <p>
                Because **FileForge** operates using Next-Gen local browser APIs, we have zero file storage databases, zero file uploads, and zero user account information. Consequently:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>We do not possess or store your document bytes.</li>
                <li>We cannot satisfy any data decryption requests.</li>
                <li>We cannot comply with data disclosure or search warrants targeting user conversions.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">2. Open Source Audits</h2>
              <p>
                Our core operations rely on highly vetted, widely trusted open source libraries (including `pdf-lib`, `browser-image-compression`, and `ffmpeg.wasm`). We welcome browser network audits, proving that no payload transfers occur when files are processed inside our interfaces.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">3. Warrant Canary</h2>
              <p>
                FileForge has never compiled, altered, or shared files in response to secret orders or backdoors. As of today, **FileForge canary remains completely operational and green.**
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
