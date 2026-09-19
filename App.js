import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/auth';
import SplashScreen from './src/screens/SplashScreen';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import NgoScreen from './src/screens/NgoScreen';
import MapScreen from './src/screens/MapScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import RecycleAdviceScreen from './src/screens/RecycleAdviceScreen';
import DosDontsScreen from './src/screens/DosDontsScreen';
import ReportDumpScreen from './src/screens/ReportDumpScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import ContactScreen from './src/screens/ContactScreen';
import AboutScreen from './src/screens/AboutScreen';
import { colors } from './src/globalStyles';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

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
          else if (route.name === 'MapTab') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'HistoryTab') iconName = focused ? 'time' : 'time-outline';

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="NgoTab" component={NgoScreen} />

      {/* Elevated Center Camera Button */}
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

      <Tab.Screen name="MapTab" component={MapScreen} />
      <Tab.Screen name="HistoryTab" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  // If user is authenticated, render tab navigator + dynamic civic stack
  if (session?.user) {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainAppTabs} />
        <RootStack.Screen name="MapTab" component={MapScreen} />
        <RootStack.Screen name="RecycleAdviceScreen" component={RecycleAdviceScreen} />
        <RootStack.Screen name="DosDontsScreen" component={DosDontsScreen} />
        <RootStack.Screen name="ReportDumpScreen" component={ReportDumpScreen} />
        <RootStack.Screen name="ProfileScreen" component={ProfileScreen} />
        <RootStack.Screen name="TermsScreen" component={TermsScreen} />
        <RootStack.Screen name="PrivacyScreen" component={PrivacyScreen} />
        <RootStack.Screen name="ContactScreen" component={ContactScreen} />
        <RootStack.Screen name="AboutScreen" component={AboutScreen} />
      </RootStack.Navigator>
    );
  }

  return <AuthNavigator initialScreen="Welcome" />;
}

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

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
