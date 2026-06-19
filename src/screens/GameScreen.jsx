import { useState, useEffect } from 'react'
import Background       from '../components/Background.jsx'
import IwatePlayfield    from '../components/IwatePlayfield.jsx'
import { MiniPiece }     from '../components/WankoBlock.jsx'
import StoneBtn          from '../components/StoneBtn.jsx'
import { useTetris, COLS, ROWS } from '../hooks/useTetris.js'
import { useConfig }     from '../hooks/useConfig.js'
import { COLORS }        from '../theme.js'

const VERSIONS = {
  fujiwara:   { name:'藤原清衡',   color:'#c8a020', emoji:'👑' },
  yoshitsune: { name:'源義経',     color:'#4080c0', emoji:'⚔️' },
  hara:       { name:'原敬',       color:'#208040', emoji:'🏛️' },
  nitobe:     { name:'新渡戸稲造', color:'#8040c0', emoji:'📚' },
  kenji:      { name:'宮沢賢治',   color: COLORS.blue, emoji:'🌌' },
  takuboku:   { name:'石川啄木',   color:'#804020', emoji:'📝' },
  yokosawa:   { name:'横沢たかひろ',color:'#c04080', emoji:'😄' },
}

export default function GameScreen({ version, onBack }) {
  const ver = VERSIONS[version] || VERSIONS.kenji
  const g   = useTetris(version)
  const { config } = useConfig()
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
    ? <MobileLayout g={g} ver={ver} ghostY={ghostY} vw={vw} vh={vh} config={config} onBack={onBack} />
    : <DesktopLayout g={g} ver={ver} ghostY={ghostY} vw={vw} vh={vh} config={config} onBack={onBack} />
}

// ============================================================
// MOBILE — 中央70% / 情報15% / 操作15%
// プレイエリア: 幅90vw × 高さ65vh
// ============================================================
function MobileLayout({ g, ver, ghostY, vw, vh, config, onBack }) {
  const fieldW = vw * 0.90
  const fieldH = vh * 0.65

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none' }}>
      <style>{GLOBAL_STYLE}</style>
      <Background mobile config={config} />

      {/* タイトル80px */}
      <div style={{ height:80, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:6 }}>
        <div onClick={onBack} style={{ position:'absolute', left:10, fontSize:12, color: COLORS.blue, cursor:'pointer', padding:'5px 11px', border:`1px solid ${COLORS.blue}50`, borderRadius:6, background:'rgba(10,20,60,0.6)' }}>← 戻る</div>
        <img src="/assets/logo.webp" alt="" style={{ width:'min(320px,55vw)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 2px 10px rgba(0,0,0,0.9))' }} />
        <div onClick={() => g.started && !g.over && g.setPaused(v=>!v)} style={{ position:'absolute', right:10, fontSize:16, cursor:'pointer', color:'#607090' }}>{g.paused ? '▶' : '⏸'}</div>
      </div>

      {/* 情報15%：ステータス */}
      <div style={{ flex:'0 0 auto', height: vh * 0.15, display:'flex', alignItems:'center', justifyContent:'space-evenly', zIndex:6, padding:'0 8px' }}>
        {[
          { l:'SCORE', v:g.score.toLocaleString(), c: COLORS.gold },
          { l:'LEVEL', v:g.level, c: COLORS.blue },
          { l:'LINE',  v:g.lines, c: COLORS.emerald },
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

      {/* 中央70%：プレイエリア（HOLD・フィールド・NEXTを横並び） */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'0 4px', minHeight:0 }}>
        <div style={{ width:64, flexShrink:0, background:'rgba(5,10,35,0.88)', border:`1px solid ${COLORS.blue}50`, borderLeft:`3px solid ${COLORS.blue}`, borderRadius:8, padding:'4px', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ fontSize:7, color:`${COLORS.blue}99`, fontWeight:700, marginBottom:3 }}>🧊</div>
          <MiniPiece p={g.hold} size={9} />
        </div>

        <IwatePlayfield fieldW={fieldW} fieldH={fieldH} config={config} cols={COLS} rows={ROWS} board={g.board} piece={g.started && !g.over ? g.piece : null} ghostY={ghostY} lineFlash={g.lineFlash} />

        <div style={{ width:64, flexShrink:0, background:'rgba(5,10,35,0.88)', border:`1px solid ${COLORS.gold}40`, borderRadius:8, padding:'4px', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
          <div style={{ fontSize:7, color:`${COLORS.gold}cc`, fontWeight:700 }}>次の冷麺</div>
          {g.nextPieces.slice(0,3).map((p,i) => <MiniPiece key={i} p={p} size={i===0?9:7} />)}
        </div>
      </div>

      {/* イベント表示（宮沢賢治） */}
      <div style={{ height:40, flexShrink:0, display:'flex', alignItems:'center', gap:8, padding:'0 12px', zIndex:6 }}>
        <div style={{ width:26, height:26, borderRadius:6, background:`${ver.color}20`, border:`1px solid ${ver.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{ver.emoji}</div>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:ver.color }}>{ver.name}</div>
          <div style={{ fontSize:8, color:'#446' }}>{g.charEvent ? g.charEvent.sub : '特殊イベント待機中...'}</div>
        </div>
      </div>

      {/* 操作エリア（最下段） 5ボタン 70x70 */}
      <div style={{ flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', gap:8, padding:'6px 10px 10px', zIndex:6 }}>
        <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
          <MiniBtn label="🧊" onClick={g.doHold}      color={COLORS.blue} />
          <MiniBtn label="↑"  onClick={g.rotatePiece} color={COLORS.gold} fs={24} />
          <MiniBtn label="DROP" onClick={g.hardDrop}  color="#e06030" fs={11} />
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
          <MiniBtn label="◀" onClick={g.moveLeft}  color={COLORS.emerald} fs={24} />
          <MiniBtn label="▼" onClick={g.drop}       color={COLORS.blue} fs={24} />
          <MiniBtn label="▶" onClick={g.moveRight} color={COLORS.emerald} fs={24} />
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
      style={{ width:70, height:70, borderRadius:10, background:'linear-gradient(160deg,#0e1a4a,#070d2e)', border:`2px solid ${color}55`, color, fontSize:fs, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', WebkitTapHighlightColor:'transparent', boxShadow:`0 3px 0 rgba(0,0,0,0.7),0 0 10px ${color}20` }}>
      {label}
    </div>
  )
}

// ============================================================
// DESKTOP — 中央60% / 左20% / 右20%
// プレイエリア: 600×900
// ============================================================
function DesktopLayout({ g, ver, ghostY, vw, vh, config, onBack }) {
  const fieldW = Math.min(600, vw * 0.60 * 0.85)
  const fieldH = Math.min(900, vh * 0.80)

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', display:'flex', flexDirection:'column', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none' }}>
      <style>{GLOBAL_STYLE}</style>
      <Background config={config} />

      {/* タイトルバー140px */}
      <div style={{ height:140, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', zIndex:6 }}>
        <div onClick={onBack} style={{ fontSize:14, color: COLORS.blue, cursor:'pointer', padding:'8px 20px', border:`1px solid ${COLORS.blue}50`, borderRadius:8, background:'rgba(10,20,60,0.6)' }}>← 戻る</div>
        <img src="/assets/logo.webp" alt="" style={{ width:'min(420px,32vw)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.9))' }} />
        <div style={{ display:'flex', gap:32 }}>
          <Stat l="SCORE" v={g.score.toLocaleString()} c={COLORS.gold} />
          <Stat l="LEVEL" v={g.level} c={COLORS.blue} />
          <Stat l="LINE"  v={g.lines} c={COLORS.emerald} />
        </div>
        <div onClick={() => g.started && !g.over && g.setPaused(v=>!v)} style={{ fontSize:22, cursor:'pointer', color:'#607090' }}>{g.paused ? '▶' : '⏸'}</div>
      </div>

      {/* 3カラム本体 */}
      <div style={{ flex:1, display:'flex', minHeight:0, zIndex:6 }}>
        {/* 左20% */}
        <div style={{ width:'20%', minWidth:260, padding:'10px 16px', display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <Panel title="🧊 HOLD">
            <div style={{ display:'flex', justifyContent:'center', padding:'8px 0' }}><MiniPiece p={g.hold} size={20} /></div>
          </Panel>
          <Panel title={`${ver.emoji} ${ver.name}`}>
            <div style={{ fontSize:11, color:'#557', lineHeight:1.7 }}>{g.charEvent ? g.charEvent.sub : '特殊イベント待機中...'}</div>
          </Panel>
          {g.scoreMultiplier > 1 && (
            <div style={{ background:'linear-gradient(135deg,rgba(73,168,255,.3),rgba(80,255,212,.2))', border:`1px solid ${COLORS.emerald}66`, borderRadius:10, padding:'10px', textAlign:'center' }}>
              <div style={{ fontSize:12, color:COLORS.emerald, fontWeight:700 }}>銀河鉄道ボーナス中！</div>
              <div style={{ fontSize:18, color:'#fff', fontWeight:900 }}>スコア ×2</div>
            </div>
          )}
        </div>

        {/* 中央60% */}
        <div style={{ width:'60%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, minHeight:0 }}>
          <IwatePlayfield fieldW={fieldW} fieldH={fieldH} config={config} cols={COLS} rows={ROWS} board={g.board} piece={g.started && !g.over ? g.piece : null} ghostY={ghostY} lineFlash={g.lineFlash} />

          <div style={{ display:'flex', gap:10 }}>
            <DesktopBtn label="🧊"   onClick={g.doHold}      color={COLORS.blue} />
            <DesktopBtn label="◀"    onClick={g.moveLeft}    color={COLORS.emerald} />
            <DesktopBtn label="↑回転" onClick={g.rotatePiece} color={COLORS.gold} />
            <DesktopBtn label="▼"    onClick={g.drop}        color={COLORS.blue} />
            <DesktopBtn label="▶"    onClick={g.moveRight}   color={COLORS.emerald} />
            <DesktopBtn label="DROP" onClick={g.hardDrop}    color="#e06030" />
          </div>
        </div>

        {/* 右20% */}
        <div style={{ width:'20%', minWidth:260, padding:'10px 16px', display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <Panel title="次の冷麺">
            <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center', padding:'4px 0' }}>
              {g.nextPieces.map((p,i) => <MiniPiece key={i} p={p} size={i===0?22:16} />)}
            </div>
          </Panel>
          <Panel title="ランキング"><div style={{ fontSize:11, color:'#557' }}>準備中...</div></Panel>
          <Panel title="図鑑進捗"><div style={{ fontSize:11, color:'#557' }}>0 / 30 収集</div></Panel>
        </div>
      </div>

      <Overlays g={g} ver={ver} onBack={onBack} />
    </div>
  )
}

function Stat({ l, v, c }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:11, color:`${c}99`, fontWeight:700, letterSpacing:1 }}>{l}</div>
      <div style={{ fontSize:24, fontWeight:900, color:c, lineHeight:1.1 }}>{v}</div>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div style={{ background:'rgba(5,10,32,0.85)', border:`1px solid ${COLORS.blue}30`, borderRadius:10, padding:'12px 14px' }}>
      <div style={{ fontSize:12, fontWeight:700, color: COLORS.blue, marginBottom:8, letterSpacing:0.5 }}>{title}</div>
      {children}
    </div>
  )
}

function DesktopBtn({ label, onClick, color }) {
  return (
    <div onClick={onClick} style={{ width:80, height:60, borderRadius:9, background:'linear-gradient(160deg,#0e1a4a,#070d2e)', border:`2px solid ${color}55`, color, fontSize:14, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', userSelect:'none', boxShadow:`0 3px 0 rgba(0,0,0,0.7),0 0 10px ${color}20` }}>
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
      {/* キャラクターイベント演出（中央・3秒・アニメーション） */}
      {g.charEvent && (
        <div style={{ position:'fixed', top:'30%', left:'50%', zIndex:55, textAlign:'center', pointerEvents:'none', animation:'charEventPop 3s forwards', transform:'translateX(-50%)' }}>
          <div style={{ fontSize:'clamp(22px,5vw,38px)', fontWeight:900, color: COLORS.blue, textShadow:`0 0 24px ${COLORS.blue}, 0 0 50px ${COLORS.blue}66`, letterSpacing:1, whiteSpace:'nowrap' }}>
            {g.charEvent.label}
          </div>
          <div style={{ fontSize:'clamp(12px,2.8vw,16px)', color:'#cde', marginTop:6 }}>{g.charEvent.sub}</div>
        </div>
      )}

      {/* コンボ演出 */}
      {g.comboAnim && (
        <div style={{ position:'fixed', top:'40%', left:'50%', zIndex:50, textAlign:'center', pointerEvents:'none', animation:'comboAppear 0.9s forwards', transform:'translateX(-50%)' }}>
          <div style={{ fontSize:'clamp(40px,8vw,64px)', fontWeight:900, color: COLORS.gold, textShadow:`0 0 30px ${COLORS.gold}, 0 0 60px ${COLORS.gold}88`, letterSpacing:2, whiteSpace:'nowrap' }}>
            {g.comboAnim.label}
          </div>
          {g.comboAnim.pts > 0 && (
            <div style={{ fontSize:'clamp(14px,3vw,20px)', color:'#f0e080', fontWeight:700 }}>+{g.comboAnim.pts.toLocaleString()}</div>
          )}
        </div>
      )}

      {g.frozen && (
        <div style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:55, background:'rgba(200,150,0,.9)', borderRadius:10, padding:'8px 20px', fontSize:13, fontWeight:700, color:'#fff' }}>
          ☀️ 太陽イベント中：操作不能！
        </div>
      )}

      {!g.started && !g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(2,8,23,0.94)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
          <img src="/assets/logo.webp" alt="" style={{ width:'min(420px,70vw)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 3px 20px rgba(0,0,0,.95))', animation:'logoF 3s ease-in-out infinite' }} />
          <div style={{ textAlign:'center', lineHeight:2, color: COLORS.blue, fontSize:'clamp(11px,2.5vw,15px)' }}>
            バージョン: <span style={{ color:ver.color, fontWeight:700 }}>{ver.emoji} {ver.name}</span>
          </div>
          <StoneBtn label="▶ スタート！" color={COLORS.gold} width={220} size="lg" onClick={g.reset} />
        </div>
      )}

      {g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(2,8,23,0.97)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
          <div style={{ fontSize:'clamp(26px,6.5vw,44px)', fontWeight:900, color:'#c03020', textShadow:'0 0 30px rgba(200,40,20,.5)', letterSpacing:3 }}>GAME OVER</div>
          <div style={{ fontSize:'clamp(14px,3.5vw,20px)', color:'#c0c0e0' }}>スコア <span style={{ color:COLORS.gold, fontSize:'1.5em', fontWeight:900 }}>{g.score.toLocaleString()}</span></div>
          <div style={{ fontSize:13, color:'#446' }}>Lv.{g.level} / {g.lines} LINES / {g.totalServed}杯</div>
          <div style={{ display:'flex', gap:12, marginTop:10 }}>
            <StoneBtn label="もう一杯！" color={COLORS.gold} width={160} onClick={g.reset} />
            <StoneBtn label="タイトル"   color={COLORS.blue} width={130} onClick={onBack} />
          </div>
        </div>
      )}

      {g.paused && !g.over && (
        <div style={{ position:'fixed', inset:0, zIndex:30, background:'rgba(2,8,23,0.9)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div style={{ fontSize:'clamp(24px,6vw,38px)', fontWeight:900, color:COLORS.gold, letterSpacing:4 }}>⏸ PAUSE</div>
          <div style={{ display:'flex', gap:12 }}>
            <StoneBtn label="▶ 再開"   color={COLORS.emerald} width={150} onClick={() => g.setPaused(false)} />
            <StoneBtn label="タイトル" color={COLORS.blue} width={130} onClick={onBack} />
          </div>
        </div>
      )}
    </>
  )
}

const GLOBAL_STYLE = `
  *{box-sizing:border-box;}
  @keyframes comboAppear{0%{opacity:0;transform:translateX(-50%) scale(0.5)}15%{opacity:1;transform:translateX(-50%) scale(1.1)}30%{transform:translateX(-50%) scale(1)}70%{opacity:1}100%{opacity:0;transform:translateX(-50%) scale(0.9) translateY(-20px)}}
  @keyframes charEventPop{0%{opacity:0;transform:translateX(-50%) scale(0.7) translateY(-10px)}10%{opacity:1;transform:translateX(-50%) scale(1.05)}20%{transform:translateX(-50%) scale(1)}85%{opacity:1}100%{opacity:0;transform:translateX(-50%) scale(0.95) translateY(-10px)}}
  @keyframes logoF{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
`
