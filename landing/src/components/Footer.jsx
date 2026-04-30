import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/06 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-lg gradient-text">AG</span>
          <span className="text-white/20">·</span>
          <span className="font-display text-slate-500 text-sm">Aadi Gupta · Redmond, WA</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">Built by</span>
          <span
            className="font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
            style={{
              color: '#00f5ff',
              background: 'rgba(0,245,255,0.08)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            CLAUDE SONNET 4.6
          </span>
          <span className="font-mono text-[10px] text-slate-600">· Anthropic · 2026</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://youtube.com/@RamaRid3rShorts" target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-slate-500 hover:text-white transition-colors">
            YouTube
          </a>
          <a href="https://github.com/aadivb9" target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-slate-500 hover:text-white transition-colors">
            GitHub
          </a>
          <a href="mailto:aag.vlogger@gmail.com"
            className="font-mono text-xs text-slate-500 hover:text-[#00f5ff] transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
