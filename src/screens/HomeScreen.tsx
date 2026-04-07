import type { Game } from '../types'

interface Props {
  activeGame: Game | null
  hasHistory: boolean
  onNewGame: () => void
  onContinueGame: () => void
  onViewHistory: () => void
}

export function HomeScreen({ activeGame, hasHistory, onNewGame, onContinueGame, onViewHistory }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-4 py-8 animate-fade-slide-in">
      <div className="text-6xl mb-4">🃏</div>
      <h1 className="text-4xl font-bold mb-2 tracking-tight">Chinchón</h1>
      <p className="text-slate-400 mb-10 text-lg">Anotador de puntos</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {activeGame && !activeGame.finishedAt && (
          <button
            onClick={onContinueGame}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
          >
            Continuar partida
          </button>
        )}

        <button
          onClick={onNewGame}
          className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          Nueva partida
        </button>

        {hasHistory && (
          <button
            onClick={onViewHistory}
            className="w-full py-3.5 px-6 text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium rounded-xl transition-colors"
          >
            Historial
          </button>
        )}
      </div>

      {activeGame && !activeGame.finishedAt && (
        <div className="mt-8 px-4 py-3 bg-slate-900 rounded-xl border border-slate-800 max-w-xs w-full">
          <p className="text-sm text-slate-400">
            Partida en curso: <span className="text-slate-200">{activeGame.players.map(p => p.name).join(', ')}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Ronda {activeGame.rounds.length} &middot; Límite {activeGame.scoreLimit} pts
          </p>
        </div>
      )}
    </div>
  )
}
