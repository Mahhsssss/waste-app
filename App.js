import React from 'react';
import './src/global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AuthNavigator from './src/auth';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AuthNavigator initialScreen="Welcome" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
