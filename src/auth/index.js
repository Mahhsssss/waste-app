import React, { useState } from 'react';
import '../global.css';
import WelcomeScreen from './WelcomeScreen';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import PasswordChangedScreen from './PasswordChangedScreen';

export {
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  PasswordChangedScreen,
};

export default function AuthNavigator({ initialScreen = 'Welcome' }) {
  const [currentScreen, setCurrentScreen] = useState(initialScreen);

  const handleNavigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  switch (currentScreen) {
    case 'Welcome':
      return <WelcomeScreen onNavigate={handleNavigate} />;
    case 'SignUp':
      return <SignUpScreen onNavigate={handleNavigate} />;
    case 'Login':
      return <LoginScreen onNavigate={handleNavigate} />;
    case 'ForgotPassword':
      return <ForgotPasswordScreen onNavigate={handleNavigate} />;
    case 'ResetPassword':
      return <ResetPasswordScreen onNavigate={handleNavigate} />;
    case 'PasswordChanged':
      return <PasswordChangedScreen onNavigate={handleNavigate} />;
    default:
      return <WelcomeScreen onNavigate={handleNavigate} />;
  }
}
