import { useEffect, useRef } from 'react'

export default function GalaxyBg() {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext('2d'); let t = 0, raf
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)

    const stars = [...Array(200)].map(() => ({
      x: Math.random(), y: Math.random() * .88,
      r: Math.random() * 1.5 + .2,
      ph: Math.random() * Math.PI * 2,
      sp: Math.random() * .006 + .002,
      h: [210, 50, 30, 270][Math.floor(Math.random() * 4)],
    }))
    const meteors = [{ a: false, t: 80 }, { a: false, t: 230 }, { a: false, t: 420 }]

    function draw() {
      const W = cv.width, H = cv.height
      ctx.clearRect(0, 0, W, H)

      // 背景グラデーション
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#000206'); bg.addColorStop(.4, '#000510'); bg.addColorStop(1, '#010510')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      // 天の川
      const mw = ctx.createLinearGradient(W * .05, H * .02, W * .88, H * .68)
      mw.addColorStop(0, 'rgba(35,28,95,0)'); mw.addColorStop(.3, 'rgba(70,55,165,.15)')
      mw.addColorStop(.5, 'rgba(88,75,202,.2)'); mw.addColorStop(.7, 'rgba(58,70,168,.12)'); mw.addColorStop(1, 'rgba(28,38,118,0)')
      ctx.fillStyle = mw; ctx.fillRect(0, 0, W, H)

      // 天の川の細かい星
      for (let i = 0; i < 120; i++) {
        ctx.beginPath(); ctx.arc((i * .01618 % 1) * W, (i * .00618 % 0.62 + .06) * H, .5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(195,212,255,${.05 + Math.sin(t * .022 + i) * .038})`; ctx.fill()
      }

      // 星
      stars.forEach(st => {
        const a = .2 + Math.sin(t * st.sp + st.ph) * .8, px = st.x * W, py = st.y * H
        const g = ctx.createRadialGradient(px, py, 0, px, py, st.r * 5)
        g.addColorStop(0, `hsla(${st.h},62%,94%,${(a * .5).toFixed(2)})`); g.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(px, py, st.r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, st.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${st.h},56%,97%,${Math.min(1, a + .1).toFixed(2)})`; ctx.fill()
        if (st.r > 1.1 && a > .72) {
          ctx.strokeStyle = `hsla(${st.h},56%,97%,${(a * .3).toFixed(2)})`; ctx.lineWidth = .5
          const sp = st.r * 7
          ctx.beginPath(); ctx.moveTo(px - sp, py); ctx.lineTo(px + sp, py); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(px, py - sp); ctx.lineTo(px, py + sp); ctx.stroke()
        }
      })

      // 流れ星
      meteors.forEach(m => {
        m.t--
        if (m.t <= 0 && !m.a) { m.a = true; m.x = Math.random() * W * .42; m.y = Math.random() * H * .28; m.vx = 9 + Math.random() * 7; m.vy = 3 + Math.random() * 3.5; m.l = 1; m.t = 200 + Math.random() * 350 }
        if (m.a) {
          m.x += m.vx; m.y += m.vy; m.l -= .022; if (m.l <= 0) { m.a = false; return }
          const tail = ctx.createLinearGradient(m.x - m.vx * 10, m.y - m.vy * 10, m.x, m.y)
          tail.addColorStop(0, 'rgba(255,255,255,0)'); tail.addColorStop(.7, `rgba(210,235,255,${(m.l * .32).toFixed(2)})`); tail.addColorStop(1, `rgba(255,255,255,${(m.l * .88).toFixed(2)})`)
          ctx.beginPath(); ctx.moveTo(m.x - m.vx * 10, m.y - m.vy * 10); ctx.lineTo(m.x, m.y)
          ctx.strokeStyle = tail; ctx.lineWidth = 1.8; ctx.stroke()
        }
      })

      // 岩手山
      const mY = H * .78
      ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, mY); ctx.lineTo(W * .2, mY); ctx.lineTo(W * .34, mY * .56); ctx.lineTo(W * .5, mY * .1); ctx.lineTo(W * .66, mY * .56); ctx.lineTo(W * .77, mY); ctx.lineTo(W * .81, mY); ctx.lineTo(W * .88, mY * .7); ctx.lineTo(W * .95, mY); ctx.lineTo(W, mY); ctx.lineTo(W, H); ctx.closePath()
      const mtG = ctx.createLinearGradient(0, mY * .1, 0, mY); mtG.addColorStop(0, 'rgba(3,9,26,.97)'); mtG.addColorStop(1, 'rgba(1,5,15,.99)')
      ctx.fillStyle = mtG; ctx.fill()
      ctx.beginPath(); ctx.moveTo(W * .468, mY * .1); ctx.lineTo(W * .5, mY * .055); ctx.lineTo(W * .532, mY * .1); ctx.lineTo(W * .512, mY * .175); ctx.lineTo(W * .488, mY * .175); ctx.closePath()
      ctx.fillStyle = 'rgba(210,228,255,.18)'; ctx.fill()

      // 街の灯り
      const cy = mY + 1;
      [...Array(18)].forEach((_, i) => {
        const lx = W * (.05 + i * .052), fl = .42 + Math.sin(t * .088 + i * 2.05) * .32
        const col = ['255,196,92', '255,154,65', '185,210,255', '255,210,102', '165,190,255'][i % 5]
        const rg = ctx.createRadialGradient(lx, cy, 0, lx, cy, 11 + i % 3 * 3)
        rg.addColorStop(0, `rgba(${col},${(.4 + fl * .28).toFixed(2)})`); rg.addColorStop(1, `rgba(${col},0)`)
        ctx.beginPath(); ctx.arc(lx, cy, 11 + i % 3 * 3, 0, Math.PI * 2); ctx.fillStyle = rg; ctx.fill()
        ctx.beginPath(); ctx.arc(lx, cy, 1.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(${col},.8)`; ctx.fill()
      })

      // 北上川
      const rv = mY + 3
      const rvG = ctx.createLinearGradient(0, rv, 0, rv + 14); rvG.addColorStop(0, `rgba(45,85,172,${.18 + Math.sin(t * .038) * .05})`); rvG.addColorStop(1, 'rgba(15,35,75,0)')
      ctx.fillStyle = rvG; ctx.fillRect(0, rv, W, 14)

      // レール
      const railY = H - 148
      ctx.fillStyle = 'rgba(120,185,255,0.5)'; ctx.fillRect(0, railY, W, 2.5)
      ctx.fillStyle = 'rgba(80,140,220,0.25)'; ctx.fillRect(0, railY + 4, W, 1.5)

      t++; raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}
