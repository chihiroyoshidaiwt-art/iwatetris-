import { WankoBlock } from './WankoBlock.jsx'

// レイヤー順（最重要）: 背景 → マス → ブロック → 岩壁（最前面）
// 岩壁は CSS mask で「内側だけ表示される」仕組みと、見た目用の画像オーバーレイの二重構造
export default function IwatePlayfield({ fieldW, fieldH, config, cols, rows, board, piece, ghostY, lineFlash }) {
  // 岩壁サイズ：フィールドの frameScale 倍、正方形（元画像が1024x1024）
  const frameBase = Math.min(fieldW, fieldH)
  const frameSize = frameBase * (config.frameScale || 0.9)
  const frameLeft = (fieldW - frameSize) / 2 + (config.frameX || 0)
  const frameTop  = (fieldH - frameSize) / 2 + (config.frameY || 0)

  // グリッド：岩壁の内側に収める
  const gridAreaW = frameSize * (config.gridScaleW || 0.62)
  const gridAreaH = frameSize * (config.gridScaleH || 0.82)
  const cell = Math.floor(Math.min(gridAreaW / cols, gridAreaH / rows))
  const boardW = cell * cols
  const boardH = cell * rows
  const gridLeft = frameLeft + (frameSize - boardW) / 2 + (config.gridX || 0)
  const gridTop  = frameTop  + (frameSize - boardH) / 2 + (config.gridY || 0)

  return (
    <div style={{ position: 'relative', width: fieldW, height: fieldH, flexShrink: 0 }}>
      {/* マス（グリッド）+ ブロック : z-index 低 */}
      <div style={{
        position: 'absolute',
        left: frameLeft, top: frameTop, width: frameSize, height: frameSize,
        WebkitMaskImage: 'url(/assets/frame_mask.png)',
        maskImage: 'url(/assets/frame_mask.png)',
        WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        overflow: 'hidden',
        zIndex: 2,
        transform: `rotate(${config.frameRotate || 0}deg)`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,5,18,0.95)' }} />

        <div style={{
          position: 'absolute',
          left: gridLeft - frameLeft, top: gridTop - frameTop, width: boardW, height: boardH,
          backgroundImage: `linear-gradient(rgba(40,80,160,.34) 1px,transparent 1px),linear-gradient(90deg,rgba(40,80,160,.34) 1px,transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px`,
        }} />

        {piece && piece.cells.map((row, r) => row.map((v, c) => {
          if (!v) return null
          const nr = ghostY + r, nc = piece.x + c
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return null
          return <div key={`gh${r}-${c}`} style={{ position: 'absolute', top: (gridTop - frameTop) + nr * cell, left: (gridLeft - frameLeft) + nc * cell, width: cell, height: cell, border: `2px dashed ${piece.color}38`, boxSizing: 'border-box' }} />
        }))}

        {board.map((row, r) => row.map((val, c) => {
          if (!val) return null
          return (
            <div key={`b${r}-${c}`} style={{ position: 'absolute', top: (gridTop - frameTop) + r * cell, left: (gridLeft - frameLeft) + c * cell, width: cell, height: cell, border: `1px solid ${val.color}50`, boxSizing: 'border-box', overflow: 'hidden', background: lineFlash ? `${val.color}44` : 'transparent' }}>
              <WankoBlock size={cell} variant={val.variant || 0} />
            </div>
          )
        }))}

        {piece && piece.cells.map((row, r) => row.map((v, c) => {
          if (!v) return null
          const nr = piece.y + r, nc = piece.x + c
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return null
          return (
            <div key={`p${r}-${c}`} style={{ position: 'absolute', top: (gridTop - frameTop) + nr * cell, left: (gridLeft - frameLeft) + nc * cell, width: cell, height: cell, border: `1.5px solid ${piece.color}`, boxSizing: 'border-box', overflow: 'hidden', boxShadow: `0 0 8px ${piece.color}55` }}>
              <WankoBlock size={cell} variant={piece.variant || 0} />
            </div>
          )
        }))}

        {lineFlash && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,210,80,0.16)' }} />}
      </div>

      {/* 岩壁画像：最前面 z-index 高 */}
      <img
        src="/assets/frame.webp"
        alt=""
        style={{
          position: 'absolute', left: frameLeft, top: frameTop, width: frameSize, height: frameSize,
          objectFit: 'contain', pointerEvents: 'none', zIndex: 5,
          opacity: config.frameOpacity ?? 1,
          transform: `rotate(${config.frameRotate || 0}deg)`,
        }}
      />
    </div>
  )
}
