"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircleDot, Play, Pause, SkipBack, SkipForward, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// Color palette for the redesigned theme
const ACCENT_GREEN = "#16a34a" // green-600
const ACCENT_ORANGE = "#f97316" // orange-500
const OUTLINE_BLACK = "#000000"
import { useContractAddress } from "../context/ContractAddressContext"
// const contractAddress = "GQsefQc5YPEI2wkMnYMxD8RqIwrRX7f9iFgpBjNpBAGS"
const DEV_WALLET = "3AizL7dzCjn1B3HZ2LxJayTbnZTx1NCawmCbTi17JZVP"

// ===== Math Helpers (robust angle/index mapping) =====
const TAU = Math.PI * 2
function wrapAngle(a: number) { return ((a % TAU) + TAU) % TAU }
function indexFromAngle(angle: number, total: number) {
  const sector = TAU / total
  const shifted = wrapAngle(angle + Math.PI / 2)
  let idx = Math.floor(shifted / sector)
  if (idx >= total) idx = 0
  return idx
}
function angleForIndex(idx: number, total: number) {
  const frac = idx / total
  return wrapAngle(frac * TAU - Math.PI / 2)
}
function cleanTitle(full: string) { return full.replace(/^Step \d+\s-\s/, "") }

interface LoveLetterModalProps {
  onClose: () => void
}

export function LoveLetterModal({ onClose }: LoveLetterModalProps) {
  const { contractAddress } = useContractAddress();
  const steps = useMemo(() => [
    { id: 1, title: "Step 1 - The Green Candle", quote: "OMG it's pumping! This is it! This is my rocket to the moon! I MUST buy NOW before it goes to $1!" },
    { id: 2, title: "Step 2 - The Buy Order", quote: "Slams buy button at the absolute peak Phew! Got in just in time! Now I wait for my Lambo..." },
    { id: 3, title: "Step 3 - The Red Reality", quote: "Price immediately dumps 50% This is fine... it's just a healthy correction... diamond hands... right?" },
    { id: 4, title: "Step 4 - The Panic Sell", quote: "I can't take it anymore! I'm selling everything at a loss! This crypto thing is a scam anyway!" },
    { id: 5, title: "Step 5 - The Moon Mission", quote: "3 days later: Price goes 10x WHAT?! If I had just held... I'd be rich! Next time I'll diamond hand!" },
    { id: 6, title: "Step 6 - Repeat Forever", quote: "Sees another green candle This time is different! This is THE coin! All in!" },
  ], [])

  const [running, setRunning] = useState(true)
  const [speed, setSpeed] = useState(1.0)
  const [gifUrl] = useState("https://s14.gifyu.com/images/bNFkU.gif")
  const rotatingTexts = useMemo(() => ["FOMO", "Buy High", "Panic Sell", "Repeat"], [])
  const [rotatingIndex, setRotatingIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [copiedWallet, setCopiedWallet] = useState(false)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 })

  const totalSteps = steps.length
  const baseStepDuration = 2800
  const cycleDuration = baseStepDuration * totalSteps

  const angleRef = useRef(0)
  const [angle, setAngle] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  useEffect(() => {
    const id = setInterval(() => {
      setRotatingIndex((i) => (i + 1) % rotatingTexts.length)
    }, 1600)
    return () => clearInterval(id)
  }, [rotatingTexts.length])

  const copyCA = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText(DEV_WALLET)
      setCopiedWallet(true)
      setTimeout(() => setCopiedWallet(false), 1200)
    } catch {}
  }

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const maxOffset = 12
    const nx = (dx / (rect.width / 2)) * maxOffset
    const ny = (dy / (rect.height / 2)) * maxOffset
    setHeroTilt({ x: nx, y: ny })
  }

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null; lastRef.current = null; return
    }
    const loop = (t: number) => {
      if (lastRef.current == null) { lastRef.current = t }
      else { 
        const dt = t - lastRef.current
        lastRef.current = t
        const rps = TAU / (cycleDuration / speed)
        angleRef.current = wrapAngle(angleRef.current + rps * dt)
        setAngle(angleRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { 
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null; lastRef.current = null
    }
  }, [running, speed, cycleDuration])

  const activeIndex = useMemo(() => indexFromAngle(angle, totalSteps), [angle, totalSteps])
  const goStep = (idx: number) => { 
    const targetAngle = angleForIndex(idx, totalSteps)
    angleRef.current = targetAngle
    setAngle(targetAngle)
  }
  const next = () => goStep((activeIndex + 1) % totalSteps)
  const prev = () => goStep((activeIndex - 1 + totalSteps) % totalSteps)

  const radius = 140
  const size = radius * 2 + 40
  const innerSize = Math.floor(radius * 1.05)
  const nodePos = (i: number) => { 
    const theta = (i / totalSteps) * TAU - Math.PI / 2
    return { x: radius * Math.cos(theta), y: radius * Math.sin(theta) }
  }
  const orbPos = () => ({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })

  // card placement
  const cardOffsetFactor = 1.25;
  const cardWidth = 140;

  // WHY $TOP? marquee content
  const whyReasons = useMemo(() => [
    {
      title: "🎯 Perfect Timing",
      subtitle: "\"Guaranteed to help you buy at the absolute peak. Our algorithm ensures maximum FOMO activation!\"",
    },
    {
      title: "💸 Instant Portfolio Diversification",
      subtitle: "\"From 100% cash to 100% regret in seconds! Watch your portfolio turn red instantly!\"",
    },
    {
      title: "🎢 Emotional Rollercoaster",
      subtitle: "\"Experience the full spectrum: Hope, Greed, Fear, Despair, and back to Hope!\"",
    },
    {
      title: "🤡 Professional Clown Training",
      subtitle: "\"Learn to makeup excuses, juggle losses, and entertain others with your trading stories!\"",
    },
  ], [])

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg overlay-enter" onClick={onClose} />
      <div className="relative w-full max-w-7xl">
        {/* Back plate (orange) with enhanced decorative elements */}
        <div
          className="absolute inset-0 translate-x-4 translate-y-4 rounded-[24px] bg-gradient-to-br from-[#F39B32] to-[#f97316] border-[3px] border-black shadow-[0_10px_0_#000,0_20px_50px_rgba(0,0,0,0.4)] modal-enter-plate overflow-hidden"
          aria-hidden
        >
          {/* Decorative elements with animations */}
          <div className="absolute top-[5%] left-[10%] w-20 h-20 rounded-full bg-white/10 blur-md"></div>
          <div className="absolute bottom-[15%] right-[8%] w-24 h-24 rounded-full bg-white/15 blur-md"></div>
          <div className="absolute top-[30%] right-[15%] w-16 h-16 rounded-full bg-white/10 blur-md"></div>
          <div className="absolute bottom-[25%] left-[20%] w-28 h-28 rounded-full bg-white/10 blur-md"></div>
          
          {/* Animated dots */}
          <div className="absolute top-[15%] left-[25%] w-3 h-3 rounded-full bg-white/40 animate-pulse"></div>
          <div className="absolute top-[45%] left-[15%] w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
          <div className="absolute top-[65%] left-[35%] w-4 h-4 rounded-full bg-white/40 animate-pulse"></div>
          <div className="absolute top-[25%] right-[30%] w-3 h-3 rounded-full bg-white/40 animate-pulse"></div>
          <div className="absolute top-[55%] right-[20%] w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
          <div className="absolute top-[75%] right-[40%] w-4 h-4 rounded-full bg-white/40 animate-pulse"></div>
        </div>

        {/* Front white panel with enhanced styling */}
        <div className="relative rounded-[24px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter shadow-lg">
          {/* Enhanced Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white hover:bg-[#16a34a] hover:text-white flex items-center justify-center text-[24px] font-black text-[var(--green)] transition-all duration-300 border-2 border-black/30 hover:border-black z-50 shadow-md hover:shadow-lg"
            aria-label="Close"
          >
            ×
          </button>

          {/* Enhanced Content with better spacing, scrolling and animations */}
          <div className="p-12 space-y-12 max-h-[85vh] overflow-y-auto scroll-green text-center">
            {/* HERO TOP SECTION */}
            <div ref={heroRef} onMouseMove={handleHeroMouseMove} className="relative overflow-hidden rounded-3xl border-[3px] border-black bg-gradient-to-br from-[#0b0b0b] via-[#121212] to-[#16a34a]/20 text-left">
              <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#F39B32]/20 blur-2xl"/>
              <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-[#16a34a]/20 blur-2xl"/>
              <div className="relative p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <motion.h2
                      className="font-agrandir text-6xl md:text-7xl leading-tight mb-1 bg-gradient-to-r from-[#F39B32] via-[#f97316] to-[#16a34a] bg-clip-text text-transparent drop-shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      $TOP
                    </motion.h2>
                    <motion.h3
                      className="font-agrandir text-3xl md:text-5xl leading-tight mb-3 bg-gradient-to-r from-[#bdbdbd] to-white bg-clip-text text-transparent drop-shadow-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.05 }}
                    >
                      Buy The Top Guy
                    </motion.h3>
                    <motion.p
                      className="text-2xl md:text-3xl font-semibold text-white/90 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                    >
                      The Ultimate FOMO Experience
                    </motion.p>
                    <motion.p
                      className="text-xl md:text-2xl text-white/80 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                    >
                      Why buy the dip when you can buy the TOP?
                    </motion.p>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      <span className="text-white/70 text-sm uppercase tracking-widest">Rotating</span>
                      <div className="h-10 relative min-w-[6rem]">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={rotatingIndex}
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -16, opacity: 0 }}
                            transition={{ duration: 0.24 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-[#F39B32] text-black font-extrabold border-2 border-black shadow"
                          >
                            {rotatingTexts[rotatingIndex]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="font-mono text-base md:text-lg bg-black/70 text-white px-4 py-2 rounded-xl border-2 border-white/20">
                        Contract Address: <span className="text-[#F39B32]">{contractAddress}</span>
                      </div>
                      <Button
                        onClick={copyCA}
                        className={`px-4 py-2 bg-[#F39B32] hover:bg-[#E38922] text-black font-bold border-2 border-black rounded-xl shadow transition-transform ${copied ? 'animate-pulse' : ''}`}
                        style={{ boxShadow: '0 3px 0 rgba(0,0,0,0.2)', transform: copied ? 'scale(1.02)' : undefined }}
                        aria-label="Copy contract address"
                      >
                        {copied ? (
                          <span className="inline-flex items-center gap-2"><Check className="w-4 h-4"/> Copied</span>
                        ) : (
                          <span className="inline-flex items-center gap-2"><Copy className="w-4 h-4"/> Copy CA</span>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <motion.img
                      src="/images/reess.png"
                      alt="$TOP Mascot"
                      className="w-full max-w-md ml-auto rounded-2xl"
                      style={{ transform: `translate3d(${heroTilt.x}px, ${heroTilt.y}px, 0)` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 12, mass: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Enhanced Header Section with animation */}
            <div className="mb-16">
              <motion.h3 
                className="font-agrandir text-6xl leading-none mb-8 bg-gradient-to-r from-[#F39B32] via-[#f97316] to-[#16a34a] bg-clip-text text-transparent drop-shadow-sm"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
              >
                LOVE LETTER
              </motion.h3>
              <motion.p 
                className="text-3xl font-semibold mb-4 text-[#111]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Dear Crypto Enthusiast,
              </motion.p>
              <motion.p 
                className="opacity-90 leading-relaxed text-2xl max-w-3xl mx-auto font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Why buy the dip when you can buy the TOP? 🚀📈💸
              </motion.p>
            </div>
            
            {/* Enhanced FOMO Cycle Section */}
            <div className="my-16 p-10 bg-gradient-to-b from-[#f8f8f8] via-[#f5f9f5] to-[#eef8ef] rounded-3xl border-2 border-gray-200 shadow-xl">
              <motion.h4 
                className="font-agrandir text-5xl mb-12 text-[#F39B32] tracking-wider drop-shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, type: "spring" }}
              >
                THE ETERNAL FOMO CYCLE
              </motion.h4>
              
              {/* Enhanced Interactive Cycle Animation - Improved Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-12">
                {/* Animation Circle - Takes more space on larger screens with better centering */}
                <div className="lg:col-span-7 flex justify-center items-center">
                  <div className="relative mx-auto" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="absolute inset-0">
                      {/* outer black outline */}
                      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={OUTLINE_BLACK} strokeWidth={6} />
                      {/* inner dashed ring with subtle green/orange accents */}
                      <circle cx={size/2} cy={size/2} r={radius-10} fill="none" stroke="#e6e6e6" strokeWidth={6} strokeDasharray="6 12" />
                    </svg>

                    {/* Center GIF */}
                    <div className="absolute inset-0 grid place-items-center pointer-events-none">
                      <div style={{ width: innerSize, height: innerSize, borderRadius: innerSize/2, overflow: 'hidden', display: 'grid', placeItems: 'center', background: 'transparent' }}>
                        <img src={gifUrl} alt="FOMO Cycle Cat" style={{ width: innerSize - 8, height: innerSize - 8 }} className="object-contain" draggable={false} />
                      </div>
                    </div>

                    {/* Orbiting indicator dot */}
                    {(() => { const {x,y}=orbPos(); return (
                      <motion.div className="absolute" style={{ left:size/2+x, top:size/2+y }} animate={{scale:[1,1.1,1]}} transition={{duration:1.2/speed, repeat:Infinity}}>
                        <div style={{ transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: 18/2, background: ACCENT_GREEN, boxShadow: `0 0 10px ${ACCENT_GREEN}55`, border: `2px solid ${OUTLINE_BLACK}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CircleDot style={{ width: 10, height: 10, color: '#fff' }} />
                        </div>
                      </motion.div> ) })()}

                    {/* Invisible clickable areas and cards */}
                    {steps.map((s,i)=>{
                      const {x,y} = nodePos(i);
                      const active = i===activeIndex;
                      const cx = size/2 + x * cardOffsetFactor;
                      const cy = size/2 + y * cardOffsetFactor;
                      return (
                        <div key={s.id}>
                          <button onClick={()=>goStep(i)} className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8" style={{ left: size/2 + x, top: size/2 + y }} aria-label={`Go to ${cleanTitle(s.title)}`}>
                            <span className="sr-only">Go to {cleanTitle(s.title)}</span>
                          </button>

                          <div className="hidden xl:block absolute" style={{ left: cx - cardWidth/2, top: cy - 28, width: cardWidth }}>
                            <div style={{ padding: 12, borderRadius: 16, border: `2px solid ${OUTLINE_BLACK}`, background: active ? ACCENT_GREEN : ACCENT_ORANGE, color: '#fff', transition: 'background-color 300ms ease, color 300ms ease, box-shadow 300ms ease, border-color 300ms ease', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: '#fff', marginBottom: 6 }}>Step {s.id}</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{cleanTitle(s.title)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Controls and Quote - Enhanced layout */}
                <div className="lg:col-span-5">
                  {/* Enhanced Controls Section with better grouping */}
                  <div className="bg-gradient-to-r from-white to-[#f9f9f9] p-6 rounded-2xl mb-8 shadow-lg border-2 border-gray-100">
                    <div className="flex flex-col gap-5 items-center justify-center mb-5">
                      <div className="flex gap-4 w-full justify-center">
                        <Button 
                          onClick={prev} 
                          className="px-4 py-3 flex-1 hover:bg-gray-100 transition-all duration-300" 
                          style={{ background: '#fff', color: '#000', border: `2px solid ${OUTLINE_BLACK}`, maxWidth: '90px', borderRadius: '12px' }}
                        >
                          <SkipBack className="w-5 h-5 text-black"/>
                        </Button>
                        <Button 
                          onClick={()=>setRunning(r=>!r)} 
                          className="px-6 py-3 bg-[#F39B32] hover:bg-[#E38922] border-2 border-black flex-1 transition-all duration-300"
                          style={{ borderRadius: '12px', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}
                        >
                          {running? 
                            <span className="inline-flex items-center gap-3 justify-center font-bold"><Pause className="w-6 h-6"/> Pause</span>:
                            <span className="inline-flex items-center gap-3 justify-center font-bold"><Play className="w-6 h-6"/> Play</span>
                          }
                        </Button>
                        <Button 
                          onClick={next} 
                          className="px-4 py-3 flex-1 hover:bg-gray-100 transition-all duration-300" 
                          style={{ background: '#fff', color: '#000', border: `2px solid ${OUTLINE_BLACK}`, maxWidth: '90px', borderRadius: '12px' }}
                        >
                          <SkipForward className="w-5 h-5 text-black"/>
                        </Button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider mb-3">
                        <span className="text-[#F39B32] text-base">Speed</span>
                        <span className="bg-black text-white px-3 py-1 rounded-md text-sm font-mono">{speed.toFixed(1)}x</span>
                      </div>
                      <Slider
                        className="w-full [&_[data-slot=slider-track]]:h-3 [&_[data-slot=slider-track]]:bg-black [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-[#F39B32] [&_[data-slot=slider-range]]:to-[#f97316] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-black [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-md"
                        value={[speed]}
                        min={0.5}
                        max={3}
                        step={0.1}
                        onValueChange={v => setSpeed(v[0])}
                        aria-label="Animation speed"
                      />
                    </div>
                  </div>

                  {/* Enhanced Current Step Quote with animation */}
                  <motion.div 
                    className="border-2 border-[#000] rounded-2xl p-8 bg-gradient-to-br from-white to-[#f9f9f9] shadow-xl"
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                  >
                    <div className="text-[#16a34a] font-extrabold uppercase mb-4 text-2xl tracking-wide">{cleanTitle(steps[activeIndex].title).toUpperCase()}</div>
                    <p className="text-[#111] leading-relaxed text-xl font-medium">{steps[activeIndex].quote}</p>
                  </motion.div>
                  
                  {/* Enhanced Mobile Step Labels with better layout */}
                  <div className="grid grid-cols-2 gap-4 mt-8 lg:hidden">
                    {steps.map((s, i) => (
                      <motion.button 
                        key={s.id} 
                        onClick={() => goStep(i)}
                        className={`text-sm p-4 rounded-xl border-2 shadow-md ${i === activeIndex ? 'bg-[#16a34a] text-white border-black font-bold' : 'bg-[#f97316] text-white border-black/50'}`}
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {s.id}. {cleanTitle(s.title)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Why $TOP Section with right-to-left marquee */}
            <div className="my-12">
              <motion.h4 
                className="font-agrandir text-4xl mb-8 text-[var(--green)] tracking-wider"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                WHY $TOP?
              </motion.h4>
              <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#F39B32] to-[#f97316] text-white border-2 border-black/10 p-4 md:p-6">
                <motion.div
                  className="flex gap-6"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  aria-label="why-top-marquee"
                >
                  <div className="flex gap-6 shrink-0">
                    {whyReasons.map((r, idx) => (
                      <div
                        key={`why-${idx}`}
                        className="min-w-[20rem] max-w-[22rem] p-5 rounded-xl shadow-md border-2 border-black/40 transition-all"
                        style={{ background: ACCENT_GREEN }}
                      >
                        <div className="text-white font-extrabold text-xl mb-2 leading-tight">{r.title}</div>
                        <div className="text-sm text-white/90 leading-relaxed whitespace-normal break-words" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.subtitle}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-6 shrink-0" aria-hidden>
                    {whyReasons.map((r, idx) => (
                      <div
                        key={`why-dup-${idx}`}
                        className="min-w-[20rem] max-w-[22rem] p-5 rounded-xl shadow-md border-2 border-black/40"
                        style={{ background: ACCENT_GREEN }}
                      >
                        <div className="text-white font-extrabold text-xl mb-2 leading-tight">{r.title}</div>
                        <div className="text-sm text-white/90 leading-relaxed whitespace-normal break-words" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.subtitle}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Enhanced Manifesto Section */}
            <div className="my-16 p-10 bg-gradient-to-br from-[#f0f9f1] via-[#e8f8e8] to-[#e6f7e6] rounded-2xl border-3 border-[var(--green)] max-w-6xl mx-auto shadow-xl">
              <motion.h4 
                className="font-agrandir text-5xl mb-8 text-[var(--green)] tracking-wider drop-shadow-md"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
              >
                THE MANIFESTO
              </motion.h4>
              <motion.p 
                className="opacity-90 italic text-2xl leading-relaxed font-medium"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
              >
                "We are the exit liquidity. We are the ones who buy the news. We are the diamond hands that turn to paper. We are the believers in 'this time is different.'
                But most importantly, we are the ones who keep coming back for more. Because deep down, we know that one day, maybe, possibly, perhaps... we might actually buy the bottom.
                Until then, we buy the TOP."
              </motion.p>
            </div>

            {/* THE PLOT TWIST Section */}
            <div className="my-16 relative overflow-hidden rounded-3xl border-3 border-black/10 bg-gradient-to-br from-[#0b0b0b] via-[#0f5132] to-[#16a34a] text-white shadow-2xl max-w-6xl mx-auto">
              <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"/>
              <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"/>
              <div className="p-10 md:p-12">
                <motion.h4
                  className="font-agrandir text-5xl md:text-6xl mb-2 tracking-wider drop-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  THE PLOT TWIST
                </motion.h4>
                <motion.p
                  className="text-2xl md:text-3xl italic mb-8 text-white/90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  “What If We Actually Make It?”
                </motion.p>
                <div className="grid gap-5 text-lg leading-relaxed">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Wait... hear me out. What if this satirical mess actually becomes something beautiful?
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    Yes, we started as broken retail traders. Yes, we've been rugged more times than we can count. But here's the thing — we <span className="font-bold text-[#F39B32]">LEARNED</span> from every single rug, every single loss, every single “diamond hands to zero” moment.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    We know what <span className="underline decoration-white/60">NOT</span> to do because we've done it all wrong.
                  </motion.p>
                  <motion.div
                    className="mt-2 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <p className="font-semibold text-xl mb-2">What if we flip the script?</p>
                    <p>
                      What if $TOP becomes the first meme coin built <span className="font-bold">BY</span> the exit liquidity, <span className="font-bold">FOR</span> the exit liquidity?
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* THE COMMUNITY VISION Section */}
            <div className="my-16 relative overflow-hidden rounded-3xl border-3 border-black/10 bg-gradient-to-br from-[#111827] via-[#0b3b2a] to-[#16a34a] text-white shadow-2xl max-w-6xl mx-auto">
              <div className="pointer-events-none absolute -top-8 right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
              <div className="pointer-events-none absolute bottom-0 -left-8 w-36 h-36 rounded-full bg-white/10 blur-2xl"/>
              <div className="p-10 md:p-12">
                <motion.h4
                  className="font-agrandir text-5xl md:text-6xl tracking-wider drop-shadow mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  THE COMMUNITY VISION
                </motion.h4>
                <motion.p
                  className="text-2xl md:text-3xl italic text-white/90 mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  "From Broke to Baroque - Building Something Real"
                </motion.p>
                {/* Separator removed as requested */}
                <div className="grid gap-5 text-lg leading-relaxed">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    Look, we're not promising you Lambos next week. We're not saying 'guaranteed 1000x.' We're saying something even crazier:
                  </motion.p>
                  <motion.p
                    className="font-semibold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    What if we build this together, the <span className="text-[#F39B32]">RIGHT</span> way?
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Meet The Dev Section */}
            <div className="my-16 relative overflow-hidden rounded-3xl border-[3px] border-black bg-gradient-to-br from-[#0b0b0b] via-[#111827] to-[#0f5132] text-white shadow-2xl max-w-6xl mx-auto">
              <div className="pointer-events-none absolute -top-12 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl"/>
              <div className="pointer-events-none absolute -bottom-12 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl"/>
              <div className="relative p-10 md:p-12">
                <motion.h4
                  className="font-agrandir text-5xl md:text-6xl tracking-wider drop-shadow mb-0"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Meet The Dev
                </motion.h4>
                <motion.p
                  className="text-2xl md:text-3xl italic text-white/90 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  (One of Us)
                </motion.p>
                <div className="grid gap-5 text-lg leading-relaxed">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    Hi anons, I'm just another retail trader who got absolutely REKT by influencer rugs. You know the drill — famous crypto Twitter personality shills a coin, we all ape in, then they dump on us while tweeting "WAGMI" from their Lambos.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  >
                    After losing my lunch money to the 47th influencer rug this year, I decided: if you can't beat 'em, make memes about 'em. $TOP is born from pure spite and financial trauma. This isn't a get-rich-quick scheme, it's a get-poor-quick reality check.
                  </motion.p>
                  <motion.div
                    className="mt-2 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                  >
                    <p className="font-semibold mb-2">Dev Wallet Address for Full Transparency:</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <div className="font-mono text-base bg-black/60 text-white px-4 py-2 rounded-xl border-2 border-white/20 text-center">
                        {DEV_WALLET}
                      </div>
                      <Button
                        onClick={copyWallet}
                        className={`px-4 py-2 bg-[#F39B32] hover:bg-[#E38922] text-black font-bold border-2 border-black rounded-xl shadow transition-transform ${copiedWallet ? 'animate-pulse' : ''}`}
                        style={{ boxShadow: '0 3px 0 rgba(0,0,0,0.2)', transform: copiedWallet ? 'scale(1.02)' : undefined }}
                        aria-label="Copy dev wallet address"
                      >
                        {copiedWallet ? (
                          <span className="inline-flex items-center gap-2"><Check className="w-4 h-4"/> Copied</span>
                        ) : (
                          <span className="inline-flex items-center gap-2"><Copy className="w-4 h-4"/> Copy Wallet</span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.45 }}
                  >
                    Go ahead, check it. You'll see I'm just as broke as you are. My biggest transaction? Buying ramen in bulk. My portfolio? Redder than a tomato farm. My net worth? Let's just say even Nigerian princes stopped emailing me. But hey, at least we're all going to zero together! 🤝
                  </motion.p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Signature Section */}
            <div className="mt-16 mb-10 p-6 max-w-3xl mx-auto">
              <motion.p 
                className="font-semibold text-2xl mb-3 italic"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Forever at the top,
              </motion.p>
              <motion.p 
                className="font-bold text-4xl bg-gradient-to-r from-[#F39B32] via-[#f97316] to-[#16a34a] bg-clip-text text-transparent drop-shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              >
                $TOP Guy
              </motion.p>
            </div>
            
            {/* Enhanced Close Button */}
            <div className="pt-6 pb-2">
              <motion.button
                onClick={onClose}
                className="rounded-full bg-black px-12 py-5 text-lg font-semibold text-white hover:bg-[var(--green)] transition-all duration-300 border-2 border-transparent hover:border-black shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close Letter
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}