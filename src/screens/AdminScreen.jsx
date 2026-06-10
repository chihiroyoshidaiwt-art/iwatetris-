import { useState, useEffect, useRef } from 'react'
import { useConfig, DEFAULT_CONFIG } from '../hooks/useConfig.js'

const PAGES = [
  { id: 'grid', icon: '🎯', label: 'グリッド調整' },
  { id: 'exp',  icon: '📋', label: 'エクスポート' },
]

function Sidebar({ page, setPage, onBack }) {
  return (
    <div style={{ width: 170, flexShrink: 0, background: 'rgba(2,8,28,.97)', borderRight: '1px solid rgba(80,120,200,.25)', display: 'flex', flexDirection: 'column', padding: '12px 8px' }}>
      <div onClick={onBack} style={{ fontSize: 11, color: '#446', cursor: 'pointer', marginBottom: 14, paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>← タイトルへ</div>
      <img src="/assets/logo.webp" alt="" style={{ height: 24, width: 'auto', maxWidth: '100%', objectFit: 'contain', objectPosition: 'left', marginBottom: 14, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,.8))' }} />
      <div style={{ fontSize: 10, color: '#335', marginBottom: 12, paddingLeft: 4 }}>管理画面</div>
      {PAGES.map(({ id, icon, label }) => (
        <div key={id} onClick={() => setPage(id)}
          style={{ padding: '10px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 3, background: page === id ? 'rgba(80,120,220,.25)' : 'transparent', border: page === id ? '1px solid rgba(100,150,255,.4)' : '1px solid transparent', color: page === id ? '#7eb8f7' : '#446', fontSize: 12, fontWeight: page === id ? 700 : 400, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15 }}>{icon}</span>{label}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 9, color: '#223', padding: '8px 4px', lineHeight: 1.8 }}>設定はブラウザに保存<br />ゲームに即反映されます</div>
    </div>
  )
}

const COLS = 10

function GridPage({ config, update, reset }) {
  const [frameOp, setFrameOp] = useState(0.55)
  const [showGrid, setShowGrid] = useState(true)
  const containerRef = useRef(null)
  const [pSize, setPSize] = useState(300)
  const ROWS = config.rows || 22

  useEffect(() => {
    const obs = new ResizeObserver(entries => setPSize(Math.min(entries[0].contentRect.width - 32, 400)))
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
    { key: 'rows',      label: `行数 (現在${ROWS}行)`, min: 18, max: 26, step: 1, isInt: true },
  ]

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* コントロール */}
      <div style={{ width: 230, flexShrink: 0, padding: '14px 12px', overflowY: 'auto', borderRight: '1px solid rgba(60,90,160,.2)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#7eb8f7', marginBottom: 10 }}>グリッド位置調整</div>
        <div style={{ fontSize: 10, color: '#446', marginBottom: 14, lineHeight: 1.7 }}>
          右のプレビューを見ながら<br />グリッドが枠内にぴったり<br />収まるよう調整してください
        </div>

        {/* 枠透明度 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: '#7eb8f7' }}>枠の透明度（調整用）</span>
            <span style={{ fontSize: 11, color: '#f5c842', fontWeight: 900 }}>{Math.round(frameOp * 100)}%</span>
          </div>
          <input type="range" min={0.1} max={1} step={0.05} value={frameOp} onChange={e => setFrameOp(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#f5c842' }} />
        </div>

        {/* グリッド表示 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer' }} onClick={() => setShowGrid(v => !v)}>
          <div style={{ width: 34, height: 18, borderRadius: 9, background: showGrid ? '#f5c842' : '#223', display: 'flex', alignItems: 'center', padding: '2px', transition: 'background .2s' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', transform: showGrid ? 'translateX(16px)' : 'translateX(0)', transition: 'transform .2s' }} />
          </div>
          <span style={{ fontSize: 11, color: '#7eb8f7' }}>グリッド線を表示</span>
        </div>

        {sliders.map(({ key, label, min, max, step, isInt }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#7eb8f7', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 11, color: '#f5c842', fontWeight: 900 }}>{isInt ? config[key] : config[key]?.toFixed(3)}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={config[key] || min} onChange={e => update(key, isInt ? parseInt(e.target.value) : parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#f5c842' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#335', marginTop: 2 }}>
              <span>{min}</span><span>{max}</span>
            </div>
          </div>
        ))}

        {/* プリセット */}
        <div style={{ borderTop: '1px solid rgba(60,90,160,.2)', paddingTop: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#446', marginBottom: 8 }}>プリセット</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { label: 'デフォルト', v: { innerLeft: .28, innerTop: .10, innerW: .44, innerH: .72, rows: 22 } },
              { label: '大きめ',     v: { innerLeft: .24, innerTop: .08, innerW: .50, innerH: .76, rows: 22 } },
              { label: '小さめ',     v: { innerLeft: .32, innerTop: .14, innerW: .36, innerH: .65, rows: 20 } },
            ].map(({ label, v }) => (
              <div key={label} onClick={() => Object.entries(v).forEach(([k, val]) => update(k, val))}
                style={{ flex: 1, minWidth: 56, background: 'rgba(20,40,100,.7)', border: '1px solid rgba(80,120,200,.4)', borderRadius: 7, padding: '6px 4px', textAlign: 'center', fontSize: 10, cursor: 'pointer', color: '#7eb8f7' }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div onClick={reset} style={{ background: 'rgba(60,10,20,.7)', border: '1px solid rgba(180,50,60,.35)', borderRadius: 7, padding: '7px', textAlign: 'center', fontSize: 11, cursor: 'pointer', color: '#e88' }}>
          全設定をリセット
        </div>

        <div style={{ marginTop: 10, fontSize: 10, color: '#335', background: 'rgba(5,15,45,.6)', borderRadius: 7, padding: '7px 9px', lineHeight: 1.8 }}>
          グリッド: {gW}×{gH}px<br />セル: {cell}px　|　{COLS}×{ROWS}
        </div>
      </div>

      {/* プレビュー */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(1,4,16,.8)', padding: 16, overflow: 'hidden' }}>
        <div style={{ fontSize: 11, color: '#335', marginBottom: 8 }}>リアルタイムプレビュー</div>
        <div style={{ position: 'relative', width: fs, height: fs, flexShrink: 0 }}>
          {showGrid && (
            <div style={{ position: 'absolute', left: gL, top: gT, width: gW, height: gH, zIndex: 1, background: 'rgba(2,6,20,.9)', backgroundImage: `linear-gradient(rgba(30,70,160,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(30,70,160,.6) 1px,transparent 1px)`, backgroundSize: `${cell}px ${cell}px`, border: '2px solid rgba(126,184,247,.5)' }} />
          )}
          <div style={{ position: 'absolute', left: iL, top: iT, width: iW, height: iH, zIndex: 2, border: '1.5px dashed rgba(245,200,66,.5)', background: 'rgba(245,200,66,.03)', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: -15, left: 0, fontSize: 9, color: 'rgba(245,200,66,.7)', whiteSpace: 'nowrap' }}>内側エリア</div>
          </div>
          {showGrid && [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2]].map(([c, r], i) => (
            <div key={i} style={{ position: 'absolute', left: gL + c * cell, top: gT + r * cell, width: cell, height: cell, zIndex: 3, background: `hsla(${i * 40 + 30},70%,60%,.75)`, border: '1px solid rgba(255,255,255,.4)', boxSizing: 'border-box' }} />
          ))}
          <img src="/assets/frame.webp" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 4, pointerEvents: 'none', objectFit: 'contain', opacity: frameOp }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: '#335', background: 'rgba(5,15,45,.8)', borderRadius: 6, padding: '5px 12px' }}>
          枠透明度: {Math.round(frameOp * 100)}%　|　{COLS}×{ROWS}グリッド
        </div>
      </div>
    </div>
  )
}

function ExportPage({ config }) {
  const [copied, setCopied] = useState(false)
  const code = `// src/hooks/useConfig.js の DEFAULT_CONFIG を以下に置き換え:\nexport const DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};`
  const copy = () => { navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#7eb8f7', marginBottom: 6 }}>現在の設定値</div>
      <div style={{ fontSize: 11, color: '#446', marginBottom: 16, lineHeight: 1.7 }}>ブラウザに自動保存されています。<br />GitHubに反映したい場合はこのコードを使ってください。</div>
      <div style={{ background: 'rgba(5,15,45,.7)', border: '1px solid rgba(80,120,200,.25)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(60,90,160,.2)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f5c842' }}>useConfig.js 用コード</span>
          <div onClick={copy} style={{ fontSize: 11, cursor: 'pointer', color: copied ? '#44ffcc' : '#446', background: 'rgba(20,40,100,.8)', border: '1px solid rgba(80,120,200,.4)', borderRadius: 6, padding: '4px 10px' }}>{copied ? '✅ コピー済み' : '📋 コピー'}</div>
        </div>
        <pre style={{ margin: 0, padding: '12px 14px', fontSize: 11, color: '#7eb8f7', lineHeight: 1.7, overflowX: 'auto', fontFamily: "'Courier New',monospace" }}>{code}</pre>
      </div>
    </div>
  )
}

export default function AdminScreen({ onBack }) {
  const [page, setPage] = useState('grid')
  const { config, update, reset } = useConfig()

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", background: 'linear-gradient(170deg,#010820,#010510 50%,#010310)', color: '#fff', userSelect: 'none' }}>
      <style>{`
        *{box-sizing:border-box;}
        input[type=range]{-webkit-appearance:none;background:rgba(60,90,180,.35);border-radius:3px;outline:none;height:4px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#f5c842;cursor:pointer;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(80,120,200,.3);border-radius:2px;}
      `}</style>
      <Sidebar page={page} setPage={setPage} onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {page === 'grid' && <GridPage config={config} update={update} reset={reset} />}
        {page === 'exp'  && <ExportPage config={config} />}
      </div>
    </div>
  )
}
