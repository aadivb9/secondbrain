import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const lanes = [
  {
    label: 'SHIPPING',
    color: '#00f5ff',
    icon: '🚀',
    title: 'lockedIn iOS',
    detail: 'SwiftUI + Family Controls + Gemini. TestFlight beta May/Jun. App Store target: summer 2026.',
    progress: 78,
  },
  {
    label: 'COMPETING',
    color: '#8b5cf6',
    icon: '🏆',
    title: 'FBLA SBLC',
    detail: 'Cybersecurity + Intro to Programming. Apr 21. Fully prepped. USACO Bronze + PicoCTF queued.',
    progress: 92,
  },
  {
    label: 'STUDYING',
    color: '#ffd700',
    icon: '📚',
    title: 'AP CSP + SAT prep',
    detail: 'AP CSP exam May 2026. SAT/ACT prep starts this summer. Targeting 1580–1600.',
    progress: 55,
  },
  {
    label: 'RESEARCHING',
    color: '#22c55e',
    icon: '⛈',
    title: 'Extreme Weather Resilience',
    detail: 'Pre-formal phase. JSHS regional by Spring 2027. ISEF target by 11th grade.',
    progress: 22,
  },
  {
    label: 'BUILDING',
    color: '#f97316',
    icon: '📲',
    title: 'Instagram brand from zero',
    detail: 'AI + motivation + anime. Target: 1k followers by Aug 31. AMV channel on deck.',
    progress: 8,
  },
  {
    label: 'TRAINING',
    color: '#ef4444',
    icon: '🏐',
    title: 'U16 Volleyball — Nationals',
    detail: 'Setter + right side. Vice Captain. Tournament Champion. Chasing nationals.',
    progress: 65,
  },
]

export default function Now() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section id="now" ref={ref} className="relative py-24 px-6 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(0,245,255,0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_20%_70%,rgba(139,92,246,0.03),transparent)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="mb-14 flex items-baseline justify-between flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="section-label mb-3 flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-[#22c55e]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              live status · april 2026
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              Where my attention<br />
              <span className="gradient-text">actually is.</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-500 max-w-xs text-right">
            no roadmap fluff.<br />
            just the six lanes running right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lanes.map((lane, i) => (
            <motion.div
              key={lane.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, borderColor: `${lane.color}50` }}
              className="group relative glass rounded-2xl p-5 overflow-hidden cursor-default"
              style={{ border: `1px solid ${lane.color}18`, transition: 'border-color 0.3s' }}
            >
              {/* Top corner glow */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 blur-2xl opacity-20 rounded-full"
                style={{ background: lane.color }}
              />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-2xl">{lane.icon}</span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    color: lane.color,
                    background: `${lane.color}10`,
                    border: `1px solid ${lane.color}25`,
                  }}
                >
                  {lane.label}
                </span>
              </div>

              <h3 className="font-display font-bold text-white text-lg mb-2 relative z-10">
                {lane.title}
              </h3>
              <p className="font-display text-slate-400 text-sm leading-relaxed mb-4 relative z-10">
                {lane.detail}
              </p>

              {/* Progress bar */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">progress</span>
                  <span className="font-mono text-[10px]" style={{ color: lane.color }}>{lane.progress}%</span>
                </div>
                <div className="h-1 bg-white/05 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${lane.color}, ${lane.color}80)` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${lane.progress}%` } : { width: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Last updated */}
        <motion.p
          className="mt-8 text-center font-mono text-xs text-slate-600"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          last updated: 2026-04-19 · refreshed daily by morning check-in
        </motion.p>
      </div>
    </section>
  )
}
