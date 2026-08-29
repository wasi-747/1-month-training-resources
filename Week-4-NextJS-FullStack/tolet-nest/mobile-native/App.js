/**
 * ==============================================================================================
 * 📱 ToLetNest — React Native Mobile Client Application
 * ==============================================================================================
 * Pure React Native Core Architecture (Warm Dhaka Terracotta & Charcoal Palette):
 * - Uses Native Components: View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal
 * - Privacy-First In-App Audio Calling & One-Tap Close Chat Anti-Harassment Shield
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
  const [activeTab, setActiveTab] = useState('radar');
  const [selectedListing, setSelectedListing] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  const [listings, setListings] = useState([
    {
      id: '1',
      title: '1 Seat in 2-Person Bachelor Room (Near NSU)',
      rent: 3800,
      utility: 750,
      area: 'Bashundhara R/A',
      distance: '250m away',
      rentalCategory: 'Seat Rent',
      tenantType: 'Bachelor Male',
      amenities: ['WiFi', 'Attached Bath', 'Meal System'],
      landlord: 'Tanvir (Outgoing Student)',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2',
      title: 'Partitioned Dining Space Bed (Saidnagar)',
      rent: 2800,
      utility: 600,
      area: 'Saidnagar 100ft',
      distance: '650m away',
      rentalCategory: 'Dining Space',
      tenantType: 'Bachelor Male',
      amenities: ['WiFi', 'Gas', 'Meal System'],
      landlord: 'Shakil (Flatmate)',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '3',
      title: 'Bachelor Master Bed with Attached Bath',
      rent: 8500,
      utility: 1450,
      area: 'Bashundhara R/A',
      distance: '350m away',
      rentalCategory: 'Room Rent',
      tenantType: 'Bachelor Male',
      amenities: ['WiFi', 'Attached Bath', 'Balcony', 'No Curfew'],
      landlord: 'Engr. Rafiqul Islam',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '4',
      title: 'Female Student Sublet Room (Near IUB)',
      rent: 6500,
      utility: 1000,
      area: 'Bashundhara R/A',
      distance: '650m away',
      rentalCategory: 'Sublet',
      tenantType: 'Female Student',
      amenities: ['WiFi', 'Lift', 'Meal System'],
      landlord: 'Mrs. Selina Akhter',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    }
  ]);

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
      <StatusBar barStyle="light-content" backgroundColor="#14120f" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ToLet<Text style={styles.terracottaText}>Nest</Text></Text>
        <Text style={styles.headerSubtitle}>📍 GPS Active: Bashundhara R/A (Dhaka)</Text>
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
                  Total: ৳{(item.rent + item.utility).toLocaleString()}/mo (Incl. Utils)
                </Text>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleStartCall(item)}
                >
                  <Text style={styles.callButtonText}>In-App Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => setSelectedListing(item)}
                >
                  <Text style={styles.chatButtonText}>Chat</Text>
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
              <Text style={{ fontSize: 32, color: '#c9722d' }}>🏛️</Text>
            </View>
            <Text style={styles.callerName}>{activeCall?.landlord}</Text>
            <Text style={styles.callerListing}>{activeCall?.title}</Text>
            <Text style={styles.callStatus}>
              Connected (00:{callTimer < 10 ? `0${callTimer}` : callTimer})
            </Text>
            <Text style={styles.privacyShieldText}>🔒 Privacy Shield: Number Hidden</Text>

            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Text style={styles.endCallButtonText}>End Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14120f',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#29241f',
    backgroundColor: '#1a1714',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  terracottaText: {
    color: '#c9722d',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#b3aba2',
    marginTop: 2,
  },
  listContainer: {
    padding: 14,
  },
  card: {
    backgroundColor: '#1a1714',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#29241f',
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceBadge: {
    backgroundColor: 'rgba(201, 114, 45, 0.15)',
    color: '#c9722d',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rentText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 3,
  },
  areaText: {
    fontSize: 11,
    color: '#7d756c',
    marginBottom: 6,
  },
  costBadge: {
    backgroundColor: 'rgba(201, 114, 45, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(201, 114, 45, 0.3)',
    borderRadius: 6,
    padding: 5,
    marginBottom: 8,
  },
  costBadgeText: {
    fontSize: 10,
    color: '#c9722d',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#221e1a',
    borderWidth: 1,
    borderColor: '#3b342d',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#c9722d',
    fontWeight: '700',
    fontSize: 12,
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#c9722d',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  callModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(10,8,6,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  callModalContent: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#1a1714',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b342d',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#221e1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c9722d',
  },
  callerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  callerListing: {
    fontSize: 11,
    color: '#c9722d',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  callStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9fe3c2',
    marginBottom: 2,
  },
  privacyShieldText: {
    fontSize: 9,
    color: '#7d756c',
    marginBottom: 20,
  },
  endCallButton: {
    backgroundColor: '#944138',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  endCallButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
});
