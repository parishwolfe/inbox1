import {
  createMailCoreConnection,
  type MailCoreConnection,
  type MailCoreConfig,
} from './mailcore';
import type { EmailSummary } from '../types/email';

export type ImapClient = MailCoreConnection & {
  fetchInbox: () => Promise<EmailSummary[]>;
};

export function createImapClient(config: MailCoreConfig): ImapClient {
  const base = createMailCoreConnection(config);
  return {
    ...base,
    fetchInbox: async () => {
      const messages = await base.fetchUnread();
      return messages.map((message) => ({
        id: message.id,
        from: message.from,
        subject: message.subject,
        snippet: '',
        receivedAt: message.date,
        unread: true,
      }));
    },
  };
}
