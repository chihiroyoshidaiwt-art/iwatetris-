import { useState, useRef } from 'react'
import { useBGM } from '../hooks/useBGM.js'

const VERSIONS = [
  { id: 'wanko',     label: 'わんこそばバージョン', emoji: '🍜', desc: '盛岡名物・わんこそばを積み上げろ！', available: true,  color: '#f5c842' },
  { id: 'kenji',     label: '宮沢賢治バージョン',   emoji: '🌌', desc: '銀河鉄道の夜の世界でテトリス',     available: false, color: '#7eb8f7' },
  { id: 'takuboku',  label: '石川啄木バージョン',   emoji: '📝', desc: '故郷の歌と共に積み上げろ',         available: false, color: '#a8d8a8' },
  { id: 'kindaichi', label: '金田一京助バージョン', emoji: '📚', desc: '言語学者の知識でブロックを解読せよ',available: false, color: '#f7c59f' },
  { id: 'nitobe',    label: '新渡戸稲造バージョン', emoji: '⚔️',  desc: '武士道精神でブロックを積み上げろ', available: false, color: '#e8d5b7' },
]

// 星エフェクト（純CSS）
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: 2 + Math.random() * 4,
    delay: Math.random() * 5,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: i % 3 === 0 ? '#fff' : i % 3 === 1 ? '#b8d4ff' : '#ffe88a',
          animation: `twinkle ${s.dur}s ${s.delay}s infinite`,
          boxShadow: `0 0 ${s.size * 2}px ${i % 3 === 0 ? '#fff' : '#b8d4ff'}`,
        }} />
      ))}
    </div>
  )
}

export default function TitleScreen({ onStart, onAdmin }) {
  const [modal, setModal] = useState(null)
  const bgm = useBGM()
  const fileRef = useRef(null)
  const isMobile = window.innerWidth < 768

  const menuItems = [
    { id: 'start',   label: 'スタート',       sub: '最初から始める',            icon: '▶', color: '#f5c842' },
    { id: 'version', label: 'バージョン選択', sub: '5種類から選ぶ',             icon: '☰', color: '#7eb8f7' },
    { id: 'bgm',     label: 'BGM設定',        sub: bgm.hasFile ? (bgm.playing ? '♪ 再生中' : '♪ 停止中') : '音楽を設定', icon: '♪', color: '#a8d8e8' },
    { id: 'admin',   label: '管理画面',        sub: 'グリッド・背景を調整',      icon: '⚙', color: '#c8b8e8' },
    { id: 'exit',    label: '終了',            sub: 'タブを閉じます',            icon: '×', color: '#e88888' },
  ]

  const go = id => {
    if (id === 'start')   { bgm.play(); onStart('wanko') }
    if (id === 'version') setModal('version')
    if (id === 'bgm')     setModal('bgm')
    if (id === 'admin')   onAdmin()
    if (id === 'exit')    setModal('exit')
  }

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",
      color: '#fff', userSelect: 'none', position: 'relative',
    }}>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.2;transform:scale(.6)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes shoot { 0%{transform:translateX(0) translateY(0);opacity:1} 100%{transform:translateX(400px) translateY(200px);opacity:0} }
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes menuSlide { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes frameFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(0.5deg)} }
        @keyframes neon { 0%,100%{text-shadow:0 0 8px #f5c842,0 0 20px #f5c84288} 50%{text-shadow:0 0 16px #f5c842,0 0 40px #f5c842} }
        input[type=range]{-webkit-appearance:none;background:rgba(100,140,200,.35);border-radius:3px;outline:none;height:4px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#f5c842;cursor:pointer;}
      `}</style>

      {/* 背景画像 */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url(/assets/${isMobile ? 'bg_sp' : 'bg_pc'}.webp)`,
        backgroundSize: 'cover', backgroundPosition: 'center bottom',
      }} />
      {/* 背景オーバーレイ（UI読みやすく） */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(0,5,20,0.45)' }} />

      <StarField />

      {/* 流れ星 */}
      {[0,1,2].map(i => (
        <div key={i} style={{
          position: 'fixed', zIndex: 1, pointerEvents: 'none',
          top: `${5 + i * 8}%`, left: `${5 + i * 12}%`,
          width: 60, height: 1.5, borderRadius: 1,
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(200,230,255,.3))',
          animation: `shoot ${3.5 + i * 1.8}s ${i * 4 + 2}s infinite`,
          opacity: 0,
        }} />
      ))}

      {/* バージョン選択 */}
      {modal === 'version' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,5,20,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ fontSize: 'clamp(15px,4vw,20px)', fontWeight: 900, color: '#f5c842', marginBottom: 16, letterSpacing: 2 }}>バージョン選択</div>
          <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VERSIONS.map(v => (
              <div key={v.id} onClick={() => { if (v.available) { bgm.play(); onStart(v.id); setModal(null) } }}
                style={{ background: v.available ? 'rgba(10,20,60,.92)' : 'rgba(5,10,30,.6)', border: `1.5px solid ${v.available ? v.color + '66' : 'rgba(60,80,140,.4)'}`, borderRadius: 12, padding: '13px 16px', cursor: v.available ? 'pointer' : 'default', opacity: v.available ? 1 : .45, display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>{v.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'clamp(12px,3vw,15px)', fontWeight: 700, color: v.available ? v.color : '#446', marginBottom: 3 }}>{v.label}</div>
                  <div style={{ fontSize: 'clamp(9px,2vw,11px)', color: '#557' }}>{v.desc}</div>
                </div>
                <div style={{ fontSize: 11, color: v.available ? '#44ffcc' : '#335', fontWeight: 700, flexShrink: 0 }}>{v.available ? '▶ プレイ' : '🔒 準備中'}</div>
              </div>
            ))}
          </div>
          <div onClick={() => setModal(null)} style={{ marginTop: 18, fontSize: 13, color: '#557', cursor: 'pointer', padding: '8px 22px', border: '1px solid rgba(80,110,180,.35)', borderRadius: 8 }}>← 戻る</div>
        </div>
      )}

      {/* BGM */}
      {modal === 'bgm' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,5,20,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20 }}>
          <div style={{ fontSize: 'clamp(15px,4vw,20px)', fontWeight: 900, color: '#f5c842' }}>♪ BGM設定</div>
          <div onClick={() => fileRef.current.click()} style={{ width: '100%', maxWidth: 320, background: 'rgba(10,20,60,.8)', border: '2px dashed rgba(100,140,220,.5)', borderRadius: 12, padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>♪</div>
            <div style={{ fontSize: 13, color: '#7eb8f7', fontWeight: 700, marginBottom: 4 }}>音楽ファイルを選択</div>
            <div style={{ fontSize: 10, color: '#446' }}>MP3 / WAV / OGG（ループ再生）</div>
            {bgm.hasFile && <div style={{ marginTop: 8, fontSize: 11, color: '#44ffcc', background: 'rgba(40,120,80,.3)', borderRadius: 6, padding: '3px 10px', display: 'inline-block' }}>✓ {bgm.fileName}</div>}
            <input ref={fileRef} type="file" accept="audio/*" onChange={e => bgm.loadFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>
          {bgm.hasFile && <div onClick={bgm.toggle} style={{ width: 56, height: 56, borderRadius: '50%', background: bgm.playing ? 'rgba(220,60,60,.9)' : 'linear-gradient(135deg,#1a6640,#0d3320)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, cursor: 'pointer', border: '2px solid rgba(255,255,255,.2)' }}>{bgm.playing ? '⏸' : '▶'}</div>}
          <div style={{ width: '100%', maxWidth: 320 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#aac' }}>🔊 音量</span>
              <span style={{ fontSize: 12, color: '#f5c842', fontWeight: 900 }}>{Math.round(bgm.volume * 100)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.05} value={bgm.volume} onChange={e => bgm.setVolume(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div style={{ fontSize: 10, color: '#446', textAlign: 'center', lineHeight: 1.9 }}>※ スタートを押した瞬間に再生開始<br />※ ループ再生・著作権フリー推奨</div>
          <div onClick={() => setModal(null)} style={{ background: 'linear-gradient(135deg,#1a6640,#0d3320)', color: '#fff', padding: '10px 30px', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 700, border: '1px solid rgba(255,255,255,.15)' }}>✅ 閉じる</div>
        </div>
      )}

      {/* 終了確認 */}
      {modal === 'exit' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,5,20,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ fontSize: 'clamp(15px,4vw,20px)', fontWeight: 900, color: '#e88888' }}>終了しますか？</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div onClick={() => window.close()} style={{ background: 'linear-gradient(135deg,#aa2040,#660020)', color: '#fff', padding: '10px 26px', borderRadius: 11, cursor: 'pointer', fontSize: 'clamp(13px,3vw,15px)', fontWeight: 700 }}>終了する</div>
            <div onClick={() => setModal(null)} style={{ background: 'rgba(10,20,60,.9)', color: '#aac', padding: '10px 26px', borderRadius: 11, cursor: 'pointer', fontSize: 'clamp(13px,3vw,15px)', border: '1px solid rgba(80,110,180,.4)' }}>キャンセル</div>
          </div>
        </div>
      )}

      {/* タイトルメイン */}
      {!modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center' }}>

          {/* 岩手フレーム */}
          <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '20px 20px 0' : '20px 10px 20px 40px', maxHeight: isMobile ? '45vh' : '100vh' }}>
            <img src="/assets/frame.webp" alt="" style={{
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain',
              animation: 'frameFloat 6s ease-in-out infinite',
              filter: 'drop-shadow(0 0 20px rgba(100,160,255,.25))',
            }} />
          </div>

          {/* ロゴ＋メニュー */}
          <div style={{
            width: isMobile ? '100%' : 'min(52vw,360px)',
            flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center',
            padding: isMobile ? '12px 20px 20px' : '20px 40px 20px 20px',
          }}>
            {/* ロゴ */}
            <img src="/assets/logo.webp" alt="イワテトリス" style={{
              width: '100%', height: 'auto',
              objectFit: 'contain', objectPosition: 'left',
              maxHeight: isMobile ? 60 : 90,
              marginBottom: isMobile ? 6 : 12,
              filter: 'drop-shadow(0 2px 12px rgba(0,0,0,.9))',
              animation: 'logoFloat 3s ease-in-out infinite',
            }} />

            {/* サブタイトル */}
            <div style={{
              fontSize: 'clamp(10px,2.2vw,13px)', color: '#f5c842',
              marginBottom: isMobile ? 12 : 20,
              letterSpacing: 2, fontWeight: 700,
              animation: 'neon 3s infinite',
            }}>盛岡冷麺を積み上げろ！</div>

            {/* メニュー */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 7 : 10 }}>
              {menuItems.map(({ id, label, sub, icon, color }, idx) => (
                <div key={id} onClick={() => go(id)}
                  style={{
                    background: 'rgba(5,15,45,0.85)',
                    border: `1.5px solid ${color}44`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 10,
                    padding: isMobile ? '9px 14px' : '12px 18px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(12px)',
                    animation: `menuSlide .3s ${idx * .06}s both`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'transform .1s, background .1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.background = 'rgba(10,25,70,0.95)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'rgba(5,15,45,0.85)' }}>
                  <div>
                    <div style={{ fontSize: 'clamp(13px,3.2vw,17px)', fontWeight: 900, color, lineHeight: 1.2, marginBottom: 1 }}>{label}</div>
                    <div style={{ fontSize: 'clamp(8px,1.8vw,10px)', color: '#557' }}>{sub}</div>
                  </div>
                  <div style={{ fontSize: 'clamp(16px,3.8vw,22px)', flexShrink: 0, color, marginLeft: 10, opacity: .8 }}>{icon}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: isMobile ? 8 : 14, fontSize: 9, color: '#334', letterSpacing: 1 }}>v1.0.0 わんこそばバージョン</div>
          </div>
        </div>
      )}
    </div>
  )
}
