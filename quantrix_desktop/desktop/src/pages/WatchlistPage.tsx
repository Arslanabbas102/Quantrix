// WatchlistPage — a personal, user-curated ticker list (`/watchlist`).
// Distinct from Coverage: Coverage auto-enrols every ticker you've ever opened
// for research; the Watchlist is opt-in — names you want to keep an eye on,
// with your own note, whether or not you've run research on them. Pure
// client-side (localStorage via watchlistStore) — no backend route.

import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useWatchlistStore, type WatchlistItem } from '../stores/watchlistStore'
import { useTickerPrice } from '../hooks/useTickerData'
import { TickerAddInput } from '../components/TickerAddInput'
import { formatCurrency, formatPercent } from '../utils/format'

function WatchlistRow({ item }: { item: WatchlistItem }): React.ReactElement {
  const { locale } = useI18n()
  const navigate = useNavigate()
  const removeTicker = useWatchlistStore((s) => s.remove)
  const setNote = useWatchlistStore((s) => s.setNote)
  const priceQuery = useTickerPrice(item.ticker)
  const price = priceQuery.data

  const changePositive = (price?.change_pct ?? 0) >= 0
  const changeColor = price?.change_pct == null ? 'var(--text-muted)' : changePositive ? 'var(--success)' : 'var(--danger)'

  return (
    <tr style={{ borderBottom: '1px solid var(--border-faint)' }}>
      <td style={{ padding: '12px 10px' }}>
        <button
          type="button"
          onClick={() => navigate(`/stocks/${item.ticker}`)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 14,
            color: 'var(--text-primary)',
            padding: 0,
          }}
        >
          {item.ticker}
        </button>
        {price?.company_name ? (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {price.company_name}
          </div>
        ) : null}
      </td>
      <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
        {priceQuery.isLoading
          ? '…'
          : price?.current_price != null
            ? formatCurrency(price.current_price, price.quote_currency ?? 'USD', locale)
            : '—'}
      </td>
      <td
        style={{
          padding: '12px 10px',
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
          color: changeColor,
        }}
      >
        {price?.change_pct != null ? `${changePositive ? '+' : ''}${formatPercent(price.change_pct, locale, 2, true)}` : '—'}
      </td>
      <td style={{ padding: '12px 10px' }}>
        <input
          type="text"
          defaultValue={item.note}
          placeholder="Add a note…"
          onBlur={(e) => setNote(item.ticker, e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-faint)',
            background: 'var(--bg-input)',
            color: 'var(--text-secondary)',
            fontSize: 12.5,
            outline: 'none',
          }}
        />
      </td>
      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
        <button
          type="button"
          onClick={() => removeTicker(item.ticker)}
          aria-label={`Remove ${item.ticker}`}
          title="Remove"
          style={{
            background: 'none',
            border: '1px solid var(--border-faint)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '5px 9px',
            fontSize: 12,
          }}
        >
          ✕
        </button>
      </td>
    </tr>
  )
}

export function WatchlistPage(): React.ReactElement {
  const items = useWatchlistStore((s) => s.items)
  const add = useWatchlistStore((s) => s.add)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Watchlist
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Your own curated list of tickers to keep an eye on — separate from the Coverage archive.
          </p>
        </div>
        <div style={{ width: 280 }}>
          <TickerAddInput placeholder="e.g. AAPL" buttonLabel="Add" onAdd={add} />
        </div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            gap: 6,
          }}
        >
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Your watchlist is empty</div>
          <div style={{ fontSize: 12.5 }}>Add a ticker above to start tracking it.</div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-faint)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <th style={thStyle('left')}>Ticker</th>
                <th style={thStyle('right')}>Price</th>
                <th style={thStyle('right')}>Chg %</th>
                <th style={thStyle('left')}>Note</th>
                <th style={thStyle('right')}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <WatchlistRow key={item.ticker} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function thStyle(align: 'left' | 'right'): React.CSSProperties {
  return {
    padding: '10px 10px',
    textAlign: align,
    fontFamily: 'var(--font-mono)',
    fontSize: 10.5,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
  }
}
