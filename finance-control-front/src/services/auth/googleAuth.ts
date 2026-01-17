import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { firebaseAuth } from '@/src/lib/firebase';
import { api } from '@/src/services/api';

export async function handleGoogleSignIn(googleIdToken: string) {
  const credential = GoogleAuthProvider.credential(googleIdToken);
  const firebaseResult = await signInWithCredential(firebaseAuth, credential);
  
  const freshIdToken = await firebaseResult.user.getIdToken();
  
  const { data } = await api.post('/auth/firebase', {
    idToken: freshIdToken,
  });

  return {
    accessToken: data.accessToken,
    user: {
      id: data.userId,
      email: data.email,
    },
  };
}
