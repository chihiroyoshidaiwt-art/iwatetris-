import { useState, useEffect } from 'react'
import Background       from '../components/Background.jsx'
import IwatePlayfield    from '../components/IwatePlayfield.jsx'
import { MiniPiece }     from '../components/WankoBlock.jsx'
import StoneBtn          from '../components/StoneBtn.jsx'
import { useTetris, COLS, ROWS } from '../hooks/useTetris.js'

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
  const [vw, setVw] = useState(window.innerWidth)
  const [vh, setVh] = useState(window.innerHeight)

  useEffect(() => {
    const r = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', r)
    return () => window.removeEventListener('resize', r)
  }, [])

  const isMobile = vw < 900
  const ghostY = g.getGhost()

  return isMobile
    ? <MobileLayout g={g} ver={ver} ghostY={ghostY} vw={vw} vh={vh} onBack={onBack} />
    : <DesktopLayout g={g} ver={ver} ghostY={ghostY} vw={vw} vh={vh} onBack={onBack} />
}

// ============================================================
// MOBILE LAYOUT — 390x844 基準 6エリア構成
// タイトル80 / ステータス60 / プレイ430 / NEXT90 / イベント60 / 操作180 = 700+ (実際はvh基準で可変)
// ============================================================
function MobileLayout({ g, ver, ghostY, vw, vh, onBack }) {
  // プレイフィールド: 横70% 高55%
  const fieldW = Math.min(vw * 0.70, 290)
  const fieldH = fieldW * (430 / 290) // 比率維持(290x430)
  const cell = Math.floor(Math.min((fieldW * 0.72) / COLS, (fieldH * 0.88) / ROWS))

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none' }}>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes comboAppear{0%{opacity:0;transform:translateX(-50%) scale(0.5)}15%{opacity:1;transform:translateX(-50%) scale(1.1)}30%{transform:translateX(-50%) scale(1)}70%{opacity:1}100%{opacity:0;transform:translateX(-50%) scale(0.9) translateY(-20px)}}
        @keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      `}</style>
      <Background mobile />

      {/* ①タイトルエリア 80px */}
      <div style={{ height:80, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:6 }}>
        <div onClick={onBack} style={{ position:'absolute', left:10, fontSize:12, color:'#7090c0', cursor:'pointer', padding:'5px 11px', border:'1px solid rgba(100,140,200,0.3)', borderRadius:6, background:'rgba(10,20,60,0.6)' }}>← 戻る</div>
        <img src="/assets/logo.webp" alt="" style={{ height:34, objectFit:'contain', filter:'drop-shadow(0 2px 8px rgba(0,0,0,0.9))' }} />
        <div onClick={() => g.started && !g.over && g.setPaused(v=>!v)} style={{ position:'absolute', right:10, fontSize:16, cursor:'pointer', color:'#607090' }}>{g.paused ? '▶' : '⏸'}</div>
      </div>

      {/* ②ステータスエリア 60px */}
      <div style={{ height:60, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-evenly', zIndex:6, padding:'0 8px' }}>
        {[
          { l:'SCORE', v:g.score.toLocaleString(), c:'#f5c842' },
          { l:'LEVEL', v:g.level, c:'#7eb8f7' },
          { l:'LINE',  v:g.lines, c:'#80e0a0' },
        ].map(({l,v,c}) => (
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:9, color:`${c}99`, fontWeight:700, letterSpacing:1 }}>{l}</div>
            <div style={{ fontSize:20, fontWeight:900, color:c, lineHeight:1.1 }}>{v}</div>
          </div>
        ))}
        {g.combo > 1 && (
          <div style={{ textAlign:'center', background:'linear-gradient(135deg,rgba(220,60,0,.85),rgba(160,0,60,.8))', borderRadius:8, padding:'2px 10px' }}>
            <div style={{ fontSize:8, color:'#ffcfa0' }}>COMBO</div>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff' }}>{g.combo}</div>
          </div>
        )}
      </div>

      {/* ③プレイエリア（HOLD左、フィールド中央、NEXT省略→④で表示） */}
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'4px 8px', position:'relative' }}>
        {/* HOLD 80x80 */}
        <div style={{ width:80, height:80, flexShrink:0, background:'rgba(5,10,35,0.88)', border:'1px solid rgba(100,150,220,0.3)', borderLeft:'3px solid #7eb8f7', borderRadius:8, padding:'5px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ fontSize:8, color:'#7eb8f788', fontWeight:700, marginBottom:3 }}>🧊冷蔵庫</div>
          <MiniPiece p={g.hold} size={11} />
        </div>

        {/* 岩手フィールド */}
        <IwatePlayfield width={fieldW} height={fieldH} cell={cell} cols={COLS} rows={ROWS} board={g.board} piece={g.started && !g.over ? g.piece : null} ghostY={ghostY} lineFlash={g.lineFlash} />

        {/* NEXT (右、コンパクト) */}
        <div style={{ width:80, flexShrink:0, background:'rgba(5,10,35,0.88)', border:'1px solid rgba(200,150,60,0.3)', borderRadius:8, padding:'5px', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          <div style={{ fontSize:8, color:'rgba(200,150,60,0.85)', fontWeight:700 }}>次の冷麺</div>
          {g.nextPieces.slice(0,3).map((p,i) => <MiniPiece key={i} p={p} size={i===0?11:9} />)}
        </div>
      </div>

      {/* ⑤イベントエリア 60px */}
      <div style={{ height:60, flexShrink:0, display:'flex', alignItems:'center', gap:10, padding:'0 14px', zIndex:6 }}>
        <div style={{ width:32, height:32, borderRadius:7, background:`${ver.color}20`, border:`1px solid ${ver.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{ver.emoji}</div>
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:ver.color }}>{ver.name}</div>
          <div style={{ fontSize:9, color:'#446' }}>特殊イベント待機中...</div>
        </div>
      </div>

      {/* ⑥操作エリア 180px : 5ボタン構成 70x70 */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:12, padding:'8px 12px', zIndex:6, minHeight:160 }}>
        <div style={{ display:'flex', justifyContent:'center', gap:12 }}>
          <MiniBtn label="🧊" onClick={g.doHold}      color="#7eb8f7" />
          <MiniBtn label="↑"  onClick={g.rotatePiece} color="#f5c842" fs={26} />
          <MiniBtn label="DROP" onClick={g.hardDrop}  color="#e06030" fs={12} />
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:12 }}>
          <MiniBtn label="◀" onClick={g.moveLeft}  color="#80d8b0" fs={26} />
          <MiniBtn label="▼" onClick={g.drop}       color="#6090e0" fs={26} />
          <MiniBtn label="▶" onClick={g.moveRight} color="#80d8b0" fs={26} />
        </div>
      </div>

      <Overlays g={g} ver={ver} onBack={onBack} />
    </div>
  )
}

function MiniBtn({ label, onClick, color, fs = 18 }) {
  return (
    <div onClick={onClick}
      onTouchStart={e => { e.currentTarget.style.transform='scale(0.88)'; e.currentTarget.style.opacity='0.6' }}
      onTouchEnd={e => { e.currentTarget.style.transform=''; e.currentTarget.style.opacity='1'; onClick() }}
      style={{ width:70, height:70, borderRadius:10, background:'linear-gradient(160deg,#2e2414,#1a1008)', border:`2px solid ${color}55`, color, fontSize:fs, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', WebkitTapHighlightColor:'transparent', boxShadow:`0 3px 0 rgba(0,0,0,0.7),0 0 10px ${color}18` }}>
      {label}
    </div>
  )
}

// ============================================================
// DESKTOP LAYOUT — 1920x1080 基準 3カラム構成 (20/55/25)
// ============================================================
function DesktopLayout({ g, ver, ghostY, vw, vh, onBack }) {
  const fieldW = Math.min(560, vw * 0.55 * 0.55)
  const fieldH = fieldW * (840 / 560)
  const cell = Math.floor(Math.min((fieldW * 0.72) / COLS, (fieldH * 0.88) / ROWS))

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none' }}>
      <style>{`
        *{box-sizing:border-box;}
        @keyframes comboAppear{0%{opacity:0;transform:translateX(-50%) scale(0.5)}15%{opacity:1;transform:translateX(-50%) scale(1.1)}30%{transform:translateX(-50%) scale(1)}70%{opacity:1}100%{opacity:0;transform:translateX(-50%) scale(0.9) translateY(-20px)}}
        @keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      `}</style>
      <Background />

      {/* Top bar: logo + stats */}
      <div style={{ height:64, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', zIndex:6 }}>
        <div onClick={onBack} style={{ fontSize:13, color:'#7090c0', cursor:'pointer', padding:'6px 16px', border:'1px solid rgba(100,140,200,0.3)', borderRadius:7, background:'rgba(10,20,60,0.6)' }}>← 戻る</div>
        <img src="/assets/logo.webp" alt="" style={{ height:42, objectFit:'contain', filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.9))' }} />
        <div style={{ display:'flex', gap:28 }}>
          <Stat l="SCORE" v={g.score.toLocaleString()} c="#f5c842" />
          <Stat l="LEVEL" v={g.level} c="#7eb8f7" />
          <Stat l="LINE"  v={g.lines} c="#80e0a0" />
        </div>
        <div onClick={() => g.started && !g.over && g.setPaused(v=>!v)} style={{ fontSize:20, cursor:'pointer', color:'#607090' }}>{g.paused ? '▶' : '⏸'}</div>
      </div>

      {/* 3-column body */}
      <div style={{ flex:1, display:'flex', minHeight:0, zIndex:6 }}>
        {/* LEFT 20% */}
        <div style={{ width:'20%', minWidth:280, maxWidth:380, padding:'10px 16px', display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <Panel title="プレイヤー情報">
            <InfoRow label="HOLD" />
            <div style={{ display:'flex', justifyContent:'center', padding:'6px 0' }}><MiniPiece p={g.hold} size={18} /></div>
          </Panel>
          <Panel title="実績">
            <div style={{ fontSize:11, color:'#557' }}>準備中...</div>
          </Panel>
          <Panel title="ミッション">
            <div style={{ fontSize:11, color:'#557' }}>準備中...</div>
          </Panel>
          <Panel title="イベント履歴">
            <div style={{ fontSize:11, color:'#557' }}>まだイベントは発生していません</div>
          </Panel>
        </div>

        {/* CENTER 55% */}
        <div style={{ width:'55%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, minHeight:0 }}>
          <IwatePlayfield width={fieldW} height={fieldH} cell={cell} cols={COLS} rows={ROWS} board={g.board} piece={g.started && !g.over ? g.piece : null} ghostY={ghostY} lineFlash={g.lineFlash} />

          {/* Character event bar below field */}
          <div style={{ width:fieldW, display:'flex', alignItems:'center', gap:10, background:'rgba(5,10,30,0.7)', border:'1px solid rgba(80,120,200,0.25)', borderRadius:8, padding:'8px 14px' }}>
            <div style={{ width:32, height:32, borderRadius:7, background:`${ver.color}20`, border:`1px solid ${ver.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{ver.emoji}</div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:ver.color }}>{ver.name}</div>
              <div style={{ fontSize:10, color:'#446' }}>特殊イベント待機中...</div>
            </div>
          </div>

          {/* Controls (desktop also has buttons for mouse play) */}
          <div style={{ display:'flex', gap:10 }}>
            <DesktopBtn label="🧊"   onClick={g.doHold}      color="#7eb8f7" />
            <DesktopBtn label="◀"    onClick={g.moveLeft}    color="#80d8b0" />
            <DesktopBtn label="↑回転" onClick={g.rotatePiece} color="#f5c842" />
            <DesktopBtn label="▼"    onClick={g.drop}        color="#6090e0" />
            <DesktopBtn label="▶"    onClick={g.moveRight}   color="#80d8b0" />
            <DesktopBtn label="DROP" onClick={g.hardDrop}    color="#e06030" />
          </div>
        </div>

        {/* RIGHT 25% */}
        <div style={{ width:'25%', minWidth:320, maxWidth:490, padding:'10px 16px', display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <Panel title="次の冷麺">
            <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center', padding:'4px 0' }}>
              {g.nextPieces.map((p,i) => <MiniPiece key={i} p={p} size={i===0?24:18} />)}
            </div>
          </Panel>
          <Panel title="ランキング"><div style={{ fontSize:11, color:'#557' }}>準備中...</div></Panel>
          <Panel title="図鑑進捗"><div style={{ fontSize:11, color:'#557' }}>0 / 30 収集</div></Panel>
          <Panel title="ライバル情報"><div style={{ fontSize:11, color:'#557' }}>準備中...</div></Panel>
        </div>
      </div>

      {/* Bottom: 図鑑バー 160px相当(簡略) */}
      <div style={{ height:0 }} />

      <Overlays g={g} ver={ver} onBack={onBack} />
    </div>
  )
}

function Stat({ l, v, c }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:10, color:`${c}99`, fontWeight:700, letterSpacing:1 }}>{l}</div>
      <div style={{ fontSize:22, fontWeight:900, color:c, lineHeight:1.1 }}>{v}</div>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div style={{ background:'rgba(5,10,32,0.85)', border:'1px solid rgba(80,120,200,0.25)', borderRadius:10, padding:'12px 14px' }}>
      <div style={{ fontSize:12, fontWeight:700, color:'#7eb8f7', marginBottom:8, letterSpacing:0.5 }}>{title}</div>
      {children}
    </div>
  )
}

function InfoRow({ label }) {
  return <div style={{ fontSize:10, color:'#7eb8f788', fontWeight:700, letterSpacing:1 }}>🧊 {label}</div>
}

function DesktopBtn({ label, onClick, color }) {
  return (
    <div onClick={onClick} style={{ width:80, height:60, borderRadius:9, background:'linear-gradient(160deg,#2e2414,#1a1008)', border:`2px solid ${color}55`, color, fontSize:14, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', boxShadow:`0 3px 0 rgba(0,0,0,0.7),0 0 10px ${color}18` }}>
      {label}
    </div>
  )
}

// ============================================================
// SHARED OVERLAYS
// ============================================================
function Overlays({ g, ver, onBack }) {
  return (
    <>
      {g.comboAnim && (
        <div style={{ position:'fixed', top:'36%', left:'50%', zIndex:50, textAlign:'center', pointerEvents:'none', animation:'comboAppear 0.8s forwards' }}>
          <div style={{ fontSize:'clamp(40px,8vw,64px)', fontWeight:900, color:'#f0c030', textShadow:'0 0 30px #f0a010,0 0 60px #c08000', letterSpacing:2 }}>
            {g.comboAnim.label}
          </div>
          {g.comboAnim.pts > 0 && (
            <div style={{ fontSize:'clamp(14px,3vw,20px)', color:'#f0e080', fontWeight:700, textShadow:'0 0 15px #c0a000' }}>+{g.comboAnim.pts.toLocaleString()}</div>
          )}
        </div>
      )}

      {!g.started && !g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(0,3,18,0.94)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
          <img src="/assets/logo.webp" alt="" style={{ height:'clamp(48px,12vw,80px)', objectFit:'contain', filter:'drop-shadow(0 3px 20px rgba(0,0,0,.95))', animation:'logoF 3s ease-in-out infinite' }} />
          <div style={{ textAlign:'center', lineHeight:2, color:'#7090c0', fontSize:'clamp(11px,2.5vw,15px)' }}>
            バージョン: <span style={{ color:ver.color, fontWeight:700 }}>{ver.emoji} {ver.name}</span>
          </div>
          <StoneBtn label="▶ スタート！" color="#f0c040" width={220} size="lg" onClick={g.reset} />
        </div>
      )}

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

      {g.paused && !g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(0,3,18,0.9)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div style={{ fontSize:'clamp(24px,6vw,38px)', fontWeight:900, color:'#f0c040', letterSpacing:4 }}>⏸ PAUSE</div>
          <div style={{ display:'flex', gap:12 }}>
            <StoneBtn label="▶ 再開"   color="#80e080" width={150} onClick={() => g.setPaused(false)} />
            <StoneBtn label="タイトル" color="#7090a0" width={130} onClick={onBack} />
          </div>
        </div>
      )}
    </>
  )
}
