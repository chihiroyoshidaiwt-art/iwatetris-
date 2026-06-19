import { useState } from 'react'
import Background from '../components/Background.jsx'
import StoneBtn   from '../components/StoneBtn.jsx'
import { COLORS } from '../theme.js'
import { useConfig } from '../hooks/useConfig.js'

const VERSIONS = [
  { id:'fujiwara',   name:'藤原清衡',   theme:'平泉・金色堂', effect:'黄金ブロックで2倍スコア', color:'#c8a020', emoji:'👑', available:true },
  { id:'yoshitsune', name:'源義経',     theme:'奥州逃避行',  effect:'高速モード・大量ボーナス', color:'#4080c0', emoji:'⚔️', available:true },
  { id:'hara',       name:'原敬',       theme:'政治',        effect:'NEXTを好みに変更可能',      color:'#208040', emoji:'🏛️', available:true },
  { id:'nitobe',     name:'新渡戸稲造', theme:'教育・国際',  effect:'クイズ正解でボーナス',     color:'#8040c0', emoji:'📚', available:true },
  { id:'kenji',      name:'宮沢賢治',   theme:'童話・銀河',  effect:'猫・北風・銀河鉄道イベント',color:COLORS.blue, emoji:'🌌', available:true },
  { id:'takuboku',   name:'石川啄木',   theme:'短歌',        effect:'短歌イベントでボーナス',    color:'#804020', emoji:'📝', available:true },
  { id:'yokosawa',   name:'横沢たかひろ',theme:'岩手のお笑い',effect:'予測不能ランダム演出',     color:'#c04080', emoji:'😄', available:true },
]

function VersionCard({ v, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      cursor:'pointer', borderRadius:10,
      border: selected ? `2px solid ${v.color}` : '1px solid rgba(255,255,255,0.12)',
      background: selected ? `linear-gradient(145deg, ${v.color}28, rgba(8,12,35,0.96))` : 'linear-gradient(145deg, rgba(16,22,50,0.92), rgba(8,12,30,0.96))',
      padding:'clamp(8px,2vw,14px)', textAlign:'center', transition:'all 0.18s',
      boxShadow: selected ? `0 0 22px ${v.color}44, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
      transform: selected ? 'scale(1.04)' : 'scale(1)',
    }}>
      <div style={{ fontSize:'clamp(20px,5vw,30px)', marginBottom:5 }}>{v.emoji}</div>
      <div style={{ fontSize:'clamp(10px,2.2vw,13px)', fontWeight:700, color: selected?v.color:'#99aabb', marginBottom:4, lineHeight:1.3 }}>{v.name}</div>
      <div style={{ fontSize:'clamp(8px,1.6vw,10px)', color:'#557', lineHeight:1.5 }}>{v.effect}</div>
    </div>
  )
}

export default function TitleScreen({ onStart, onAdmin }) {
  const [modal, setModal] = useState(null)
  const [selectedVersion, setSelectedVersion] = useState('kenji')
  const { config } = useConfig()
  const isMobile = window.innerWidth < 900

  const menus = [
    { label:'スタート',     color: COLORS.gold,    action: () => onStart(selectedVersion) },
    { label:'つづきから',   color:'#c08020',        action: () => alert('セーブデータなし'), disabled:true },
    { label:'バージョン選択',color: COLORS.blue,    action: () => setModal('version') },
    { label:'ランキング',   color:'#806000',        action: () => setModal('ranking') },
    { label:'図鑑',         color: COLORS.emerald, action: () => setModal('zukan') },
    { label:'設定',         color:'#7090a0',        action: () => setModal('settings') },
  ]

  const logoWidth = isMobile ? 320 : 700

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none', position:'relative' }}>
      <style>{`
        @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes versionIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        @keyframes btnGlow{0%,100%{box-shadow:0 5px 0 rgba(0,0,0,.65),0 0 16px var(--glow)}50%{box-shadow:0 5px 0 rgba(0,0,0,.65),0 0 28px var(--glow)}}
      `}</style>

      <Background mobile={isMobile} config={config} />

      {/* Version select */}
      {modal === 'version' && (
        <ModalShell title="バージョンを選択" onClose={() => setModal(null)}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(90px,20vw,130px),1fr))', gap:'clamp(8px,2vw,14px)', width:'100%', maxWidth:760 }}>
            {VERSIONS.map(v => <VersionCard key={v.id} v={v} selected={selectedVersion===v.id} onClick={() => setSelectedVersion(v.id)} />)}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:16 }}>
            <StoneBtn label="決定" color={COLORS.gold} width={160} onClick={() => setModal(null)} />
          </div>
        </ModalShell>
      )}

      {/* Ranking */}
      {modal === 'ranking' && (
        <ModalShell title="ランキング" onClose={() => setModal(null)}>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {['全国','岩手県','盛岡市','友達'].map(t => (
              <div key={t} style={{ padding:'6px 16px', borderRadius:7, background:'rgba(20,40,100,.6)', border:'1px solid rgba(100,140,220,.4)', fontSize:12, color:COLORS.blue, cursor:'pointer' }}>{t}</div>
            ))}
          </div>
          <div style={{ color:'#557', fontSize:13 }}>ランキングデータ準備中...</div>
        </ModalShell>
      )}

      {/* 図鑑 */}
      {modal === 'zukan' && (
        <ModalShell title="図鑑" onClose={() => setModal(null)}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))', gap:10, width:'100%', maxWidth:680 }}>
            {['盛楼閣','ぴょんぴょん舎','髭','食道園','やまなか家','じゃじゃ麺','南部せんべい','岩泉ヨーグルト'].map(name => (
              <div key={name} style={{ background:'rgba(10,18,50,.85)', border:'1px solid rgba(80,120,200,.3)', borderRadius:9, padding:'12px 8px', textAlign:'center', opacity:.4 }}>
                <div style={{ fontSize:22, marginBottom:4 }}>🔒</div>
                <div style={{ fontSize:10, color:'#667' }}>{name}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, fontSize:12, color:'#557' }}>収集率: 0 / 30</div>
        </ModalShell>
      )}

      {/* Settings */}
      {modal === 'settings' && (
        <ModalShell title="各種設定" onClose={() => setModal(null)}>
          <div style={{ width:'100%', maxWidth:340, display:'flex', flexDirection:'column', gap:14 }}>
            {['音量','BGM','SE','背景明るさ','操作感度'].map(label => (
              <div key={label}>
                <div style={{ fontSize:12, color:COLORS.blue, marginBottom:6 }}>{label}</div>
                <input type="range" min={0} max={100} defaultValue={70} style={{ width:'100%' }} />
              </div>
            ))}
          </div>
          <div onClick={onAdmin} style={{ fontSize:11, color:'#334', cursor:'pointer', marginTop:16, textDecoration:'underline' }}>管理画面（開発者用）</div>
        </ModalShell>
      )}

      {/* Main title */}
      {!modal && (
        <div style={{ position:'fixed', inset:0, zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,32px)', gap:'clamp(8px,2vw,16px)' }}>
          <img
            src="/assets/logo.webp" alt="イワテトリス"
            style={{ width: `min(${logoWidth}px, 82vw)`, height:'auto', objectFit:'contain', animation:'logoFloat 3.5s ease-in-out infinite', filter:'drop-shadow(0 6px 28px rgba(0,0,0,0.95)) drop-shadow(0 0 50px rgba(73,168,255,0.25))' }}
          />

          <div style={{ fontSize:'clamp(9px,2vw,12px)', color: COLORS.blue, letterSpacing:2, marginBottom:6 }}>
            {VERSIONS.find(v=>v.id===selectedVersion)?.emoji} {VERSIONS.find(v=>v.id===selectedVersion)?.name} バージョン
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'clamp(8px,1.8vw,11px)', width:'100%', maxWidth:'clamp(240px,60vw,340px)' }}>
            {menus.map((m,i) => <GlowBtn key={i} {...m} />)}
          </div>

          <div style={{ position:'fixed', bottom:24, right:20, fontSize:10, color:'#334', letterSpacing:1 }}>Ver. 1.0.0</div>
        </div>
      )}
    </div>
  )
}

function GlowBtn({ label, color, action, disabled }) {
  const [pressed, setPressed] = useState(false)
  return (
    <div
      onClick={!disabled ? action : undefined}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={e => { e.preventDefault(); !disabled && setPressed(true) }}
      onTouchEnd={e => { e.preventDefault(); setPressed(false); if (!disabled) action?.() }}
      style={{ cursor: disabled?'default':'pointer', opacity: disabled?0.4:1, transform: pressed?'scale(0.96) translateY(2px)':'scale(1)', transition:'transform .08s', userSelect:'none', WebkitTapHighlightColor:'transparent' }}
    >
      <div style={{
        background:'linear-gradient(160deg,#0e1a4a,#070d2e)',
        border:`2px solid ${color}77`, borderRadius:9,
        padding:'clamp(11px,2.4vw,15px) clamp(20px,4vw,28px)', textAlign:'center',
        boxShadow: pressed ? `0 1px 0 rgba(0,0,0,.6), inset 0 2px 4px rgba(0,0,0,.5)` : `0 5px 0 rgba(0,0,0,.65), 0 0 18px ${color}30, inset 0 1px 0 rgba(255,255,255,.06)`,
      }}>
        <span style={{ fontSize:'clamp(15px,3.4vw,19px)', fontWeight:900, color, letterSpacing:1.5, textShadow:`0 0 14px ${color}88` }}>{label}</span>
      </div>
    </div>
  )
}

function ModalShell({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(2,8,23,0.97)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,32px)', gap:16 }}>
      <div style={{ fontSize:'clamp(18px,4vw,28px)', fontWeight:900, color:COLORS.gold, letterSpacing:3, textShadow:`0 0 20px ${COLORS.gold}66` }}>{title}</div>
      {children}
      <div onClick={onClose} style={{ marginTop:8, fontSize:13, color:'#557', cursor:'pointer', padding:'9px 26px', border:'1px solid rgba(80,110,180,.35)', borderRadius:8 }}>← 戻る</div>
    </div>
  )
}
