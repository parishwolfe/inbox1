export type SummarizeInput = {
  subject: string;
  from: string;
  body: string;
};

export async function summarizeEmail(
  input: SummarizeInput,
): Promise<string> {
  const normalized = input.body.trim().replace(/\s+/g, ' ');
  const snippet = normalized.slice(0, 140);
  if (!snippet) {
    return `${input.subject}: (no content)`;
  }
  return `${input.subject}: ${snippet}`;
}
