import { WankoBlock } from './WankoBlock.jsx'

// 岩手の形でマスクされたプレイフィールド
// レイヤー構造: 岩壁(最前面) → ブロック → グリッド → 背景
export default function IwatePlayfield({ width, height, cell, cols, rows, board, piece, ghostY, lineFlash }) {
  const boardW = cols * cell
  const boardH = rows * cell
  // グリッドをフィールド中央に配置
  const gridLeft = (width - boardW) / 2
  const gridTop  = (height - boardH) / 2

  return (
    <div style={{ position: 'relative', width, height, flexShrink: 0 }}>
      {/* グリッド + ブロック : 岩手の形でマスクされる */}
      <div style={{
        position: 'absolute', inset: 0,
        WebkitMaskImage: 'url(/assets/frame_mask.png)',
        maskImage: 'url(/assets/frame_mask.png)',
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        overflow: 'hidden',
      }}>
        {/* 背景（マスク内の暗い背景） */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,5,18,0.94)' }} />

        {/* グリッド線 */}
        <div style={{
          position: 'absolute', left: gridLeft, top: gridTop, width: boardW, height: boardH,
          backgroundImage: `linear-gradient(rgba(40,80,160,.32) 1px,transparent 1px),linear-gradient(90deg,rgba(40,80,160,.32) 1px,transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px`,
        }} />

        {/* ゴーストピース */}
        {piece && piece.cells.map((row, r) => row.map((v, c) => {
          if (!v) return null
          const nr = ghostY + r, nc = piece.x + c
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return null
          return <div key={`gh${r}-${c}`} style={{ position: 'absolute', top: gridTop + nr * cell, left: gridLeft + nc * cell, width: cell, height: cell, border: `2px dashed ${piece.color}38`, boxSizing: 'border-box' }} />
        }))}

        {/* 固定ブロック */}
        {board.map((row, r) => row.map((val, c) => {
          if (!val) return null
          return (
            <div key={`b${r}-${c}`} style={{ position: 'absolute', top: gridTop + r * cell, left: gridLeft + c * cell, width: cell, height: cell, border: `1px solid ${val.color}50`, boxSizing: 'border-box', overflow: 'hidden', background: lineFlash ? `${val.color}44` : 'transparent' }}>
              <WankoBlock size={cell} variant={val.variant || 0} />
            </div>
          )
        }))}

        {/* アクティブピース */}
        {piece && piece.cells.map((row, r) => row.map((v, c) => {
          if (!v) return null
          const nr = piece.y + r, nc = piece.x + c
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return null
          return (
            <div key={`p${r}-${c}`} style={{ position: 'absolute', top: gridTop + nr * cell, left: gridLeft + nc * cell, width: cell, height: cell, border: `1.5px solid ${piece.color}`, boxSizing: 'border-box', overflow: 'hidden', boxShadow: `0 0 8px ${piece.color}55` }}>
              <WankoBlock size={cell} variant={piece.variant || 0} />
            </div>
          )
        }))}

        {/* ライン消去フラッシュ */}
        {lineFlash && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,210,80,0.14)' }} />}
      </div>

      {/* 岩壁画像：最前面、ゲームエリアの上に重ねる（縁取りとして） */}
      <img
        src="/assets/frame.webp"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', zIndex: 5 }}
      />
    </div>
  )
}
