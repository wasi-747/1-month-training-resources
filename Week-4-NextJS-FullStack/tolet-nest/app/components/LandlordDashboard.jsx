'use client';

import React, { useState } from 'react';
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
  DollarSign,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sliders
} from 'lucide-react';

export default function LandlordDashboard({ listings, onRefresh, onPostListing, onUpdateStatus, onDeleteListing }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'inquiries'
  const [replyText, setReplyText] = useState('');

  // New Listing Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rentAmount: 8500,
    area: 'Bashundhara R/A',
    addressText: '',
    propertyType: 'single_room',
    tenantType: 'bachelor_male',
    utilityMode: 'itemized', // 'itemized' | 'inclusive' | 'contact'
    utilityBreakdown: {
      electricity: 500,
      gas: 250,
      water: 150,
      serviceCharge: 250,
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
    <div style={{ maxWidth: '1100px' }}>
      {/* Top Header */}
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
            <span style={{ fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Management Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff' }}>
            Landlord & Property Manager
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
            Post To-Lets, configure transparent utility costs, and manage privacy-protected tenant inquiries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onRefresh} className="btn-surface" title="Refresh Live Database">
            <RefreshCw size={14} style={{ color: 'var(--brand-primary)' }} /> Sync
          </button>
          <button onClick={() => setShowModal(true)} className="btn-terracotta">
            <PlusCircle size={16} /> Post To-Let
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
            Total Units
          </span>
          <p className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            {totalCount}
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Listed across Dhaka</span>
        </div>

        <div className="card-surface" style={{ padding: '18px', borderLeft: '3px solid var(--brand-sage)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vacant & Available
          </span>
          <p className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-available-text)', marginTop: '4px' }}>
            {availableCount}
          </p>
          <span style={{ color: 'var(--brand-sage)', fontSize: '0.75rem' }}>Ready for move-in</span>
        </div>

        <div className="card-surface" style={{ padding: '18px', borderLeft: '3px solid #7c352d' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Rented / Occupied
          </span>
          <p className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--status-rented-text)', marginTop: '4px' }}>
            {rentedCount}
          </p>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Inquiries paused</span>
        </div>

        <div className="card-surface-elevated" style={{ padding: '18px', borderLeft: '3px solid var(--brand-primary)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'Space Grotesk', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Average Base Rent
          </span>
          <p className="font-heading font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px' }}>
            <span className="taka-symbol">৳</span>{avgRent.toLocaleString()}
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Excluding utilities</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            color: activeTab === 'listings' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderBottom: activeTab === 'listings' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Active Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 16px',
            color: activeTab === 'inquiries' ? 'var(--brand-primary)' : 'var(--text-secondary)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderBottom: activeTab === 'inquiries' ? '2px solid var(--brand-primary)' : '2px solid transparent',
            cursor: 'pointer',
          }}
        >
          Tenant Inquiries & Call Logs
        </button>
      </div>

      {/* Tab 1: Listings Table */}
      {activeTab === 'listings' && (
        <div className="card-surface" style={{ overflowX: 'auto', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Property Details</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Area & Type</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Base Rent</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Utility Charges</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'Space Grotesk', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr
                  key={item._id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                    <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{item.title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: 'var(--brand-primary)' }} /> {item.addressText}
                    </p>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{item.area}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'capitalize' }}>
                      {item.propertyType.replace('_', ' ')} • {item.tenantType.replace('_', ' ')}
                    </p>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#fff' }} className="font-mono">
                    <span className="taka-symbol">৳</span>{item.rentAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.utilityInfo?.mode === 'itemized' && (
                      <div>
                        <span className="font-mono" style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.85rem' }}>
                          +<span className="taka-symbol">৳</span>{(item.utilityInfo.totalUtility || 0).toLocaleString()}
                        </span>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Itemized</p>
                      </div>
                    )}
                    {item.utilityInfo?.mode === 'inclusive' && (
                      <span className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>
                        +<span className="taka-symbol">৳</span>{(item.utilityInfo.totalUtility || 0).toLocaleString()} (Fixed)
                      </span>
                    )}
                    {item.utilityInfo?.mode === 'contact' && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Negotiable</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.status === 'available' && <span className="status-chip status-chip-available">● Available</span>}
                    {item.status === 'visit_scheduled' && <span className="status-chip status-chip-scheduled">● Visit Booked</span>}
                    {item.status === 'rented' && <span className="status-chip status-chip-rented">● Rented</span>}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() =>
                          onUpdateStatus(
                            item._id,
                            item.status === 'available' ? 'rented' : 'available'
                          )
                        }
                        className="btn-surface"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        {item.status === 'available' ? 'Set Rented' : 'Set Available'}
                      </button>
                      <button
                        onClick={() => onDeleteListing(item._id)}
                        className="btn-danger-subtle"
                        style={{ padding: '4px 8px' }}
                        title="Delete listing"
                      >
                        <Trash2 size={13} />
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
        <div className="card-surface" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield size={18} style={{ color: 'var(--brand-sage)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Privacy-Preserving Inquiry Inbox
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '18px' }}>
            Incoming messages from verified student tenants in Dhaka. Personal phone numbers remain masked to prevent spam.
          </p>

          <div
            style={{
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Wasiur Rahman (Student Tenant)</span>
                <p style={{ fontSize: '0.76rem', color: 'var(--brand-primary)', marginTop: '2px' }}>
                  Inquiry on: Bachelor Master Bed (Bashundhara R/A Block C)
                </p>
              </div>
              <span className="status-chip status-chip-available">● Active Thread</span>
            </div>

            {/* Simulated Chat Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0', maxHeight: '200px', overflowY: 'auto' }}>
              <div className="animate-message" style={{ alignSelf: 'flex-start', background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: '10px', maxWidth: '75%', fontSize: '0.85rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '2px' }}>Wasiur (Tenant)</p>
                Assalamu Alaikum Uncle, is the master bed room still available for September?
              </div>

              <div className="animate-message" style={{ alignSelf: 'flex-end', background: 'var(--brand-primary)', color: '#fff', padding: '10px 14px', borderRadius: '10px', maxWidth: '75%', fontSize: '0.85rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', marginBottom: '2px' }}>You (Landlord)</p>
                Walaikum Assalam. Yes Baba, it is available. Are you studying at NSU?
              </div>

              <div className="animate-message" style={{ alignSelf: 'flex-start', background: 'var(--bg-surface-3)', border: '1px solid var(--border-subtle)', padding: '10px 14px', borderRadius: '10px', maxWidth: '75%', fontSize: '0.85rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '2px' }}>Wasiur (Tenant)</p>
                Yes Uncle, I am in my final semester. Is night entry allowed after 11 PM for lab projects?
              </div>

              <div style={{ alignSelf: 'center', background: 'var(--brand-sage-subtle)', color: 'var(--status-available-text)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid var(--status-available-border)' }}>
                📞 In-App Voice Call Completed (1m 34s) • Zero Phone Number Exposure
              </div>
            </div>

            {/* Quick Reply Bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type in-app reply to student..."
                style={{
                  flex: 1,
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={() => {
                  if (replyText) {
                    alert(`Reply sent: "${replyText}"`);
                    setReplyText('');
                  }
                }}
                className="btn-terracotta"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 1-Minute Smart Listing Form */}
      {showModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-modal" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                  Post New To-Let
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  Provide clear base rent, transparent utility breakdown, and student criteria.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'var(--bg-surface-2)', border: 'none', color: 'var(--text-muted)', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title & Area */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Bed with Attached Bath near NSU Gate 2"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '9px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Dhaka Area *
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '9px', borderRadius: '8px', fontSize: '0.88rem' }}
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
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Specific Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Road 4, Block C, Bashundhara (Near Gate 2)"
                  value={formData.addressText}
                  onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '9px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              {/* Room & Tenant Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Room / Accommodation Type
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '9px', borderRadius: '8px' }}
                  >
                    <option value="single_room">Single Private Room</option>
                    <option value="master_bed">Master Bed (Attached Bath)</option>
                    <option value="shared_seat">Shared Seat (Mess)</option>
                    <option value="sublet">Family Sublet Room</option>
                    <option value="full_flat">Entire Full Flat</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Preferred Tenant
                  </label>
                  <select
                    value={formData.tenantType}
                    onChange={(e) => setFormData({ ...formData, tenantType: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '9px', borderRadius: '8px' }}
                  >
                    <option value="bachelor_male">Bachelor Male</option>
                    <option value="bachelor_female">Bachelor Female</option>
                    <option value="student_only">Student Only</option>
                    <option value="family">Family Only</option>
                    <option value="any">Open to All</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Utility Mode */}
              <div style={{ background: 'var(--bg-surface-2)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '5px' }}>
                      Monthly Base Rent (BDT ৳) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '8px', fontSize: '1rem', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      Utility Bills Structure
                    </label>
                    <select
                      value={formData.utilityMode}
                      onChange={(e) => setFormData({ ...formData, utilityMode: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 10px', borderRadius: '8px' }}
                    >
                      <option value="itemized">Itemized Breakdown (Transparent)</option>
                      <option value="inclusive">Fixed Inclusive Bundle</option>
                      <option value="contact">Contact for Bills</option>
                    </select>
                  </div>
                </div>

                {formData.utilityMode === 'itemized' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Electricity (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.electricity}
                        onChange={(e) => handleUtilityChange('electricity', e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gas (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.gas}
                        onChange={(e) => handleUtilityChange('gas', e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Water (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.water}
                        onChange={(e) => handleUtilityChange('water', e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Service Charge (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.serviceCharge}
                        onChange={(e) => handleUtilityChange('serviceCharge', e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WiFi (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.wifi}
                        onChange={(e) => handleUtilityChange('wifi', e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Waste (৳)</span>
                      <input
                        type="number"
                        value={formData.utilityBreakdown.waste}
                        onChange={(e) => handleUtilityChange('waste', e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '5px 8px', borderRadius: '6px', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--brand-primary-subtle)', border: '1px solid var(--brand-primary-border)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#fff' }}>Total Estimated Cost for Tenant:</span>
                  <span className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    <span className="taka-symbol">৳</span>{(Number(formData.rentAmount) + calculateTotalUtility()).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Amenities & House Rules
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {amenitiesList.map((item) => {
                    const isSelected = formData.amenities.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleAmenityToggle(item.id)}
                        style={{
                          background: isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-2)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid ' + (isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)'),
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-surface">
                  Cancel
                </button>
                <button type="submit" className="btn-terracotta">
                  <CheckCircle2 size={16} /> Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
