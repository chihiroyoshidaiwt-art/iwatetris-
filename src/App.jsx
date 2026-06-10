import { useState } from 'react'
import TitleScreen from './screens/TitleScreen.jsx'
import GameScreen  from './screens/GameScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState(
    window.location.hash === '#admin' ? 'admin' : 'title'
  )
  const [gameVersion, setGameVersion] = useState('wanko')

  return (
    <>
      {screen === 'title' && <TitleScreen onStart={(v) => { setGameVersion(v); setScreen('game') }} onAdmin={() => setScreen('admin')} />}
      {screen === 'game'  && <GameScreen  version={gameVersion} onBack={() => setScreen('title')} />}
      {screen === 'admin' && <AdminScreen onBack={() => setScreen('title')} />}
    </>
  )
}
