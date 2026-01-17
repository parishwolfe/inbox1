import {
  fetchPop3Messages,
  type MailCoreConfig,
  type MailCoreMessage,
} from './mailcore';

export type Pop3Client = {
  fetchMessages: () => Promise<MailCoreMessage[]>;
};

export function createPop3Client(config: MailCoreConfig): Pop3Client {
  return {
    fetchMessages: async () => fetchPop3Messages(config),
  };
}
