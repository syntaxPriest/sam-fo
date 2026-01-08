/**
 * Supabase configuration
 */
export const SUPABASE_URL = 'https://scwaxiuduzyziuyjfwda.supabase.co/rest/v1';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjd2F4aXVkdXp5eml1eWpmd2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMTk0NTUsImV4cCI6MjA4MjY5NTQ1NX0.W7LMDb-a_bN153TyJgNU0zpT8O6jPIC8ysfOOHSe0h0';

/**
 * User ID - Replace with your assigned email
 * This is used to filter notes and isolate your data
 */
export const USER_ID = process.env.NEXT_PUBLIC_USER_ID || 'test@example.com';

/**
 * IndexedDB configuration
 */
export const DB_NAME = 'notes-pwa-db';
export const DB_VERSION = 1;

/**
 * Store names
 */
export const STORES = {
  NOTES: 'notes',
  PENDING_OPERATIONS: 'pending_operations',
  SYNC_META: 'sync_meta',
} as const;

/**
 * Sync configuration
 */
export const SYNC_CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
  SYNC_TAG: 'notes-sync',
} as const;

/**
 * Cache names for service worker
 */
export const CACHE_NAMES = {
  STATIC: 'static-cache-v1',
  DYNAMIC: 'dynamic-cache-v1',
  API: 'api-cache-v1',
} as const;
