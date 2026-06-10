import { useState } from 'react'
import TitleScreen from './screens/TitleScreen.jsx'
import GameScreen  from './screens/GameScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'

export default function App() {
  // URLが /admin なら最初から管理画面
  const isAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin'
  const [screen, setScreen] = useState(isAdmin ? 'admin' : 'title')
  const [gameVersion, setGameVersion] = useState('wanko')

  return (
    <>
      {screen === 'title' && (
        <TitleScreen
          onStart={(v) => { setGameVersion(v); setScreen('game') }}
        />
      )}
      {screen === 'game'  && <GameScreen  version={gameVersion} onBack={() => setScreen('title')} />}
      {screen === 'admin' && <AdminScreen onBack={() => setScreen('title')} />}
    </>
  )
}
