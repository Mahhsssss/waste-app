import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import global design system tokens and styles
import globalStyles, { colors } from '../globalStyles';

export default function HomeScreen({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuPress = (item) => {
    setIsMenuOpen(false);
    if (item === 'Account') {
      Alert.alert('Account', 'Opening Account Settings...');
    } else if (item === 'Logout') {
      Alert.alert('Logout', 'Logging out safely...');
    } else {
      Alert.alert(item, `Navigating to ${item}`);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Top Header */}
      <View style={globalStyles.headerRow}>
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(true)}
          style={globalStyles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu-outline" size={32} color={colors.primary800} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={globalStyles.logoTitle}>
            Eco<Text style={globalStyles.logoSub}>Shift</Text>
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Main Page Scroll Container */}
      <ScrollView 
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.sectionHeader}>Scan your scrap</Text>

        {/* Search Bar */}
        <View style={globalStyles.searchBar}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={colors.primary600} 
            style={{ marginRight: 10 }} 
          />
          <TextInput
            placeholder="Search scrap rate"
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={globalStyles.input}
          />
        </View>

        {/* Central Scan Card */}
        <View style={globalStyles.scanCard}>
          <Ionicons 
            name="scan-outline" 
            size={90} 
            color={colors.primary800} 
            style={{ marginBottom: 25 }} 
          />
          <TouchableOpacity 
            style={globalStyles.scanButton} 
            onPress={() => navigation.navigate('ScanTab')}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.scanButtonText}>Scan your scrap item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Side Drawer Profile Modal */}
      <Modal visible={isMenuOpen} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardBg, paddingHorizontal: 20 }}>
            <View style={globalStyles.drawerHeader}>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Ionicons name="chevron-back" size={28} color={colors.primary600} />
              </TouchableOpacity>
              <Text style={globalStyles.drawerTitle}>User Profile</Text>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 10 }} showsVerticalScrollIndicator={false}>
              {[
                { label: 'Account', icon: 'person-outline' },
                { label: 'Recurring Details', icon: 'business-outline' },
                { label: 'Contact Us', icon: 'mail-outline' },
                { label: 'Terms & Conditions', icon: 'document-text-outline' },
                { label: 'Privacy Policy', icon: 'lock-closed-outline' },
                { label: 'About', icon: 'information-circle-outline' },
                { label: 'Location', icon: 'location-outline' },
                { label: 'Logout', icon: 'log-out-outline' },
              ].map((menuItem, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={globalStyles.menuRow}
                  onPress={() => handleMenuPress(menuItem.label)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={menuItem.icon} size={22} color={colors.primary600} />
                    <Text style={globalStyles.menuLabel}>{menuItem.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.primary400} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}