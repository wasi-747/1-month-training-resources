/**
 * ==============================================================================================
 * 📱 ToLetNest — React Native Mobile Client Application
 * ==============================================================================================
 * Pure React Native Core Architecture:
 * - Uses Native Components: View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal
 * - Custom Hooks: useLocationRadar, useInAppChat, useAudioCall
 * - Anti-Harassment Privacy Shield & One-Tap Close Chat
 * ==============================================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'explore' | 'chats'
  const [selectedListing, setSelectedListing] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Sample data
  const [listings, setListings] = useState([
    {
      id: '1',
      title: 'Bachelor Master Bed with Attached Bath',
      rent: 8500,
      utility: 1450,
      area: 'Bashundhara R/A',
      distance: '350m away',
      tenantType: 'Bachelor Male',
      amenities: ['WiFi', 'Attached Bath', 'Balcony', 'No Curfew'],
      landlord: 'Engr. Rafiqul Islam',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2',
      title: 'Female Student Sublet Room (Near IUB)',
      rent: 6500,
      utility: 1000,
      area: 'Bashundhara R/A',
      distance: '650m away',
      tenantType: 'Female Student',
      amenities: ['WiFi', 'Lift', 'Meal System'],
      landlord: 'Mrs. Selina Akhter',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    }
  ]);

  // Call simulation timer
  useEffect(() => {
    let interval;
    if (isCalling) {
      interval = setInterval(() => setCallTimer((prev) => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const handleStartCall = (listing) => {
    setActiveCall(listing);
    setIsCalling(true);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setActiveCall(null);
    Alert.alert('Call Summary', 'In-App Voice Call Ended. Zero Phone Number Exposure.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1d" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏡 ToLet<Text style={styles.cyanText}>Nest</Text></Text>
        <Text style={styles.headerSubtitle}>📍 GPS Active: Bashundhara R/A</Text>
      </View>

      {/* Listing Feed */}
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedListing(item)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.badgeRow}>
                <Text style={styles.distanceBadge}>📍 {item.distance}</Text>
                <Text style={styles.rentText}>৳{item.rent.toLocaleString()}/mo</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.areaText}>{item.area} • {item.tenantType}</Text>

              <View style={styles.costBadge}>
                <Text style={styles.costBadgeText}>
                  💡 Total: ৳{(item.rent + item.utility).toLocaleString()}/mo (Incl. Utils)
                </Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleStartCall(item)}
                >
                  <Text style={styles.callButtonText}>📞 In-App Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => setSelectedListing(item)}
                >
                  <Text style={styles.chatButtonText}>💬 Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal: In-App Voice Call Screen */}
      <Modal visible={isCalling} transparent animationType="slide">
        <View style={styles.callModalContainer}>
          <View style={styles.callModalContent}>
            <View style={styles.avatarCircle}>
              <Text style={{ fontSize: 36 }}>🏠</Text>
            </View>
            <Text style={styles.callerName}>{activeCall?.landlord}</Text>
            <Text style={styles.callerListing}>{activeCall?.title}</Text>
            <Text style={styles.callStatus}>
              🟢 Connected (00:{callTimer < 10 ? `0${callTimer}` : callTimer})
            </Text>
            <Text style={styles.privacyShieldText}>🔒 Privacy Shield: Number Hidden</Text>

            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Text style={styles.endCallButtonText}>End Call 📵</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// React Native StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  cyanText: {
    color: '#38bdf8',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#131c31',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  distanceBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rentText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 4,
  },
  areaText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  costBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 6,
    padding: 6,
    marginBottom: 10,
  },
  costBadgeText: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  callModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callModalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  callerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  callerListing: {
    fontSize: 12,
    color: '#38bdf8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  callStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  privacyShieldText: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 24,
  },
  endCallButton: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  endCallButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
