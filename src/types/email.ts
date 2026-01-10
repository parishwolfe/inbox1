export type EmailSummary = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  unread?: boolean;
};
