import { useRef, useEffect } from 'react'
import { COLORS } from '../theme.js'

export default function Background({ mobile = false, config = {} }) {
  const blur = config.bgBlur ?? 4
  const brightness = config.bgBrightness ?? 0.85
  const overlayOpacity = config.bgOpacity ?? 0.55

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: COLORS.bg }}>
      <img
        src={mobile ? '/assets/bg_sp.webp' : '/assets/bg_pc.webp'}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center bottom',
          filter: `blur(${blur}px) saturate(0.8) brightness(${brightness})`,
          transform: 'scale(1.03)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: `rgba(2,8,23,${overlayOpacity})` }} />
      <Stars />
    </div>
  )
}

function Stars() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, t = 0
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random() * 0.75,
      r: Math.random() * 1.7 + 0.3,
      ph: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.006 + 0.002,
      h: [210, 220, 50, 45][Math.floor(Math.random() * 4)],
    }))

    const meteors = [
      { active: false, countdown: 70 },
      { active: false, countdown: 220 },
      { active: false, countdown: 400 },
    ]

    function draw() {
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const mw = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, H * 0.6)
      mw.addColorStop(0, 'rgba(30,50,120,0)')
      mw.addColorStop(0.35, 'rgba(55,70,160,0.14)')
      mw.addColorStop(0.5,  'rgba(70,85,190,0.18)')
      mw.addColorStop(0.65, 'rgba(55,70,160,0.12)')
      mw.addColorStop(1, 'rgba(25,40,100,0)')
      ctx.fillStyle = mw; ctx.fillRect(0, 0, W, H)

      stars.forEach(st => {
        const a = 0.25 + Math.sin(t * st.sp + st.ph) * 0.75
        const px = st.x * W, py = st.y * H
        const g = ctx.createRadialGradient(px, py, 0, px, py, st.r * 5)
        g.addColorStop(0, `hsla(${st.h},60%,95%,${(a * 0.6).toFixed(2)})`)
        g.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(px, py, st.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, st.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${st.h},56%,97%,${Math.min(1, a + 0.12).toFixed(2)})`; ctx.fill()
      })

      meteors.forEach(m => {
        m.countdown--
        if (m.countdown <= 0 && !m.active) {
          m.active = true; m.x = Math.random() * W * 0.5; m.y = Math.random() * H * 0.3
          m.vx = 9 + Math.random() * 8; m.vy = 3 + Math.random() * 4; m.life = 1
          m.countdown = 180 + Math.random() * 380
        }
        if (m.active) {
          m.x += m.vx; m.y += m.vy; m.life -= 0.022
          if (m.life <= 0) { m.active = false; return }
          const tail = ctx.createLinearGradient(m.x - m.vx * 10, m.y - m.vy * 10, m.x, m.y)
          tail.addColorStop(0, 'rgba(255,255,255,0)')
          tail.addColorStop(0.7, `rgba(210,230,255,${(m.life * 0.4).toFixed(2)})`)
          tail.addColorStop(1,   `rgba(255,255,255,${(m.life * 0.95).toFixed(2)})`)
          ctx.beginPath()
          ctx.moveTo(m.x - m.vx * 10, m.y - m.vy * 10)
          ctx.lineTo(m.x, m.y)
          ctx.strokeStyle = tail; ctx.lineWidth = 1.8; ctx.stroke()
        }
      })

      t++; raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
}
