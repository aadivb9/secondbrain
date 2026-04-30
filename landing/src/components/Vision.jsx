import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const steps = [
  {
    step: '01',
    title: 'INVENTOR',
    desc: 'Building things that don\'t exist yet. From embedded systems to iOS apps — every project is a prototype of what\'s coming.',
    color: '#00f5ff',
    status: 'Active now',
  },
  {
    step: '02',
    title: 'ENTREPRENEUR',
    desc: 'Turning technical skills into real business. FBLA, reselling, cold-calling local businesses — the reps start at 15.',
    color: '#8b5cf6',
    status: 'In training',
  },
  {
    step: '03',
    title: 'SILICON VALLEY',
    desc: 'The endgame. Not a dream — a coordinate. Class of 2029. MIT/Stanford/CMU. Then: build something that changes the world.',
    color: '#ffd700',
    status: 'Locked in',
  },
]

// Mini star field component
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r * 2,
            height: s.r * 2,
            background: i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#8b5cf6' : '#ffffff',
          }}
          animate={{ opacity: [s.opacity, s.opacity * 2.5, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function Vision() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  return (
    <section id="vision" ref={ref}
      className="relative py-32 px-6 md:px-12 overflow-hidden min-h-screen flex items-center">

      {/* Star field background */}
      <StarField />

      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(3,7,18,0)_0%,rgba(3,7,18,0.6)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_0%,rgba(0,245,255,0.04),transparent)]" />

      {/* Parallax orbs */}
      <motion.div
        className="absolute left-[10%] top-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #00f5ff, transparent)', y: y1 }}
      />
      <motion.div
        className="absolute right-[10%] bottom-1/4 w-48 h-48 rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', y: y2 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label mb-4">the trajectory</p>
          <h2 className="font-display font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
            The plan was never{' '}
            <span className="gradient-text">to blend in.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, #00f5ff, #8b5cf6, #ffd700)' }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.2 }}
              >
                {/* Node */}
                <div className="relative flex-shrink-0 z-10">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                    style={{
                      background: `${step.color}15`,
                      border: `2px solid ${step.color}`,
                      color: step.color,
                      boxShadow: `0 0 20px ${step.color}30`,
                    }}
                    animate={{ boxShadow: [`0 0 20px ${step.color}20`, `0 0 40px ${step.color}50`, `0 0 20px ${step.color}20`] }}
                    transition={{ duration: 2 + i, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {step.step}
                  </motion.div>
                </div>

                {/* Hidden spacer for alternating layout */}
                <div className="hidden md:block flex-1" />

                {/* Card */}
                <div
                  className="flex-1 glass rounded-2xl p-6 md:max-w-sm"
                  style={{ border: `1px solid ${step.color}20` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="font-display font-bold text-2xl"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </h3>
                    <span
                      className="font-mono text-[10px] px-2 py-1 rounded-full"
                      style={{ color: step.color, background: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="font-display text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing statement */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <div className="glass-bright rounded-2xl px-10 py-8 inline-block max-w-2xl"
            style={{ border: '1px solid rgba(255,215,0,0.15)' }}>
            <p className="font-display font-bold text-white text-2xl md:text-3xl leading-tight">
              "Stay mad."
            </p>
            <p className="font-mono text-sm text-slate-500 mt-2">— Aadi Gupta, class of 2029</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
