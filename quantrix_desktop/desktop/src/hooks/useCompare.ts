// useCompareData — fetches price + financials for an arbitrary (2-4) list of
// tickers in parallel, for the Compare page's side-by-side table. Built on
// TanStack's useQueries (not useQuery) because the ticker list is dynamic —
// useQueries is the supported way to run a variable-length set of queries
// without violating the rules of hooks (no per-ticker custom hook calls).
//
// Reuses the same fetcher + types as useTickerData so Compare and the single-
// ticker workspace stay byte-identical on how a price/financials payload reads.

import { useQueries } from '@tanstack/react-query'
import { BASE_URL } from '../api/client'
import { fetchJsonOrThrowHttp, type PriceData, type FinancialsData } from './useTickerData'
import type { FetchHttpError } from '../utils/errorMessage'

export interface CompareEntry {
  ticker: string
  price: PriceData | undefined
  priceLoading: boolean
  priceError: FetchHttpError | null
  financials: FinancialsData | undefined
  financialsLoading: boolean
  financialsError: FetchHttpError | null
}

export function useCompareData(tickers: string[]): CompareEntry[] {
  const priceQueries = useQueries({
    queries: tickers.map((ticker) => ({
      queryKey: ['ticker-price', ticker],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchJsonOrThrowHttp<PriceData>(`${BASE_URL}/api/data/${ticker}/price`, signal),
      staleTime: 60_000,
      retry: false,
    })),
  })

  const financialsQueries = useQueries({
    queries: tickers.map((ticker) => ({
      queryKey: ['ticker-financials', ticker],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchJsonOrThrowHttp<FinancialsData>(`${BASE_URL}/api/data/${ticker}/financials`, signal),
      staleTime: 5 * 60_000,
      retry: false,
    })),
  })

  return tickers.map((ticker, i) => ({
    ticker,
    price: priceQueries[i]?.data as PriceData | undefined,
    priceLoading: priceQueries[i]?.isLoading ?? false,
    priceError: (priceQueries[i]?.error as FetchHttpError | null) ?? null,
    financials: financialsQueries[i]?.data as FinancialsData | undefined,
    financialsLoading: financialsQueries[i]?.isLoading ?? false,
    financialsError: (financialsQueries[i]?.error as FetchHttpError | null) ?? null,
  }))
}
