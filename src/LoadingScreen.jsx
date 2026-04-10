import { useEffect, useState } from "react"
import { SikaLogo } from "./components/SikaLogo"

export function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)
  // phase 0: logo in → phase 1: brand in → phase 2: tagline in → phase 3: done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 900)
    const t3 = setTimeout(() => setPhase(3), 1600)
    const t4 = setTimeout(() => onComplete?.(), 2200)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface-950 transition-opacity duration-500 ${
        phase === 3 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo */}
      <div
        className={`transition-all duration-500 ${
          phase >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <SikaLogo size={80} className="animate-gold-pulse" />
      </div>

      {/* Brand name */}
      <div
        className={`mt-5 transition-all duration-500 delay-100 ${
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-3xl font-bold tracking-tight">
          <span className="text-gold-400">Sika</span>
          <span className="text-zinc-200">Track</span>
        </div>
      </div>

      {/* Tagline */}
      <div
        className={`mt-3 transition-all duration-500 delay-200 ${
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-sm text-zinc-500 tracking-wider font-light">
          Know your worth. Own your mine.
        </p>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1 w-6 rounded-full bg-gold-500/30 overflow-hidden"
            >
              <div
                className="h-full bg-gold-500 rounded-full transition-all duration-700"
                style={{
                  width: phase > i ? "100%" : "0%",
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
