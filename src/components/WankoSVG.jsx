export const WANKO_TYPES = [
  { name: 'のり',   bowl: '#f5e6c8', soup: '#c8a050', toppings: 'nori'   },
  { name: 'ねぎ',   bowl: '#f0e0b8', soup: '#b89040', toppings: 'negi'   },
  { name: 'えび',   bowl: '#f8eedc', soup: '#d4a860', toppings: 'ebi'    },
  { name: '梅',     bowl: '#f2e4c0', soup: '#c09848', toppings: 'ume'    },
  { name: 'わさび', bowl: '#eae8d0', soup: '#b8a448', toppings: 'wasabi' },
]

export default function WankoSVG({ type, size: s }) {
  const { bowl, soup, toppings } = WANKO_TYPES[type % WANKO_TYPES.length]
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <ellipse cx="50" cy="82" rx="36" ry="10" fill="#c8a878" opacity=".6" />
      <path d="M14,45 Q14,85 50,85 Q86,85 86,45 Z" fill={bowl} />
      <ellipse cx="50" cy="45" rx="36" ry="11" fill="#e8d090" />
      <ellipse cx="50" cy="45" rx="34" ry="9.5" fill={soup} />
      {[0, 1, 2].map(i => (
        <path key={i} d={`M${22 + i * 4},${50 + i * 4} Q${35 + i * 2},${46 + i * 4} 50,${50 + i * 4} Q${65 - i * 2},${54 + i * 4} ${78 - i * 4},${50 + i * 4}`}
          stroke="rgba(120,90,40,0.7)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ))}
      {toppings === 'nori'   && <rect x="42" y="38" width="16" height="10" rx="1" fill="#1a2a1a" opacity=".85" />}
      {toppings === 'negi'   && [40, 50, 60].map(cx => <circle key={cx} cx={cx} cy="41" r="3" fill="#6abf40" opacity=".9" />)}
      {toppings === 'ebi'    && <path d="M38,44 Q45,36 55,38 Q62,40 60,48" stroke="#e07040" strokeWidth="4" fill="none" strokeLinecap="round" />}
      {toppings === 'ume'    && <circle cx="50" cy="41" r="6" fill="#e04060" opacity=".9" />}
      {toppings === 'wasabi' && <ellipse cx="50" cy="41" rx="8" ry="5" fill="#5abf50" opacity=".9" />}
      <ellipse cx="50" cy="45" rx="34" ry="9.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      <ellipse cx="50" cy="45" rx="36" ry="11" fill="none" stroke="#b89050" strokeWidth="1.2" />
    </svg>
  )
}

export function MiniPiece({ shape, type, cell }) {
  if (!shape) return null
  const { name } = WANKO_TYPES[type % WANKO_TYPES.length]
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {shape.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((v, c) => (
            <div key={c} style={{ width: cell, height: cell, flexShrink: 0, border: v ? '1.5px solid rgba(200,160,80,0.7)' : 'none', borderRadius: 2, boxSizing: 'border-box', overflow: 'hidden' }}>
              {v ? <WankoSVG type={type} size={cell} /> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
