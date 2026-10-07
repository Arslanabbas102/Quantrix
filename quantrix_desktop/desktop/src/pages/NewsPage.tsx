// NewsPage — per-ticker catalyst/news feed (`/news/:ticker`). Surfaces the
// SAME LLM-classified catalyst calendar the equity-research report's "News"
// chapter renders (GET /api/data/{ticker}/catalysts), but as a standalone quick
// look — no need to run a full research artifact just to see what's moving a
// name. Requires an LLM key configured (the classify step is an LLM call); when
// none is set the request fails and we show a clear path to Settings, same
// degrade spirit as the rest of the app's AI-gated surfaces.

import { useNavigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useTickerCatalysts } from '../hooks/useTickerData'
import type { CatalystEventData } from '../hooks/useTickerData'
import { TickerAddInput } from '../components/TickerAddInput'
import { formatSourceDate } from '../utils/format'
import { openExternal } from '../lib/tauri'

const SENTIMENT_COLOR: Record<string, string> = {
  positive: 'var(--success)',
  negative: 'var(--danger)',
  neutral: 'var(--neutral)',
}

const CATEGORY_LABEL: Record<string, string> = {
  product_launch: 'Product',
  earnings: 'Earnings',
  regulatory: 'Regulatory',
  acquisition: 'M&A',
  management: 'Management',
  market: 'Market',
}

function ImpactBars({ score }: { score: number | null | undefined }): React.ReactElement {
  const n = Math.max(0, Math.min(5, score ?? 0))
  return (
    <div style={{ display: 'flex', gap: 2 }} aria-label={`Impact ${n}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 11,
            borderRadius: 1,
            background: i < n ? 'var(--accent-amber)' : 'var(--border-soft)',
          }}
        />
      ))}
    </div>
  )
}

function CatalystCard({ event, locale }: { event: CatalystEventData; locale: 'en' | 'zh' }): React.ReactElement {
  const color = SENTIMENT_COLOR[event.sentiment ?? 'neutral'] ?? 'var(--neutral)'
  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-faint)',
        background: 'var(--bg-card)',
        borderLeft: `3px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
          }}
        >
          {CATEGORY_LABEL[event.category ?? ''] ?? event.category ?? 'News'}
          {event.source_count && event.source_count > 1 ? ` · ${event.source_count} sources` : ''}
        </span>
        <ImpactBars score={event.impact_score} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
        {event.headline}
      </div>
      {event.reasoning ? (
        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{event.reasoning}</div>
      ) : null}
      {event.published || event.url ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--text-dim)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>{event.published ? formatSourceDate(event.published, locale) : ''}</span>
          {event.url ? (
            <button
              type="button"
              onClick={() => void openExternal(event.url ?? '')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'var(--primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
            >
              Source ↗
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export function NewsPage(): React.ReactElement {
  const { locale } = useI18n()
  const navigate = useNavigate()
  const { ticker: routeTicker } = useParams<{ ticker?: string }>()
  const ticker = (routeTicker ?? '').toUpperCase()

  const catalystsQuery = useTickerCatalysts(ticker)

  function goTo(t: string): boolean {
    navigate(`/news/${t}`)
    return true
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
            News{ticker ? ` — ${ticker}` : ''}
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            AI-classified catalyst feed: the same calendar the research report's News chapter renders.
          </p>
        </div>
        <div style={{ width: 240 }}>
          <TickerAddInput placeholder="e.g. TSLA" buttonLabel="Go" onAdd={goTo} />
        </div>
      </div>

      {!ticker ? (
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
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Enter a ticker to see its news</div>
        </div>
      ) : catalystsQuery.isLoading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Loading…
        </div>
      ) : catalystsQuery.isError ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Couldn't load news for {ticker}
          </div>
          <div style={{ fontSize: 12.5, maxWidth: 420, textAlign: 'center' }}>
            This feed needs an LLM API key configured (it classifies raw news into catalyst events). If
            you haven't set one yet, add it in Settings.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => void catalystsQuery.refetch()}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-soft)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 12.5,
              }}
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => navigate('/settings')}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glow)',
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Open Settings
            </button>
          </div>
        </div>
      ) : (catalystsQuery.data ?? []).length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          No recent catalyst-worthy news found for {ticker}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(catalystsQuery.data ?? []).map((event, i) => (
            <CatalystCard key={`${event.headline}-${i}`} event={event} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
