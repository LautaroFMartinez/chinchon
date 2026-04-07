import type { Game } from '../types'

interface Props {
  game: Game
  totals: Record<string, number>
  eliminatedPlayers: Set<string>
  onEditRound: (index: number) => void
}

function NoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

export function ScoreTable({ game, totals, eliminatedPlayers, onEditRound }: Props) {
  const { players, rounds } = game

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center mb-4">
          <NoteIcon className="w-8 h-8 text-[var(--color-text-muted)]" />
        </div>
        <p className="text-[var(--color-text-secondary)] font-medium">Sin rondas anotadas</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Presiona el boton para anotar la primera ronda</p>
      </div>
    )
  }

  const leader = [...players].sort((a, b) => (totals[a.id] ?? 0) - (totals[b.id] ?? 0))[0]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="sticky left-0 bg-[var(--color-background)] px-4 py-4 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-14">
              #
            </th>
            {players.map(p => (
              <th
                key={p.id}
                className={`px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider min-w-[90px] ${
                  eliminatedPlayers.has(p.id)
                    ? 'text-[var(--color-danger)]/60'
                    : p.id === leader?.id
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="truncate max-w-[80px]">{p.name}</span>
                  {eliminatedPlayers.has(p.id) && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-[var(--color-danger-subtle)] text-[var(--color-danger)] rounded-full">
                      eliminado
                    </span>
                  )}
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
              className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)] cursor-pointer active:bg-[var(--color-surface-hover)] transition-colors animate-row"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <td className="sticky left-0 bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-muted)] font-mono text-xs font-medium">
                {i + 1}
              </td>
              {players.map((p, pi) => {
                const score = round.scores[p.id] ?? 0
                const isDealer = round.dealerIndex === pi
                return (
                  <td
                    key={p.id}
                    className={`px-4 py-3 text-center font-mono relative ${
                      eliminatedPlayers.has(p.id)
                        ? 'text-[var(--color-text-disabled)]'
                        : score < 0
                          ? 'text-[var(--color-primary)] font-semibold'
                          : score === 0
                            ? 'text-[var(--color-text-muted)]'
                            : score >= 20
                              ? 'text-[var(--color-danger)] font-semibold'
                              : 'text-[var(--color-text-primary)]'
                    }`}
                  >
                    {isDealer && (
                      <span 
                        className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] bg-[var(--color-warning-subtle)] text-[var(--color-warning)] rounded-full" 
                        title="Repartidor"
                      >
                        R
                      </span>
                    )}
                    {score > 0 ? `+${score}` : score}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[var(--color-border)]">
            <td className="sticky left-0 bg-[var(--color-background)] px-4 py-4 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Total
            </td>
            {players.map(p => {
              const total = totals[p.id] ?? 0
              const isLeader = p.id === leader?.id
              return (
                <td
                  key={p.id}
                  className={`px-4 py-4 text-center font-mono font-bold text-lg ${
                    eliminatedPlayers.has(p.id)
                      ? 'text-[var(--color-danger)]/60 line-through'
                      : isLeader
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-text-primary)]'
                  }`}
                >
                  {total}
                </td>
              )
            })}
          </tr>
          {/* Progress bar row */}
          <tr>
            <td className="sticky left-0 bg-[var(--color-background)]"></td>
            {players.map(p => {
              const total = totals[p.id] ?? 0
              const pct = Math.min((total / game.scoreLimit) * 100, 100)
              return (
                <td key={p.id} className="px-4 pb-4">
                  <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 90 
                          ? 'bg-gradient-to-r from-[var(--color-danger)] to-red-400' 
                          : pct >= 70 
                            ? 'bg-gradient-to-r from-[var(--color-warning)] to-amber-400' 
                            : 'bg-gradient-to-r from-[var(--color-primary)] to-emerald-400'
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
