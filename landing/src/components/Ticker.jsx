const items = [
  '150K+ YOUTUBE VIEWS',
  'FBLA STATE QUALIFIER',
  'U16 TOURNAMENT CHAMPION',
  'CLASS OF 2029',
  'TESLA STEM HIGH SCHOOL',
  'USACO COMPETITOR',
  'iOS APP DEVELOPER',
  'SILICON VALLEY BOUND',
  'CYBERSECURITY ENTHUSIAST',
  'VICE CAPTAIN',
]

const text = items.map(i => `◆ ${i} `).join('')

export default function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-3 bg-[#030712]">
      {/* Left/right fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />

      <div className="flex whitespace-nowrap animate-ticker" style={{ width: 'max-content' }}>
        {/* Duplicate for seamless loop */}
        {[0, 1].map(idx => (
          <span key={idx} className="inline-block">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center mx-4">
                <span
                  className="font-mono text-xs font-bold tracking-widest uppercase"
                  style={{
                    color: i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#8b5cf6' : '#94a3b8',
                  }}
                >
                  {item}
                </span>
                <span className="mx-3 text-white/20 font-mono">◆</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
