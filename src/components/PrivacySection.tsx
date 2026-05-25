import { ShieldCheck, HardDrive, Cpu, Lock } from "lucide-react";

export default function PrivacySection() {
  const points = [
    {
      icon: <Cpu className="h-6 w-6 text-accent-blue" />,
      title: "Client-Side Processing",
      desc: "All calculations and format transformations happen directly inside your web browser. No large file transfers.",
    },
    {
      icon: <HardDrive className="h-6 w-6 text-accent-indigo" />,
      title: "Zero Server Uploads",
      desc: "Your source files never reach our web servers. They remain entirely local on your physical hard drive.",
    },
    {
      icon: <Lock className="h-6 w-6 text-accent-blue" />,
      title: "100% Secure & Private",
      desc: "No data logs, no metadata storage, and no tracking. Ultimate cryptographic privacy by design.",
    },
  ];

  return (
    <section id="security" className="py-20 bg-slate-50/30 border-t border-card-border scroll-mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4 fill-emerald-100" />
            <span>Files Processed Securely</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Ultimate Security, Zero Compromise
          </h2>
          <p className="text-lg text-slate-600">
            Traditional tools upload your files to foreign servers. ConvertOrbit changes the rules by bringing the conversion power directly into your browser.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point, index) => (
            <div
              key={index}
              className="relative p-8 bg-white border border-card-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start gap-4"
            >
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                {point.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{point.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
