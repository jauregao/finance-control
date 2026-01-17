import { Loading } from '@/components/ui/Loading';
import { ThemedText as Text, ThemedView as View } from '@/components/ui/Themed';
import { useAuth } from '@/src/hooks/useAuth';
import { homeStyles } from '@/src/styles/home.screen.style';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>Finance Control</Text>
      <Text style={homeStyles.subtitle}>Bem-vindo!</Text>
      
      <Pressable 
        onPress={() => router.push(user ? '/dashboard' : '/login')} 
        style={homeStyles.button}
      >
        <Text style={homeStyles.buttonText}>Ir para Dashboard</Text>
      </Pressable>
    </View>
  );
}

