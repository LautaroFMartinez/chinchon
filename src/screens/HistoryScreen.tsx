import type { Game } from '../types'

interface Props {
  games: Game[]
  onBack: () => void
  onOpenGame: (gameId: string) => void
  onDeleteGame: (gameId: string) => void
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.025 6.025 0 01-2.27.949V14.5a5.972 5.972 0 002.27-.949z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
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
      {/* Decorative background elements for desktop */}
      <div className="desktop-decorative desktop-decorative-1" aria-hidden="true" />
      <div className="desktop-decorative desktop-decorative-2" aria-hidden="true" />
      
      <header className="flex items-center gap-4 px-4 lg:px-6 py-4 border-b border-[var(--color-border)] glass sticky top-0 z-10">
        <div className="w-full max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Volver"
          >
            <ChevronLeftIcon className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-semibold text-[var(--color-text-primary)]">Historial</h1>
            <p className="text-xs lg:text-sm text-[var(--color-text-muted)]">{games.length} partida{games.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 lg:py-8 w-full max-w-4xl mx-auto animate-fade-slide-in relative z-10">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 lg:w-10 lg:h-10 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-secondary)] font-medium lg:text-lg">No hay partidas guardadas</p>
            <p className="text-sm lg:text-base text-[var(--color-text-muted)] mt-1">Las partidas que juegues apareceran aqui</p>
          </div>
        ) : (
          <div className="grid gap-3 lg:gap-4 lg:grid-cols-2">
            {games.map((game, index) => {
              const winner = getWinner(game)
              return (
                <div
                  key={game.id}
                  className="card p-4 lg:p-5 animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <button 
                      onClick={() => onOpenGame(game.id)} 
                      className="flex-1 text-left"
                    >
                      {/* Players */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm lg:text-base font-semibold text-[var(--color-text-primary)]">
                          {game.players.map(p => p.name).join(', ')}
                        </span>
                        {game.finishedAt && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] rounded-full">
                            Terminada
                          </span>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-3 text-xs lg:text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                          {game.rounds.length} rondas
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
                          Limite {game.scoreLimit}
                        </span>
                        {winner && (
                          <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
                            <TrophyIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            {winner.name}
                          </span>
                        )}
                      </div>
                      
                      {/* Date */}
                      <p className="text-xs lg:text-sm text-[var(--color-text-disabled)] mt-2 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        {formatDate(game.createdAt)}
                      </p>
                    </button>
                    
                    <button
                      onClick={() => onDeleteGame(game.id)}
                      className="p-2.5 lg:p-3 text-[var(--color-text-disabled)] hover:text-[var(--color-danger)] rounded-xl hover:bg-[var(--color-danger-subtle)] transition-colors ml-2 shrink-0"
                      aria-label="Eliminar partida"
                    >
                      <TrashIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
