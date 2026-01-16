import EditScreenInfo from '@/components/EditScreenInfo';
import { Separator } from '@/components/ui/Separator';
import { ThemedText as Text, ThemedView as View } from '@/components/ui/Themed';
import { firebaseAuth } from '@/src/lib/firebase';
import { signOut } from 'firebase/auth';
import { Pressable, StyleSheet } from 'react-native';

export default function DashboardScreen() {
  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Separator />
      
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
      
      <EditScreenInfo path="app/(tabs)/dashboard.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#DC3545',
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
