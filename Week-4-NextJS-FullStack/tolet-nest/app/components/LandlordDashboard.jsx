'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  PlusCircle,
  Eye,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  Shield,
  Trash2,
  Zap,
  Flame,
  Droplet,
  Wifi,
  Sparkles,
  RefreshCw,
  Home,
  MapPin,
  Users,
  DollarSign
} from 'lucide-react';

export default function LandlordDashboard({ listings, onRefresh, onPostListing, onUpdateStatus, onDeleteListing }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'inquiries' | 'analytics'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');

  // New Listing Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rentAmount: 8000,
    area: 'Bashundhara R/A',
    addressText: '',
    propertyType: 'single_room',
    tenantType: 'bachelor_male',
    utilityMode: 'itemized', // 'itemized' | 'inclusive' | 'contact'
    utilityBreakdown: {
      electricity: 500,
      gas: 200,
      water: 150,
      serviceCharge: 200,
      wifi: 150,
      waste: 50,
    },
    inclusiveUtilityAmount: 1200,
    amenities: ['wifi', 'attached_bath', 'no_curfew'],
    showPublicPhone: false,
    phone: '01711-234567',
    landlordName: 'Engr. Rafiqul Islam',
  });

  const amenitiesList = [
    { id: 'attached_bath', label: 'Attached Bath 🚿' },
    { id: 'balcony', label: 'Private Balcony 🌿' },
    { id: 'wifi', label: 'High-Speed WiFi 📶' },
    { id: 'lift', label: 'Elevator / Lift 🛗' },
    { id: 'generator', label: 'Generator Backup ⚡' },
    { id: 'gas', label: '24/7 Gas Line 🔥' },
    { id: 'no_curfew', label: 'No Night Curfew 🌙' },
    { id: 'meal_system', label: 'Maid / Meal System 🍲' },
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
      alert('Please fill out the Title and Address');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      rentAmount: Number(formData.rentAmount),
      area: formData.area,
      addressText: formData.addressText,
      propertyType: formData.propertyType,
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
        name: formData.landlordName,
        phone: formData.phone,
        showPublicPhone: formData.showPublicPhone,
        allowInAppCall: true,
        allowInAppChat: true,
      },
    };

    onPostListing(payload);
    setShowModal(false);
    // Reset form
    setFormData((prev) => ({
      ...prev,
      title: '',
      description: '',
      addressText: '',
    }));
  };

  // Metrics
  const totalCount = listings.length;
  const availableCount = listings.filter((l) => l.status === 'available').length;
  const rentedCount = listings.filter((l) => l.status === 'rented').length;
  const avgRent =
    totalCount > 0 ? Math.round(listings.reduce((sum, l) => sum + l.rentAmount, 0) / totalCount) : 0;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building style={{ color: 'var(--brand-cyan)' }} />
            Landlord & Property Manager Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Post To-Lets, manage itemized utility costs, and respond to privacy-protected student inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onRefresh} className="btn-secondary" title="Refresh Live Database">
            <RefreshCw size={16} /> Sync
          </button>
          <button onClick={() => setShowModal(true)} className="btn-emerald">
            <PlusCircle size={18} /> Post New To-Let
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            TOTAL PROPERTIES
          </span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {totalCount} Units
          </p>
          <span style={{ color: 'var(--brand-cyan)', fontSize: '0.8rem' }}>Managed across Dhaka</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            AVAILABLE FOR RENT
          </span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-emerald)', marginTop: '6px' }}>
            {availableCount} Vacant
          </p>
          <span style={{ color: 'var(--brand-emerald)', fontSize: '0.8rem' }}>Ready for move-in</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            RENTED / OCCUPIED
          </span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-rose)', marginTop: '6px' }}>
            {rentedCount} Rented
          </p>
          <span style={{ color: 'var(--brand-rose)', fontSize: '0.8rem' }}>Inquiries paused</span>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
            AVG BASE RENT
          </span>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-amber)', marginTop: '6px' }}>
            ৳{avgRent.toLocaleString()}
          </p>
          <span style={{ color: 'var(--brand-amber)', fontSize: '0.8rem' }}>Excluding utilities</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 18px',
            color: activeTab === 'listings' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
            fontWeight: 700,
            borderBottom: activeTab === 'listings' ? '2px solid var(--brand-cyan)' : 'none',
            cursor: 'pointer',
          }}
        >
          📋 Active Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 18px',
            color: activeTab === 'inquiries' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
            fontWeight: 700,
            borderBottom: activeTab === 'inquiries' ? '2px solid var(--brand-cyan)' : 'none',
            cursor: 'pointer',
          }}
        >
          💬 Student Inquiries & Calls
        </button>
      </div>

      {/* Tab 1: Listings Table */}
      {activeTab === 'listings' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Property Details</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Area & Type</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Base Rent</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Utility Cost</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr
                  key={item._id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 18px', maxWidth: '300px' }}>
                    <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{item.title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '3px' }}>
                      📍 {item.addressText}
                    </p>
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--brand-cyan)' }}>{item.area}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {item.propertyType.replace('_', ' ')} • {item.tenantType.replace('_', ' ')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 18px', fontWeight: 700, color: 'var(--brand-emerald)' }}>
                    ৳{item.rentAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    {item.utilityInfo?.mode === 'itemized' && (
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--brand-amber)' }}>
                          +৳{(item.utilityInfo.totalUtility || 0).toLocaleString()}
                        </span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Itemized Breakdown</p>
                      </div>
                    )}
                    {item.utilityInfo?.mode === 'inclusive' && (
                      <span style={{ color: 'var(--brand-cyan)', fontSize: '0.85rem', fontWeight: 600 }}>
                        +৳{(item.utilityInfo.totalUtility || 0).toLocaleString()} (Inclusive)
                      </span>
                    )}
                    {item.utilityInfo?.mode === 'contact' && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Contact for bill</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    {item.status === 'available' && <span className="badge-available">🟢 Available</span>}
                    {item.status === 'visit_scheduled' && <span className="badge-scheduled">🟡 Visit Booked</span>}
                    {item.status === 'rented' && <span className="badge-rented">🔴 Rented</span>}
                  </td>
                  <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() =>
                          onUpdateStatus(
                            item._id,
                            item.status === 'available' ? 'rented' : 'available'
                          )
                        }
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                        title="Toggle Available vs Rented"
                      >
                        {item.status === 'available' ? 'Mark Rented 🔴' : 'Mark Available 🟢'}
                      </button>
                      <button
                        onClick={() => onDeleteListing(item._id)}
                        className="btn-danger"
                        style={{ padding: '5px 8px' }}
                        title="Delete Listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Inquiries Inbox */}
      {activeTab === 'inquiries' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: 'var(--brand-emerald)' }} />
            Privacy-Protected In-App Inquiries Inbox
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Tenants contact you directly through the secure in-app channel. Phone numbers are hidden by default unless you choose to display public contact.
          </p>

          <div
            style={{
              background: '#0f172a',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#fff' }}>Student Tenant: Wasiur Rahman</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--brand-cyan)' }}>
                  Listing: Bachelor Master Bed with Attached Bath & Balcony (Bashundhara R/A)
                </p>
              </div>
              <span className="badge-available">🟢 Active Inquiry</span>
            </div>

            {/* Simulated Chat Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0', maxHeight: '220px', overflowY: 'auto' }}>
              <div style={{ alignSelf: 'flex-start', background: '#1e293b', padding: '10px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '0.88rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '2px' }}>Wasiur (Tenant)</p>
                Assalamu Alaikum Uncle, is the master bed room still available for September?
              </div>

              <div style={{ alignSelf: 'flex-end', background: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '0.88rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: '2px' }}>You (Landlord)</p>
                Walaikum Assalam. Yes Baba, it is available. Are you studying at NSU?
              </div>

              <div style={{ alignSelf: 'flex-start', background: '#1e293b', padding: '10px 14px', borderRadius: '12px', maxWidth: '75%', fontSize: '0.88rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '2px' }}>Wasiur (Tenant)</p>
                Yes Uncle, I am in my final semester. Is night entry allowed after 11 PM for lab projects?
              </div>

              <div style={{ alignSelf: 'center', background: 'rgba(52, 211, 153, 0.1)', color: 'var(--brand-emerald)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                📞 In-App Voice Call Completed (1 min 34 sec) • Zero Phone Number Leak
              </div>
            </div>

            {/* Quick Reply Bar */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type in-app reply to tenant..."
                style={{
                  flex: 1,
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
              <button
                onClick={() => {
                  if (replyText) {
                    alert(`Reply sent: "${replyText}"`);
                    setReplyText('');
                  }
                }}
                className="btn-primary"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 1-Minute Smart Listing Creation Form */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="glass-modal"
            style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  📝 Post New To-Let (1-Minute Smart Form)
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Define transparent base rent, itemized utility charges, and student preferences.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#1e293b',
                  border: 'none',
                  color: '#94a3b8',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Title & Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Bed with Attached Bath near NSU Gate 2"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Area / Location *
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                  >
                    <option value="Bashundhara R/A">Bashundhara R/A</option>
                    <option value="Saidnagar">Saidnagar</option>
                    <option value="Gulshan">Gulshan</option>
                    <option value="Banani">Banani</option>
                    <option value="Dhanmondi">Dhanmondi</option>
                    <option value="Mirpur">Mirpur</option>
                    <option value="Uttara">Uttara</option>
                  </select>
                </div>
              </div>

              {/* Exact Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Specific Address / Road / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 14, Road 4, Block C, Bashundhara R/A"
                  value={formData.addressText}
                  onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                />
              </div>

              {/* Property & Tenant Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Room / Property Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                  >
                    <option value="single_room">Single Private Room</option>
                    <option value="master_bed">Master Bed (Attached Bath)</option>
                    <option value="shared_seat">Shared Seat (Mess)</option>
                    <option value="sublet">Family Sublet Room</option>
                    <option value="full_flat">Entire Full Flat</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Preferred Tenant
                  </label>
                  <select
                    value={formData.tenantType}
                    onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                  >
                    <option value="bachelor_male">Bachelor Male (Students/Job)</option>
                    <option value="bachelor_female">Bachelor Female (Students/Job)</option>
                    <option value="student_only">Students Only</option>
                    <option value="family">Family Only</option>
                    <option value="any">Any / Open to All</option>
                  </select>
                </div>
              </div>

              {/* Pricing Section (Base Rent + Transparent Utility Breakdown) */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-emerald)', marginBottom: '6px' }}>
                      Monthly Base Rent (BDT ৳) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-amber)', marginBottom: '6px' }}>
                      Utility & Bills Mode
                    </label>
                    <select
                      value={formData.utilityMode}
                      onChange={(e) => setFormData({ ...formData, utilityMode: e.target.value })}
                      style={{ width: '100%', background: '#0f172a', border: '1px solid var(--border-subtle)', color: '#fff', padding: '10px', borderRadius: '8px' }}
                    >
                      <option value="itemized">Option A: Itemized Bill Breakdown</option>
                      <option value="inclusive">Option B: All-Inclusive Fixed Bundle</option>
                      <option value="contact">Option C: Contact for Bills (Shared Meter)</option>
                    </select>
                  </div>
                </div>

                {/* Itemized Breakdown Inputs */}
                {formData.utilityMode === 'itemized' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⚡ Electricity (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.electricity}
                        onChange={(e) => handleUtilityChange('electricity', e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '6px 8px', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🔥 Gas (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.gas}
                        onChange={(e) => handleUtilityChange('gas', e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '6px 8px', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>💧 Water (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.water}
                        onChange={(e) => handleUtilityChange('water', e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '6px 8px', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🏢 Service Charge (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.serviceCharge}
                        onChange={(e) => handleUtilityChange('serviceCharge', e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '6px 8px', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📶 WiFi (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.wifi}
                        onChange={(e) => handleUtilityChange('wifi', e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '6px 8px', borderRadius: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🗑️ Waste Bill (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.waste}
                        onChange={(e) => handleUtilityChange('waste', e.target.value)}
                        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '6px 8px', borderRadius: '6px' }}
                      />
                    </div>
                  </div>
                )}

                {/* Total Calculated Estimate */}
                <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>💡 Total Monthly Cost Estimate for Tenant:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-cyan)' }}>
                    ৳{(Number(formData.rentAmount) + calculateTotalUtility()).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Amenities Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Included Amenities & House Rules
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {amenitiesList.map((item) => {
                    const isSelected = formData.amenities.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleAmenityToggle(item.id)}
                        style={{
                          background: isSelected ? 'var(--brand-cyan)' : '#1e293b',
                          color: isSelected ? '#000' : 'var(--text-secondary)',
                          border: '1px solid ' + (isSelected ? 'var(--brand-cyan)' : '#334155'),
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-emerald">
                  <CheckCircle size={18} /> Publish To-Let Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
