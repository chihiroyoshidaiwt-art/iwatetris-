import { useState } from 'react'
import TitleScreen from './screens/TitleScreen.jsx'
import GameScreen  from './screens/GameScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'

export default function App() {
  // screen: 'title' | 'game' | 'admin'
  const [screen, setScreen] = useState(
    window.location.hash === '#admin' ? 'admin' : 'title'
  )
  const [gameVersion, setGameVersion] = useState('wanko')

  const go = (s, opts = {}) => {
    if (opts.version) setGameVersion(opts.version)
    setScreen(s)
  }

  return (
    <>
      {screen === 'title' && <TitleScreen onStart={(v) => go('game', { version: v })} onAdmin={() => go('admin')} />}
      {screen === 'game'  && <GameScreen  version={gameVersion} onBack={() => go('title')} />}
      {screen === 'admin' && <AdminScreen onBack={() => go('title')} />}
    </>
  )
}
