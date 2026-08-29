'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Compass,
  MessageSquare,
  Heart,
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
  CheckCircle,
  X,
  Share2,
  Info,
  DollarSign,
  Flame,
  Zap,
  Droplet,
  Wifi,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function MobileAppSimulator({ listings, onRefresh }) {
  // Mobile Simulator State
  const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'explore' | 'messages' | 'saved'
  const [selectedListing, setSelectedListing] = useState(null);
  const [savedListingIds, setSavedListingIds] = useState(['listing-1']);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
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
  const [activeCall, setActiveCall] = useState(null); // null | { listing, status: 'ringing' | 'connected', duration: number, isMuted: boolean }

  // Seed initial chat for demo
  useEffect(() => {
    setChatMessages({
      'listing-1': [
        { id: 1, sender: 'system', text: '🔒 Privacy Shield Active: This in-app chat is secure. Your personal phone number is hidden.' },
        { id: 2, sender: 'tenant', text: 'Assalamu Alaikum Uncle, is the master bed room still available for September?' },
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

  // Filtering Logic
  const filteredListings = listings.filter((item) => {
    // Search query matches title, area, or address
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.addressText.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Tenant type
    if (selectedTenantType !== 'all' && item.tenantType !== selectedTenantType && item.tenantType !== 'any') {
      return false;
    }

    // Room type
    if (selectedRoomType !== 'all' && item.propertyType !== selectedRoomType) {
      return false;
    }

    // Rent
    if (item.rentAmount > maxRent) return false;

    // Amenities
    if (selectedAmenities.length > 0) {
      const hasAll = selectedAmenities.every((a) => item.amenities.includes(a));
      if (!hasAll) return false;
    }

    return true;
  });

  // Nearby Listings for Radar (sorted by distance)
  const nearbyListings = [...listings].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  // Toggle Save Favorite
  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    setSavedListingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Start In-App Call
  const handleStartCall = (listing) => {
    setActiveCall({
      listing,
      status: 'ringing',
      duration: 0,
      isMuted: false,
    });

    // Auto connect after 2 seconds simulation
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2000);
  };

  // End In-App Call
  const handleEndCall = () => {
    if (activeCall) {
      const duration = activeCall.duration;
      const listingId = activeCall.listing._id;

      // Add call log notice to chat
      const logMsg = {
        id: Date.now(),
        sender: 'system',
        text: `📞 In-App Voice Call Ended (${duration > 0 ? `${duration} sec` : 'Cancelled'}) • Zero Phone Number Leak`,
      };

      setChatMessages((prev) => ({
        ...prev,
        [listingId]: [...(prev[listingId] || []), logMsg],
      }));
    }
    setActiveCall(null);
  };

  // Send Chat Message
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

    // Simulated quick reply from landlord
    setTimeout(() => {
      setChatMessages((prev) => ({
        ...prev,
        [listingId]: [
          ...(prev[listingId] || []),
          {
            id: Date.now() + 1,
            sender: 'landlord',
            text: 'Noted. When would you like to visit the room?',
          },
        ],
      }));
    }, 1500);
  };

  // One-Tap Close Chat (Anti-Harassment Shield)
  const handleCloseChat = (listingId) => {
    if (confirm('Are you sure you want to close this chat and end negotiation? The landlord will no longer be able to message or call you.')) {
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 10px' }}>
      {/* Smartphone Frame Container */}
      <div className="smartphone-frame">
        {/* Top Notch & Camera */}
        <div className="smartphone-notch">
          <div className="smartphone-camera" />
          <div className="smartphone-speaker" />
        </div>

        {/* Status Bar (Battery, WiFi, Time) */}
        <div
          style={{
            height: '38px',
            padding: '10px 20px 0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: '#94a3b8',
            fontFamily: 'JetBrains Mono, monospace',
            zIndex: 40,
          }}
        >
          <span>9:41 AM</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>📶 5G</span>
            <span>🔋 98%</span>
          </div>
        </div>

        {/* App Main Body */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
            background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)',
          }}
        >
          {/* ========================================================================= */}
          {/* TAB 1: 📍 NEARBY RADAR VIEW                                              */}
          {/* ========================================================================= */}
          {activeTab === 'radar' && (
            <div style={{ padding: '16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass style={{ color: 'var(--brand-cyan)' }} size={20} />
                    Nearby To-Let Radar
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    📍 Live GPS: Bashundhara R/A (1.5 km radius)
                  </p>
                </div>
                <button
                  onClick={onRefresh}
                  style={{ background: '#1e293b', border: 'none', color: 'var(--brand-cyan)', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Animated Radar Visual Display */}
              <div
                style={{
                  height: '150px',
                  background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(15,23,42,0.8) 70%)',
                  border: '1px solid rgba(56,189,248,0.3)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                {/* Radar Sweep Beam */}
                <div className="radar-sweep-beam" />
                <div className="radar-ping-ring" style={{ width: '80px', height: '80px' }} />
                <div className="radar-ping-ring" style={{ width: '130px', height: '130px', animationDelay: '1s' }} />

                {/* Center User Pin */}
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    background: 'var(--brand-cyan)',
                    borderRadius: '50%',
                    boxShadow: '0 0 15px var(--brand-cyan)',
                    zIndex: 10,
                  }}
                />

                {/* Simulated Surrounding Property Dots */}
                <div style={{ position: 'absolute', top: '35%', left: '30%', width: '10px', height: '10px', background: 'var(--brand-emerald)', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} title="320m away" />
                <div style={{ position: 'absolute', top: '65%', left: '75%', width: '10px', height: '10px', background: 'var(--brand-emerald)', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} title="650m away" />
                <div style={{ position: 'absolute', top: '25%', left: '70%', width: '10px', height: '10px', background: 'var(--brand-amber)', borderRadius: '50%', boxShadow: '0 0 8px #f59e0b' }} title="1.1km away" />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    fontSize: '0.72rem',
                    color: 'var(--brand-cyan)',
                    fontWeight: 700,
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  ⚡ {nearbyListings.length} To-Lets Detected Nearby
                </div>
              </div>

              {/* Nearest Listings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  CLOSEST TO YOUR LOCATION:
                </span>

                {nearbyListings.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedListing(item)}
                    style={{
                      background: '#131c31',
                      border: '1px solid #1e293b',
                      borderRadius: '14px',
                      padding: '12px',
                      display: 'flex',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: 'var(--brand-cyan)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '6px',
                          }}
                        >
                          📍 {item.distanceKm ? `${item.distanceKm} km away` : '350m away'}
                        </span>
                        <span style={{ color: 'var(--brand-emerald)', fontWeight: 800, fontSize: '0.95rem' }}>
                          ৳{item.rentAmount.toLocaleString()}
                        </span>
                      </div>

                      <h4
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#fff',
                          margin: '4px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </h4>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.area} • {item.propertyType.replace('_', ' ')}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--brand-amber)' }}>
                          +৳{(item.utilityInfo?.totalUtility || 0).toLocaleString()} Utils
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--brand-cyan)', fontWeight: 600 }}>
                          View Details ➔
                        </span>
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
            <div style={{ padding: '16px' }}>
              {/* Search Bar & Filter Toggle */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <div
                  style={{
                    flex: 1,
                    background: '#131c31',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                >
                  <Search size={16} style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Gulshan, Bashundhara..."
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      padding: '8px',
                      fontSize: '0.82rem',
                      width: '100%',
                      outline: 'none',
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                  style={{
                    background: showFilterDrawer ? 'var(--brand-cyan)' : '#131c31',
                    color: showFilterDrawer ? '#000' : 'var(--text-primary)',
                    border: '1px solid #1e293b',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <SlidersHorizontal size={16} />
                </button>
              </div>

              {/* Filter Chips Bar (Tenant Types) */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '10px' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'bachelor_male', label: '👨 Bachelor Male' },
                  { id: 'bachelor_female', label: '👩 Female Student' },
                  { id: 'family', label: '🏡 Family' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedTenantType(chip.id)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '5px 10px',
                      borderRadius: '16px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: selectedTenantType === chip.id ? 'var(--brand-cyan)' : '#1e293b',
                      color: selectedTenantType === chip.id ? '#000' : 'var(--text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Filter Drawer (Max Budget Slider) */}
              {showFilterDrawer && (
                <div
                  style={{
                    background: '#131c31',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#fff', marginBottom: '6px' }}>
                    <span>Max Monthly Budget:</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-emerald)' }}>৳{maxRent.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="35000"
                    step="1000"
                    value={maxRent}
                    onChange={(e) => setMaxRent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--brand-cyan)' }}
                  />
                </div>
              )}

              {/* Feed Card List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredListings.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedListing(item)}
                    style={{
                      background: '#131c31',
                      border: '1px solid #1e293b',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'relative', height: '140px' }}>
                      <img src={item.images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(4px)',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      >
                        📍 {item.area}
                      </div>
                      <button
                        onClick={(e) => toggleSave(item._id, e)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          border: 'none',
                          color: savedListingIds.includes(item._id) ? '#f43f5e' : '#fff',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Heart size={14} fill={savedListingIds.includes(item._id) ? '#f43f5e' : 'none'} />
                      </button>
                    </div>

                    <div style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                          ৳{item.rentAmount.toLocaleString()}
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}> /mo</span>
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--brand-amber)', fontWeight: 600 }}>
                          +৳{(item.utilityInfo?.totalUtility || 0).toLocaleString()} Utils
                        </span>
                      </div>

                      <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {item.addressText}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {item.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            style={{
                              background: '#1e293b',
                              color: 'var(--brand-cyan)',
                              fontSize: '0.65rem',
                              padding: '2px 6px',
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
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 💬 IN-APP CHATS & MESSAGES                                        */}
          {/* ========================================================================= */}
          {activeTab === 'messages' && (
            <div style={{ padding: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare style={{ color: 'var(--brand-cyan)' }} size={20} />
                In-App Messages
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {listings.slice(0, 3).map((item) => {
                  const isClosed = isChatClosed[item._id];
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setActiveChatListing(item);
                        setSelectedListing(null);
                      }}
                      style={{
                        background: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                          {item.landlord.name}
                        </span>
                        {isClosed ? (
                          <span style={{ fontSize: '0.68rem', color: '#f43f5e', fontWeight: 700 }}>🛑 Closed</span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>🟢 Active</span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)', margin: '2px 0' }}>
                        {item.title}
                      </p>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isClosed ? 'Negotiation closed by Tenant.' : 'Click to open private in-app chat & call.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ❤️ SAVED FAVORITES                                                */}
          {/* ========================================================================= */}
          {activeTab === 'saved' && (
            <div style={{ padding: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart style={{ color: '#f43f5e' }} size={20} fill="#f43f5e" />
                Saved To-Lets ({savedListingIds.length})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {listings
                  .filter((l) => savedListingIds.includes(l._id))
                  .map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedListing(item)}
                      style={{
                        background: '#131c31',
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        gap: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={item.images[0]} alt={item.title} style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.72rem', color: 'var(--brand-cyan)' }}>{item.area}</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-emerald)', marginTop: '4px' }}>
                          ৳{item.rentAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM TAB NAVIGATOR                                                      */}
        {/* ========================================================================= */}
        <div
          style={{
            height: '60px',
            background: '#090d16',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 40,
          }}
        >
          {[
            { id: 'radar', label: 'Radar', icon: Compass },
            { id: 'explore', label: 'Explore', icon: Search },
            { id: 'messages', label: 'Chats', icon: MessageSquare },
            { id: 'saved', label: 'Saved', icon: Heart },
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
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  color: isActive ? 'var(--brand-cyan)' : '#64748b',
                  fontSize: '0.68rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <Icon size={18} />
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
              background: '#0a0f1d',
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
                background: 'rgba(10, 15, 29, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #1e293b',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => setSelectedListing(null)}
                style={{ background: '#1e293b', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <ArrowLeft size={16} />
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>To-Let Details</span>
              <button
                onClick={() => toggleSave(selectedListing._id)}
                style={{ background: '#1e293b', border: 'none', color: savedListingIds.includes(selectedListing._id) ? '#f43f5e' : '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <Heart size={16} fill={savedListingIds.includes(selectedListing._id) ? '#f43f5e' : 'none'} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                style={{ width: '100%', height: '180px', borderRadius: '14px', objectFit: 'cover', marginBottom: '14px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--brand-cyan)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                  📍 {selectedListing.area}
                </span>
                <span className="badge-available">🟢 Available</span>
              </div>

              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '8px 0' }}>
                {selectedListing.title}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                📍 {selectedListing.addressText}
              </p>

              {/* 💰 Transparent Pricing Box (Rent + Utilities Breakdown) */}
              <div
                style={{
                  background: '#131c31',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly Base Rent:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-emerald)' }}>
                    ৳{selectedListing.rentAmount.toLocaleString()}
                  </span>
                </div>

                {selectedListing.utilityInfo?.mode === 'itemized' && (
                  <div style={{ borderTop: '1px dashed #334155', paddingTop: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-amber)', fontWeight: 700 }}>
                      ⚡ Itemized Utility Breakdown:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
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
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>Total Estimated Cost:</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-cyan)' }}>
                    ৳{(selectedListing.rentAmount + (selectedListing.utilityInfo?.totalUtility || 0)).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Features & House Rules:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedListing.amenities.map((a) => (
                    <span
                      key={a}
                      style={{
                        background: '#1e293b',
                        color: 'var(--brand-cyan)',
                        fontSize: '0.72rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        textTransform: 'capitalize',
                      }}
                    >
                      ✓ {a.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedListing.description}
              </p>
            </div>

            {/* Bottom In-App Contact Action Bar */}
            <div
              style={{
                position: 'sticky',
                bottom: 0,
                background: '#0f172a',
                borderTop: '1px solid #1e293b',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                zIndex: 10,
              }}
            >
              <button
                onClick={() => handleStartCall(selectedListing)}
                className="btn-emerald"
                style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '10px' }}
              >
                <PhoneCall size={16} /> In-App Call
              </button>

              <button
                onClick={() => {
                  setActiveChatListing(selectedListing);
                  setSelectedListing(null);
                }}
                className="btn-primary"
                style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '10px' }}
              >
                <MessageSquare size={16} /> In-App Chat
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: IN-APP PRIVATE CHAT & ONE-TAP CLOSE CHAT                         */}
        {/* ========================================================================= */}
        {activeChatListing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0a0f1d',
              zIndex: 70,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: '12px 16px',
                background: '#131c31',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setActiveChatListing(null)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {activeChatListing.landlord.name}
                  </h4>
                  <p style={{ fontSize: '0.68rem', color: 'var(--brand-cyan)' }}>
                    🔒 Number Hidden • In-App Secure
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleStartCall(activeChatListing)}
                  style={{ background: 'var(--brand-emerald)', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Phone size={12} /> Call
                </button>
                <button
                  onClick={() => handleCloseChat(activeChatListing._id)}
                  style={{ background: 'rgba(244,63,94,0.2)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.4)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}
                  title="Close Chat to prevent unwanted follow-ups"
                >
                  Close 🛑
                </button>
              </div>
            </div>

            {/* Chat Thread */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(chatMessages[activeChatListing._id] || []).map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: 'center',
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #334155',
                        color: '#94a3b8',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        maxWidth: '90%',
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
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      background: isMe ? 'var(--brand-cyan)' : '#1e293b',
                      color: isMe ? '#000' : '#fff',
                      padding: '8px 12px',
                      borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      maxWidth: '80%',
                      fontSize: '0.8rem',
                      fontWeight: isMe ? 600 : 400,
                    }}
                  >
                    {msg.text}
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div
              style={{
                padding: '10px',
                background: '#131c31',
                borderTop: '1px solid #1e293b',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                disabled={isChatClosed[activeChatListing._id]}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isChatClosed[activeChatListing._id] ? 'Chat is closed by tenant.' : 'Type message...'}
                style={{
                  flex: 1,
                  background: '#0f172a',
                  border: '1px solid #334155',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <button
                disabled={isChatClosed[activeChatListing._id]}
                onClick={handleSendMessage}
                style={{
                  background: isChatClosed[activeChatListing._id] ? '#334155' : 'var(--brand-cyan)',
                  border: 'none',
                  color: '#000',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: isChatClosed[activeChatListing._id] ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: IN-APP VOICE CALL SCREEN SIMULATOR                               */}
        {/* ========================================================================= */}
        {activeCall && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, #1e293b 0%, #090d16 100%)',
              zIndex: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '60px 20px 40px 20px',
            }}
          >
            {/* Top Caller Info */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  borderRadius: '50%',
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
                }}
              >
                🏠
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                {activeCall.listing.landlord.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)', marginTop: '4px' }}>
                {activeCall.listing.title}
              </p>
              <div
                style={{
                  marginTop: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: activeCall.status === 'connected' ? 'var(--brand-emerald)' : 'var(--brand-amber)',
                }}
              >
                {activeCall.status === 'ringing'
                  ? '🔔 Ringing (In-App Voice Call)...'
                  : `🟢 Connected (00:${activeCall.duration < 10 ? `0${activeCall.duration}` : activeCall.duration})`}
              </div>
              <p style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '6px' }}>
                🔒 Privacy Shield: Phone number hidden
              </p>
            </div>

            {/* Middle Controls (Mute, Speaker) */}
            <div style={{ display: 'flex', gap: '30px' }}>
              <button
                onClick={() =>
                  setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
                }
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: activeCall.isMuted ? 'var(--brand-rose)' : '#334155',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeCall.isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <button
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#334155',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Volume2 size={22} />
              </button>
            </div>

            {/* Bottom End Call Button */}
            <button
              onClick={handleEndCall}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#f43f5e',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(244, 63, 94, 0.5)',
              }}
            >
              <PhoneOff size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
