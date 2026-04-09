import { useState, useCallback, useMemo } from 'react'
import type { Game, Round } from '../types'
import { ScoreTable } from '../components/ScoreTable'
import { AddRoundModal } from '../components/AddRoundModal'
import { GameOverBanner } from '../components/GameOverBanner'

interface Props {
  game: Game
  onUpdate: (game: Game) => void
  onBack: () => void
  onFinish: () => void
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
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

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}

export function GameScreen({ game, onUpdate, onBack, onFinish }: Props) {
  const [showAddRound, setShowAddRound] = useState(false)
  const [editingRound, setEditingRound] = useState<number | null>(null)

  const totals = useMemo(() => {
    const sums: Record<string, number> = {}
    for (const p of game.players) sums[p.id] = 0
    for (const r of game.rounds) {
      for (const [pid, score] of Object.entries(r.scores)) {
        sums[pid] = (sums[pid] ?? 0) + score
      }
    }
    return sums
  }, [game.players, game.rounds])

  const eliminatedPlayers = useMemo(() => {
    const set = new Set<string>()
    for (const [pid, total] of Object.entries(totals)) {
      if (total >= game.scoreLimit) set.add(pid)
    }
    return set
  }, [totals, game.scoreLimit])

  const activePlayers = game.players.filter(p => !eliminatedPlayers.has(p.id))
  const isGameOver = activePlayers.length <= 1
  const winner = isGameOver ? activePlayers[0] ?? null : null

  const ranking = useMemo(() => {
    return [...game.players].sort((a, b) => (totals[a.id] ?? 0) - (totals[b.id] ?? 0))
  }, [game.players, totals])

  const nextDealerIndex = useMemo(() => {
    if (game.players.length === 0) return -1

    const startIndex = game.rounds.length === 0
      ? -1
      : game.rounds[game.rounds.length - 1].dealerIndex

    for (let offset = 1; offset <= game.players.length; offset++) {
      const candidateIndex = (startIndex + offset) % game.players.length
      const candidate = game.players[candidateIndex]
      if (candidate && !eliminatedPlayers.has(candidate.id)) {
        return candidateIndex
      }
    }

    return -1
  }, [game.rounds, game.players, eliminatedPlayers])

  const currentDealer = nextDealerIndex >= 0 ? game.players[nextDealerIndex] : undefined

  const handleAddRound = useCallback((scores: Record<string, number>) => {
    const round: Round = { id: crypto.randomUUID(), scores, dealerIndex: nextDealerIndex }
    onUpdate({ ...game, rounds: [...game.rounds, round] })
    setShowAddRound(false)
  }, [game, onUpdate, nextDealerIndex])

  const handleEditRound = useCallback((index: number, scores: Record<string, number>) => {
    const newRounds = [...game.rounds]
    newRounds[index] = { ...newRounds[index], scores }
    onUpdate({ ...game, rounds: newRounds })
    setEditingRound(null)
  }, [game, onUpdate])

  const handleDeleteRound = useCallback((index: number) => {
    const newRounds = game.rounds.filter((_, i) => i !== index)
    onUpdate({ ...game, rounds: newRounds })
    setEditingRound(null)
  }, [game, onUpdate])

  const handleUndoLastRound = useCallback(() => {
    if (game.rounds.length === 0) return
    onUpdate({ ...game, rounds: game.rounds.slice(0, -1) })
  }, [game, onUpdate])

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Decorative background elements for desktop */}
      <div className="desktop-decorative desktop-decorative-1" aria-hidden="true" />
      <div className="desktop-decorative desktop-decorative-2" aria-hidden="true" />
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-[var(--color-border)] glass sticky top-0 z-10">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
              aria-label="Volver al inicio"
            >
              <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            <div>
              <h1 className="text-base lg:text-xl font-semibold text-[var(--color-text-primary)]">Chinchon</h1>
              <div className="flex items-center gap-2 text-xs lg:text-sm text-[var(--color-text-muted)]">
                <span>Ronda {game.rounds.length + 1}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                <span>{game.scoreLimit} pts</span>
                {currentDealer && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                    <span className="text-[var(--color-warning)]">Reparte: {currentDealer.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            {game.rounds.length > 0 && (
              <button
                onClick={handleUndoLastRound}
                className="p-2.5 lg:p-3 text-[var(--color-text-secondary)] hover:text-[var(--color-warning)] rounded-xl hover:bg-[var(--color-warning-subtle)] transition-colors"
                title="Deshacer ultima ronda"
                aria-label="Deshacer ultima ronda"
              >
                <UndoIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            )}
            <button
              onClick={onFinish}
              className="p-2.5 lg:p-3 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] rounded-xl hover:bg-[var(--color-danger-subtle)] transition-colors"
              title="Terminar partida"
              aria-label="Terminar partida"
            >
              <XIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Game over banner */}
      {isGameOver && winner && (
        <GameOverBanner winner={winner} ranking={ranking} totals={totals} onFinish={onFinish} />
      )}

      {/* Main content - desktop layout with sidebar */}
      <div className="flex-1 w-full max-w-6xl mx-auto relative z-10">
        <div className="lg:grid lg:grid-cols-[1fr,320px] lg:gap-6 lg:p-6">
          {/* Score Table */}
          <div className="overflow-x-auto animate-fade-slide-in lg:card lg:overflow-hidden">
            <ScoreTable
              game={game}
              totals={totals}
              eliminatedPlayers={eliminatedPlayers}
              onEditRound={setEditingRound}
            />
          </div>

          {/* Desktop sidebar with game info */}
          <aside className="hidden lg:block">
            <div className="card p-6 sticky top-24">
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Informacion del juego</h3>
              
              <div className="space-y-4">
                {/* Players */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-subtle)] flex items-center justify-center shrink-0">
                    <UsersIcon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Jugadores</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {game.players.map(p => p.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Score limit */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-warning-subtle)] flex items-center justify-center shrink-0">
                    <TargetIcon className="w-5 h-5 text-[var(--color-warning)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Limite</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{game.scoreLimit} puntos</p>
                  </div>
                </div>

                {/* Current dealer */}
                {currentDealer && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                      <span className="text-sm font-bold text-[var(--color-warning)]">R</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">Reparte</p>
                      <p className="text-sm text-[var(--color-warning)]">{currentDealer.name}</p>
                    </div>
                  </div>
                )}

                {/* Progress */}
                <div className="pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between text-sm text-[var(--color-text-muted)] mb-2">
                    <span>Rondas jugadas</span>
                    <span className="font-mono font-medium text-[var(--color-text-primary)]">{game.rounds.length}</span>
                  </div>
                </div>
              </div>

              {/* Desktop add round button */}
              {!isGameOver && (
                <button
                  onClick={() => setShowAddRound(true)}
                  className="mt-6 w-full py-4 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
                    boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Anotar ronda</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile add round button */}
      {!isGameOver && (
        <div className="lg:hidden sticky bottom-0 px-4 py-4 glass border-t border-[var(--color-border)] safe-bottom">
          <button
            onClick={() => setShowAddRound(true)}
            className="w-full max-w-lg mx-auto block py-4 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
              boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
            }}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Anotar ronda</span>
          </button>
        </div>
      )}

      {/* Add round modal */}
      {showAddRound && (
        <AddRoundModal
          players={game.players.filter(p => !eliminatedPlayers.has(p.id))}
          onSave={handleAddRound}
          onClose={() => setShowAddRound(false)}
        />
      )}

      {/* Edit round modal */}
      {editingRound !== null && (
        <AddRoundModal
          players={game.players}
          initialScores={game.rounds[editingRound]?.scores}
          roundNumber={editingRound + 1}
          onSave={(scores) => handleEditRound(editingRound, scores)}
          onDelete={() => handleDeleteRound(editingRound)}
          onClose={() => setEditingRound(null)}
        />
      )}
    </div>
  )
}
