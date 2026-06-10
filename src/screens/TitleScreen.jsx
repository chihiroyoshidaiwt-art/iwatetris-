import { useState, useRef } from 'react'
import GalaxyBg from '../components/GalaxyBg.jsx'
import GalaxyTrain from '../components/GalaxyTrain.jsx'
import { useBGM } from '../hooks/useBGM.js'
import logoImg  from '../assets/logo.webp'
import frameImg from '../assets/frame.webp'

const VERSIONS = [
  { id: 'wanko',     label: 'わんこそばバージョン', emoji: '🍜', desc: '盛岡名物・わんこそばをテトリスで積み上げろ！', available: true,  color: '#ffaa44' },
  { id: 'kenji',     label: '宮沢賢治バージョン',   emoji: '🌌', desc: '銀河鉄道の夜の世界でテトリス',               available: false, color: '#8888ff' },
  { id: 'takuboku',  label: '石川啄木バージョン',   emoji: '📝', desc: '故郷の歌と共に積み上げろ',                   available: false, color: '#ff8888' },
  { id: 'kindaichi', label: '金田一京助バージョン', emoji: '📚', desc: '言語学者の知識でブロックを解読せよ',         available: false, color: '#44ffaa' },
  { id: 'nitobe',    label: '新渡戸稲造バージョン', emoji: '⚔️',  desc: '武士道精神でブロックを積み上げろ',           available: false, color: '#ffcc44' },
]

export default function TitleScreen({ onStart, onAdmin }) {
  const [modal, setModal] = useState(null) // null | 'version' | 'bgm' | 'exit'
  const bgm = useBGM()
  const fileRef = useRef(null)

  const menuItems = [
    { id: 'start',    label: 'スタート',       color: '#ff9944', sub: '最初から始める',             icon: '▶' },
    { id: 'version',  label: 'バージョン選択', color: '#88aaff', sub: '5種類のバージョンから選ぶ',  icon: '☰' },
    { id: 'bgm',      label: 'BGM設定',        color: '#ffcc44', sub: bgm.hasFile ? (bgm.playing ? '♪ 再生中' : '♪ 停止中') : '音楽ファイルを設定', icon: '🎵' },
    { id: 'admin',    label: '管理画面',        color: '#cc88ff', sub: 'グリッド・背景を調整',       icon: '⚙️' },
    { id: 'exit',     label: '終了',            color: '#ff6666', sub: 'タブを閉じます',             icon: '✕' },
  ]

  const handleMenu = id => {
    if (id === 'start')   { bgm.play(); onStart('wanko') }
    if (id === 'version') setModal('version')
    if (id === 'bgm')     setModal('bgm')
    if (id === 'admin')   onAdmin()
    if (id === 'exit')    setModal('exit')
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color: '#fff', userSelect: 'none' }}>
      <style>{`
        @keyframes lf{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes neon{0%,100%{text-shadow:0 0 7px #00ffaa,0 0 14px #00cc88}50%{text-shadow:0 0 16px #00ffaa,0 0 30px #00ffaa}}
        @keyframes mi{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes ff{0%,100%{transform:rotate(0deg)}50%{transform:rotate(.8deg) scale(1.008)}}
        @keyframes trainRide{0%{transform:translateX(110vw)}100%{transform:translateX(-900px)}}
        @keyframes smoke{0%,100%{opacity:.26;transform:scale(.78) translateY(0)}50%{opacity:.6;transform:scale(1.22) translateY(-5px)}}
        @keyframes hlight{0%,100%{box-shadow:0 0 13px rgba(255,238,112,1)}50%{box-shadow:0 0 21px rgba(255,246,152,1)}}
        @keyframes wblink{0%,100%{opacity:.66}50%{opacity:1}}
        input[type=range]{-webkit-appearance:none;background:rgba(60,80,150,.4);border-radius:3px;outline:none;height:5px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#ffee66;cursor:pointer;}
      `}</style>

      <GalaxyBg />
      <GalaxyTrain bottom={0} />

      {/* バージョン選択モーダル */}
      {modal === 'version' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,2,12,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ fontSize: 'clamp(15px,4vw,20px)', fontWeight: 900, color: '#ffee66', marginBottom: 16 }}>バージョン選択</div>
          <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {VERSIONS.map(v => (
              <div key={v.id} onClick={() => { if (v.available) { bgm.play(); onStart(v.id); setModal(null) } }}
                style={{ background: v.available ? 'rgba(8,18,50,.9)' : 'rgba(4,8,24,.6)', border: `1.5px solid ${v.available ? v.color + '55' : 'rgba(40,60,100,.4)'}`, borderRadius: 11, padding: '12px 14px', cursor: v.available ? 'pointer' : 'default', opacity: v.available ? 1 : .5, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{v.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'clamp(11px,3vw,14px)', fontWeight: 700, color: v.available ? v.color : '#556', marginBottom: 2 }}>{v.label}</div>
                  <div style={{ fontSize: 'clamp(8px,2vw,10px)', color: '#556' }}>{v.desc}</div>
                </div>
                <div style={{ fontSize: 'clamp(9px,2vw,11px)', color: v.available ? '#44ffcc' : '#334', fontWeight: 700, flexShrink: 0 }}>{v.available ? '▶ プレイ' : '🔒 準備中'}</div>
              </div>
            ))}
          </div>
          <div onClick={() => setModal(null)} style={{ marginTop: 16, fontSize: 13, color: '#556', cursor: 'pointer', padding: '8px 20px', border: '1px solid rgba(60,90,160,.35)', borderRadius: 8 }}>← 戻る</div>
        </div>
      )}

      {/* BGM設定モーダル */}
      {modal === 'bgm' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,2,12,.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20 }}>
          <div style={{ fontSize: 'clamp(15px,4vw,20px)', fontWeight: 900, color: '#ffee66' }}>🎵 BGM設定</div>
          <div onClick={() => fileRef.current.click()} style={{ width: '100%', maxWidth: 320, background: 'rgba(8,18,50,.8)', border: '2px dashed rgba(80,120,200,.5)', borderRadius: 12, padding: '22px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🎵</div>
            <div style={{ fontSize: 13, color: '#88aaff', fontWeight: 700, marginBottom: 4 }}>音楽ファイルを選択</div>
            <div style={{ fontSize: 10, color: '#556' }}>MP3 / WAV / OGG（ループ再生）</div>
            {bgm.hasFile && <div style={{ marginTop: 8, fontSize: 11, color: '#44ffcc', background: 'rgba(40,120,80,.3)', borderRadius: 6, padding: '3px 10px', display: 'inline-block' }}>✓ {bgm.fileName}</div>}
            <input ref={fileRef} type="file" accept="audio/*" onChange={e => bgm.loadFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>
          {bgm.hasFile && (
            <div onClick={bgm.toggle} style={{ width: 60, height: 60, borderRadius: '50%', background: bgm.playing ? 'rgba(255,80,80,.9)' : 'linear-gradient(135deg,#228844,#116633)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer' }}>
              {bgm.playing ? '⏸' : '▶'}
            </div>
          )}
          <div style={{ width: '100%', maxWidth: 320 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#aac' }}>🔊 音量</span>
              <span style={{ fontSize: 12, color: '#ffee66', fontWeight: 900 }}>{Math.round(bgm.volume * 100)}%</span>
            </div>
            <input type="range" min={0} max={1} step={0.05} value={bgm.volume} onChange={e => bgm.setVolume(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#ffee66' }} />
          </div>
          <div style={{ fontSize: 10, color: '#445', textAlign: 'center', lineHeight: 1.9, maxWidth: 280 }}>
            ※ スタートを押した瞬間に再生開始されます<br />※ ループ再生・著作権フリー音楽を推奨
          </div>
          <div onClick={() => setModal(null)} style={{ background: 'linear-gradient(135deg,#228844,#116633)', color: '#fff', padding: '10px 30px', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>✅ 閉じる</div>
        </div>
      )}

      {/* 終了確認 */}
      {modal === 'exit' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,2,12,.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ fontSize: 'clamp(15px,4vw,20px)', fontWeight: 900, color: '#ff6666' }}>終了しますか？</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div onClick={() => window.close()} style={{ background: 'linear-gradient(135deg,#cc2244,#880022)', color: '#fff', padding: '10px 26px', borderRadius: 11, cursor: 'pointer', fontSize: 'clamp(13px,3vw,15px)', fontWeight: 700 }}>終了する</div>
            <div onClick={() => setModal(null)} style={{ background: 'rgba(8,18,50,.9)', color: '#aac', padding: '10px 26px', borderRadius: 11, cursor: 'pointer', fontSize: 'clamp(13px,3vw,15px)', border: '1px solid rgba(60,90,160,.4)' }}>キャンセル</div>
          </div>
        </div>
      )}

      {/* タイトルメイン */}
      {!modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2, display: 'flex' }}>
          {/* 左：岩手フレーム */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0 16px 12px' }}>
            <img src={frameImg} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', animation: 'ff 8s ease-in-out infinite' }} />
          </div>
          {/* 右：ロゴ＋メニュー */}
          <div style={{ width: 'min(58vw,320px)', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 16px 20px 8px' }}>
            <img src={logoImg} alt="イワテトリス" style={{ width: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'left', marginBottom: 'clamp(8px,2.5vw,16px)', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.95))', animation: 'lf 3s ease-in-out infinite' }} />
            <div style={{ fontSize: 'clamp(9px,2vw,12px)', color: '#00ffaa', marginBottom: 'clamp(12px,3.5vw,20px)', letterSpacing: 1.5, fontWeight: 700, animation: 'neon 2.5s infinite' }}>
              盛岡冷麺を積み上げろ！
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px,1.6vw,9px)' }}>
              {menuItems.map(({ id, label, color, sub, icon }, idx) => (
                <div key={id} onClick={() => handleMenu(id)}
                  style={{ background: 'rgba(4,12,32,.92)', border: `2px solid ${color}55`, borderRadius: 10, padding: 'clamp(8px,2vw,11px) clamp(11px,2.6vw,14px)', cursor: 'pointer', backdropFilter: 'blur(8px)', animation: `mi .32s ${idx * .065}s both`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 'clamp(12px,3vw,16px)', fontWeight: 900, color, lineHeight: 1.2, marginBottom: 1 }}>{label}</div>
                    <div style={{ fontSize: 'clamp(8px,1.8vw,10px)', color: '#556' }}>{sub}</div>
                  </div>
                  <div style={{ fontSize: 'clamp(14px,3.5vw,20px)', flexShrink: 0, color, marginLeft: 8 }}>{icon}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'clamp(8px,2vw,12px)', fontSize: 'clamp(7px,1.6vw,9px)', color: '#334', letterSpacing: 1 }}>v1.0.0 わんこそばバージョン</div>
          </div>
        </div>
      )}
    </div>
  )
}
