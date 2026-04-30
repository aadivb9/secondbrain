import { useEffect, useRef } from 'react'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const COLORS = ['#00f5ff', '#8b5cf6', '#ffffff']
    const COUNT = Math.min(180, Math.floor((W * H) / 8000))

    const mouse = { x: W / 2, y: H / 2 }

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }))

    // Larger accent "star" particles
    const stars = Array.from({ length: 30 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.8,
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
      color: Math.random() > 0.5 ? '#00f5ff' : '#ffd700',
    }))

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    let raf
    let frame = 0

    const draw = () => {
      frame++
      // Fading trail — key to the "space" look
      ctx.fillStyle = 'rgba(3, 7, 18, 0.18)'
      ctx.fillRect(0, 0, W, H)

      // Draw background stars (static, just pulsing)
      stars.forEach(s => {
        s.pulse += s.pulseSpeed
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.pulse))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = a
        ctx.fill()
      })

      // Draw particles + connections
      ctx.globalAlpha = 1
      particles.forEach((p, i) => {
        // Mouse interaction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          p.vx -= (dx / dist) * force * 0.08
          p.vy -= (dy / dist) * force * 0.08
        }

        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx
        p.y += p.vy
        p.pulse += p.pulseSpeed

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse))

        // Glow halo (soft outer disc)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha * 0.15
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.fill()

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const ddx = p.x - p2.x
          const ddy = p.y - p2.y
          const d = Math.sqrt(ddx * ddx + ddy * ddy)
          if (d < 120) {
            const lineAlpha = (1 - d / 120) * 0.25
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = p.color
            ctx.globalAlpha = lineAlpha
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        ctx.globalAlpha = 1
      })

      raf = requestAnimationFrame(draw)
    }

    // Initial black fill
    ctx.fillStyle = '#030712'
    ctx.fillRect(0, 0, W, H)

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  )
}
