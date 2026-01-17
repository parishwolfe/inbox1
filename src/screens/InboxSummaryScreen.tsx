import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { EmailSummaryCard } from '../components/EmailSummaryCard';
import { Text } from '../components/Text';
import { fetchInboxSummaries } from '../mail/fetchInboxSummaries';
import type { Account, AccountSecret } from '../storage/accounts';
import { colors } from '../theme/colors';
import type { EmailSummary } from '../types/email';

type Props = {
  account: Account | null;
  secret: AccountSecret | null;
};

export default function InboxSummaryScreen({ account, secret }: Props) {
  const [emails, setEmails] = React.useState<EmailSummary[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasAccount = Boolean(account && secret);

  const loadInbox = React.useCallback(async () => {
    if (!account || !secret) {
      setEmails([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const summaries = await fetchInboxSummaries(account, secret);
      setEmails(summaries);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sync mail.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [account, secret]);

  React.useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  const renderEmptyState = () => {
    if (!hasAccount) {
      return (
        <Text tone="muted">
          Add an account in Settings to start syncing mail.
        </Text>
      );
    }
    if (loading) {
      return <Text tone="muted">Fetching mail...</Text>;
    }
    if (error) {
      return (
        <View style={styles.errorState}>
          <Text tone="muted">Sync failed: {error}</Text>
          <Pressable
            onPress={() => void loadInbox()}
            accessibilityRole="button"
            style={styles.retryButton}
          >
            <Text tone="accent">Try again</Text>
          </Pressable>
        </View>
      );
    }
    return <Text tone="muted">No messages yet.</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Inbox</Text>
        {hasAccount && (
          <Pressable
            onPress={() => void loadInbox()}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshButtonPressed,
            ]}
          >
            <Text tone="accent">Refresh</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={emails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmailSummaryCard summary={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={() => void loadInbox()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  titleRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContent: {
    padding: 16,
    paddingTop: 12,
  },
  separator: {
    height: 12,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  refreshButtonPressed: {
    opacity: 0.8,
  },
  errorState: {
    gap: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
});
