// ComparePage — side-by-side valuation/financials for 2-4 tickers (`/compare`).
// Ticker list lives in the URL (?tickers=AAPL,MSFT,NVDA) so a comparison is a
// shareable/bookmarkable link, same spirit as /stocks/:ticker. Uses the same
// price + financials payloads the single-ticker workspace renders — no new
// backend surface, this is a read-side recombination of existing data.

import { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useCompareData, type CompareEntry } from '../hooks/useCompare'
import { TickerAddInput } from '../components/TickerAddInput'
import { sanitizeTickerInput, isValidTicker } from '../utils/ticker'
import { formatCurrency, formatCompactNumber, formatPercent, formatNumber } from '../utils/format'

const MAX_TICKERS = 4

function parseTickers(raw: string | null): string[] {
  if (!raw) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of raw.split(',')) {
    const t = sanitizeTickerInput(part)
    if (t && isValidTicker(t) && !seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
    if (out.length >= MAX_TICKERS) break
  }
  return out
}

interface MetricRow {
  label: string
  render: (e: CompareEntry, locale: 'en' | 'zh') => string
  color?: (e: CompareEntry) => string | undefined
}

const ROWS: MetricRow[] = [
  {
    label: 'Price',
    render: (e, locale) =>
      e.price?.current_price != null
        ? formatCurrency(e.price.current_price, e.price.quote_currency ?? 'USD', locale)
        : '—',
  },
  {
    label: 'Change %',
    render: (e, locale) => {
      const pct = e.price?.change_pct
      if (pct == null) return '—'
      return `${pct >= 0 ? '+' : ''}${formatPercent(pct, locale, 2, true)}`
    },
    color: (e) => {
      const pct = e.price?.change_pct
      if (pct == null) return undefined
      return pct >= 0 ? 'var(--success)' : 'var(--danger)'
    },
  },
  {
    label: 'Market Cap',
    render: (e, locale) => formatCompactNumber(e.financials?.market?.market_cap, locale),
  },
  {
    label: 'P/E (TTM)',
    render: (e, locale) => formatNumber(e.financials?.market?.pe_ratio, locale, 1),
  },
  {
    label: 'EV / EBITDA',
    render: (e, locale) => formatNumber(e.financials?.valuation?.ev_ebitda, locale, 1),
  },
  {
    label: 'EV / Revenue',
    render: (e, locale) => formatNumber(e.financials?.valuation?.ev_revenue, locale, 1),
  },
  {
    label: 'Revenue (TTM)',
    render: (e, locale) => formatCompactNumber(e.financials?.income?.revenue, locale),
  },
  {
    label: 'EBITDA',
    render: (e, locale) => formatCompactNumber(e.financials?.income?.ebitda, locale),
  },
  {
    label: 'Net Income',
    render: (e, locale) => formatCompactNumber(e.financials?.income?.net_income, locale),
  },
  {
    label: 'Gross Margin',
    render: (e, locale) => formatPercent(e.financials?.income?.gross_margin, locale, 1),
  },
  {
    label: 'Operating Margin',
    render: (e, locale) => formatPercent(e.financials?.income?.operating_margin, locale, 1),
  },
  {
    label: 'Beta',
    render: (e, locale) => formatNumber(e.financials?.market?.beta, locale, 2),
  },
  {
    label: 'Sector',
    render: (e) => e.financials?.market?.sector ?? '—',
  },
]

export function ComparePage(): React.ReactElement {
  const { locale } = useI18n()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tickers = useMemo(() => parseTickers(params.get('tickers')), [params])
  const entries = useCompareData(tickers)

  function setTickers(next: string[]): void {
    const p = new URLSearchParams(params)
    if (next.length) p.set('tickers', next.join(','))
    else p.delete('tickers')
    setParams(p, { replace: true })
  }

  function addTicker(raw: string): boolean {
    const t = sanitizeTickerInput(raw)
    if (!t || !isValidTicker(t) || tickers.includes(t) || tickers.length >= MAX_TICKERS) {
      return false
    }
    setTickers([...tickers, t])
    return true
  }

  function removeTicker(t: string): void {
    setTickers(tickers.filter((x) => x !== t))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px 24px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Compare
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Side-by-side valuation and financials — up to {MAX_TICKERS} tickers at once.
          </p>
        </div>
        {tickers.length < MAX_TICKERS ? (
          <div style={{ width: 280 }}>
            <TickerAddInput placeholder="e.g. NVDA" buttonLabel="Add" onAdd={addTicker} />
          </div>
        ) : null}
      </div>

      {tickers.length === 0 ? (
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
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Add two or more tickers to compare
          </div>
          <div style={{ fontSize: 12.5 }}>Try AAPL, MSFT, NVDA</div>
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
                <th style={thStyle('left')}>Metric</th>
                {entries.map((e) => (
                  <th key={e.ticker} style={thStyle('right')}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/stocks/${e.ticker}`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: 13,
                          color: 'var(--text-primary)',
                          textTransform: 'uppercase',
                          padding: 0,
                        }}
                      >
                        {e.ticker}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTicker(e.ticker)}
                        aria-label={`Remove ${e.ticker}`}
                        title="Remove"
                        style={{
                          background: 'none',
                          border: '1px solid var(--border-faint)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px 6px',
                          fontSize: 10,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--border-faint)' }}>
                  <td
                    style={{
                      padding: '10px 10px',
                      fontSize: 12.5,
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.label}
                  </td>
                  {entries.map((e) => (
                    <td
                      key={e.ticker}
                      style={{
                        padding: '10px 10px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12.5,
                        color: row.color?.(e) ?? 'var(--text-primary)',
                      }}
                    >
                      {e.priceLoading || e.financialsLoading ? '…' : row.render(e, locale)}
                    </td>
                  ))}
                </tr>
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
