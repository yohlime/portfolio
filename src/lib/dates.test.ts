import { describe, expect, it } from 'vitest'

import { formatPostDate, formatPostDateShort, formatPostTimestamp } from './dates'

describe('formatPostDate', () => {
  it('formats as a long UTC date', () => {
    expect(formatPostDate(new Date('2024-01-28T00:00:00.000Z'))).toBe('January 28, 2024')
  })

  it('does not shift the day for late-UTC times', () => {
    expect(formatPostDate(new Date('2024-01-28T23:30:00.000Z'))).toBe('January 28, 2024')
  })
})

describe('formatPostDateShort', () => {
  it('formats with an abbreviated month', () => {
    expect(formatPostDateShort(new Date('2024-01-28T00:00:00.000Z'))).toBe('Jan 28, 2024')
  })
})

describe('formatPostTimestamp', () => {
  it('includes the time and UTC marker', () => {
    expect(formatPostTimestamp(new Date('2024-01-28T00:00:00.000Z'))).toBe('January 28, 2024 at 12:00 AM UTC')
  })
})
