import { useState } from 'react'

export default function StoneBtn({ label, onClick, color = '#c8a060', width = '100%', disabled = false, locked = false, size = 'md' }) {
  const [pressed, setPressed] = useState(false)

  const padding = size === 'sm' ? '8px 14px' : size === 'lg' ? '16px 28px' : '12px 20px'
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 20 : 16

  return (
    <div
      onClick={!disabled && !locked ? onClick : undefined}
      onMouseDown={() => !disabled && !locked && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={e => { e.preventDefault(); !disabled && !locked && setPressed(true) }}
      onTouchEnd={e => { e.preventDefault(); setPressed(false); if (!disabled && !locked) onClick?.() }}
      style={{ width, cursor: disabled || locked ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1, transform: pressed ? 'scale(0.95) translateY(2px)' : 'scale(1)', transition: 'transform 0.08s', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
    >
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, #4a3a28 0%, #2e2216 40%, #1e180e 100%)`,
        border: `2px solid ${locked ? '#445' : color}88`,
        borderRadius: 8, padding,
        textAlign: 'center',
        boxShadow: pressed
          ? `0 1px 0 rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.5)`
          : `0 5px 0 rgba(0,0,0,0.65), 0 0 16px ${color}18, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}>
        {/* Crack lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 200 50" preserveAspectRatio="none">
          <path d="M20,10 L25,25 L18,40" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <path d="M160,5 L155,22 L162,35" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
          <path d="M80,0 L85,15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
        </svg>
        <span style={{ fontSize, fontWeight: 900, color: locked ? '#445' : color, letterSpacing: 1.5, fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", textShadow: locked ? 'none' : `0 0 14px ${color}66, 0 1px 3px rgba(0,0,0,0.9)`, position: 'relative' }}>
          {locked ? `🔒 ${label}` : label}
        </span>
      </div>
    </div>
  )
}
