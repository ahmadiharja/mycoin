"use client"

// File: src/StopLanding.jsx
// Clean rebuild after syntax error: fixed stray/duplicated code and unmatched parentheses.
// Landing: $TOP hero, image card, wedge, LOVE LETTER modal, Action Tabs, and PFP/Community/Etsy/Chart/Buy modals.
// Fonts: Climate Crisis (headings), Poppins (body).

import { useEffect, useState } from "react"
import { LoveLetterModal } from "../components/modals/LoveLetterModal"

// Utility
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ")

export default function StopLanding() {
  // Inject Google Fonts
  useEffect(() => {
    const link1 = document.createElement("link")
    link1.rel = "stylesheet"
    link1.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800;900&display=swap"

    const link2 = document.createElement("link")
    link2.rel = "stylesheet"
    link2.href = "https://fonts.googleapis.com/css2?family=Climate+Crisis&display=swap"

    document.head.appendChild(link1)
    document.head.appendChild(link2)
    return () => {
      document.head.removeChild(link1)
      document.head.removeChild(link2)
    }
  }, [])

  // Quick sanity check (dev only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.assert(document.querySelector("main"), "Main element exists")
    }
  }, [])

  const [open, setOpen] = useState(false)
  const [pfpOpen, setPfpOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [etsyOpen, setEtsyOpen] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)
  const [catClickCount, setCatClickCount] = useState(0)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [contractAddress, setContractAddress] = useState('')

  // Handle cat card click
  const handleCatCardClick = () => {
    const newCount = catClickCount + 1
    setCatClickCount(newCount)
    
    if (newCount >= 5) {
      setCatModalOpen(true)
      setCatClickCount(0) // Reset counter after opening modal
    }
  }

  // Handle password validation
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === "Azkadina0714!") {
      setIsPasswordCorrect(true)
    } else {
      alert("Password salah!")
      setPasswordInput('')
    }
  }

  // Handle contract address update
  const handleContractAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Contract address berhasil diperbarui: ${contractAddress}`)
  }

  return (
    <main className="relative min-h-screen bg-[#0a0706] text-white overflow-hidden">
      {/* Embedded styles */}
      <style>{`
        :root { --green: #00a651; }
        body { font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif; }
        .font-agrandir { font-family: 'Climate Crisis', 'Poppins', system-ui, sans-serif; }

        /* Tabs wobble */
        @keyframes goyang { 0%,100% { transform: rotate(-1deg) translateY(0) scale(1); } 50% { transform: rotate(1.2deg) translateY(-1px) scale(1.02); } }
        .animate-goyang { animation: goyang 4.5s ease-in-out infinite; transform-origin: 50% 60%; will-change: transform; }

        /* Love Letter sparkles */
        @keyframes sparkle { 0% { transform: scale(.2) rotate(0deg); opacity: 0; } 45% { opacity: 1; } 70% { transform: scale(1) rotate(20deg); } 100% { transform: scale(.2) rotate(0deg); opacity: 0; } }
        @keyframes shine { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(120%) skewX(-20deg); } }
        .spark { position:absolute; width:12px; height:12px; background:#fff; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); filter: drop-shadow(0 0 6px rgba(255,255,255,.65)); animation: sparkle 1.8s ease-in-out infinite; }
        .shine { position:absolute; inset:-20% -60%; background: linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.25) 50%, rgba(255,255,255,0) 100%); animation: shine 1.6s linear infinite; opacity:.85; }

        /* PFP modal scrollbar */
        .scroll-green{ scrollbar-color: var(--green) transparent; scrollbar-width: thin; }
        .scroll-green::-webkit-scrollbar{ width:10px; height:10px; }
        .scroll-green::-webkit-scrollbar-thumb{ background: var(--green); border-radius:8px; }
        .scroll-green::-webkit-scrollbar-track{ background: transparent; }

        /* Modal entrance */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .overlay-enter { animation: fadeIn .28s ease-out both; }
        @keyframes modalIn { 0% { opacity: 0; transform: translateY(10px) scale(.96); } 60% { opacity: 1; transform: translateY(0) scale(1.02); } 100% { transform: translateY(0) scale(1); } }
        .modal-enter { animation: modalIn .38s cubic-bezier(0.22,1,0.36,1) both; }
        .modal-enter-plate { animation: modalIn .46s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* Giant $TOP text */}
      <div className="pointer-events-none select-none absolute inset-x-0 top-[6vh] z-0 text-center">
        <h1
          className="font-agrandir font-normal leading-[0.8] tracking-[-0.04em] text-[26vw] md:text-[18vw]"
          style={{ color: "var(--green)" }}
          aria-hidden
        >
          $TOP
        </h1>
      </div>

      {/* Center image card */}
      <div className="relative z-10 pt-[16vh] md:pt-[14vh] flex justify-center">
        <div 
          className="w-[280px] h-[420px] md:w-[320px] md:h-[480px] rounded-[28px] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden border border-black/20 cursor-pointer"
          onClick={handleCatCardClick}
        >
          <img
            src="https://i.ibb.co.com/xtmGYN7q/a3kw7f6rerd3jodsgsk77dp24i.jpg"
            alt="Buy The Top Guy"
            referrerPolicy="no-referrer"
            decoding="async"
            loading="eager"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 35%" }}
          />
        </div>
      </div>

      {/* Title, address, CTA */}
      <section className="relative z-10 mt-8 md:mt-10 text-center">
        <h2
          className="font-agrandir font-normal uppercase tracking-[0.02em] md:tracking-[0.03em] text-[5.5vw] md:text-[2.8vw] leading-none"
          style={{ color: "#000", textShadow: "0 1px 0 rgba(255,255,255,0.05)" }}
        >
          "BUY THE TOP" GUY
        </h2>
        <p className="mt-1 text-[#1a1a1a]/80 text-sm md:text-base tracking-wide">
          "xxxxxxxxxxxxxxxxxxxxxxxxxxx"
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
            className="relative inline-block rounded-full bg:black bg-black text-white text-sm md:text-base font-semibold px-8 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)] hover:opacity-90 active:scale-[0.99] transition overflow-hidden group"
          >
            <span className="relative z-10">LOVE LETTER</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="spark" style={{ top: "20%", left: "18%", animationDelay: "0s" }} />
              <span className="spark" style={{ top: "35%", left: "78%", animationDelay: ".25s" }} />
              <span className="spark" style={{ bottom: "25%", left: "38%", animationDelay: ".6s" }} />
              <span className="spark" style={{ bottom: "18%", left: "62%", animationDelay: ".9s" }} />
              <span className="shine" />
            </span>
          </button>
        </div>
      </section>

      <ActionTabs
        onOpenPfp={() => setPfpOpen(true)}
        onOpenCommunity={() => setCommunityOpen(true)}
        onOpenEtsy={() => setEtsyOpen(true)}
        onOpenChart={() => setChartOpen(true)}
        onOpenBuy={() => setBuyOpen(true)}
      />

      {/* Bottom wedge (green triangle up) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62vh] md:h-[68vh] z-[1]"
        style={{ background: "var(--green)", clipPath: "polygon(0% 100%, 50% 12%, 100% 100%)" }}
        aria-hidden
      />

      {open && <LoveLetterModal onClose={() => setOpen(false)} />}
      {pfpOpen && <PfpModal onClose={() => setPfpOpen(false)} />}
      {communityOpen && <CommunityModal onClose={() => setCommunityOpen(false)} />}
      {etsyOpen && <EtsyModal onClose={() => setEtsyOpen(false)} />}
      {chartOpen && <ChartModal onClose={() => setChartOpen(false)} />}
      {buyOpen && <BuyModal onClose={() => setBuyOpen(false)} />}
      {catModalOpen && <CatModal onClose={() => setCatModalOpen(false)} />}
    </main>
  )
}

// ===== COMMUNITY MODAL =====
function CommunityModal({ onClose }: { onClose: () => void }) {
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />

      <div className="relative w-full max-w-4xl">
        {/* Back plate (orange) */}
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[#F39B32] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate overflow-hidden"
          aria-hidden
        >
          {/* Decorative elements */}
          <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-white/20"></div>
          <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-white/15"></div>
          <div className="absolute top-[40%] right-[20%] w-6 h-6 rounded-full bg-white/10"></div>
        </div>

        {/* Front white panel */}
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">
          <div className="p-6 max-h-[75vh] overflow-y-auto scroll-green">
            <div className="sticky top-0 z-20 -mx-6 -mt-0 px-6 py-3 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
              <h3 className="font-agrandir text-2xl leading-none tracking-wide">COMMUNITY</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 grid place-items-center rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-md"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-6">
              <div className="mx-auto max-w-2xl text-center">
                <p className="inline-block rounded-full border-2 border-black bg-white px-4 py-1 text-xs font-extrabold tracking-wide">
                  EXIT-LIQUIDITY ALLIANCE
                </p>
                <h4 className="mt-4 font-agrandir text-3xl leading-tight">Dear Chad, your throne is empty.</h4>
                <p className="mt-3 opacity-90 leading-relaxed">
                  If you're truly alpha, you don't ask for a community, you <span className="font-semibold">spawn</span> one.
                  Spin up the chat, set the vibe, drop the memes, pin the rules. We will follow the candle, you lead the cope.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl border-2 border-black bg-[#EDEDED] p-3">
                    <p className="font-semibold">Daily Memes</p>
                    <p className="opacity-70">Post to survive</p>
                  </div>
                  <div className="rounded-xl border-2 border-black bg-[#EDEDED] p-3">
                    <p className="font-semibold">Voice Cope</p>
                    <p className="opacity-70">Optional therapy</p>
                  </div>
                  <div className="rounded-xl border-2 border-black bg-[#EDEDED] p-3">
                    <p className="font-semibold">Zero Roadmap</p>
                    <p className="opacity-70">100% Morale</p>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Start The Community
                  </a>
                  <a
                    href={`https://x.com/intent/tweet?text=${encodeURIComponent("Raiding with $TOP — buy the top, meme the drop. 🚀")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border-2 border-black bg-white px-5 py-2 text-sm font-semibold"
                  >
                    Raid on X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== PFP MODAL (same frame style) =====
function PfpModal({ onClose }: { onClose: () => void }) {
  const [viewer, setViewer] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewer) setViewer(null)
        else onClose()
      }
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, viewer])

  const IMGS: string[] = [
    "/images/pfp/topguy (1).jpg",
    "/images/pfp/topguy (1).jpeg",
    "/images/pfp/topguy (2).jpeg",
    "/images/pfp/topguy (3).jpeg",
    "/images/pfp/topguy (4).jpeg",
    "/images/pfp/topguy (5).jpeg",
    "/images/pfp/topguy (6).jpeg",
    "/images/pfp/topguy (7).jpeg",
    "/images/pfp/topguy (8).jpeg",
    "/images/pfp/topguy (9).jpeg",
    "/images/pfp/topguy (10).jpeg",
    "/images/pfp/topguy (11).jpeg",
    "/images/pfp/topguy (12).jpeg",
    "/images/pfp/topguy (13).jpeg",
    "/images/pfp/topguy (14).jpeg",
    "/images/pfp/topguy (15).jpeg",
    "/images/pfp/topguy (16).jpeg",
    "/images/pfp/topguy (17).jpeg",
    "/images/pfp/topguy (18).jpeg",
    "/images/pfp/topguy (19).jpeg",
    "/images/pfp/topguy (20).jpeg",
    "/images/pfp/topguy (21).jpeg",
    "/images/pfp/topguy (22).jpeg",
  ].map((p) => encodeURI(p))

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />

      <div className="relative w-full max-w-4xl">
        {/* Back plate (orange) */}
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[#F39B32] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate overflow-hidden"
          aria-hidden
        >
          {/* Decorative elements */}
          <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-white/20"></div>
          <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-white/15"></div>
          <div className="absolute top-[40%] right-[20%] w-6 h-6 rounded-full bg-white/10"></div>
        </div>

        {/* Front white panel */}
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">

          {/* Content */}
          <div className="px-6 pb-6 pt-0 max-h-[75vh] overflow-y-auto scroll-green">
            {/* Sticky Title */}
            <div className="sticky top-0 z-20 -mx-6 -mt-0 px-6 py-3 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
              <h3 className="font-agrandir text-2xl leading-none tracking-wide">THE TOP GUY PFP VAULT</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 grid place-items-center rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-md"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
              {IMGS.map((src, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-[#F39B32] border-2 border-black"
                    aria-hidden
                  />
                  <button
                    type="button"
                    onClick={() => setViewer(src)}
                    className="relative rounded-xl border-2 border-black bg-[#EDEDED] aspect-square overflow-hidden group focus:outline-none focus:ring-2 focus:ring-black"
                    title="View"
                  >
                    <img
                      src={src}
                      alt={`PFP ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {viewer && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4" onClick={() => setViewer(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md overlay-enter" />
          <div
            className="relative max-w-[92vw] max-h-[82vh] rounded-2xl border-2 border-black bg-white p-2 modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={viewer} alt="PFP full" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                onClick={() => setViewer(null)}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-black text-white"
              >
                Close
              </button>
              <a
                href={viewer}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2 text-sm font-semibold bg-[var(--green)] text-black"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ===== ETSY MODAL (same frame style) =====
function EtsyModal({ onClose }: { onClose: () => void }) {
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

  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Top Guy Merch #${i + 1}`,
    price: (9.99 + i).toFixed(2),
    img: `https://picsum.photos/seed/etsy${i}/600/600`,
  }))

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[#F39B32] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate"
          aria-hidden
        />
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">
          <div className="p-6 max-h-[75vh] overflow-y-auto scroll-green">
            {/* Sticky Title like PFP */}
            <div className="sticky top-0 z-20 -mx-6 -mt-0 px-6 py-3 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
              <h3 className="font-agrandir text-2xl leading-none tracking-wide">TOP GUY ETSY STORE</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 grid place-items-center rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-md"
                title="Close"
              >
                ×
              </button>
            </div>
            {/* Under Construction Content */}
            <div className="mt-6 grid place-items-center">
              <div className="relative w-full max-w-xl rounded-2xl border-2 border-black bg-[#EDEDED] p-6 overflow-hidden">
                <div className="absolute inset-0 opacity-30" style={{ background: 'repeating-linear-gradient(135deg, #fff, #fff 8px, #f7d7a8 8px, #f7d7a8 16px)' }} />
                <div className="relative">
                  <p className="font-agrandir text-3xl mb-2">Under Construction</p>
                  <p className="text-lg opacity-80">We\'re crafting the freshest “Top Guy” merch. The store will open soon — bring your best cope and your worst spending habits.</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#F39B32] animate-pulse" />
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== CHART MODAL (same frame style) =====
function ChartModal({ onClose }: { onClose: () => void }) {
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

  // Fake candles data
  const candles = Array.from({ length: 48 }, () => Math.floor(10 + Math.random() * 90))

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[#F39B32] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate"
          aria-hidden
        />
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">
          <div className="px-6 pb-6 pt-0 max-h-[75vh] overflow-y-auto scroll-green">
            {/* Sticky Title - Fixed positioning to avoid gap */}
            <div className="sticky top-0 z-20 -mx-6 -mt-0 px-6 py-3 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
              <h3 className="font-agrandir text-2xl leading-none tracking-wide">LIVE CHART</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 grid place-items-center rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-md"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-4 rounded-xl border-2 border-black bg-[#0a0a0a] overflow-hidden">
              <iframe
                src="https://www.gmgn.cc/kline/sol/xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full h-[70vh]"
                loading="lazy"
                referrerPolicy="no-referrer"
                title="GMGN Live Chart"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== BUY MODAL (same frame style) =====
function BuyModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const addr = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"

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

  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(addr)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[#F39B32] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate"
          aria-hidden
        />
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">
          <div className="px-6 pb-6 pt-0 max-h-[75vh] overflow-y-auto scroll-green">
            <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
              <h3 className="font-agrandir text-2xl leading-none tracking-wide">BUY $TOP</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 grid place-items-center rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-md"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Copy contract address</li>
                <li>Open your favorite DEX</li>
                <li>Paste & swap responsibly (lol)</li>
              </ol>
              <div className="rounded-xl border-2 border-black bg-[#EDEDED] p-3 flex items-center justify-between">
                <code className="text-xs md:text-sm break-all">{addr}</code>
                <div className="flex gap-2">
                  <button onClick={copyAddr} className="rounded-full bg-black text-white px-3 py-1.5 text-sm font-semibold">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <a href="https://jup.ag/tokens/xxxxxxxxxxxxxxxxxxxxxxxxxxx" target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-black bg-white px-3 py-1.5 text-sm font-semibold">
                    Open Jup
                  </a>
                </div>
              </div>
              <p className="text-sm opacity-70">*No promises. DYOR. This is satire.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Small utilities =====
function Rotator({ items = [], interval = 1400 }: { items?: string[]; interval?: number }) {
  const [i, setI] = useState<number>(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % items.length), interval)
    return () => clearInterval(id)
  }, [items, interval])
  return <span className="inline-block font-semibold">{items[i]}</span>
}

function KeyValue({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs opacity-70">{k}</p>
      <p className="font-semibold">{v}</p>
    </div>
  )
}

function ActionTabs({ onOpenPfp, onOpenCommunity, onOpenEtsy, onOpenChart, onOpenBuy }: {
  onOpenPfp: () => void;
  onOpenCommunity: () => void;
  onOpenEtsy: () => void;
  onOpenChart: () => void;
  onOpenBuy: () => void;
}) {
  const items = ["COMMUNITY", "PFP", "ETSY", "CHART", "BUY"]
  const [hover, setHover] = useState<number | null>(null)

  return (
    <nav aria-label="Category" className="relative z-10 mt-8 md:mt-10 flex justify-center">
      <div className="flex items-center gap-5 md:gap-8">
        {items.map((label, idx) => (
          <button
            key={label}
            onMouseEnter={() => setHover(idx)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(idx)}
            onBlur={() => setHover(null)}
            onClick={() => {
              if (label === "PFP") onOpenPfp?.()
              if (label === "COMMUNITY") onOpenCommunity?.()
              if (label === "ETSY") onOpenEtsy?.()
              if (label === "CHART") onOpenChart?.()
              if (label === "BUY") onOpenBuy?.()
            }}
            className={cx(
              "relative group isolate inline-flex items-center transition-transform duration-200 active:scale-95",
              hover === idx ? "animate-goyang" : "",
            )}
            aria-label={label}
          >
            <span
              className={cx(
                "absolute inset-x-0 rounded-2xl bg-[#F39B32] shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-300 -z-10 pointer-events-none group-active:scale-95 group-active:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
                hover === idx ? "opacity-100 scale-100" : "opacity-0 scale-90",
              )}
              style={{ top: "-0.5rem", height: "100vh" }}
            />
            <span
              className={cx(
                "relative transition-all duration-300 tracking-wider text-black px-6 py-2",
                hover === idx ? "font-agrandir text-2xl md:text-3xl" : "font-extrabold text-sm md:text-base",
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// ===== CAT MODAL =====
function CatModal({ onClose }: { onClose: () => void }) {
  const [passwordInput, setPasswordInput] = useState('')
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [contractAddress, setContractAddress] = useState('')

  // Handle password validation
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === "Azkadina0714!") {
      setIsPasswordCorrect(true)
    } else {
      alert("Password salah!")
      setPasswordInput('')
    }
  }

  // Handle contract address update
  const handleContractAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Contract address berhasil diperbarui: ${contractAddress}`)
  }

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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        {/* Back plate (green) */}
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[var(--green)] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate overflow-hidden"
          aria-hidden
        >
          {/* Decorative elements */}
          <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-white/20"></div>
          <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-white/15"></div>
          <div className="absolute top-[40%] right-[20%] w-6 h-6 rounded-full bg-white/10"></div>
        </div>

        {/* Front white panel */}
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">
          <div className="p-6 max-h-[75vh] overflow-y-auto scroll-green">
            <div className="sticky top-0 z-20 -mx-6 -mt-0 px-6 py-3 bg-white border-b-2 border-black flex items-center justify-between shadow-sm">
              <h3 className="font-agrandir text-2xl leading-none tracking-wide">RAHASIA TERSEMBUNYI</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 grid place-items-center rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-sm hover:shadow-md"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-6 text-center">
              <div className="mx-auto max-w-2xl">
                {!isPasswordCorrect ? (
                  <>
                    <p className="inline-block rounded-full border-2 border-black bg-[var(--green)] px-4 py-1 text-xs font-extrabold tracking-wide">
                      KONFIGURASI
                    </p>
                    <h4 className="mt-4 font-agrandir text-3xl leading-tight">Area Terbatas</h4>
                    <p className="mt-3 opacity-90 leading-relaxed">
                      Masukkan password untuk mengakses konfigurasi contract address.
                    </p>
                    <div className="mt-6 rounded-xl border-2 border-black bg-[#EDEDED] p-6 overflow-hidden">
                      <form onSubmit={handlePasswordSubmit} className="relative">
                        <div className="mb-4">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                            placeholder="Masukkan password"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          Verifikasi
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="inline-block rounded-full border-2 border-black bg-[var(--green)] px-4 py-1 text-xs font-extrabold tracking-wide">
                      KONFIGURASI CONTRACT
                    </p>
                    <h4 className="mt-4 font-agrandir text-3xl leading-tight">Pengaturan Contract Address</h4>
                    <div className="mt-6 rounded-xl border-2 border-black bg-[#EDEDED] p-6 overflow-hidden">
                      <form onSubmit={handleContractAddressUpdate} className="relative">
                        <div className="mb-4">
                          <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                            Contract Address
                          </label>
                          <input
                            type="text"
                            id="contractAddress"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
                            placeholder="Masukkan contract address"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                        >
                          Simpan
                        </button>
                      </form>
                    </div>
                  </>
                )}
                <div className="mt-6">
                  <button
                    onClick={onClose}
                    className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
