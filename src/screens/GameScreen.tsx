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
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-semibold">Chinchón</h1>
            <p className="text-xs text-slate-500">
              Ronda {game.rounds.length + 1} &middot; Límite {game.scoreLimit}
              {currentDealer && <> &middot; Reparte <span className="text-amber-400">{currentDealer.name}</span></>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {game.rounds.length > 0 && (
            <button
              onClick={handleUndoLastRound}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
              title="Deshacer última ronda"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
              </svg>
            </button>
          )}
          <button
            onClick={onFinish}
            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
            title="Terminar partida"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Game over banner */}
      {isGameOver && winner && (
        <GameOverBanner winner={winner} ranking={ranking} totals={totals} onFinish={onFinish} />
      )}

      {/* Score Table */}
      <div className="flex-1 overflow-x-auto">
        <ScoreTable
          game={game}
          totals={totals}
          eliminatedPlayers={eliminatedPlayers}
          onEditRound={setEditingRound}
        />
      </div>

      {/* Add round button */}
      {!isGameOver && (
        <div className="sticky bottom-0 px-4 py-4 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800">
          <button
            onClick={() => setShowAddRound(true)}
            className="w-full max-w-lg mx-auto block py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Anotar ronda
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
