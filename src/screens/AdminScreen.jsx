import { useState, useEffect, useRef } from 'react'
import { useConfig, DEFAULT_CONFIG } from '../hooks/useConfig.js'
import frameImg from '../assets/frame.webp'
import logoImg  from '../assets/logo.webp'

const COLS = 10, ROWS = 20

const PAGES = [
  { id: 'grid', icon: '🎯', label: 'グリッド調整' },
  { id: 'bg',   icon: '🎨', label: '背景設定'     },
  { id: 'exp',  icon: '📋', label: 'エクスポート' },
]

const BG_THEMES = [
  { id: 'galaxy',   label: '🌌 銀河鉄道の夜', desc: '星空・岩手山・銀河鉄道' },
  { id: 'dark',     label: '⬛ ダーク',         desc: '単色の暗い背景' },
  { id: 'midnight', label: '🌃 ミッドナイト',   desc: '深夜の都市風' },
]

function Sidebar({ page, setPage }) {
  return (
    <div style={{ width: 180, flexShrink: 0, background: 'rgba(4,10,28,.97)', borderRight: '1px solid rgba(80,110,180,.28)', display: 'flex', flexDirection: 'column', padding: '14px 8px' }}>
      <img src={logoImg} alt="" style={{ height: 26, width: 'auto', maxWidth: '100%', objectFit: 'contain', objectPosition: 'left', marginBottom: 14, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,.8))' }} />
      <div style={{ fontSize: 10, color: '#445', marginBottom: 12, paddingLeft: 4 }}>管理画面</div>
      {PAGES.map(({ id, icon, label }) => (
        <div key={id} onClick={() => setPage(id)}
          style={{ padding: '10px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 3, background: page === id ? 'rgba(80,120,220,.25)' : 'transparent', border: page === id ? '1px solid rgba(100,150,255,.45)' : '1px solid transparent', color: page === id ? '#aaccff' : '#667', fontSize: 12, fontWeight: page === id ? 700 : 400, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15 }}>{icon}</span>{label}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 9, color: '#334', padding: '8px 4px', lineHeight: 1.8 }}>
        設定はブラウザに保存<br />ゲームに即反映されます
      </div>
    </div>
  )
}

function GridPage({ config, update, reset }) {
  const [frameOp, setFrameOp] = useState(0.55)
  const [showGrid, setShowGrid] = useState(true)
  const containerRef = useRef(null)
  const [pSize, setPSize] = useState(300)

  useEffect(() => {
    const obs = new ResizeObserver(entries => setPSize(Math.min(entries[0].contentRect.width - 32, 380)))
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const fs = pSize
  const iL = fs * config.innerLeft, iT = fs * config.innerTop, iW = fs * config.innerW, iH = fs * config.innerH
  const cell = Math.max(6, Math.min(Math.floor(iW / COLS), Math.floor(iH / ROWS)))
  const gW = cell * COLS, gH = cell * ROWS
  const gL = iL + (iW - gW) / 2, gT = iT + (iH - gH) / 2

  const sliders = [
    { key: 'innerLeft', label: '枠内側 左端',  min: 0.10, max: 0.50, step: 0.005 },
    { key: 'innerTop',  label: '枠内側 上端',  min: 0.02, max: 0.40, step: 0.005 },
    { key: 'innerW',    label: '内側 幅',       min: 0.20, max: 0.70, step: 0.005 },
    { key: 'innerH',    label: '内側 高さ',     min: 0.30, max: 0.90, step: 0.005 },
  ]

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* コントロール */}
      <div style={{ width: 230, flexShrink: 0, padding: '14px 12px', overflowY: 'auto', borderRight: '1px solid rgba(60,90,160,.2)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#aac', marginBottom: 10 }}>グリッド位置調整</div>
        <div style={{ fontSize: 10, color: '#556', marginBottom: 14, lineHeight: 1.7 }}>
          右のプレビューを見ながら<br />グリッドが枠の内側に<br />ぴったり収まるよう調整
        </div>

        {/* 枠透明度 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: '#88aaff' }}>枠の透明度（調整用）</span>
            <span style={{ fontSize: 11, color: '#ffee66', fontWeight: 900 }}>{Math.round(frameOp * 100)}%</span>
          </div>
          <input type="range" min={0.1} max={1} step={0.05} value={frameOp} onChange={e => setFrameOp(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#ffee66' }} />
        </div>

        {/* グリッド表示 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer' }} onClick={() => setShowGrid(v => !v)}>
          <div style={{ width: 34, height: 18, borderRadius: 9, background: showGrid ? '#44ffcc' : '#334', display: 'flex', alignItems: 'center', padding: '2px', transition: 'background .2s' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', transform: showGrid ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .2s' }} />
          </div>
          <span style={{ fontSize: 11, color: '#aac' }}>グリッド線を表示</span>
        </div>

        {/* スライダー */}
        {sliders.map(({ key, label, min, max, step }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#aac', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 11, color: '#ffee66', fontWeight: 900 }}>{config[key].toFixed(3)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={config[key]} onChange={e => update(key, parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#ffee66' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#446', marginTop: 2 }}>
              <span>{min}</span><span>{max}</span>
            </div>
          </div>
        ))}

        {/* プリセット */}
        <div style={{ borderTop: '1px solid rgba(60,90,160,.25)', paddingTop: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#556', marginBottom: 8 }}>プリセット</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { label: 'デフォルト', v: { innerLeft: .28, innerTop: .10, innerW: .44, innerH: .72 } },
              { label: '大きめ',     v: { innerLeft: .24, innerTop: .08, innerW: .50, innerH: .76 } },
              { label: '小さめ',     v: { innerLeft: .32, innerTop: .14, innerW: .36, innerH: .65 } },
            ].map(({ label, v }) => (
              <div key={label} onClick={() => Object.entries(v).forEach(([k, val]) => update(k, val))}
                style={{ flex: 1, minWidth: 56, background: 'rgba(40,60,120,.7)', border: '1px solid #446', borderRadius: 7, padding: '6px 4px', textAlign: 'center', fontSize: 10, cursor: 'pointer', color: '#88aaff' }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div onClick={reset} style={{ background: 'rgba(60,20,20,.7)', border: '1px solid rgba(200,60,60,.4)', borderRadius: 7, padding: '7px', textAlign: 'center', fontSize: 11, cursor: 'pointer', color: '#ff8888' }}>
          全設定をリセット
        </div>

        <div style={{ marginTop: 10, fontSize: 10, color: '#445', background: 'rgba(8,18,50,.6)', borderRadius: 7, padding: '7px 9px', lineHeight: 1.8 }}>
          グリッド: {gW}×{gH}px<br />セル: {cell}px
        </div>
      </div>

      {/* プレビュー */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(1,3,12,.8)', padding: 16, overflow: 'hidden' }}>
        <div style={{ fontSize: 11, color: '#446', marginBottom: 8 }}>リアルタイムプレビュー</div>
        <div style={{ position: 'relative', width: fs, height: fs, flexShrink: 0 }}>
          {showGrid && (
            <div style={{ position: 'absolute', left: gL, top: gT, width: gW, height: gH, zIndex: 1, background: 'rgba(2,6,20,.9)', backgroundImage: `linear-gradient(rgba(30,70,150,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(30,70,150,.6) 1px,transparent 1px)`, backgroundSize: `${cell}px ${cell}px`, border: '2px solid rgba(100,200,255,.5)' }} />
          )}
          <div style={{ position: 'absolute', left: iL, top: iT, width: iW, height: iH, zIndex: 2, border: '1.5px dashed rgba(255,220,80,.5)', background: 'rgba(255,220,80,.03)', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -15, left: 0, fontSize: 9, color: 'rgba(255,220,80,.7)', whiteSpace: 'nowrap' }}>内側エリア</div>
          </div>
          {/* サンプルブロック */}
          {showGrid && [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2]].map(([c, r], i) => (
            <div key={i} style={{ position: 'absolute', left: gL + c * cell, top: gT + r * cell, width: cell, height: cell, zIndex: 3, background: `hsla(${i * 40 + 30},70%,60%,.75)`, border: '1px solid rgba(255,255,255,.4)', boxSizing: 'border-box' }} />
          ))}
          <img src={frameImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4, pointerEvents: 'none', objectFit: 'contain', opacity: frameOp }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: '#446', background: 'rgba(10,20,50,.8)', borderRadius: 6, padding: '5px 12px' }}>
          枠透明度: {Math.round(frameOp * 100)}%　|　{COLS}×{ROWS}グリッド
        </div>
      </div>
    </div>
  )
}

function BgPage({ config, update }) {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#aac', marginBottom: 6 }}>背景テーマ</div>
      <div style={{ fontSize: 11, color: '#556', marginBottom: 20 }}>ゲーム中の背景を選択</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {BG_THEMES.map(({ id, label, desc }) => (
          <div key={id} onClick={() => update('bgTheme', id)}
            style={{ background: config.bgTheme === id ? 'rgba(60,100,200,.35)' : 'rgba(10,20,50,.7)', border: `2px solid ${config.bgTheme === id ? 'rgba(100,160,255,.7)' : 'rgba(40,70,140,.4)'}`, borderRadius: 11, padding: '14px 12px', cursor: 'pointer' }}>
            <div style={{ fontSize: 20, marginBottom: 5 }}>{label.split(' ')[0]}</div>
            <div style={{ fontSize: 12, color: config.bgTheme === id ? '#aaccff' : '#667', marginBottom: 4 }}>{label.split(' ').slice(1).join(' ')}</div>
            <div style={{ fontSize: 10, color: '#446' }}>{desc}</div>
            {config.bgTheme === id && <div style={{ fontSize: 10, color: '#44ffcc', marginTop: 4 }}>✓ 選択中</div>}
          </div>
        ))}
      </div>
      {config.bgTheme === 'dark' && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: '#aac', fontWeight: 700, marginBottom: 10 }}>背景カラー</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="color" value={config.bgColor} onChange={e => update('bgColor', e.target.value)} style={{ width: 48, height: 48, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
            <div style={{ fontSize: 13, color: '#aac' }}>{config.bgColor}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExportPage({ config }) {
  const [copied, setCopied] = useState('')
  const code = `// useConfig.jsのDEFAULT_CONFIGに貼り付け
export const DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};`
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied('ok'); setTimeout(() => setCopied(''), 2000) })
  }
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#aac', marginBottom: 6 }}>現在の設定値</div>
      <div style={{ fontSize: 11, color: '#556', marginBottom: 16 }}>この値はブラウザに自動保存されています。ゲームを再デプロイする際はこのコードを使ってください。</div>
      <div style={{ background: 'rgba(8,16,40,.7)', border: '1px solid rgba(100,150,255,.25)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(60,90,160,.2)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#ffee66' }}>useConfig.js 用コード</span>
          <div onClick={copy} style={{ fontSize: 11, cursor: 'pointer', color: copied ? '#afffcc' : '#667', background: 'rgba(20,40,80,.8)', border: '1px solid rgba(80,120,200,.4)', borderRadius: 6, padding: '4px 10px' }}>
            {copied ? '✅ コピー済み' : '📋 コピー'}
          </div>
        </div>
        <pre style={{ margin: 0, padding: '12px 14px', fontSize: 11, color: '#8ab', lineHeight: 1.7, overflowX: 'auto', fontFamily: "'Courier New',monospace" }}>{code}</pre>
      </div>
    </div>
  )
}

export default function AdminScreen({ onBack }) {
  const [page, setPage] = useState('grid')
  const { config, update, reset } = useConfig()

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", background: 'linear-gradient(170deg,#010a1e,#010410 50%,#010208)', color: '#fff', userSelect: 'none' }}>
      <style>{`
        *{box-sizing:border-box;}
        input[type=range]{-webkit-appearance:none;background:rgba(60,80,150,.4);border-radius:3px;outline:none;height:5px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#ffee66;cursor:pointer;box-shadow:0 0 6px rgba(255,238,100,.5);}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(80,120,200,.3);border-radius:2px;}
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', width: 180, flexShrink: 0 }}>
        {/* 戻るボタン */}
        <div onClick={onBack} style={{ padding: '12px 12px 0', cursor: 'pointer' }}>
          <div style={{ fontSize: 11, color: '#556', display: 'flex', alignItems: 'center', gap: 4 }}>← タイトルに戻る</div>
        </div>
        <Sidebar page={page} setPage={setPage} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {page === 'grid' && <GridPage config={config} update={update} reset={reset} />}
        {page === 'bg'   && <BgPage   config={config} update={update} />}
        {page === 'exp'  && <ExportPage config={config} />}
      </div>
    </div>
  )
}
