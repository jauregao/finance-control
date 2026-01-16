import { ThemedText as Text, ThemedView as View } from '@/components/ui/Themed';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance Control</Text>
      <Text style={styles.subtitle}>Bem-vindo!</Text>
      
      <Pressable 
        onPress={() => router.push('/dashboard')} 
        style={styles.button}
      >
        <Text style={styles.buttonText}>Ir para Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
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
