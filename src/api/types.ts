/** Contract types mirroring the response models in SandKey.Api.Display.Responses. */

/** Sale or lease, matching the API's ListingType enum values. */
export const ListingType = {
  Sale: 'Sale',
  Lease: 'Lease',
} as const

export type ListingType = (typeof ListingType)[keyof typeof ListingType]

/** Sort direction, matching the API's SortDirection enum values. */
export const SortDirection = {
  Ascending: 'Ascending',
  Descending: 'Descending',
} as const

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection]

/** One photo attached to a listing. */
export interface Media {
  order: number
  /** Path relative to the site root, served by the CDN rather than by the API. */
  url: string
}

/** A listing as shown in the results grid. */
export interface ListingSummary {
  listingKey: string
  listPrice: number
  subdivisionName: string
  propertyType: string
  propertySubType: string
  bedroomsTotal: number
  bathroomsFull: number
  livingArea: number
  primaryPhoto: Media | null
}

/** A listing in full, as shown on the detail screen. */
export interface Listing {
  listingKey: string
  listingId: string
  listPrice: number
  subdivisionName: string
  unparsedAddress: string
  propertyType: string
  propertySubType: string
  bedroomsTotal: number
  bathroomsFull: number
  bathroomsHalf: number
  livingArea: number
  yearBuilt: number
  hasGarage: boolean | null
  isWaterfront: boolean
  publicRemarks: string
  listOfficeName: string
  petsAllowed: string[]
  exteriorFeatures: string[]
  poolFeatures: string[]
  interiorFeatures: string[]
  waterfrontFeatures: string[]
  communityFeatures: string[]
  media: Media[]
  lastModified: string
}

/** A condominium hotspot on the home screen. */
export interface Condo {
  id: number
  name: string
}

/** A page of results. */
export interface Paged<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** Filters for a listings search. */
export interface ListingsQuery {
  type: ListingType
  condo: number
  order: SortDirection
  page: number
  pageSize?: number
}
