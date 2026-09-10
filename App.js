import React from 'react';
import './src/global.css';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthNavigator from './src/auth';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';

// Placeholders for remaining tabs
const LocationScreen = () => (
  <View style={styles.center}><Text>Location Screen</Text></View>
);
const AnalyticsScreen = () => (
  <View style={styles.center}><Text>Analytics Screen</Text></View>
);
const ShopScreen = () => (
  <View style={styles.center}><Text>Shop Screen</Text></View>
);

const Tab = createBottomTabNavigator();

function MainAppTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#4d7c0f',
          tabBarIcon: ({ focused, color }) => {
            let iconName = 'home';
            if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'LocationTab') iconName = focused ? 'location' : 'location-outline';
            else if (route.name === 'AnalyticsTab') iconName = focused ? 'analytics' : 'analytics-outline';
            else if (route.name === 'ShopTab') iconName = focused ? 'storefront' : 'storefront-outline';

            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeScreen} />
        <Tab.Screen name="LocationTab" component={LocationScreen} />
        
        {/* CENTER CAMERA BUTTON */}
        <Tab.Screen 
          name="ScanTab" 
          component={ScanScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.scanButtonContainer}>
                <Ionicons 
                  name={focused ? "camera" : "camera-outline"} 
                  size={30} 
                  color="#ffffff" 
                />
              </View>
            ),
          }}
        />

        <Tab.Screen name="AnalyticsTab" component={AnalyticsScreen} />
        <Tab.Screen name="ShopTab" component={ShopScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();

  // If user is authenticated, show Main App Tabs; otherwise show Auth Flow
  if (session?.user) {
    return <MainAppTabs />;
  }

  return <AuthNavigator initialScreen="Welcome" />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fee7',
  },
  tabBar: {
    backgroundColor: '#a3e635',
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
    backgroundColor: '#65a30d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
});
