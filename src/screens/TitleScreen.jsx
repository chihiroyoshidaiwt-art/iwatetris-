import { useState, useRef } from 'react'
import { useBGM } from '../hooks/useBGM.js'

const VERSIONS = [
  { id: 'wanko',     label: 'わんこそばバージョン', emoji: '🍜', desc: '盛岡名物・わんこそばを積み上げろ！', available: true,  color: '#f5c842' },
  { id: 'kenji',     label: '宮沢賢治バージョン',   emoji: '🌌', desc: '銀河鉄道の夜の世界でテトリス',     available: false, color: '#7eb8f7' },
  { id: 'takuboku',  label: '石川啄木バージョン',   emoji: '📝', desc: '故郷の歌と共に積み上げろ',         available: false, color: '#a8d8a8' },
  { id: 'kindaichi', label: '金田一京助バージョン', emoji: '📚', desc: '言語学者の知識でブロックを解読せよ',available: false, color: '#f7c59f' },
  { id: 'nitobe',    label: '新渡戸稲造バージョン', emoji: '⚔️',  desc: '武士道精神でブロックを積み上げろ', available: false, color: '#e8d5b7' },
]

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: 2 + Math.random() * 4, delay: Math.random() * 5,
    color: i % 3 === 0 ? '#fff' : i % 3 === 1 ? '#b8d4ff' : '#ffe88a',
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', background: s.color, animation: `twinkle ${s.dur}s ${s.delay}s infinite` }} />
      ))}
      {/* 流れ星 */}
      {[0,1,2,3].map(i => (
        <div key={`m${i}`} style={{ position: 'absolute', top: `${8+i*10}%`, left: `${3+i*15}%`, width: 70, height: 1.5, borderRadius: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(200,230,255,.2))', animation: `shoot ${3+i*2}s ${i*5+1}s infinite`, opacity: 0 }} />
      ))}
    </div>
  )
}

export default function TitleScreen({ onStart }) {
  const [modal, setModal] = useState(null)
  const bgm = useBGM()
  const fileRef = useRef(null)
  const isMobile = window.innerWidth < 768

  const menuItems = [
    { id: 'start',   label: 'スタート',       sub: '最初から始める',    icon: '▶', color: '#f5c842' },
    { id: 'version', label: 'バージョン選択', sub: '5種類から選ぶ',     icon: '☰', color: '#7eb8f7' },
    { id: 'sound',   label: 'サウンド設定',   sub: bgm.hasFile ? (bgm.playing ? '♪ 再生中' : '♪ 停止中') : '音楽を設定', icon: '♪', color: '#a8d8e8' },
  ]

  const go = id => {
    if (id === 'start')   { bgm.play(); onStart('wanko') }
    if (id === 'version') setModal('version')
    if (id === 'sound')   setModal('sound')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color: '#fff', userSelect: 'none' }}>
      <style>{`
        @keyframes twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes shoot{0%{transform:translateX(0) translateY(0);opacity:1}100%{transform:translateX(420px) translateY(210px);opacity:0}}
        @keyframes logoFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1.02)}}
        @keyframes menuIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes neon{0%,100%{text-shadow:0 0 10px #f5c842,0 0 24px #f5c84244}50%{text-shadow:0 0 20px #f5c842,0 0 48px #f5c84288}}
        input[type=range]{-webkit-appearance:none;background:rgba(100,140,200,.35);border-radius:3px;outline:none;height:4px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#f5c842;cursor:pointer;}
      `}</style>

      {/* 背景 */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(/assets/${isMobile?'bg_sp':'bg_pc'}.webp)`, backgroundSize: 'cover', backgroundPosition: 'center bottom' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(0,5,20,0.42)' }} />
      <StarField />

      {/* バージョン選択モーダル */}
      {modal === 'version' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,5,20,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 900, color: '#f5c842', marginBottom: 20, letterSpacing: 2 }}>バージョン選択</div>
          <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VERSIONS.map(v => (
              <div key={v.id} onClick={() => { if (v.available) { bgm.play(); onStart(v.id); setModal(null) } }}
                style={{ background: v.available?'rgba(10,20,60,.92)':'rgba(5,10,30,.6)', border:`1.5px solid ${v.available?v.color+'66':'rgba(60,80,140,.4)'}`, borderRadius: 12, padding: '14px 18px', cursor: v.available?'pointer':'default', opacity: v.available?1:.45, display: 'flex', alignItems: 'center', gap: 14, backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{v.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'clamp(13px,3vw,16px)', fontWeight: 700, color: v.available?v.color:'#446', marginBottom: 3 }}>{v.label}</div>
                  <div style={{ fontSize: 'clamp(9px,2vw,11px)', color: '#557' }}>{v.desc}</div>
                </div>
                <div style={{ fontSize: 11, color: v.available?'#44ffcc':'#335', fontWeight: 700, flexShrink: 0 }}>{v.available?'▶ プレイ':'🔒 準備中'}</div>
              </div>
            ))}
          </div>
          <div onClick={() => setModal(null)} style={{ marginTop: 20, fontSize: 13, color: '#446', cursor: 'pointer', padding: '9px 24px', border: '1px solid rgba(80,110,180,.35)', borderRadius: 8 }}>← 戻る</div>
        </div>
      )}

      {/* サウンド設定モーダル */}
      {modal === 'sound' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,5,20,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <div style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 900, color: '#f5c842' }}>♪ サウンド設定</div>
          <div onClick={() => fileRef.current.click()}
            style={{ width: '100%', maxWidth: 340, background: 'rgba(10,20,60,.8)', border: '2px dashed rgba(100,140,220,.5)', borderRadius: 12, padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>♪</div>
            <div style={{ fontSize: 14, color: '#7eb8f7', fontWeight: 700, marginBottom: 4 }}>BGMファイルを選択</div>
            <div style={{ fontSize: 11, color: '#446' }}>MP3 / WAV / OGG（ループ再生）</div>
            {bgm.hasFile && <div style={{ marginTop: 10, fontSize: 11, color: '#44ffcc', background: 'rgba(40,120,80,.3)', borderRadius: 6, padding: '4px 12px', display: 'inline-block' }}>✓ {bgm.fileName}</div>}
            <input ref={fileRef} type="file" accept="audio/*" onChange={e => bgm.loadFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>
          {bgm.hasFile && (
            <div onClick={bgm.toggle}
              style={{ width: 60, height: 60, borderRadius: '50%', background: bgm.playing?'rgba(220,60,60,.9)':'linear-gradient(135deg,#1a6640,#0d3320)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer', border: '2px solid rgba(255,255,255,.15)' }}>
              {bgm.playing ? '⏸' : '▶'}
            </div>
          )}
          <div style={{ width: '100%', maxWidth: 340 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#aac' }}>🔊 音量</span>
              <span style={{ fontSize: 13, color: '#f5c842', fontWeight: 900 }}>{Math.round(bgm.volume * 100)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.05} value={bgm.volume} onChange={e => bgm.setVolume(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div style={{ fontSize: 11, color: '#446', textAlign: 'center', lineHeight: 2 }}>※ スタートを押した瞬間に再生開始<br />※ ループ再生・著作権フリー推奨</div>
          <div onClick={() => setModal(null)} style={{ background: 'linear-gradient(135deg,#1a6640,#0d3320)', color: '#fff', padding: '11px 32px', borderRadius: 11, cursor: 'pointer', fontSize: 15, fontWeight: 700, border: '1px solid rgba(255,255,255,.15)' }}>✅ 閉じる</div>
        </div>
      )}

      {/* タイトルメイン - 全部中央 */}
      {!modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          {/* ロゴ */}
          <img src="/assets/logo.webp" alt="イワテトリス" style={{
            height: 'clamp(60px,15vw,120px)', width: 'auto',
            maxWidth: '80vw',
            objectFit: 'contain',
            marginBottom: 'clamp(8px,2vw,16px)',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,.95)) drop-shadow(0 0 30px rgba(200,160,0,.3))',
            animation: 'logoFloat 3.5s ease-in-out infinite',
          }} />

          {/* サブタイトル */}
          <div style={{ fontSize: 'clamp(11px,2.5vw,16px)', color: '#f5c842', marginBottom: 'clamp(24px,5vw,48px)', letterSpacing: 2.5, fontWeight: 700, animation: 'neon 3s infinite' }}>
            盛岡冷麺を積み上げろ！
          </div>

          {/* メニューボタン - 中央揃え */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,14px)', width: '100%', maxWidth: 380, alignItems: 'stretch' }}>
            {menuItems.map(({ id, label, sub, icon, color }, idx) => (
              <div key={id} onClick={() => go(id)}
                style={{
                  background: 'rgba(5,15,50,0.88)',
                  border: `1.5px solid ${color}55`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 12,
                  padding: 'clamp(12px,2.5vw,18px) clamp(18px,3.5vw,26px)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(14px)',
                  animation: `menuIn .35s ${idx * .08}s both`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'transform .12s, background .12s',
                  boxShadow: `0 4px 20px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)`,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateX(5px)'; e.currentTarget.style.background='rgba(10,25,75,0.96)' }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.background='rgba(5,15,50,0.88)' }}>
                <div>
                  <div style={{ fontSize: 'clamp(15px,3.5vw,20px)', fontWeight: 900, color, lineHeight: 1.2, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 'clamp(9px,2vw,12px)', color: '#446' }}>{sub}</div>
                </div>
                <div style={{ fontSize: 'clamp(18px,4vw,26px)', flexShrink: 0, color, marginLeft: 16, opacity: .85 }}>{icon}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'clamp(16px,3vw,28px)', fontSize: 'clamp(9px,1.6vw,11px)', color: '#334', letterSpacing: 1 }}>
            v1.0.0 わんこそばバージョン
          </div>
        </div>
      )}
    </div>
  )
}
