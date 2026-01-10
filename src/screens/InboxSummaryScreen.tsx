import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmailSummaryCard } from '../components/EmailSummaryCard';
import { Text } from '../components/Text';
import { colors } from '../theme/colors';
import type { EmailSummary } from '../types/email';

const sampleEmails: EmailSummary[] = [
  {
    id: '1',
    from: 'GitHub',
    subject: 'Security alert: new sign-in',
    snippet: 'We detected a sign-in to your account from a new device.',
    receivedAt: 'Today',
    unread: true,
  },
  {
    id: '2',
    from: 'Stripe',
    subject: 'Your payout is on the way',
    snippet: 'Payout for August 21 has been initiated to your bank.',
    receivedAt: 'Yesterday',
  },
  {
    id: '3',
    from: 'Alex Chen',
    subject: 'Design feedback',
    snippet: 'Left notes on the latest inbox flow; looks great overall.',
    receivedAt: 'Mon',
  },
];

export default function InboxSummaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>
      <FlatList
        data={sampleEmails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EmailSummaryCard summary={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text tone="muted">No messages yet.</Text>}
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 12,
  },
  separator: {
    height: 12,
  },
});
