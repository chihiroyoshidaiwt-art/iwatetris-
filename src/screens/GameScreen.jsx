import { useState, useEffect } from 'react'
import Background          from '../components/Background.jsx'
import { WankoBlock, MiniPiece } from '../components/WankoBlock.jsx'
import StoneBtn            from '../components/StoneBtn.jsx'
import { useTetris, COLS, ROWS, SHAPES, SHAPE_KEYS } from '../hooks/useTetris.js'
import { useConfig }       from '../hooks/useConfig.js'

const VERSIONS = {
  fujiwara:   { name:'藤原清衡',   color:'#c8a020', emoji:'👑' },
  yoshitsune: { name:'源義経',     color:'#4080c0', emoji:'⚔️' },
  hara:       { name:'原敬',       color:'#208040', emoji:'🏛️' },
  nitobe:     { name:'新渡戸稲造', color:'#8040c0', emoji:'📚' },
  kenji:      { name:'宮沢賢治',   color:'#2060c0', emoji:'🌌' },
  takuboku:   { name:'石川啄木',   color:'#804020', emoji:'📝' },
  yokosawa:   { name:'横沢たかひろ',color:'#c04080', emoji:'😄' },
}

export default function GameScreen({ version, onBack }) {
  const ver = VERSIONS[version] || VERSIONS.kenji
  const g   = useTetris()
  const { config } = useConfig()
  const isMobile = window.innerWidth < 768

  // Layout calculation
  const [layout, setLayout] = useState({ cell:0, boardX:0, boardY:0, boardW:0, boardH:0, frameX:0, frameY:0, frameW:0, frameH:0, sideW:0 })

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth, vh = window.innerHeight
      const TOP_H   = 48
      const BOT_H   = isMobile ? 148 : 60
      const CHAR_H  = 52
      const SIDE_W  = Math.max(80, Math.floor(vw * 0.185))
      const PAD     = 8

      const availW  = vw - SIDE_W * 2 - PAD * 2
      const availH  = vh - TOP_H - BOT_H - CHAR_H - PAD * 2

      // Frame is square (512x512 original)
      const frameSize = Math.min(availW, availH * 0.98)

      // Grid inside frame (based on admin config)
      const iL = frameSize * (config.innerLeft || 0.28)
      const iT = frameSize * (config.innerTop  || 0.10)
      const iW = frameSize * (config.innerW    || 0.44)
      const iH = frameSize * (config.innerH    || 0.72)

      const cellByW = Math.floor(iW / COLS)
      const cellByH = Math.floor(iH / ROWS)
      const cell    = Math.max(10, Math.min(cellByW, cellByH))
      const boardW  = cell * COLS
      const boardH  = cell * ROWS

      const frameX  = SIDE_W + PAD + (availW - frameSize) / 2
      const frameY  = TOP_H  + PAD + (availH - frameSize) / 2
      const boardX  = frameX + iL + (iW - boardW) / 2
      const boardY  = frameY + iT + (iH - boardH) / 2

      setLayout({ cell, boardX, boardY, boardW, boardH, frameX, frameY, frameW:frameSize, frameH:frameSize, sideW:SIDE_W })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [config, isMobile])

  const { cell, boardX, boardY, boardW, boardH, frameX, frameY, frameW, frameH, sideW } = layout
  const ghostY = g.getGhost()

  // Game button
  const GBtn = ({ label, onClick, color='#c8a060', flex=1, fs=22 }) => (
    <div
      onClick={onClick}
      onTouchStart={e => { e.currentTarget.style.opacity='0.55'; e.currentTarget.style.transform='scale(0.9)' }}
      onTouchEnd={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform=''; onClick() }}
      style={{ flex, height:isMobile?54:48, borderRadius:10, background:'linear-gradient(160deg,#2e2414,#1a1008)', border:`2px solid ${color}55`, color, fontSize:fs, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', WebkitTapHighlightColor:'transparent', boxShadow:`0 4px 0 rgba(0,0,0,0.7),0 0 12px ${color}18`, fontFamily:'inherit' }}>
      {label}
    </div>
  )

  const StatBox = ({ label, value, color, sub }) => (
    <div style={{ background:'rgba(5,10,35,0.9)', border:`1px solid ${color}30`, borderLeft:`3px solid ${color}`, borderRadius:8, padding:'6px 8px', backdropFilter:'blur(8px)' }}>
      <div style={{ fontSize:'clamp(7px,1.4vw,9px)', color:`${color}88`, fontWeight:700, letterSpacing:1.5 }}>{label}</div>
      <div style={{ fontSize:'clamp(16px,3.5vw,24px)', fontWeight:900, color, lineHeight:1.1 }}>
        {value}{sub && <span style={{ fontSize:'clamp(9px,1.6vw,11px)', color:'#446', fontWeight:400 }}>{sub}</span>}
      </div>
    </div>
  )

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none', paddingTop:'env(safe-area-inset-top)', paddingBottom:'env(safe-area-inset-bottom)' }}>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes comboAppear{0%{opacity:0;transform:translateX(-50%) scale(0.5)}15%{opacity:1;transform:translateX(-50%) scale(1.15)}30%{transform:translateX(-50%) scale(1)}70%{opacity:1}100%{opacity:0;transform:translateX(-50%) scale(0.9) translateY(-28px)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      `}</style>

      <Background mobile={isMobile} />

      {/* Iwate Frame */}
      {frameW > 0 && (
        <img src="/assets/frame.webp" alt="" style={{ position:'fixed', left:frameX, top:frameY, width:frameW, height:frameH, zIndex:2, pointerEvents:'none', objectFit:'contain' }} />
      )}

      {/* Grid background */}
      {cell > 0 && (
        <div style={{ position:'fixed', left:boardX, top:boardY, width:boardW, height:boardH, zIndex:3, pointerEvents:'none', background:'rgba(1,4,18,0.9)', backgroundImage:`linear-gradient(rgba(30,60,140,.38) 1px,transparent 1px),linear-gradient(90deg,rgba(30,60,140,.38) 1px,transparent 1px)`, backgroundSize:`${cell}px ${cell}px` }} />
      )}

      {/* Blocks */}
      {cell > 0 && (
        <div style={{ position:'fixed', left:boardX, top:boardY, width:boardW, height:boardH, zIndex:4, overflow:'hidden', animation: g.lineFlash ? 'shake .28s' : 'none' }}>
          {/* Ghost */}
          {g.started && !g.over && g.piece.cells.map((row,r) => row.map((v,c) => {
            if (!v) return null
            const nr = ghostY + r, nc = g.piece.x + c
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
            return <div key={`gh${r}-${c}`} style={{ position:'absolute', top:nr*cell, left:nc*cell, width:cell, height:cell, border:`2px dashed ${g.piece.color}38`, boxSizing:'border-box' }} />
          }))}
          {/* Fixed blocks */}
          {g.board.map((row,r) => row.map((val,c) => {
            if (!val) return null
            return (
              <div key={`b${r}-${c}`} style={{ position:'absolute', top:r*cell, left:c*cell, width:cell, height:cell, border:`1px solid ${val.color}55`, boxSizing:'border-box', overflow:'hidden', background: g.lineFlash ? `${val.color}44` : 'transparent' }}>
                <WankoBlock size={cell} variant={val.variant||0} />
              </div>
            )
          }))}
          {/* Active piece */}
          {g.started && !g.over && g.piece.cells.map((row,r) => row.map((v,c) => {
            if (!v) return null
            const nr = g.piece.y + r, nc = g.piece.x + c
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return null
            return (
              <div key={`p${r}-${c}`} style={{ position:'absolute', top:nr*cell, left:nc*cell, width:cell, height:cell, border:`1.5px solid ${g.piece.color}`, boxSizing:'border-box', overflow:'hidden', boxShadow:`0 0 10px ${g.piece.color}66,inset 0 1px 0 rgba(255,255,255,0.15)` }}>
                <WankoBlock size={cell} variant={g.piece.variant||0} />
              </div>
            )
          }))}
          {/* Line flash */}
          {g.lineFlash && <div style={{ position:'absolute', inset:0, background:'rgba(255,210,80,0.14)', pointerEvents:'none' }} />}
        </div>
      )}

      {/* UI Layer */}
      <div style={{ position:'fixed', inset:0, zIndex:6, display:'flex', flexDirection:'column', pointerEvents:'none' }}>
        {/* Top bar */}
        <div style={{ height:48, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', background:'rgba(0,3,18,0.82)', borderBottom:'1px solid rgba(80,120,200,0.28)', backdropFilter:'blur(10px)', pointerEvents:'auto' }}>
          <div onClick={onBack} style={{ fontSize:13, color:'#7090c0', cursor:'pointer', padding:'4px 12px', border:'1px solid rgba(100,140,200,0.3)', borderRadius:6, background:'rgba(10,20,60,0.6)' }}>← 戻る</div>
          <div style={{ display:'flex', gap:isMobile?10:20, fontSize:isMobile?11:13, fontWeight:700 }}>
            <span style={{ color:'#f0c040' }}>SCORE <span style={{ fontSize:isMobile?14:18 }}>{g.score.toLocaleString()}</span></span>
            <span style={{ color:'#80c0ff' }}>Lv.<span style={{ fontSize:isMobile?14:18 }}>{g.level}</span></span>
            <span style={{ color:'#80e0a0' }}>LINE <span style={{ fontSize:isMobile?12:16 }}>{g.lines}</span></span>
          </div>
          <div onClick={() => g.started && !g.over && g.setPaused(v=>!v)} style={{ fontSize:18, cursor:'pointer', color:'#607090', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'auto' }}>
            {g.paused ? '▶' : '⏸'}
          </div>
        </div>

        {/* Main row */}
        <div style={{ flex:1, display:'flex', alignItems:'stretch', minHeight:0 }}>
          {/* Left: HOLD + stats */}
          {sideW > 0 && (
            <div style={{ width:sideW, flexShrink:0, display:'flex', flexDirection:'column', gap:6, padding:'8px 6px 6px 10px' }}>
              <div style={{ background:'rgba(5,10,35,0.9)', border:'1px solid rgba(100,150,220,0.3)', borderLeft:'3px solid #7eb8f7', borderRadius:8, padding:'7px 8px', backdropFilter:'blur(8px)' }}>
                <div style={{ fontSize:'clamp(7px,1.4vw,9px)', color:'#7eb8f788', fontWeight:700, letterSpacing:1.5, marginBottom:5 }}>🧊 冷蔵庫</div>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <MiniPiece p={g.hold} size={Math.max(12, Math.floor(sideW*0.25))} />
                </div>
              </div>
              <StatBox label="スコア" value={g.score.toLocaleString()} color="#f5c842" />
              <StatBox label="レベル" value={g.level} color="#7eb8f7" />
              <StatBox label="ライン" value={g.lines} color="#80e0a0" />
              {g.combo > 1 && (
                <div style={{ background:'linear-gradient(135deg,rgba(220,60,0,.9),rgba(160,0,60,.88))', borderRadius:8, padding:'6px 8px', textAlign:'center', border:'1px solid rgba(255,100,50,.3)' }}>
                  <div style={{ fontSize:'clamp(7px,1.4vw,9px)', color:'rgba(255,200,150,.9)', fontWeight:700 }}>コンボ</div>
                  <div style={{ fontSize:'clamp(18px,4vw,26px)', fontWeight:900, color:'#fff', lineHeight:1.1 }}>{g.combo}</div>
                </div>
              )}
            </div>
          )}

          <div style={{ flex:1 }} />

          {/* Right: NEXT */}
          {sideW > 0 && (
            <div style={{ width:sideW, flexShrink:0, display:'flex', flexDirection:'column', gap:5, padding:'8px 10px 6px 6px' }}>
              <div style={{ background:'rgba(5,10,35,0.9)', border:'1px solid rgba(200,150,60,0.3)', borderRadius:8, padding:'7px 6px', backdropFilter:'blur(8px)' }}>
                <div style={{ fontSize:'clamp(7px,1.4vw,9px)', color:'rgba(200,150,60,0.85)', fontWeight:700, letterSpacing:1, marginBottom:6, textAlign:'center' }}>次の冷麺</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {g.nextPieces.map((p,i) => {
                    const nc = Math.max(12, Math.floor(sideW*(i===0?0.28:0.22)))
                    return (
                      <div key={i} style={{ display:'flex', justifyContent:'center', opacity:i===0?1:0.55 }}>
                        <MiniPiece p={p} size={nc} />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Character panel */}
        <div style={{ flexShrink:0, height:52, display:'flex', alignItems:'center', gap:12, padding:'0 14px', background:'rgba(0,3,14,0.88)', borderTop:'1px solid rgba(60,90,160,0.25)', backdropFilter:'blur(8px)', pointerEvents:'auto' }}>
          <div style={{ width:36, height:36, borderRadius:8, background:`${ver.color}20`, border:`1px solid ${ver.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{ver.emoji}</div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:ver.color }}>{ver.name}</div>
            <div style={{ fontSize:10, color:'#446' }}>特殊イベント待機中...</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ flexShrink:0, padding:'8px 10px 10px', background:'rgba(0,2,12,0.94)', borderTop:'1px solid rgba(60,90,160,0.28)', display:'flex', flexDirection:'column', gap:7, pointerEvents:'auto' }}>
          <div style={{ display:'flex', gap:7 }}>
            <GBtn label="🧊"    onClick={g.doHold}      color="#7eb8f7" flex={1}   fs={22} />
            <GBtn label="↑ 回転" onClick={g.rotatePiece} color="#f5c842" flex={1.6} fs={15} />
            <GBtn label="DROP"  onClick={g.hardDrop}    color="#e06030" flex={1.2} fs={14} />
          </div>
          <div style={{ display:'flex', gap:7 }}>
            <GBtn label="◀" onClick={g.moveLeft}  color="#80d8b0" flex={1.2} fs={26} />
            <GBtn label="▼" onClick={g.drop}       color="#6090e0" flex={1}   fs={26} />
            <GBtn label="▶" onClick={g.moveRight} color="#80d8b0" flex={1.2} fs={26} />
          </div>
        </div>
      </div>

      {/* Combo animation */}
      {g.comboAnim && (
        <div style={{ position:'fixed', top:'36%', left:'50%', zIndex:50, textAlign:'center', pointerEvents:'none', animation:'comboAppear 1.8s forwards' }}>
          <div style={{ fontSize:'clamp(30px,8vw,52px)', fontWeight:900, color:'#f0c030', textShadow:'0 0 30px #f0a010,0 0 60px #c08000', letterSpacing:2 }}>
            {g.comboAnim.label}
          </div>
          {g.comboAnim.pts > 0 && (
            <div style={{ fontSize:'clamp(16px,4vw,22px)', color:'#f0e080', fontWeight:700, textShadow:'0 0 15px #c0a000' }}>
              +{g.comboAnim.pts.toLocaleString()}
            </div>
          )}
          <div style={{ fontSize:'clamp(11px,2.5vw,16px)', color:'#c8a040', fontWeight:700, letterSpacing:3, marginTop:4 }}>COMBO!</div>
        </div>
      )}

      {/* Start overlay */}
      {!g.started && !g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(0,3,18,0.94)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
          <img src="/assets/logo.webp" alt="" style={{ height:'clamp(48px,12vw,80px)', width:'auto', maxWidth:'75vw', objectFit:'contain', filter:'drop-shadow(0 3px 20px rgba(0,0,0,.95))', animation:'logoF 3s ease-in-out infinite' }} />
          <div style={{ textAlign:'center', lineHeight:2, color:'#7090c0', fontSize:'clamp(11px,2.5vw,15px)' }}>
            バージョン: <span style={{ color:ver.color, fontWeight:700 }}>{ver.emoji} {ver.name}</span>
          </div>
          <StoneBtn label="▶ スタート！" color="#f0c040" width={220} size="lg" onClick={g.reset} />
          <div style={{ fontSize:'clamp(9px,2vw,11px)', color:'#334', textAlign:'center', lineHeight:2.2, marginTop:4 }}>
            ←→ 移動　↑ 回転　↓ 落下　Space DROP　C HOLD
          </div>
        </div>
      )}

      {/* Game over */}
      {g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(0,3,18,0.97)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
          <div style={{ fontSize:'clamp(26px,6.5vw,44px)', fontWeight:900, color:'#c03020', textShadow:'0 0 30px rgba(200,40,20,.5)', letterSpacing:3 }}>GAME OVER</div>
          <div style={{ fontSize:'clamp(14px,3.5vw,20px)', color:'#c0c0e0' }}>スコア <span style={{ color:'#f0c040', fontSize:'1.5em', fontWeight:900 }}>{g.score.toLocaleString()}</span></div>
          <div style={{ fontSize:13, color:'#446' }}>Lv.{g.level} / {g.lines} LINES</div>
          <div style={{ display:'flex', gap:12, marginTop:10 }}>
            <StoneBtn label="もう一杯！" color="#f0c040" width={160} onClick={g.reset} />
            <StoneBtn label="タイトル"   color="#7090a0" width={130} onClick={onBack} />
          </div>
        </div>
      )}

      {/* Pause */}
      {g.paused && !g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(0,3,18,0.9)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div style={{ fontSize:'clamp(24px,6vw,38px)', fontWeight:900, color:'#f0c040', letterSpacing:4 }}>⏸ PAUSE</div>
          <div style={{ display:'flex', gap:12 }}>
            <StoneBtn label="▶ 再開"   color="#80e080" width={150} onClick={() => g.setPaused(false)} />
            <StoneBtn label="タイトル" color="#7090a0" width={130} onClick={onBack} />
          </div>
        </div>
      )}
    </div>
  )
}
