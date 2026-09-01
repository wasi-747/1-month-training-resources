import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* App Preferences */}
      <Text style={styles.sectionTitle}>PREFERENCES</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Dark Theme</Text>
            <Text style={styles.settingSubtitle}>Reduce screen glare and battery consumption</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={isDarkMode ? '#2563eb' : '#f8fafc'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingSubtitle}>Receive assignment updates & announcements</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={notificationsEnabled ? '#2563eb' : '#f8fafc'}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Offline Mode</Text>
            <Text style={styles.settingSubtitle}>Cache data for offline code review</Text>
          </View>
          <Switch
            value={offlineSync}
            onValueChange={setOfflineSync}
            trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
            thumbColor={offlineSync ? '#2563eb' : '#f8fafc'}
          />
        </View>
      </View>

      {/* Developer & Engine Info */}
      <Text style={styles.sectionTitle}>DEVELOPER & ENGINE</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Framework</Text>
          <Text style={styles.infoVal}>React Native CLI (0.87.1)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Navigation</Text>
          <Text style={styles.infoVal}>@react-navigation/native-stack & tabs</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Architecture</Text>
          <Text style={styles.infoVal}>Bare Native (Zero Expo)</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoKey}>App Version</Text>
          <Text style={styles.infoVal}>1.0.0-release</Text>
        </View>
      </View>

      {/* Logout / Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => Alert.alert('Cache Cleared', 'Navigation cache has been reset.')}
        activeOpacity={0.8}
      >
        <Text style={styles.resetButtonText}>🔄 Reset Navigation Cache</Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoKey: {
    fontSize: 13,
    color: '#64748b',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  resetButton: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
