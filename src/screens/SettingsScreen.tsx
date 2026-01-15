import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '../components/Text';
import { createImapClient } from '../mail/imap';
import { colors } from '../theme/colors';

export default function SettingsScreen() {
  const [host, setHost] = React.useState('imap.gmail.com');
  const [port, setPort] = React.useState('993');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [security, setSecurity] = React.useState<'ssl' | 'starttls' | 'none'>(
    'ssl',
  );
  const [status, setStatus] = React.useState('');
  const [isFetching, setIsFetching] = React.useState(false);

  const handleFetchUnread = React.useCallback(async () => {
    const parsedPort = Number(port);
    if (!host || !username || !password || !parsedPort) {
      setStatus('Please fill out host, port, username, and password.');
      return;
    }

    setIsFetching(true);
    setStatus('Fetching unread emails...');
    try {
      const client = createImapClient({
        host,
        port: parsedPort,
        username,
        password,
        security,
      });
      const messages = await client.fetchInbox();
      console.log('Unread emails:', messages);
      setStatus(`Fetched ${messages.length} unread emails. Check console.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Failed to fetch unread emails:', message);
      setStatus(`Fetch failed: ${message}`);
    } finally {
      setIsFetching(false);
    }
  }, [host, password, port, security, username]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accounts</Text>
        <Text tone="muted" style={styles.sectionSubtitle}>
          Add your IMAP credentials to fetch unread emails.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Host</Text>
          <TextInput
            style={styles.input}
            placeholder="imap.gmail.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            value={host}
            onChangeText={setHost}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Port</Text>
          <TextInput
            style={styles.input}
            placeholder="993"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            value={port}
            onChangeText={setPort}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="App password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Security</Text>
          <View style={styles.securityRow}>
            {(['ssl', 'starttls', 'none'] as const).map((option) => {
              const isActive = security === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setSecurity(option)}
                  style={[
                    styles.securityOption,
                    isActive && styles.securityOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.securityOptionText,
                      isActive && styles.securityOptionTextActive,
                    ]}
                  >
                    {option.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={handleFetchUnread}
          disabled={isFetching}
          style={({ pressed }) => [
            styles.fetchButton,
            pressed && styles.fetchButtonPressed,
            isFetching && styles.fetchButtonDisabled,
          ]}
        >
          <Text style={styles.fetchButtonText}>
            {isFetching ? 'Fetching...' : 'Fetch unread emails'}
          </Text>
        </Pressable>

        {status.length > 0 && (
          <Text tone="muted" style={styles.status}>
            {status}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Text tone="muted">Personalize notifications, themes, and privacy.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionSubtitle: {
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
    color: colors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
    backgroundColor: colors.background,
  },
  securityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  securityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginRight: 8,
    marginBottom: 8,
  },
  securityOptionActive: {
    borderColor: colors.ink,
    backgroundColor: colors.card,
  },
  securityOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  securityOptionTextActive: {
    color: colors.ink,
  },
  fetchButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.ink,
  },
  fetchButtonPressed: {
    opacity: 0.8,
  },
  fetchButtonDisabled: {
    opacity: 0.6,
  },
  fetchButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  status: {
    marginTop: 10,
  },
});
