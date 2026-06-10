import { useState, useEffect } from 'react'
import WankoSVG, { MiniPiece, WANKO_TYPES } from '../components/WankoSVG.jsx'
import { useTetris, ROWS, COLS } from '../hooks/useTetris.js'
import { useConfig } from '../hooks/useConfig.js'

export default function GameScreen({ version, onBack }) {
  const g = useTetris()
  const { config } = useConfig()
  const isMobile = window.innerWidth < 768

  const [layout, setLayout] = useState({ cell: 0, boardX: 0, boardY: 0, boardW: 0, boardH: 0, frameX: 0, frameY: 0, frameSize: 0, sideW: 0 })

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      const LOGO_H = 48, BTN_H = 145, PAD = 6
      const SIDE_W = Math.max(72, Math.floor(vw * 0.20))
      const availW = vw - SIDE_W * 2 - PAD * 2
      const availH = vh - LOGO_H - BTN_H - PAD * 2
      const frameSize = Math.min(availW, availH * 0.96)
      const iL = frameSize * config.innerLeft
      const iT = frameSize * config.innerTop
      const iW = frameSize * config.innerW
      const iH = frameSize * config.innerH
      const cell = Math.max(10, Math.min(Math.floor(iW / COLS), Math.floor(iH / ROWS)))
      const boardW = cell * COLS, boardH = cell * ROWS
      const frameX = SIDE_W + PAD + (availW - frameSize) / 2
      const frameY = LOGO_H + PAD + (availH - frameSize) / 2
      const boardX = frameX + iL + (iW - boardW) / 2
      const boardY = frameY + iT + (iH - boardH) / 2
      setLayout({ cell, boardX, boardY, boardW, boardH, frameX, frameY, frameSize, sideW: SIDE_W })
    }
    calc(); window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [config])

  const { cell, boardX, boardY, boardW, boardH, frameX, frameY, frameSize, sideW } = layout
  const ghostY = g.getGhost()

  const Btn = ({ onClick, color, label, flex = 1, h = 46, fs = 18 }) => (
    <div onClick={onClick}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.88)'; e.currentTarget.style.opacity = '.65' }}
      onTouchEnd={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.opacity = ''; onClick() }}
      style={{ flex, height: h, borderRadius: 10, background: 'rgba(5,15,45,.92)', border: `2px solid ${color}66`, color, fontSize: fs, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 10px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.08)`, fontFamily: 'inherit', backdropFilter: 'blur(6px)' }}>
      {label}
    </div>
  )

  const StatBox = ({ label, value, color, sub }) => (
    <div style={{ background: 'rgba(5,15,45,.88)', border: `1px solid ${color}30`, borderLeft: `2.5px solid ${color}`, borderRadius: 8, padding: '5px 8px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 'clamp(7px,1.5vw,9px)', color: `${color}88`, fontWeight: 700, letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontSize: 'clamp(14px,3.5vw,22px)', fontWeight: 900, color, lineHeight: 1.15 }}>
        {value}{sub && <span style={{ fontSize: 'clamp(9px,1.8vw,11px)', color: '#446', fontWeight: 400 }}>{sub}</span>}
      </div>
    </div>
  )

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color: '#fff', userSelect: 'none', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes msgUp{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-70px) scale(1.1)}}
        @keyframes bshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        @keyframes cpop{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
        @keyframes twinkle{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.4)}}
        @keyframes shoot{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(400px) translateY(200px);opacity:0}}
      `}</style>

      {/* 背景 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(/assets/${isMobile ? 'bg_sp' : 'bg_pc'}.webp)`, backgroundSize: 'cover', backgroundPosition: 'center bottom' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(0,5,20,0.5)' }} />

      {/* 星 */}
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{ position: 'fixed', zIndex: 1, pointerEvents: 'none', left: `${Math.random() * 100}%`, top: `${Math.random() * 80}%`, width: Math.random() * 2 + 0.5, height: Math.random() * 2 + 0.5, borderRadius: '50%', background: '#fff', animation: `twinkle ${2 + Math.random() * 4}s ${Math.random() * 5}s infinite`, opacity: 0.3 }} />
      ))}

      {/* 枠 */}
      {frameSize > 0 && <img src="/assets/frame.webp" alt="" style={{ position: 'fixed', left: frameX, top: frameY, width: frameSize, height: frameSize, zIndex: 2, pointerEvents: 'none', objectFit: 'contain' }} />}

      {/* グリッド背景 */}
      {cell > 0 && <div style={{ position: 'fixed', left: boardX, top: boardY, width: boardW, height: boardH, zIndex: 3, pointerEvents: 'none', background: 'rgba(2,6,20,0.86)', backgroundImage: `linear-gradient(rgba(20,50,120,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(20,50,120,.4) 1px,transparent 1px)`, backgroundSize: `${cell}px ${cell}px` }} />}

      {/* ブロック */}
      {cell > 0 && (
        <div style={{ position: 'fixed', left: boardX, top: boardY, width: boardW, height: boardH, zIndex: 4, overflow: 'hidden', animation: g.shake ? 'bshake .28s' : 'none' }}>
          {g.started && !g.over && g.piece.shape.map((row, r) => row.map((v, c) => {
            if (!v) return null
            const nr = ghostY + r, nc = g.piece.x + c
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
            return <div key={`g${r}-${c}`} style={{ position: 'absolute', top: nr * cell, left: nc * cell, width: cell, height: cell, opacity: .15, border: '1px dashed rgba(245,200,66,.4)', boxSizing: 'border-box' }}><WankoSVG type={g.piece.type} size={cell} /></div>
          }))}
          {g.board.map((row, r) => row.map((val, c) => {
            if (val === null) return null
            return <div key={`b${r}-${c}`} style={{ position: 'absolute', top: r * cell, left: c * cell, width: cell, height: cell, border: '1.5px solid rgba(200,160,60,.5)', boxSizing: 'border-box', overflow: 'hidden' }}><WankoSVG type={val} size={cell} /></div>
          }))}
          {g.started && !g.over && g.piece.shape.map((row, r) => row.map((v, c) => {
            if (!v) return null
            const nr = g.piece.y + r, nc = g.piece.x + c
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
            return <div key={`p${r}-${c}`} style={{ position: 'absolute', top: nr * cell, left: nc * cell, width: cell, height: cell, border: '1.5px solid rgba(245,200,66,.9)', boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 0 8px rgba(245,200,66,.4)' }}><WankoSVG type={g.piece.type} size={cell} /></div>
          }))}
        </div>
      )}

      {/* UI層 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 6, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        {/* ロゴ行 */}
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', pointerEvents: 'auto' }}>
          <img src="/assets/logo.webp" alt="イワテトリス" style={{ height: 34, width: 'auto', maxWidth: '50vw', objectFit: 'contain', objectPosition: 'left', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.9))', animation: 'logoF 3s ease-in-out infinite' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div onClick={onBack} style={{ height: 30, padding: '0 10px', borderRadius: 7, background: 'rgba(5,15,45,.88)', border: '1px solid rgba(100,140,220,.4)', display: 'flex', alignItems: 'center', fontSize: 11, cursor: 'pointer', color: '#7eb8f7', backdropFilter: 'blur(6px)' }}>← 戻る</div>
            {g.started && !g.over && <div onClick={() => g.setPaused(v => !v)} style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(5,15,45,.88)', border: '1px solid rgba(100,140,220,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer', color: '#7eb8f7' }}>{g.paused ? '▶' : '⏸'}</div>}
          </div>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', minHeight: 0 }}>
          {/* 左：HOLD＋ステータス */}
          {sideW > 0 && (
            <div style={{ width: sideW, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 5, padding: '5px 4px 5px 8px' }}>
              {/* HOLD */}
              <div style={{ background: 'rgba(5,15,45,.88)', border: '1px solid rgba(100,140,220,.3)', borderLeft: '2.5px solid #7eb8f7', borderRadius: 8, padding: '5px 7px', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 'clamp(7px,1.5vw,9px)', color: '#7eb8f788', fontWeight: 700, letterSpacing: 1.5, marginBottom: 3 }}>🧊 HOLD</div>
                {g.hold ? (
                  <MiniPiece shape={g.hold.shape} type={g.hold.type} cell={Math.max(10, Math.floor(sideW * .26))} />
                ) : (
                  <div style={{ height: 24, display: 'flex', alignItems: 'center', fontSize: 10, color: '#335', opacity: .5 }}>空</div>
                )}
              </div>
              <StatBox label="スコア" value={g.score.toLocaleString()} color="#f5c842" />
              <StatBox label="レベル" value={g.level} color="#7eb8f7" />
              <StatBox label="ライン" value={g.lines} color="#88ffaa" sub="/40" />
              {g.combo > 1 && (
                <div style={{ background: 'linear-gradient(135deg,rgba(220,60,0,.9),rgba(160,0,60,.88))', borderRadius: 8, padding: '5px 7px', textAlign: 'center', animation: 'cpop .45s infinite', border: '1px solid rgba(255,100,50,.3)' }}>
                  <div style={{ fontSize: 'clamp(7px,1.5vw,9px)', color: 'rgba(255,200,150,.9)', fontWeight: 700 }}>コンボ</div>
                  <div style={{ fontSize: 'clamp(16px,4vw,24px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{g.combo}</div>
                </div>
              )}
            </div>
          )}

          <div style={{ flex: 1 }} />

          {/* 右：NEXT */}
          {sideW > 0 && (
            <div style={{ width: sideW, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, padding: '5px 8px 5px 4px' }}>
              <div style={{ fontSize: 'clamp(7px,1.5vw,9px)', color: 'rgba(245,200,66,.8)', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>次の冷麺</div>
              {g.queue.slice(0, 5).map((q, i) => {
                const nc = Math.max(9, Math.floor(sideW * .27))
                return (
                  <div key={i} style={{ background: 'rgba(5,15,45,.88)', border: '1px solid rgba(245,200,66,.25)', borderRadius: 7, padding: '3px 5px', backdropFilter: 'blur(6px)' }}>
                    <div style={{ fontSize: 'clamp(6px,1.3vw,8px)', color: 'rgba(245,200,66,.75)', fontWeight: 700, marginBottom: 2 }}>{WANKO_TYPES[q.type].name}</div>
                    <MiniPiece shape={q.shape} type={q.type} cell={nc} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ボタン */}
        <div style={{ flexShrink: 0, height: 145, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 10px', background: 'rgba(0,5,20,.94)', borderTop: '1px solid rgba(80,120,200,.25)', backdropFilter: 'blur(14px)', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', gap: 7 }}>
            <Btn onClick={() => g.doHold()}      color="#7eb8f7" label="HOLD"   flex={1}   h={46} fs={13} />
            <Btn onClick={() => g.rotatePiece()} color="#f5c842" label="↑ 回転" flex={1.4} h={46} fs={14} />
            <Btn onClick={() => g.hardDrop()}    color="#ff9955" label="DROP"   flex={1}   h={46} fs={13} />
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <Btn onClick={() => g.moveLeft()}  color="#a8d8e8" label="◀" flex={1.2} h={52} fs={24} />
            <Btn onClick={() => g.drop()}      color="#7eb8f7" label="↓" flex={1}   h={52} fs={24} />
            <Btn onClick={() => g.moveRight()} color="#a8d8e8" label="▶" flex={1.2} h={52} fs={24} />
          </div>
        </div>
      </div>

      {/* メッセージ */}
      {g.msg && <div style={{ position: 'fixed', top: '40%', left: '50%', zIndex: 10, fontSize: 'clamp(16px,4vw,24px)', fontWeight: 900, color: '#f5c842', textShadow: '0 0 18px #f5c84288,0 2px 5px rgba(0,0,0,.95)', animation: 'msgUp 1.5s forwards', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{g.msg}</div>}

      {/* スタート */}
      {!g.started && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,5,20,.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <img src="/assets/logo.webp" alt="" style={{ height: 'clamp(52px,13vw,80px)', width: 'auto', maxWidth: '80vw', objectFit: 'contain', filter: 'drop-shadow(0 3px 16px rgba(0,0,0,.95))', animation: 'logoF 3s ease-in-out infinite' }} />
          <div style={{ fontSize: 'clamp(10px,2.5vw,14px)', color: '#f5c842', textAlign: 'center', lineHeight: 2.1, fontWeight: 700 }}>盛岡のわんこそばを積み上げろ！</div>
          <div onClick={g.reset} style={{ background: 'linear-gradient(135deg,#c8a020,#8a6a00)', color: '#fff', padding: 'clamp(12px,2.5vw,18px) clamp(40px,9vw,68px)', letterSpacing: 2, cursor: 'pointer', fontSize: 'clamp(17px,4.2vw,24px)', fontWeight: 900, borderRadius: 14, boxShadow: '0 4px 28px rgba(200,160,0,.5)', border: '1px solid rgba(255,220,100,.3)' }}>スタート！</div>
          <div style={{ fontSize: 'clamp(8px,1.8vw,10px)', color: '#335', textAlign: 'center', lineHeight: 2 }}>←→ 移動　↑ 回転　↓ 落下　SPACE DROP　C HOLD</div>
        </div>
      )}

      {/* ゲームオーバー */}
      {g.over && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,5,20,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 'clamp(18px,4.5vw,30px)', color: '#e88', fontWeight: 900, textShadow: '0 0 24px rgba(220,80,80,.6)' }}>わんこがあふれた！</div>
          <div style={{ fontSize: 'clamp(14px,3.5vw,22px)', color: '#eee' }}>スコア <span style={{ color: '#f5c842', fontWeight: 900, fontSize: '1.4em' }}>{g.score.toLocaleString()}</span></div>
          <div style={{ fontSize: 'clamp(10px,2.2vw,14px)', color: '#446' }}>Lv.{g.level} / {g.lines}ライン</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div onClick={g.reset} style={{ background: 'linear-gradient(135deg,#aa2040,#660020)', color: '#fff', padding: '10px 28px', fontSize: 'clamp(14px,3.5vw,18px)', fontWeight: 700, borderRadius: 12, cursor: 'pointer' }}>もう一杯！🍜</div>
            <div onClick={onBack} style={{ background: 'rgba(5,15,45,.9)', color: '#7eb8f7', padding: '10px 20px', fontSize: 'clamp(13px,3vw,16px)', borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(80,120,200,.4)' }}>タイトルへ</div>
          </div>
        </div>
      )}

      {/* ポーズ */}
      {g.paused && !g.over && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,5,20,.90)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ fontSize: 'clamp(22px,5.5vw,36px)', color: '#f5c842', fontWeight: 900, letterSpacing: 4 }}>⏸ 休憩中</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div onClick={() => g.setPaused(false)} style={{ background: 'linear-gradient(135deg,#1a6640,#0d3320)', color: '#fff', padding: '10px 28px', fontSize: 'clamp(13px,3.2vw,18px)', fontWeight: 700, borderRadius: 11, cursor: 'pointer' }}>▶ 再開</div>
            <div onClick={onBack} style={{ background: 'rgba(5,15,45,.9)', color: '#7eb8f7', padding: '10px 20px', fontSize: 'clamp(13px,3vw,16px)', borderRadius: 11, cursor: 'pointer', border: '1px solid rgba(80,120,200,.4)' }}>タイトルへ</div>
          </div>
        </div>
      )}
    </div>
  )
}
