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

export const SCORE_TABLE = [0, 100, 300, 600, 1200]

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

// コンボ演出ラベル（わんこそば「杯」演出 + 達成マイルストーン）
function getComboLabel(totalServed) {
  if (totalServed >= 100) return '100杯達成！'
  if (totalServed >= 50)  return '50杯達成！'
  if (totalServed >= 10)  return '10杯達成！'
  return `${totalServed}杯！`
}

// 宮沢賢治バージョン専用イベント
const KENJI_EVENTS = [
  { id: 'cat',    label: '注文の多い料理店 発生！', sub: '猫がブロックを1個破壊！', chance: 0.05 },
  { id: 'wind',   label: '北風イベント！',           sub: 'ブロックが吹き飛ばされる！', chance: 0.05 },
  { id: 'sun',    label: '太陽が出た！',             sub: '5秒間操作不能...',          chance: 0.03 },
  { id: 'rain',   label: '雨ニモマケズ！',           sub: 'ランダムブロックが追加！',  chance: 0.03 },
  { id: 'galaxy', label: '銀河鉄道通過！',           sub: 'スコア2倍ボーナスタイム！', chance: 0.02 },
]

export function useTetris(version = 'kenji') {
  const [board,       setBoard]      = useState(emptyBoard)
  const [piece,       setPiece]      = useState(randomPiece)
  const [nextPieces,  setNext]       = useState(() => [randomPiece(), randomPiece(), randomPiece()])
  const [hold,        setHold]       = useState(null)
  const [canHold,     setCanHold]    = useState(true)
  const [score,       setScore]      = useState(0)
  const [lines,       setLines]      = useState(0)
  const [combo,       setCombo]      = useState(0)
  const [totalServed, setTotalServed]= useState(0) // 累計ライン消去数（杯数）
  const [level,       setLevel]      = useState(1)
  const [over,        setOver]       = useState(false)
  const [paused,      setPaused]     = useState(false)
  const [started,     setStarted]    = useState(false)
  const [comboAnim,   setComboAnim]  = useState(null)
  const [lineFlash,   setLineFlash]  = useState(false)
  const [charEvent,   setCharEvent]  = useState(null)   // {label, sub}
  const [scoreMultiplier, setScoreMultiplier] = useState(1)
  const [frozen,       setFrozen]    = useState(false)  // 太陽イベント中操作不能

  const S = useRef({})
  useEffect(() => { S.current = { board, piece, nextPieces, hold, canHold, score, lines, combo, totalServed, level, over, paused, started, scoreMultiplier, frozen } })

  const speed = Math.max(80, 900 - (level - 1) * 80)

  const triggerCharEvent = useCallback(() => {
    if (version !== 'kenji') return
    const roll = Math.random()
    let acc = 0
    for (const ev of KENJI_EVENTS) {
      acc += ev.chance
      if (roll < acc) {
        setCharEvent({ label: ev.label, sub: ev.sub })
        setTimeout(() => setCharEvent(null), 3000)
        if (ev.id === 'sun') {
          setFrozen(true)
          setTimeout(() => setFrozen(false), 5000)
        }
        if (ev.id === 'galaxy') {
          setScoreMultiplier(2)
          setTimeout(() => setScoreMultiplier(1), 8000)
        }
        if (ev.id === 'cat') {
          // ランダムな固定ブロック1個を消す
          setBoard(b => {
            const nb = b.map(r => [...r])
            const filled = []
            nb.forEach((row, r) => row.forEach((v, c) => { if (v) filled.push([r, c]) }))
            if (filled.length) { const [r, c] = filled[Math.floor(Math.random() * filled.length)]; nb[r][c] = null }
            return nb
          })
        }
        if (ev.id === 'rain') {
          // ランダムにブロック1個を盤面下部に追加
          setBoard(b => {
            const nb = b.map(r => [...r])
            const targetRow = ROWS - 1 - Math.floor(Math.random() * 3)
            const targetCol = Math.floor(Math.random() * COLS)
            if (!nb[targetRow][targetCol]) nb[targetRow][targetCol] = { color: '#8a8a4a', variant: 2 }
            return nb
          })
        }
        break
      }
    }
  }, [version])

  const spawnPiece = useCallback((b, queue) => {
    const [nxt, ...rest] = queue
    const nn = randomPiece()
    if (collides(b, nxt.cells, nxt.x, nxt.y)) { setOver(true); return }
    setPiece(nxt); setNext([...rest, nn]); setCanHold(true)
    triggerCharEvent()
  }, [triggerCharEvent])

  const lockPiece = useCallback((b, p) => {
    const nb = b.map(r => [...r])
    p.cells.forEach((row, r) => row.forEach((v, c) => {
      if (v) { const nr = p.y + r, nc = p.x + c; if (nr >= 0) nb[nr][nc] = { color: p.color, variant: p.variant } }
    }))
    const { board: cb, count } = clearLines(nb)
    const { combo: prevCombo, score: prevScore, lines: prevLines, level: prevLevel, totalServed: prevServed, scoreMultiplier: mult } = S.current
    const newCombo = count > 0 ? prevCombo + 1 : 0
    const newServed = prevServed + count
    const pts = ((SCORE_TABLE[count] || 0) * prevLevel + (newCombo > 1 ? newCombo * 50 : 0)) * mult
    const newScore = prevScore + pts
    const newLines = prevLines + count
    const newLevel = Math.floor(newLines / 10) + 1
    setBoard(cb); setScore(newScore); setLines(newLines); setLevel(newLevel); setCombo(newCombo); setTotalServed(newServed)
    if (count > 0) {
      setLineFlash(true); setTimeout(() => setLineFlash(false), 320)
      const label = getComboLabel(newServed)
      setComboAnim({ label, pts }); setTimeout(() => setComboAnim(null), 900)
    }
    spawnPiece(cb, S.current.nextPieces)
  }, [spawnPiece])

  const drop = useCallback(() => {
    const { board: b, piece: p, over: go, paused: pa, frozen: fr } = S.current
    if (go || pa || fr) return
    if (collides(b, p.cells, p.x, p.y + 1)) lockPiece(b, p)
    else setPiece(pr => ({ ...pr, y: pr.y + 1 }))
  }, [lockPiece])

  const hardDrop = useCallback(() => {
    const { board: b, piece: p, frozen: fr } = S.current
    if (fr) return
    const gy = ghostY(b, p.cells, p.x, p.y)
    setScore(s => s + (gy - p.y) * 2)
    lockPiece(b, { ...p, y: gy })
  }, [lockPiece])

  const doHold = useCallback(() => {
    const { hold: h, piece: p, canHold: ch, board: b, nextPieces: q, frozen: fr } = S.current
    if (!ch || fr) return
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

  const moveLeft  = useCallback(() => { const { board:b,piece:p,over,paused,frozen:fr } = S.current; if(over||paused||fr)return; if(!collides(b,p.cells,p.x-1,p.y)) setPiece(pr=>({...pr,x:pr.x-1})) }, [])
  const moveRight = useCallback(() => { const { board:b,piece:p,over,paused,frozen:fr } = S.current; if(over||paused||fr)return; if(!collides(b,p.cells,p.x+1,p.y)) setPiece(pr=>({...pr,x:pr.x+1})) }, [])

  const rotatePiece = useCallback(() => {
    const { board:b,piece:p,over,paused,frozen:fr } = S.current; if(over||paused||fr)return
    const rot = rotate(p.cells)
    for (const dx of [0,-1,1,-2,2]) { if(!collides(b,rot,p.x+dx,p.y)) { setPiece(pr=>({...pr,cells:rot,x:pr.x+dx})); return } }
  }, [])

  const reset = () => {
    setBoard(emptyBoard()); setPiece(randomPiece())
    setNext([randomPiece(), randomPiece(), randomPiece()])
    setHold(null); setCanHold(true); setScore(0); setLines(0); setCombo(0); setLevel(1); setTotalServed(0)
    setOver(false); setPaused(false); setStarted(true); setComboAnim(null); setCharEvent(null); setScoreMultiplier(1); setFrozen(false)
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
    board, piece, nextPieces, hold, score, lines, combo, level, totalServed,
    over, paused, started, comboAnim, lineFlash, charEvent, scoreMultiplier, frozen,
    reset, drop, hardDrop, rotatePiece, doHold, moveLeft, moveRight, setPaused,
    getGhost: () => started && !over ? ghostY(board, piece.cells, piece.x, piece.y) : piece.y,
  }
}
