/**
 * A stand-in for SandKey.Api.Display, serving the fixtures captured from the live kiosk.
 *
 * It exists so the kiosk can be developed and visually compared against the old screens without
 * MLS credentials. It is not a test double for the API's behaviour - run the real API for that.
 *
 *   node mock/server.mjs          # then: npm run dev
 */
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const fixtures = JSON.parse(readFileSync(join(here, 'fixtures.json'), 'utf8'))
const detail = JSON.parse(readFileSync(join(here, 'detail.json'), 'utf8'))

const PORT = Number(process.env.PORT ?? 5036)
const PAGE_SIZE = 9

/** Picks the closest captured page for a set of filters. */
function selectListings({ type, order, page }) {
  if (type === 'Lease') {
    return fixtures.lease
  }

  if (order === 'Ascending') {
    return fixtures.saleAscending
  }

  return page > 0 ? fixtures.salePage2 : fixtures.sale
}

const json = (response, status, body) => {
  response.writeHead(status, { 'content-type': 'application/json' })
  response.end(JSON.stringify(body))
}

const problem = (response, status, title) => {
  response.writeHead(status, { 'content-type': 'application/problem+json' })
  response.end(JSON.stringify({ status, title, correlationId: 'mock' }))
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${PORT}`)
  const path = url.pathname

  if (request.method === 'POST' && path === '/api/display/inquiries') {
    console.log('inquiry received')
    response.writeHead(202)
    response.end()
    return
  }

  const listingMatch = path.match(/^\/api\/display\/listings\/(.+)$/)

  if (listingMatch) {
    json(response, 200, { ...detail, listingKey: decodeURIComponent(listingMatch[1]) })
    return
  }

  if (path === '/api/display/listings') {
    const page = Number(url.searchParams.get('page') ?? 0)
    const items = selectListings({
      type: url.searchParams.get('type') ?? 'Sale',
      order: url.searchParams.get('order') ?? 'Ascending',
      page,
    })

    json(response, 200, {
      items,
      totalCount: 42,
      page,
      pageSize: PAGE_SIZE,
      hasMore: (page + 1) * PAGE_SIZE < 42,
    })
    return
  }

  problem(response, 404, 'Not found.')
}).listen(PORT, () => console.log(`fixture API listening on http://localhost:${PORT}`))
