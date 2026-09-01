import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const EXPLORE_ITEMS = [
  {
    id: 'e1',
    title: 'ES6+ Closures, Promises & Async/Await',
    folder: 'Week-1-Web-Foundations-and-JS',
    category: 'JavaScript',
    status: 'Mastered',
    description:
      'Lexical scoping, event loop microtasks, async-await error handling, and array transformation pipelines (map, filter, reduce).',
    icon: '⚡',
    keyConcepts: ['Lexical Scope', 'Event Loop', 'Promises', 'Array Immutability'],
  },
  {
    id: 'e2',
    title: 'React 18 Virtual DOM & Reconciliation',
    folder: 'Week-2-React-Deep-Dive',
    category: 'React Core',
    status: 'Mastered',
    description:
      'Component tree diffing, batched state updates, state immutability shallow comparisons, and defensive UI rendering.',
    icon: '⚛️',
    keyConcepts: ['V-DOM Diffing', 'Batched Updates', 'Shallow Compare', 'Pure Components'],
  },
  {
    id: 'e3',
    title: 'Custom Hooks: useFetch & useToggle',
    folder: 'Week-2-React-Deep-Dive/react-playground',
    category: 'React Core',
    status: 'Mastered',
    description:
      'Encapsulating async data fetching with AbortController cleanup to prevent memory leaks and unmounted component state updates.',
    icon: '🪝',
    keyConcepts: ['useFetch Hook', 'useToggle Hook', 'AbortController', 'Memory Cleanups'],
  },
  {
    id: 'e4',
    title: 'MongoDB BSON & Mongoose Connection Singleton',
    folder: 'Week-4-NextJS-FullStack/tolet-nest',
    category: 'Database',
    status: 'Mastered',
    description:
      'Preventing connection leaks in Next.js Fast Refresh using global.mongoose singleton caching and GeoJSON 2dsphere indexing.',
    icon: '🍃',
    keyConcepts: ['BSON Schema', 'Singleton Pattern', '2dsphere Indexing', 'Fast Refresh Fix'],
  },
  {
    id: 'e5',
    title: 'Leaflet OpenStreetMap Dhaka GPS Radar',
    folder: 'Week-4-NextJS-FullStack/tolet-nest',
    category: 'Full-Stack',
    status: 'Mastered',
    description:
      'OpenStreetMap vector tile rendering, Haversine spherical distance formula, and interactive center pin-drop reverse geocoding.',
    icon: '🗺️',
    keyConcepts: ['Leaflet Map', 'OpenStreetMap', 'Haversine GPS Math', 'Reverse Geocoding'],
  },
  {
    id: 'e6',
    title: 'React Native CLI Stack & Tab Navigation',
    folder: 'Week-4-NextJS-FullStack/native-nav-app',
    category: 'Mobile Dev',
    status: 'Mastered',
    description:
      'Bare React Native architecture, @react-navigation/native-stack, bottom tabs, route.params passing, and native Android builds.',
    icon: '📱',
    keyConcepts: ['Native Stack', 'Bottom Tabs', 'route.params', 'Bare React Native'],
  },
];

export default function ExploreScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'JavaScript', 'React Core', 'Database', 'Full-Stack', 'Mobile Dev'];

  const filteredData = EXPLORE_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search 1-Month curriculum concepts..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryPill,
              selectedCategory === cat && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === cat && styles.categoryPillTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => navigation.navigate('Details', { item })}
            activeOpacity={0.8}
          >
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemFolder} numberOfLines={1}>
                📁 {item.folder}
              </Text>
            </View>
            <Text style={styles.arrowIcon}>➡️</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: '#1e293b',
  },
  clearText: {
    fontSize: 14,
    color: '#94a3b8',
    padding: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 6,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },
  itemIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  itemInfo: {
    flex: 1,
  },
  itemCategory: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  itemFolder: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  arrowIcon: {
    fontSize: 14,
    marginLeft: 8,
  },
});
