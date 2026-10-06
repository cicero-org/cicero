/**
 * Preview / local review-only auth bypass for phone QA (e.g. CRT-121).
 * Flip: set ENABLE_REVIEW_AUTH_BYPASS=true on Preview (never Production).
 * Hard-blocked when VERCEL_ENV=production.
 */
export function isReviewAuthBypassEnabled() {
  if (process.env.ENABLE_REVIEW_AUTH_BYPASS !== 'true') return false;
  if (process.env.VERCEL_ENV === 'production') return false;
  return true;
}
