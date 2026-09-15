import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Linking,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { colors, spacing, radius } from '../globalStyles';
import { fetchScrapImpactBlogs } from '../services/blogScraper';
import ScalePressable from '../components/ScalePressable';
import SkeletonBentoCard from '../components/SkeletonBentoCard';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState('Feed');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadBlogs();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    const data = await fetchScrapImpactBlogs();
    setBlogs(data);
    setLoading(false);
  };

  const categories = [
    { label: 'All', icon: 'sparkles-outline' },
    { label: 'Paper & Cardboard', icon: 'document-text-outline' },
    { label: 'Plastics', icon: 'trash-bin-outline' },
    { label: 'E-Waste', icon: 'hardware-chip-outline' },
    { label: 'Metals', icon: 'build-outline' },
    { label: 'Glass', icon: 'wine-outline' },
    { label: 'Hazardous Scrap', icon: 'warning-outline' },
    { label: 'Textiles & Organic Waste', icon: 'shirt-outline' },
  ];

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

  const filteredBlogs = blogs.filter((item) => {
    const matchesCategory =
      selectedFilter === 'All' || item.category === selectedFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.snippet?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.safeAreaOverride]} edges={['top', 'left', 'right']}>
      <View style={styles.webWrapper}>
        <View style={styles.maxContainer}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => setIsMenuOpen(true)}
              style={styles.menuIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="grid-outline" size={22} color={colors.primary800} />
            </TouchableOpacity>

            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>
                Eco<Text style={styles.brandSub}>Shift</Text>
              </Text>
              <Text style={styles.locationMeta}>GLOBAL RECYCLING FEED</Text>
            </View>

            <TouchableOpacity style={styles.reloadBtn} onPress={loadBlogs}>
              <Ionicons name="refresh-outline" size={20} color={colors.primary800} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContentContainer,
              { paddingBottom: Math.max(insets.bottom + 90, 120) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.primary600}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search plastics, e-waste, hazardous scrap..."
                placeholderTextColor={colors.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            {/* Dynamic Story Avatars */}
            <View style={styles.storiesWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesScrollContent}
              >
                {categories.map((cat, idx) => (
                  <ScalePressable
                    key={idx}
                    style={styles.storyAvatarItem}
                    onPress={() => setSelectedFilter(cat.label)}
                    scaleTo={0.92}
                  >
                    <View
                      style={[
                        styles.storyRing,
                        selectedFilter === cat.label && styles.storyRingActive,
                      ]}
                    >
                      <View style={styles.storyInnerCircle}>
                        <Ionicons
                          name={cat.icon}
                          size={20}
                          color={
                            selectedFilter === cat.label
                              ? colors.white
                              : colors.primary800
                          }
                        />
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.storyLabel,
                        selectedFilter === cat.label && styles.storyLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </ScalePressable>
                ))}
              </ScrollView>
            </View>

            {/* Hero Banner */}
            <View style={styles.heroCardContainer}>
              <View style={styles.heroCardContent}>
                <View style={styles.heroTopRow}>
                  <View style={styles.heroTag}>
                    <Ionicons name="sparkles" size={12} color={colors.white} />
                    <Text style={styles.heroTagText}>One Step closer to sustainability</Text>
                  </View>
                  <Text style={styles.heroMetaText}>v2.4 Active</Text>
                </View>

                <Text style={styles.heroTitle}>Identify & Divert Hazardous Scrap</Text>
                <Text style={styles.heroSubtitle}>
                  Scan discarded items instantly to find local recovery centers & ecological impacts.
                </Text>

                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    style={styles.heroScanBtn}
                    onPress={() => navigation.navigate('ScanTab')}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="scan"
                      size={20}
                      color={colors.primary800}
                      style={styles.heroScanIcon}
                    />
                    <Text style={styles.heroScanBtnText}>Launch Scanner</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={colors.primary800}
                      style={styles.heroArrowIcon}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionSubtitle}>CURATED DISPATCHES</Text>
              <Text style={styles.sectionMainTitle}>Hazard Stories & Studies</Text>
            </View>

            {/* Bento Grid Editorial Articles */}
            {loading ? (
              <View style={styles.bentoGrid}>
                <SkeletonBentoCard isLarge={true} />
                <SkeletonBentoCard isLarge={false} />
                <SkeletonBentoCard isLarge={false} />
              </View>
            ) : (
              <View style={styles.bentoGrid}>
                {filteredBlogs.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No articles found for "{selectedFilter}"
                    </Text>
                  </View>
                ) : (
                  filteredBlogs.map((item, index) => {
                    const isLarge = index % 3 === 0;
                    return (
                      <ScalePressable
                        key={item.id}
                        style={[
                          styles.bentoCard,
                          isLarge ? styles.bentoCardLarge : styles.bentoCardHalf,
                        ]}
                        onPress={() => Linking.openURL(item.link)}
                        scaleTo={0.97}
                      >
                        <View style={styles.bentoHeader}>
                          <View
                            style={[
                              styles.badgePill,
                              {
                                backgroundColor:
                                  item.accentColor || colors.primary600,
                              },
                            ]}
                          >
                            <Text style={styles.badgePillText}>
                              {item.urgency || 'HAZARD'}
                            </Text>
                          </View>
                          <Text style={styles.bentoCategory}>{item.category}</Text>
                        </View>

                        <View style={styles.bentoBody}>
                          <Text
                            style={
                              isLarge ? styles.bentoTitleLarge : styles.bentoTitle
                            }
                            numberOfLines={2}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={styles.bentoSnippet}
                            numberOfLines={isLarge ? 3 : 2}
                          >
                            {item.snippet}
                          </Text>
                        </View>

                        <View style={styles.bentoFooter}>
                          <Text style={styles.bentoSource}>{item.source}</Text>
                          <Ionicons
                            name="arrow-up-outline"
                            size={16}
                            color={colors.white}
                            style={styles.bentoFooterIcon}
                          />
                        </View>
                      </ScalePressable>
                    );
                  })
                )}
              </View>
            )}
          </ScrollView>

          {/* Floating Cross-Platform Pill */}
          <View
            style={[
              styles.floatingPillContainer,
              { bottom: Math.max(insets.bottom + 10, 20) },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.floatingPill}>
              <TouchableOpacity
                style={[
                  styles.pillSegment,
                  viewMode === 'Feed' && styles.pillSegmentActive,
                ]}
                onPress={() => setViewMode('Feed')}
              >
                <Text
                  style={[
                    styles.pillText,
                    viewMode === 'Feed' && styles.pillTextActive,
                  ]}
                >
                  History Feed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pillSegment,
                  viewMode === 'Impact Map' && styles.pillSegmentActive,
                ]}
                onPress={() => {
                  setViewMode('Impact Map');
                  navigation.navigate('LocationTab');
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    viewMode === 'Impact Map' && styles.pillTextActive,
                  ]}
                >
                  NGO Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Side Drawer Modal */}
      <Modal visible={isMenuOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.drawerSafeArea} edges={['top', 'bottom', 'left', 'right']}>
            <View style={[globalStyles.drawerHeader, styles.drawerHeaderCustom]}>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={colors.primary600}
                />
              </TouchableOpacity>
              <Text style={globalStyles.drawerTitle}>User Profile</Text>
            </View>

            <ScrollView
              style={styles.drawerScroll}
              showsVerticalScrollIndicator={false}
            >
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
                  <View style={styles.menuRowLeft}>
                    <Ionicons
                      name={menuItem.icon}
                      size={22}
                      color={colors.primary600}
                    />
                    <Text style={globalStyles.menuLabel}>{menuItem.label}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.primary400}
                  />
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
  safeAreaOverride: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f3f6f3',
  },
  maxContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? spacing.xs : spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  menuIconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary800,
    letterSpacing: -0.5,
  },
  brandSub: {
    color: colors.primary600,
  },
  locationMeta: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary600,
    letterSpacing: 1,
  },
  reloadBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContentContainer: {
    paddingTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    marginHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    padding: 0,
  },
  storiesWrapper: {
    marginVertical: spacing.xs,
  },
  storiesScrollContent: {
    paddingHorizontal: spacing.base,
  },
  storyAvatarItem: {
    alignItems: 'center',
    marginRight: spacing.sm,
    width: 72,
  },
  storyRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2.5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  storyRingActive: {
    borderColor: colors.primary600,
  },
  storyInnerCircle: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: colors.primary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  storyLabelActive: {
    color: colors.primary800,
    fontWeight: '800',
  },
  heroCardContainer: {
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.primary800,
    padding: spacing.lg,
  },
  heroCardContent: {
    width: '100%',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  heroTagText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroMetaText: {
    color: colors.primary100,
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 28,
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.primary100,
    marginTop: 6,
    lineHeight: 18,
  },
  heroScanBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroScanIcon: {
    marginRight: 8,
  },
  heroScanBtnText: {
    color: colors.primary800,
    fontSize: 14,
    fontWeight: '800',
  },
  heroArrowIcon: {
    marginLeft: 6,
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary600,
    letterSpacing: 1,
  },
  sectionMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary800,
  },
  bentoGrid: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  bentoCard: {
    backgroundColor: colors.primary800,
    borderRadius: radius.xl,
    padding: spacing.base,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bentoCardLarge: {
    width: '100%',
    minHeight: 170,
  },
  bentoCardHalf: {
    width: '100%',
    minHeight: 150,
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  badgePillText: {
    color: colors.white,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bentoCategory: {
    color: colors.primary100,
    fontSize: 11,
    fontWeight: '600',
  },
  bentoBody: {
    marginVertical: 10,
  },
  bentoTitleLarge: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
  },
  bentoTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  bentoSnippet: {
    color: colors.primary100,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  bentoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  bentoSource: {
    color: colors.primary100,
    fontSize: 11,
    fontWeight: '600',
  },
  bentoFooterIcon: {
    transform: [{ rotate: '45deg' }],
  },
  floatingPillContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  floatingPill: {
    flexDirection: 'row',
    borderRadius: radius.full,
    padding: 4,
    backgroundColor: colors.primary800,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pillSegment: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSegmentActive: {
    backgroundColor: colors.white,
  },
  pillText: {
    color: colors.primary100,
    fontSize: 12.5,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.primary800,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawerSafeArea: {
    flex: 1,
    backgroundColor: colors.cardBg,
    paddingHorizontal: 20,
  },
  drawerHeaderCustom: {
    paddingTop: Platform.OS === 'ios' ? 0 : spacing.sm,
  },
  drawerScroll: {
    flex: 1,
    marginTop: 10,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});