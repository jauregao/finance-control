import { useThemeColors } from '@/src/themes/useThemeColors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function Separator() {
  const theme = useThemeColors();

  return (
    <View
      style={[
        styles.separator,
        { backgroundColor: theme.colors.separator },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
  },
});
