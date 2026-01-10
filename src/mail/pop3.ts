import {
  createMailCoreConnection,
  type MailCoreConnection,
  type MailCoreConfig,
} from './mailcore';

export type Pop3Client = MailCoreConnection & {
  fetchMessages: () => Promise<void>;
};

export function createPop3Client(config: MailCoreConfig): Pop3Client {
  const base = createMailCoreConnection(config);
  return {
    ...base,
    fetchMessages: async () => {},
  };
}
