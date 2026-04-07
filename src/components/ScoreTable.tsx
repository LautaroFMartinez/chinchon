import type { Game } from '../types'

interface Props {
  game: Game
  totals: Record<string, number>
  eliminatedPlayers: Set<string>
  onEditRound: (index: number) => void
}

export function ScoreTable({ game, totals, eliminatedPlayers, onEditRound }: Props) {
  const { players, rounds } = game

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="text-4xl mb-4">📝</div>
        <p>Anotá la primera ronda</p>
      </div>
    )
  }

  const leader = [...players].sort((a, b) => (totals[a.id] ?? 0) - (totals[b.id] ?? 0))[0]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="sticky left-0 bg-slate-950 px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
              #
            </th>
            {players.map(p => (
              <th
                key={p.id}
                className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider min-w-[80px] ${
                  eliminatedPlayers.has(p.id)
                    ? 'text-red-400/60'
                    : p.id === leader?.id
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="truncate max-w-[80px]">{p.name}</span>
                  {eliminatedPlayers.has(p.id) && <span className="text-[10px]">eliminado</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rounds.map((round, i) => (
            <tr
              key={round.id}
              onClick={() => onEditRound(i)}
              className="border-b border-slate-800/50 hover:bg-slate-900/50 cursor-pointer active:bg-slate-800/50 animate-row"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <td className="sticky left-0 bg-slate-950 px-3 py-2.5 text-slate-500 font-mono text-xs">
                {i + 1}
              </td>
              {players.map((p, pi) => {
                const score = round.scores[p.id] ?? 0
                const isDealer = round.dealerIndex === pi
                return (
                  <td
                    key={p.id}
                    className={`px-3 py-2.5 text-center font-mono relative ${
                      eliminatedPlayers.has(p.id)
                        ? 'text-slate-600'
                        : score < 0
                          ? 'text-emerald-400'
                          : score === 0
                            ? 'text-slate-500'
                            : score >= 20
                              ? 'text-red-400'
                              : 'text-slate-200'
                    }`}
                  >
                    {isDealer && <span className="absolute top-0.5 right-0.5 text-[9px] leading-none" title="Repartidor">🎴</span>}
                    {score > 0 ? `+${score}` : score}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-700">
            <td className="sticky left-0 bg-slate-950 px-3 py-3 text-xs font-bold text-slate-400 uppercase">
              Total
            </td>
            {players.map(p => {
              const total = totals[p.id] ?? 0
              const isLeader = p.id === leader?.id
              return (
                <td
                  key={p.id}
                  className={`px-3 py-3 text-center font-mono font-bold text-base ${
                    eliminatedPlayers.has(p.id)
                      ? 'text-red-400/60 line-through'
                      : isLeader
                        ? 'text-emerald-400'
                        : 'text-slate-200'
                  }`}
                >
                  {total}
                </td>
              )
            })}
          </tr>
          {/* Progress bar row */}
          <tr>
            <td className="sticky left-0 bg-slate-950"></td>
            {players.map(p => {
              const total = totals[p.id] ?? 0
              const pct = Math.min((total / game.scoreLimit) * 100, 100)
              return (
                <td key={p.id} className="px-3 pb-3">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>
              )
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
