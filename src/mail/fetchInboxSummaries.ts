import type { Account, AccountSecret } from '../storage/accounts';
import type { EmailSummary } from '../types/email';
import { createImapClient } from './imap';
import type { MailCoreMessage } from './mailcore';

type RawRecord = Record<string, unknown>;

function pickFirstString(record: RawRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

function formatFrom(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return formatFrom(value[0]);
  }
  if (value && typeof value === 'object') {
    const record = value as RawRecord;
    const name = pickFirstString(record, ['name', 'displayName']);
    const email = pickFirstString(record, ['email', 'address']);
    if (name && email) {
      return `${name} <${email}>`;
    }
    return name ?? email ?? '';
  }
  return '';
}

function formatReceivedAt(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const milliseconds = value < 1e12 ? value * 1000 : value;
    return new Date(milliseconds).toLocaleDateString();
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return 'Unknown';
}

function toEmailSummary(message: MailCoreMessage, index: number): EmailSummary {
  const record = message as RawRecord;
  const idValue =
    record.id ??
    record.uid ??
    record.messageId ??
    record.message_id ??
    record.messageID ??
    record.msgid ??
    `message-${index}`;
  const fromValue = record.from ?? record.sender ?? record.fromAddress;
  const subject =
    pickFirstString(record, ['subject', 'title', 'snippetSubject']) ??
    '(no subject)';
  const snippet =
    pickFirstString(record, [
      'snippet',
      'preview',
      'bodyPreview',
      'summary',
    ]) ?? '';
  const receivedAt = formatReceivedAt(
    record.receivedAt ?? record.date ?? record.internalDate,
  );

  let unread: boolean | undefined;
  if (typeof record.unread === 'boolean') {
    unread = record.unread;
  } else if (typeof record.isUnread === 'boolean') {
    unread = record.isUnread;
  } else if (typeof record.isRead === 'boolean') {
    unread = !record.isRead;
  }

  return {
    id: String(idValue),
    from: formatFrom(fromValue) || 'Unknown sender',
    subject,
    snippet,
    receivedAt,
    unread,
  };
}

export async function fetchInboxSummaries(
  account: Account,
  secret: AccountSecret,
): Promise<EmailSummary[]> {
  const config = {
    host: account.host,
    port: account.port,
    username: account.username,
    password: secret.password,
    security: account.security,
  };

  if (account.protocol !== 'imap') {
    throw new Error('POP3 sync is not supported yet. Use IMAP for now.');
  }

  const rawMessages = await createImapClient(config).fetchInbox();

  return rawMessages.map((message, index) => toEmailSummary(message, index));
}
