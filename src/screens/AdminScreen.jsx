import { useState, useEffect, useRef } from 'react'
import { useConfig } from '../hooks/useConfig.js'
import IwatePlayfield from '../components/IwatePlayfield.jsx'
import { COLORS } from '../theme.js'

const TABS = [
  { id:'frame', label:'岩壁' },
  { id:'grid',  label:'マス' },
  { id:'ui',    label:'UI' },
  { id:'bg',    label:'背景' },
]

function Slider({ label, value, min, max, step, onChange, suffix = '' }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:12, color:COLORS.blue, fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:13, color:COLORS.gold, fontWeight:900 }}>{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))} style={{ width:'100%', accentColor:COLORS.gold }} />
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#335', marginTop:3 }}><span>{min}</span><span>{max}</span></div>
    </div>
  )
}

export default function AdminScreen({ onBack }) {
  const { config, update, reset } = useConfig()
  const [tab, setTab] = useState('frame')
  const [copied, setCopied] = useState(false)
  const [pSize, setPSize] = useState(420)
  const containerRef = useRef(null)

  useEffect(() => {
    const obs = new ResizeObserver(e => setPSize(Math.min(e[0].contentRect.width - 48, 560)))
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const copyCode = () => {
    const code = `export const DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};`
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  // ダミーのテトリス状態（プレビュー用）
  const dummyBoard = Array.from({ length: config.rows || 21 }, (_, r) => Array.from({ length: config.cols || 10 }, (_, c) => {
    if (r >= (config.rows||21) - 3 && (r+c) % 2 === 0) return { color: '#c8a020', variant: (r+c)%5 }
    return null
  }))

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden', background:`linear-gradient(160deg,${COLORS.bg},${COLORS.navy})`, color:'#fff', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", userSelect:'none' }}>
      <style>{`
        *{box-sizing:border-box;}
        input[type=range]{-webkit-appearance:none;background:rgba(73,168,255,.3);border-radius:3px;outline:none;height:5px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${COLORS.gold};cursor:pointer;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(73,168,255,.3);border-radius:2px;}
      `}</style>

      {/* Header */}
      <div style={{ height:54, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', background:'rgba(2,8,23,.97)', borderBottom:`1px solid ${COLORS.blue}30` }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <img src="/assets/logo.webp" alt="" style={{ height:26, width:'auto', objectFit:'contain' }} />
          <span style={{ fontSize:13, color:'#557' }}>管理画面 /admin</span>
        </div>
        <div onClick={onBack} style={{ fontSize:12, color:COLORS.blue, cursor:'pointer', padding:'6px 14px', border:`1px solid ${COLORS.blue}50`, borderRadius:7, background:'rgba(10,25,70,.7)' }}>← タイトルへ</div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, padding:'10px 16px 0', flexShrink:0 }}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ padding:'8px 18px', borderRadius:'8px 8px 0 0', cursor:'pointer', fontSize:13, fontWeight:700, background: tab===t.id ? 'rgba(73,168,255,.18)' : 'transparent', color: tab===t.id ? COLORS.blue : '#557', borderBottom: tab===t.id ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', minHeight:0, overflow:'hidden' }}>
        {/* Controls */}
        <div style={{ width:300, flexShrink:0, padding:'18px 18px', overflowY:'auto', borderRight:`1px solid ${COLORS.blue}20` }}>

          {tab === 'frame' && (
            <>
              <div style={{ fontSize:14, fontWeight:700, color:COLORS.blue, marginBottom:14 }}>岩壁設定</div>
              <Slider label="サイズ（フィールド比）" value={config.frameScale} min={0.5} max={1.3} step={0.01} onChange={v=>update('frameScale',v)} />
              <Slider label="X座標オフセット" value={config.frameX} min={-100} max={100} step={1} onChange={v=>update('frameX',v)} suffix="px" />
              <Slider label="Y座標オフセット" value={config.frameY} min={-100} max={100} step={1} onChange={v=>update('frameY',v)} suffix="px" />
              <Slider label="回転" value={config.frameRotate} min={-15} max={15} step={0.5} onChange={v=>update('frameRotate',v)} suffix="°" />
              <Slider label="透明度" value={config.frameOpacity} min={0.1} max={1} step={0.05} onChange={v=>update('frameOpacity',v)} />
            </>
          )}

          {tab === 'grid' && (
            <>
              <div style={{ fontSize:14, fontWeight:700, color:COLORS.blue, marginBottom:14 }}>マス設定</div>
              <Slider label="横マス数" value={config.cols} min={6} max={14} step={1} onChange={v=>update('cols',v)} />
              <Slider label="縦マス数" value={config.rows} min={14} max={28} step={1} onChange={v=>update('rows',v)} />
              <Slider label="グリッド幅（岩壁比）" value={config.gridScaleW} min={0.3} max={0.9} step={0.01} onChange={v=>update('gridScaleW',v)} />
              <Slider label="グリッド高さ（岩壁比）" value={config.gridScaleH} min={0.3} max={0.95} step={0.01} onChange={v=>update('gridScaleH',v)} />
              <Slider label="X座標オフセット" value={config.gridX} min={-60} max={60} step={1} onChange={v=>update('gridX',v)} suffix="px" />
              <Slider label="Y座標オフセット" value={config.gridY} min={-60} max={60} step={1} onChange={v=>update('gridY',v)} suffix="px" />
            </>
          )}

          {tab === 'ui' && (
            <>
              <div style={{ fontSize:14, fontWeight:700, color:COLORS.blue, marginBottom:14 }}>UI設定</div>
              <Slider label="タイトルサイズ倍率" value={config.titleSize} min={0.6} max={1.6} step={0.05} onChange={v=>update('titleSize',v)} />
              <Slider label="フォントサイズ倍率" value={config.fontScale} min={0.7} max={1.4} step={0.05} onChange={v=>update('fontScale',v)} />
              <Slider label="HOLDサイズ倍率" value={config.holdSize} min={0.5} max={1.5} step={0.05} onChange={v=>update('holdSize',v)} />
              <Slider label="NEXTサイズ倍率" value={config.nextSize} min={0.5} max={1.5} step={0.05} onChange={v=>update('nextSize',v)} />
            </>
          )}

          {tab === 'bg' && (
            <>
              <div style={{ fontSize:14, fontWeight:700, color:COLORS.blue, marginBottom:14 }}>背景設定</div>
              <Slider label="明るさ" value={config.bgBrightness} min={0.3} max={1.2} step={0.05} onChange={v=>update('bgBrightness',v)} />
              <Slider label="ぼかし" value={config.bgBlur} min={0} max={12} step={0.5} onChange={v=>update('bgBlur',v)} suffix="px" />
              <Slider label="オーバーレイ透明度" value={config.bgOpacity} min={0} max={0.9} step={0.05} onChange={v=>update('bgOpacity',v)} />
            </>
          )}

          <div style={{ borderTop:`1px solid ${COLORS.blue}20`, paddingTop:16, marginTop:8 }}>
            <div onClick={reset} style={{ background:'rgba(200,40,40,.2)', border:'1px solid rgba(200,60,60,.4)', borderRadius:8, padding:'9px', textAlign:'center', fontSize:12, cursor:'pointer', color:'#f88', marginBottom:10 }}>全設定をリセット</div>
            <div onClick={copyCode} style={{ background:copied?'rgba(80,255,212,.2)':'rgba(73,168,255,.15)', border:`1px solid ${copied?COLORS.emerald+'66':COLORS.blue+'50'}`, borderRadius:8, padding:'9px', textAlign:'center', fontSize:12, cursor:'pointer', color:copied?COLORS.emerald:COLORS.blue, transition:'all .3s' }}>
              {copied ? '✅ コピーしました！（即時保存済み）' : '📋 設定コードをコピー'}
            </div>
            <div style={{ fontSize:10, color:'#446', marginTop:10, lineHeight:1.8 }}>※ 変更は自動でlocalStorageに保存され、即座にゲームへ反映されます</div>
          </div>
        </div>

        {/* Preview */}
        <div ref={containerRef} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(1,4,16,.5)', padding:24, overflow:'hidden' }}>
          <div style={{ fontSize:12, color:'#557', marginBottom:14 }}>リアルタイムプレビュー</div>
          <IwatePlayfield
            fieldW={pSize} fieldH={pSize * 1.4}
            config={config}
            cols={config.cols} rows={config.rows}
            board={dummyBoard}
            piece={null} ghostY={0} lineFlash={false}
          />
          <div style={{ marginTop:16, fontSize:11, color:'#446', background:'rgba(5,15,45,.6)', borderRadius:7, padding:'8px 18px', lineHeight:1.9, textAlign:'center' }}>
            岩壁: {Math.round(config.frameScale*100)}%　|　グリッド: {config.cols}×{config.rows}　|　透明度: {Math.round(config.frameOpacity*100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
