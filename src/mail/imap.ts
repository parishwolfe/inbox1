import {
  fetchImapInbox,
  type MailCoreConfig,
  type MailCoreMessage,
} from './mailcore';

export type ImapClient = {
  fetchInbox: () => Promise<MailCoreMessage[]>;
};

export function createImapClient(config: MailCoreConfig): ImapClient {
  return {
    fetchInbox: async () => fetchImapInbox(config),
  };
}
