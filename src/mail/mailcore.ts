export type MailCoreConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'ssl' | 'starttls' | 'none';
};

export type MailCoreConnection = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export function createMailCoreConnection(
  config: MailCoreConfig,
): MailCoreConnection {
  void config;
  return {
    connect: async () => {},
    disconnect: async () => {},
  };
}
