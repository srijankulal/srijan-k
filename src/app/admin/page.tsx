import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Command Hub | Srijan K',
  description: 'Administrative portal for portfolio management, project ingestion, and synchronization.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminHubPage() {
  const tools = [
    {
      title: 'README to Project Ingestion (AI)',
      badge: 'GEMINI 3.1 FLASH',
      desc: 'Paste any project README markdown. Gemini automatically parses title, slug, stack, and architecture, prompts for preview photo upload & missing links, and commits directly to Sanity CMS.',
      href: '/admin/add-project',
      cta: 'Open Project Importer →',
      accent: 'border-neon/40 hover:border-neon',
    },
    {
      title: 'LinkedIn Posts Sync Portal',
      badge: 'AUTOMATED PIPELINE',
      desc: 'Sync latest LinkedIn activity, manage bulk posts history, review monthly summaries, and trigger manual synchronization jobs.',
      href: '/admin/posts-sync',
      cta: 'Open Posts Sync Portal →',
      accent: 'border-cyan-500/40 hover:border-cyan-400',
    },
    {
      title: 'Sanity Studio CMS',
      badge: 'DATABASE & ASSETS',
      desc: 'Direct Sanity Studio workspace to manually edit experiences, education records, project content, photos, and leadership documents.',
      href: '/studio',
      cta: 'Launch Studio ↗',
      accent: 'border-purple-500/40 hover:border-purple-400',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b0f] text-gray-200 font-mono p-6 sm:p-10 selection:bg-neon selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8 pt-10">
        <div className="border-b border-border/60 pb-6">
          <div className="flex items-center gap-2 text-xs text-neon mb-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-neon led-blink" />
            <span>// SYSTEM ADMINISTRATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
            &gt; Portfolio Command Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
            Centralized portal for ingesting projects via AI, synchronizing professional history, and managing Sanity CMS schemas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              target={tool.external ? '_blank' : undefined}
              className={`p-6 border bg-[#0d131a] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${tool.accent}`}
            >
              <div>
                <span className="text-[10px] text-neon/70 font-bold tracking-wider block mb-2">
                  [{tool.badge}]
                </span>
                <h2 className="text-lg font-bold text-white group-hover:text-neon transition-colors mb-2">
                  {tool.title}
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 text-xs font-bold text-neon group-hover:underline">
                {tool.cta}
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-border/40 flex items-center justify-between text-xs text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">
            ← Return to Portfolio
          </Link>
          <span>PORTFOLIO v0.6.7</span>
        </div>
      </div>
    </div>
  );
}
