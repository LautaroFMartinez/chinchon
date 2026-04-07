import { useState, useRef, useEffect } from 'react'
import type { Player } from '../types'

interface Props {
  players: Player[]
  initialScores?: Record<string, number>
  roundNumber?: number
  onSave: (scores: Record<string, number>) => void
  onDelete?: () => void
  onClose: () => void
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function AddRoundModal({ players, initialScores, roundNumber, onSave, onDelete, onClose }: Props) {
  const [scores, setScores] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const p of players) {
      init[p.id] = initialScores?.[p.id]?.toString() ?? ''
    }
    return init
  })
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const isEditing = roundNumber !== undefined

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSave = () => {
    const parsed: Record<string, number> = {}
    for (const p of players) {
      const val = scores[p.id]?.trim()
      parsed[p.id] = val === '' || val === undefined ? 0 : parseInt(val, 10)
      if (isNaN(parsed[p.id])) parsed[p.id] = 0
    }
    onSave(parsed)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index < players.length - 1) {
        inputRefs.current[index + 1]?.focus()
      } else {
        handleSave()
      }
    }
  }

  const quickScores = [-10, 0, 5, 10, 15, 20, 25, 30]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-t-3xl sm:rounded-3xl max-h-[90dvh] flex flex-col animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-text-primary)]">
              {isEditing ? `Editar ronda ${roundNumber}` : 'Anotar ronda'}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isEditing ? 'Modifica los puntos de esta ronda' : 'Ingresa los puntos de cada jugador'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-xl hover:bg-[var(--color-surface)] transition-colors"
            aria-label="Cerrar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scores */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {players.map((p, i) => (
            <div key={p.id} className="animate-scale-in" style={{ animationDelay: `${i * 30}ms` }}>
              <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                {p.name}
              </label>
              <input
                ref={el => { inputRefs.current[i] = el }}
                type="number"
                inputMode="numeric"
                value={scores[p.id] ?? ''}
                onChange={e => setScores(prev => ({ ...prev, [p.id]: e.target.value }))}
                onKeyDown={e => handleKeyDown(e, i)}
                placeholder="0"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-4 text-[var(--color-text-primary)] text-xl font-mono text-center placeholder-[var(--color-text-disabled)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-subtle)] transition-all"
              />
              
              {/* Quick score buttons */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-1 px-1">
                {quickScores.map(qs => {
                  const isSelected = parseInt(scores[p.id] ?? '0', 10) === qs
                  const isNegative = qs < 0
                  return (
                    <button
                      key={qs}
                      onClick={() => setScores(prev => ({ ...prev, [p.id]: qs.toString() }))}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        isSelected
                          ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
                          : isNegative
                            ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20'
                            : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {qs > 0 ? `+${qs}` : qs}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-[var(--color-border)] flex gap-3 safe-bottom">
          {isEditing && onDelete && (
            <button
              onClick={onDelete}
              className="px-5 py-3.5 bg-[var(--color-danger-subtle)] hover:bg-[var(--color-danger)]/20 text-[var(--color-danger)] font-semibold rounded-xl transition-colors"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #059669 100%)',
              boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)'
            }}
          >
            {isEditing ? 'Guardar cambios' : 'Anotar puntos'}
          </button>
        </div>
      </div>
    </div>
  )
}
