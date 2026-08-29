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

  // Filtering Logic
  const filteredListings = listings.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.addressText.toLowerCase().includes(q);
      if (!match) return false;
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

  const nearbyListings = [...listings].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const toggleSave = (id, e) => {
    if (e) e.stopPropagation();
    setSavedListingIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartCall = (listing) => {
    setActiveCall({
      listing,
      status: 'ringing',
      duration: 0,
      isMuted: false,
    });

    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2000);
  };

  const handleEndCall = () => {
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
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={16} style={{ color: 'var(--brand-primary)' }} />
                    <h2 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                      Proximity Radar
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    📍 Bashundhara R/A (1.5 km scan)
                  </p>
                </div>
                <button
                  onClick={onRefresh}
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', padding: '5px', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <RefreshCw size={12} />
                </button>
              </div>

              {/* Architectural Dhaka Map Radar Texture */}
              <div className="dhaka-radar-container" style={{ height: '145px', marginBottom: '14px' }}>
                <div className="dhaka-map-texture" />
                <div className="dhaka-radar-sweep" />

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
                            📍 {item.distanceKm ? `${item.distanceKm} km` : '350m'}
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

              {/* Filter Chips Bar */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '10px' }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'bachelor_male', label: 'Bachelor Male' },
                  { id: 'bachelor_female', label: 'Female Student' },
                  { id: 'family', label: 'Family' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setSelectedTenantType(chip.id)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 700,
                      background: selectedTenantType === chip.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                      color: selectedTenantType === chip.id ? '#fff' : 'var(--text-secondary)',
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
                {filteredListings.map((item) => (
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
                ))}
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
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM TAB NAVIGATOR                                                      */}
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
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                  fontSize: '0.66rem',
                  fontFamily: 'Space Grotesk',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
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
