import { separatorStyles } from '@/src/styles/separator.style';
import { useThemeColors } from '@/src/themes/useThemeColors';
import React from 'react';
import { ThemedView as View } from '@/components/ui/Themed';


export function Separator() {
  const theme = useThemeColors();

  return (
    <View
      style={[
        separatorStyles.separator,
        { backgroundColor: theme.colors.separator },
      ]}
    />
  );
}
