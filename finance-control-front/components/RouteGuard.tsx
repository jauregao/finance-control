import { useAuth } from '@/src/hooks/useAuth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

type RouteGuardProps = {
  children: React.ReactNode;
};

const PUBLIC_ROUTES = ['login'];
const AUTH_ROUTES = ['(tabs)'];

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const currentRoute = segments[0];
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute);
    const isAuthRoute = AUTH_ROUTES.includes(currentRoute);

    if (!user && isAuthRoute) {
      router.replace('/login');
    } else if (user && isPublicRoute) {
      router.replace('/');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return <>{children}</>;
}
