import { useState, useEffect } from 'react'
import GalaxyBg    from '../components/GalaxyBg.jsx'
import GalaxyTrain from '../components/GalaxyTrain.jsx'
import WankoSVG, { MiniPiece, WANKO_TYPES } from '../components/WankoSVG.jsx'
import { useTetris, ROWS, COLS } from '../hooks/useTetris.js'
import { useConfig } from '../hooks/useConfig.js'
import logoImg  from '../assets/logo.webp'
import frameImg from '../assets/frame.webp'

export default function GameScreen({ version, onBack }) {
  const g = useTetris()
  const { config } = useConfig()

  // レイアウト計算
  const [layout, setLayout] = useState({ cell: 0, boardX: 0, boardY: 0, boardW: 0, boardH: 0, frameX: 0, frameY: 0, frameSize: 0, sideW: 0 })

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      const LOGO_H = 48, BTN_H = 145, PAD = 6
      const SIDE_W = Math.max(72, Math.floor(vw * 0.21))
      const availW = vw - SIDE_W * 2 - PAD * 2
      const availH = vh - LOGO_H - BTN_H - PAD * 2
      const frameSize = Math.min(availW, availH * 0.96)
      const innerLeft = frameSize * config.innerLeft
      const innerTop  = frameSize * config.innerTop
      const innerW    = frameSize * config.innerW
      const innerH    = frameSize * config.innerH
      const cellByW   = Math.floor(innerW / COLS)
      const cellByH   = Math.floor(innerH / ROWS)
      const cell      = Math.max(10, Math.min(cellByW, cellByH))
      const boardW    = cell * COLS
      const boardH    = cell * ROWS
      const frameX    = SIDE_W + PAD + (availW - frameSize) / 2
      const frameY    = LOGO_H + PAD + (availH - frameSize) / 2
      const boardX    = frameX + innerLeft + (innerW - boardW) / 2
      const boardY    = frameY + innerTop  + (innerH - boardH) / 2
      setLayout({ cell, boardX, boardY, boardW, boardH, frameX, frameY, frameSize, sideW: SIDE_W })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [config])

  const { cell, boardX, boardY, boardW, boardH, frameX, frameY, frameSize, sideW } = layout
  const ghostY = g.getGhost()

  const Btn = ({ onClick, color, label, flex = 1, h = 46, fs = 18 }) => (
    <div onClick={onClick}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.88)'; e.currentTarget.style.opacity = '.65' }}
      onTouchEnd={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.opacity = ''; onClick() }}
      style={{ flex, height: h, borderRadius: 11, background: 'rgba(3,8,22,.90)', border: `2.5px solid ${color}66`, color, fontSize: fs, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent', boxShadow: `0 3px 12px rgba(0,0,0,.65)`, fontFamily: 'inherit', backdropFilter: 'blur(6px)' }}>
      {label}
    </div>
  )

  const StatBox = ({ label, value, color }) => (
    <div style={{ background: 'rgba(3,9,24,.88)', border: `1.5px solid ${color}38`, borderRadius: 9, padding: '5px 7px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 'clamp(7px,1.6vw,10px)', color: `${color}88`, fontWeight: 700, letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontSize: 'clamp(14px,3.5vw,22px)', fontWeight: 900, color, lineHeight: 1.15 }}>{value}</div>
    </div>
  )

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color: '#fff', userSelect: 'none', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes trainRide{0%{transform:translateX(110vw)}100%{transform:translateX(-900px)}}
        @keyframes smoke{0%,100%{opacity:.26;transform:scale(.78) translateY(0)}50%{opacity:.6;transform:scale(1.22) translateY(-5px)}}
        @keyframes hlight{0%,100%{box-shadow:0 0 12px rgba(255,238,112,1)}50%{box-shadow:0 0 20px rgba(255,246,152,1)}}
        @keyframes wblink{0%,100%{opacity:.66}50%{opacity:1}}
        @keyframes msgUp{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-70px) scale(1.1)}}
        @keyframes bshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
        @keyframes cpop{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      `}</style>

      <GalaxyBg />
      <GalaxyTrain bottom={145} />

      {/* 枠 */}
      {frameSize > 0 && <img src={frameImg} alt="" style={{ position: 'fixed', left: frameX, top: frameY, width: frameSize, height: frameSize, zIndex: 2, pointerEvents: 'none', objectFit: 'contain' }} />}

      {/* グリッド背景 */}
      {cell > 0 && <div style={{ position: 'fixed', left: boardX, top: boardY, width: boardW, height: boardH, zIndex: 3, pointerEvents: 'none', background: 'rgba(2,6,20,0.88)', backgroundImage: `linear-gradient(rgba(20,50,110,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(20,50,110,.45) 1px,transparent 1px)`, backgroundSize: `${cell}px ${cell}px` }} />}

      {/* ブロック */}
      {cell > 0 && (
        <div style={{ position: 'fixed', left: boardX, top: boardY, width: boardW, height: boardH, zIndex: 4, overflow: 'hidden', animation: g.shake ? 'bshake .28s' : 'none' }}>
          {/* ゴースト */}
          {g.started && !g.over && g.piece.shape.map((row, r) => row.map((v, c) => {
            if (!v) return null
            const nr = ghostY + r, nc = g.piece.x + c
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
            return <div key={`g${r}-${c}`} style={{ position: 'absolute', top: nr * cell, left: nc * cell, width: cell, height: cell, opacity: .18, border: '1px dashed rgba(0,255,100,.4)', boxSizing: 'border-box' }}><WankoSVG type={g.piece.type} size={cell} /></div>
          }))}
          {/* 固定ブロック */}
          {g.board.map((row, r) => row.map((val, c) => {
            if (val === null) return null
            return <div key={`b${r}-${c}`} style={{ position: 'absolute', top: r * cell, left: c * cell, width: cell, height: cell, border: '1.5px solid rgba(200,160,60,.55)', boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 0 3px rgba(200,160,60,.2)' }}><WankoSVG type={val} size={cell} /></div>
          }))}
          {/* アクティブ */}
          {g.started && !g.over && g.piece.shape.map((row, r) => row.map((v, c) => {
            if (!v) return null
            const nr = g.piece.y + r, nc = g.piece.x + c
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
            return <div key={`p${r}-${c}`} style={{ position: 'absolute', top: nr * cell, left: nc * cell, width: cell, height: cell, border: '1.5px solid rgba(240,200,80,.9)', boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 0 10px rgba(240,200,80,.5),inset 0 1px 0 rgba(255,255,255,.2)' }}><WankoSVG type={g.piece.type} size={cell} /></div>
          }))}
        </div>
      )}

      {/* UI層 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 6, display: 'flex', flexDirection: 'column', pointerEvents: 'none' }}>
        {/* ロゴ行 */}
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', pointerEvents: 'auto' }}>
          <img src={logoImg} alt="イワテトリス" style={{ height: 36, width: 'auto', maxWidth: '52vw', objectFit: 'contain', objectPosition: 'left', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.9))', animation: 'logoF 3s ease-in-out infinite' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <div onClick={onBack} style={{ height: 32, padding: '0 10px', borderRadius: 7, background: 'rgba(4,10,28,.88)', border: '1.5px solid rgba(120,160,255,.4)', display: 'flex', alignItems: 'center', fontSize: 12, cursor: 'pointer', color: '#889aaa' }}>← 戻る</div>
            {g.started && !g.over && <div onClick={() => g.setPaused(v => !v)} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(4,10,28,.88)', border: '1.5px solid rgba(120,160,255,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', color: '#889aaa' }}>{g.paused ? '▶' : '⏸'}</div>}
          </div>
        </div>

        {/* コンテンツ行 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', minHeight: 0 }}>
          {/* 左：ステータス */}
          {sideW > 0 && (
            <div style={{ width: sideW, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 5, padding: '5px 5px 5px 8px' }}>
              <StatBox label="スコア" value={g.score.toLocaleString()} color="#ffee66" />
              <StatBox label="レベル" value={g.level} color="#66eeff" />
              <StatBox label="ライン" value={g.lines} color="#88ffaa" />
              {g.combo > 1 && (
                <div style={{ background: 'linear-gradient(135deg,rgba(255,80,0,.9),rgba(196,0,80,.88))', borderRadius: 9, padding: '5px 7px', textAlign: 'center', animation: 'cpop .45s infinite', boxShadow: '0 0 18px rgba(255,60,0,.5)' }}>
                  <div style={{ fontSize: 'clamp(7px,1.6vw,9px)', color: 'rgba(255,200,150,.9)', fontWeight: 700 }}>コンボ</div>
                  <div style={{ fontSize: 'clamp(16px,4vw,24px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{g.combo}</div>
                </div>
              )}
            </div>
          )}
          <div style={{ flex: 1 }} />
          {/* 右：NEXT */}
          {sideW > 0 && (
            <div style={{ width: sideW, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, padding: '5px 8px 5px 4px' }}>
              <div style={{ fontSize: 'clamp(7px,1.6vw,9px)', color: 'rgba(255,170,85,.85)', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>次の冷麺</div>
              {g.queue.slice(0, 5).map((q, i) => {
                const nc = Math.max(9, Math.floor(sideW * .28))
                return (
                  <div key={i} style={{ background: 'rgba(4,12,30,.88)', border: '1px solid rgba(200,160,60,.35)', borderRadius: 7, padding: '3px 4px' }}>
                    <div style={{ fontSize: 'clamp(6px,1.4vw,8px)', color: 'rgba(255,200,100,.8)', fontWeight: 700, marginBottom: 2 }}>{WANKO_TYPES[q.type].name}</div>
                    <MiniPiece shape={q.shape} type={q.type} cell={nc} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ボタン */}
        <div style={{ flexShrink: 0, height: 145, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 10px', background: 'rgba(0,2,12,.94)', borderTop: '1px solid rgba(48,88,178,.25)', backdropFilter: 'blur(14px)', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', gap: 7 }}>
            <Btn onClick={() => g.rotatePiece()} color="#55bbff" label="↑ 回転" flex={1.4} h={50} fs={16} />
            <Btn onClick={() => g.hardDrop()}    color="#ff9955" label="DROP"   flex={1}   h={50} fs={16} />
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <Btn onClick={() => g.moveLeft()}  color="#44ffcc" label="◀" flex={1.2} h={55} fs={26} />
            <Btn onClick={() => g.drop()}      color="#6688ff" label="↓" flex={1}   h={55} fs={26} />
            <Btn onClick={() => g.moveRight()} color="#44ffcc" label="▶" flex={1.2} h={55} fs={26} />
          </div>
        </div>
      </div>

      {/* メッセージ */}
      {g.msg && <div style={{ position: 'fixed', top: '40%', left: '50%', zIndex: 10, fontSize: 'clamp(16px,4vw,24px)', fontWeight: 900, color: '#ffee44', textShadow: '0 0 18px #ff8800,0 2px 5px rgba(0,0,0,.95)', animation: 'msgUp 1.5s forwards', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{g.msg}</div>}

      {/* スタート */}
      {!g.started && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,2,12,.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <img src={logoImg} alt="" style={{ height: 'clamp(52px,13vw,80px)', width: 'auto', maxWidth: '80vw', objectFit: 'contain', filter: 'drop-shadow(0 3px 16px rgba(0,0,0,.95))', animation: 'logoF 3s ease-in-out infinite' }} />
          <div style={{ fontSize: 'clamp(10px,2.5vw,14px)', color: '#00ffaa', textAlign: 'center', lineHeight: 2.1 }}>盛岡のわんこそばを積み上げろ！</div>
          <div onClick={g.reset} style={{ background: 'linear-gradient(135deg,#ff9900,#ff4400)', color: '#fff', padding: 'clamp(12px,2.5vw,18px) clamp(40px,9vw,68px)', letterSpacing: 2, cursor: 'pointer', fontSize: 'clamp(17px,4.2vw,24px)', fontWeight: 900, borderRadius: 15, boxShadow: '0 4px 32px rgba(255,100,0,.68)' }}>スタート！</div>
          <div style={{ fontSize: 'clamp(8px,1.8vw,10px)', color: '#334', textAlign: 'center', lineHeight: 2 }}>←→ 移動　↑ 回転　↓ 落下　SPACE DROP</div>
        </div>
      )}

      {/* ゲームオーバー */}
      {g.over && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,2,12,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 'clamp(18px,4.5vw,30px)', color: '#ff4466', fontWeight: 900 }}>わんこがあふれた！</div>
          <div style={{ fontSize: 'clamp(14px,3.5vw,22px)', color: '#eee' }}>スコア <span style={{ color: '#ffee44', fontWeight: 900, fontSize: '1.4em' }}>{g.score.toLocaleString()}</span></div>
          <div style={{ fontSize: 'clamp(10px,2.2vw,14px)', color: '#778' }}>Lv.{g.level} / {g.lines}ライン</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <div onClick={g.reset} style={{ background: 'linear-gradient(135deg,#cc2244,#880022)', color: '#fff', padding: '10px 28px', fontSize: 'clamp(14px,3.5vw,18px)', fontWeight: 700, borderRadius: 12, cursor: 'pointer' }}>もう一杯！🍜</div>
            <div onClick={onBack} style={{ background: 'rgba(8,18,50,.9)', color: '#aac', padding: '10px 20px', fontSize: 'clamp(13px,3vw,16px)', fontWeight: 700, borderRadius: 12, cursor: 'pointer', border: '1px solid rgba(60,90,160,.4)' }}>タイトルへ</div>
          </div>
        </div>
      )}

      {/* ポーズ */}
      {g.paused && !g.over && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(0,2,12,.90)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 'clamp(22px,5.5vw,36px)', color: '#ffdd44', fontWeight: 900, letterSpacing: 4 }}>⏸ 休憩中</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div onClick={() => g.setPaused(false)} style={{ background: 'linear-gradient(135deg,#228844,#116633)', color: '#fff', padding: '10px 28px', fontSize: 'clamp(13px,3.2vw,18px)', fontWeight: 700, borderRadius: 11, cursor: 'pointer' }}>▶ 再開</div>
            <div onClick={onBack} style={{ background: 'rgba(8,18,50,.9)', color: '#aac', padding: '10px 20px', fontSize: 'clamp(13px,3vw,16px)', borderRadius: 11, cursor: 'pointer', border: '1px solid rgba(60,90,160,.4)' }}>タイトルへ</div>
          </div>
        </div>
      )}
    </div>
  )
}
