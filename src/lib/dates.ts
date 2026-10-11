const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  dateStyle: 'long',
  timeStyle: 'short',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

/**
 * Format a post date as a UTC calendar date (e.g. "January 28, 2024").
 * Pinned to UTC because frontmatter dates parse to UTC midnight — formatting in
 * the host's local timezone could shift the day.
 */
export const formatPostDate = (date: Date): string => dateFormatter.format(date)

/** Compact form (e.g. "Jan 28, 2024"). */
export const formatPostDateShort = (date: Date): string => shortDateFormatter.format(date)

/** Full timestamp for tooltips (e.g. "January 28, 2024 at 12:00 AM UTC"). */
export const formatPostTimestamp = (date: Date): string => `${timestampFormatter.format(date)} UTC`
