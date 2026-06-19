import { useState } from 'react'
import TitleScreen from './screens/TitleScreen.jsx'
import GameScreen  from './screens/GameScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'

export default function App() {
  const isAdmin = window.location.hash === '#admin'
  const [screen,  setScreen]  = useState(isAdmin ? 'admin' : 'title')
  const [version, setVersion] = useState('kenji')

  return (
    <>
      {screen === 'title' && <TitleScreen onStart={v => { setVersion(v); setScreen('game') }} onAdmin={() => setScreen('admin')} />}
      {screen === 'game'  && <GameScreen  version={version} onBack={() => setScreen('title')} />}
      {screen === 'admin' && <AdminScreen onBack={() => setScreen('title')} />}
    </>
  )
}
