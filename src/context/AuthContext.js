import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../services/supabase';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  sendPasswordResetEmail,
  updateUserPassword,
  signOut as authSignOut,
} from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignUp = async (email, password, username) => {
    return await signUpWithEmail(email, password, username);
  };

  const handleSignIn = async (email, password) => {
    return await signInWithEmail(email, password);
  };

  const handleGoogleSignIn = async () => {
    return await signInWithGoogle();
  };

  const handlePasswordReset = async (email) => {
    return await sendPasswordResetEmail(email);
  };

  const handleUpdatePassword = async (newPassword) => {
    return await updateUserPassword(newPassword);
  };

  const handleSignOut = async () => {
    return await authSignOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signInWithGoogle: handleGoogleSignIn,
        sendPasswordReset: handlePasswordReset,
        updatePassword: handleUpdatePassword,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
