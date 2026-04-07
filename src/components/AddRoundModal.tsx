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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl max-h-[85dvh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold">
            {isEditing ? `Editar ronda ${roundNumber}` : 'Anotar ronda'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scores */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {players.map((p, i) => (
            <div key={p.id}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{p.name}</label>
              <input
                ref={el => { inputRefs.current[i] = el }}
                type="number"
                inputMode="numeric"
                value={scores[p.id] ?? ''}
                onChange={e => setScores(prev => ({ ...prev, [p.id]: e.target.value }))}
                onKeyDown={e => handleKeyDown(e, i)}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg font-mono text-center placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              {/* Quick score buttons */}
              <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                {quickScores.map(qs => (
                  <button
                    key={qs}
                    onClick={() => setScores(prev => ({ ...prev, [p.id]: qs.toString() }))}
                    className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                      parseInt(scores[p.id] ?? '0', 10) === qs
                        ? 'bg-emerald-600 text-white'
                        : qs < 0
                          ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {qs > 0 ? `+${qs}` : qs}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800 flex gap-2">
          {isEditing && onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 font-medium rounded-xl transition-colors"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors"
          >
            {isEditing ? 'Guardar cambios' : 'Anotar'}
          </button>
        </div>
      </div>
    </div>
  )
}
