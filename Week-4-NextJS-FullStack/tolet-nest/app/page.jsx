'use client';

import React, { useState, useEffect } from 'react';
import LandlordDashboard from './components/LandlordDashboard';
import MobileAppSimulator from './components/MobileAppSimulator';
import {
  Building2,
  Smartphone,
  Layers,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Zap,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'mobile' | 'landlord'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  // Fetch listings from API
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/listings');
      const json = await res.json();
      if (json.success && json.data) {
        setListings(json.data);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to fetch listings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Post new listing handler
  const handlePostListing = async (newListingData) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListingData),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setListings((prev) => [json.data, ...prev]);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to post listing:', e);
    }
  };

  // Update status handler (Available ↔ Rented)
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setListings((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status } : item))
        );
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  // Delete listing handler
  const handleDeleteListing = (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      setListings((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Navbar */}
      <header
        className="glass-header"
        style={{
          padding: '14px 28px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Brand Logo & Wordmark (Custom Monoline Architectural Motif) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--brand-primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Custom Monoline Architectural Nest Glyph */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5L12 3l9 7.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20v-9.5z" />
              <path d="M9 21v-7h6v7" />
              <circle cx="12" cy="8.5" r="1.5" fill="var(--brand-primary)" stroke="none" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                ToLet<span style={{ color: 'var(--brand-primary)' }}>Nest</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Dhaka
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Hyperlocal Rental Ecosystem • MERN & React Native
            </p>
          </div>
        </div>

        {/* View Switcher Pill (Segmented Control) */}
        <div
          style={{
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '3px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setViewMode('split')}
            style={{
              background: viewMode === 'split' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'split' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={14} /> Side-by-Side View
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            style={{
              background: viewMode === 'mobile' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'mobile' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Smartphone size={14} /> Tenant Mobile App
          </button>

          <button
            onClick={() => setViewMode('landlord')}
            style={{
              background: viewMode === 'landlord' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'landlord' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Building2 size={14} /> Landlord Web Portal
          </button>
        </div>

        {/* Live Ecosystem Sync Indicator (Pulse Animation) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              padding: '5px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div className="sync-beacon" />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Live Sync: <span style={{ color: '#fff' }}>{lastSyncTime}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: '24px 20px' }}>
        {/* Split View (Side-by-Side Live Showcase) */}
        {viewMode === 'split' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(420px, 1fr) 410px',
              gap: '28px',
              maxWidth: '1480px',
              margin: '0 auto',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Landlord Web Dashboard */}
            <div style={{ overflow: 'hidden' }}>
              <LandlordDashboard
                listings={listings}
                onRefresh={fetchListings}
                onPostListing={handlePostListing}
                onUpdateStatus={handleUpdateStatus}
                onDeleteListing={handleDeleteListing}
              />
            </div>

            {/* Right Column: React Native Mobile App Simulator */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <MobileAppSimulator listings={listings} onRefresh={fetchListings} />
            </div>
          </div>
        )}

        {/* Mobile Only View */}
        {viewMode === 'mobile' && (
          <div style={{ maxWidth: '580px', margin: '0 auto' }}>
            <MobileAppSimulator listings={listings} onRefresh={fetchListings} />
          </div>
        )}

        {/* Landlord Dashboard Only View */}
        {viewMode === 'landlord' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <LandlordDashboard
              listings={listings}
              onRefresh={fetchListings}
              onPostListing={handlePostListing}
              onUpdateStatus={handleUpdateStatus}
              onDeleteListing={handleDeleteListing}
            />
          </div>
        )}
      </main>
    </div>
  );
}
