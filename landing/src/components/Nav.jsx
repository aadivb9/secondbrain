import { motion, useScroll, useTransform } from 'framer-motion'

const links = ['About', 'Now', 'Projects', 'Principles', 'Vision']

export default function Nav() {
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1])
  const blur = useTransform(scrollY, [0, 100], [0, 16])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between"
      style={{
        backdropFilter: blur.get() > 0 ? `blur(${blur.get()}px)` : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <motion.div style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-[#030712]/80 -z-10" />

      {/* Logo */}
      <motion.a
        href="#"
        className="relative group"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-display font-bold text-xl gradient-text">AG</span>
        <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-cyan-glow to-violet-glow scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </motion.a>

      {/* Center links */}
      <motion.ul
        className="hidden md:flex items-center gap-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {links.map((link, i) => (
          <motion.li key={link}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.07 }}
          >
            <a
              href={`#${link.toLowerCase()}`}
              className="font-display text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group"
            >
              {link}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#00f5ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </a>
          </motion.li>
        ))}
      </motion.ul>

      {/* Right side */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <a
          href="https://youtube.com/@RamaRid3rShorts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-[#ff0000] transition-colors duration-200"
          aria-label="YouTube"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a
          href="https://github.com/aadivb9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors duration-200"
          aria-label="GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        </a>
        <motion.a
          href="#projects"
          className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold border border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
          Open to opportunities
        </motion.a>
      </motion.div>
    </motion.nav>
  )
}
