import type { Game } from '../types'

interface Props {
  activeGame: Game | null
  hasHistory: boolean
  onNewGame: () => void
  onContinueGame: () => void
  onViewHistory: () => void
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="24" height="36" rx="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <rect x="16" y="8" width="24" height="36" rx="3" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2"/>
      <path d="M28 20L32 26M28 32L32 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="28" cy="16" r="2" fill="currentColor"/>
      <circle cx="28" cy="36" r="2" fill="currentColor"/>
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export function HomeScreen({ activeGame, hasHistory, onNewGame, onContinueGame, onViewHistory }: Props) {
  const hasActiveGame = activeGame && !activeGame.finishedAt

  return (
    <div className="flex flex-col min-h-dvh px-6 py-8 animate-fade-slide-in">
      {/* Header with branding */}
      <header className="flex-shrink-0 pt-8 pb-4">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[var(--color-primary)] opacity-20 blur-2xl rounded-full scale-150" />
            <CardIcon className="relative w-20 h-20 text-[var(--color-primary)] animate-float" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            <span className="gradient-text">Chinchon</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg font-medium">
            Anotador de puntos
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center py-8">
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
          {/* Continue game button */}
          {hasActiveGame && (
            <button
              onClick={onContinueGame}
              className="group relative w-full py-4 px-6 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
                boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-3">
                <PlayIcon className="w-5 h-5" />
                <span>Continuar partida</span>
              </div>
            </button>
          )}

          {/* New game button */}
          <button
            onClick={onNewGame}
            className={`group w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              hasActiveGame
                ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-text-muted)]'
                : 'text-white'
            }`}
            style={!hasActiveGame ? { 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
              boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
            } : undefined}
          >
            <div className="flex items-center justify-center gap-3">
              <PlusIcon className="w-5 h-5" />
              <span>Nueva partida</span>
            </div>
          </button>

          {/* History button */}
          {hasHistory && (
            <button
              onClick={onViewHistory}
              className="w-full py-4 px-6 rounded-2xl font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3">
                <HistoryIcon className="w-5 h-5" />
                <span>Ver historial</span>
              </div>
            </button>
          )}
        </div>

        {/* Active game card */}
        {hasActiveGame && (
          <div className="mt-8 max-w-sm mx-auto w-full animate-scale-in">
            <div className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-subtle)] flex items-center justify-center">
                    <CardIcon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">Partida en curso</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Ronda {activeGame.rounds.length + 1}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-[var(--color-primary-subtle)] text-[var(--color-primary)] rounded-full">
                  Activa
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    {activeGame.players.map(p => p.name).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TargetIcon className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    Limite: {activeGame.scoreLimit} puntos
                  </span>
                </div>
              </div>
              
              {/* Progress indicator */}
              {activeGame.rounds.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-2">
                    <span>Progreso</span>
                    <span>{activeGame.rounds.length} rondas jugadas</span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((activeGame.rounds.length / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 py-6">
        <p className="text-center text-xs text-[var(--color-text-disabled)]">
          Desliza para jugar
        </p>
      </footer>
    </div>
  )
}
