import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../components/Text';
import { colors } from '../theme/colors';

export default function AccountsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accounts</Text>
      <Text tone="muted">Add your first account to start syncing mail.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
});
