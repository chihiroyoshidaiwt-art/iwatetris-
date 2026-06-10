import { useRef, useState } from 'react'

export function useBGM() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume,  setVol]     = useState(0.6)
  const [hasFile, setHasFile] = useState(false)
  const [fileName, setFileName] = useState('')

  const loadFile = (file) => {
    if (!file) return
    if (audioRef.current) audioRef.current.pause()
    const url = URL.createObjectURL(file)
    const a = new Audio(url)
    a.loop = true
    a.volume = volume
    audioRef.current = a
    setHasFile(true)
    setPlaying(false)
    setFileName(file.name)
  }

  // ★ ユーザー操作（タップ）直後に呼ぶこと
  const play = () => {
    if (!audioRef.current || !hasFile) return
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setPlaying(false)
  }

  const toggle = () => (playing ? pause() : play())

  const setVolume = (v) => {
    setVol(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return { playing, hasFile, volume, fileName, loadFile, play, pause, toggle, setVolume }
}
