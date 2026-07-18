export const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://www.servicemarkaz.com',
  GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  EAS_PROJECT_ID: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '',

  // Token storage key
  TOKEN_KEY: 'sm_auth_token',
  USER_KEY: 'sm_auth_user',

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  // Geo-search radius (km)
  GEO_RADIUS_KM: 50,

  // Query stale times (ms)
  STALE_TIME_SHORT: 1000 * 60 * 2,        // 2 min
  STALE_TIME_MEDIUM: 1000 * 60 * 10,      // 10 min
  STALE_TIME_LONG: 1000 * 60 * 60,        // 1 hour

  // Image upload max size (bytes)
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,        // 5MB
} as const;
