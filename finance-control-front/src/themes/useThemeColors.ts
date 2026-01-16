import { useColorScheme } from 'react-native';
import { Colors } from './colors';

export type ThemeMode = 'light' | 'dark';

export function useThemeColors() {
  const scheme = useColorScheme();
  const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';

  return {
    mode,
    colors: Colors[mode],
  };
}
