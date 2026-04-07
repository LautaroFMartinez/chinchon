import type { Player } from '../types'

interface Props {
  winner: Player
  ranking: Player[]
  totals: Record<string, number>
  onFinish: () => void
}

export function GameOverBanner({ winner, ranking, totals, onFinish }: Props) {
  return (
    <div className="bg-gradient-to-b from-emerald-900/30 to-transparent border-b border-emerald-800/30 px-4 py-6 text-center animate-scale-in">
      <div className="text-4xl mb-2">🏆</div>
      <h2 className="text-2xl font-bold text-emerald-400 mb-1">
        {winner.name} gana!
      </h2>
      <p className="text-sm text-slate-400 mb-4">Partida terminada</p>

      {/* Final ranking */}
      <div className="max-w-xs mx-auto space-y-1.5">
        {ranking.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              i === 0 ? 'bg-emerald-900/30 text-emerald-300' : 'bg-slate-800/50 text-slate-400'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 text-center font-mono text-xs">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <span className="font-medium">{p.name}</span>
            </span>
            <span className="font-mono">{totals[p.id] ?? 0} pts</span>
          </div>
        ))}
      </div>

      <button
        onClick={onFinish}
        className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  )
}
