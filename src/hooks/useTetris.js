import { useState, useCallback, useRef, useEffect } from 'react'

export const ROWS = 20
export const COLS = 10

const SHAPES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]],
  J: [[1,0,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
}
const KEYS = Object.keys(SHAPES)

export const rotate = s => s[0].map((_, i) => s.map(r => r[i]).reverse())
export const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null))

export function newPiece() {
  const key = KEYS[Math.floor(Math.random() * KEYS.length)]
  const shape = SHAPES[key]
  return { key, shape, type: Math.floor(Math.random() * 5), x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: -1 }
}

export function collides(board, shape, x, y) {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue
      const nr = y + r, nc = x + c
      if (nr >= ROWS || nc < 0 || nc >= COLS) return true
      if (nr >= 0 && board[nr][nc] !== null) return true
    }
  return false
}

export function getGhostY(board, piece) {
  let y = piece.y
  while (!collides(board, piece.shape, piece.x, y + 1)) y++
  return y
}

export function clearLines(board) {
  let count = 0
  const next = []
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c !== null)) { count++; continue }
    next.unshift([...board[r]])
  }
  while (next.length < ROWS) next.unshift(Array(COLS).fill(null))
  return { board: next, count }
}

const SCORE_TABLE  = [0, 100, 300, 600, 1000]
const LINE_MSGS    = ['', 'わんこ完食！🍜', 'おかわり！🎉', '大盛り！✨', '特盛り！🏆']

export function useTetris() {
  const [board,   setBoard]   = useState(emptyBoard)
  const [piece,   setPiece]   = useState(newPiece)
  const [queue,   setQueue]   = useState(() => [newPiece(), newPiece(), newPiece(), newPiece(), newPiece()])
  const [score,   setScore]   = useState(0)
  const [lines,   setLines]   = useState(0)
  const [combo,   setCombo]   = useState(0)
  const [over,    setOver]    = useState(false)
  const [paused,  setPaused]  = useState(false)
  const [started, setStarted] = useState(false)
  const [msg,     setMsg]     = useState('')
  const [shake,   setShake]   = useState(false)

  const S = useRef({ board, piece, queue, over, paused, started, combo })
  useEffect(() => { S.current = { board, piece, queue, over, paused, started, combo } })

  const level = Math.floor(lines / 10) + 1
  const speed = Math.max(80, 600 - level * 40)

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 1500) }

  const spawn = useCallback((b, q) => {
    const [nxt, ...rest] = q
    const nn = newPiece()
    if (collides(b, nxt.shape, nxt.x, nxt.y)) { setOver(true); return }
    setPiece(nxt); setQueue([...rest, nn])
  }, [])

  const lock = useCallback((b, p) => {
    const nb = b.map(r => [...r])
    for (let r = 0; r < p.shape.length; r++)
      for (let c = 0; c < p.shape[r].length; c++) {
        if (!p.shape[r][c]) continue
        const nr = p.y + r, nc = p.x + c
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) nb[nr][nc] = p.type
      }
    const { board: cb, count: n } = clearLines(nb)
    const nc2 = n > 0 ? S.current.combo + 1 : 0
    const bonus = nc2 > 1 ? nc2 * 50 : 0
    setScore(s => s + (SCORE_TABLE[n] || 0) + bonus)
    setLines(l => l + n)
    setCombo(nc2)
    setBoard(cb)
    if (n > 0) {
      flash(nc2 > 1 ? `🔥${nc2}コンボ！` : (LINE_MSGS[n] || ''))
      setShake(true); setTimeout(() => setShake(false), 280)
    }
    spawn(cb, S.current.queue)
  }, [spawn])

  const drop = useCallback(() => {
    const { board: b, piece: p } = S.current
    if (collides(b, p.shape, p.x, p.y + 1)) lock(b, p)
    else setPiece(pr => ({ ...pr, y: pr.y + 1 }))
  }, [lock])

  const hardDrop = useCallback(() => {
    const { board: b, piece: p } = S.current
    const gy = getGhostY(b, p)
    setScore(s => s + (gy - p.y) * 2)
    lock(b, { ...p, y: gy })
  }, [lock])

  const rotatePiece = useCallback(() => {
    const { board: b, piece: p } = S.current
    const rot = rotate(p.shape)
    for (const dx of [0, -1, 1, -2, 2]) {
      if (!collides(b, rot, p.x + dx, p.y)) {
        setPiece(pr => ({ ...pr, shape: rot, x: pr.x + dx }))
        return
      }
    }
  }, [])

  const moveLeft  = useCallback(() => { const { board: b, piece: p } = S.current; if (!collides(b, p.shape, p.x - 1, p.y)) setPiece(pr => ({ ...pr, x: pr.x - 1 })) }, [])
  const moveRight = useCallback(() => { const { board: b, piece: p } = S.current; if (!collides(b, p.shape, p.x + 1, p.y)) setPiece(pr => ({ ...pr, x: pr.x + 1 })) }, [])

  const reset = () => {
    setBoard(emptyBoard()); setPiece(newPiece())
    setQueue([newPiece(), newPiece(), newPiece(), newPiece(), newPiece()])
    setScore(0); setLines(0); setCombo(0)
    setOver(false); setPaused(false); setStarted(true)
  }

  // キーボード
  useEffect(() => {
    const h = e => {
      const { started: st, over: go, paused: pa } = S.current
      if (e.key === 'p' || e.key === 'P') { setPaused(v => !v); return }
      if (!st || go || pa) return
      if      (e.key === 'ArrowLeft')  moveLeft()
      else if (e.key === 'ArrowRight') moveRight()
      else if (e.key === 'ArrowDown')  drop()
      else if (e.key === 'ArrowUp')    rotatePiece()
      else if (e.key === ' ')          { e.preventDefault(); hardDrop() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [drop, hardDrop, rotatePiece, moveLeft, moveRight])

  // 自動落下
  useEffect(() => {
    if (!started || over || paused) return
    const t = setInterval(drop, speed)
    return () => clearInterval(t)
  }, [started, over, paused, drop, speed])

  return { board, piece, queue, score, lines, level, combo, over, paused, started, msg, shake, reset, drop, hardDrop, rotatePiece, moveLeft, moveRight, setPaused, getGhost: () => started && !over ? getGhostY(board, piece) : piece.y }
}
