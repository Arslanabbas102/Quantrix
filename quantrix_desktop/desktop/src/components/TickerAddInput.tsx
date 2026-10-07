// TickerAddInput — a small, self-contained "type a ticker, hit Enter" control
// shared by the Watchlist and Compare pages. Deliberately lighter than the
// homepage hero search (TickerSuggestions): no autocomplete dropdown, just
// input sanitation + validation, so it stays trivial to drop into a toolbar.

import { useState } from 'react'
import { sanitizeTickerInput, isValidTicker } from '../utils/ticker'

interface TickerAddInputProps {
  placeholder?: string
  buttonLabel?: string
  /** Return false (or throw) to reject — the input keeps its value and shakes. */
  onAdd: (ticker: string) => boolean
  disabled?: boolean
}

export function TickerAddInput({
  placeholder = 'Add a ticker…',
  buttonLabel = 'Add',
  onAdd,
  disabled = false,
}: TickerAddInputProps): React.ReactElement {
  const [value, setValue] = useState('')
  const [rejected, setRejected] = useState(false)

  function submit(): void {
    const ticker = sanitizeTickerInput(value)
    if (!ticker || !isValidTicker(ticker)) {
      setRejected(true)
      return
    }
    const ok = onAdd(ticker)
    if (ok) {
      setValue('')
      setRejected(false)
    } else {
      setRejected(true)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value)
          setRejected(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        style={{
          flex: 1,
          minWidth: 0,
          padding: '9px 12px',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${rejected ? 'var(--danger)' : 'var(--border-soft)'}`,
          background: 'var(--bg-input)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          outline: 'none',
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={submit}
        style={{
          padding: '9px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-glow)',
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 600,
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
