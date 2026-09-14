import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function CustomBlurView({ intensity = 50, tint = 'dark', style, children }) {
  // If running on web, use web CSS backdrop filter
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: tint === 'dark' ? 'rgba(15, 45, 25, 0.75)' : 'rgba(255, 255, 255, 0.75)',
            // Web specific CSS blurring
            backdropFilter: `blur(${intensity / 5}px)`,
            WebkitBackdropFilter: `blur(${intensity / 5}px)`,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  // If running on iOS/Android, use standard Expo BlurView
  return (
    <BlurView intensity={intensity} tint={tint} style={style}>
      {children}
    </BlurView>
  );
}