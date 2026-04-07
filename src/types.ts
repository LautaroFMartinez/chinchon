export interface Player {
  id: string
  name: string
}

export interface Round {
  id: string
  scores: Record<string, number> // playerId -> score
  dealerIndex: number
}

export interface Game {
  id: string
  players: Player[]
  rounds: Round[]
  scoreLimit: number
  createdAt: number
  finishedAt?: number
}

export type Screen = 'home' | 'setup' | 'game' | 'history'
