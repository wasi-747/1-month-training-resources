/**
 * ==============================================================================================
 * 📱 ToLetNest — Native Full-Stack Mobile Client (Expo SDK 57)
 * ==============================================================================================
 * Native GPS Hardware Integration + Web GIS Engine:
 * - Direct Hardware GPS via expo-location (High Accuracy)
 * - Automatic Location Permission Request on Android & iOS
 * - 2-Way Native-to-WebView GPS Bridge
 * - Full Leaflet Dhaka Street Maps & Satellite Tiles
 * - Interactive Foodpanda Center Pin-Drop & Reverse Geocoding
 * ==============================================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

// Production 24/7 Global HTTPS Cloud Endpoint (Vercel + MongoDB Atlas)
const DEV_SERVER_URL = 'https://tolet-nest.vercel.app';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const webViewRef = useRef(null);

  // Request Native Device GPS Permission on startup with ultra-fast cached + balanced fix
  const requestNativeGPS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        // 1. Instant Cached Location (0.01 sec response)
        const cached = await Location.getLastKnownPositionAsync();
        if (cached && cached.coords) {
          const { latitude, longitude } = cached.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
              if (typeof window.handleNativeGPSUpdate === 'function') {
                window.handleNativeGPSUpdate(${latitude}, ${longitude});
              }
              true;
            `);
          }
        }

        // 2. Fresh Balanced Fix (3.5s timeout race so it never hangs)
        try {
          const fresh = await Promise.race([
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('GPS Timeout')), 3500)),
          ]);

          if (fresh && fresh.coords) {
            const { latitude, longitude } = fresh.coords;
            setUserCoords({ lat: latitude, lng: longitude });
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(`
                if (typeof window.handleNativeGPSUpdate === 'function') {
                  window.handleNativeGPSUpdate(${latitude}, ${longitude});
                }
                true;
              `);
            }
            return { lat: latitude, lng: longitude };
          }
        } catch (timeoutErr) {
          // Timeout reached, used cached position
        }

        if (cached && cached.coords) {
          return { lat: cached.coords.latitude, lng: cached.coords.longitude };
        }
      }
    } catch (e) {
      console.warn('Native GPS request error:', e);
    }

    // Safety: Clear detecting state in WebView if GPS unavailable
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof window.handleNativeGPSFail === 'function') {
          window.handleNativeGPSFail();
        }
        true;
      `);
    }
    return null;
  };

  useEffect(() => {
    requestNativeGPS();
  }, []);

  // Handle messages from the Web app inside the WebView
  const handleWebMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'GET_LIVE_GPS') {
        await requestNativeGPS();
      }
    } catch (err) {
      console.warn('Webview message error:', err);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#14120f" />

      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ uri: DEV_SERVER_URL }}
          style={styles.webView}
          originWhitelist={['*']}
          mixedContentMode="always"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState={true}
          onMessage={handleWebMessage}
          onLoadEnd={() => {
            setIsLoading(false);
            // Send initial GPS after page load
            if (userCoords) {
              webViewRef.current?.injectJavaScript(`
                if (typeof window.handleNativeGPSUpdate === 'function') {
                  window.handleNativeGPSUpdate(${userCoords.lat}, ${userCoords.lng});
                }
                true;
              `);
            } else {
              requestNativeGPS();
            }
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <View style={styles.logoCircle}>
                <Text style={{ fontSize: 32 }}>🏛️</Text>
              </View>
              <Text style={styles.logoText}>
                ToLet<Text style={{ color: '#c9722d' }}>Nest</Text>
              </Text>
              <Text style={styles.loadingSubtitle}>
                Calibrating GPS & Dhaka Street Engine...
              </Text>
              <ActivityIndicator size="large" color="#c9722d" style={{ marginTop: 20 }} />
            </View>
          )}
          onError={() => setHasError(true)}
          onHttpError={() => setHasError(true)}
        />

        {/* Offline / Reconnect Fallback */}
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={{ fontSize: 36 }}>📡</Text>
            <Text style={styles.errorTitle}>Connection Failed</Text>
            <Text style={styles.errorText}>
              Ensure your phone and PC are on the same Wi-Fi and Next.js is running at {DEV_SERVER_URL}.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>🔄 Reconnect</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#14120f',
  },
  container: {
    flex: 1,
    backgroundColor: '#14120f',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  },
  webView: {
    flex: 1,
    backgroundColor: '#14120f',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#14120f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 100,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1a1714',
    borderWidth: 2,
    borderColor: '#c9722d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: '#b3aba2',
    marginTop: 6,
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#14120f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    zIndex: 200,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#7d756c',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#c9722d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
});
