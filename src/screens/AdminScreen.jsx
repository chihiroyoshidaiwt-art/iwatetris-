import { useState, useEffect, useRef } from 'react'
import { useConfig, DEFAULT_CONFIG } from '../hooks/useConfig.js'

const COLS = 10

export default function AdminScreen({ onBack }) {
  const { config, update, reset } = useConfig()
  const [frameOp, setFrameOp]   = useState(0.5)
  const [showGrid, setShowGrid] = useState(true)
  const [pSize, setPSize]       = useState(400)
  const [copied, setCopied]     = useState(false)
  const containerRef = useRef(null)
  const rows = config.rows || 21

  useEffect(() => {
    const obs = new ResizeObserver(e => setPSize(Math.min(e[0].contentRect.width - 48, 500)))
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const fs = pSize
  const iL = fs * (config.innerLeft || .28)
  const iT = fs * (config.innerTop  || .10)
  const iW = fs * (config.innerW    || .44)
  const iH = fs * (config.innerH    || .72)
  const cell = Math.max(6, Math.min(Math.floor(iW / COLS), Math.floor(iH / rows)))
  const gW = cell * COLS, gH = cell * rows
  const gL = iL + (iW - gW) / 2, gT = iT + (iH - gH) / 2

  const sliders = [
    { key:'innerLeft', label:'枠内側 左端',       min:0.05, max:0.55, step:0.005 },
    { key:'innerTop',  label:'枠内側 上端',       min:0.02, max:0.45, step:0.005 },
    { key:'innerW',    label:'内側 幅',            min:0.15, max:0.80, step:0.005 },
    { key:'innerH',    label:'内側 高さ',          min:0.25, max:0.95, step:0.005 },
    { key:'rows',      label:`行数 (現在 ${rows}行)`, min:16, max:28, step:1, isInt:true },
  ]

  const copyCode = () => {
    const code = `export const DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};`
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', flexDirection:'column', overflow:'hidden', background:'linear-gradient(160deg,#010820,#010510)', color:'#fff', fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", userSelect:'none' }}>
      <style>{`
        *{box-sizing:border-box;}
        input[type=range]{-webkit-appearance:none;background:rgba(60,100,200,.35);border-radius:3px;outline:none;height:5px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#f5c842;cursor:pointer;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:rgba(80,120,200,.3);border-radius:2px;}
      `}</style>

      {/* Header */}
      <div style={{ height:52, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', background:'rgba(2,6,24,.97)', borderBottom:'1px solid rgba(80,120,200,.25)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <img src="/assets/logo.webp" alt="" style={{ height:26, width:'auto', objectFit:'contain', filter:'drop-shadow(0 1px 4px rgba(0,0,0,.9))' }} />
          <span style={{ fontSize:13, color:'#446' }}>管理画面 / グリッド調整</span>
        </div>
        <div onClick={onBack} style={{ fontSize:12, color:'#7eb8f7', cursor:'pointer', padding:'6px 14px', border:'1px solid rgba(100,150,220,.4)', borderRadius:7, background:'rgba(10,25,70,.7)' }}>← タイトルへ</div>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', minHeight:0, overflow:'hidden' }}>
        {/* Controls */}
        <div style={{ width:280, flexShrink:0, padding:'18px 16px', overflowY:'auto', borderRight:'1px solid rgba(80,120,200,.2)' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#7eb8f7', marginBottom:8 }}>グリッド位置・サイズ調整</div>
          <div style={{ fontSize:11, color:'#446', marginBottom:18, lineHeight:1.8 }}>枠の透明度を下げながらグリッドが岩手フレームの内側にぴったり収まるよう調整してください</div>

          {/* Frame opacity */}
          <div style={{ marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:12, color:'#7eb8f7', fontWeight:600 }}>枠の透明度（調整用）</span>
              <span style={{ fontSize:13, color:'#f5c842', fontWeight:900 }}>{Math.round(frameOp*100)}%</span>
            </div>
            <input type="range" min={0.05} max={1} step={0.05} value={frameOp} onChange={e=>setFrameOp(parseFloat(e.target.value))} style={{ width:'100%', accentColor:'#f5c842' }} />
          </div>

          {/* Grid toggle */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, cursor:'pointer' }} onClick={()=>setShowGrid(v=>!v)}>
            <div style={{ width:38, height:20, borderRadius:10, background:showGrid?'#f5c842':'#223', display:'flex', alignItems:'center', padding:'2px', transition:'background .2s' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', transform:showGrid?'translateX(18px)':'translateX(0)', transition:'transform .2s' }} />
            </div>
            <span style={{ fontSize:12, color:'#7eb8f7' }}>グリッド線を表示</span>
          </div>

          {/* Sliders */}
          {sliders.map(({ key, label, min, max, step, isInt }) => (
            <div key={key} style={{ marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:12, color:'#7eb8f7', fontWeight:600 }}>{label}</span>
                <span style={{ fontSize:13, color:'#f5c842', fontWeight:900, minWidth:44, textAlign:'right' }}>
                  {isInt ? (config[key]||min) : (config[key]||min).toFixed(3)}
                </span>
              </div>
              <input type="range" min={min} max={max} step={step} value={config[key]||min} onChange={e=>update(key, isInt?parseInt(e.target.value):parseFloat(e.target.value))} style={{ width:'100%', accentColor:'#f5c842' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'#335', marginTop:3 }}><span>{min}</span><span>{max}</span></div>
            </div>
          ))}

          {/* Presets */}
          <div style={{ borderTop:'1px solid rgba(80,120,200,.2)', paddingTop:12, marginBottom:12 }}>
            <div style={{ fontSize:10, color:'#446', marginBottom:8 }}>プリセット</div>
            <div style={{ display:'flex', gap:7 }}>
              {[
                { label:'デフォルト', v:{ innerLeft:.28, innerTop:.10, innerW:.44, innerH:.72, rows:21 } },
                { label:'大きめ',     v:{ innerLeft:.22, innerTop:.07, innerW:.52, innerH:.78, rows:21 } },
                { label:'小さめ',     v:{ innerLeft:.34, innerTop:.15, innerW:.34, innerH:.62, rows:20 } },
              ].map(({ label, v }) => (
                <div key={label} onClick={() => Object.entries(v).forEach(([k,val]) => update(k,val))}
                  style={{ flex:1, background:'rgba(20,40,100,.7)', border:'1px solid rgba(100,140,220,.4)', borderRadius:7, padding:'7px 4px', textAlign:'center', fontSize:11, cursor:'pointer', color:'#7eb8f7' }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div onClick={reset} style={{ background:'rgba(80,10,20,.7)', border:'1px solid rgba(200,50,60,.35)', borderRadius:8, padding:'9px', textAlign:'center', fontSize:12, cursor:'pointer', color:'#e88', marginBottom:10 }}>全設定をリセット</div>
          <div onClick={copyCode} style={{ background:copied?'rgba(40,120,80,.8)':'rgba(20,40,100,.7)', border:`1px solid ${copied?'rgba(68,255,180,.4)':'rgba(100,140,220,.4)'}`, borderRadius:8, padding:'9px', textAlign:'center', fontSize:12, cursor:'pointer', color:copied?'#44ffcc':'#7eb8f7', transition:'all .3s', marginBottom:14 }}>
            {copied ? '✅ コピーしました！' : '📋 設定コードをコピー'}
          </div>
          <div style={{ fontSize:10, color:'#335', background:'rgba(5,15,45,.6)', borderRadius:7, padding:'8px 10px', lineHeight:2 }}>
            グリッド: {gW}×{gH}px<br />セル: {cell}px　|　{COLS}×{rows}
          </div>
        </div>

        {/* Preview */}
        <div ref={containerRef} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(1,4,16,.88)', padding:20, overflow:'hidden' }}>
          <div style={{ fontSize:12, color:'#335', marginBottom:10 }}>リアルタイムプレビュー</div>
          <div style={{ position:'relative', width:fs, height:fs, flexShrink:0 }}>
            {showGrid && (
              <div style={{ position:'absolute', left:gL, top:gT, width:gW, height:gH, zIndex:1, background:'rgba(2,6,20,.9)', backgroundImage:`linear-gradient(rgba(40,100,200,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(40,100,200,.7) 1px,transparent 1px)`, backgroundSize:`${cell}px ${cell}px`, border:'2.5px solid rgba(126,184,247,.7)', boxShadow:'0 0 20px rgba(126,184,247,.15)' }} />
            )}
            <div style={{ position:'absolute', left:iL, top:iT, width:iW, height:iH, zIndex:2, border:'1.5px dashed rgba(245,200,66,.55)', background:'rgba(245,200,66,.03)', pointerEvents:'none' }}>
              <div style={{ position:'absolute', top:-18, left:0, fontSize:10, color:'rgba(245,200,66,.75)', whiteSpace:'nowrap', fontWeight:700 }}>内側エリア</div>
            </div>
            {showGrid && [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[0,2]].map(([c,r],i) => (
              <div key={i} style={{ position:'absolute', left:gL+c*cell, top:gT+r*cell, width:cell, height:cell, zIndex:3, background:`hsla(${i*50+200},80%,65%,.8)`, border:'1px solid rgba(255,255,255,.5)', boxSizing:'border-box' }} />
            ))}
            <img src="/assets/frame.webp" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:4, objectFit:'contain', opacity:frameOp, pointerEvents:'none' }} />
          </div>
          <div style={{ marginTop:12, fontSize:11, color:'#335', background:'rgba(5,15,45,.8)', borderRadius:6, padding:'6px 14px' }}>
            枠透明度: {Math.round(frameOp*100)}%　|　{COLS}列 × {rows}行　|　セル: {cell}px
          </div>
        </div>
      </div>
    </div>
  )
}
