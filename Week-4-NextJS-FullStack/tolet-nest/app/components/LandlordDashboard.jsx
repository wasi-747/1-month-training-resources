'use client';

import React, { useState, useMemo } from 'react';
import {
  Building,
  PlusCircle,
  Shield,
  Trash2,
  RefreshCw,
  MapPin,
  Flame,
  Zap,
  Droplet,
  Wifi,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Users,
  GraduationCap,
  Sparkles,
  Search,
  Eye,
  Lock,
  PhoneCall,
  Activity,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { mockStore } from '../../lib/mockStore';

export default function LandlordDashboard({
  listings = [],
  onRefresh,
  onPostListing,
  onUpdateStatus,
  onDeleteListing,
}) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics' | 'directory' | 'privacy_logs'
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCategory, setDirectoryCategory] = useState('all');
  const [flaggedIds, setFlaggedIds] = useState([]);
  const [verifiedIds, setVerifiedIds] = useState(['listing-1', 'listing-2', 'listing-7', 'listing-9']);

  // Ensure robust data source fallback
  const fallbackListings = useMemo(() => mockStore.getListings({}), []);
  const activeListings = listings && listings.length > 0 ? listings : fallbackListings;

  // New Listing Form State
  const [formData, setFormData] = useState({
    posterRole: 'student_outgoing', // 'student_outgoing' | 'flatmate' | 'sublet_host' | 'landlord'
    rentalCategory: 'seat', // 'seat' | 'room' | 'dining_space' | 'sublet' | 'full_flat'
    quantityAvailable: 1,
    title: '',
    description: '',
    rentAmount: 3800,
    area: 'Bashundhara R/A',
    addressText: '',
    propertyType: 'seat_rent',
    tenantType: 'bachelor_male',
    utilityMode: 'itemized',
    utilityBreakdown: {
      electricity: 350,
      gas: 150,
      water: 100,
      serviceCharge: 150,
      wifi: 100,
      waste: 0,
    },
    inclusiveUtilityAmount: 850,
    amenities: ['wifi', 'attached_bath', 'no_curfew', 'gas'],
    showPublicPhone: false,
    phone: '01711-234567',
    posterName: 'Tanvir Ahmed (Outgoing Student)',
  });

  const amenitiesList = [
    { id: 'attached_bath', label: 'Attached Bath' },
    { id: 'balcony', label: 'Private Balcony' },
    { id: 'wifi', label: 'Optic Fiber WiFi' },
    { id: 'lift', label: 'Elevator / Lift' },
    { id: 'generator', label: 'Generator Backup' },
    { id: 'gas', label: '24/7 Gas Line' },
    { id: 'no_curfew', label: 'No Night Curfew' },
    { id: 'meal_system', label: 'Shared Meal System' },
  ];

  const handleAmenityToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const handleUtilityChange = (key, val) => {
    setFormData((prev) => ({
      ...prev,
      utilityBreakdown: {
        ...prev.utilityBreakdown,
        [key]: Number(val) || 0,
      },
    }));
  };

  const calculateTotalUtility = () => {
    if (formData.utilityMode === 'itemized') {
      const b = formData.utilityBreakdown;
      return (
        (b.electricity || 0) +
        (b.gas || 0) +
        (b.water || 0) +
        (b.serviceCharge || 0) +
        (b.wifi || 0) +
        (b.waste || 0)
      );
    }
    if (formData.utilityMode === 'inclusive') {
      return Number(formData.inclusiveUtilityAmount) || 0;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.addressText) {
      alert('Please provide the listing title and specific address');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || `Posted via ToLetNest Portal by ${formData.posterName}. In-app communication channel active.`,
      rentAmount: Number(formData.rentAmount),
      area: formData.area,
      addressText: formData.addressText,
      propertyType: formData.propertyType,
      rentalCategory: formData.rentalCategory,
      quantityAvailable: Number(formData.quantityAvailable) || 1,
      tenantType: formData.tenantType,
      utilityInfo: {
        mode: formData.utilityMode,
        totalUtility: calculateTotalUtility(),
        breakdown: formData.utilityMode === 'itemized' ? formData.utilityBreakdown : {},
        amount: formData.utilityMode === 'inclusive' ? formData.inclusiveUtilityAmount : 0,
      },
      amenities: formData.amenities,
      status: 'available',
      landlord: {
        name: formData.posterName,
        phone: formData.phone,
        showPublicPhone: formData.showPublicPhone,
        allowInAppCall: true,
        allowInAppChat: true,
      },
    };

    if (onPostListing) onPostListing(payload);
    setShowModal(false);
    setFormData((prev) => ({
      ...prev,
      title: '',
      description: '',
      addressText: '',
    }));
  };

  // Metrics
  const totalCount = activeListings.length;
  const availableCount = activeListings.filter((l) => l.status === 'available').length;
  const rentedCount = activeListings.filter((l) => l.status === 'rented').length;
  const totalVolume = activeListings.reduce((sum, l) => sum + (l.rentAmount || 0), 0);
  const avgRent = totalCount > 0 ? Math.round(totalVolume / totalCount) : 0;

  // Campus Hub Statistics
  const campusHubs = [
    { name: 'Bashundhara R/A', univ: 'NSU / IUB / AIUB', count: activeListings.filter((l) => l.area === 'Bashundhara R/A').length, icon: '🎓' },
    { name: 'Middle Badda', univ: 'BRAC University Link Rd', count: activeListings.filter((l) => l.area === 'Badda').length, icon: '🎓' },
    { name: 'Aftabnagar', univ: 'East West University', count: activeListings.filter((l) => l.area === 'Aftabnagar').length, icon: '🎓' },
    { name: 'Saidnagar 100ft', univ: 'Budget Student Mess & Beds', count: activeListings.filter((l) => l.area === 'Saidnagar').length, icon: '🍽️' },
    { name: 'Dhanmondi / Mirpur', univ: 'Daffodil / UIU / Metro Corridor', count: activeListings.filter((l) => ['Dhanmondi', 'Mirpur'].includes(l.area)).length, icon: '🏢' },
  ];

  // Directory Filtered
  const directoryFiltered = activeListings.filter((item) => {
    if (directorySearch) {
      const q = directorySearch.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.addressText.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (directoryCategory !== 'all') {
      const pType = item.propertyType || '';
      const rCat = item.rentalCategory || '';
      if (directoryCategory === 'seat' && pType !== 'seat_rent' && pType !== 'shared_seat' && rCat !== 'seat') return false;
      if (directoryCategory === 'dining_space' && pType !== 'dining_space' && rCat !== 'dining_space') return false;
      if (directoryCategory === 'sublet' && pType !== 'sublet' && rCat !== 'sublet') return false;
      if (directoryCategory === 'full_flat' && pType !== 'full_flat' && rCat !== 'full_flat') return false;
      if (directoryCategory === 'room' && !['room_rent', 'single_room', 'master_bed'].includes(pType) && rCat !== 'room') return false;
    }
    return true;
  });

  const toggleFlag = (id) => {
    setFlaggedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleVerify = (id) => {
    setVerifiedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
      {/* Top Super Admin Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: 'rgba(201, 114, 45, 0.15)',
                border: '1px solid var(--brand-primary-border)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontFamily: 'Space Grotesk',
                fontWeight: 800,
                color: 'var(--brand-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Shield size={11} /> Master Control & Super Admin Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            ToLet<span style={{ color: 'var(--brand-primary)' }}>Nest</span> Platform Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
            Live Dhaka rental moderation, university hub analytics, P2P vacancy tracking & privacy audit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={onRefresh} className="btn-surface" title="Sync with Cloud Database">
            <RefreshCw size={14} style={{ color: 'var(--brand-primary)' }} /> Live Sync
          </button>
          <button onClick={() => setShowModal(true)} className="btn-terracotta">
            <PlusCircle size={16} /> + Post To-Let / Seat
          </button>
        </div>
      </div>

      {/* KPI Overview Grid with Varied Visual Weight */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div className="card-surface" style={{ padding: '18px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Live Listings
          </span>
          <p className="font-heading" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            {totalCount}
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Across 7 Dhaka Student Hubs</span>
        </div>

        <div className="card-surface" style={{ padding: '18px', borderLeft: '3px solid #4ade80' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vacant & Available
          </span>
          <p className="font-heading" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#4ade80', marginTop: '4px' }}>
            {availableCount}
          </p>
          <span style={{ color: '#9fe3c2', fontSize: '0.74rem' }}>Ready for instant move-in</span>
        </div>

        <div className="card-surface" style={{ padding: '18px', borderLeft: '3px solid #f6cd8b' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monthly Rental Volume
          </span>
          <p className="font-heading font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f6cd8b', marginTop: '4px' }}>
            <span className="taka-symbol">৳</span>{(totalVolume / 1000).toFixed(1)}k
          </p>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Monthly turnover volume</span>
        </div>

        <div className="card-surface-elevated" style={{ padding: '18px', borderLeft: '3px solid var(--brand-primary)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Privacy Shield Rate
          </span>
          <p className="font-heading font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px' }}>
            100%
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>Zero Direct SIM Number Leaks</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
        {[
          { id: 'metrics', label: '📊 Campus Hubs & Heatmap' },
          { id: 'directory', label: `🗂️ Listing Moderation Directory (${totalCount})` },
          { id: 'privacy_logs', label: '🔒 Privacy Shield & Call Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '0.88rem',
              borderBottom: activeTab === tab.id ? '2px solid var(--brand-primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 📊 CAMPUS HUBS & HEATMAP                                           */}
      {/* ========================================================================= */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* University Hub Distribution Cards */}
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              📍 Live Dhaka University Hub Vacancy Distribution
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {campusHubs.map((hub) => (
                <div
                  key={hub.name}
                  className="card-surface"
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{hub.icon}</span>
                      <span
                        style={{
                          background: hub.count > 0 ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-surface-2)',
                          color: hub.count > 0 ? '#4ade80' : 'var(--text-muted)',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontFamily: 'Space Grotesk',
                          fontWeight: 700,
                        }}
                      >
                        {hub.count} {hub.count === 1 ? 'Unit' : 'Units'} Live
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{hub.name}</h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{hub.univ}</p>
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Status: Active Radar</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--brand-primary)', fontWeight: 700 }}>● Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Architecture & Innovation Overview */}
          <div
            style={{
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-medium)',
              borderRadius: '12px',
              padding: '18px 20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Shield size={16} style={{ color: 'var(--brand-primary)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Anti-Broker & Anti-Spam Guard</h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Direct peer-to-peer connection prevents third-party middlemen from inflating rent prices. Personal SIM numbers are masked by default.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Zap size={16} style={{ color: '#f6cd8b' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Zero-Google-API GPS Proximity</h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Built entirely using native HTML5 Geolocation and Haversine trigonometry algorithms—delivering 100% free, hyper-accurate distance calculation.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Sparkles size={16} style={{ color: '#9fe3c2' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Transparent Utility Calculation</h4>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Itemized breakdown for electricity, gas, water, service charge, and optic WiFi—eliminating hidden costs for university students.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 🗂️ LISTING MODERATION & DIRECTORY                                  */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div>
          {/* Search & Category Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div
              style={{
                flex: 1,
                minWidth: '220px',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="Filter by title, area, or landmark..."
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.84rem', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {[
                { id: 'all', label: 'All Units' },
                { id: 'seat', label: '🛏️ Seat Rent' },
                { id: 'room', label: '🚪 Room Rent' },
                { id: 'dining_space', label: '🍽️ Dining Space' },
                { id: 'sublet', label: '🏡 Sublet' },
                { id: 'full_flat', label: '🏢 Full Flat' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setDirectoryCategory(chip.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 700,
                    background: directoryCategory === chip.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                    color: directoryCategory === chip.id ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${directoryCategory === chip.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Table */}
          <div className="card-surface" style={{ overflowX: 'auto', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.76rem', textTransform: 'uppercase' }}>Property & Landmark</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.76rem', textTransform: 'uppercase' }}>Category & Poster</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.76rem', textTransform: 'uppercase' }}>Rent + Utility</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.76rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.76rem', textTransform: 'uppercase', textAlign: 'right' }}>Admin Controls</th>
                </tr>
              </thead>
              <tbody>
                {directoryFiltered.map((item) => {
                  const isFlagged = flaggedIds.includes(item._id);
                  const isVerified = verifiedIds.includes(item._id);
                  const isSeat = item.rentalCategory === 'seat' || item.propertyType === 'seat_rent';
                  const isDining = item.rentalCategory === 'dining_space' || item.propertyType === 'dining_space';
                  const isFlat = item.rentalCategory === 'full_flat' || item.propertyType === 'full_flat';

                  return (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isFlagged ? 'rgba(148, 65, 56, 0.15)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '12px 14px', maxWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{item.title}</p>
                          {isVerified && (
                            <span title="Student/Owner Verified Badge" style={{ color: '#4ade80', fontSize: '0.75rem' }}>✓</span>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={11} style={{ color: 'var(--brand-primary)' }} /> {item.addressText || item.area}
                        </p>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            background: isSeat ? 'rgba(74, 222, 128, 0.15)' : isDining ? 'rgba(246, 205, 139, 0.15)' : 'var(--bg-surface-2)',
                            color: isSeat ? '#4ade80' : isDining ? '#f6cd8b' : '#fff',
                            border: '1px solid var(--border-subtle)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            display: 'inline-block',
                            marginBottom: '3px',
                          }}
                        >
                          {isSeat ? '🛏️ Seat Rent' : isDining ? '🍽️ Dining Space' : isFlat ? '🏢 Full Flat' : '🚪 Room Rent'}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          By {item.landlord?.name || 'Student / Host'}
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span className="font-mono" style={{ fontWeight: 800, color: 'var(--brand-primary)', fontSize: '0.88rem' }}>
                          <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          + ৳{(item.utilityInfo?.totalUtility || 0).toLocaleString()} bills
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => onUpdateStatus && onUpdateStatus(item._id, item.status === 'available' ? 'rented' : 'available')}
                          style={{
                            background: item.status === 'available' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(148, 65, 56, 0.15)',
                            color: item.status === 'available' ? '#4ade80' : '#f87171',
                            border: `1px solid ${item.status === 'available' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(148, 65, 56, 0.3)'}`,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontFamily: 'Space Grotesk',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {item.status === 'available' ? '● Available' : '● Rented'}
                        </button>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => toggleVerify(item._id)}
                            style={{
                              background: isVerified ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: isVerified ? '#4ade80' : 'var(--text-muted)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              cursor: 'pointer',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                            }}
                            title="Toggle Student/ID Verified Status"
                          >
                            {isVerified ? '✓ Verified' : 'Verify'}
                          </button>

                          <button
                            onClick={() => toggleFlag(item._id)}
                            style={{
                              background: isFlagged ? '#944138' : 'var(--bg-surface-2)',
                              border: '1px solid var(--border-subtle)',
                              color: isFlagged ? '#fff' : 'var(--text-muted)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              cursor: 'pointer',
                              fontFamily: 'Space Grotesk',
                              fontWeight: 700,
                            }}
                            title="Flag suspicious/broker listing"
                          >
                            {isFlagged ? '🚩 Flagged' : 'Flag'}
                          </button>

                          {onDeleteListing && (
                            <button
                              onClick={() => onDeleteListing(item._id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#f87171',
                                padding: '4px',
                                cursor: 'pointer',
                              }}
                              title="Delete from Platform"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: 🔒 PRIVACY SHIELD & SECURITY AUDIT                                 */}
      {/* ========================================================================= */}
      {activeTab === 'privacy_logs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--brand-primary-border)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={16} style={{ color: 'var(--brand-primary)' }} /> Live Privacy Shield & Number Masking Engine
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Protects student flatmates and female students from unwanted persistent SIM calls and harassment.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                ● Audio Gateway: Operational
              </span>
              <span style={{ background: 'rgba(201, 114, 45, 0.15)', color: 'var(--brand-primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                ● WebRTC Encrypted
              </span>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="card-surface" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '0.84rem', color: '#fff' }}>
              Recent In-App Communication & Call Logs
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '12 mins ago', type: '📞 Voice Call', target: '1 Seat in Bachelor Room (Near NSU Gate 8)', duration: '1m 24s', status: 'Completed • Masked' },
                { time: '45 mins ago', type: '💬 In-App Chat', target: 'Female Student Sublet (Aftabnagar Block B)', duration: '4 Messages', status: 'Active Channel' },
                { time: '2 hours ago', type: '📞 Voice Call', target: 'Bachelor Master Bed (Bashundhara Road 4)', duration: '45s', status: 'Completed • Masked' },
                { time: '3 hours ago', type: '🔒 Deal Closed', target: 'Low-Budget Partitioned Dining Space (Saidnagar)', duration: 'Deal Finalized', status: 'Conversation Auto-Closed' },
              ].map((log, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: 'var(--bg-surface-1)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{log.type}</span>
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{log.target}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.time} • Duration: {log.duration}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                    ✓ {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIVERSAL WEB POSTING MODAL (STUDENTS, FLATMATES, LANDLORDS)               */}
      {/* ========================================================================= */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 8, 6, 0.82)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            className="card-surface"
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              border: '1px solid var(--border-medium)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Post To-Let / Vacant Seat
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Universal Web Posting for Students, Flatmates & Owners
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Poster Role Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Posting As *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'student_outgoing', label: '🎓 Student', desc: 'Seat transfer' },
                    { id: 'flatmate', label: '🤝 Flatmate', desc: 'Need roommate' },
                    { id: 'sublet_host', label: '🏡 Host', desc: 'Sublet room' },
                    { id: 'landlord', label: '🏛️ Owner', desc: 'Full property' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setFormData({ ...formData, posterRole: r.id })}
                      style={{
                        background: formData.posterRole === r.id ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                        color: formData.posterRole === r.id ? '#fff' : 'var(--text-secondary)',
                        border: `1px solid ${formData.posterRole === r.id ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                        padding: '6px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', fontWeight: 700 }}>{r.label}</div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.8 }}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Seat Vacant in Bachelor Flat (Near NSU)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Dhaka Zone *
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.84rem' }}
                  >
                    <option value="Bashundhara R/A">Bashundhara R/A</option>
                    <option value="Badda">Badda</option>
                    <option value="Aftabnagar">Aftabnagar</option>
                    <option value="Saidnagar">Saidnagar</option>
                    <option value="Gulshan">Gulshan</option>
                    <option value="Dhanmondi">Dhanmondi</option>
                    <option value="Mirpur">Mirpur</option>
                    <option value="Uttara">Uttara</option>
                  </select>
                </div>
              </div>

              {/* Address / Landmark */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Specific Address / Road / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Road 8, Block C, Bashundhara (Opposite NSU Gate 8)"
                  value={formData.addressText}
                  onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.84rem' }}
                />
              </div>

              {/* Category & Available Count */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Rental Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => {
                      const val = e.target.value;
                      let cat = 'room';
                      if (val === 'seat_rent') cat = 'seat';
                      else if (val === 'dining_space') cat = 'dining_space';
                      else if (val === 'sublet') cat = 'sublet';
                      else if (val === 'full_flat') cat = 'full_flat';
                      setFormData({ ...formData, propertyType: val, rentalCategory: cat });
                    }}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.84rem' }}
                  >
                    <option value="seat_rent">🛏️ Seat Rent (সিট)</option>
                    <option value="single_room">🚪 Single Room</option>
                    <option value="master_bed">👑 Master Bed</option>
                    <option value="dining_space">🍽️ Dining Space</option>
                    <option value="sublet">🏡 Sublet Room</option>
                    <option value="full_flat">🏢 Entire Full Flat</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Available Units
                  </label>
                  <select
                    value={formData.quantityAvailable}
                    onChange={(e) => setFormData({ ...formData, quantityAvailable: Number(e.target.value) })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.84rem' }}
                  >
                    <option value="1">1 Unit / 1 Seat</option>
                    <option value="2">2 Units / 2 Seats</option>
                    <option value="3">3 Units / 3 Seats</option>
                    <option value="4">4+ Units</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Preferred Tenant
                  </label>
                  <select
                    value={formData.tenantType}
                    onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '0.84rem' }}
                  >
                    <option value="bachelor_male">Bachelor Male</option>
                    <option value="bachelor_female">Female Student</option>
                    <option value="job_holder">Job Holder</option>
                    <option value="family">Family</option>
                    <option value="any">Anyone</option>
                  </select>
                </div>
              </div>

              {/* Monthly Rent & Bills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Base Rent (৳ / month) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.84rem', fontFamily: 'JetBrains Mono' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Estimated Utilities (৳)
                  </label>
                  <input
                    type="number"
                    value={calculateTotalUtility()}
                    readOnly
                    style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.84rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Total Monthly Estimated Banner */}
              <div
                style={{
                  background: 'rgba(201, 114, 45, 0.12)',
                  border: '1px solid var(--brand-primary-border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Total Est. Monthly for Tenant:</span>
                <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                  <span className="taka-symbol">৳</span>
                  {(Number(formData.rentAmount || 0) + calculateTotalUtility()).toLocaleString()} /mo
                </span>
              </div>

              {/* Poster Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Your Name / Role
                  </label>
                  <input
                    type="text"
                    value={formData.posterName}
                    onChange={(e) => setFormData({ ...formData, posterName: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Contact Phone (Masked by default)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '6px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-terracotta"
                style={{ width: '100%', padding: '10px', fontSize: '0.9rem', marginTop: '6px', justifyContent: 'center' }}
              >
                🚀 Publish Instantly to Dhaka Ecosystem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
