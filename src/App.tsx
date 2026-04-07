import { useState, useCallback } from 'react'
import type { Game, Screen } from './types'
import { useLocalStorage } from './useLocalStorage'
import { HomeScreen } from './screens/HomeScreen'
import { SetupScreen } from './screens/SetupScreen'
import { GameScreen } from './screens/GameScreen'
import { HistoryScreen } from './screens/HistoryScreen'

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [games, setGames] = useLocalStorage<Game[]>('chinchon-games', [])
  const [activeGameId, setActiveGameId] = useState<string | null>(() => {
    const saved = localStorage.getItem('chinchon-active-game')
    return saved ? JSON.parse(saved) : null
  })

  const activeGame = games.find(g => g.id === activeGameId) ?? null

  const setActiveGame = useCallback((id: string | null) => {
    setActiveGameId(id)
    localStorage.setItem('chinchon-active-game', JSON.stringify(id))
  }, [])

  const handleNewGame = useCallback(() => {
    setScreen('setup')
  }, [])

  const handleStartGame = useCallback((game: Game) => {
    setGames(prev => [game, ...prev])
    setActiveGame(game.id)
    setScreen('game')
  }, [setGames, setActiveGame])

  const handleUpdateGame = useCallback((updated: Game) => {
    setGames(prev => prev.map(g => g.id === updated.id ? updated : g))
  }, [setGames])

  const handleDeleteGame = useCallback((gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId))
    if (activeGameId === gameId) {
      setActiveGame(null)
      setScreen('home')
    }
  }, [setGames, activeGameId, setActiveGame])

  const handleContinueGame = useCallback(() => {
    if (activeGame) setScreen('game')
  }, [activeGame])

  const handleGoHome = useCallback(() => {
    setScreen('home')
  }, [])

  const handleViewHistory = useCallback(() => {
    setScreen('history')
  }, [])

  const handleOpenGame = useCallback((gameId: string) => {
    setActiveGame(gameId)
    setScreen('game')
  }, [setActiveGame])

  const handleFinishGame = useCallback(() => {
    if (activeGame) {
      handleUpdateGame({ ...activeGame, finishedAt: Date.now() })
    }
    setActiveGame(null)
    setScreen('home')
  }, [activeGame, handleUpdateGame, setActiveGame])

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      {screen === 'home' && (
        <HomeScreen
          activeGame={activeGame}
          hasHistory={games.length > 0}
          onNewGame={handleNewGame}
          onContinueGame={handleContinueGame}
          onViewHistory={handleViewHistory}
        />
      )}
      {screen === 'setup' && (
        <SetupScreen
          onStart={handleStartGame}
          onBack={handleGoHome}
        />
      )}
      {screen === 'game' && activeGame && (
        <GameScreen
          game={activeGame}
          onUpdate={handleUpdateGame}
          onBack={handleGoHome}
          onFinish={handleFinishGame}
        />
      )}
      {screen === 'history' && (
        <HistoryScreen
          games={games}
          onBack={handleGoHome}
          onOpenGame={handleOpenGame}
          onDeleteGame={handleDeleteGame}
        />
      )}
    </div>
  )
}

export default App
