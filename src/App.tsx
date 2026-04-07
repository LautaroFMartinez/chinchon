import { useState, useCallback, useEffect } from 'react'
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
  const [isTransitioning, setIsTransitioning] = useState(false)

  const activeGame = games.find(g => g.id === activeGameId) ?? null

  const setActiveGame = useCallback((id: string | null) => {
    setActiveGameId(id)
    localStorage.setItem('chinchon-active-game', JSON.stringify(id))
  }, [])

  // Screen transition helper
  const navigateTo = useCallback((newScreen: Screen) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setScreen(newScreen)
      setIsTransitioning(false)
    }, 150)
  }, [])

  const handleNewGame = useCallback(() => {
    navigateTo('setup')
  }, [navigateTo])

  const handleStartGame = useCallback((game: Game) => {
    setGames(prev => [game, ...prev])
    setActiveGame(game.id)
    navigateTo('game')
  }, [setGames, setActiveGame, navigateTo])

  const handleUpdateGame = useCallback((updated: Game) => {
    setGames(prev => prev.map(g => g.id === updated.id ? updated : g))
  }, [setGames])

  const handleDeleteGame = useCallback((gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId))
    if (activeGameId === gameId) {
      setActiveGame(null)
      navigateTo('home')
    }
  }, [setGames, activeGameId, setActiveGame, navigateTo])

  const handleContinueGame = useCallback(() => {
    if (activeGame) navigateTo('game')
  }, [activeGame, navigateTo])

  const handleGoHome = useCallback(() => {
    navigateTo('home')
  }, [navigateTo])

  const handleViewHistory = useCallback(() => {
    navigateTo('history')
  }, [navigateTo])

  const handleOpenGame = useCallback((gameId: string) => {
    setActiveGame(gameId)
    navigateTo('game')
  }, [setActiveGame, navigateTo])

  const handleFinishGame = useCallback(() => {
    if (activeGame) {
      handleUpdateGame({ ...activeGame, finishedAt: Date.now() })
    }
    setActiveGame(null)
    navigateTo('home')
  }, [activeGame, handleUpdateGame, setActiveGame, navigateTo])

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Service worker registration failed
        })
      })
    }
  }, [])

  return (
    <div 
      className={`min-h-dvh transition-opacity duration-150 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ 
        background: 'linear-gradient(180deg, #09090b 0%, #0f0f12 50%, #09090b 100%)',
        minHeight: '100dvh'
      }}
    >
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
