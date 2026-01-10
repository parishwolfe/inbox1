export type MailProtocol = 'imap' | 'pop3';

export type Account = {
  id: string;
  email: string;
  protocol: MailProtocol;
  host: string;
  port: number;
  username: string;
};

export type AccountSecret = {
  password: string;
};

// In-memory fallback until SecureStore/Keychain is wired in.
const accounts = new Map<string, Account>();
const secrets = new Map<string, AccountSecret>();

export async function saveAccount(
  account: Account,
  secret: AccountSecret,
): Promise<void> {
  accounts.set(account.id, account);
  secrets.set(account.id, secret);
}

export async function getAccount(id: string): Promise<Account | null> {
  return accounts.get(id) ?? null;
}

export async function getAccountSecret(
  id: string,
): Promise<AccountSecret | null> {
  return secrets.get(id) ?? null;
}

export async function listAccounts(): Promise<Account[]> {
  return Array.from(accounts.values());
}

export async function removeAccount(id: string): Promise<void> {
  accounts.delete(id);
  secrets.delete(id);
}
