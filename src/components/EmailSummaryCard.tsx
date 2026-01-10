import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/colors';
import type { EmailSummary } from '../types/email';

type Props = {
  summary: EmailSummary;
};

export function EmailSummaryCard({ summary }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.from} numberOfLines={1}>
          {summary.from}
        </Text>
        <Text tone="muted" style={styles.date}>
          {summary.receivedAt}
        </Text>
      </View>
      <Text style={styles.subject} numberOfLines={1}>
        {summary.subject}
      </Text>
      <Text tone="muted" numberOfLines={2}>
        {summary.snippet}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  from: {
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
  },
  subject: {
    fontWeight: '500',
    marginBottom: 4,
  },
});
