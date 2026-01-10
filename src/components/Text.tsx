import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';

export type TextProps = RNTextProps & {
  tone?: 'default' | 'muted' | 'accent';
};

export function Text({ tone = 'default', style, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        tone === 'muted' && styles.muted,
        tone === 'accent' && styles.accent,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.ink,
    fontSize: 16,
  },
  muted: {
    color: colors.muted,
  },
  accent: {
    color: colors.accent,
  },
});
