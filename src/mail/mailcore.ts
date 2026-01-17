import { NativeModules } from 'react-native';

export type MailCoreSecurity = 'ssl' | 'starttls' | 'none';

export type MailCoreConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  security: MailCoreSecurity;
};

export type MailCoreMessage = {
  id?: string;
  uid?: string | number;
  messageId?: string;
  subject?: string;
  from?:
    | string
    | { name?: string; email?: string }
    | Array<{ name?: string; email?: string }>;
  sender?: string;
  snippet?: string;
  preview?: string;
  bodyPreview?: string;
  date?: string | number;
  receivedAt?: string;
  unread?: boolean;
  isUnread?: boolean;
};

type MailCoreNativeModule = {
  imapFetchInbox?: (config: MailCoreConfig) => Promise<MailCoreMessage[]>;
  pop3FetchMessages?: (config: MailCoreConfig) => Promise<MailCoreMessage[]>;
  fetchInbox?: (config: MailCoreConfig) => Promise<MailCoreMessage[]>;
  fetchMessages?: (config: MailCoreConfig) => Promise<MailCoreMessage[]>;
};

function getMailCoreModule(): MailCoreNativeModule {
  const nativeModule =
    (NativeModules.Mailcore as MailCoreNativeModule | undefined) ??
    (NativeModules.MailCore as MailCoreNativeModule | undefined) ??
    (NativeModules.RNMailcore as MailCoreNativeModule | undefined);

  if (!nativeModule) {
    throw new Error(
      'react-native-mailcore native module not found. Install and link it, then rebuild the app.',
    );
  }

  return nativeModule;
}

function resolveMethod(
  module: MailCoreNativeModule,
  methodNames: Array<keyof MailCoreNativeModule>,
  label: string,
): (config: MailCoreConfig) => Promise<MailCoreMessage[]> {
  for (const name of methodNames) {
    const method = module[name];
    if (method) {
      return method;
    }
  }
  throw new Error(
    `Mailcore ${label} method missing. Expected one of: ${methodNames.join(
      ', ',
    )}`,
  );
}

export async function fetchImapInbox(
  config: MailCoreConfig,
): Promise<MailCoreMessage[]> {
  const module = getMailCoreModule();
  const method = resolveMethod(module, ['imapFetchInbox', 'fetchInbox'], 'IMAP');
  return method(config);
}

export async function fetchPop3Messages(
  config: MailCoreConfig,
): Promise<MailCoreMessage[]> {
  const module = getMailCoreModule();
  const method = resolveMethod(
    module,
    ['pop3FetchMessages', 'fetchMessages'],
    'POP3',
  );
  return method(config);
}
