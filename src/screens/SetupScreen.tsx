import { useState, useRef, useEffect } from 'react'
import type { Game, Player } from '../types'

interface Props {
  onStart: (game: Game) => void
  onBack: () => void
}

const SCORE_LIMITS = [50, 70, 100, 150]

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

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
      {/* Decorative background elements for desktop */}
      <div className="desktop-decorative desktop-decorative-1" aria-hidden="true" />
      <div className="desktop-decorative desktop-decorative-2" aria-hidden="true" />
      
      {/* Header */}
      <header className="flex items-center gap-4 px-4 lg:px-6 py-4 border-b border-[var(--color-border)] glass sticky top-0 z-10">
        <div className="w-full max-w-3xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Volver"
          >
            <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-semibold text-[var(--color-text-primary)]">Nueva partida</h1>
            <p className="text-xs lg:text-sm text-[var(--color-text-muted)]">Configura tu juego</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 lg:py-10 w-full max-w-3xl mx-auto animate-fade-slide-in relative z-10">
        {/* Desktop two-column layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Players Section */}
          <section className="mb-8 lg:mb-0">
            <div className="flex items-center gap-2 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-primary-subtle)] flex items-center justify-center">
                <UserIcon className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h2 className="text-sm lg:text-base font-semibold text-[var(--color-text-primary)]">Jugadores</h2>
                <p className="text-xs lg:text-sm text-[var(--color-text-muted)]">{players.length} de 8 maximo</p>
              </div>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              {players.map((player, i) => (
                <div 
                  key={player.id} 
                  className="flex items-center gap-3 animate-scale-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-sm lg:text-base font-medium text-[var(--color-text-muted)] bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    {i + 1}
                  </span>
                  <div className="flex-1 relative">
                    <input
                      ref={el => { inputRefs.current[i] = el }}
                      type="text"
                      value={player.name}
                      onChange={e => updateName(player.id, e.target.value)}
                      onKeyDown={e => handleKeyDown(e, i)}
                      placeholder={`Nombre del jugador ${i + 1}`}
                      maxLength={20}
                      className="input w-full pr-10 lg:text-base lg:py-3.5"
                    />
                    {players.length > 2 && (
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-text-disabled)] hover:text-[var(--color-danger)] rounded-lg hover:bg-[var(--color-danger-subtle)] transition-colors"
                        aria-label="Eliminar jugador"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {players.length < 8 && (
              <button
                onClick={addPlayer}
                className="mt-4 lg:mt-6 flex items-center gap-2 text-sm lg:text-base font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] ml-11 lg:ml-13 transition-colors"
              >
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-[var(--color-primary-subtle)] flex items-center justify-center">
                  <PlusIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </div>
                <span>Agregar jugador</span>
              </button>
            )}
          </section>

          {/* Right column on desktop */}
          <div>
            {/* Score Limit Section */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[var(--color-warning-subtle)] flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm lg:text-base font-semibold text-[var(--color-text-primary)]">Limite de puntos</h2>
                  <p className="text-xs lg:text-sm text-[var(--color-text-muted)]">El jugador que llegue pierde</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3 lg:gap-4">
                {SCORE_LIMITS.map(limit => (
                  <button
                    key={limit}
                    onClick={() => setScoreLimit(limit)}
                    className={`py-3.5 lg:py-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-200 ${
                      scoreLimit === limit
                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            </section>

            {/* Summary */}
            {canStart && (
              <section className="card p-4 lg:p-6 animate-scale-in">
                <h3 className="text-xs lg:text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-3 lg:mb-4">Resumen</h3>
                <div className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Jugadores</span>
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {players.filter(p => p.name.trim()).map(p => p.name.trim()).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Limite</span>
                    <span className="text-[var(--color-text-primary)] font-medium">{scoreLimit} puntos</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Start button */}
      <div className="sticky bottom-0 px-4 py-4 glass border-t border-[var(--color-border)] safe-bottom relative z-10">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`w-full max-w-3xl mx-auto block py-4 lg:py-5 font-semibold rounded-2xl transition-all duration-300 lg:text-lg ${
            canStart
              ? 'text-white hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-[var(--color-surface)] text-[var(--color-text-disabled)] cursor-not-allowed'
          }`}
          style={canStart ? { 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
            boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
          } : undefined}
        >
          {canStart ? 'Empezar partida' : 'Agrega al menos 2 jugadores'}
        </button>
      </div>
    </div>
  )
}
