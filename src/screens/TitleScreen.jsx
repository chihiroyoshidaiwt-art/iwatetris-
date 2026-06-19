import { useState } from 'react'
import Background from '../components/Background.jsx'
import StoneBtn   from '../components/StoneBtn.jsx'

const VERSIONS = [
  { id:'fujiwara',   name:'藤原清衡',   theme:'平泉・金色堂', effect:'黄金ブロックで2倍スコア', color:'#c8a020', emoji:'👑', available:true  },
  { id:'yoshitsune', name:'源義経',     theme:'奥州逃避行',  effect:'高速モード・大量ボーナス', color:'#4080c0', emoji:'⚔️', available:true  },
  { id:'hara',       name:'原敬',       theme:'政治',        effect:'NEXTを好みに変更可能',      color:'#208040', emoji:'🏛️', available:true  },
  { id:'nitobe',     name:'新渡戸稲造', theme:'教育・国際',  effect:'クイズ正解でボーナス',     color:'#8040c0', emoji:'📚', available:true  },
  { id:'kenji',      name:'宮沢賢治',   theme:'童話・銀河',  effect:'猫・北風・銀河鉄道イベント',color:'#2060c0', emoji:'🌌', available:true  },
  { id:'takuboku',   name:'石川啄木',   theme:'短歌',        effect:'短歌イベントでボーナス',    color:'#804020', emoji:'📝', available:true  },
  { id:'yokosawa',   name:'横沢たかひろ',theme:'岩手のお笑い',effect:'予測不能ランダム演出',     color:'#c04080', emoji:'😄', available:true  },
]

function VersionCard({ v, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      cursor: 'pointer', borderRadius: 10,
      border: selected ? `2px solid ${v.color}` : '1px solid rgba(255,255,255,0.12)',
      background: selected
        ? `linear-gradient(145deg, ${v.color}28, rgba(8,12,35,0.96))`
        : 'linear-gradient(145deg, rgba(16,22,50,0.92), rgba(8,12,30,0.96))',
      padding: 'clamp(8px,2vw,14px)',
      textAlign: 'center', transition: 'all 0.18s',
      boxShadow: selected ? `0 0 22px ${v.color}44, inset 0 1px 0 rgba(255,255,255,0.06)` : 'none',
      transform: selected ? 'scale(1.04)' : 'scale(1)',
    }}>
      <div style={{ fontSize: 'clamp(20px,5vw,30px)', marginBottom: 5 }}>{v.emoji}</div>
      <div style={{ fontSize: 'clamp(10px,2.2vw,13px)', fontWeight: 700, color: selected ? v.color : '#99aabb', marginBottom: 4, lineHeight: 1.3 }}>{v.name}</div>
      <div style={{ fontSize: 'clamp(8px,1.6vw,10px)', color: '#557', lineHeight: 1.5 }}>{v.effect}</div>
    </div>
  )
}

export default function TitleScreen({ onStart, onAdmin }) {
  const [modal,           setModal]           = useState(null)
  const [selectedVersion, setSelectedVersion] = useState('kenji')
  const isMobile = window.innerWidth < 768

  const menus = [
    { label: 'スタート',   color: '#e04020', action: () => onStart(selectedVersion) },
    { label: 'つづき',     color: '#c08020', action: () => alert('セーブデータなし'), disabled: true },
    { label: 'バージョン', color: '#4080c0', action: () => setModal('version') },
    { label: 'ランキング', color: '#806000', action: () => {},                  locked: true },
    { label: '各種設定',   color: '#406080', action: () => setModal('settings') },
  ]

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:'#fff', userSelect:'none', position:'relative' }}>
      <style>{`
        @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes versionIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
      `}</style>

      <Background mobile={isMobile} />

      {/* Version select modal */}
      {modal === 'version' && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,3,18,0.97)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,32px)', gap:16, animation:'versionIn .25s' }}>
          <div style={{ fontSize:'clamp(18px,4vw,28px)', fontWeight:900, color:'#f0c040', letterSpacing:3, textShadow:'0 0 20px #c09010' }}>バージョンを選択</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(90px,20vw,130px),1fr))', gap:'clamp(8px,2vw,14px)', width:'100%', maxWidth:760 }}>
            {VERSIONS.map(v => (
              <VersionCard key={v.id} v={v} selected={selectedVersion===v.id} onClick={() => setSelectedVersion(v.id)} />
            ))}
          </div>
          <div style={{ display:'flex', gap:12, marginTop:8 }}>
            <StoneBtn label="決定" color="#f0c040" width={160} onClick={() => setModal(null)} />
            <StoneBtn label="戻る" color="#7090a0" width={110} onClick={() => setModal(null)} />
          </div>
        </div>
      )}

      {/* Settings modal */}
      {modal === 'settings' && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,3,18,0.97)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
          <div style={{ fontSize:'clamp(18px,4vw,26px)', fontWeight:900, color:'#f0c040', letterSpacing:3 }}>各種設定</div>
          <div style={{ color:'#446', fontSize:13 }}>設定機能は準備中です</div>
          <StoneBtn label="← 戻る" color="#7090a0" width={160} onClick={() => setModal(null)} />
          <div onClick={onAdmin} style={{ fontSize:11, color:'#334', cursor:'pointer', marginTop:8, textDecoration:'underline' }}>管理画面（開発者用）</div>
        </div>
      )}

      {/* Main title */}
      {!modal && (
        <div style={{ position:'fixed', inset:0, zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,32px)', gap:'clamp(6px,1.8vw,12px)' }}>
          {/* Logo */}
          <img
            src="/assets/logo.webp"
            alt="イワテトリス"
            style={{ height:'clamp(56px,14vw,110px)', width:'auto', maxWidth:'80vw', objectFit:'contain', animation:'logoFloat 3.5s ease-in-out infinite', filter:'drop-shadow(0 4px 24px rgba(0,0,0,0.95)) drop-shadow(0 0 40px rgba(180,200,255,0.2))' }}
          />

          {/* Selected version badge */}
          <div style={{ fontSize:'clamp(9px,2vw,12px)', color:'#7090c0', letterSpacing:2, marginBottom:4 }}>
            {VERSIONS.find(v=>v.id===selectedVersion)?.emoji} {VERSIONS.find(v=>v.id===selectedVersion)?.name} バージョン
          </div>

          {/* Menu */}
          <div style={{ display:'flex', flexDirection:'column', gap:'clamp(8px,2vw,12px)', width:'100%', maxWidth:'clamp(240px,60vw,320px)' }}>
            {menus.map((m,i) => (
              <StoneBtn key={i} label={m.label} color={m.color} onClick={m.action} disabled={m.disabled} locked={m.locked} />
            ))}
          </div>

          {/* Bottom */}
          <div style={{ position:'fixed', bottom:20, left:20 }}>
            <div onClick={() => setModal('settings')} style={{ width:32, height:32, borderRadius:7, background:'rgba(16,22,50,0.85)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, cursor:'pointer' }}>⚙️</div>
          </div>
          <div style={{ position:'fixed', bottom:24, right:20, fontSize:10, color:'#334', letterSpacing:1 }}>Ver. 1.0.0</div>
        </div>
      )}
    </div>
  )
}
