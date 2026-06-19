// わんこそばブロック（5バリエーション）
const BOWL_STYLES = [
  { bowl: '#8B2010', rim: '#c04020', soup: '#2a0a06', noodle: '#e8c080', topping: 'nori'   },
  { bowl: '#6B3010', rim: '#a05020', soup: '#1a0800', noodle: '#f0d090', topping: 'negi'   },
  { bowl: '#9B1810', rim: '#d03020', soup: '#300806', noodle: '#ddb870', topping: 'ebi'    },
  { bowl: '#7B2808', rim: '#b04018', soup: '#220a04', noodle: '#e8c878', topping: 'ume'    },
  { bowl: '#5B3018', rim: '#904828', soup: '#180c06', noodle: '#f0d898', topping: 'wasabi' },
]

export function WankoBlock({ size, variant = 0 }) {
  const s = size
  const c = BOWL_STYLES[variant % BOWL_STYLES.length]
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" style={{ display: 'block' }}>
      {/* Shadow */}
      <ellipse cx="20" cy="36" rx="14" ry="2.5" fill="rgba(0,0,0,0.35)" />
      {/* Bowl body */}
      <path d="M6,18 Q6,34 20,34 Q34,34 34,18 Z" fill={c.bowl} />
      {/* Shading */}
      <path d="M6,18 Q6,26 13,30 Q6,26 6,18 Z" fill="rgba(255,255,255,0.06)" />
      {/* Rim outer */}
      <ellipse cx="20" cy="18" rx="14" ry="5" fill={c.rim} />
      {/* Rim highlight */}
      <ellipse cx="16" cy="16.5" rx="4" ry="1.5" fill="rgba(255,255,255,0.18)" transform="rotate(-15,16,16.5)" />
      {/* Soup */}
      <ellipse cx="20" cy="18" rx="12" ry="4" fill={c.soup} />
      {/* Noodles */}
      <path d="M10,17.5 Q14,14.5 18,17.5 Q22,20.5 26,17.5 Q29,15 30,17.5" stroke={c.noodle} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M11,19.5 Q15,16.5 19,19.5 Q23,22.5 27,19.5 Q30,17 31,19.5" stroke={c.noodle} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* Toppings */}
      {c.topping === 'nori'   && <rect x="17" y="13" width="6" height="4" rx="0.5" fill="#1a2a1a" opacity="0.85" />}
      {c.topping === 'negi'   && <>{[14,20,26].map(cx => <circle key={cx} cx={cx} cy="14" r="1.8" fill="#6abf40" opacity="0.9" />)}</>}
      {c.topping === 'ebi'    && <path d="M14,16 Q17,11 22,13 Q25,15 24,18" stroke="#e07040" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
      {c.topping === 'ume'    && <circle cx="20" cy="14" r="3" fill="#e04060" opacity="0.9" />}
      {c.topping === 'wasabi' && <ellipse cx="20" cy="14" rx="4" ry="2.5" fill="#5abf50" opacity="0.85" />}
      {/* Steam */}
      <path d="M15,12 Q14,9 15,6" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M20,11 Q19,8 20,5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M25,12 Q24,9 25,6" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function MiniPiece({ p, size = 20 }) {
  if (!p) return <div style={{ height: size * 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334', fontSize: 10 }}>空</div>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {p.cells.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((v, c) => (
            <div key={c} style={{ width: size, height: size, overflow: 'hidden', border: v ? `1px solid ${p.color}66` : 'none', boxSizing: 'border-box', borderRadius: 1 }}>
              {v ? <WankoBlock size={size} variant={p.variant || 0} /> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
