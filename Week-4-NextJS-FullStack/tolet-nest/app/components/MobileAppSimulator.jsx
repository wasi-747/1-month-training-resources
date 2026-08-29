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
  Building
} from 'lucide-react';

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
  { id: 'bashundhara', name: 'Bashundhara R/A (NSU)', lat: 23.8165, lng: 90.4285 },
  { id: 'badda', name: 'Middle Badda (Link Road)', lat: 23.7812, lng: 90.4260 },
  { id: 'aftabnagar', name: 'Aftabnagar (East West)', lat: 23.7680, lng: 90.4350 },
  { id: 'gulshan', name: 'Gulshan 1 Circle', lat: 23.7808, lng: 90.4152 },
  { id: 'dhanmondi', name: 'Dhanmondi 27', lat: 23.7538, lng: 90.3742 },
  { id: 'mirpur', name: 'Mirpur 10 Metro', lat: 23.8071, lng: 90.3685 },
  { id: 'saidnagar', name: 'Saidnagar 100 Feet', lat: 23.7995, lng: 90.4420 },
];

export default function MobileAppSimulator({ listings, onRefresh }) {
  // Mobile Simulator State
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'explore' | 'post' | 'messages' | 'saved'
  const [selectedListing, setSelectedListing] = useState(null);
  const [savedListingIds, setSavedListingIds] = useState(['listing-1']);

  // Mobile Fast Posting State (P2P Student Sublet / Seat / Landlord)
  const [mobilePostData, setMobilePostData] = useState({
    posterRole: 'student_outgoing', // 'student_outgoing' | 'flatmate' | 'sublet_host' | 'landlord'
    title: '',
    area: 'Bashundhara R/A',
    addressText: '',
    rentAmount: '',
    utilityAmount: '800',
    tenantType: 'bachelor_male',
    propertyType: 'single_room',
    amenities: ['wifi', 'gas'],
    posterName: 'Wasiur Rahman (Student)',
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

  // Auto-Detect Real Browser / Device GPS
  const detectLiveGPS = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setUserLocation((prev) => ({ ...prev, isDetecting: true }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({
            name: `Live GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
            lat,
            lng,
            isLiveGPS: true,
            isDetecting: false,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setUserLocation((prev) => ({ ...prev, isDetecting: false }));
          alert('GPS permission not allowed. You can choose a Dhaka location preset from the list!');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Attempt auto-detection on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            name: `Your Real Location (${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)})`,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            isLiveGPS: true,
            isDetecting: false,
          });
        },
        () => {
          // Fallback gracefully to default without prompt error
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'seat' | 'room' | 'dining_space' | 'sublet' | 'full_flat'
  const [selectedTenantType, setSelectedTenantType] = useState('all');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [maxRent, setMaxRent] = useState(30000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

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

  // Dynamically compute distances based on active userLocation (Real GPS or Selected Dhaka Hub)
  const listingsWithDistance = listings.map((item) => {
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
      alert('This conversation is closed.');
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
    if (confirm('Close chat and end negotiation? The landlord will no longer be able to message or call you.')) {
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
    }
  };

  // Fast Mobile Post Handler (For Students, Flatmates & Landlords)
  const handleMobileSubmitPost = async (e) => {
    e.preventDefault();
    if (!mobilePostData.title || !mobilePostData.rentAmount) {
      alert('Please enter a listing title and monthly rent');
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
        addressText: mobilePostData.addressText || `${mobilePostData.area}, Dhaka`,
        propertyType: mobilePostData.propertyType,
        tenantType: mobilePostData.tenantType,
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
        alert('🎉 To-Let / Seat published successfully from your mobile! It is now live on the Dhaka Radar.');
        if (onRefresh) onRefresh();
        setActiveTab('radar');
        setMobilePostData({
          posterRole: 'student_outgoing',
          title: '',
          area: 'Bashundhara R/A',
          addressText: '',
          rentAmount: '',
          utilityAmount: '800',
          tenantType: 'bachelor_male',
          propertyType: 'single_room',
          amenities: ['wifi', 'gas'],
          posterName: 'Wasiur Rahman (Student)',
          phone: '01700-123456',
        });
      } else {
        alert('Failed to publish listing.');
      }
    } catch (err) {
      console.error(err);
      alert('Error publishing listing.');
    } finally {
      setIsPostingFromMobile(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {/* Smartphone Frame (Warm Charcoal & Espresso Shell) */}
      <div className="smartphone-frame">
        {/* Top Notch */}
        <div className="smartphone-notch">
          <div className="smartphone-camera" />
          <div className="smartphone-speaker" />
        </div>

        {/* Status Bar */}
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
          {/* TAB 1: 📍 DHAKA ARCHITECTURAL PROXIMITY RADAR                            */}
          {/* ========================================================================= */}
          {activeTab === 'radar' && (
            <div style={{ padding: '14px' }}>
              {/* Header & Interactive GPS Switcher */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={16} style={{ color: 'var(--brand-primary)' }} />
                    <h2 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                      Proximity Radar
                    </h2>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={detectLiveGPS}
                      title="Auto-Detect My Current Device GPS"
                      style={{
                        background: userLocation.isLiveGPS ? 'rgba(61, 120, 93, 0.2)' : 'var(--bg-surface-2)',
                        border: `1px solid ${userLocation.isLiveGPS ? 'rgba(61, 120, 93, 0.5)' : 'var(--border-subtle)'}`,
                        color: userLocation.isLiveGPS ? '#9fe3c2' : 'var(--brand-primary)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontFamily: 'Space Grotesk',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MapPin size={11} /> {userLocation.isDetecting ? 'Detecting...' : userLocation.isLiveGPS ? 'Live GPS Active' : 'Detect My GPS'}
                    </button>
                    <button
                      onClick={onRefresh}
                      style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </div>

                {/* Location Quick Switcher Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className="sync-beacon" style={{ width: '6px', height: '6px', background: userLocation.isLiveGPS ? '#4ade80' : 'var(--brand-primary)' }} />
                    <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>
                      {userLocation.name}
                    </span>
                  </div>

                  <select
                    value={DHAKA_PRESETS.find((p) => p.name === userLocation.name)?.id || 'custom'}
                    onChange={(e) => {
                      const preset = DHAKA_PRESETS.find((p) => p.id === e.target.value);
                      if (preset) {
                        setUserLocation({
                          name: preset.name,
                          lat: preset.lat,
                          lng: preset.lng,
                          isLiveGPS: false,
                          isDetecting: false,
                        });
                      }
                    }}
                    style={{
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--brand-primary)',
                      fontSize: '0.68rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {DHAKA_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Architectural Dhaka Map Radar Texture */}
              <div className="dhaka-radar-container" style={{ height: '145px', marginBottom: '14px' }}>
                <div className="dhaka-map-texture" />
                <div className="dhaka-radar-dial">
                  <div className="dhaka-radar-beam" />
                </div>

                {/* Radar Concentric Rings */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70px', height: '70px', border: '1px solid rgba(201, 114, 45, 0.25)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120px', height: '120px', border: '1px solid rgba(201, 114, 45, 0.15)', borderRadius: '50%' }} />

                {/* User Center Coordinate Pin */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '10px',
                    height: '10px',
                    background: 'var(--brand-primary)',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px var(--brand-primary)',
                    zIndex: 10,
                  }}
                />

                {/* Property Pin Markers */}
                <div style={{ position: 'absolute', top: '32%', left: '28%', width: '8px', height: '8px', background: '#9fe3c2', borderRadius: '50%', boxShadow: '0 0 6px rgba(159, 227, 194, 0.6)' }} title="Block C" />
                <div style={{ position: 'absolute', top: '60%', left: '72%', width: '8px', height: '8px', background: '#9fe3c2', borderRadius: '50%', boxShadow: '0 0 6px rgba(159, 227, 194, 0.6)' }} title="Block D" />
                <div style={{ position: 'absolute', top: '24%', left: '68%', width: '8px', height: '8px', background: '#f6cd8b', borderRadius: '50%', boxShadow: '0 0 6px rgba(246, 205, 139, 0.6)' }} title="Saidnagar" />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    fontSize: '0.68rem',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 700,
                    color: 'var(--brand-primary)',
                    background: 'rgba(20, 18, 15, 0.85)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {nearbyListings.length} Units Located
                </div>
              </div>

              {/* Asymmetric Nearest Feed (Top Card Featured) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Closest Available To-Lets
                </span>

                {nearbyListings.slice(0, 4).map((item, idx) => {
                  const isFeatured = idx === 0;
                  return (
                    <div
                      key={item._id}
                      onClick={() => setSelectedListing(item)}
                      className={isFeatured ? 'card-featured' : 'card-surface'}
                      style={{
                        padding: '10px',
                        display: 'flex',
                        gap: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ position: 'relative', width: '74px', height: '74px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,18,15,0.7), transparent)' }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span
                            style={{
                              background: 'var(--brand-primary-subtle)',
                              color: 'var(--brand-primary)',
                              fontSize: '0.66rem',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                              padding: '2px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            📍 {item.distanceStr || (item.distanceKm ? `${item.distanceKm} km` : '350m')}
                          </span>
                          <span className="font-mono" style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>
                            <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}
                          </span>
                        </div>

                        <h4
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#fff',
                            margin: '3px 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </h4>

                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {item.area} • {item.propertyType.replace('_', ' ')}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                            +<span className="taka-symbol">৳</span>{(item.utilityInfo?.totalUtility || 0).toLocaleString()} Utils
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                            View ➔
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: 🔍 EXPLORE & CROSS-AREA SEARCH                                    */}
          {/* ========================================================================= */}
          {activeTab === 'explore' && (
            <div style={{ padding: '14px' }}>
              {/* Search Bar */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                <div
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                  }}
                >
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Gulshan, Bashundhara..."
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 6px',
                      fontSize: '0.8rem',
                      width: '100%',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                  style={{
                    background: showFilterDrawer ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                    color: showFilterDrawer ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <SlidersHorizontal size={14} />
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
                      No listings currently in "{searchQuery}"
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
                      onClick={() => setSelectedListing(item)}
                      className="card-surface"
                      style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ position: 'relative', height: '130px' }}>
                        <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,18,15,0.85) 0%, transparent 60%)' }} />

                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: 'rgba(20, 18, 15, 0.85)',
                            padding: '2px 7px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            color: '#fff',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          📍 {item.area}
                        </div>

                        <button
                          onClick={(e) => toggleSave(item._id, e)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(20, 18, 15, 0.85)',
                            border: '1px solid var(--border-subtle)',
                            color: savedListingIds.includes(item._id) ? 'var(--brand-primary)' : '#fff',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Bookmark size={12} fill={savedListingIds.includes(item._id) ? 'var(--brand-primary)' : 'none'} />
                        </button>
                      </div>

                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                            <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}> /mo</span>
                          </span>
                          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                            +<span className="taka-symbol">৳</span>{(item.utilityInfo?.totalUtility || 0).toLocaleString()} Utils
                          </span>
                        </div>

                        <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', margin: '3px 0' }}>
                          {item.title}
                        </h3>

                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          {item.addressText}
                        </p>

                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {item.amenities.slice(0, 3).map((a) => (
                            <span
                              key={a}
                              style={{
                                background: 'var(--bg-surface-2)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.64rem',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                textTransform: 'capitalize',
                              }}
                            >
                              {a.replace('_', ' ')}
                            </span>
                          ))}
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
          {/* TAB 4: 🔖 SAVED BOOKMARKS                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'saved' && (
            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Bookmark size={16} style={{ color: 'var(--brand-primary)' }} />
                <h2 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  Saved To-Lets ({savedListingIds.length})
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {listings
                  .filter((l) => savedListingIds.includes(l._id))
                  .map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedListing(item)}
                      className="card-surface"
                      style={{
                        padding: '10px',
                        display: 'flex',
                        gap: '10px',
                        cursor: 'pointer',
                        borderRadius: '10px',
                      }}
                    >
                      <img src={item.images[0]} alt={item.title} style={{ width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.area}</p>
                        <p className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                          <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ➕ FAST MOBILE POSTING (STUDENTS, FLATMATES & LANDLORDS)            */}
          {/* ========================================================================= */}
          {activeTab === 'post' && (
            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <PlusCircle size={16} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                    Post Seat / To-Let
                  </h2>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    For outgoing students, flatmates & property owners
                  </p>
                </div>
              </div>

              <form onSubmit={handleMobileSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Poster Role Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Posting As *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    {[
                      { id: 'student_outgoing', label: '🎓 Student (Seat)', desc: 'Replacing seat' },
                      { id: 'flatmate', label: '🤝 Flatmate', desc: 'Need roommate' },
                      { id: 'sublet_host', label: '🏡 Sublet Host', desc: 'Sublet room' },
                      { id: 'landlord', label: '🏛️ Landlord', desc: 'Property owner' },
                    ].map((role) => (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => setMobilePostData({ ...mobilePostData, posterRole: role.id })}
                        style={{
                          background: mobilePostData.posterRole === role.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                          color: mobilePostData.posterRole === role.id ? '#fff' : 'var(--text-secondary)',
                          border: `1px solid ${mobilePostData.posterRole === role.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}>{role.label}</div>
                        <div style={{ fontSize: '0.62rem', opacity: 0.8 }}>{role.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Seat Vacant in Bachelor Flat (Near NSU)"
                    value={mobilePostData.title}
                    onChange={(e) => setMobilePostData({ ...mobilePostData, title: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      padding: '7px 9px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Area & Address */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Dhaka Area *
                    </label>
                    <select
                      value={mobilePostData.area}
                      onChange={(e) => setMobilePostData({ ...mobilePostData, area: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '7px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        outline: 'none',
                      }}
                    >
                      {['Bashundhara R/A', 'Badda', 'Aftabnagar', 'Gulshan', 'Saidnagar', 'Dhanmondi', 'Mirpur', 'Uttara'].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Landmark / Road
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Block C, Road 4"
                      value={mobilePostData.addressText}
                      onChange={(e) => setMobilePostData({ ...mobilePostData, addressText: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '7px 9px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Base Rent & Utility */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Base Rent (৳) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5500"
                      value={mobilePostData.rentAmount}
                      onChange={(e) => setMobilePostData({ ...mobilePostData, rentAmount: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '7px 9px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        outline: 'none',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Est. Utility Bill (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 800"
                      value={mobilePostData.utilityAmount}
                      onChange={(e) => setMobilePostData({ ...mobilePostData, utilityAmount: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '7px 9px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        outline: 'none',
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                  </div>
                </div>

                {/* Transparent Total Preview */}
                {mobilePostData.rentAmount && (
                  <div
                    style={{
                      background: 'rgba(201, 114, 45, 0.1)',
                      border: '1px solid rgba(201, 114, 45, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Total Est. Monthly:</span>
                    <span className="font-mono" style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      <span className="taka-symbol">৳</span>
                      {(Number(mobilePostData.rentAmount || 0) + Number(mobilePostData.utilityAmount || 0)).toLocaleString()} /mo
                    </span>
                  </div>
                )}

                {/* Rental Category & Quantity */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                    Rental Type *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '6px' }}>
                    {[
                      { id: 'seat_rent', cat: 'seat', label: '🛏️ Seat (সিট)' },
                      { id: 'room_rent', cat: 'room', label: '🚪 Room (রুম)' },
                      { id: 'dining_space', cat: 'dining_space', label: '🍽️ Dining Space' },
                      { id: 'sublet', cat: 'sublet', label: '🏡 Sublet' },
                      { id: 'full_flat', cat: 'full_flat', label: '🏢 Full Flat' },
                      { id: 'master_bed', cat: 'room', label: '👑 Master Bed' },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setMobilePostData({ ...mobilePostData, propertyType: t.id, rentalCategory: t.cat })}
                        style={{
                          background: mobilePostData.propertyType === t.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                          color: mobilePostData.propertyType === t.id ? '#fff' : 'var(--text-secondary)',
                          border: `1px solid ${mobilePostData.propertyType === t.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                          padding: '5px 4px',
                          borderRadius: '5px',
                          fontSize: '0.66rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Quantity / Units & Preference */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Available Count *
                    </label>
                    <select
                      value={mobilePostData.quantityAvailable || 1}
                      onChange={(e) => setMobilePostData({ ...mobilePostData, quantityAvailable: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '7px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        outline: 'none',
                      }}
                    >
                      <option value="1">1 Unit / 1 Seat / 1 Room</option>
                      <option value="2">2 Units / 2 Seats / 2 Rooms</option>
                      <option value="3">3 Units / 3 Seats / 3 Rooms</option>
                      <option value="4">4+ Units (Full Flat/Mess)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      Tenant Preference
                    </label>
                    <select
                      value={mobilePostData.tenantType}
                      onChange={(e) => setMobilePostData({ ...mobilePostData, tenantType: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '7px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        outline: 'none',
                      }}
                    >
                      <option value="bachelor_male">Bachelor Male</option>
                      <option value="bachelor_female">Female Student</option>
                      <option value="job_holder">Job Holder</option>
                      <option value="family">Family</option>
                      <option value="any">Anyone</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPostingFromMobile}
                  className="btn-terracotta"
                  style={{ width: '100%', padding: '9px', fontSize: '0.82rem', marginTop: '4px' }}
                >
                  {isPostingFromMobile ? 'Publishing...' : '🚀 Publish Instantly to Dhaka Radar'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM TAB NAVIGATOR (5-Tab Seamless Switcher)                            */}
        {/* ========================================================================= */}
        <div
          style={{
            height: '56px',
            background: 'var(--bg-surface-1)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 40,
          }}
        >
          {[
            { id: 'radar', label: 'Radar', icon: Compass },
            { id: 'explore', label: 'Explore', icon: Search },
            { id: 'post', label: '+ Post', icon: PlusCircle, isHighlight: true },
            { id: 'messages', label: 'Chats', icon: MessageSquare },
            { id: 'saved', label: 'Saved', icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedListing(null);
                  setActiveChatListing(null);
                }}
                style={{
                  background: tab.isHighlight && isActive ? 'var(--brand-primary)' : 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  color: tab.isHighlight
                    ? isActive
                      ? '#fff'
                      : 'var(--brand-primary)'
                    : isActive
                    ? 'var(--brand-primary)'
                    : 'var(--text-muted)',
                  fontSize: '0.66rem',
                  fontFamily: 'Space Grotesk',
                  fontWeight: isActive || tab.isHighlight ? 700 : 500,
                  cursor: 'pointer',
                  padding: tab.isHighlight ? '4px 8px' : '2px',
                  borderRadius: tab.isHighlight ? '8px' : '0',
                }}
              >
                <Icon size={tab.isHighlight ? 18 : 16} strokeWidth={isActive ? 2.5 : 1.8} />
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
              zIndex: 60,
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

            {/* Bottom Contact Bar */}
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                background: 'var(--bg-surface-1)',
                borderTop: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                zIndex: 10,
              }}
            >
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
              zIndex: 70,
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
              zIndex: 80,
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
      </div>
    </div>
  );
}
