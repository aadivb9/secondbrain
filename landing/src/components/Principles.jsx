import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const principles = [
  {
    n: '01',
    title: 'Systems beat willpower.',
    body: "I'm literally building an app around this. Motivation expires. Design doesn't. Default to whatever structure forces the right behavior on autopilot.",
    ref: 'lockedIn',
    color: '#00f5ff',
  },
  {
    n: '02',
    title: 'Ship ugly first.',
    body: 'A janky working prototype beats a clean idea. You cannot edit a blank page into a real product.',
    ref: 'shipping mindset',
    color: '#8b5cf6',
  },
  {
    n: '03',
    title: 'Pick one thing. Get unreasonably good at it.',
    body: 'Rock Lee had no ninjutsu. He trained taijutsu until it was terrifying. One deep skill beats five shallow ones.',
    ref: 'Rock Lee · Naruto',
    color: '#ffd700',
  },
  {
    n: '04',
    title: 'Speed over perfect.',
    body: "Hinata couldn't set, couldn't spike, couldn't read the game. Made nationals on speed and refusal to stop. The analog applies to CS and to life.",
    ref: 'Hinata · Haikyuu',
    color: '#22c55e',
  },
  {
    n: '05',
    title: 'Isolation is a trap.',
    body: 'Sasuke had everything and nearly destroyed himself. The best engineers ask for help early. Cutting people off is fear with a costume on.',
    ref: 'Sasuke · Naruto',
    color: '#ef4444',
  },
  {
    n: '06',
    title: 'Know what you\'re grinding for.',
    body: "Solo Leveling's actual thesis: daily discipline compounds, but only when you remember the why. Without the why, the grind eats you.",
    ref: 'Sung Jinwoo · Solo Leveling',
    color: '#a855f7',
  },
  {
    n: '07',
    title: 'Setter brain applies everywhere.',
    body: "Your job is to make the people around you look good. Do that, and you don't have to be the ace.",
    ref: 'volleyball · life',
    color: '#f97316',
  },
]

export default function Principles() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <section id="principles" ref={ref} className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(139,92,246,0.04),transparent)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">how i work</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Most productivity advice<br />
            <span className="gradient-text">is noise.</span>
          </h2>
          <p className="font-display text-slate-400 text-lg max-w-2xl mx-auto">
            Here's what actually holds up. Battle-tested. Anime-validated.
          </p>
        </motion.div>

        <div className="space-y-3">
          {principles.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 6 }}
              className="group relative glass rounded-2xl p-6 md:p-7 cursor-default overflow-hidden"
              style={{ border: `1px solid ${p.color}15`, transition: 'transform 0.3s, border-color 0.3s' }}
            >
              {/* Side accent bar */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{
                  transformOrigin: 'top',
                  background: `linear-gradient(to bottom, ${p.color}, ${p.color}30)`,
                }}
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
              />

              {/* Subtle glow on hover */}
              <div
                className="absolute -right-20 -top-20 w-40 h-40 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"
                style={{ background: p.color }}
              />

              <div className="flex items-start gap-5 md:gap-7 relative z-10">
                {/* Number */}
                <div
                  className="font-mono font-bold text-2xl md:text-3xl flex-shrink-0 tabular-nums"
                  style={{ color: p.color }}
                >
                  {p.n}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-xl md:text-2xl mb-2 leading-tight">
                    {p.title}
                  </h3>
                  <p className="font-display text-slate-400 text-sm md:text-base leading-relaxed">
                    {p.body}
                  </p>
                  <p
                    className="font-mono text-[10px] uppercase tracking-widest mt-3 opacity-60"
                    style={{ color: p.color }}
                  >
                    ↳ {p.ref}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing tag */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <p className="font-mono text-xs text-slate-600">
            seven principles · zero hustle-bro energy · all stolen from people smarter than me
          </p>
        </motion.div>
      </div>
    </section>
  )
}
