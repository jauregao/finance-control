import { Tabs } from 'expo-router';
import React from 'react';
import { useThemeColors } from '@/src/themes/useThemeColors';
import { TABS_CONFIG, getTabScreenOptions } from '@/src/config/tabs/tabsConfig';

export default function TabLayout() {
  const theme = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarInactiveTintColor: theme.colors.text,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      {TABS_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={getTabScreenOptions(tab, theme.colors.text)}
        />
      ))}
    </Tabs>
  );
}
