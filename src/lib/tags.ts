/** Public URL for a tag's listing page. */
export const tagHref = (tag: string): string => `/blog/tags/${encodeURIComponent(tag)}`
