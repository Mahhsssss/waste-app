import React, { useState } from 'react';
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
import '../global.css';
import globalStyles, { colors } from '../globalStyles';
import GoogleIcon from '../components/GoogleIcon';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ onNavigate }) {
  const { signUp, signInWithGoogle } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      Alert.alert('Terms & Privacy', 'Please accept the terms and privacy policy.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signUp(email, password, username);
      if (error) {
        Alert.alert('Sign Up Failed', error);
      } else {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully! Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => onNavigate && onNavigate('Login'),
            },
          ]
        );
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
            <Text style={globalStyles.title}>Create account</Text>
            <View style={{ height: 16 }} />

            {/* Username Field */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.label}>Username</Text>
              <View style={globalStyles.inputContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Your username"
                  placeholderTextColor={colors.placeholder}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.label}>Email</Text>
              <View style={globalStyles.inputContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="example@gmail.com"
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.label}>Password</Text>
              <View style={globalStyles.inputContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="must be 8 characters"
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

            {/* Confirm Password Field */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.label}>Confirm password</Text>
              <View style={globalStyles.inputContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="repeat password"
                  placeholderTextColor={colors.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={globalStyles.inputRightIcon}
                  activeOpacity={0.7}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Accept Terms Checkbox */}
            <TouchableOpacity
              style={globalStyles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View
                style={[
                  globalStyles.checkboxCircle,
                  acceptTerms && globalStyles.checkboxCircleActive,
                ]}
              >
                {acceptTerms && (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                )}
              </View>
              <Text style={globalStyles.checkboxLabel}>
                I accept the terms and privacy policy
              </Text>
            </TouchableOpacity>

            {/* Sign Up CTA Button */}
            <TouchableOpacity
              style={[
                globalStyles.primaryButton,
                loading && { opacity: 0.8 },
              ]}
              disabled={loading}
              activeOpacity={0.85}
              onPress={handleSignUp}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={globalStyles.primaryButtonText}>Sign up</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={globalStyles.dividerContainer}>
              <View style={globalStyles.dividerLine} />
              <Text style={globalStyles.dividerText}>Or Register with</Text>
              <View style={globalStyles.dividerLine} />
            </View>

            {/* Social Options (Only Google, Apple/Facebook removed) */}
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
            <Text style={globalStyles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate && onNavigate('Login')}
            >
              <Text style={globalStyles.footerLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
