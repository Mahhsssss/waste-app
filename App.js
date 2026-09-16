import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/auth';
import SplashScreen from './src/screens/SplashScreen';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
//import LocationScreen from './src/screens/LocationScreen';
import ScanScreen from './src/screens/ScanScreen';
import NgoScreen from './src/screens/NgoScreen';
import { colors } from './src/globalStyles';

const Tab = createBottomTabNavigator();

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.primary100,
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'home';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'NgoTab') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'LocationTab') iconName = focused ? 'location' : 'location-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      {/* <Tab.Screen name="LocationTab" component={LocationScreen} /> */}
      
      <Tab.Screen
        name="ScanTab"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.scanButtonContainer}>
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                size={30}
                color={colors.white}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen name="NgoTab" component={NgoScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner if you prefer
  }

  if (session?.user) {
    return <MainAppTabs />;
  }

  return <AuthNavigator initialScreen="Welcome" />;
}

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  // Render splash screen first
  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  // Render main app once splash finishes
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.primary600,
    height: 65,
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 4,
  },
  scanButtonContainer: {
    top: -15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary800,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
});