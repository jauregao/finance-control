import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/src/hooks/useAuth';
import { handleGoogleSignIn } from '@/src/services/auth/googleAuth';
import { loginStyles } from '@/src/styles/login.styles';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { ThemedText as Text, ThemedView as View } from '@/components/ui/Themed';


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      processGoogleLogin(response.params.id_token);
    } else if (response?.type === 'error' || response?.type === 'cancel') {
      setLoading(false);
    }
  }, [response]);

  const processGoogleLogin = async (googleIdToken: string) => {
    setLoading(true);

    try {
      const { accessToken, user } = await handleGoogleSignIn(googleIdToken);
      await signIn(accessToken, user);
    } catch (error: any) {
      Alert.alert(
        'Erro no Login',
        error.response?.data?.message || 'Falha ao realizar login. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />


  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Finance Control</Text>
      
      <Pressable
        onPress={() => {
          setLoading(true);
          promptAsync();
        }}
        style={loginStyles.button}
        disabled={!request}
      >
        <Text style={loginStyles.buttonText}>Sign in with Google</Text>
      </Pressable>
    </View>
  );
}
