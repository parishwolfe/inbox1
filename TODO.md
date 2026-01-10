

# Inbox1 – TODO

## Project Direction Reset
- [ ] Re-align architecture around **daily inbox summaries**, not per-email summaries
- [ ] Confirm data model: one summary per day of unread emails
- [ ] Remove / de-prioritize individual email summarization paths

## Email Integration
- [ ] Install `mail2core`
- [ ] Verify native build succeeds after installation
- [ ] Establish a working connection to an email server (IMAP/POP)
- [ ] Fetch unread emails only
- [ ] Validate basic metadata retrieval (from, subject, date)

## Credential Storage (Local-Only)
- [ ] Design secure local storage for email credentials
- [ ] Implement encrypted storage (Keychain / SecureStore)
- [ ] Ensure credentials never leave the device
- [ ] Add read/write helpers and basic tests

## AI Integration
### Phase 1 – OpenAI (Simpler Path)
- [ ] Add OpenAI API key configuration
- [ ] Implement minimal client wrapper
- [ ] Generate a single summary from a batch of unread emails
- [ ] Store daily summary locally with date metadata

### Phase 2 – Local AI (Later)
- [ ] Research local model options
- [ ] Decide on inference strategy (on-device vs local server)
- [ ] Define performance constraints

## Data & Storage
- [ ] Define schema for daily summaries
  - [ ] date
  - [ ] summary text
  - [ ] source account(s)
- [ ] Implement local persistence
- [ ] Add migration/versioning strategy if needed

## UI / UX
- [ ] Main screen: infinite scroll of daily summaries
- [ ] Pull-to-refresh to re-run summary
- [ ] Empty / first-run state
- [ ] Add search over summaries
  - [ ] Text search
  - [ ] Date-based filtering

## Scheduling & Execution
- [ ] Define how/when daily summaries run
- [ ] Handle app-not-open edge cases
- [ ] Ensure summaries are idempotent per day

## Testing & Stability
- [ ] Smoke test: connect mailbox → generate summary → render UI
- [ ] Error handling for:
  - [ ] Auth failures
  - [ ] Network issues
  - [ ] AI API failures
- [ ] Logging for debugging early users

## Cleanup
- [ ] Remove unused components/files from earlier architecture
- [ ] Update README with current product intent
- [ ] Document security assumptions and guarantees