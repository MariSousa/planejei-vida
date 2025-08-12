
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  type User 
} from 'firebase/auth';
import { auth, app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface UserProfile {
    displayName?: string;
    photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In dev mode, we can simulate a user to bypass login for easier development.
    // Set this to true to enable the mock user.
    const useMockUser = false;

    if (process.env.NODE_ENV === 'development' && useMockUser) {
        setUser({
            uid: 'mock-user-id',
            email: 'dev@planejei.com',
            displayName: 'Usuário Dev',
        } as User);
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // This is to make sure we have the latest user profile info
        // as updateProfile doesn't trigger onAuthStateChanged
        setUser({...user});
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: email.split('@')[0]
        });
    }
    return userCredential;
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    router.push('/');
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const sendPasswordReset = async (email: string) => {
      return sendPasswordResetEmail(auth, email);
  }

  const updateUserProfile = async (profile: UserProfile) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        // Manually update state to reflect change immediately
        setUser(auth.currentUser ? { ...auth.currentUser } : null);
    } else {
        throw new Error("Nenhum usuário logado para atualizar o perfil.");
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
    } else {
         throw new Error("Nenhum usuário logado para atualizar a senha.");
    }
  }

  const deleteUserAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("Nenhum usuário para deletar.");
    }
    
    try {
        const functions = getFunctions(app);
        const deleteAllUserData = httpsCallable(functions, 'deleteAllUserData');
        await deleteAllUserData(); // Call the cloud function to delete firestore data

        await deleteUser(currentUser); // Delete the user from Auth
        
        router.push('/account-deleted');
    } catch (error: any) {
        console.error("Erro ao deletar conta:", error);
        if (error.code === 'auth/requires-recent-login') {
            throw new Error('Esta é uma operação sensível. Por favor, faça login novamente antes de deletar sua conta.');
        }
        throw new Error('Não foi possível deletar a conta. Tente novamente mais tarde.');
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    sendPasswordReset,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
