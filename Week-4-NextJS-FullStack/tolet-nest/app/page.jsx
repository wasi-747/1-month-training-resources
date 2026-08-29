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

  // Fetch listings from API
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/listings');
      const json = await res.json();
      if (json.success && json.data) {
        setListings(json.data);
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

  // Post new listing handler (creates via API & reactive state)
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          background: 'rgba(11, 15, 25, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 900,
              fontSize: '1.2rem',
            }}
          >
            🏡
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              ToLet<span style={{ color: 'var(--brand-cyan)' }}>Nest</span>
            </span>
            <span
              style={{
                marginLeft: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: 'var(--brand-cyan)',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              MERN + React Native
            </span>
          </div>
        </div>

        {/* View Switcher Pill */}
        <div
          style={{
            background: '#131c31',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setViewMode('split')}
            style={{
              background: viewMode === 'split' ? 'var(--brand-cyan)' : 'none',
              color: viewMode === 'split' ? '#000' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Layers size={14} /> Side-by-Side Split View
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            style={{
              background: viewMode === 'mobile' ? 'var(--brand-cyan)' : 'none',
              color: viewMode === 'mobile' ? '#000' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Smartphone size={14} /> Mobile App (Tenant)
          </button>

          <button
            onClick={() => setViewMode('landlord')}
            style={{
              background: viewMode === 'landlord' ? 'var(--brand-cyan)' : 'none',
              color: viewMode === 'landlord' ? '#000' : 'var(--text-secondary)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Building2 size={14} /> Web Dashboard (Landlord)
          </button>
        </div>

        {/* Live Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--brand-emerald)', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
            One Ecosystem Live Sync
          </span>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: '20px' }}>
        {/* Split View (Side-by-Side Live Showcase) */}
        {viewMode === 'split' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(420px, 1fr) 420px',
              gap: '24px',
              maxWidth: '1500px',
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
            <div style={{ position: 'sticky', top: '80px' }}>
              <MobileAppSimulator listings={listings} onRefresh={fetchListings} />
            </div>
          </div>
        )}

        {/* Mobile Only View */}
        {viewMode === 'mobile' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <MobileAppSimulator listings={listings} onRefresh={fetchListings} />
          </div>
        )}

        {/* Landlord Dashboard Only View */}
        {viewMode === 'landlord' && (
          <LandlordDashboard
            listings={listings}
            onRefresh={fetchListings}
            onPostListing={handlePostListing}
            onUpdateStatus={handleUpdateStatus}
            onDeleteListing={handleDeleteListing}
          />
        )}
      </main>
    </div>
  );
}
