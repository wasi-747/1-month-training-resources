import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';

const COURSES_DATA = [
  {
    id: '1',
    title: 'Week 1: Web Foundations & JS ES6+',
    folder: 'Week-1-Web-Foundations-and-JS',
    category: 'Foundations',
    status: 'Completed (100%)',
    description:
      'Semantic HTML5, CSS Grid & Flexbox, Glassmorphism, JS Closures, Promises, Async/Await, and Array methods (map, filter, reduce).',
    icon: '🌐',
    keyConcepts: ['Semantic HTML5', 'CSS Grid & Flexbox', 'ES6+ Closures', 'Async/Await & Promises'],
    badgeColor: '#2563eb',
  },
  {
    id: '2',
    title: 'Week 2: React 18 Deep Dive & Hooks',
    folder: 'Week-2-React-Deep-Dive',
    category: 'Frontend Core',
    status: 'Completed (100%)',
    description:
      'Component-driven UI, Virtual DOM Reconciliation diffing, State Immutability, useState, useEffect cleanups, and custom hooks (useFetch, useToggle).',
    icon: '⚛️',
    keyConcepts: ['Virtual DOM Diffing', 'State Immutability', 'useFetch & useToggle', 'Memory Cleanup'],
    badgeColor: '#0891b2',
  },
  {
    id: '3',
    title: 'Week 3: Database & Full-Stack System Design',
    folder: 'Week-3-Database-Architecture',
    category: 'Backend & DB',
    status: 'Completed (100%)',
    description:
      'MongoDB BSON binary protocol, Mongoose Schema validation, 2dsphere GeoJSON spatial indexing, and RESTful API architecture.',
    icon: '🍃',
    keyConcepts: ['MongoDB BSON', 'Mongoose Schemas', '2dsphere Geo-Index', 'RESTful API Patterns'],
    badgeColor: '#059669',
  },
  {
    id: '4',
    title: 'Week 4: Next.js 14 & Capstone: ToLetNest',
    folder: 'Week-4-NextJS-FullStack',
    category: 'Full-Stack & Mobile',
    status: 'Live & Evaluated',
    description:
      'Next.js 14 App Router, Server/Client components, Leaflet OpenStreetMap GPS Radar, and Bare React Native CLI with React Navigation.',
    icon: '🚀',
    keyConcepts: ['Next.js 14 App Router', 'Leaflet OSM Radar', 'Mongoose Singleton', 'React Native CLI'],
    badgeColor: '#c9722d',
  },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.statusText}>📁 {item.folder}</Text>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Module ➡️</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.greeting}>TechDojo 1-Month Training</Text>
        <Text style={styles.userName}>Wasiur Rahman Sakib </Text>
        <Text style={styles.subtitle}>React Native CLI Navigation Architecture</Text>
      </View>

      {/* Course List */}
      <FlatList
        data={COURSES_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 28,
  },
  badgeContainer: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  badgeText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    maxWidth: '65%',
  },
  viewButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
