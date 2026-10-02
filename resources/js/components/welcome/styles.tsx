export function WelcomeStyles() {
  return <style>{`
                .font-display{font-family:'Unbounded',system-ui,sans-serif}
                .font-body{font-family:'Manrope',system-ui,sans-serif}
                html{scroll-behavior:smooth}
                .grid-bg{background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:56px 56px;animation:drift 12s linear infinite;mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%)}
                @keyframes drift{to{background-position:56px 56px}}
                .spot{background:radial-gradient(420px circle at var(--mx,50%) var(--my,30%),rgba(59,130,246,.22),transparent 70%)}
                .digit{display:inline-block;animation:tick .35s ease-out}
                @keyframes tick{from{transform:translateY(-35%);opacity:0}to{transform:none;opacity:1}}
                .marquee{animation:slide 28s linear infinite}
                .marquee-wrap:hover .marquee{animation-play-state:paused}
                @keyframes slide{to{transform:translateX(-50%)}}
                .float{animation:float 6s ease-in-out infinite}
                @keyframes float{50%{transform:translateY(-12px) rotate(2deg)}}
                .scan{animation:scan 5s ease-in-out infinite}
                @keyframes scan{0%,100%{top:8%}50%{top:88%}}
                @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
            `}</style>;
}
