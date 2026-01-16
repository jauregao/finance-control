import { firebaseAuth, GoogleAuthProvider, signInWithCredential } from '@/src/lib/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(firebaseAuth, credential)
        .then((result) => {
          console.log('Login success:', result.user);
        })
        .catch((error) => {
          console.error('Login error:', error);
          setLoading(false);
        });
    } else if (response?.type === 'error' || response?.type === 'cancel') {
      setLoading(false);
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Prompt error:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Control</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" />
      ) : (
        <Pressable
          onPress={handleGoogleLogin}
          style={styles.button}
          disabled={!request}
        >
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
