import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import '../global.css';
import globalStyles, { colors } from '../globalStyles';
import GoogleIcon from '../components/GoogleIcon';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase'; 

export default function LoginScreen({ onNavigate }) {
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 1. Listen for Supabase session changes & automatic redirect to Home
  useEffect(() => {
    // Check if user is already logged in on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && onNavigate) {
        onNavigate('HomeScreen');
      }
    });

    // Listen for auth state changes (triggers right after Google OAuth completes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && onNavigate) {
        onNavigate('HomeScreen');
      }
    });

    return () => subscription.unsubscribe();
  }, [onNavigate]);

  // 2. Handle incoming deep link URLs when redirected back from Google browser
  useEffect(() => {
    const handleDeepLink = async (event) => {
      if (event?.url) {
        await supabase.auth.exchangeCodeForSession(event.url);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) supabase.auth.exchangeCodeForSession(url);
    });

    return () => subscription.remove();
  }, []);

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleLogin = async () => {
  if (!email.trim() || !password) {
    Alert.alert('Required Fields', 'Please enter both your email and password.');
    return;
  }

  try {
    setLoading(true);
    const { data, error } = await signIn(email, password);

    if (error) {
      Alert.alert('Login Failed', typeof error === 'string' ? error : error.message || 'Invalid credentials.');
    } else {
      Alert.alert('Welcome Back!', 'You have logged in successfully.', [
        {
          text: 'OK',
          onPress: () => {
            if (onNavigate) onNavigate('HomeScreen');
          },
        },
      ]);
    }
  } catch (err) {
    Alert.alert('Error', err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert('Google Sign-In', error);
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={globalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Header / Back Button */}
            <View style={globalStyles.headerRow}>
              <TouchableOpacity
                style={globalStyles.backButton}
                activeOpacity={0.7}
                onPress={() => onNavigate && onNavigate('Welcome')}
              >
                <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Screen Title */}
            <View style={globalStyles.loginTitleRow}>
              <Text style={globalStyles.title}>Hi, Welcome! </Text>
              <Text style={{ fontSize: 26 }}>👋</Text>
            </View>
            <View style={{ height: 18 }} />

            {/* Email Field */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.label}>Email address</Text>
              <View style={globalStyles.inputContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Your email"
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmailValid && (
                  <View style={{ paddingLeft: 8 }}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary600} />
                  </View>
                )}
              </View>
            </View>

            {/* Password Field */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.label}>Password</Text>
              <View style={globalStyles.inputContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={globalStyles.inputRightIcon}
                  activeOpacity={0.7}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me + Forgot Password Row */}
            <View style={globalStyles.optionsRow}>
              <TouchableOpacity
                style={globalStyles.rememberMeContainer}
                activeOpacity={0.8}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    globalStyles.checkboxCircle,
                    rememberMe && globalStyles.checkboxCircleActive,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  )}
                </View>
                <Text style={globalStyles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onNavigate && onNavigate('ForgotPassword')}
              >
                <Text style={globalStyles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Log In CTA Button */}
            <TouchableOpacity
              style={[
                globalStyles.primaryButton,
                loading && { opacity: 0.8 }
              ]}
              disabled={loading}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={globalStyles.primaryButtonText}>Log in</Text>
              )}
          </TouchableOpacity>

            {/* Divider */}
            <View style={globalStyles.dividerContainer}>
              <View style={globalStyles.dividerLine} />
              <Text style={globalStyles.dividerText}>Or with</Text>
              <View style={globalStyles.dividerLine} />
            </View>

            {/* Social Options */}
            <TouchableOpacity
              style={globalStyles.socialButtonCard}
              disabled={googleLoading}
              activeOpacity={0.8}
              onPress={handleGoogleSignIn}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={colors.primary600} />
              ) : (
                <>
                  <GoogleIcon size={20} />
                  <Text style={globalStyles.socialButtonCardText}>Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={globalStyles.footerRow}>
            <Text style={globalStyles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate && onNavigate('SignUp')}
            >
              <Text style={globalStyles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}