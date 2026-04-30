import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skillGroups = [
  {
    label: 'Languages',
    color: '#00f5ff',
    skills: ['Python', 'JavaScript', 'C/C++', 'HTML/CSS', 'SQL'],
  },
  {
    label: 'Frameworks & Tools',
    color: '#8b5cf6',
    skills: ['Swift', 'SwiftUI', 'React', 'Vite', 'Tailwind', 'Git', 'Xcode'],
  },
  {
    label: 'Hardware',
    color: '#ffd700',
    skills: ['Arduino', 'ESP32', 'Embedded Systems', 'Sensors', 'Motors'],
  },
  {
    label: 'Domain',
    color: '#22c55e',
    skills: ['Cybersecurity', 'Network Routing', 'iOS Dev', 'USACO', 'FBLA'],
  },
  {
    label: 'Creative',
    color: '#f97316',
    skills: ['Adobe After Effects', 'Video Editing', 'Graphic Design', 'Content Creation'],
  },
]

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section id="skills" className="relative py-24 px-6 md:px-12" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_70%_40%,rgba(139,92,246,0.04),transparent)]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">arsenal</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            Tools of the trade.
          </h2>
        </motion.div>

        <div className="space-y-10">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <p className="font-mono text-xs mb-4 uppercase tracking-widest"
                style={{ color: group.color }}>
                {group.label}
              </p>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, si) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: gi * 0.1 + si * 0.05,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      y: -2,
                      boxShadow: `0 4px 20px ${group.color}30`,
                    }}
                    className="px-4 py-2 rounded-xl font-display font-medium text-sm cursor-default"
                    style={{
                      color: group.color,
                      background: `${group.color}0d`,
                      border: `1px solid ${group.color}25`,
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Competitions row */}
        <motion.div
          className="mt-14 pt-10 border-t border-white/06"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="section-label mb-6">competitions & achievements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'FBLA SBLC', detail: 'State Qualifier · Cybersecurity + Programming', color: '#8b5cf6' },
              { title: 'USACO', detail: 'Bronze Division · Working toward Gold', color: '#00f5ff' },
              { title: 'VEX IQ', detail: 'State Championship Competitor', color: '#ffd700' },
              { title: 'Volleyball', detail: 'U16 · Tournament Champion · Vice Captain', color: '#22c55e' },
              { title: 'SPARC 2026', detail: 'Applied · Late July', color: '#f97316' },
              { title: 'Badminton', detail: 'National Level · 8th Grade', color: '#ef4444' },
            ].map((comp, i) => (
              <motion.div
                key={comp.title}
                className="glass rounded-xl p-4"
                style={{ border: `1px solid ${comp.color}18` }}
                whileHover={{ scale: 1.03, borderColor: `${comp.color}40` }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-display font-semibold text-white text-sm">{comp.title}</p>
                <p className="font-mono text-[11px] text-slate-500 mt-1">{comp.detail}</p>
                <div className="mt-2 w-8 h-0.5 rounded" style={{ background: comp.color }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
