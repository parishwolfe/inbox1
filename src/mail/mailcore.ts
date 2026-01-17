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
  id?: string | number;
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
  flags?: number | string;
  attachments?: number | string;
};

type MailCoreLoginConfig = {
  hostname: string;
  port: number;
  username: string;
  password: string;
  authType: number;
};

type MailCoreFetchConfig = {
  folder: string;
  requestKind: number;
  headers?: string[];
  threadId?: string;
};

type MailCoreFetchResponse = {
  status?: string;
  mails?: MailCoreMessage[];
};

type MailCoreNativeModule = {
  loginImap: (config: MailCoreLoginConfig) => Promise<{ status?: string }>;
  getMails: (config: MailCoreFetchConfig) => Promise<MailCoreFetchResponse>;
};

const AUTH_TYPE_SASL_PLAIN = 2;
const IMAP_REQUEST_KIND_FLAGS = 1;
const IMAP_REQUEST_KIND_HEADERS = 2;
const IMAP_REQUEST_KIND_INTERNAL_DATE = 8;
const IMAP_REQUEST_KIND_HEADER_SUBJECT = 32;
const DEFAULT_IMAP_REQUEST_KIND =
  IMAP_REQUEST_KIND_FLAGS |
  IMAP_REQUEST_KIND_HEADERS |
  IMAP_REQUEST_KIND_INTERNAL_DATE |
  IMAP_REQUEST_KIND_HEADER_SUBJECT;

function getMailCoreModule(): MailCoreNativeModule {
  const nativeModule =
    (NativeModules.RNMailCore as MailCoreNativeModule | undefined) ??
    (NativeModules.MailCore as MailCoreNativeModule | undefined) ??
    (NativeModules.Mailcore as MailCoreNativeModule | undefined);

  if (!nativeModule) {
    throw new Error(
      'react-native-mailcore native module not found. Install and link it, then rebuild the app.',
    );
  }

  return nativeModule;
}

export async function fetchImapInbox(
  config: MailCoreConfig,
): Promise<MailCoreMessage[]> {
  const module = getMailCoreModule();
  const loginConfig: MailCoreLoginConfig = {
    hostname: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    authType: AUTH_TYPE_SASL_PLAIN,
  };

  await module.loginImap(loginConfig);

  const response = await module.getMails({
    folder: 'INBOX',
    requestKind: DEFAULT_IMAP_REQUEST_KIND,
    headers: [],
  });

  return response.mails ?? [];
}

export async function fetchPop3Messages(): Promise<MailCoreMessage[]> {
  throw new Error('POP3 is not supported by react-native-mailcore yet.');
}
