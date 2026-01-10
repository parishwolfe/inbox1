/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import InboxSummaryScreen from './src/screens/InboxSummaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Text } from './src/components/Text';
import { colors } from './src/theme/colors';

type ScreenKey = 'inbox' | 'settings';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [activeScreen, setActiveScreen] = React.useState<ScreenKey>('inbox');

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Inbox1</Text>
        {activeScreen === 'inbox' ? (
          <Pressable
            onPress={() => setActiveScreen('settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <SimpleLineIcons name="settings" size={24} color={colors.ink} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setActiveScreen('inbox')}
            accessibilityRole="button"
            accessibilityLabel="Close settings"
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.screen}>
        {activeScreen === 'inbox' && <InboxSummaryScreen />}
        {activeScreen === 'settings' && <SettingsScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  doneButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconButtonPressed: {
    opacity: 0.85,
  },
  doneText: {
    fontSize: 14,
    fontWeight: '600',
  },
  screen: {
    flex: 1,
  },
});

export default App;
