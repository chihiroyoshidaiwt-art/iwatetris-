import { useState } from 'react'

// 管理画面で調整可能な全設定
export const DEFAULT_CONFIG = {
  // 岩壁
  frameScale:   0.90,   // プレイエリアに対する岩壁サイズ比
  frameX:       0,      // 岩壁オフセットX(px)
  frameY:       0,      // 岩壁オフセットY(px)
  frameRotate:  0,      // 回転(deg)
  frameOpacity: 1,       // 岩壁透明度

  // マス（グリッド）
  cols: 10,
  rows: 21,
  gridScaleW: 0.62,      // フィールド幅に対するグリッド幅比
  gridScaleH: 0.82,      // フィールド高さに対するグリッド高さ比
  gridX: 0,              // グリッドオフセットX(px)
  gridY: 0,              // グリッドオフセットY(px)

  // UI
  titleSize: 1.0,        // ロゴサイズ倍率
  fontScale: 1.0,
  holdSize: 1.0,
  nextSize: 1.0,

  // 背景
  bgBrightness: 0.85,
  bgBlur: 4,
  bgOpacity: 0.55,
}

function load() {
  try {
    const s = localStorage.getItem('iwate_config_v2')
    return s ? { ...DEFAULT_CONFIG, ...JSON.parse(s) } : { ...DEFAULT_CONFIG }
  } catch { return { ...DEFAULT_CONFIG } }
}

export function useConfig() {
  const [config, setConfigState] = useState(load)
  const setConfig = next => { setConfigState(next); localStorage.setItem('iwate_config_v2', JSON.stringify(next)) }
  const update = (key, val) => setConfig({ ...config, [key]: val })
  const reset  = ()        => setConfig({ ...DEFAULT_CONFIG })
  return { config, setConfig, update, reset }
}
