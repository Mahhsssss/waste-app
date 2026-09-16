import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import globalStyles, { colors, spacing, radius } from '../globalStyles';

export default function NgoSearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  // Sample recovery hubs data matching your screenshot style
  const [hubs] = useState([
    {
      id: '1',
      name: 'greenciti',
      type: 'NGO',
      address: '19, Dreams Mall, Near Bhandup Railway Station, L.B...',
      streams: ['plastic', 'metal', 'e-waste devices', 'cardboard and paper', 'fabric', 'organic'],
    },
    {
      id: '2',
      name: 'saahas',
      type: 'NGO',
      address: '#21, Ground Floor, MCHS Colony, 5th C Cross, 16th M...',
      streams: ['plastic', 'metal', 'glass', 'e-waste devices', 'cardboard and paper', 'fabric', 'furniture', 'organic', 'rubber', 'other'],
    },
  ]);

  const handleSearchSubmit = () => {
    // Strips out unwanted semicolons or formatting issues when submitted
    const cleaned = searchQuery.replace(/;/g, '').trim();
    setSubmittedQuery(cleaned);
  };

  const filteredHubs = hubs.filter((hub) => {
    if (!submittedQuery) return true;
    const q = submittedQuery.toLowerCase();
    const matchesName = hub.name.toLowerCase().includes(q);
    const matchesAddress = hub.address.toLowerCase().includes(q);
    const matchesStream = hub.streams.some((stream) => stream.toLowerCase().includes(q));
    return matchesName || matchesAddress || matchesStream;
  });

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.safeAreaOverride]} edges={['top', 'left', 'right']}>
      <View style={styles.webWrapper}>
        <View style={styles.maxContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.headerTitle}>Recovery Hubs</Text>
              <Text style={styles.headerSubtitle}>Discover centers & drop-off points</Text>
            </View>
          </View>

          {/* Search Bar with Working Search Icon Trigger */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color={colors.primary600} style={styles.searchIcon} />
            <TextInput
              placeholder="Search center or waste type..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text.replace(/;/g, ''))}
              onSubmitEditing={handleSearchSubmit}
              style={styles.searchInput}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchActionBtn}>
              <Ionicons name="arrow-forward-circle" size={24} color={colors.primary800} />
            </TouchableOpacity>
          </View>

          {/* Available Centers Section Header */}
          <View style={styles.sectionMetaRow}>
            <Text style={styles.availableTitle}>Available Centers</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredHubs.length} found</Text>
            </View>
          </View>

          {/* Hub List */}
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom + 40, 80) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {filteredHubs.map((hub) => (
              <View key={hub.id} style={styles.hubCard}>
                <View style={styles.hubCardHeader}>
                  <Text style={styles.hubName}>{hub.name}</Text>
                  <View style={styles.ngoBadge}>
                    <Text style={styles.ngoBadgeText}>{hub.type}</Text>
                  </View>
                </View>

                <Text style={styles.hubAddress} numberOfLines={1}>{hub.address}</Text>

                <View style={styles.divider} />

                <Text style={styles.streamsLabel}>Accepted Streams:</Text>
                <View style={styles.streamsContainer}>
                  {hub.streams.map((stream, idx) => (
                    <View key={idx} style={styles.streamPill}>
                      <Text style={styles.streamPillText}>{stream}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.hubCardFooter}>
                  <View style={styles.footerLocationRow}>
                    <Ionicons name="location-outline" size={14} color={colors.primary600} />
                    <Text style={styles.footerAddressText} numberOfLines={1}>{hub.address}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => Linking.openURL('tel:911')}
                  >
                    <Ionicons name="call" size={14} color={colors.white} style={{ marginRight: 4 }} />
                    <Text style={styles.callBtnText}>Call Hub</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaOverride: { flex: 1, backgroundColor: '#ffffff' },
  webWrapper: { flex: 1, alignItems: 'center', backgroundColor: '#f3f6f3' },
  maxContainer: { flex: 1, width: '100%', maxWidth: 600, backgroundColor: '#ffffff', position: 'relative' },
  headerContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? spacing.xs : spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.primary800, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: 6,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: colors.textPrimary, padding: 0 },
  searchActionBtn: { padding: 4 },
  sectionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
  },
  availableTitle: { fontSize: 16, fontWeight: '800', color: colors.primary800 },
  countBadge: { backgroundColor: colors.primary50, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  countText: { fontSize: 11, fontWeight: '700', color: colors.primary800 },
  scrollContent: { paddingHorizontal: spacing.base, gap: spacing.sm },
  hubCard: {
    backgroundColor: colors.cardBg || '#f4f8f4',
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hubCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hubName: { fontSize: 18, fontWeight: '800', color: colors.primary800, textTransform: 'lowercase' },
  ngoBadge: { backgroundColor: colors.primary800, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.xs },
  ngoBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  hubAddress: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  streamsLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginBottom: 4 },
  streamsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  streamPill: { backgroundColor: colors.white, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  streamPillText: { fontSize: 11, color: colors.primary800, fontWeight: '600' },
  hubCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  footerLocationRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  footerAddressText: { fontSize: 11, color: colors.textSecondary, marginLeft: 4 },
  callBtn: { flexDirection: 'row', backgroundColor: colors.primary800, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full, alignItems: 'center' },
  callBtnText: { color: colors.white, fontSize: 11, fontWeight: '700' },
});