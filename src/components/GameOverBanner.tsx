import type { Player } from '../types'

interface Props {
  winner: Player
  ranking: Player[]
  totals: Record<string, number>
  onFinish: () => void
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.025 6.025 0 01-2.27.949V14.5a5.972 5.972 0 002.27-.949z" />
    </svg>
  )
}

export function GameOverBanner({ winner, ranking, totals, onFinish }: Props) {
  return (
    <div className="relative overflow-hidden border-b border-[var(--color-primary)]/30 px-4 py-8 text-center animate-scale-in">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, transparent 100%)'
        }}
      />
      
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[var(--color-primary)]/20 blur-3xl" />
      
      <div className="relative">
        {/* Trophy */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--color-primary-subtle)] mb-4 animate-pulse-glow">
          <TrophyIcon className="w-10 h-10 text-[var(--color-primary)]" />
        </div>
        
        {/* Winner name */}
        <h2 className="text-3xl font-bold mb-1">
          <span className="gradient-text">{winner.name}</span>
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">gana la partida</p>

        {/* Final ranking */}
        <div className="max-w-xs mx-auto space-y-2">
          {ranking.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                i === 0 
                  ? 'bg-[var(--color-primary-subtle)] border border-[var(--color-primary)]/30' 
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)]'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="flex items-center gap-3">
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold ${
                  i === 0 
                    ? 'bg-[var(--color-primary)] text-white' 
                    : i === 1 
                      ? 'bg-zinc-400 text-zinc-900'
                      : i === 2 
                        ? 'bg-amber-600 text-white'
                        : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
                }`}>
                  {i + 1}
                </span>
                <span className={`font-medium ${
                  i === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                }`}>
                  {p.name}
                </span>
              </span>
              <span className={`font-mono font-semibold ${
                i === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
              }`}>
                {totals[p.id] ?? 0} pts
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onFinish}
          className="mt-6 px-8 py-3 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
            boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
          }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
