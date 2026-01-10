import type { EmailSummary } from '../types/email';

export type CachedEmail = {
  id: string;
  summary: EmailSummary;
  body: string;
};

// In-memory fallback until SQLite/local cache is wired in.
const cachedEmails = new Map<string, CachedEmail>();

export async function upsertCachedEmail(email: CachedEmail): Promise<void> {
  cachedEmails.set(email.id, email);
}

export async function getCachedEmail(id: string): Promise<CachedEmail | null> {
  return cachedEmails.get(id) ?? null;
}

export async function listCachedEmails(): Promise<CachedEmail[]> {
  return Array.from(cachedEmails.values());
}

export async function clearCache(): Promise<void> {
  cachedEmails.clear();
}
