/**
 * Display formatting, kept in one place so the grid, the detail screen and the inquiry email all
 * render a price the same way.
 */

const CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const NUMBER = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

/** Formats a price as the kiosk shows it, for example <c>$37,500,000</c>. */
export function formatPrice(price: number): string {
  return CURRENCY.format(price)
}

/** Formats a lease price with the monthly suffix, for example <c>$20,000/Month</c>. */
export function formatLeasePrice(price: number): string {
  return `${formatPrice(price)}/Month`
}

/** Formats a price according to whether the listing is a lease. */
export function formatListingPrice(price: number, propertyType: string): string {
  return isLease(propertyType) ? formatLeasePrice(price) : formatPrice(price)
}

/** Formats a living area with thousands separators. */
export function formatArea(squareFeet: number): string {
  return NUMBER.format(squareFeet)
}

/** True when a property type is a lease rather than a sale. */
export function isLease(propertyType: string): boolean {
  return propertyType.toUpperCase().includes('LEASE')
}

/**
 * Pluralises a count of rooms.
 *
 * The legacy views had this inverted - `BedroomsTotal > 1 ? "Bed" : "Beds"` - so the live kiosk
 * reads "3 Bed" and "1 Beds". Corrected here; it is the one piece of visible text that does not
 * match the old screen.
 */
export function pluralize(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`
}
