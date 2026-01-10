import {
  createMailCoreConnection,
  type MailCoreConnection,
  type MailCoreConfig,
} from './mailcore';

export type ImapClient = MailCoreConnection & {
  fetchInbox: () => Promise<void>;
};

export function createImapClient(config: MailCoreConfig): ImapClient {
  const base = createMailCoreConnection(config);
  return {
    ...base,
    fetchInbox: async () => {},
  };
}
