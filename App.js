import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
//import LocationScreen from './src/screens/LocationScreen';
import ScanScreen from './src/screens/ScanScreen';
import NgoScreen from './src/screens/NgoScreen';
import { colors } from './src/globalStyles';

const LocationScreenPlaceholder = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: colors.primary800 }}>Location Screen Coming Soon</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
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