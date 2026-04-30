import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ParticleCanvas from './ParticleCanvas'

const nameLetters = 'AADI GUPTA'.split('')

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
}

const letter = {
  hidden: { y: 80, opacity: 0, rotateX: -40 },
  show: { y: 0, opacity: 1, rotateX: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  show: (d = 0) => ({ y: 0, opacity: 1, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Particle background */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <ParticleCanvas />
      </motion.div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,245,255,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(139,92,246,0.05),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030712] to-transparent" />

      {/* Floating 3D geometric shapes */}
      <div className="absolute top-24 right-[12%] opacity-20 animate-float pointer-events-none">
        <div className="w-16 h-16 border border-[#00f5ff]/50 rotate-45"
          style={{ boxShadow: '0 0 20px rgba(0,245,255,0.2)' }} />
      </div>
      <div className="absolute top-1/3 left-[8%] opacity-15 animate-float_slow pointer-events-none"
        style={{ animationDelay: '2s' }}>
        <div className="w-10 h-10 border border-[#8b5cf6]/50 rounded-full"
          style={{ boxShadow: '0 0 15px rgba(139,92,246,0.2)' }} />
      </div>
      <div className="absolute bottom-1/3 right-[18%] opacity-10 animate-float pointer-events-none"
        style={{ animationDelay: '4s' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <polygon points="30,3 57,57 3,57" stroke="#ffd700" strokeWidth="1" fill="none"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))' }} />
        </svg>
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ y, opacity }}
      >
        {/* Label */}
        <motion.div
          className="section-label mb-6 flex items-center gap-3"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          <span className="w-8 h-px bg-[#00f5ff]/60" />
          <span>Tesla STEM HS · Class of 2029 · Redmond, WA</span>
          <span className="w-8 h-px bg-[#00f5ff]/60" />
        </motion.div>

        {/* Name — letter by letter */}
        <motion.div
          className="overflow-hidden"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ perspective: '600px' }}
        >
          <h1 className="font-display font-bold leading-none"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 9rem)', letterSpacing: '-0.03em' }}>
            {nameLetters.map((char, i) => (
              <motion.span
                key={i}
                variants={letter}
                className="inline-block"
                style={{
                  display: 'inline-block',
                  background: char === ' ' ? 'none' : 'linear-gradient(135deg, #00f5ff 0%, #8b5cf6 50%, #ffd700 100%)',
                  WebkitBackgroundClip: char === ' ' ? 'none' : 'text',
                  WebkitTextFillColor: char === ' ' ? 'transparent' : 'transparent',
                  backgroundClip: char === ' ' ? 'none' : 'text',
                  textShadow: char === ' ' ? 'none' : 'none',
                  filter: char === ' ' ? 'none' : 'drop-shadow(0 0 30px rgba(0,245,255,0.3))',
                  width: char === ' ' ? '0.3em' : 'auto',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-slate-400 font-display font-light text-lg md:text-xl tracking-wide"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.9}
        >
          Inventor &nbsp;·&nbsp; CS Engineer &nbsp;·&nbsp; Content Creator &nbsp;·&nbsp; Future Founder
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.1}
        >
          <motion.a
            href="#projects"
            className="group relative px-8 py-3.5 rounded-full font-display font-semibold text-sm text-black overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#8b5cf6]" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#00f5ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Explore My Work →</span>
          </motion.a>

          <motion.a
            href="https://youtube.com/@RamaRid3rShorts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full font-display font-semibold text-sm text-white glass border border-white/10 hover:border-[#00f5ff]/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Watch 150K+ Views ↗
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-2 opacity-40"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.4}
        >
          <span className="section-label" style={{ fontSize: '0.6rem' }}>scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-[#00f5ff] to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
