import { useState } from 'react'

export const DEFAULT_CONFIG = {
  // グリッド位置（枠内側の比率）
  innerLeft: 0.28,
  innerTop:  0.10,
  innerW:    0.44,
  innerH:    0.72,
  // グリッドサイズ
  cols: 10,
  rows: 22,
}

function load() {
  try {
    const s = localStorage.getItem('iwate_config')
    return s ? { ...DEFAULT_CONFIG, ...JSON.parse(s) } : { ...DEFAULT_CONFIG }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function useConfig() {
  const [config, setConfigState] = useState(load)

  const setConfig = (next) => {
    setConfigState(next)
    localStorage.setItem('iwate_config', JSON.stringify(next))
  }

  const update = (key, val) => setConfig({ ...config, [key]: val })
  const reset  = ()        => setConfig({ ...DEFAULT_CONFIG })

  return { config, setConfig, update, reset }
}
