import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';
import globalStyles, { colors } from '../globalStyles';
import GoogleIcon from '../components/GoogleIcon';
import EcoLogo from '../components/EcoLogo';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen({ onNavigate }) {
  const { signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

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
      <View style={globalStyles.welcomeContainer}>
        {/* Main Content Card / Header */}
        <View style={globalStyles.welcomeTopSection}>
          <EcoLogo size={110} showTitle={true} />

          <View style={globalStyles.welcomeTextContainer}>
            <Text style={globalStyles.welcomeHeading}>Explore the app</Text>
            <Text style={globalStyles.welcomeSubtitle}>
              Now your waste management is in one place and always under control
            </Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={globalStyles.welcomeButtonsSection}>
          {/* Continue with Google */}
          <TouchableOpacity
            style={globalStyles.pillButton}
            activeOpacity={0.8}
            disabled={googleLoading}
            onPress={handleGoogleSignIn}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={colors.primary600} />
            ) : (
              <>
                <GoogleIcon size={20} />
                <Text style={globalStyles.pillButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Continue with Email */}
          <TouchableOpacity
            style={globalStyles.pillButton}
            activeOpacity={0.8}
            onPress={() => onNavigate && onNavigate('SignUp')}
          >
            <Ionicons name="mail" size={20} color={colors.textPrimary} />
            <Text style={globalStyles.pillButtonText}>Continue with Email</Text>
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
      </View>
    </SafeAreaView>
  );
}
