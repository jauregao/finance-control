import { useThemeColors } from '@/src/themes/useThemeColors';
import React from 'react';
import {
  Text as RNText,
  View as RNView,
  type TextProps as RNTextProps,
  type ViewProps as RNViewProps,
} from 'react-native';

export function ThemedView(props: RNViewProps) {
  const { style, ...rest } = props;
  const theme = useThemeColors();

  return (
    <RNView
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...rest}
    />
  );
}

export function ThemedText(props: RNTextProps) {
  const { style, ...rest } = props;
  const theme = useThemeColors();

  return (
    <RNText
      style={[{ color: theme.colors.text }, style]}
      {...rest}
    />
  );
}
