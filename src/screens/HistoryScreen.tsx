import type { Game } from '../types'

interface Props {
  games: Game[]
  onBack: () => void
  onOpenGame: (gameId: string) => void
  onDeleteGame: (gameId: string) => void
}

function formatDate(ts: number) {
  const d = new Date(ts)
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getWinner(game: Game) {
  if (game.rounds.length === 0) return null
  const totals: Record<string, number> = {}
  for (const p of game.players) totals[p.id] = 0
  for (const r of game.rounds) {
    for (const [pid, score] of Object.entries(r.scores)) {
      totals[pid] = (totals[pid] ?? 0) + score
    }
  }
  const sorted = [...game.players].sort((a, b) => (totals[a.id] ?? 0) - (totals[b.id] ?? 0))
  return sorted[0]
}

export function HistoryScreen({ games, onBack, onOpenGame, onDeleteGame }: Props) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Historial</h1>
      </header>

      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <p>No hay partidas guardadas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map(game => {
              const winner = getWinner(game)
              return (
                <div
                  key={game.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <button onClick={() => onOpenGame(game.id)} className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200">
                        {game.players.map(p => p.name).join(', ')}
                      </span>
                      {game.finishedAt && (
                        <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Terminada</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{game.rounds.length} rondas</span>
                      <span>Límite {game.scoreLimit}</span>
                      {winner && <span className="text-emerald-400">Ganador: {winner.name}</span>}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{formatDate(game.createdAt)}</p>
                  </button>
                  <button
                    onClick={() => onDeleteGame(game.id)}
                    className="p-2 text-slate-600 hover:text-red-400 rounded-lg hover:bg-slate-800 ml-2 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
