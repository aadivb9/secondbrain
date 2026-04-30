import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 150, suffix: 'K+', label: 'YouTube Views', sub: '@RamaRid3rShorts', color: '#ff0000', icon: '▶' },
  { value: 400, suffix: '+', label: 'Subscribers', sub: 'and growing fast', color: '#00f5ff', icon: '◈' },
  { value: 2, suffix: 'x', label: 'FBLA State Qualifier', sub: 'Cybersecurity + Programming', color: '#8b5cf6', icon: '◆' },
  { value: 9, suffix: 'th', label: 'Grade · 4.0 GPA', sub: '95.33% avg — flawless', color: '#ffd700', icon: '★' },
]

function Counter({ value, suffix, color, active }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const duration = 1600
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [active, value])

  return (
    <span className="font-display font-bold tabular-nums" style={{ color }}>
      {display}{suffix}
    </span>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="about" className="relative py-24 px-6 md:px-12" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(139,92,246,0.04),transparent)]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">by the numbers</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            The receipts speak<br />
            <span className="gradient-text">for themselves.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              className="group relative overflow-hidden rounded-2xl p-6 glass"
              style={{
                border: `1px solid ${s.color}18`,
              }}
              whileHover={{
                scale: 1.04,
                borderColor: `${s.color}40`,
                boxShadow: `0 0 30px ${s.color}15, 0 0 60px ${s.color}06`,
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Corner accent */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-10 blur-2xl rounded-full"
                style={{ background: s.color }}
              />

              <div className="text-2xl mb-3 opacity-70">{s.icon}</div>

              <div className="text-4xl md:text-5xl mb-1" style={{ lineHeight: 1 }}>
                <Counter value={s.value} suffix={s.suffix} color={s.color} active={inView} />
              </div>

              <p className="font-display font-semibold text-white text-sm mt-2">{s.label}</p>
              <p className="font-mono text-[11px] text-slate-500 mt-1">{s.sub}</p>

              {/* Bottom bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
                initial={{ width: 0 }}
                animate={inView ? { width: '100%' } : { width: 0 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bio block */}
        <motion.div
          className="mt-16 grid md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {/* Left: bio */}
          <div>
            <p className="section-label mb-4">who is aadi</p>
            <p className="font-display text-slate-300 text-lg leading-relaxed">
              Freshman at Tesla STEM High School. iOS dev, volleyball setter, CS + security competitor. Content that's already hit{' '}
              <span className="text-[#00f5ff] font-semibold">150K+ views</span> — built in public, no legacy connections.
            </p>
            <p className="font-display text-slate-400 text-base leading-relaxed mt-4">
              Direction: Computer Engineering at MIT, CMU, or Stanford. Build in public, study in private, take competitions seriously.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['ENFJ-T', 'Setter · Right Side', 'U16 Vice Captain', 'FBLA SBLC', 'iOS Dev', 'Cybersecurity'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full font-mono text-xs text-slate-400 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: terminal card */}
          <div className="glass-bright rounded-2xl overflow-hidden">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/08 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-slate-500">aadi.profile</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2">
              {[
                ['name', 'Aadi Gupta'],
                ['born', '12/19/2010 · Redmond WA'],
                ['school', 'Tesla STEM HS · 2029'],
                ['gpa', '4.0 unweighted (95.33 avg)'],
                ['major', 'Computer Engineering'],
                ['targets', 'MIT · CMU · Stanford'],
                ['shipping', 'lockedIn (iOS)'],
                ['status', '> LOCKED IN'],
              ].map(([key, val]) => (
                <div key={key} className="flex gap-3">
                  <span className="text-[#8b5cf6] min-w-[80px]">{key}</span>
                  <span className="text-slate-300">{val}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2 text-[#00f5ff]">
                <span>$</span>
                <span>ready_to_ship</span>
                <motion.span
                  className="inline-block w-2 h-4 bg-[#00f5ff]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
