import React, { useEffect, useState } from "react";

export default function PfpModalLazy({ onClose }: { onClose: () => void }) {
  const [viewer, setViewer] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewer) setViewer(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, viewer]);

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
  ].map((p) => encodeURI(p));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md overlay-enter" onClick={onClose} />
      <div className="relative w-full max-w-4xl">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[22px] bg-[#F39B32] border-[3px] border-black shadow-[0_8px_0_#000,0_18px_40px_rgba(0,0,0,0.35)] modal-enter-plate overflow-hidden" aria-hidden>
          <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-white/20"></div>
          <div className="absolute bottom-[20%] right-[10%] w-12 h-12 rounded-full bg-white/15"></div>
          <div className="absolute top-[40%] right-[20%] w-6 h-6 rounded-full bg-white/10"></div>
        </div>
        <div className="relative rounded-[22px] bg-white text-black border-[3px] border-black overflow-hidden modal-enter">
          <div className="px-6 pb-6 pt-0 max-h-[75vh] overflow-y-auto scroll-green">
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
  );
}
