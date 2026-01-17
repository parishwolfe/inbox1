import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Text } from '../components/Text';
import type {
  Account,
  AccountSecret,
  MailProtocol,
  MailSecurity,
} from '../storage/accounts';
import { colors } from '../theme/colors';

type Props = {
  initialAccount: Account | null;
  initialSecret: AccountSecret | null;
  onSave: (account: Account, secret: AccountSecret) => Promise<void> | void;
};

type FormState = {
  email: string;
  protocol: MailProtocol;
  host: string;
  port: string;
  security: MailSecurity;
  username: string;
  password: string;
};

const defaultFormState: FormState = {
  email: '',
  protocol: 'imap',
  host: '',
  port: '993',
  security: 'ssl',
  username: '',
  password: '',
};

export default function SettingsScreen({
  initialAccount,
  initialSecret,
  onSave,
}: Props) {
  const [form, setForm] = React.useState<FormState>(defaultFormState);
  const [saving, setSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!initialAccount) {
      setForm(defaultFormState);
      return;
    }

    setForm({
      email: initialAccount.email,
      protocol: initialAccount.protocol,
      host: initialAccount.host,
      port: String(initialAccount.port),
      security: initialAccount.security,
      username: initialAccount.username,
      password: initialSecret?.password ?? '',
    });
  }, [initialAccount, initialSecret]);

  const portNumber = Number(form.port);
  const isPortValid =
    Number.isInteger(portNumber) && portNumber > 0 && portNumber < 65536;
  const canSave =
    form.host.trim().length > 0 &&
    form.username.trim().length > 0 &&
    form.password.length > 0 &&
    isPortValid;

  const handleSave = async () => {
    if (!canSave || saving) {
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const accountId =
        initialAccount?.id ?? `account-${Date.now().toString()}`;
      const emailValue =
        form.email.trim().length > 0
          ? form.email.trim()
          : form.username.trim();

      const account: Account = {
        id: accountId,
        email: emailValue,
        protocol: form.protocol,
        host: form.host.trim(),
        port: portNumber,
        username: form.username.trim(),
        security: form.security,
      };

      const secret: AccountSecret = {
        password: form.password,
      };

      await onSave(account, secret);
      setSaveMessage('Saved. Switch to Inbox to sync.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to save settings.';
      setSaveMessage(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mail account</Text>
        <Text tone="muted">
          Enter your mail server details to sync your inbox.
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Protocol</Text>
        <View style={styles.optionRow}>
          {(['imap', 'pop3'] as const).map((option) => {
            const isActive = form.protocol === option;
            return (
              <Pressable
                key={option}
                onPress={() =>
                  setForm((prev) => ({ ...prev, protocol: option }))
                }
                accessibilityRole="button"
                style={[
                  styles.optionButton,
                  isActive && styles.optionButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {option.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Security</Text>
        <View style={styles.optionRow}>
          {(['ssl', 'starttls', 'none'] as const).map((option) => {
            const isActive = form.security === option;
            return (
              <Pressable
                key={option}
                onPress={() =>
                  setForm((prev) => ({ ...prev, security: option }))
                }
                accessibilityRole="button"
                style={[
                  styles.optionButton,
                  isActive && styles.optionButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {option.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Mail server</Text>
        <TextInput
          value={form.host}
          onChangeText={(host) => setForm((prev) => ({ ...prev, host }))}
          placeholder="imap.example.com"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Port</Text>
        <TextInput
          value={form.port}
          onChangeText={(port) => setForm((prev) => ({ ...prev, port }))}
          placeholder="993"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={form.username}
          onChangeText={(username) =>
            setForm((prev) => ({ ...prev, username }))
          }
          placeholder="your@email.com"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={form.password}
          onChangeText={(password) =>
            setForm((prev) => ({ ...prev, password }))
          }
          placeholder="password"
          placeholderTextColor={colors.muted}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Account email (optional)</Text>
        <TextInput
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          placeholder="display@email.com"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      {!canSave && (
        <Text tone="muted" style={styles.helperText}>
          Enter a host, port, username, and password to enable saving.
        </Text>
      )}

      {saveMessage && (
        <Text tone="muted" style={styles.helperText}>
          {saveMessage}
        </Text>
      )}

      <Pressable
        onPress={handleSave}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.saveButton,
          !canSave && styles.saveButtonDisabled,
          pressed && canSave && styles.saveButtonPressed,
        ]}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Saving...' : 'Save & Sync'}
        </Text>
      </Pressable>
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
    fontSize: 15,
    color: colors.ink,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  optionButtonActive: {
    borderColor: colors.accent,
    backgroundColor: '#e0edff',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  optionTextActive: {
    color: colors.accent,
  },
  helperText: {
    marginTop: 4,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  saveButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
