import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const tweets = [
  {
    name: 'tech_skeptic_101',
    handle: '@tech_skeptic_101',
    avatar: '🤡',
    text: 'Anthropic is so overrated lmaooo. Claude is just a worse ChatGPT with extra steps. Their whole "AI safety" thing is pure marketing hype. Nothing they ship actually impresses.',
    time: '2:47 PM · Dec 14, 2024',
    likes: '2.3K',
    replies: '89',
    rebuttal: 'You are reading this page right now.',
  },
  {
    name: 'WebDevBro_Official',
    handle: '@WebDevBro',
    avatar: '😒',
    text: 'No AI model can build a proper 3D scrolling landing page. The CSS is always wrong, the animations are janky, it can\'t do tilt effects, the particles never work. Just stop trying.',
    time: '11:22 AM · Jan 8, 2025',
    likes: '8.9K',
    replies: '412',
    rebuttal: 'Scroll up. Look at what you just scrolled through.',
  },
  {
    name: 'RealistDad_99',
    handle: '@RealistDad99',
    avatar: '🙄',
    text: 'MIT? Stanford? LOL. Just another overconfident 9th grader who thinks he\'s the next Zuckerberg. 150k views? My dog\'s account has more. Stay humble, touch grass.',
    time: '8:13 PM · Feb 2, 2025',
    likes: '1.2K',
    replies: '63',
    rebuttal: 'I\'m in 9th grade. Give me time.',
  },
]

function Tweet({ tweet, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Tweet card */}
      <motion.div
        className="relative glass rounded-2xl p-6 overflow-hidden"
        animate={inView ? { filter: 'saturate(0.3) brightness(0.5)' } : { filter: 'saturate(1) brightness(1)' }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        {/* Twitter/X header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
            {tweet.avatar}
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm">{tweet.name}</p>
            <p className="font-mono text-xs text-slate-500">{tweet.handle}</p>
          </div>
          <div className="ml-auto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        </div>

        <p className="font-display text-slate-300 text-sm leading-relaxed">{tweet.text}</p>

        <div className="flex items-center gap-6 mt-4 text-slate-600 text-xs font-mono">
          <span>{tweet.time}</span>
          <span>💬 {tweet.replies}</span>
          <span>❤️ {tweet.likes}</span>
        </div>

        {/* Strikethrough line */}
        <motion.div
          className="absolute left-0 top-1/2 h-0.5 bg-red-500/80"
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        />
      </motion.div>

      {/* WRONG stamp */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ scale: 4, opacity: 0, rotate: -20 }}
        animate={inView ? { scale: 1, opacity: 1, rotate: -12 } : { scale: 4, opacity: 0, rotate: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.7 }}
      >
        <div
          className="px-6 py-2 border-4 border-red-500 rounded-md"
          style={{
            color: '#ef4444',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textShadow: '0 0 20px rgba(239,68,68,0.5)',
            boxShadow: '0 0 20px rgba(239,68,68,0.3), inset 0 0 20px rgba(239,68,68,0.05)',
          }}
        >
          WRONG
        </div>
      </motion.div>

      {/* Rebuttal below */}
      <motion.div
        className="mt-3 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <div className="w-1 h-1 rounded-full bg-[#00f5ff]" />
        <p className="font-mono text-xs text-[#00f5ff]">{tweet.rebuttal}</p>
      </motion.div>
    </motion.div>
  )
}

export default function Haters() {
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })
  const countRef = useRef(null)
  const countInView = useInView(countRef, { once: true })

  return (
    <section className="relative py-24 px-6 md:px-12 overflow-hidden">
      {/* Red ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(239,68,68,0.03),transparent)]" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">the opposition</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            What the haters said.
          </h2>
          <p className="font-display text-slate-400 text-lg">
            Featuring: Anthropic doubters, UI skeptics, and people who underestimated a 9th grader.
          </p>
        </motion.div>

        <div className="space-y-8">
          {tweets.map((tweet, i) => (
            <Tweet key={tweet.handle} tweet={tweet} index={i} />
          ))}
        </div>

        {/* Scoreboard */}
        <motion.div
          ref={countRef}
          className="mt-16 glass-bright rounded-2xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={countInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <p className="font-mono text-xs text-slate-500 mb-2 uppercase tracking-widest">final score</p>
          <p className="font-display font-bold text-5xl text-white mb-1">
            Haters <span className="text-red-500">0</span> · Aadi <span className="text-[#22c55e]">3</span>
          </p>
          <p className="font-mono text-sm text-[#22c55e] mt-4">
            ✓ 3/3 haters proven wrong · this page is exhibit A
          </p>
          <p className="font-mono text-xs text-slate-600 mt-2">
            built by Claude Sonnet 4.6 — yes, that "overrated" AI
          </p>
        </motion.div>
      </div>
    </section>
  )
}
