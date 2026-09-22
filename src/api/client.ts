import type { Listing, ListingSummary, ListingsQuery, Paged } from './types'

/**
 * Raised when the API answers with a problem detail. Carries the status so a caller can tell a
 * missing listing from a feed outage without parsing the body.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Items per page. Nine is what the kiosk grid fits, and matches the legacy page size. */
export const PAGE_SIZE = 9

const BASE_PATH = '/api/display'

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_PATH}${path}`, {
    signal,
    headers: { accept: 'application/json' },
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readProblemTitle(response))
  }

  return (await response.json()) as T
}

/** Pulls the problem detail title, falling back to the status text when the body is not one. */
async function readProblemTitle(response: Response): Promise<string> {
  try {
    const problem = (await response.json()) as { title?: string }
    return problem.title ?? response.statusText
  } catch {
    return response.statusText
  }
}

/** Fetches a page of listings. */
export function getListings(
  query: ListingsQuery,
  signal?: AbortSignal,
): Promise<Paged<ListingSummary>> {
  const parameters = new URLSearchParams({
    type: query.type,
    order: query.order,
    page: String(query.page),
    pageSize: String(query.pageSize ?? PAGE_SIZE),
  })

  return getJson<Paged<ListingSummary>>(`/listings?${parameters.toString()}`, signal)
}

/** Fetches one listing in full. */
export function getListing(listingKey: string, signal?: AbortSignal): Promise<Listing> {
  return getJson<Listing>(`/listings/${encodeURIComponent(listingKey)}`, signal)
}

/**
 * Submits an inquiry. Exactly one contact method is supplied; the API decides from that whether
 * to email the visitor or ask the office to call them back.
 */
export async function submitInquiry(
  body: { listingKey: string; emailAddress?: string; phoneNumber?: string },
  signal?: AbortSignal,
): Promise<void> {
  const payload = JSON.stringify(body)
  const response = await fetch(`${BASE_PATH}/inquiries`, {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'x-amz-content-sha256': await sha256Hex(payload),
    },
    body: payload,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await readProblemTitle(response))
  }
}

/**
 * In production CloudFront signs every request it forwards to the API, and a signed POST has to
 * carry the SHA-256 of its body. GETs need nothing; the dev server ignores the header.
 */
async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}
