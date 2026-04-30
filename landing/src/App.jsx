import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import Stats from './components/Stats'
import Now from './components/Now'
import Projects from './components/Projects'
import Principles from './components/Principles'
import Haters from './components/Haters'
import Skills from './components/Skills'
import Vision from './components/Vision'
import Footer from './components/Footer'

export default function App() {
  // Smooth scroll with Lenis
  useEffect(() => {
    let lenis
    let raf

    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      const loop = (time) => {
        lenis.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })

    return () => {
      if (lenis) lenis.destroy()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bg-[#030712] min-h-screen font-display">
      <Nav />
      <Hero />
      <Ticker />
      <Stats />
      <Now />
      <Projects />
      <Principles />
      <Skills />
      <Haters />
      <Vision />
      <Footer />
    </div>
  )
}
