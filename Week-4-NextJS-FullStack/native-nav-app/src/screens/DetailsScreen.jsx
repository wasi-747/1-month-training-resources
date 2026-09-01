import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  // Extract item passed via route.params
  const { item } = route.params || {
    item: {
      title: 'Module Details',
      category: '1-Month Training',
      folder: 'Week-X',
      status: 'Completed',
      description: 'Training module details.',
      icon: '📦',
      keyConcepts: ['Concept 1', 'Concept 2'],
    },
  };

  const handleReviewCode = () => {
    Alert.alert(
      'Repository Folder',
      `This module is located in your workspace under:\n\n📂 ${item.folder}\n\nAll source code and documentation are present.`,
      [{ text: 'Got it!', style: 'default' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Hero Badge Section */}
      <View style={styles.heroCard}>
        <Text style={styles.heroIcon}>{item.icon}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.folderText}>📂 {item.folder}</Text>
      </View>

      {/* Description Card */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionHeader}>📖 Overview & Learning Outcomes</Text>
        <Text style={styles.description}>{item.description}</Text>

        <Text style={[styles.sectionHeader, { marginTop: 14, marginBottom: 8 }]}>
          🔑 Key Concepts & Architecture
        </Text>
        <View style={styles.conceptsContainer}>
          {(item.keyConcepts || []).map((concept, idx) => (
            <View key={idx} style={styles.conceptPill}>
              <Text style={styles.conceptText}>✓ {concept}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Framework</Text>
            <Text style={styles.infoValue}>React Native CLI</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Navigation</Text>
            <Text style={styles.infoValue}>Stack & Tabs v7</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValueGreen}>100% Done</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.reviewButton} onPress={handleReviewCode} activeOpacity={0.8}>
          <Text style={styles.reviewButtonText}>📁 View Folder Path ({item.folder})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>⬅️ Back to Curriculum (navigation.goBack)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 10,
  },
  categoryText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 6,
  },
  folderText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 10,
  },
  conceptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 18,
  },
  conceptPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  conceptText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
  },
  infoValueGreen: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },
  actionSection: {
    gap: 12,
    paddingBottom: 20,
  },
  reviewButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  reviewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});
