'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  MessageSquare,
  Bookmark,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Shield,
  SlidersHorizontal,
  ArrowLeft,
  Send,
  Check,
  X,
  Share2,
  Info,
  MapPin,
  Flame,
  Zap,
  Droplet,
  Wifi,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Plus,
  Users,
  GraduationCap,
  Home,
  Building,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  ChevronDown,
  Route,
  Crosshair,
  ExternalLink,
  Heart,
  User,
  Settings,
  ChevronRight,
  FileText,
  CheckCircle2,
  Bell,
  Trash2,
  LogOut,
  LogIn,
  Lock,
  UserPlus,
} from 'lucide-react';
import { mockStore } from '../../lib/mockStore';
import RealDhakaStreetLeafletMap, { DHAKA_UNIVERSITIES } from './RealDhakaStreetLeafletMap';
import {
  DHAKA_COMPREHENSIVE_LANDMARKS,
  searchDhakaLandmarks,
  findClosestDhakaLandmark,
} from '../data/dhakaLandmarks';
import { searchRealtimePlaces } from '../../lib/osmGeocoding';

// Web Audio API Ringtone & Call Audio Synthesizer
let audioStopFn = null;

function playAudioTone(type = 'ringing') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'ringing') {
      let isRinging = true;
      const ringCycle = () => {
        if (!isRinging || ctx.state === 'closed') return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.value = 440; // Standard US/UK ringback
        osc2.frequency.value = 480;
        gain.gain.value = 0.05;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch (e) {}
        }, 1200);
      };

      ringCycle();
      const ringInterval = setInterval(ringCycle, 3000);

      audioStopFn = () => {
        isRinging = false;
        clearInterval(ringInterval);
        try {
          ctx.close();
        } catch (e) {}
      };
    } else if (type === 'connected') {
      if (audioStopFn) {
        audioStopFn();
        audioStopFn = null;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'ended') {
      if (audioStopFn) {
        audioStopFn();
        audioStopFn = null;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    console.warn('AudioContext error:', err);
  }
}

// Haversine distance calculator
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const DHAKA_PRESETS = [
  { id: 'techdojo', name: '🏢 TechDojo HQ (Uttara Road 6)', lat: 23.8638, lng: 90.4005 },
  { id: 'saidnagar', name: '🏠 My Home (Saidnagar 100ft)', lat: 23.7995, lng: 90.4420 },
  { id: 'bashundhara', name: '🎓 Bashundhara R/A (NSU/IUB)', lat: 23.8165, lng: 90.4285 },
  { id: 'badda', name: 'Middle Badda (BRAC Campus)', lat: 23.7745, lng: 90.4258 },
  { id: 'aftabnagar', name: 'Aftabnagar (East West)', lat: 23.7680, lng: 90.4350 },
  { id: 'gulshan', name: 'Gulshan 1 Circle', lat: 23.7808, lng: 90.4152 },
  { id: 'dhanmondi', name: 'Dhanmondi 27 (Star Kabab)', lat: 23.7538, lng: 90.3742 },
  { id: 'mirpur', name: 'Mirpur 10 Metro Pillar 240', lat: 23.8071, lng: 90.3685 },
];

export default function MobileAppSimulator({ listings, onRefresh, isNativeMobile = false }) {
  // Mobile Simulator State
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'explore' | 'post' | 'messages' | 'saved'
  const [selectedListing, setSelectedListing] = useState(null);
  const [savedListingIds, setSavedListingIds] = useState(['listing-1']);
  const [myListingIds, setMyListingIds] = useState(['listing-1', 'listing-2']);
  const [profileSubView, setProfileSubView] = useState('main'); // 'main' | 'my_listings' | 'saved'
  const [listingFilterType, setListingFilterType] = useState('available'); // 'available' | 'looking'

  // 🔐 Authentication State (Login & Registration Flow)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Wasiur Rahman',
    phone: '01700-123456',
    email: 'wasiur@techdojo.dev',
    role: 'tenant', // 'tenant' | 'landlord'
    profession: 'Tech Trainee • TechDojo HQ (Road 6, Uttara)',
    avatar: 'W',
    verified: true,
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authFormData, setAuthFormData] = useState({
    phone: '',
    password: '',
    name: '',
  });

  const handleDemoLogin = (profile) => {
    setCurrentUser(profile);
    setIsLoggedIn(true);
    triggerToast(`👋 স্বাগতম, ${profile.name}! আপনি সফলভাবে সাইন ইন হয়েছেন।`, 'success');
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!authFormData.phone) {
      triggerToast('ইমেইল বা মোবাইল নম্বর লিখুন', 'error');
      return;
    }
    const enteredName = authFormData.name || (authMode === 'register' ? 'New Member' : 'Wasiur Rahman');
    const profile = {
      name: enteredName,
      phone: authFormData.phone,
      email: authFormData.phone.includes('@') ? authFormData.phone : `${authFormData.phone}@toletnest.bd`,
      profession: 'সদস্য • ToLetNest কমিউনিটি',
      avatar: enteredName[0].toUpperCase(),
      verified: true,
    };
    setCurrentUser(profile);
    setIsLoggedIn(true);
    triggerToast(`🎉 স্বাগতম, ${profile.name}! সফলভাবে লগইন সম্পন্ন হয়েছে।`, 'success');
  };

  const handleLogout = () => {
    showInAppConfirm({
      title: 'সাইন আউট নিশ্চিতকরণ',
      message: 'আপনি কি আপনার ToLetNest অ্যাকাউন্ট থেকে লগআউট করতে চান?',
      icon: '🚪',
      confirmText: 'হ্যাঁ, লগআউট করুন',
      confirmColor: '#ef4444',
      onConfirm: () => {
        setIsLoggedIn(false);
        setProfileSubView('main');
        triggerToast('👋 আপনি সফলভাবে সাইন আউট হয়েছেন। লগইন পেজে স্বাগতম!', 'info');
      },
    });
  };

  // 🔔 In-App Toast Notification & Modal System (Zero ugly browser popups!)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    icon: '⚠️',
    confirmText: 'নিশ্চিত করুন',
    cancelText: 'বাতিল',
    confirmColor: '#ef4444',
    onConfirm: null,
  });

  const triggerToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    if (typeof window !== 'undefined') {
      if (window._toastTimer) clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3500);
    }
  };

  const showInAppConfirm = ({
    title,
    message,
    icon = '⚠️',
    confirmText = 'নিশ্চিত করুন',
    cancelText = 'বাতিল',
    confirmColor = '#ef4444',
    onConfirm,
  }) => {
    setConfirmModal({
      visible: true,
      title,
      message,
      icon,
      confirmText,
      cancelText,
      confirmColor,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
    });
  };

  // Mobile Fast Posting State (P2P Student Sublet / Seat / Landlord)
  const [mobilePostData, setMobilePostData] = useState({
    posterRole: 'landlord', // 'landlord' | 'flatmate' | 'student_outgoing' | 'sublet_host'
    title: '',
    area: 'Uttara',
    addressText: 'House 14, Road 6, Sector 4, Uttara',
    locationName: 'House 14, Road 6, Sector 4, Uttara',
    lat: 23.8638,
    lng: 90.4005,
    rentAmount: '',
    utilityAmount: '800',
    tenantType: 'bachelor_male',
    propertyType: 'seat_rent',
    rentalCategory: 'seat',
    amenities: ['wifi', 'gas'],
    posterName: 'Wasiur Rahman (Host)',
    phone: '01700-123456',
  });
  const [isPostingFromMobile, setIsPostingFromMobile] = useState(false);

  // Real GPS & Simulated Location State
  const [userLocation, setUserLocation] = useState({
    name: 'Bashundhara R/A (NSU)',
    lat: 23.8165,
    lng: 90.4285,
    isLiveGPS: false,
    isDetecting: false,
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Interactive Live Map & Radar State
  const [mapZoom, setMapZoom] = useState(1); // 0.5 (wide zoom out 5km) to 2.0 (hyper-local 500m)
  const [mapMode, setMapMode] = useState('radar'); // 'radar' | 'street'
  const [selectedMapListing, setSelectedMapListing] = useState(null);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0 });

  // Map Coordinate Projection relative to userLocation + Panning Offset
  const calculatePinPosition = (coords) => {
    if (!coords || coords.length < 2) return { x: 50, y: 50, isVisible: false };
    const [lng, lat] = coords;
    const dLng = lng - userLocation.lng;
    const dLat = lat - userLocation.lat;

    // Scale coordinates relative to zoom level and add pan offset
    const scale = 2200 * mapZoom;
    const x = 50 + dLng * scale + mapPan.x / 2.6;
    const y = 50 - dLat * scale + mapPan.y / 2.0;

    const isVisible = x >= -10 && x <= 110 && y >= -10 && y <= 110;

    return { x, y, isVisible };
  };

  // Drag & Pan Handlers for Desktop Mouse & Mobile Touch
  const handleMapMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.map-interactive-target')) return;
    setIsDraggingMap(true);
    dragStartRef.current = { x: e.clientX - mapPan.x, y: e.clientY - mapPan.y };
  };

  const handleMapMouseMove = (e) => {
    if (!isDraggingMap) return;
    setMapPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMapMouseUp = () => {
    setIsDraggingMap(false);
  };

  const handleMapTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('.map-interactive-target')) return;
    if (e.touches && e.touches.length === 1) {
      setIsDraggingMap(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - mapPan.x,
        y: e.touches[0].clientY - mapPan.y,
      };
    }
  };

  const handleMapTouchMove = (e) => {
    if (!isDraggingMap || !e.touches || e.touches.length !== 1) return;
    setMapPan({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleMapTouchEnd = () => {
    setIsDraggingMap(false);
  };

  // Mouse Wheel Smooth Zoom In / Out with 100% Scroll Lock on Parent Container
  const mapContainerRef = React.useRef(null);

  const handleNonPassiveWheel = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const zoomStep = 0.15;
    if (e.deltaY < 0) {
      // Scroll Up -> Zoom In
      setMapZoom((prev) => Math.min(2.5, Number((prev + zoomStep).toFixed(2))));
    } else {
      // Scroll Down -> Zoom Out
      setMapZoom((prev) => Math.max(0.4, Number((prev - zoomStep).toFixed(2))));
    }
  }, []);

  const setMapContainerRef = React.useCallback((node) => {
    if (mapContainerRef.current) {
      mapContainerRef.current.removeEventListener('wheel', handleNonPassiveWheel);
    }
    if (node) {
      mapContainerRef.current = node;
      node.addEventListener('wheel', handleNonPassiveWheel, { passive: false });
    }
  }, [handleNonPassiveWheel]);

  // Handle Native GPS Coordinates from Expo Native Bridge
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.handleNativeGPSUpdate = (lat, lng) => {
        const nearest = findClosestDhakaLandmark(lat, lng);
        const name = nearest ? `Live GPS • Near ${nearest.name}` : `Live GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
        setUserLocation({
          name,
          lat,
          lng,
          isLiveGPS: true,
          isDetecting: false,
        });
        setMapFlyTarget({ lat, lng, timestamp: Date.now() });
      };

      window.handleNativeGPSFail = () => {
        setUserLocation((prev) => ({ ...prev, isDetecting: false }));
      };
    }
  }, []);

  // Auto-Detect Real Device GPS (Native Expo + Browser Fallback)
  const detectLiveGPS = () => {
    setUserLocation((prev) => ({ ...prev, isDetecting: true }));

    // Safety fallback: Never stay stuck in "detecting..." for more than 3.5s
    setTimeout(() => {
      setUserLocation((prev) => (prev.isDetecting ? { ...prev, isDetecting: false } : prev));
    }, 3500);

    // 1. If running inside Expo React Native WebView: trigger native hardware GPS
    if (typeof window !== 'undefined' && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'GET_LIVE_GPS' }));
      return;
    }

    // 2. Standard Browser / PWA Geolocation fallback
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const nearest = findClosestDhakaLandmark(lat, lng);
          const name = nearest ? `Live GPS • Near ${nearest.name}` : `Live GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
          setUserLocation({
            name,
            lat,
            lng,
            isLiveGPS: true,
            isDetecting: false,
          });
          setMapFlyTarget({ lat, lng, timestamp: Date.now() });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setUserLocation((prev) => ({ ...prev, isDetecting: false }));
        },
        { enableHighAccuracy: true, timeout: 3500 }
      );
    } else {
      setUserLocation((prev) => ({ ...prev, isDetecting: false }));
    }
  };

  // 🔍 Google Maps Style Realtime Search Engine State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [realtimePlaceResults, setRealtimePlaceResults] = useState([]);
  const [isSearchingLivePlaces, setIsSearchingLivePlaces] = useState(false);

  // Debounced Live Search for Places, OSM Geocoding & Local Landmarks
  useEffect(() => {
    const cleanQ = (searchQuery || '').trim();
    if (!cleanQ) {
      setRealtimePlaceResults([]);
      setIsSearchingLivePlaces(false);
      return;
    }

    // 1. Instant local landmark match (0ms response)
    const localMatches = searchDhakaLandmarks(cleanQ).slice(0, 5).map((lm) => ({
      id: lm.id,
      shortName: lm.shortName || lm.name,
      name: lm.name,
      area: lm.area || lm.subtitle,
      lat: lm.lat,
      lng: lm.lng,
      categoryLabel: lm.categoryLabel || '📍 Location',
      isLocal: true,
    }));

    setRealtimePlaceResults(localMatches);

    // 2. Debounced OSM Nominatim Geocoding API lookup (300ms)
    setIsSearchingLivePlaces(true);
    const timeoutId = setTimeout(async () => {
      try {
        const osmResults = await searchRealtimePlaces(cleanQ);
        const existingNames = new Set(localMatches.map((m) => m.shortName.toLowerCase()));
        const uniqueOSM = osmResults.filter((o) => !existingNames.has(o.shortName.toLowerCase()));
        
        setRealtimePlaceResults([...localMatches, ...uniqueOSM.slice(0, 6)]);
      } catch (err) {
        console.warn('Live search error:', err);
      } finally {
        setIsSearchingLivePlaces(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelectSearchedPlace = (place) => {
    setUserLocation({
      name: place.shortName || place.name,
      lat: place.lat,
      lng: place.lng,
      isLiveGPS: false,
      isDetecting: false,
    });
    setIsSearchOverlayOpen(false);
    setActiveTab('radar');
  };

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'seat' | 'room' | 'dining_space' | 'sublet' | 'full_flat'
  const [selectedTenantType, setSelectedTenantType] = useState('all');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [maxRent, setMaxRent] = useState(30000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Tenant / Flatmate Seeker Request Post State
  const [tenantNeedData, setTenantNeedData] = useState({
    title: '',
    userProfession: 'student', // 'student' | 'job_holder' | 'intern'
    budgetMax: 4500,
    preferredArea: 'Uttara',
    locationName: 'Road 6, Sector 4, Uttara (Near TechDojo)',
    lat: 23.8638,
    lng: 90.4005,
    needType: 'seat', // 'seat' | 'room' | 'sublet' | 'flat'
    moveInDate: '2026-09-01',
    mealPreference: 'meal_system', // 'meal_system' | 'self_cooking' | 'outside'
    isNonSmoker: true,
    userName: 'Wasiur Rahman',
    userPhone: '01700-123456',
    allowInAppCall: true,
    details: '',
  });

  // 🗺️ Interactive Post Map Location Picker (Pin-Drop on Street Map)
  const [showPostLocationPicker, setShowPostLocationPicker] = useState(false);
  const [postPickerTarget, setPostPickerTarget] = useState('landlord'); // 'landlord' | 'flatmate'
  const [postPickerSearchQuery, setPostPickerSearchQuery] = useState('');
  const [postPickerFlyTarget, setPostPickerFlyTarget] = useState(null);
  const [postPickerPinned, setPostPickerPinned] = useState({
    name: 'House 14, Road 6, Sector 4, Uttara',
    area: 'Uttara',
    lat: 23.8638,
    lng: 90.4005,
    customBuilding: '',
  });



  // 📍 Location & Hyperlocal Search Engine (Foodpanda / Pathao Style)
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationModalView, setLocationModalView] = useState('saved_list'); // 'saved_list' | 'search_screen'
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationCategoryFilter, setLocationCategoryFilter] = useState('all'); // 'all' | 'campus' | 'mall' | 'food' | 'landmark' | 'zone'
  const [nominatimResults, setNominatimResults] = useState([]);
  const [isNominatimLoading, setIsNominatimLoading] = useState(false);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState(3.5); // 0.8 | 2.0 | 3.5 | 999
  const [activeRouteListing, setActiveRouteListing] = useState(null);

  // User's Saved Addresses List (Matching Foodpanda Screenshot)
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 'saved-1',
      title: 'Shah manjil, Sayeed nagar boro masjid opposite road',
      subtitle: 'Dhaka',
      lat: 23.7995,
      lng: 90.4420,
    },
    {
      id: 'saved-2',
      title: 'Mohanagar Road No 6',
      subtitle: 'Dhaka',
      lat: 23.7650,
      lng: 90.4180,
    },
    {
      id: 'saved-3',
      title: 'Shah manjil',
      subtitle: 'Dhaka',
      lat: 23.7992,
      lng: 90.4418,
    },
    {
      id: 'saved-4',
      title: 'Boro masjid road',
      subtitle: 'Dhaka',
      lat: 23.7812,
      lng: 90.4260,
    },
    {
      id: 'saved-5',
      title: '100 feet road Madani Ave',
      subtitle: 'Dhaka',
      lat: 23.7965,
      lng: 90.4410,
    },
    {
      id: 'saved-6',
      title: 'shah manjil, khan dental clinic, darus salam masjid',
      subtitle: 'Dhaka',
      lat: 23.8001,
      lng: 90.4425,
    },
    {
      id: 'saved-7',
      title: 'Home',
      subtitle: 'Opposite of Khan dental clinic, near darus salam masjid, Dhaka',
      lat: 23.8001,
      lng: 90.4425,
    },
    {
      id: 'saved-8',
      title: 'North South University (NSU Gate 2)',
      subtitle: 'Plot 15, Block B, Bashundhara R/A, Dhaka',
      lat: 23.8165,
      lng: 90.4285,
    },
    {
      id: 'saved-9',
      title: 'BRAC University (New Campus)',
      subtitle: 'Kha 224, Merul Badda, Dhaka',
      lat: 23.7745,
      lng: 90.4258,
    },
  ]);

  // 🎯 Interactive Pin-Drop Map State (Foodpanda / Pathao Live Map Movement)
  const [pinnedLocation, setPinnedLocation] = useState({
    name: 'Bashundhara R/A (NSU)',
    area: 'Bashundhara, Dhaka',
    lat: 23.8165,
    lng: 90.4285,
    customBuilding: '',
    tag: 'Home',
  });
  const [mapFlyTarget, setMapFlyTarget] = useState(null);
  const [isPinGeocoding, setIsPinGeocoding] = useState(false);
  const reverseGeocodeTimeoutRef = React.useRef(null);

  // Sync pinnedLocation whenever modal opens or userLocation changes
  useEffect(() => {
    if (userLocation) {
      setPinnedLocation({
        name: userLocation.name,
        area: 'Dhaka',
        lat: userLocation.lat,
        lng: userLocation.lng,
        customBuilding: '',
        tag: 'Home',
      });
    }
  }, [userLocation?.lat, userLocation?.lng, showLocationModal]);

  // Real-Time Pin Drag & Reverse Landmark Lookup Handler (0ms instant local + 250ms OSM reverse fallback)
  const handleMapCenterChange = ({ lat, lng, isDragging }) => {
    // 1. Instant local landmark lookup (0ms latency for known hubs like Apollo, JFP, Kuril, Saidnagar, NSU, Savar, Ashulia, JU, DIU, etc.)
    const closestLandmark = findClosestDhakaLandmark(lat, lng);
    const landmarkName =
      closestLandmark && closestLandmark.distanceMeters < 700
        ? closestLandmark.distanceMeters < 120
          ? closestLandmark.name
          : `Near ${closestLandmark.shortName || closestLandmark.name}`
        : null;

    setPinnedLocation((prev) => ({
      ...prev,
      lat,
      lng,
      name:
        landmarkName ||
        (isDragging ? `Panned Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` : prev.name.startsWith('Panned') || prev.name.startsWith('Near') ? `Panned Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` : prev.name),
      area: closestLandmark?.area ? `${closestLandmark.area}, Dhaka` : 'Greater Dhaka',
    }));

    // 2. Debounced reverse geocoding to OpenStreetMap Nominatim when user stops dragging
    if (!isDragging) {
      if (reverseGeocodeTimeoutRef.current) {
        clearTimeout(reverseGeocodeTimeoutRef.current);
      }
      reverseGeocodeTimeoutRef.current = setTimeout(async () => {
        try {
          setIsPinGeocoding(true);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const roadOrPlace =
              data.address?.road ||
              data.address?.neighbourhood ||
              data.address?.suburb ||
              data.address?.village ||
              data.address?.town ||
              data.address?.municipality ||
              data.address?.residential ||
              data.display_name?.split(',')[0];
            const area =
              data.address?.village ||
              data.address?.town ||
              data.address?.suburb ||
              data.address?.city_district ||
              data.address?.county ||
              data.address?.city ||
              'Dhaka';

            setPinnedLocation((prev) => ({
              ...prev,
              // If local landmark was found closeby (<700m), keep landmarkName, otherwise use exact OSM road/place
              name: landmarkName || roadOrPlace || `Pinned (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              area: area.toLowerCase().includes('dhaka') ? area : `${area}, Dhaka`,
            }));
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        } finally {
          setIsPinGeocoding(false);
        }
      }, 250);
    }
  };

  // Live Geocoding Search Debounce for any road/place in Dhaka
  useEffect(() => {
    if (!locationSearchQuery || locationSearchQuery.trim().length < 3) {
      setNominatimResults([]);
      setIsNominatimLoading(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setIsNominatimLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationSearchQuery + ', Dhaka, Bangladesh'
          )}&limit=5&countrycodes=bd`
        );
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item, idx) => ({
            id: `osm-${item.place_id || idx}`,
            name: item.display_name.split(',')[0],
            shortName: item.display_name.split(',')[0],
            area: item.display_name.split(',').slice(1, 3).join(', ').trim() || 'Dhaka',
            category: 'landmark',
            categoryLabel: '🌐 Live Dhaka Map Search',
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            subtitle: item.display_name,
            icon: '📍',
          }));
          setNominatimResults(mapped);
        }
      } catch (err) {
        console.warn('Nominatim search error:', err);
      } finally {
        setIsNominatimLoading(false);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [locationSearchQuery]);

  // Chat & Call State
  const [activeChatListing, setActiveChatListing] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [isChatClosed, setIsChatClosed] = useState({});

  // Active Audio Call Simulator State
  const [activeCall, setActiveCall] = useState(null);

  // Seed initial chat
  useEffect(() => {
    setChatMessages({
      'listing-1': [
        { id: 1, sender: 'system', text: '🔒 Privacy Shield Active: In-app communication channel. Personal SIM number masked.' },
        { id: 2, sender: 'tenant', text: 'Assalamu Alaikum Uncle, is the master bed room available for September?' },
        { id: 3, sender: 'landlord', text: 'Walaikum Assalam. Yes Baba, it is available. Are you studying at NSU?' },
      ],
    });
  }, []);

  // Call duration counter
  useEffect(() => {
    let timer;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  const activeDataSource = (listings && listings.length > 0) ? listings : mockStore.getListings({});

  // Dynamically compute distances based on active userLocation (Real GPS or Selected Dhaka Hub)
  const listingsWithDistance = activeDataSource.map((item) => {
    let distanceKm = 0.5;
    if (item.location && item.location.coordinates) {
      const [lng, lat] = item.location.coordinates;
      distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, lat, lng);
    }
    const distanceStr =
      distanceKm < 1
        ? `${Math.round(distanceKm * 1000)}m away`
        : `${distanceKm.toFixed(1)} km away`;

    return {
      ...item,
      distanceKm,
      distanceStr,
    };
  });

  // Filtering Logic
  const filteredListings = listingsWithDistance.filter((item) => {
    // Proximity Radius filter relative to selected location / campus
    if (selectedRadiusKm < 999 && (item.distanceKm || 0) > selectedRadiusKm) {
      return false;
    }


    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.addressText.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== 'all') {
      const pType = item.propertyType || '';
      const rCat = item.rentalCategory || '';
      if (selectedCategory === 'seat' && pType !== 'seat_rent' && pType !== 'shared_seat' && rCat !== 'seat') return false;
      if (selectedCategory === 'dining_space' && pType !== 'dining_space' && rCat !== 'dining_space') return false;
      if (selectedCategory === 'sublet' && pType !== 'sublet' && rCat !== 'sublet') return false;
      if (selectedCategory === 'full_flat' && pType !== 'full_flat' && rCat !== 'full_flat') return false;
      if (selectedCategory === 'room' && !['room_rent', 'single_room', 'master_bed'].includes(pType) && rCat !== 'room') return false;
    }

    if (selectedTenantType !== 'all' && item.tenantType !== selectedTenantType && item.tenantType !== 'any') {
      return false;
    }

    if (selectedRoomType !== 'all' && item.propertyType !== selectedRoomType) {
      return false;
    }

    if (item.rentAmount > maxRent) return false;

    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every((a) => item.amenities.includes(a));
      if (!hasAll) return false;
    }

    return true;
  });

  const nearbyListings = [...listingsWithDistance].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    setSavedListingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartCall = (listing) => {
    playAudioTone('ringing');
    setActiveCall({
      listing,
      status: 'ringing',
      duration: 0,
      isMuted: false,
    });

    setTimeout(() => {
      playAudioTone('connected');
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2500);
  };

  const handleEndCall = () => {
    playAudioTone('ended');
    if (activeCall) {
      const duration = activeCall.duration;
      const listingId = activeCall.listing._id;

      const logMsg = {
        id: Date.now(),
        sender: 'system',
        text: `📞 In-App Voice Call Ended (${duration > 0 ? `${duration}s` : 'Missed'}) • Phone Number Masked`,
      };

      setChatMessages((prev) => ({
        ...prev,
        [listingId]: [...(prev[listingId] || []), logMsg],
      }));
    }
    setActiveCall(null);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChatListing) return;
    const listingId = activeChatListing._id;

    if (isChatClosed[listingId]) {
      triggerToast('এই কথোপকথনটি বন্ধ রয়েছে।', 'error');
      return;
    }

    const newMsg = {
      id: Date.now(),
      sender: 'tenant',
      text: messageInput.trim(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [listingId]: [...(prev[listingId] || []), newMsg],
    }));

    setMessageInput('');

    setTimeout(() => {
      setChatMessages((prev) => ({
        ...prev,
        [listingId]: [
          ...(prev[listingId] || []),
          {
            id: Date.now() + 1,
            sender: 'landlord',
            text: 'Noted Baba. Feel free to visit tomorrow afternoon.',
          },
        ],
      }));
    }, 1500);
  };

  const handleCloseChat = (listingId) => {
    showInAppConfirm({
      title: 'চ্যাট ও যোগাযোগ বন্ধ করবেন?',
      message: 'চ্যাট ক্লোজ করলে ল্যান্ডলর্ড আর আপনাকে মেসেজ বা ইন-অ্যাপ কল দিতে পারবে না।',
      icon: '🛑',
      confirmText: 'হ্যাঁ, চ্যাট বন্ধ করুন',
      confirmColor: '#ef4444',
      onConfirm: () => {
        setIsChatClosed((prev) => ({ ...prev, [listingId]: true }));
        setChatMessages((prev) => ({
          ...prev,
          [listingId]: [
            ...(prev[listingId] || []),
            {
              id: Date.now(),
              sender: 'system',
              text: '🛑 Negotiation Ended: Chat closed by Tenant. Landlord communication blocked.',
            },
          ],
        }));
        triggerToast('🛑 চ্যাট সফলভাবে ক্লোজ করা হয়েছে।', 'info');
      },
    });
  };

  // 🗺️ Post Location Picker Handlers
  const handleOpenPostPicker = (target = 'landlord') => {
    setPostPickerTarget(target);
    const curLat = target === 'landlord' ? (mobilePostData.lat || 23.8638) : (tenantNeedData.lat || 23.8638);
    const curLng = target === 'landlord' ? (mobilePostData.lng || 90.4005) : (tenantNeedData.lng || 90.4005);
    const curName = target === 'landlord' ? (mobilePostData.locationName || 'House 14, Road 6, Sector 4, Uttara') : (tenantNeedData.locationName || 'Road 6, Sector 4, Uttara');
    const curArea = target === 'landlord' ? (mobilePostData.area || 'Uttara') : (tenantNeedData.preferredArea || 'Uttara');

    setPostPickerPinned({
      name: curName,
      area: curArea,
      lat: curLat,
      lng: curLng,
      customBuilding: '',
    });
    setPostPickerFlyTarget({ lat: curLat, lng: curLng, timestamp: Date.now() });
    setShowPostLocationPicker(true);
  };

  const handlePostPickerMapCenterChange = (center) => {
    if (!center || !center.lat || !center.lng) return;
    const nearest = findClosestDhakaLandmark(center.lat, center.lng);
    const fallbackTitle = nearest
      ? `${nearest.name} (${nearest.area})`
      : `Map Point (${center.lat.toFixed(4)}, ${center.lng.toFixed(4)})`;

    setPostPickerPinned((prev) => ({
      ...prev,
      name: fallbackTitle,
      area: nearest?.area || prev.area || 'Uttara',
      lat: center.lat,
      lng: center.lng,
    }));
  };

  const handleSelectPostPickerPreset = (landmark) => {
    setPostPickerPinned({
      name: landmark.name,
      area: landmark.area || landmark.subtitle || 'Dhaka',
      lat: landmark.lat,
      lng: landmark.lng,
      customBuilding: '',
    });
    setPostPickerFlyTarget({ lat: landmark.lat, lng: landmark.lng, timestamp: Date.now() });
  };

  const handleConfirmPostLocation = () => {
    const fullAddress = postPickerPinned.customBuilding
      ? `${postPickerPinned.name} (${postPickerPinned.customBuilding})`
      : postPickerPinned.name;

    if (postPickerTarget === 'landlord') {
      setMobilePostData((prev) => ({
        ...prev,
        lat: postPickerPinned.lat,
        lng: postPickerPinned.lng,
        area: postPickerPinned.area || prev.area,
        locationName: fullAddress,
        addressText: fullAddress,
      }));
    } else {
      setTenantNeedData((prev) => ({
        ...prev,
        lat: postPickerPinned.lat,
        lng: postPickerPinned.lng,
        preferredArea: postPickerPinned.area || prev.preferredArea,
        locationName: fullAddress,
      }));
    }
    setShowPostLocationPicker(false);
  };

  // Fast Mobile Post Handler (For Students, Flatmates & Landlords)
  const handleMobileSubmitPost = async (e) => {
    e.preventDefault();
    if (!mobilePostData.title || !mobilePostData.rentAmount) {
      triggerToast('বিজ্ঞাপনের শিরোনাম ও মাসিক ভাড়া লিখুন', 'error');
      return;
    }
    setIsPostingFromMobile(true);
    try {
      const payload = {
        title: mobilePostData.title,
        description: `Posted via Mobile by ${
          mobilePostData.posterRole === 'student_outgoing'
            ? 'Outgoing Student (Seat Transfer)'
            : mobilePostData.posterRole === 'flatmate'
            ? 'Bachelor Flatmate (Roommate Wanted)'
            : mobilePostData.posterRole === 'sublet_host'
            ? 'Sublet Host'
            : 'Landlord'
        }. In-app private communication only.`,
        rentAmount: Number(mobilePostData.rentAmount),
        area: mobilePostData.area,
        addressText: mobilePostData.addressText || mobilePostData.locationName || `${mobilePostData.area}, Dhaka`,
        location: {
          type: 'Point',
          coordinates: [
            Number(mobilePostData.lng) || 90.4005,
            Number(mobilePostData.lat) || 23.8638,
          ],
        },
        propertyType: mobilePostData.propertyType,
        tenantType: mobilePostData.tenantType,
        rentalCategory: mobilePostData.rentalCategory || 'room',
        utilityInfo: {
          mode: 'itemized',
          totalUtility: Number(mobilePostData.utilityAmount) || 0,
          breakdown: {
            electricity: Math.round((Number(mobilePostData.utilityAmount) || 0) * 0.4),
            gas: Math.round((Number(mobilePostData.utilityAmount) || 0) * 0.2),
            water: Math.round((Number(mobilePostData.utilityAmount) || 0) * 0.15),
            serviceCharge: Math.round((Number(mobilePostData.utilityAmount) || 0) * 0.15),
            wifi: Math.round((Number(mobilePostData.utilityAmount) || 0) * 0.1),
            waste: 0,
          },
        },
        amenities: mobilePostData.amenities,
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        ],
        landlord: {
          name: mobilePostData.posterName || 'Host / Flatmate',
          phone: mobilePostData.phone || '01700-123456',
          showPublicPhone: false,
          allowInAppCall: true,
          allowInAppChat: true,
        },
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        const createdItem = created.data || payload;
        setListings((prev) => [createdItem, ...prev]);
        if (createdItem._id) {
          setMyListingIds((prev) => [createdItem._id, ...prev]);
        }
        triggerToast('🎉 আপনার To-Let বিজ্ঞাপন ম্যাপের সঠিক লোকেশনে সফলভাবে পোস্ট হয়েছে!', 'success');
        if (onRefresh) onRefresh();
        setUserLocation({
          name: payload.addressText,
          lat: Number(mobilePostData.lat) || 23.8638,
          lng: Number(mobilePostData.lng) || 90.4005,
          isLiveGPS: false,
          isDetecting: false,
        });
        setActiveTab('radar');
        setMobilePostData({
          posterRole: 'landlord',
          title: '',
          area: 'Uttara',
          addressText: 'House 14, Road 6, Sector 4, Uttara',
          locationName: 'House 14, Road 6, Sector 4, Uttara',
          lat: 23.8638,
          lng: 90.4005,
          rentAmount: '',
          utilityAmount: '800',
          tenantType: 'bachelor_male',
          propertyType: 'seat_rent',
          rentalCategory: 'seat',
          amenities: ['wifi', 'gas'],
          posterName: 'Wasiur Rahman',
          phone: '01700-123456',
        });
      } else {
        triggerToast('বিজ্ঞাপন প্রকাশে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('সার্ভার এরর: বিজ্ঞাপন প্রকাশ ব্যর্থ হয়েছে।', 'error');
    } finally {
      setIsPostingFromMobile(false);
    }
  };

  // 👥 Handler for Tenant / Flatmate Seeker Request Post (বাসা দরকার)
  const handleMobileSubmitTenantNeed = (e) => {
    e.preventDefault();
    setIsPostingFromMobile(true);

    const targetLat = Number(tenantNeedData.lat) || 23.8638;
    const targetLng = Number(tenantNeedData.lng) || 90.4005;

    const newTenantNeedListing = {
      _id: `need-${Date.now()}`,
      title:
        tenantNeedData.title ||
        `${tenantNeedData.preferredArea}-তে ১টি ${tenantNeedData.needType === 'seat' ? 'সিট' : 'রুম'} দরকার`,
      description:
        tenantNeedData.details ||
        `পেশা: ${
          tenantNeedData.userProfession === 'student'
            ? 'ছাত্র'
            : tenantNeedData.userProfession === 'intern'
            ? 'আইটি ট্রেইনি'
            : 'চাকরিজীবী'
        }। সর্বোচ্চ বাজেট: ৳${tenantNeedData.budgetMax}। ${
          tenantNeedData.isNonSmoker ? 'অধূমপায়ী মেস পরিবেশ পছন্দ।' : ''
        }`,
      rentAmount: Number(tenantNeedData.budgetMax) || 4000,
      area: tenantNeedData.preferredArea || 'Uttara',
      addressText: `${tenantNeedData.locationName || tenantNeedData.preferredArea}, ঢাকা (খুঁজছেন: ${tenantNeedData.userName})`,
      location: {
        type: 'Point',
        coordinates: [targetLng, targetLat],
      },
      propertyType: tenantNeedData.needType === 'seat' ? 'seat_rent' : 'single_room',
      rentalCategory: tenantNeedData.needType === 'seat' ? 'seat' : 'room',
      quantityAvailable: 1,
      tenantType: 'bachelor_male',
      utilityInfo: {
        mode: 'inclusive',
        totalUtility: 0,
        breakdown: { electricity: 0, gas: 0, water: 0, serviceCharge: 0, wifi: 0, waste: 0 },
      },
      amenities: ['wifi', 'gas', 'meal_system'],
      availableFrom: tenantNeedData.moveInDate,
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      ],
      status: 'available',
      tags: ['roommate_needed'],
      isLookingRequest: true,
      landlord: {
        name: `${tenantNeedData.userName} (Looking for Roommate)`,
        phone: tenantNeedData.userPhone,
        showPublicPhone: false,
        allowInAppCall: true,
        allowInAppChat: true,
      },
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setListings((prev) => [newTenantNeedListing, ...prev]);
      setMyListingIds((prev) => [newTenantNeedListing._id, ...prev]);
      setIsPostingFromMobile(false);
      triggerToast('🎉 আপনার বাসা খোঁজার বিজ্ঞাপন ম্যাপের সঠিক লোকেশনে লাইভ হয়েছে!', 'success');
      setUserLocation({
        name: newTenantNeedListing.addressText,
        lat: targetLat,
        lng: targetLng,
        isLiveGPS: false,
        isDetecting: false,
      });
      setSelectedCategory('all');
      setActiveTab('radar');
    }, 600);
  };

  // 🗑️ Delete Listing Handler (সরাসরি ডিলিট অপশন)
  const handleDeleteListing = (listingId) => {
    showInAppConfirm({
      title: 'বিজ্ঞাপন মুছে ফেলবেন?',
      message: 'আপনি কি নিশ্চিত যে এই বিজ্ঞাপনটি সম্পূর্ণ মুছে ফেলতে চান? এটি ম্যাপ ও ফিড থেকে তৎক্ষণাৎ রিমুভ হয়ে যাবে।',
      icon: '🗑️',
      confirmText: 'হ্যাঁ, মুছে ফেলুন',
      confirmColor: '#ef4444',
      onConfirm: async () => {
        try {
          await fetch(`/api/listings?id=${listingId}`, {
            method: 'DELETE',
          });
        } catch (err) {
          console.warn('Delete fetch warning:', err);
        }
        setListings((prev) => prev.filter((l) => l._id !== listingId));
        setMyListingIds((prev) => prev.filter((id) => id !== listingId));
        triggerToast('🗑️ বিজ্ঞাপনটি সফলভাবে মুছে ফেলা হয়েছে!', 'delete');
      },
    });
  };

  // 🔄 Toggle Status Handler (ভাড়া খালি / ভাড়া সম্পন্ন)
  const handleToggleListingStatus = async (listingId, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'rented' : 'available';
    try {
      await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: listingId, status: nextStatus }),
      });
    } catch (err) {
      console.warn('Status patch warning:', err);
    }
    setListings((prev) =>
      prev.map((l) => (l._id === listingId ? { ...l, status: nextStatus } : l))
    );
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: isNativeMobile ? '100%' : 'auto', height: isNativeMobile ? '100%' : 'auto' }}>
      {/* Smartphone Frame (Warm Charcoal & Espresso Shell on Desktop / Full Screen on Mobile) */}
      <div
        className={isNativeMobile ? 'native-mobile-full-app' : 'smartphone-frame'}
        style={
          isNativeMobile
            ? {
                width: '100vw',
                height: '100vh',
                border: 'none',
                borderRadius: 0,
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background: '#110f0d',
              }
            : undefined
        }
      >
        {/* Top Notch (Only visible on Desktop Mockup) */}
        {!isNativeMobile && (
          <div className="smartphone-notch">
            <div className="smartphone-camera" />
            <div className="smartphone-speaker" />
          </div>
        )}

        {/* Status Bar (Only visible on Desktop Mockup) */}
        {!isNativeMobile && (
          <div
            style={{
              height: '36px',
              padding: '10px 18px 0 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono, monospace',
              zIndex: 40,
            }}
          >
            <span>9:41 AM</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span>5G</span>
              <span>98%</span>
            </div>
          </div>
        )}
        {/* Top BDToLet-Inspired Emerald Brand Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            padding: '12px 14px 14px 14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 16px rgba(5, 150, 105, 0.2)',
            flexShrink: 0,
          }}
        >
          {/* Brand Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                🏛️
              </div>
              <div>
                <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  ToLet<span style={{ color: '#fef08a' }}>Nest</span>
                </h1>
                <div
                  onClick={() => setShowLocationModal(true)}
                  style={{ fontSize: '0.66rem', color: '#d1fae5', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                >
                  <MapPin size={10} style={{ color: '#fef08a' }} />
                  <span style={{ maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userLocation.name}
                  </span>
                  <ChevronDown size={10} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={detectLiveGPS}
                style={{
                  background: userLocation.isLiveGPS ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: userLocation.isLiveGPS ? '#047857' : '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.68rem',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <MapPin size={11} /> {userLocation.isDetecting ? 'Detecting...' : userLocation.isLiveGPS ? 'Live GPS' : 'GPS'}
              </button>
              <button
                onClick={() => setShowLocationModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Compass size={14} />
              </button>
            </div>
          </div>

          {/* Active Google Maps Style Realtime Search Bar Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              onClick={() => setIsSearchOverlayOpen(true)}
              style={{
                flex: 1,
                background: '#ffffff',
                borderRadius: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
                minWidth: 0,
              }}
            >
              <Search size={16} style={{ color: '#059669', flexShrink: 0 }} />
              <span
                style={{
                  fontSize: '0.8rem',
                  color: searchQuery ? '#0f172a' : '#64748b',
                  flex: 1,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {searchQuery || 'এলাকা, মেস, রেস্তোরাঁ (যেমন: KFC, সাঈদনগর)...'}
              </span>
            </div>

            {/* Dedicated Filter Button Next to Search Bar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDrawer(true);
              }}
              style={{
                background:
                  selectedAmenities.length > 0 || maxRent < 30000 || selectedTenantType !== 'all' || selectedCategory !== 'all'
                    ? '#ffffff'
                    : 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                color:
                  selectedAmenities.length > 0 || maxRent < 30000 || selectedTenantType !== 'all' || selectedCategory !== 'all'
                    ? '#047857'
                    : '#ffffff',
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              title="ফিল্টার সেটিংস"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

        </div>

        {/* 🔍 Google Maps Style Full-Screen Realtime Search View */}
        {isSearchOverlayOpen && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 4000,
              background: 'var(--bg-main)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.15s ease',
            }}
          >
            {/* Top Search Header Bar */}
            <div
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setIsSearchOverlayOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={18} />
              </button>

              <div
                style={{
                  flex: 1,
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Search size={16} style={{ color: '#059669', flexShrink: 0 }} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="এলাকা, মেস, রেস্তোরাঁ (যেমন: KFC, সাঈদনগর)..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    flex: 1,
                    fontWeight: 600,
                    background: 'transparent',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setRealtimePlaceResults([]);
                    }}
                    style={{
                      background: '#e2e8f0',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Quick Keyword Chips */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                padding: '10px 14px 6px 14px',
                background: 'var(--bg-surface-1)',
                borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0,
              }}
            >
              {[
                { label: '🏢 TechDojo (Uttara)', query: 'TechDojo' },
                { label: '🏡 সাঈদনগর ১০০ ফিট', query: 'Saidnagar' },
                { label: '🎓 NSU', query: 'NSU' },
                { label: '🎓 AIUB', query: 'AIUB' },
                { label: '🎓 UIU', query: 'UIU' },
                { label: '🍗 KFC', query: 'KFC' },
                { label: '🏙️ মিরপুর', query: 'Mirpur' },
                { label: '🏙️ ধানমন্ডি', query: 'Dhanmondi' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(chip.query)}
                  style={{
                    background: searchQuery === chip.query ? '#10b981' : 'var(--bg-surface-2)',
                    color: searchQuery === chip.query ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Results Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Live Loading Indicator */}
              {isSearchingLivePlaces && (
                <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1s infinite' }} />
                  <span>লাইভ ম্যাপে খোঁজা হচ্ছে (OpenStreetMap Engine)...</span>
                </div>
              )}

              {/* Section 1: Places & Landmarks */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📍 স্থান, রোড ও এলাকা</span>
                  <span style={{ color: '#10b981' }}>{realtimePlaceResults.length}টি পাওয়া গেছে</span>
                </div>

                {realtimePlaceResults.length === 0 && !isSearchingLivePlaces ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {searchQuery ? 'কোনো স্থান পাওয়া যায়নি। এলাকা, রোড বা জেলা সঠিকভাবে লিখুন।' : 'উপরে যেকোনো স্থান বা এলাকার নাম টাইপ করুন (যেমন: KFC, সাঈদনগর, যশোর)...'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {realtimePlaceResults.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => handleSelectSearchedPlace(place)}
                        style={{
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '10px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '15px',
                              flexShrink: 0,
                            }}
                          >
                            {place.categoryLabel ? place.categoryLabel.split(' ')[0] : '📍'}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {place.shortName}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                              {place.area || place.name}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.68rem',
                            background: '#10b981',
                            color: '#ffffff',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            flexShrink: 0,
                            marginLeft: '8px',
                          }}
                        >
                          ম্যাপে যান ➔
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Matching To-Let Listings */}
              {searchQuery && listings.filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.area.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    🏠 সরাসরি টু-লেট লিস্টিং
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {listings
                      .filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.area.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 4)
                      .map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSelectedListing(item);
                            setIsSearchOverlayOpen(false);
                          }}
                          style={{
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          <img src={item.images[0]} alt={item.title} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                              <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}/মাস • {item.area}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* App Main Viewport */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
            background: 'var(--bg-main)',
          }}
        >
          {/* ========================================================================= */}
          {/* TAB 1: 📍 DHAKA REAL STREET MAP & PROXIMITY RADAR                         */}
          {/* ========================================================================= */}
          {activeTab === 'radar' && (
            <div style={{ padding: '12px 14px' }}>
              {/* Quick 4-Services Circle Grid (Exact BDToLet Inspired) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {[
                  { id: 'explore', label: 'বাসা খুঁজুন', icon: '🏠', action: () => setActiveTab('explore') },
                  { id: 'seat', label: 'সিট / মেস', icon: '🛏️', action: () => { setSelectedCategory('seat'); setActiveTab('explore'); } },
                  { id: 'radar', label: 'লাইভ ম্যাপ', icon: '📡', action: () => setActiveTab('radar') },
                  { id: 'post', label: 'বিজ্ঞাপন দিন', icon: '➕', action: () => setActiveTab('post') },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={s.action}
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '10px 4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '17px',
                      }}
                    >
                      {s.icon}
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Category Pills (Horizontal Scroll) */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '12px' }}>
                {[
                  { id: 'all', label: '🔲 সব' },
                  { id: 'seat', label: '🛏️ সিট' },
                  { id: 'room', label: '🚪 রুম' },
                  { id: 'dining_space', label: '🍽️ ডাইনিং' },
                  { id: 'sublet', label: '🏡 সাবলেট' },
                  { id: 'full_flat', label: '🏢 ফ্ল্যাট' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      background: selectedCategory === cat.id ? '#10b981' : 'var(--bg-surface-2)',
                      color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                      border: `1px solid ${selectedCategory === cat.id ? '#10b981' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>


              {/* 🗺️ Real Interactive Dhaka Street Leaflet Map & Proximity Radar */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                      লাইভ স্ট্রিট রাডার ও রোড নেভিগেশন
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>
                    {filteredListings.length} মেস ও সিট
                  </span>
                </div>

                <div style={{ minHeight: '220px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
                  {!showLocationModal ? (
                    <RealDhakaStreetLeafletMap
                      key={`radar-map-${userLocation.lat}-${userLocation.lng}`}
                      userLocation={userLocation}
                      listings={filteredListings}
                      selectedListing={selectedListing}
                      onSelectListing={(item) => setSelectedListing(item)}
                      activeRouteListing={activeRouteListing}
                      onClearRoute={() => setActiveRouteListing(null)}
                      mapHeight="220px"
                    />
                  ) : (
                    <div
                      style={{
                        height: '220px',
                        background: 'var(--bg-surface-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                      }}
                    >
                      📍 Selecting Location...
                    </div>
                  )}
                </div>
              </div>

              {/* Feed Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.86rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: '#ffffff' }}>
                  নতুন পোস্ট ও কাছাকাছি মেস
                </span>
                <span onClick={() => setActiveTab('explore')} style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}>
                  সব দেখুন ➔
                </span>
              </div>

              {/* 2-Column Responsive Card Grid (BDToLet Exact Card Grid) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {filteredListings.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    className="card-surface"
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-1)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Card Thumbnail */}
                    <div
                      onClick={() => setSelectedListing(item)}
                      style={{ position: 'relative', height: '110px', width: '100%', cursor: 'pointer' }}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,20,0.85) 0%, transparent 60%)' }} />

                      {/* Distance Pill */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: 'rgba(8, 12, 20, 0.85)',
                          backdropFilter: 'blur(6px)',
                          color: '#34d399',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontSize: '0.62rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 700,
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        📍 {item.distanceStr || (item.distanceKm ? `${item.distanceKm} km` : '250m')}
                      </div>

                      {/* Heart Wishlist Button */}
                      <button
                        onClick={(e) => toggleSave(item._id, e)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(8, 12, 20, 0.85)',
                          backdropFilter: 'blur(6px)',
                          border: 'none',
                          color: savedListingIds.includes(item._id) ? '#ef4444' : '#ffffff',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Heart size={13} fill={savedListingIds.includes(item._id) ? '#ef4444' : 'none'} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '3px' }}>
                          <span className="font-mono" style={{ color: '#10b981', fontWeight: 800, fontSize: '0.94rem' }}>
                            <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>/মাস</span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setSelectedListing(item)}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#ffffff',
                            marginBottom: '2px',
                            lineHeight: '1.25',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                          }}
                        >
                          {item.title}
                        </h4>

                        {/* Location */}
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.area}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                        <button
                          onClick={() => handleStartCall(item)}
                          style={{
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            color: '#34d399',
                            padding: '6px 2px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          <PhoneCall size={10} /> কল
                        </button>

                        <button
                          onClick={() => setActiveChatListing(item)}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            color: '#ffffff',
                            padding: '6px 2px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                          }}
                        >
                          <MessageSquare size={10} /> মেসেজ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: 🔍 EXPLORE & CROSS-AREA SEARCH                                    */}
          {/* ========================================================================= */}
          {activeTab === 'explore' && (
            <div style={{ padding: '14px' }}>
              {/* Clean Explore Filter Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {searchQuery ? `"${searchQuery}" এর ফলাফল` : 'সব টু-লেট ও মেস'}
                  </h3>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    {filteredListings.length}টি মেস ও সিট পাওয়া গেছে
                  </p>
                </div>
                <button
                  onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                  style={{
                    background: showFilterDrawer ? '#10b981' : 'var(--bg-surface-2)',
                    color: showFilterDrawer ? '#ffffff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <SlidersHorizontal size={13} />
                  <span>ফিল্টার</span>
                </button>
              </div>

              {/* Rental Category Chips (Seat, Room, Dining, Sublet, Flat) */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px', marginBottom: '6px' }}>
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'seat', label: '🛏️ Seat (১/২/৩ সিট)' },
                  { id: 'room', label: '🚪 Room (রুম)' },
                  { id: 'dining_space', label: '🍽️ Dining Space' },
                  { id: 'sublet', label: '🏡 Sublet' },
                  { id: 'full_flat', label: '🏢 Full Flat' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedCategory(chip.id)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      background: selectedCategory === chip.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                      color: selectedCategory === chip.id ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${selectedCategory === chip.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Tenant Preference Chips */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px' }}>
                {[
                  { id: 'all', label: '👥 All Tenants' },
                  { id: 'bachelor_male', label: 'Bachelor Male' },
                  { id: 'bachelor_female', label: 'Female Student' },
                  { id: 'family', label: 'Family' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedTenantType(chip.id)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      fontSize: '0.66rem',
                      background: selectedTenantType === chip.id ? 'var(--bg-surface-3)' : 'transparent',
                      color: selectedTenantType === chip.id ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Walking Radius Filter Pills in Explore */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px' }}>
                {[
                  { val: 0.8, label: '🚶 < 800m' },
                  { val: 2.0, label: '🛺 1-2 km' },
                  { val: 3.5, label: '🚗 < 3.5 km' },
                  { val: 999, label: '🌐 All Dhaka' },
                ].map((rad) => (
                  <button
                    key={rad.val}
                    onClick={() => setSelectedRadiusKm(rad.val)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      fontSize: '0.64rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      background: selectedRadiusKm === rad.val ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface-2)',
                      color: selectedRadiusKm === rad.val ? '#38bdf8' : 'var(--text-muted)',
                      border: `1px solid ${selectedRadiusKm === rad.val ? '#38bdf8' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {rad.label}
                  </button>
                ))}
              </div>

              {/* Filter Slider Drawer */}
              {showFilterDrawer && (
                <div
                  style={{
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Max Monthly Rent:</span>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                      <span className="taka-symbol">৳</span>{maxRent.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="35000"
                    step="1000"
                    value={maxRent}
                    onChange={(e) => setMaxRent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
                  />
                </div>
              )}

              {/* Feed Card List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredListings.length === 0 ? (
                  <div
                    style={{
                      padding: '24px 16px',
                      textAlign: 'center',
                      background: 'var(--bg-surface-2)',
                      border: '1px dashed var(--border-medium)',
                      borderRadius: '12px',
                      margin: '10px 0',
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📍</div>
                    <h4 className="font-heading" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {searchQuery ? `No listings currently in "${searchQuery}"` : 'No listings matching selected filters'}
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Explore nearby student hubs or reset filters:
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
                      {['Bashundhara', 'Badda', 'Aftabnagar', 'Gulshan', 'Saidnagar', 'Dhanmondi', 'Mirpur'].map((area) => (
                        <button
                          key={area}
                          onClick={() => setSearchQuery(area)}
                          style={{
                            background: 'var(--bg-surface-3)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--brand-primary)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          📍 {area}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTenantType('all');
                        setSelectedRoomType('all');
                        setMaxRent(35000);
                      }}
                      className="btn-surface"
                      style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                    >
                      Reset All Filters ↺
                    </button>
                  </div>
                ) : (
                  filteredListings.map((item) => (
                    <div
                      key={item._id}
                      className="card-surface"
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-1)',
                      }}
                    >
                      {/* Top Image Banner */}
                      <div
                        onClick={() => setSelectedListing(item)}
                        style={{ position: 'relative', height: '150px', cursor: 'pointer' }}
                      >
                        <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,20,0.85) 0%, transparent 60%)' }} />

                        {/* Location Tag */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(8, 12, 20, 0.85)',
                            backdropFilter: 'blur(8px)',
                            padding: '4px 9px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                          }}
                        >
                          📍 {item.area}
                        </div>

                        {/* Rent Pill */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '48px',
                            background: 'rgba(8, 12, 20, 0.9)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            color: '#fbbf24',
                            padding: '4px 9px',
                            borderRadius: '8px',
                            fontSize: '0.92rem',
                            fontFamily: 'JetBrains Mono',
                            fontWeight: 800,
                          }}
                        >
                          <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}<span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>/mo</span>
                        </div>

                        <button
                          onClick={(e) => toggleSave(item._id, e)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(8, 12, 20, 0.85)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid var(--border-subtle)',
                            color: savedListingIds.includes(item._id) ? 'var(--brand-primary)' : '#fff',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Bookmark size={14} fill={savedListingIds.includes(item._id) ? 'var(--brand-primary)' : 'none'} />
                        </button>
                      </div>

                      {/* Content Body */}
                      <div style={{ padding: '14px' }}>
                        <h4
                          onClick={() => setSelectedListing(item)}
                          style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '4px', cursor: 'pointer' }}
                        >
                          {item.title}
                        </h4>

                        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          📍 {item.addressText}
                        </p>

                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.22)',
                            borderRadius: '8px',
                            padding: '7px 10px',
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontSize: '0.74rem', color: '#fbbf24', fontWeight: 700 }}>
                            💰 Total Monthly: <span className="font-mono">৳{(item.rentAmount + (item.utilityInfo?.totalUtility || 0)).toLocaleString()}</span>
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            +৳{item.utilityInfo?.totalUtility || 0} Utilities
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button
                            onClick={() => handleStartCall(item)}
                            style={{
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#34d399',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <PhoneCall size={13} /> In-App Call
                          </button>

                          <button
                            onClick={() => setActiveChatListing(item)}
                            style={{
                              background: 'var(--brand-primary)',
                              border: 'none',
                              color: '#ffffff',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            <MessageSquare size={13} /> Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 💬 IN-APP CHATS & MESSAGES                                        */}
          {/* ========================================================================= */}
          {activeTab === 'messages' && (
            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <MessageSquare size={16} style={{ color: 'var(--brand-primary)' }} />
                <h2 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  In-App Messages
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {listings.slice(0, 3).map((item) => {
                  const isClosed = isChatClosed[item._id];
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setActiveChatListing(item);
                        setSelectedListing(null);
                      }}
                      className="card-surface"
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderRadius: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem' }}>
                          {item.landlord.name}
                        </span>
                        {isClosed ? (
                          <span className="status-chip status-chip-rented" style={{ fontSize: '0.65rem' }}>Closed</span>
                        ) : (
                          <span className="status-chip status-chip-available" style={{ fontSize: '0.65rem' }}>Active</span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', margin: '2px 0' }}>
                        {item.title}
                      </p>

                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isClosed ? 'Negotiation closed by Tenant.' : 'Click to open private in-app chat & call.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: 👤 প্রোফাইল ও সেটিংস / 🔐 সাইন ইন স্ক্রিন                            */}
          {/* ========================================================================= */}
          {activeTab === 'saved' && (
            <div style={{ padding: '14px' }}>
              {!isLoggedIn ? (
                /* 🔐 AUTHENTICATION SCREEN (LOGIN / REGISTER) */
                <div style={{ animation: 'fadeIn 0.25s ease' }}>
                  {/* Brand Banner */}
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '16px 10px 14px',
                      marginBottom: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                      }}
                    >
                      <Home size={26} />
                    </div>
                    <h2 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>
                      ToLet Nest
                    </h2>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                      ব্যাচেলর মেস, সিট ও ফ্ল্যাটমেট খোঁজার নিরাপদ প্ল্যাটফর্ম
                    </p>
                  </div>

                  {/* Auth Mode Toggle (Login vs Register) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '4px',
                      marginBottom: '16px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      style={{
                        background: authMode === 'login' ? 'var(--bg-surface-2)' : 'transparent',
                        color: authMode === 'login' ? '#10b981' : 'var(--text-muted)',
                        border: authMode === 'login' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                        padding: '9px',
                        borderRadius: '9px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <LogIn size={14} /> সাইন ইন (Login)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      style={{
                        background: authMode === 'register' ? 'var(--bg-surface-2)' : 'transparent',
                        color: authMode === 'register' ? '#10b981' : 'var(--text-muted)',
                        border: authMode === 'register' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                        padding: '9px',
                        borderRadius: '9px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <UserPlus size={14} /> নতুন অ্যাকাউন্ট
                    </button>
                  </div>

                  {/* Form Fields */}
                  <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {authMode === 'register' && (
                      <div>
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                          আপনার পুরো নাম *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: Wasiur Rahman"
                          value={authFormData.name}
                          onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            color: '#ffffff',
                            fontSize: '0.78rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        মোবাইল নম্বর বা ইমেইল *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="01700-123456 বা email@example.com"
                        value={authFormData.phone}
                        onChange={(e) => setAuthFormData({ ...authFormData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'var(--bg-surface-1)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                        পাসওয়ার্ড *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={authFormData.password}
                        onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'var(--bg-surface-1)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        marginTop: '4px',
                        width: '100%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.84rem',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)',
                      }}
                    >
                      {authMode === 'login' ? (
                        <>
                          <LogIn size={16} /> সাইন ইন করুন (Sign In)
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} /> অ্যাকাউন্ট তৈরি সম্পন্ন করুন
                        </>
                      )}
                    </button>
                  </form>

                  {/* ⚡ 1-Tap Quick Demo Accounts */}
                  <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '12px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚡</span> দ্রুত ডেমো লগইন (1-Tap Fast Login)
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() =>
                          handleDemoLogin({
                            name: 'Wasiur Rahman',
                            phone: '01700-123456',
                            email: 'wasiur@techdojo.dev',
                            role: 'tenant',
                            profession: 'Tech Trainee • TechDojo HQ (Road 6, Uttara)',
                            avatar: 'W',
                            verified: true,
                          })
                        }
                        style={{
                          background: 'var(--bg-surface-2)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#ffffff',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' }}>
                            W
                          </div>
                          <div>
                            <div style={{ fontSize: '0.76rem', fontWeight: 800 }}>Wasiur Rahman</div>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Tech Trainee • TechDojo HQ</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                          লগইন →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDemoLogin({
                            name: 'Dr. Farhana Yasmin',
                            phone: '01811-987654',
                            email: 'farhana@uttarahousing.com',
                            role: 'landlord',
                            profession: 'বাড়িওয়ালা (House Owner) • উত্তরা সেক্টর ৪',
                            avatar: 'F',
                            verified: true,
                          })
                        }
                        style={{
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          color: '#ffffff',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#38bdf8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem' }}>
                            F
                          </div>
                          <div>
                            <div style={{ fontSize: '0.76rem', fontWeight: 800 }}>Dr. Farhana Yasmin</div>
                            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>বাড়িওয়ালা (Owner) • সেক্টর ৪</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                          লগইন →
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : profileSubView === 'my_listings' ? (
                <div>
                  {/* Sub Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setProfileSubView('main')}
                        style={{
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          আমার বিজ্ঞাপন সমূহ
                        </h3>
                        <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', margin: '1px 0 0' }}>
                          আপনার পোস্ট করা বিজ্ঞাপন ও স্ট্যাটাস পরিচালনা
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('post')}
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={14} /> নতুন পোস্ট
                    </button>
                  </div>

                  {/* Listings Count Banner */}
                  {(() => {
                    const userListings = listings.filter(
                      (l) =>
                        myListingIds.includes(l._id) ||
                        (l.landlord && l.landlord.name && (l.landlord.name.includes(currentUser.name) || l.landlord.name.includes('Wasiur'))) ||
                        l.isLookingRequest
                    );

                    if (userListings.length === 0) {
                      return (
                        <div
                          style={{
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            padding: '36px 20px',
                            textAlign: 'center',
                            marginTop: '20px',
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📭</div>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                            আপনার কোনো সক্রিয় বিজ্ঞাপন নেই
                          </h4>
                          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                            টু-লেট বা রুমমেট খুঁজতে একটি নতুন বিজ্ঞাপন পোস্ট করুন
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('post')}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 18px',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Plus size={16} /> নতুন বিজ্ঞাপন তৈরি করুন
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981' }}>
                            মোট বিজ্ঞাপন: {userListings.length}টি
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            Active on Map & Live Radar
                          </span>
                        </div>

                        {userListings.map((item) => {
                          const isRented = item.status === 'rented';
                          return (
                            <div
                              key={item._id}
                              style={{
                                background: 'var(--bg-surface-1)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '14px',
                                padding: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                position: 'relative',
                              }}
                            >
                              {/* Top Row: Image, Details & Status */}
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <img
                                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
                                  alt={item.title}
                                  style={{
                                    width: '74px',
                                    height: '74px',
                                    borderRadius: '10px',
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                  }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                                    <span
                                      style={{
                                        fontSize: '0.62rem',
                                        fontWeight: 800,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: isRented ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                        color: isRented ? '#ef4444' : '#10b981',
                                      }}
                                    >
                                      {isRented ? '🔴 ভাড়া সম্পন্ন (Rented)' : '🟢 লাইভ (Available)'}
                                    </span>
                                    <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                                      👁️ {item.viewsCount || 1} views
                                    </span>
                                  </div>

                                  <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff', margin: '4px 0 2px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.title}
                                  </h4>
                                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981' }}>
                                    ৳{item.rentAmount ? item.rentAmount.toLocaleString() : 'N/A'}/মাস
                                  </div>
                                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    📍 {item.addressText || item.area}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons: Toggle Status, View on Map, Delete */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '6px', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
                                {/* Change Status */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleListingStatus(item._id, item.status || 'available')}
                                  style={{
                                    background: isRented ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                    border: isRented ? '1px solid #10b981' : '1px solid #f59e0b',
                                    color: isRented ? '#10b981' : '#f59e0b',
                                    borderRadius: '8px',
                                    padding: '7px 4px',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <RefreshCw size={12} /> {isRented ? 'ভাড়া খালি করুন' : 'ভাড়া সম্পন্ন'}
                                </button>

                                {/* Center on Map */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.location?.coordinates) {
                                      setUserLocation({
                                        name: item.addressText || item.title,
                                        lat: item.location.coordinates[1],
                                        lng: item.location.coordinates[0],
                                        isLiveGPS: false,
                                        isDetecting: false,
                                      });
                                    }
                                    setActiveTab('radar');
                                  }}
                                  style={{
                                    background: 'var(--bg-surface-2)',
                                    border: '1px solid var(--border-subtle)',
                                    color: '#38bdf8',
                                    borderRadius: '8px',
                                    padding: '7px 4px',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <MapPin size={12} /> ম্যাপে দেখুন
                                </button>

                                {/* Delete Listing */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteListing(item._id)}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    borderRadius: '8px',
                                    padding: '7px 4px',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Trash2 size={12} /> ডিলিট
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              ) : profileSubView === 'saved' ? (
                <div>
                  {/* Sub Header for Saved Listings */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setProfileSubView('main')}
                        style={{
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                          সেভ করা মেস ও সিট
                        </h3>
                        <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', margin: '1px 0 0' }}>
                          আপনার পছন্দের তালিকায় সংরক্ষিত বিজ্ঞাপনসমূহ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Saved Feed */}
                  {(() => {
                    const savedListings = listings.filter((l) => savedListingIds.includes(l._id));

                    if (savedListings.length === 0) {
                      return (
                        <div
                          style={{
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            padding: '36px 20px',
                            textAlign: 'center',
                            marginTop: '20px',
                          }}
                        >
                          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔖</div>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                            কোনো সংরক্ষিত বাসা নেই
                          </h4>
                          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                            পছন্দের মেস বা সিটের হার্ট আইকনে ক্লিক করে এখানে সেভ করুন
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('explore')}
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 18px',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Home size={16} /> নতুন বাসা খুঁজুন
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {savedListings.map((item) => (
                          <div
                            key={item._id}
                            style={{
                              background: 'var(--bg-surface-1)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '14px',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <img
                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
                                alt={item.title}
                                style={{
                                  width: '74px',
                                  height: '74px',
                                  borderRadius: '10px',
                                  objectFit: 'cover',
                                  flexShrink: 0,
                                }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                  {item.rentalCategory === 'seat' ? '🛏️ সিট ভাড়া' : '🚪 রুম ভাড়া'}
                                </span>
                                <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff', margin: '4px 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.title}
                                </h4>
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981' }}>
                                  ৳{item.rentAmount ? item.rentAmount.toLocaleString() : 'N/A'}/মাস
                                </div>
                                <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  📍 {item.addressText || item.area}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedListing(item)}
                                style={{
                                  background: 'var(--bg-surface-2)',
                                  border: '1px solid var(--border-subtle)',
                                  color: '#fff',
                                  borderRadius: '8px',
                                  padding: '7px 4px',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Info size={12} /> বিস্তারিত
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (item.location?.coordinates) {
                                    setUserLocation({
                                      name: item.addressText || item.title,
                                      lat: item.location.coordinates[1],
                                      lng: item.location.coordinates[0],
                                      isLiveGPS: false,
                                      isDetecting: false,
                                    });
                                  }
                                  setActiveTab('radar');
                                }}
                                style={{
                                  background: 'var(--bg-surface-2)',
                                  border: '1px solid var(--border-subtle)',
                                  color: '#38bdf8',
                                  borderRadius: '8px',
                                  padding: '7px 4px',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                }}
                              >
                                <MapPin size={12} /> ম্যাপে দেখুন
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleSave(item._id)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid #ef4444',
                                  color: '#ef4444',
                                  borderRadius: '8px',
                                  padding: '7px 4px',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Bookmark size={12} fill="#ef4444" /> সেভ বাতিল
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  {/* Profile Header Card */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      borderRadius: '16px',
                      padding: '16px',
                      color: '#ffffff',
                      marginBottom: '14px',
                      boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          color: '#047857',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        {currentUser.avatar || currentUser.name[0] || 'U'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>
                            {currentUser.name}
                          </h3>
                          <span style={{ fontSize: '0.62rem', background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                            ✓ Verified
                          </span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#d1fae5', margin: '2px 0 0 0' }}>
                          {currentUser.profession}
                        </p>
                        <p style={{ fontSize: '0.66rem', color: '#a7f3d0', margin: '2px 0 0 0' }}>
                          {currentUser.email} • {currentUser.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Grid (4 Circles) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    {[
                      { label: 'বাসা খুঁজুন', icon: Home, action: () => setActiveTab('explore') },
                      { label: 'পোস্ট দিন', icon: PlusCircle, action: () => setActiveTab('post') },
                      { label: 'আমার বিজ্ঞাপন', icon: FileText, action: () => setProfileSubView('my_listings') },
                      { label: `সেভড (${savedListingIds.length})`, icon: Heart, action: () => setProfileSubView('saved') },
                    ].map((act, idx) => {
                      const Icon = act.icon;
                      return (
                        <div
                          key={idx}
                          onClick={act.action}
                          style={{
                            background: 'var(--bg-surface-1)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '10px 4px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'rgba(16, 185, 129, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#10b981',
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <span style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {act.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Activity Menu List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                      আমার কার্যক্রম
                    </div>

                    {(() => {
                      const userListingsCount = listings.filter(
                        (l) =>
                          myListingIds.includes(l._id) ||
                          (l.landlord && l.landlord.name && (l.landlord.name.includes(currentUser.name) || l.landlord.name.includes('Wasiur'))) ||
                          l.isLookingRequest
                      ).length;

                      return [
                        {
                          title: 'আমার বিজ্ঞাপন সমূহ',
                          desc: 'আপনার টু-লেট পোস্ট দেখুন, স্ট্যাটাস পরিবর্তন ও ডিলিট করুন',
                          icon: FileText,
                          badge: `${userListingsCount}টি লাইভ`,
                          action: () => setProfileSubView('my_listings'),
                        },
                        {
                          title: 'সেভ করা মেস ও সিট',
                          desc: `${savedListingIds.length}টি মেস আপনার পছন্দের তালিকায় সংরক্ষিত`,
                          icon: Heart,
                          badge: `${savedListingIds.length}টি সেভড`,
                          action: () => setProfileSubView('saved'),
                        },
                        {
                          title: 'প্রাইভেসি ও কলিং সেটিংস',
                          desc: 'জিরো ফোন নম্বর এক্সপোজার ও ইন-অ্যাপ প্রাইভেট অডিও কল',
                          icon: Shield,
                          badge: 'Active',
                          action: () => {},
                        },
                        {
                          title: 'সেভড লোকেশন ও জিপিএস',
                          desc: 'TechDojo HQ, My Home (Saidnagar 100ft)',
                          icon: MapPin,
                          badge: '2 Locations',
                          action: () => setShowLocationModal(true),
                        },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={item.action}
                            className="card-surface"
                            style={{
                              padding: '12px 14px',
                              borderRadius: '12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  background: 'var(--bg-surface-2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#10b981',
                                }}
                              >
                                <Icon size={18} />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                                  {item.title}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                  {item.desc}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {item.badge}
                              </span>
                              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Sign Out / Logout Action Card */}
                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                      }}
                    >
                      <LogOut size={16} /> লগআউট / সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ➕ নতুন পোস্ট (BDToLet-INSPIRED HIGH CONVERTING FORM)              */}
          {/* ========================================================================= */}
          {activeTab === 'post' && (
            <div style={{ padding: '14px' }}>
              {/* Screen Header */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h2 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    নতুন পোস্ট
                  </h2>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', marginBottom: 0 }}>
                  প্রয়োজনীয় তথ্য দিন, আমরা সঠিক মানুষের কাছে পৌঁছাতে সাহায্য করব
                </p>
              </div>

              {/* 2 Big Hero Option Cards (Exact BDToLet Style) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                {/* Option 1: To-Let Post (ভাড়া দিতে চাই) */}
                <div
                  onClick={() => setMobilePostData({ ...mobilePostData, posterRole: 'landlord' })}
                  style={{
                    background: mobilePostData.posterRole !== 'flatmate' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-1)',
                    border: `1.5px solid ${mobilePostData.posterRole !== 'flatmate' ? '#10b981' : 'var(--border-subtle)'}`,
                    borderRadius: '14px',
                    padding: '12px 10px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: mobilePostData.posterRole !== 'flatmate' ? '#10b981' : 'var(--bg-surface-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Home size={20} />
                    </div>
                    {mobilePostData.posterRole !== 'flatmate' && (
                      <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                    To-Let পোস্ট
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    ভাড়া দিতে চাই (হোস্ট / বাড়িওয়ালা)
                  </div>
                </div>

                {/* Option 2: Flatmate / Sublet (বাসা দরকার) */}
                <div
                  onClick={() => setMobilePostData({ ...mobilePostData, posterRole: 'flatmate' })}
                  style={{
                    background: mobilePostData.posterRole === 'flatmate' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-1)',
                    border: `1.5px solid ${mobilePostData.posterRole === 'flatmate' ? '#10b981' : 'var(--border-subtle)'}`,
                    borderRadius: '14px',
                    padding: '12px 10px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: mobilePostData.posterRole === 'flatmate' ? '#10b981' : 'var(--bg-surface-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Users size={20} />
                    </div>
                    {mobilePostData.posterRole === 'flatmate' && (
                      <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                    বাসা দরকার / রুমমেট
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    ভাড়া নিতে চাই (ছাত্র / চাকরিজীবী)
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* FORM A: 🏠 LANDLORD / SUBLET HOST (ভাড়া দিতে চাই)         */}
              {/* ========================================================= */}
              {mobilePostData.posterRole !== 'flatmate' ? (
                <div>
                  {/* Sub-Need Selectors */}
                  <div
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      প্রোপার্টি টাইপ নির্বাচন করুন
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { id: 'seat_rent', cat: 'seat', label: '🛏️ সিট খালি আছে' },
                        { id: 'room_rent', cat: 'room', label: '🚪 রুম ভাড়া হবে' },
                        { id: 'sublet', cat: 'sublet', label: '🏡 সাবলেট দিতে চাই' },
                        { id: 'full_flat', cat: 'full_flat', label: '🏢 ফুল ফ্ল্যাট' },
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setMobilePostData({ ...mobilePostData, propertyType: opt.id, rentalCategory: opt.cat })}
                          style={{
                            background: mobilePostData.propertyType === opt.id ? '#10b981' : 'var(--bg-surface-2)',
                            color: mobilePostData.propertyType === opt.id ? '#ffffff' : 'var(--text-secondary)',
                            border: `1px solid ${mobilePostData.propertyType === opt.id ? '#10b981' : 'var(--border-subtle)'}`,
                            padding: '8px 6px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 📋 মূল তথ্য Form Section */}
                  <div
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '14px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <FileText size={16} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>
                        To-Let প্রোপার্টির বিবরণ
                      </span>
                    </div>

                    <form onSubmit={handleMobileSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* শিরোনাম */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          বিজ্ঞাপনের শিরোনাম *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: উত্তরা ৪ নং সেক্টরে সুন্দর ১ সিট বা রুম ভাড়া হবে"
                          value={mobilePostData.title}
                          onChange={(e) => setMobilePostData({ ...mobilePostData, title: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            color: '#ffffff',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* ভাড়ার পরিমাণ ও ইউটিলিটি */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            ভাড়ার পরিমাণ (মাসিক ৳) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="যেমন: ৩,৫০০"
                            value={mobilePostData.rentAmount}
                            onChange={(e) => setMobilePostData({ ...mobilePostData, rentAmount: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              outline: 'none',
                              fontFamily: 'JetBrains Mono',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            ইউটিলিটি বিল (৳)
                          </label>
                          <input
                            type="number"
                            placeholder="যেমন: ৭৫০"
                            value={mobilePostData.utilityAmount}
                            onChange={(e) => setMobilePostData({ ...mobilePostData, utilityAmount: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              outline: 'none',
                              fontFamily: 'JetBrains Mono',
                            }}
                          />
                        </div>
                      </div>

                      {/* জেলা ও এলাকা */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            জেলা
                          </label>
                          <select
                            disabled
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              outline: 'none',
                            }}
                          >
                            <option>ঢাকা (Dhaka)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            এলাকা *
                          </label>
                          <select
                            value={mobilePostData.area}
                            onChange={(e) => setMobilePostData({ ...mobilePostData, area: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              outline: 'none',
                            }}
                          >
                            {['Uttara', 'Bashundhara R/A', 'Saidnagar', 'Badda', 'Aftabnagar', 'Gulshan', 'Dhanmondi', 'Mirpur'].map((a) => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 📍 ম্যাপে বাসার সঠিক লোকেশন ও পিন সিলেকশন */}
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <MapPin size={14} /> ম্যাপে বাসার অবস্থান ও স্থানাঙ্ক *
                            </span>
                            <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                              ম্যাপের এই সুনির্দিষ্ট পয়েন্টে বাসাটির লাইভ পিন ড্রপ হবে
                            </p>
                          </div>
                          <span style={{ fontSize: '0.62rem', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            LIVE GPS PIN
                          </span>
                        </div>

                        {/* Selected Location Card */}
                        <div
                          style={{
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '9px 10px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                            📍 {mobilePostData.addressText || mobilePostData.locationName || 'House 14, Road 6, Sector 4, Uttara'}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#38bdf8', marginTop: '3px', fontFamily: 'JetBrains Mono' }}>
                            🌐 কোঅর্ডিনেট: {Number(mobilePostData.lat || 23.8638).toFixed(4)}° N, {Number(mobilePostData.lng || 90.4005).toFixed(4)}° E
                          </div>
                        </div>

                        {/* Buttons to Pick on Map or Use GPS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px', marginBottom: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenPostPicker('landlord')}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <Compass size={14} /> ম্যাপে পয়েন্ট পিন করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (userLocation.lat && userLocation.lng) {
                                setMobilePostData((prev) => ({
                                  ...prev,
                                  lat: userLocation.lat,
                                  lng: userLocation.lng,
                                  locationName: userLocation.name,
                                  addressText: userLocation.name,
                                }));
                                triggerToast(`📍 বর্তমান GPS লোকেশন সেট হয়েছে:\n${userLocation.name}`, 'gps');
                              } else {
                                detectLiveGPS();
                              }
                            }}
                            style={{
                              background: 'var(--bg-surface-2)',
                              color: '#38bdf8',
                              border: '1px solid #38bdf8',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <Crosshair size={13} /> লাইভ GPS
                          </button>
                        </div>

                        {/* Additional House / Floor Note */}
                        <div>
                          <input
                            type="text"
                            placeholder="বাড়ি/ফ্লোর নোট (যেমন: শাহ মঞ্জিল, ৬ষ্ঠ তলা, বড় মসজিদের বিপরীতে)"
                            value={mobilePostData.addressText}
                            onChange={(e) => setMobilePostData({ ...mobilePostData, addressText: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-1)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      {/* ভাড়াটিয়া অগ্রাধিকার */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          ভাড়াটিয়া অগ্রাধিকার
                        </label>
                        <select
                          value={mobilePostData.tenantType}
                          onChange={(e) => setMobilePostData({ ...mobilePostData, tenantType: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            color: '#ffffff',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '0.76rem',
                            outline: 'none',
                          }}
                        >
                          <option value="bachelor_male">ব্যাচেলর ছেলে (Bachelor Male / Student / Intern)</option>
                          <option value="bachelor_female">ব্যাচেলর মেয়ে (Female Student / Job Holder)</option>
                          <option value="job_holder">চাকরিজীবী (Job Holder)</option>
                          <option value="family">পরিবার (Family)</option>
                          <option value="any">যেকোনো (Anyone)</option>
                        </select>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isPostingFromMobile}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '6px',
                        }}
                      >
                        <Send size={16} />
                        {isPostingFromMobile ? 'পোস্ট হচ্ছে...' : '🏠 To-Let বিজ্ঞাপন প্রকাশ করুন'}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* ========================================================= */
                /* FORM B: 👥 TENANT / FLATMATE SEEKER (বাসা দরকার)          */
                /* ========================================================= */
                <div>
                  {/* Sub-Need Selectors for Seeker */}
                  <div
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '12px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                      আপনার কি ধরনের বাসা বা সিট প্রয়োজন?
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { id: 'seat', label: '🛏️ আমার ১টি সিট দরকার' },
                        { id: 'room', label: '🚪 ব্যক্তিগত ১টি রুম দরকার' },
                        { id: 'dining_space', label: '🍽️ ডাইনিং স্পেস দরকার' },
                        { id: 'sublet', label: '🏡 ফ্ল্যাটমেট হিসেবে উঠতে চাই' },
                      ].map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setTenantNeedData({ ...tenantNeedData, needType: opt.id })}
                          style={{
                            background: tenantNeedData.needType === opt.id ? '#10b981' : 'var(--bg-surface-2)',
                            color: tenantNeedData.needType === opt.id ? '#ffffff' : 'var(--text-secondary)',
                            border: `1px solid ${tenantNeedData.needType === opt.id ? '#10b981' : 'var(--border-subtle)'}`,
                            padding: '8px 6px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 📋 ভাড়াটিয়া চাহিদা ও প্রেফারেন্স Form Section */}
                  <div
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '14px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <Users size={16} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>
                        আপনার চাহিদা ও পছন্দ
                      </span>
                    </div>

                    <form onSubmit={handleMobileSubmitTenantNeed} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* শিরোনাম */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          পোস্টের শিরোনাম *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: উত্তরা টেকডোজো / সেক্টর ৪-এর কাছে ১টি সিট বা রুম খুঁজছি"
                          value={tenantNeedData.title}
                          onChange={(e) => setTenantNeedData({ ...tenantNeedData, title: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            color: '#ffffff',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* পেশা ও পরিচয় */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          আপনার পেশা / স্ট্যাটাস
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                          {[
                            { id: 'intern', label: '👨‍💻 আইটি ট্রেইনি' },
                            { id: 'student', label: '🎓 শিক্ষার্থী' },
                            { id: 'job_holder', label: '💼 চাকরিজীবী' },
                          ].map((p) => (
                            <button
                              type="button"
                              key={p.id}
                              onClick={() => setTenantNeedData({ ...tenantNeedData, userProfession: p.id })}
                              style={{
                                background: tenantNeedData.userProfession === p.id ? '#10b981' : 'var(--bg-surface-2)',
                                color: tenantNeedData.userProfession === p.id ? '#ffffff' : 'var(--text-secondary)',
                                border: `1px solid ${tenantNeedData.userProfession === p.id ? '#10b981' : 'var(--border-subtle)'}`,
                                padding: '6px 4px',
                                borderRadius: '6px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* বাজেট ও এলাকা */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            সর্বোচ্চ বাজেট (৳) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="যেমন: ৪,৫০০"
                            value={tenantNeedData.budgetMax}
                            onChange={(e) => setTenantNeedData({ ...tenantNeedData, budgetMax: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.78rem',
                              outline: 'none',
                              fontFamily: 'JetBrains Mono',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            পছন্দের এলাকা *
                          </label>
                          <select
                            value={tenantNeedData.preferredArea}
                            onChange={(e) => setTenantNeedData({ ...tenantNeedData, preferredArea: e.target.value })}
                            style={{
                              width: '100%',
                              background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: '#ffffff',
                              padding: '9px 12px',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              outline: 'none',
                            }}
                          >
                            {['Uttara', 'Bashundhara R/A', 'Saidnagar', 'Badda', 'Aftabnagar', 'Gulshan', 'Dhanmondi', 'Mirpur'].map((a) => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* সম্ভাব্য ওঠার তারিখ */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          🗓️ কবে থেকে উঠতে চান?
                        </label>
                        <input
                          type="date"
                          value={tenantNeedData.moveInDate}
                          onChange={(e) => setTenantNeedData({ ...tenantNeedData, moveInDate: e.target.value })}
                          style={{
                            width: '100%',
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            color: '#ffffff',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            outline: 'none',
                          }}
                        />
                      </div>

                      {/* মিল ও জীবনযাত্রা পছন্দ */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          খাবার ও মেসের পছন্দ
                        </label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {[
                            { id: 'meal_system', label: '🍲 মেস মিল সিস্টেম চাই' },
                            { id: 'self_cooking', label: '🍳 নিজে রান্না করব' },
                            { id: 'outside', label: '🥡 বাইরে খাব' },
                          ].map((m) => (
                            <button
                              type="button"
                              key={m.id}
                              onClick={() => setTenantNeedData({ ...tenantNeedData, mealPreference: m.id })}
                              style={{
                                background: tenantNeedData.mealPreference === m.id ? '#10b981' : 'var(--bg-surface-2)',
                                color: tenantNeedData.mealPreference === m.id ? '#ffffff' : 'var(--text-secondary)',
                                border: `1px solid ${tenantNeedData.mealPreference === m.id ? '#10b981' : 'var(--border-subtle)'}`,
                                padding: '5px 8px',
                                borderRadius: '6px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* অধূমপায়ী ও লাইফস্টাইল টগল */}
                      <div
                        onClick={() => setTenantNeedData({ ...tenantNeedData, isNonSmoker: !tenantNeedData.isNonSmoker })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: 'var(--bg-surface-2)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#ffffff' }}>
                          🚭 অধূমপায়ী মেস / ফ্রেন্ডলি পরিবেশ পছন্দ
                        </span>
                        <input
                          type="checkbox"
                          checked={tenantNeedData.isNonSmoker}
                          onChange={() => {}}
                          style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                        />
                      </div>

                      {/* 📍 ম্যাপে পছন্দের লোকেশন ও স্থানাঙ্ক */}
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <MapPin size={14} /> যে লোকেশনে বাসা খুঁজছেন *
                            </span>
                            <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                              রাডার ম্যাপের এই সেন্টারে আপনার বাসা খোঁজার রিকুয়েস্ট প্রদর্শিত হবে
                            </p>
                          </div>
                          <span style={{ fontSize: '0.62rem', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                            TARGET PIN
                          </span>
                        </div>

                        {/* Selected Location Card */}
                        <div
                          style={{
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '9px 10px',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                            📍 {tenantNeedData.locationName || `${tenantNeedData.preferredArea}, ঢাকা`}
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#38bdf8', marginTop: '3px', fontFamily: 'JetBrains Mono' }}>
                            🌐 কোঅর্ডিনেট: {Number(tenantNeedData.lat || 23.8638).toFixed(4)}° N, {Number(tenantNeedData.lng || 90.4005).toFixed(4)}° E
                          </div>
                        </div>

                        {/* Buttons to Pick on Map or Use GPS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenPostPicker('flatmate')}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <Compass size={14} /> ম্যাপে এলাকা পিন করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (userLocation.lat && userLocation.lng) {
                                setTenantNeedData((prev) => ({
                                  ...prev,
                                  lat: userLocation.lat,
                                  lng: userLocation.lng,
                                  locationName: userLocation.name,
                                }));
                                triggerToast(`📍 বর্তমান GPS লোকেশন সেট হয়েছে:\n${userLocation.name}`, 'gps');
                              } else {
                                detectLiveGPS();
                              }
                            }}
                            style={{
                              background: 'var(--bg-surface-2)',
                              color: '#38bdf8',
                              border: '1px solid #38bdf8',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                            }}
                          >
                            <Crosshair size={13} /> লাইভ GPS
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isPostingFromMobile}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '10px',
                          fontSize: '0.86rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '6px',
                        }}
                      >
                        <Send size={16} />
                        {isPostingFromMobile ? 'পোস্ট হচ্ছে...' : '👥 বাসা খোঁজার বিজ্ঞাপন প্রকাশ করুন'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM TAB NAVIGATOR (5-Tab Seamless Switcher)                            */}
        {/* ========================================================================= */}
        <div
          style={{
            minHeight: isNativeMobile ? '70px' : '56px',
            paddingBottom: isNativeMobile ? '18px' : '0px',
            paddingTop: '6px',
            background: 'var(--bg-surface-1)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 40,
            flexShrink: 0,
          }}
        >
          {[
            { id: 'radar', label: 'হোম', icon: Compass },
            { id: 'explore', label: 'খুঁজুন', icon: Search },
            { id: 'post', label: 'বিজ্ঞাপন', icon: Plus, isHighlight: true },
            { id: 'messages', label: 'চ্যাট', icon: MessageSquare },
            { id: 'saved', label: 'প্রোফাইল', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            if (tab.isHighlight) {
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedListing(null);
                    setActiveChatListing(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transform: 'translateY(-10px)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.45)',
                      border: '3px solid var(--bg-surface-1)',
                    }}
                  >
                    <Plus size={22} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '0.62rem', fontFamily: 'Space Grotesk', fontWeight: 800, color: isActive ? '#10b981' : 'var(--text-muted)', marginTop: '2px' }}>
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedListing(null);
                  setActiveChatListing(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  color: isActive ? '#10b981' : 'var(--text-muted)',
                  fontSize: '0.66rem',
                  fontFamily: 'Space Grotesk',
                  fontWeight: isActive ? 800 : 500,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: DETAILED LISTING VIEW                                            */}
        {/* ========================================================================= */}
        {selectedListing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--bg-main)',
              zIndex: 2500,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                position: 'sticky',
                top: 0,
                background: 'rgba(20, 18, 15, 0.95)',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => setSelectedListing(null)}
                style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={14} />
              </button>
              <span className="font-heading" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>To-Let Details</span>
              <button
                onClick={() => toggleSave(selectedListing._id)}
                style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', color: savedListingIds.includes(selectedListing._id) ? 'var(--brand-primary)' : '#fff', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <Bookmark size={14} fill={savedListingIds.includes(selectedListing._id) ? 'var(--brand-primary)' : 'none'} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '14px', flex: 1, overflowY: 'auto' }}>
              <div style={{ position: 'relative', height: '160px', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                <img
                  src={selectedListing.images[0]}
                  alt={selectedListing.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,18,15,0.7), transparent)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ background: 'var(--brand-primary-subtle)', color: 'var(--brand-primary)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                  📍 {selectedListing.area}
                </span>
                <span className="status-chip status-chip-available">● Available</span>
              </div>

              <h2 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>
                {selectedListing.title}
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                📍 {selectedListing.addressText}
              </p>

              {/* 💰 Transparent Pricing Box */}
              <div
                style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Base Rent:</span>
                  <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                    <span className="taka-symbol">৳</span>{selectedListing.rentAmount.toLocaleString()}
                  </span>
                </div>

                {selectedListing.utilityInfo?.mode === 'itemized' && (
                  <div style={{ borderTop: '1px dashed var(--border-medium)', paddingTop: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                      Itemized Utility Breakdown:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>• Electricity: ৳{selectedListing.utilityInfo.breakdown?.electricity || 0}</span>
                      <span>• Gas: ৳{selectedListing.utilityInfo.breakdown?.gas || 0}</span>
                      <span>• Water: ৳{selectedListing.utilityInfo.breakdown?.water || 0}</span>
                      <span>• Service Charge: ৳{selectedListing.utilityInfo.breakdown?.serviceCharge || 0}</span>
                      <span>• WiFi: ৳{selectedListing.utilityInfo.breakdown?.wifi || 0}</span>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    background: 'var(--brand-primary-subtle)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--brand-primary-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 600 }}>Total Estimated:</span>
                  <span className="font-mono" style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    <span className="taka-symbol">৳</span>{(selectedListing.rentAmount + (selectedListing.utilityInfo?.totalUtility || 0)).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
                  Features & House Rules:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selectedListing.amenities.map((a) => (
                    <span
                      key={a}
                      style={{
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.68rem',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        textTransform: 'capitalize',
                      }}
                    >
                      ✓ {a.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {selectedListing.description}
              </p>
            </div>

            {/* Bottom Contact Bar & Navigation Action */}
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                background: 'var(--bg-surface-1)',
                borderTop: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 10,
              }}
            >
              {/* 🧭 Start Journey Road Navigation Button */}
              <button
                onClick={() => {
                  setActiveRouteListing(selectedListing);
                  setSelectedListing(null);
                  setActiveTab('radar');
                }}
                className="btn-surface"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  padding: '8px',
                  borderColor: '#38bdf8',
                  color: '#38bdf8',
                  fontWeight: 700,
                }}
              >
                <Navigation size={13} /> 🧭 Start Journey (View Walking Road Route)
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={() => handleStartCall(selectedListing)}
                  className="btn-surface"
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '9px' }}
                >
                  <PhoneCall size={14} style={{ color: 'var(--brand-primary)' }} /> In-App Call
                </button>

                <button
                  onClick={() => {
                    setActiveChatListing(selectedListing);
                    setSelectedListing(null);
                  }}
                  className="btn-terracotta"
                  style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '9px' }}
                >
                  <MessageSquare size={14} /> In-App Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: IN-APP PRIVATE CHAT & CLOSE CHAT                                 */}
        {/* ========================================================================= */}
        {activeChatListing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--bg-main)',
              zIndex: 2600,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--bg-surface-1)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setActiveChatListing(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <ArrowLeft size={14} />
                </button>
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                    {activeChatListing.landlord.name}
                  </h4>
                  <p style={{ fontSize: '0.64rem', color: 'var(--brand-primary)' }}>
                    🔒 Number Masked • Secure
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => handleStartCall(activeChatListing)}
                  className="btn-surface"
                  style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                >
                  <Phone size={11} style={{ color: 'var(--brand-primary)' }} /> Call
                </button>
                <button
                  onClick={() => handleCloseChat(activeChatListing._id)}
                  className="btn-danger-subtle"
                  style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                >
                  Close 🛑
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(chatMessages[activeChatListing._id] || []).map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: 'center',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        textAlign: 'center',
                        maxWidth: '92%',
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                }

                const isMe = msg.sender === 'tenant';
                return (
                  <div
                    key={msg.id}
                    className="animate-message"
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      background: isMe ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                      color: '#fff',
                      padding: '7px 11px',
                      borderRadius: isMe ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      maxWidth: '82%',
                      fontSize: '0.78rem',
                      border: isMe ? 'none' : '1px solid var(--border-subtle)',
                    }}
                  >
                    {msg.text}
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '8px 10px',
                background: 'var(--bg-surface-1)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '6px',
              }}
            >
              <input
                type="text"
                disabled={isChatClosed[activeChatListing._id]}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isChatClosed[activeChatListing._id] ? 'Conversation is closed.' : 'Type message...'}
                style={{
                  flex: 1,
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  outline: 'none',
                }}
              />
              <button
                disabled={isChatClosed[activeChatListing._id]}
                onClick={handleSendMessage}
                style={{
                  background: isChatClosed[activeChatListing._id] ? 'var(--bg-surface-3)' : 'var(--brand-primary)',
                  border: 'none',
                  color: '#fff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  cursor: isChatClosed[activeChatListing._id] ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: IN-APP VOICE CALL SCREEN                                         */}
        {/* ========================================================================= */}
        {activeCall && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, #241f1a 0%, #110f0d 100%)',
              zIndex: 3000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '50px 18px 36px 18px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--brand-primary-border)',
                  borderRadius: '50%',
                  margin: '0 auto 12px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(201, 114, 45, 0.25)',
                }}
              >
                <Building size={30} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                {activeCall.listing.landlord.name}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', marginTop: '2px' }}>
                {activeCall.listing.title}
              </p>
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '0.8rem',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 700,
                  color: activeCall.status === 'connected' ? '#9fe3c2' : '#f6cd8b',
                }}
              >
                {activeCall.status === 'ringing'
                  ? '🔔 Ringing (In-App Call)...'
                  : `● Connected (00:${activeCall.duration < 10 ? `0${activeCall.duration}` : activeCall.duration})`}
              </div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                🔒 Zero Phone Number Exposure
              </p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '24px' }}>
              <button
                onClick={() =>
                  setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
                }
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: activeCall.isMuted ? '#944138' : 'var(--bg-surface-2)',
                  border: '1px solid var(--border-medium)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeCall.isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-medium)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#944138',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(148, 65, 56, 0.45)',
              }}
            >
              <PhoneOff size={22} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📍 1:1 FOODPANDA STYLE LOCATION SELECTOR & LIVE AUTOCOMPLETE SEARCH       */}
        {/* ========================================================================= */}
        {showLocationModal && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#14120f',
              zIndex: 2700,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease forwards',
            }}
          >
            {/* VIEW 1: SAVED ADDRESSES & RECENTS LIST (Exact Screenshot 1) */}
            {locationModalView === 'saved_list' && (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#14120f',
                  padding: '16px 14px',
                  overflowY: 'auto',
                }}
              >
                {/* Top Header: Country & Close */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🇧🇩</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Bangladesh</span>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
                  >
                    ✕
                  </button>
                </div>

                {/* Use My Current Location Action Button */}
                <div
                  onClick={() => {
                    detectLiveGPS();
                    setShowLocationModal(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 4px 12px 4px',
                    cursor: 'pointer',
                    color: '#38bdf8',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '10px',
                  }}
                >
                  <Navigation size={16} style={{ transform: 'rotate(-45deg)', color: '#38bdf8' }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}>
                    Use my current location
                  </span>
                </div>

                {/* Featured Active Selected Address Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(35, 30, 25, 0.95), rgba(50, 42, 32, 0.95))',
                    border: '1px solid var(--brand-primary-border)',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
                    {/* Radio Dot (Filled Dark Dot) */}
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px', flexShrink: 0 }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-primary)' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                        {userLocation.name}
                      </h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Dhaka • Currently Active Anchor
                      </p>
                    </div>
                  </div>
                  <span style={{ color: 'var(--brand-primary)', fontSize: '0.9rem', flexShrink: 0 }}>✏️</span>
                </div>

                {/* Scrollable Saved Addresses List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', paddingRight: '2px' }}>
                  {savedAddresses.map((addr) => {
                    const isCurrent = userLocation.name === addr.title;
                    if (isCurrent) return null;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setUserLocation({
                            name: addr.title,
                            lat: addr.lat,
                            lng: addr.lng,
                            isLiveGPS: false,
                            isDetecting: false,
                          });
                          setActiveRouteListing(null);
                          setShowLocationModal(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 8px',
                          borderBottom: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
                          {/* Radio Circle (Unfilled) */}
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {addr.title}
                            </h5>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                              {addr.subtitle}
                            </p>
                          </div>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>✏️</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action: + Add New Address (Opens Search View) */}
                <button
                  onClick={() => {
                    setLocationModalView('search_screen');
                    setLocationSearchQuery('');
                  }}
                  className="btn-terracotta"
                  style={{
                    width: '100%',
                    padding: '11px',
                    justifyContent: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    gap: '8px',
                    borderRadius: '10px',
                    marginTop: '10px',
                  }}
                >
                  <Plus size={16} /> Add / Search New Address
                </button>
              </div>
            )}

            {/* VIEW 2: INTERACTIVE PIN-DROP STREET MAP & LIVE ADDRESS SELECTOR (Foodpanda / Pathao Style) */}
            {locationModalView === 'search_screen' && (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#14120f',
                  overflow: 'hidden',
                }}
              >
                {/* Top Half: Interactive Pannable Street Map with Animated Center Pin */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden', flexShrink: 0, borderBottom: '1px solid var(--border-medium)' }}>
                  <RealDhakaStreetLeafletMap
                    key="stable-picker-map-instance"
                    userLocation={{ lat: userLocation.lat, lng: userLocation.lng, name: userLocation.name }}
                    listings={[]}
                    showFullControls={false}
                    interactivePin={true}
                    onCenterChange={handleMapCenterChange}
                    flyToLocation={mapFlyTarget}
                    mapHeight="220px"
                  />

                  {/* Close / Back button top left */}
                  <button
                    onClick={() => setLocationModalView('saved_list')}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      zIndex: 600,
                      background: 'rgba(20, 18, 15, 0.92)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {/* GPS Target button top right */}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const lat = pos.coords.latitude;
                            const lng = pos.coords.longitude;
                            setMapFlyTarget({ lat, lng, timestamp: Date.now() });
                          },
                          () => {
                            detectLiveGPS();
                          },
                          { enableHighAccuracy: true }
                        );
                      } else {
                        detectLiveGPS();
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 600,
                      background: 'rgba(20, 18, 15, 0.92)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      cursor: 'pointer',
                    }}
                    title="Locate my GPS"
                  >
                    <Crosshair size={16} />
                  </button>

                  {/* Floating Drag Helper Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 600,
                      background: 'rgba(20, 18, 15, 0.9)',
                      border: '1px solid var(--border-subtle)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.66rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      color: '#38bdf8',
                      backdropFilter: 'blur(4px)',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    📍 Drag map to pinpoint location
                  </div>
                </div>

                {/* Bottom Half: Live Address Details & Confirmation Card */}
                <div
                  style={{
                    flex: 1,
                    background: 'var(--bg-main)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    overflowY: 'auto',
                  }}
                >
                  {/* Search Input Bar (Quick Landmark Flying) */}
                  <div
                    style={{
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '10px',
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <Search size={14} style={{ color: 'var(--brand-primary)' }} />
                    <input
                      type="text"
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                      placeholder="Search landmark (Jamuna, KFC, Apollo, Kuril, NSU)..."
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.8rem',
                        width: '100%',
                        outline: 'none',
                      }}
                    />
                    {locationSearchQuery && (
                      <button
                        onClick={() => setLocationSearchQuery('')}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Quick Fly Results List (if user is actively typing) */}
                  {locationSearchQuery && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '4px', background: 'var(--bg-surface-1)' }}>
                      {isNominatimLoading && (
                        <div style={{ padding: '6px 8px', fontSize: '0.7rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RefreshCw size={11} className="spin" /> Searching Dhaka map...
                        </div>
                      )}

                      {(() => {
                        const localResults = searchDhakaLandmarks(locationSearchQuery);
                        const combined = [...localResults, ...nominatimResults];

                        if (combined.length === 0 && !isNominatimLoading) {
                          return (
                            <div style={{ padding: '12px 6px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                              No results found for "{locationSearchQuery}"
                            </div>
                          );
                        }

                        return combined.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            onClick={() => {
                              // Fly map center to this search result
                              setPinnedLocation((prev) => ({
                                ...prev,
                                lat: item.lat,
                                lng: item.lng,
                                name: item.name,
                                area: item.subtitle || `${item.area}, Dhaka`,
                              }));
                              setMapFlyTarget({ lat: item.lat, lng: item.lng, timestamp: Date.now() });
                              setLocationSearchQuery('');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              background: 'var(--bg-surface-2)',
                              borderBottom: '1px solid var(--border-subtle)',
                            }}
                          >
                            <MapPin size={13} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                              </p>
                              <p style={{ fontSize: '0.64rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.subtitle || `${item.area}, Dhaka`}
                              </p>
                            </div>
                            <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 700 }}>Fly ➔</span>
                          </div>
                        ));
                      })()}
                    </div>
                  )}

                  {/* 📍 Live Pinned Location Details Card (Foodpanda / Pathao Style) */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 26, 22, 0.95), rgba(45, 38, 30, 0.95))',
                      border: '1px solid var(--brand-primary-border)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ background: 'rgba(201, 114, 45, 0.2)', padding: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' }}>
                        <MapPin size={14} style={{ color: 'var(--brand-primary)' }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                            Pinned Location {isPinGeocoding && <span style={{ color: '#38bdf8' }}>• Detecting...</span>}
                          </span>
                          <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                            {pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}
                          </span>
                        </div>

                        {/* Editable Address / Landmark Name */}
                        <input
                          type="text"
                          value={pinnedLocation.name}
                          onChange={(e) => setPinnedLocation({ ...pinnedLocation, name: e.target.value })}
                          placeholder="e.g. Shah Manjil, House 12, Road 4..."
                          style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: '1px dashed var(--border-medium)',
                            padding: '4px 0',
                            color: '#fff',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            width: '100%',
                            outline: 'none',
                          }}
                        />

                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          📍 {pinnedLocation.area}
                        </p>
                      </div>
                    </div>

                    {/* Address Tag Chips (Home, Work, Campus, Partner, Other) */}
                    <div>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                        Label As:
                      </span>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {[
                          { id: 'Home', icon: '🏠' },
                          { id: 'Campus', icon: '🎓' },
                          { id: 'Work', icon: '💼' },
                          { id: 'Partner', icon: '❤️' },
                          { id: 'Other', icon: '📍' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setPinnedLocation({ ...pinnedLocation, tag: t.id })}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.66rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                              background: pinnedLocation.tag === t.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                              color: pinnedLocation.tag === t.id ? '#fff' : 'var(--text-secondary)',
                              border: `1px solid ${pinnedLocation.tag === t.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                              cursor: 'pointer',
                            }}
                          >
                            {t.icon} {t.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Floor / Building Details (Optional) */}
                    <input
                      type="text"
                      value={pinnedLocation.customBuilding}
                      onChange={(e) => setPinnedLocation({ ...pinnedLocation, customBuilding: e.target.value })}
                      placeholder="Floor / Unit / Note (e.g. 4th Floor, Opposite of Boro Masjid)..."
                      style={{
                        background: 'var(--bg-surface-1)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        color: '#fff',
                        fontSize: '0.72rem',
                        outline: 'none',
                        width: '100%',
                      }}
                    />
                  </div>

                  {/* 🔘 Confirm & Select Address Button */}
                  <button
                    onClick={() => {
                      const fullTitle = pinnedLocation.customBuilding
                        ? `${pinnedLocation.name} (${pinnedLocation.customBuilding})`
                        : pinnedLocation.name;

                      // Add to saved addresses list
                      setSavedAddresses((prev) => {
                        const exists = prev.some((a) => a.title === fullTitle);
                        if (!exists) {
                          return [
                            {
                              id: `saved-${Date.now()}`,
                              title: fullTitle,
                              subtitle: pinnedLocation.area || 'Dhaka',
                              lat: pinnedLocation.lat,
                              lng: pinnedLocation.lng,
                            },
                            ...prev,
                          ];
                        }
                        return prev;
                      });

                      // Set active location
                      setUserLocation({
                        name: fullTitle,
                        lat: pinnedLocation.lat,
                        lng: pinnedLocation.lng,
                        isLiveGPS: false,
                        isDetecting: false,
                      });
                      setActiveRouteListing(null);
                      setShowLocationModal(false);
                    }}
                    className="btn-terracotta"
                    style={{
                      width: '100%',
                      padding: '12px',
                      justifyContent: 'center',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      gap: '8px',
                      borderRadius: '10px',
                      marginTop: 'auto',
                    }}
                  >
                    <Check size={16} /> Confirm Location & Use Address
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🎛️ FILTER BOTTOM SHEET MODAL (Foodpanda / BDToLet Inspired)                */}
        {/* ========================================================================= */}
        {showFilterDrawer && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 3500,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              animation: 'fadeIn 0.2s ease',
            }}
            onClick={() => setShowFilterDrawer(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-main)',
                borderTopLeftRadius: '22px',
                borderTopRightRadius: '22px',
                border: '1px solid var(--border-medium)',
                borderBottom: 'none',
                maxHeight: '85%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Drawer Pull Bar & Header */}
              <div
                style={{
                  padding: '12px 16px 10px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface-1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                    }}
                  >
                    <SlidersHorizontal size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      সার্চ ও ফিল্টার সেটিংস
                    </h3>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', margin: 0 }}>
                      আপনার পছন্দমতো বাসা ও মেস খুঁজুন
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilterDrawer(false)}
                  style={{
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable Filter Options */}
              <div
                style={{
                  padding: '14px 16px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* 1. ক্যাটাগরি */}
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    🔲 প্রোপার্টি ক্যাটাগরি
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'all', label: 'সব ক্যাটাগরি' },
                      { id: 'seat', label: '🛏️ সিট / মেস' },
                      { id: 'room', label: '🚪 সিঙ্গেল রুম' },
                      { id: 'dining_space', label: '🍽️ ডাইনিং স্পেস' },
                      { id: 'sublet', label: '🏡 সাবলেট' },
                      { id: 'full_flat', label: '🏢 ফুল ফ্ল্যাট' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCategory(c.id)}
                        style={{
                          padding: '7px 4px',
                          borderRadius: '8px',
                          fontSize: '0.68rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 700,
                          background: selectedCategory === c.id ? '#10b981' : 'var(--bg-surface-2)',
                          color: selectedCategory === c.id ? '#ffffff' : 'var(--text-secondary)',
                          border: `1px solid ${selectedCategory === c.id ? '#10b981' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. ভাড়াটিয়ার ধরন */}
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    👨‍👩‍👧 ভাড়াটিয়ার ধরন (Tenant Type)
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'all', label: 'সবাই (All)' },
                      { id: 'bachelor_male', label: '👨 ব্যাচেলর ছেলে / ছাত্র' },
                      { id: 'bachelor_female', label: '👩 ছাত্রী / কর্মজীবী নারী' },
                      { id: 'family', label: '👨‍👩‍👧 ফ্যামিলি' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTenantType(t.id)}
                        style={{
                          padding: '7px 8px',
                          borderRadius: '8px',
                          fontSize: '0.68rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 700,
                          textAlign: 'left',
                          background: selectedTenantType === t.id ? '#10b981' : 'var(--bg-surface-2)',
                          color: selectedTenantType === t.id ? '#ffffff' : 'var(--text-secondary)',
                          border: `1px solid ${selectedTenantType === t.id ? '#10b981' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. সর্বোচ্চ বাজেট স্লাইডার */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                      💰 সর্বোচ্চ মাসিক বাজেট
                    </span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                      ৳{maxRent.toLocaleString('en-IN')} / মাস
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1500}
                    max={50000}
                    step={500}
                    value={maxRent}
                    onChange={(e) => setMaxRent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', gap: '5px', marginTop: '6px', overflowX: 'auto' }}>
                    {[3000, 5000, 8000, 15000, 30000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setMaxRent(amt)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.64rem',
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 700,
                          background: maxRent === amt ? '#10b981' : 'var(--bg-surface-2)',
                          color: maxRent === amt ? '#ffffff' : 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ৳{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. দূরত্ব / রেডিয়াস */}
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    📍 বর্তমান লোকেশন থেকে দূরত্ব
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                    {[
                      { dist: 0.8, label: '৮০০ মিটার' },
                      { dist: 2.0, label: '২ কিমি' },
                      { dist: 3.5, label: '৩.৫ কিমি' },
                      { dist: 999, label: 'পুরো ঢাকা' },
                    ].map((d) => (
                      <button
                        key={d.dist}
                        type="button"
                        onClick={() => setSelectedRadiusKm(d.dist)}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '8px',
                          fontSize: '0.66rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 700,
                          textAlign: 'center',
                          background: selectedRadiusKm === d.dist ? '#10b981' : 'var(--bg-surface-2)',
                          color: selectedRadiusKm === d.dist ? '#ffffff' : 'var(--text-secondary)',
                          border: `1px solid ${selectedRadiusKm === d.dist ? '#10b981' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. বিশেষ সুবিধা / Amenities */}
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    🛋️ বিশেষ সুবিধা (Amenities)
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'wifi', label: '📶 ওয়াইফাই' },
                      { id: 'lift', label: '🛗 লিফট' },
                      { id: 'generator', label: '⚡ ব্যাকআপ' },
                      { id: 'meal_system', label: '🍲 মিল সিস্টেম' },
                      { id: 'attached_bath', label: '🚿 বাথরুম' },
                      { id: 'no_curfew', label: '🌙 কারফিউ নেই' },
                    ].map((a) => {
                      const isChecked = selectedAmenities.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            setSelectedAmenities((prev) =>
                              isChecked ? prev.filter((item) => item !== a.id) : [...prev, a.id]
                            );
                          }}
                          style={{
                            padding: '6px 4px',
                            borderRadius: '8px',
                            fontSize: '0.66rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            background: isChecked ? '#10b981' : 'var(--bg-surface-2)',
                            color: isChecked ? '#ffffff' : 'var(--text-secondary)',
                            border: `1px solid ${isChecked ? '#10b981' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                          }}
                        >
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Buttons */}
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-1)',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedTenantType('all');
                    setMaxRent(30000);
                    setSelectedRadiusKm(3.5);
                    setSelectedAmenities([]);
                  }}
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    borderRadius: '10px',
                    padding: '11px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <RefreshCw size={14} /> রিসেট
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer(false)}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '11px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Check size={16} /> ফিল্টার দেখুন ({filteredListings.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🗺️ INTERACTIVE POST LOCATION PICKER MODAL (Pin-Drop on Leaflet Street Map) */}
        {/* ========================================================================= */}
        {showPostLocationPicker && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 3600,
              background: '#110f0d',
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {/* Header with Back & Title */}
            <div
              style={{
                padding: '12px 14px',
                background: 'var(--bg-surface-1)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPostLocationPicker(false)}
                  style={{
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {postPickerTarget === 'landlord' ? 'ম্যাপে বাসার অবস্থান পিন করুন' : 'যেখানে বাসা খুঁজছেন তা পিন করুন'}
                  </h4>
                  <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', margin: '1px 0 0' }}>
                    ম্যাপ ড্র্যাগ করে বা সার্চ করে পয়েন্ট নির্বাচন করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        setPostPickerPinned((prev) => ({
                          ...prev,
                          lat,
                          lng,
                          name: 'Live GPS Point',
                        }));
                        setPostPickerFlyTarget({ lat, lng, timestamp: Date.now() });
                      },
                      () => detectLiveGPS(),
                      { enableHighAccuracy: true }
                    );
                  } else {
                    detectLiveGPS();
                  }
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  borderRadius: '20px',
                  padding: '5px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                }}
              >
                <Crosshair size={12} /> লাইভ GPS
              </button>
            </div>

            {/* Live Search Bar for Landmarks / Roads */}
            <div style={{ padding: '10px 14px 6px', background: 'var(--bg-surface-1)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '7px 12px',
                  gap: '8px',
                }}
              >
                <Search size={14} style={{ color: 'var(--brand-primary)' }} />
                <input
                  type="text"
                  placeholder="রোড বা এলাকার নাম লিখে সার্চ করুন (যেমন: সাঈদনগর, উত্তরা রোড ৬...)"
                  value={postPickerSearchQuery}
                  onChange={(e) => setPostPickerSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.78rem',
                    outline: 'none',
                  }}
                />
                {postPickerSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setPostPickerSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quick Area Preset Chips */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', padding: '8px 0 2px' }}>
                {[
                  { name: 'House 14, Road 6, Sector 4, Uttara (TechDojo)', area: 'Uttara', lat: 23.8638, lng: 90.4005, label: '🏢 TechDojo (Uttara Rd 6)' },
                  { name: 'Shah Manjil, Sayeednagar Boro Masjid Road', area: 'Saidnagar', lat: 23.7995, lng: 90.4420, label: '🏠 সাঈদনগর ১০০ ফিট' },
                  { name: 'Bashundhara R/A Block C, Near NSU', area: 'Bashundhara R/A', lat: 23.8165, lng: 90.4285, label: '🎓 বসুন্ধরা (NSU/IUB)' },
                  { name: 'Mirpur 10 Circle & Metro Station', area: 'Mirpur', lat: 23.8070, lng: 90.3685, label: '🏛️ মিরপুর ১০' },
                  { name: 'Aftabnagar Block B (East West)', area: 'Aftabnagar', lat: 23.7680, lng: 90.4350, label: '🎓 আফতাবনগর' },
                  { name: 'Gulshan 1 Circle', area: 'Gulshan', lat: 23.7780, lng: 90.4170, label: '🏢 গুলশান ১' },
                ].map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectPostPickerPreset(item)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '4px 9px',
                      borderRadius: '16px',
                      fontSize: '0.68rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      background: 'var(--bg-surface-2)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Autocomplete Dropdown */}
            {postPickerSearchQuery && (
              <div
                style={{
                  maxHeight: '130px',
                  overflowY: 'auto',
                  background: 'var(--bg-surface-1)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '4px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  zIndex: 20,
                }}
              >
                {(() => {
                  const matches = searchDhakaLandmarks(postPickerSearchQuery);
                  if (matches.length === 0) {
                    return (
                      <div style={{ padding: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        "{postPickerSearchQuery}" দিয়ে কোনো ল্যান্ডমার্ক পাওয়া যায়নি
                      </div>
                    );
                  }
                  return matches.map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        handleSelectPostPickerPreset(m);
                        setPostPickerSearchQuery('');
                      }}
                      style={{
                        padding: '6px 8px',
                        background: 'var(--bg-surface-2)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <MapPin size={12} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.64rem', color: '#38bdf8', fontWeight: 700, flexShrink: 0 }}>পয়েন্ট যান ➔</span>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* Interactive Leaflet Map for Pin Drop */}
            <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
              <RealDhakaStreetLeafletMap
                listings={listings}
                userLocation={{
                  lat: postPickerPinned.lat,
                  lng: postPickerPinned.lng,
                  name: postPickerPinned.name,
                }}
                interactivePin={true}
                onCenterChange={handlePostPickerMapCenterChange}
                flyToLocation={postPickerFlyTarget}
                mapHeight="100%"
                showFullControls={false}
              />

              {/* Floating Pin Helper Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 600,
                  background: 'rgba(17, 15, 13, 0.92)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981' }}>
                  সঠিক বাড়ির পয়েন্টে ম্যাপটি সরান
                </span>
              </div>
            </div>

            {/* Bottom Address Confirmation Card */}
            <div
              style={{
                background: 'var(--bg-surface-1)',
                borderTop: '1px solid var(--border-subtle)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' }}>
                  <MapPin size={16} style={{ color: '#10b981' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.64rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
                      চিহ্নিত অবস্থান (Selected Location)
                    </span>
                    <span style={{ fontSize: '0.64rem', color: '#38bdf8', fontFamily: 'JetBrains Mono' }}>
                      {postPickerPinned.lat.toFixed(4)}° N, {postPickerPinned.lng.toFixed(4)}° E
                    </span>
                  </div>
                  <input
                    type="text"
                    value={postPickerPinned.name}
                    onChange={(e) => setPostPickerPinned({ ...postPickerPinned, name: e.target.value })}
                    placeholder="রোড বা এলাকার নাম..."
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px dashed var(--border-medium)',
                      padding: '3px 0',
                      color: '#fff',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      outline: 'none',
                      marginTop: '2px',
                    }}
                  />
                </div>
              </div>

              {/* Building / Floor / Landmark Note */}
              <input
                type="text"
                value={postPickerPinned.customBuilding}
                onChange={(e) => setPostPickerPinned({ ...postPickerPinned, customBuilding: e.target.value })}
                placeholder="বাড়ি নং / ফ্লোর / ল্যান্ডমার্ক নোট (যেমন: শাহ মঞ্জিল, ৬ষ্ঠ তলা, বড় মসজিদের বিপরীতে)..."
                style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  color: '#fff',
                  fontSize: '0.74rem',
                  outline: 'none',
                  width: '100%',
                }}
              />

              {/* Confirm & Set Location Button */}
              <button
                type="button"
                onClick={handleConfirmPostLocation}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Check size={16} /> এই লোকেশন নিশ্চিত করুন (Set Post Location)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🔔 NATIVE IN-APP TOAST NOTIFICATION (Zero ugly browser popups!)             */}
        {/* ========================================================================= */}
        {toast.visible && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              zIndex: 9999,
              background: 'rgba(18, 16, 14, 0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${
                toast.type === 'gps'
                  ? 'rgba(56, 189, 248, 0.6)'
                  : toast.type === 'delete' || toast.type === 'error'
                  ? 'rgba(239, 68, 68, 0.6)'
                  : 'rgba(16, 185, 129, 0.6)'
              }`,
              borderRadius: '14px',
              padding: '12px 14px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              animation: 'slideDownToast 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background:
                    toast.type === 'gps'
                      ? 'rgba(56, 189, 248, 0.15)'
                      : toast.type === 'delete' || toast.type === 'error'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                  color:
                    toast.type === 'gps'
                      ? '#38bdf8'
                      : toast.type === 'delete' || toast.type === 'error'
                      ? '#ef4444'
                      : '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                {toast.type === 'gps' ? (
                  <Crosshair size={18} />
                ) : toast.type === 'delete' ? (
                  <Trash2 size={18} />
                ) : toast.type === 'error' ? (
                  <Info size={18} />
                ) : (
                  <CheckCircle2 size={18} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.35, whiteSpace: 'pre-line' }}>
                  {toast.message}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: 'var(--text-muted)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🛑 IN-APP ACTION CONFIRMATION MODAL (Zero browser confirm() popups!)        */}
        {/* ========================================================================= */}
        {confirmModal.visible && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 9998,
              background: 'rgba(0, 0, 0, 0.78)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div
              style={{
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '20px 18px',
                width: '100%',
                maxWidth: '320px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                animation: 'scaleUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 12px',
                }}
              >
                {confirmModal.icon || '⚠️'}
              </div>

              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                {confirmModal.title}
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0 0 18px', lineHeight: 1.45 }}>
                {confirmModal.message}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, visible: false }))}
                  style={{
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {confirmModal.cancelText || 'বাতিল'}
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  style={{
                    background: confirmModal.confirmColor || '#ef4444',
                    border: 'none',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                  }}
                >
                  {confirmModal.confirmText || 'নিশ্চিত করুন'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

