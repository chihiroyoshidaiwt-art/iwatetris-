import { useState, useCallback, useRef, useEffect } from 'react'

export const COLS = 10
export const ROWS = 21

export const SHAPES = {
  I: { cells: [[1,1,1,1]],         color: '#e8341a', variant: 0 },
  O: { cells: [[1,1],[1,1]],       color: '#c8780a', variant: 1 },
  T: { cells: [[0,1,0],[1,1,1]],   color: '#d44010', variant: 2 },
  L: { cells: [[0,0,1],[1,1,1]],   color: '#b02010', variant: 3 },
  J: { cells: [[1,0,0],[1,1,1]],   color: '#982010', variant: 4 },
  S: { cells: [[0,1,1],[1,1,0]],   color: '#e05028', variant: 0 },
  Z: { cells: [[1,1,0],[0,1,1]],   color: '#c83820', variant: 2 },
}
export const SHAPE_KEYS = Object.keys(SHAPES)

export const COMBO_LABELS  = ['', '1杯！', '2杯！', '3杯！', '4杯！', 'わんこそば名人！']
export const SCORE_TABLE   = [0, 100, 300, 600, 1200]

export const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null))
export const rotate     = m  => m[0].map((_, i) => m.map(r => r[i]).reverse())

export function randomPiece() {
  const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)]
  const { cells, color, variant } = SHAPES[key]
  return { key, cells, color, variant, x: Math.floor(COLS / 2) - Math.floor(cells[0].length / 2), y: 0 }
}

export function collides(board, cells, x, y) {
  for (let r = 0; r < cells.length; r++)
    for (let c = 0; c < cells[r].length; c++) {
      if (!cells[r][c]) continue
      const nr = y + r, nc = x + c
      if (nr >= ROWS || nc < 0 || nc >= COLS || (nr >= 0 && board[nr][nc])) return true
    }
  return false
}

export function ghostY(board, cells, x, y) {
  let gy = y
  while (!collides(board, cells, x, gy + 1)) gy++
  return gy
}

export function clearLines(board) {
  let count = 0
  const next = board.filter(row => { if (row.every(c => c)) { count++; return false } return true })
  while (next.length < ROWS) next.unshift(Array(COLS).fill(null))
  return { board: next, count }
}

export function useTetris() {
  const [board,       setBoard]      = useState(emptyBoard)
  const [piece,       setPiece]      = useState(randomPiece)
  const [nextPieces,  setNext]       = useState(() => [randomPiece(), randomPiece(), randomPiece()])
  const [hold,        setHold]       = useState(null)
  const [canHold,     setCanHold]    = useState(true)
  const [score,       setScore]      = useState(0)
  const [lines,       setLines]      = useState(0)
  const [combo,       setCombo]      = useState(0)
  const [level,       setLevel]      = useState(1)
  const [over,        setOver]       = useState(false)
  const [paused,      setPaused]     = useState(false)
  const [started,     setStarted]    = useState(false)
  const [comboAnim,   setComboAnim]  = useState(null)
  const [lineFlash,   setLineFlash]  = useState(false)

  const S = useRef({})
  useEffect(() => { S.current = { board, piece, nextPieces, hold, canHold, score, lines, combo, level, over, paused, started } })

  const speed = Math.max(80, 900 - (level - 1) * 80)

  const spawnPiece = useCallback((b, queue) => {
    const [nxt, ...rest] = queue
    const nn = randomPiece()
    if (collides(b, nxt.cells, nxt.x, nxt.y)) { setOver(true); return }
    setPiece(nxt); setNext([...rest, nn]); setCanHold(true)
  }, [])

  const lockPiece = useCallback((b, p) => {
    const nb = b.map(r => [...r])
    p.cells.forEach((row, r) => row.forEach((v, c) => {
      if (v) { const nr = p.y + r, nc = p.x + c; if (nr >= 0) nb[nr][nc] = { color: p.color, variant: p.variant } }
    }))
    const { board: cb, count } = clearLines(nb)
    const { combo: prevCombo, score: prevScore, lines: prevLines, level: prevLevel } = S.current
    const newCombo = count > 0 ? prevCombo + 1 : 0
    const pts = (SCORE_TABLE[count] || 0) * prevLevel + (newCombo > 1 ? newCombo * 50 : 0)
    const newScore = prevScore + pts
    const newLines = prevLines + count
    const newLevel = Math.floor(newLines / 10) + 1
    setBoard(cb); setScore(newScore); setLines(newLines); setLevel(newLevel); setCombo(newCombo)
    if (count > 0) {
      setLineFlash(true); setTimeout(() => setLineFlash(false), 320)
      const label = COMBO_LABELS[Math.min(newCombo, 5)] || `${newCombo}杯！`
      setComboAnim({ label, pts }); setTimeout(() => setComboAnim(null), 1800)
    }
    spawnPiece(cb, S.current.nextPieces)
  }, [spawnPiece])

  const drop = useCallback(() => {
    const { board: b, piece: p, over: go, paused: pa } = S.current
    if (go || pa) return
    if (collides(b, p.cells, p.x, p.y + 1)) lockPiece(b, p)
    else setPiece(pr => ({ ...pr, y: pr.y + 1 }))
  }, [lockPiece])

  const hardDrop = useCallback(() => {
    const { board: b, piece: p } = S.current
    const gy = ghostY(b, p.cells, p.x, p.y)
    setScore(s => s + (gy - p.y) * 2)
    lockPiece(b, { ...p, y: gy })
  }, [lockPiece])

  const doHold = useCallback(() => {
    const { hold: h, piece: p, canHold: ch, board: b, nextPieces: q } = S.current
    if (!ch) return
    const makeNew = (cells, color, variant, key) => {
      const np = { cells, color, variant, key, x: Math.floor(COLS / 2) - Math.floor(cells[0].length / 2), y: 0 }
      return collides(b, np.cells, np.x, np.y) ? null : np
    }
    if (h) {
      const np = makeNew(h.cells, h.color, h.variant, h.key)
      if (np) { setHold({ cells: p.cells, color: p.color, variant: p.variant, key: p.key }); setPiece(np); setCanHold(false) }
    } else {
      setHold({ cells: p.cells, color: p.color, variant: p.variant, key: p.key })
      spawnPiece(b, q); setCanHold(false)
    }
  }, [spawnPiece])

  const moveLeft  = useCallback(() => { const { board:b,piece:p,over,paused } = S.current; if(over||paused)return; if(!collides(b,p.cells,p.x-1,p.y)) setPiece(pr=>({...pr,x:pr.x-1})) }, [])
  const moveRight = useCallback(() => { const { board:b,piece:p,over,paused } = S.current; if(over||paused)return; if(!collides(b,p.cells,p.x+1,p.y)) setPiece(pr=>({...pr,x:pr.x+1})) }, [])

  const rotatePiece = useCallback(() => {
    const { board:b,piece:p,over,paused } = S.current; if(over||paused)return
    const rot = rotate(p.cells)
    for (const dx of [0,-1,1,-2,2]) { if(!collides(b,rot,p.x+dx,p.y)) { setPiece(pr=>({...pr,cells:rot,x:pr.x+dx})); return } }
  }, [])

  const reset = () => {
    setBoard(emptyBoard()); setPiece(randomPiece())
    setNext([randomPiece(), randomPiece(), randomPiece()])
    setHold(null); setCanHold(true); setScore(0); setLines(0); setCombo(0); setLevel(1)
    setOver(false); setPaused(false); setStarted(true); setComboAnim(null)
  }

  useEffect(() => {
    const h = e => {
      if (!S.current.started || S.current.over) return
      if (e.key==='ArrowLeft')  { e.preventDefault(); moveLeft()     }
      if (e.key==='ArrowRight') { e.preventDefault(); moveRight()    }
      if (e.key==='ArrowDown')  { e.preventDefault(); drop()         }
      if (e.key==='ArrowUp')    { e.preventDefault(); rotatePiece()  }
      if (e.key===' ')          { e.preventDefault(); hardDrop()     }
      if (e.key==='c'||e.key==='C') doHold()
      if (e.key==='p'||e.key==='P') setPaused(v=>!v)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [drop, hardDrop, rotatePiece, moveLeft, moveRight, doHold])

  useEffect(() => {
    if (!started || over || paused) return
    const t = setInterval(drop, speed)
    return () => clearInterval(t)
  }, [started, over, paused, drop, speed])

  return {
    board, piece, nextPieces, hold, score, lines, combo, level,
    over, paused, started, comboAnim, lineFlash,
    reset, drop, hardDrop, rotatePiece, doHold, moveLeft, moveRight, setPaused,
    getGhost: () => started && !over ? ghostY(board, piece.cells, piece.x, piece.y) : piece.y,
  }
}
