import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* Place your global.css imports here when setup */

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
    <SafeAreaView style={styles.safeContainer}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          onPress={() => setIsMenuOpen(true)}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu-outline" size={32} color="#2e540a" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Text style={styles.logoTitle}>Eco<Text style={styles.logoSub}>Shift</Text></Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Main Page Scroll Container */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Scan your scrap</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#65a30d" style={styles.searchIcon} />
          <TextInput
            placeholder="Search scrap rate"
            placeholderTextColor="#84cc16"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Central Scan Card */}
        <View style={styles.scanCard}>
          <Ionicons name="scan-outline" size={90} color="#2e540a" style={styles.cardIcon} />
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={() => navigation.navigate('ScanTab')}
            activeOpacity={0.8}
          >
            <Text style={styles.scanButtonText}>Scan your scrap item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Side Drawer Profile Modal */}
      <Modal visible={isMenuOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.sidebarContainer}>
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Ionicons name="chevron-back" size={28} color="#65a30d" />
              </TouchableOpacity>
              <Text style={styles.drawerTitle}>User Profile</Text>
            </View>

            <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
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
                  style={styles.menuRow}
                  onPress={() => handleMenuPress(menuItem.label)}
                >
                  <View style={styles.menuRowLeft}>
                    <Ionicons name={menuItem.icon} size={22} color="#65a30d" />
                    <Text style={styles.menuLabel}>{menuItem.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#a3e635" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f7fee7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#15803d',
    letterSpacing: -0.5,
  },
  logoSub: {
    color: '#84cc16',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a2e05',
    marginVertical: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ecfccb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a2e05',
  },
  scanCard: {
    backgroundColor: '#d9f99d',
    borderRadius: 24,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    marginBottom: 25,
  },
  scanButton: {
    backgroundColor: '#84cc16',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#1a2e05',
    fontWeight: '700',
    fontSize: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fee7',
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#84cc16',
    marginLeft: 15,
  },
  menuList: {
    flex: 1,
    marginTop: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fee7',
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 16,
  },
});