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
    if (game.rounds.length === 0) return 0
    const last = game.rounds[game.rounds.length - 1]
    return (last.dealerIndex + 1) % game.players.length
  }, [game.rounds, game.players.length])

  const currentDealer = game.players[nextDealerIndex]

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
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] glass sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Volver al inicio"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[var(--color-text-primary)]">Chinchon</h1>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
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
        <div className="flex items-center gap-1">
          {game.rounds.length > 0 && (
            <button
              onClick={handleUndoLastRound}
              className="p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-warning)] rounded-xl hover:bg-[var(--color-warning-subtle)] transition-colors"
              title="Deshacer ultima ronda"
              aria-label="Deshacer ultima ronda"
            >
              <UndoIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onFinish}
            className="p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] rounded-xl hover:bg-[var(--color-danger-subtle)] transition-colors"
            title="Terminar partida"
            aria-label="Terminar partida"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Game over banner */}
      {isGameOver && winner && (
        <GameOverBanner winner={winner} ranking={ranking} totals={totals} onFinish={onFinish} />
      )}

      {/* Score Table */}
      <div className="flex-1 overflow-x-auto animate-fade-slide-in">
        <ScoreTable
          game={game}
          totals={totals}
          eliminatedPlayers={eliminatedPlayers}
          onEditRound={setEditingRound}
        />
      </div>

      {/* Add round button */}
      {!isGameOver && (
        <div className="sticky bottom-0 px-4 py-4 glass border-t border-[var(--color-border)] safe-bottom">
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
