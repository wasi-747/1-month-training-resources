import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const stats = [
    { label: 'Modules Completed', value: '4' },
    { label: 'Active Projects', value: '2' },
    { label: 'Certificates', value: '1' },
  ];

  const profileOptions = [
    { id: '1', title: 'Edit Profile Information', icon: '👤' },
    { id: '2', title: 'Downloaded Offline Assets', icon: '📥' },
    { id: '3', title: 'Security & Two-Factor Auth', icon: '🔒' },
    { id: '4', title: 'Help & Documentation', icon: '❓' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>W</Text>
        </View>
        <Text style={styles.userName}>Wasiur Rahman Sakib</Text>
        <Text style={styles.userRole}>Software Engineer Trainee • TechDojo</Text>
        <Text style={styles.userEmail}>wasiur.rahman@techdojo.dev</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Settings / Options List */}
      <View style={styles.optionsCard}>
        {profileOptions.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={styles.optionRow}
            onPress={() => Alert.alert(opt.title, 'This is a sample sub-action in React Native Navigation.')}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <Text style={styles.optionText}>{opt.title}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userRole: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  optionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
});
