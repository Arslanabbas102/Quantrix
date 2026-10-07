// watchlistStore — a personal, client-side ticker list distinct from Coverage
// (which auto-enrols every ticker you've opened for research). The Watchlist is
// opt-in and user-curated: you add names you want to keep an eye on, with an
// optional note, independent of whether you've ever run research on them.
// Pure localStorage — no backend route, so it stays a pure frontend feature
// (coverage.py §1 explicitly keeps the server side to one auto-managed group).

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { sanitizeTickerInput, isValidTicker } from '../utils/ticker'

export interface WatchlistItem {
  ticker: string
  note: string
  addedAt: string
}

interface WatchlistState {
  items: WatchlistItem[]
  /** Adds the ticker if valid and not already present. Returns false if rejected. */
  add: (raw: string) => boolean
  remove: (ticker: string) => void
  setNote: (ticker: string, note: string) => void
  has: (ticker: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (raw) => {
        const ticker = sanitizeTickerInput(raw)
        if (!ticker || !isValidTicker(ticker)) return false
        if (get().items.some((i) => i.ticker === ticker)) return false
        set((s) => ({
          items: [...s.items, { ticker, note: '', addedAt: new Date().toISOString() }],
        }))
        return true
      },
      remove: (ticker) => set((s) => ({ items: s.items.filter((i) => i.ticker !== ticker) })),
      setNote: (ticker, note) =>
        set((s) => ({
          items: s.items.map((i) => (i.ticker === ticker ? { ...i, note } : i)),
        })),
      has: (ticker) => get().items.some((i) => i.ticker === sanitizeTickerInput(ticker)),
    }),
    {
      name: 'quantrix-watchlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
)
