import { useEffect, useState } from 'react'

/** The state of an in-flight request. */
export interface AsyncState<T> {
  data: T | null
  error: Error | null
  loading: boolean
}

/**
 * Runs a request when its dependencies change, and abandons it if they change again before it
 * finishes, so a visitor tapping quickly through condos cannot be shown a stale result.
 */
export function useAsync<T>(
  run: (signal: AbortSignal) => Promise<T>,
  dependencies: ReadonlyArray<unknown>,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: true })

  useEffect(() => {
    const controller = new AbortController()
    setState((previous) => ({ ...previous, loading: true, error: null }))

    run(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, error: null, loading: false })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return state
}
