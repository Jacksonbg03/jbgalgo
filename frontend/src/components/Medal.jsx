import React from "react";

const RANK_STYLES = {
  1: {
    outer: "bg-gradient-to-br from-[#f7d76a] via-[#f2b93b] to-[#d4851e]",
    inner: "bg-gradient-to-br from-[#ffeb99] via-[#f5c542] to-[#cc7a00]",
    text: "text-[#7a0f00]",
    ribbon: "from-[#d6342e] via-[#b51f1a] to-[#941414]",
    glow: "bg-[radial-gradient(circle,_rgba(255,200,60,0.9)_0%,_rgba(255,150,0,0)_70%)]",
  },
  2: {
    outer: "bg-gradient-to-br from-[#e5e7eb] via-[#c4c7cb] to-[#8a8f96]",
    inner: "bg-gradient-to-br from-[#d7d7d7] via-[#b0b0b0] to-[#7a7a7a]",
    text: "text-[#2a2a2a]",
    ribbon: "from-[#d6342e] via-[#b51f1a] to-[#941414]",
    glow: "bg-[radial-gradient(circle,_rgba(200,200,255,0.9)_0%,_rgba(150,150,255,0)_70%)]",
  },
  3: {
    outer: "bg-gradient-to-br from-[#d28c47] via-[#b06a29] to-[#7a3e14]",
    inner: "bg-gradient-to-br from-[#e09f5a] via-[#b87333] to-[#6b3b10]",
    text: "text-[#3b1d0a]",
    ribbon: "from-[#d6342e] via-[#b51f1a] to-[#941414]",
    glow: "bg-[radial-gradient(circle,_rgba(255,180,100,0.9)_0%,_rgba(255,120,50,0)_70%)]",
  },
};


export function Medal({ rank = 1, size = 64 }) {
  const style = RANK_STYLES[rank] || RANK_STYLES[3];
  const fontSize = Math.max(14, Math.round(size / 2.8));

  return (
    <div className="relative flex flex-col items-start ml-2.5 mb-2">
      {/* --- Ribbon --- */}
      <div
        className="absolute -bottom-[26%] flex justify-center gap-[5px] ml-1"
        style={{ width: size * 0.8, height: size * 0.45 }}
      >
        <div
          className={`w-[45%] h-full bg-gradient-to-b ${style.ribbon} rotate-6 origin-top-right`}
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
            boxShadow: "0 3px 5px rgba(0,0,0,0.25)",
            borderRadius: "2px",
          }}
        ></div>
        <div
          className={`w-[45%] h-full bg-gradient-to-b ${style.ribbon} -rotate-6 origin-top-left`}
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
            boxShadow: "0 3px 5px rgba(0,0,0,0.25)",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      {/* --- Glow belakang medal --- */}
    <div
    className={`absolute top-4.5 left-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${style.glow} medal-glow`}
    style={{
        width: size * 1.4,
        height: size * 1.4,
        zIndex: 0,
    }}
    ></div>

      {/* --- Medal body --- */}
      <div
        className={`relative flex items-center justify-center rounded-full ${style.outer} shadow-lg`}
        style={{
          width: size,
          height: size,
          padding: size * 0.08,
        }}
      >
        <div
          className={`flex items-center justify-center rounded-full ${style.inner} shadow-inner`}
          style={{
            width: "100%",
            height: "100%",
            boxShadow: "inset 0 3px 6px rgba(0,0,0,0.3)",
          }}
        >
          <span
            className={`font-bold ${style.text}`}
            style={{
              fontSize,
              textShadow:
                "0 1px 2px rgba(255,255,255,0.5), 0 2px 3px rgba(0,0,0,0.3)",
            }}
          >
            {rank}
          </span>
        </div>

        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/15 to-transparent opacity-80 mix-blend-screen" />
      </div>
    </div>
  );
}
