import { useState, useRef, useEffect } from 'react'
import type { Game, Player } from '../types'

interface Props {
  onStart: (game: Game) => void
  onBack: () => void
}

const SCORE_LIMITS = [50, 70, 100, 150]

export function SetupScreen({ onStart, onBack }: Props) {
  const [players, setPlayers] = useState<Player[]>([
    { id: crypto.randomUUID(), name: '' },
    { id: crypto.randomUUID(), name: '' },
  ])
  const [scoreLimit, setScoreLimit] = useState(100)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const canStart = players.filter(p => p.name.trim()).length >= 2

  const addPlayer = () => {
    if (players.length >= 8) return
    const newPlayer = { id: crypto.randomUUID(), name: '' }
    setPlayers(prev => [...prev, newPlayer])
    setTimeout(() => inputRefs.current[players.length]?.focus(), 50)
  }

  const removePlayer = (id: string) => {
    if (players.length <= 2) return
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  const updateName = (id: string, name: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p))
  }

  const handleStart = () => {
    const validPlayers = players.filter(p => p.name.trim()).map(p => ({ ...p, name: p.name.trim() }))
    if (validPlayers.length < 2) return

    const game: Game = {
      id: crypto.randomUUID(),
      players: validPlayers,
      rounds: [],
      scoreLimit,
      createdAt: Date.now(),
    }
    onStart(game)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index === players.length - 1 && players.length < 8) {
        addPlayer()
      } else if (index < players.length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Nueva partida</h1>
      </header>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full animate-fade-slide-in">
        {/* Players */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Jugadores</h2>
          <div className="space-y-2">
            {players.map((player, i) => (
              <div key={player.id} className="flex items-center gap-2">
                <span className="w-6 text-center text-sm text-slate-500 font-mono">{i + 1}</span>
                <input
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  value={player.name}
                  onChange={e => updateName(player.id, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  placeholder={`Jugador ${i + 1}`}
                  maxLength={20}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {players.length > 2 && (
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {players.length < 8 && (
            <button
              onClick={addPlayer}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 pl-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar jugador
            </button>
          )}
        </section>

        {/* Score limit */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Límite de puntos</h2>
          <div className="grid grid-cols-4 gap-2">
            {SCORE_LIMITS.map(limit => (
              <button
                key={limit}
                onClick={() => setScoreLimit(limit)}
                className={`py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  scoreLimit === limit
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-600'
                }`}
              >
                {limit}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Start button */}
      <div className="sticky bottom-0 px-4 py-4 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full max-w-lg mx-auto block py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-colors"
        >
          Empezar partida
        </button>
      </div>
    </div>
  )
}
