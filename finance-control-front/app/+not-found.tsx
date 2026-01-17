import { ThemedText as Text, ThemedView as View } from '@/components/ui/Themed';
import { notFoundStyles } from '@/src/styles/not-found.screen.style';
import { Link, Stack } from 'expo-router';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={notFoundStyles.container}>
        <Text style={notFoundStyles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={notFoundStyles.link}>
          <Text style={notFoundStyles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
