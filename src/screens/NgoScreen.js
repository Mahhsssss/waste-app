import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import globalStyles, { colors, spacing, radius } from '../globalStyles';

export default function NgoScreen() {
  const insets = useSafeAreaInsets();
  const [ngos, setNgos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('markers')
        .select('*');

      if (error) throw error;
      setNgos(data || []);
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Robust parser to handle strings, arrays, and accidental double-commas
  const parseTrashTypes = (trashData) => {
    if (!trashData) return [];
    
    // If it's already an array
    let rawArray = Array.isArray(trashData) 
      ? trashData 
      : String(trashData).split(',');

    // Flatten and clean up whitespace & empty strings
    const cleaned = rawArray
      .flatMap((item) => String(item).split(','))
      .map((item) => item.trim().replace(/^['"]+|['"]+$/g, '')) // remove stray quotes if any
      .filter(Boolean);

    // Return unique values to completely prevent internal card repetition
    return Array.from(new Set(cleaned));
  };

  const trashCategories = useMemo(() => {
    const categoriesSet = new Set();
    ngos.forEach((item) => {
      const types = parseTrashTypes(item.type_of_trash);
      types.forEach((type) => {
        if (type) categoriesSet.add(type);
      });
    });
    return ['All', ...Array.from(categoriesSet)];
  }, [ngos]);

  const toggleCategory = (cat) => {
    if (cat === 'All') {
      setSelectedCategories(['All']);
      return;
    }

    let updated = selectedCategories.filter((c) => c !== 'All');
    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
      if (updated.length === 0) {
        updated = ['All'];
      }
    } else {
      updated.push(cat);
    }
    setSelectedCategories(updated);
  };

  const filteredNgos = useMemo(() => {
    return ngos.filter((item) => {
      const trashTypes = parseTrashTypes(item.type_of_trash);
      
      const matchesCategory =
        selectedCategories.includes('All') ||
        trashTypes.some((t) =>
          selectedCategories.some((sc) => sc.toLowerCase() === t.toLowerCase())
        );

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.address?.toLowerCase().includes(query) ||
        trashTypes.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [ngos, selectedCategories, searchQuery]);

  const getCategoryIcon = (cat) => {
    const lower = cat.toLowerCase();
    if (lower.includes('plastic')) return 'trash-bin-outline';
    if (lower.includes('paper') || lower.includes('cardboard')) return 'document-text-outline';
    if (lower.includes('metal')) return 'build-outline';
    if (lower.includes('e-waste') || lower.includes('electronic')) return 'hardware-chip-outline';
    if (lower.includes('glass')) return 'wine-outline';
    if (lower.includes('organic') || lower.includes('food')) return 'leaf-outline';
    return 'sparkles-outline';
  };

  const renderCard = ({ item }) => {
    const trashTypes = parseTrashTypes(item.type_of_trash);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardTopBanner}>
          <View style={styles.cardHeader}>
            <Text style={styles.ngoName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type || 'NGO'}</Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {item.address ? item.address : 'Verified Collection Center'}
          </Text>
        </View>

        <View style={styles.cardBody}>
          {trashTypes.length > 0 && (
            <View style={styles.chipContainer}>
              <Text style={styles.chipLabel}>Accepted Streams:</Text>
              <View style={styles.chipWrapper}>
                {trashTypes.map((type, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionRow}>
            {item.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={15} color={colors.primary600} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            )}

            {item.phone && (
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={14} color={colors.white} />
                <Text style={styles.callButtonText}>Call Hub</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.safeAreaOverride]} edges={['top', 'left', 'right']}>
      <View style={styles.webWrapper}>
        <View style={styles.maxContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.screenMainTitle}>Recovery Hubs</Text>
              <Text style={styles.screenSubTitle}>Discover centers & drop-off points</Text>
            </View>
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchNgos} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={20} color={colors.primary800} />
            </TouchableOpacity>
          </View>

          {/* Quick Filter Horizontal Scroll */}
          <View style={styles.filterScrollWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {trashCategories.map((cat, idx) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.pill, isSelected && styles.pillActive]}
                    onPress={() => toggleCategory(cat)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={getCategoryIcon(cat)}
                      size={14}
                      color={isSelected ? colors.white : colors.primary800}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color={colors.primary600} style={styles.searchIcon} />
            <TextInput
              placeholder="Search center or waste type..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.listSectionHeader}>
            <Text style={styles.listSectionTitle}>Available Centers</Text>
            <Text style={styles.listCountBadge}>{filteredNgos.length} found</Text>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={colors.primary600} />
            </View>
          ) : (
            <FlatList
              data={filteredNgos}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderCard}
              contentContainerStyle={[
                styles.flatListContent,
                { paddingBottom: Math.max(insets.bottom + 90, 110) },
              ]}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="folder-open-outline" size={48} color={colors.primary400} />
                  <Text style={styles.emptyText}>No recovery centers match your filter criteria.</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: Platform.OS === 'ios' ? spacing.xs : spacing.sm,
    marginBottom: spacing.xs,
  },
  screenMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary800,
    letterSpacing: -0.5,
  },
  screenSubTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterScrollWrapper: {
    marginVertical: spacing.xs,
  },
  filterScrollContent: {
    paddingHorizontal: spacing.base,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary50,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  pillActive: {
    backgroundColor: colors.primary800,
    borderColor: colors.primary800,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary800,
  },
  pillTextActive: {
    color: colors.white,
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
    marginTop: spacing.xs,
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
  listSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  listSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary800,
    letterSpacing: 0.5,
  },
  listCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary600,
    backgroundColor: colors.primary50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  flatListContent: {
    paddingHorizontal: spacing.base,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopBanner: {
    backgroundColor: colors.primary50,
    paddingHorizontal: spacing.base,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ngoName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary800,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: colors.primary800,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  cardBody: {
    padding: spacing.base,
  },
  chipContainer: {
    marginBottom: 12,
  },
  chipLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  chipText: {
    fontSize: 11,
    color: colors.primary800,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary800,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 4,
  },
  callButtonText: {
    color: colors.white,
    fontSize: 11.5,
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
});