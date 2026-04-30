import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    title: 'lockedIn',
    type: 'iOS App',
    desc: 'Locks your social apps until you pass a quiz. SwiftUI, Apple Family Controls, Gemini for question generation. TestFlight beta May/June 2026, App Store target summer.',
    tags: ['SwiftUI', 'Family Controls', 'Gemini API', 'iOS 17+'],
    color: '#00f5ff',
    gradient: 'from-[#00f5ff]/20 to-[#8b5cf6]/10',
    icon: '📱',
    status: 'TestFlight Soon',
    statusColor: '#ffd700',
  },
  {
    title: 'Extreme Weather Defense',
    type: 'Research Project',
    desc: 'Mesh network system for post-disaster communications using ESP32 microcontrollers. Designed to keep communities connected when infrastructure fails.',
    tags: ['ESP32', 'Arduino', 'Mesh Network', 'JSHS Target'],
    color: '#8b5cf6',
    gradient: 'from-[#8b5cf6]/20 to-[#ffd700]/10',
    icon: '⛈',
    status: 'In Progress',
    statusColor: '#00f5ff',
  },
  {
    title: 'Routing Backend',
    type: 'Backend Engineering',
    desc: 'Logistics routing system built for a local business as a backend developer intern. Handles real-world delivery optimization in production.',
    tags: ['Python', 'API', 'SQL', 'Routing Logic'],
    color: '#ffd700',
    gradient: 'from-[#ffd700]/15 to-[#00f5ff]/10',
    icon: '🗺',
    status: 'Shipped ✓',
    statusColor: '#22c55e',
  },
  {
    title: 'Chameleon Virtual Pet',
    type: 'FBLA Competition App',
    desc: 'Python/tkinter/pygame app built for FBLA Intro to Programming. Qualified for SBLC state competition with this project.',
    tags: ['Python', 'tkinter', 'pygame', 'FBLA SBLC'],
    color: '#22c55e',
    gradient: 'from-[#22c55e]/15 to-[#8b5cf6]/10',
    icon: '🦎',
    status: 'State Qualified ✓',
    statusColor: '#22c55e',
  },
]

function TiltCard({ project, index, inView }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: -dy * 12, y: dx * 12 })
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    setShine({ x: px, y: py })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setShine({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 ? 'transform 0.5s ease' : 'transform 0.08s ease',
        transformStyle: 'preserve-3d',
      }}
      className="group relative rounded-2xl overflow-hidden cursor-default"
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          padding: '1px',
          background: `linear-gradient(135deg, ${project.color}, transparent, ${project.color}40)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card body */}
      <div className="relative h-full p-6 glass rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${project.color}18` }}>

        {/* Shine effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
          }}
        />

        {/* Top gradient blob */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-gradient-to-bl ${project.gradient} pointer-events-none`}
        />

        {/* 3D floating icon */}
        <div
          className="text-3xl mb-4"
          style={{ transform: 'translateZ(20px)' }}
        >
          {project.icon}
        </div>

        {/* Type label */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: project.color, opacity: 0.7 }}>
            {project.type}
          </span>
          <span
            className="font-mono text-[10px] px-2 py-0.5 rounded-full"
            style={{
              color: project.statusColor,
              background: `${project.statusColor}15`,
              border: `1px solid ${project.statusColor}30`,
            }}
          >
            {project.status}
          </span>
        </div>

        <h3
          className="font-display font-bold text-xl text-white mb-3"
          style={{ transform: 'translateZ(10px)' }}
        >
          {project.title}
        </h3>

        <p className="font-display text-slate-400 text-sm leading-relaxed mb-4">
          {project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-1 rounded-md"
              style={{
                color: project.color,
                background: `${project.color}10`,
                border: `1px solid ${project.color}20`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <section id="projects" className="relative py-24 px-6 md:px-12" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_50%,rgba(0,245,255,0.03),transparent)]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">what i build</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            Projects that ship.
            <br />
            <span className="gradient-text">Not just ideas.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <TiltCard key={p.title} project={p} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
