import { NativeModules } from 'react-native';

export type MailCoreConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'ssl' | 'starttls' | 'none';
};

export type MailCoreMessage = {
  id: string;
  from: string;
  subject: string;
  date: string;
};

export type MailCoreConnection = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  fetchUnread: () => Promise<MailCoreMessage[]>;
};

type MailCore2Module = {
  fetchUnread: (config: MailCoreConfig) => Promise<MailCoreMessage[]>;
};

export function createMailCoreConnection(
  config: MailCoreConfig,
): MailCoreConnection {
  const { MailCore2 } = NativeModules as { MailCore2?: MailCore2Module };

  return {
    connect: async () => {},
    disconnect: async () => {},
    fetchUnread: async () => {
      if (!MailCore2?.fetchUnread) {
        throw new Error('MailCore2 native module is not available.');
      }
      return MailCore2.fetchUnread(config);
    },
  };
}
