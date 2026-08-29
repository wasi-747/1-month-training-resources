/**
 * ==============================================================================================
 * 🍃 ToLetNest In-Memory Reactive Mock Store
 * ==============================================================================================
 * Provides a production-grade, zero-setup in-memory database fallback when local MongoDB is offline.
 * Includes Haversine spatial proximity calculation and seeded realistic Dhaka To-Let listings.
 * ==============================================================================================
 */

// Haversine Distance Formula (calculates distance in km between two GPS coordinates)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

// Seeded Hyper-Realistic Dhaka To-Let Listings
let inMemoryListings = [
  {
    _id: 'listing-1',
    title: 'Bachelor Master Bed with Attached Bath & Balcony',
    description:
      'Fully tiled, high-ceiling master bed available for 1/2 male students or job holders. 24/7 gas, high-speed WiFi, lift, and generator backup. No curfew restrictions.',
    rentAmount: 8500,
    area: 'Bashundhara R/A',
    addressText: 'Road 4, Block C, Bashundhara R/A (2 mins walk to NSU Gate 2)',
    location: {
      type: 'Point',
      coordinates: [90.4278, 23.8155], // [lng, lat]
    },
    propertyType: 'master_bed',
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 1450,
      breakdown: {
        electricity: 600,
        gas: 250,
        water: 200,
        serviceCharge: 250,
        wifi: 150,
        waste: 0,
      },
    },
    amenities: ['attached_bath', 'balcony', 'wifi', 'lift', 'generator', 'gas', 'no_curfew'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Engr. Rafiqul Islam',
      phone: '01711-234567',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 142,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-2',
    title: 'Female Student Sublet Room (Near IUB & AIUB Shuttle)',
    description:
      'Cozy separate single room for female student in a safe family building with CCTV. Maid/meal system available on shared basis.',
    rentAmount: 6500,
    area: 'Bashundhara R/A',
    addressText: 'Road 11, Block D, Bashundhara R/A (Near Apollo / Evercare)',
    location: {
      type: 'Point',
      coordinates: [90.4312, 23.8182],
    },
    propertyType: 'single_room',
    tenantType: 'bachelor_female',
    utilityInfo: {
      mode: 'inclusive',
      totalUtility: 1000,
      breakdown: {
        electricity: 0,
        gas: 0,
        water: 0,
        serviceCharge: 0,
        wifi: 0,
        waste: 0,
      },
    },
    amenities: ['wifi', 'lift', 'gas', 'meal_system'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Mrs. Selina Akhter',
      phone: '01819-876543',
      showPublicPhone: true,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 98,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-3',
    title: 'Affordable 1-Seat in 2-Bed Mess Flat',
    description:
      'Budget-friendly seat vacancy for male student or fresh graduate. Shared kitchen, filtered water, high-speed optic fiber.',
    rentAmount: 3800,
    area: 'Saidnagar',
    addressText: 'Saidnagar Main Road, Near 100 Feet Madani Avenue',
    location: {
      type: 'Point',
      coordinates: [90.442, 23.7995],
    },
    propertyType: 'shared_seat',
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 850,
      breakdown: {
        electricity: 350,
        gas: 150,
        water: 150,
        serviceCharge: 100,
        wifi: 100,
        waste: 0,
      },
    },
    amenities: ['wifi', 'gas', 'meal_system'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Tanvir Ahmed (Mess Manager)',
      phone: '01912-334455',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 215,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-4',
    title: 'Executive 3-Bed Family Flat with Car Parking',
    description:
      'Spacious 1,550 sqft south-facing flat on 5th floor. 3 beds, 3 baths, large drawing-dining, 2 balconies. Dedicated generator line.',
    rentAmount: 28000,
    area: 'Dhanmondi',
    addressText: 'Road 27 (Old) / 16 (New), Dhanmondi',
    location: {
      type: 'Point',
      coordinates: [90.3742, 23.7538],
    },
    propertyType: 'full_flat',
    tenantType: 'family',
    utilityInfo: {
      mode: 'contact',
      totalUtility: 0,
      breakdown: {},
    },
    amenities: ['attached_bath', 'balcony', 'lift', 'generator', 'gas'],
    availableFrom: new Date('2026-10-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Alhaj M. A. Karim',
      phone: '01712-998877',
      showPublicPhone: true,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 310,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-5',
    title: 'Studio Apartment for Tech Professional / Bachelor',
    description:
      'Modern open-concept studio with modular kitchenette, air conditioner point, and 24/7 security. Prime location near Gulshan 1 Circle.',
    rentAmount: 18500,
    area: 'Gulshan',
    addressText: 'Road 132, Gulshan 1, Dhaka',
    location: {
      type: 'Point',
      coordinates: [90.4152, 23.7808],
    },
    propertyType: 'sublet',
    tenantType: 'job_holder',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 2200,
      breakdown: {
        electricity: 1200,
        gas: 300,
        water: 250,
        serviceCharge: 300,
        wifi: 150,
        waste: 0,
      },
    },
    amenities: ['attached_bath', 'balcony', 'wifi', 'lift', 'generator', 'gas', 'no_curfew'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'visit_scheduled',
    landlord: {
      name: 'Dr. Farhana Yasmin',
      phone: '01611-445566',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 180,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-6',
    title: 'Single Room with Balcony in Bachelor Flat (Mirpur 10)',
    description:
      'Peaceful single room right next to Mirpur 10 Metro Station. Easy commute, gas cylinder, WiFi, and cleaning maid included.',
    rentAmount: 5500,
    area: 'Mirpur',
    addressText: 'Block C, Section 10, Mirpur (Near Metro Pillar 240)',
    location: {
      type: 'Point',
      coordinates: [90.3685, 23.8071],
    },
    propertyType: 'single_room',
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 950,
      breakdown: {
        electricity: 400,
        gas: 200,
        water: 150,
        serviceCharge: 100,
        wifi: 100,
        waste: 0,
      },
    },
    amenities: ['balcony', 'wifi', 'gas', 'meal_system'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Jasim Uddin',
      phone: '01815-112233',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 165,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-7',
    title: 'Bachelor Master Room near BRAC / East West (Middle Badda)',
    description:
      'Separate attached bath master room for male students or job holders. 2 minutes from Middle Badda Link Road & Hatirjheel. High-speed optic fiber WiFi and generator.',
    rentAmount: 7200,
    area: 'Badda',
    addressText: 'Pragoti Shoroni, Middle Badda (Near Link Road & Hatirjheel)',
    location: {
      type: 'Point',
      coordinates: [90.4260, 23.7812],
    },
    propertyType: 'master_bed',
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 1100,
      breakdown: {
        electricity: 450,
        gas: 200,
        water: 150,
        serviceCharge: 150,
        wifi: 150,
        waste: 0,
      },
    },
    amenities: ['attached_bath', 'balcony', 'wifi', 'gas', 'no_curfew'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Advocate Monirul Islam',
      phone: '01712-445566',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 145,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-8',
    title: 'Furnished Female Student Sublet in Aftabnagar Block B',
    description:
      'Spacious well-ventilated room with attached balcony for female student in Aftabnagar Block B. Very close to East West University & Rampura Bridge.',
    rentAmount: 6000,
    area: 'Aftabnagar',
    addressText: 'Road 3, Block B, Aftabnagar (5 mins walk to East West University)',
    location: {
      type: 'Point',
      coordinates: [90.4350, 23.7680],
    },
    propertyType: 'single_room',
    tenantType: 'bachelor_female',
    utilityInfo: {
      mode: 'inclusive',
      totalUtility: 850,
      breakdown: {
        electricity: 0,
        gas: 0,
        water: 0,
        serviceCharge: 0,
        wifi: 0,
        waste: 0,
      },
    },
    amenities: ['balcony', 'wifi', 'lift', 'gas', 'meal_system'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    rentalCategory: 'sublet',
    quantityAvailable: 1,
    landlord: {
      name: 'Mrs. Rokeya Begum',
      phone: '01819-223344',
      showPublicPhone: true,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 110,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-9',
    title: '1 Seat Vacant in 2-Person Bachelor Room (Near NSU Gate 8)',
    description:
      'Replacing my seat as I am graduating. Non-smoker, friendly NSU/IUB student preferred. High-speed optic WiFi, maid and fridge included.',
    rentAmount: 3800,
    area: 'Bashundhara R/A',
    addressText: 'Road 8, Block C, Bashundhara R/A (Opposite NSU Gate 8)',
    location: {
      type: 'Point',
      coordinates: [90.4289, 23.8160],
    },
    propertyType: 'seat_rent',
    rentalCategory: 'seat',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 750,
      breakdown: {
        electricity: 300,
        gas: 150,
        water: 100,
        serviceCharge: 100,
        wifi: 100,
        waste: 0,
      },
    },
    amenities: ['wifi', 'attached_bath', 'meal_system', 'gas', 'no_curfew'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Tanvir Ahmed (Outgoing Student)',
      phone: '01719-887766',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 220,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-10',
    title: 'Low-Budget Partitioned Dining Space Bed for Student / Job Seeker',
    description:
      'Curtain-partitioned single bed in spacious dining hall with personal locker and study table space. Low cost, peaceful bachelor flat with 24/7 water and WiFi.',
    rentAmount: 2800,
    area: 'Saidnagar',
    addressText: 'Main Road, Saidnagar, Vatara (Near 100 Feet Road Bridge)',
    location: {
      type: 'Point',
      coordinates: [90.4425, 23.7990],
    },
    propertyType: 'dining_space',
    rentalCategory: 'dining_space',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'inclusive',
      totalUtility: 600,
      breakdown: {
        electricity: 0,
        gas: 0,
        water: 0,
        serviceCharge: 0,
        wifi: 0,
        waste: 0,
      },
    },
    amenities: ['wifi', 'gas', 'meal_system'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Shakil Mahmud (Flat Manager)',
      phone: '01912-334455',
      showPublicPhone: false,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 195,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'listing-11',
    title: 'Full 3-Bed Bachelor / Family Flat (3 Bed, 3 Bath, 2 Balcony)',
    description:
      'Entire 4th-floor flat available for university student group or family. 3 spacious bedrooms, drawing, dining, lift, generator, and guard security.',
    rentAmount: 24000,
    area: 'Dhanmondi',
    addressText: 'Road 27 (Old), Dhanmondi (Near Star Kabab & Rapa Plaza)',
    location: {
      type: 'Point',
      coordinates: [90.3742, 23.7538],
    },
    propertyType: 'full_flat',
    rentalCategory: 'full_flat',
    quantityAvailable: 1,
    tenantType: 'any',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 3500,
      breakdown: {
        electricity: 1800,
        gas: 800,
        water: 400,
        serviceCharge: 500,
        wifi: 0,
        waste: 0,
      },
    },
    amenities: ['attached_bath', 'balcony', 'lift', 'generator', 'gas', 'no_curfew'],
    availableFrom: new Date('2026-09-01T00:00:00.000Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    landlord: {
      name: 'Kazi Nurul Huda (Building Owner)',
      phone: '01711-889900',
      showPublicPhone: true,
      allowInAppCall: true,
      allowInAppChat: true,
    },
    viewsCount: 340,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Seeded In-Memory Conversations (for In-App Chat & Call Simulation)
let inMemoryConversations = [
  {
    _id: 'conv-1',
    listingId: 'listing-1',
    listingTitle: 'Bachelor Master Bed with Attached Bath & Balcony',
    tenantName: 'Wasiur Rahman',
    landlordName: 'Engr. Rafiqul Islam',
    status: 'active',
    messages: [
      {
        id: 'msg-1',
        sender: 'tenant',
        text: 'Assalamu Alaikum Uncle, is the master bed room still available for September?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'landlord',
        text: 'Walaikum Assalam. Yes Baba, it is available. Are you studying at NSU?',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: 'msg-3',
        sender: 'tenant',
        text: 'Yes Uncle, I am in my final semester. Is night entry allowed after 11 PM for lab projects?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'msg-4',
        sender: 'landlord',
        text: 'Yes, we provide main gate key to students. Feel free to give an in-app call or visit tomorrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
    callLogs: [
      {
        id: 'call-1',
        durationSeconds: 94, // 1 min 34 sec
        status: 'completed',
        initiatedBy: 'tenant',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
    ],
    lastActivity: new Date().toISOString(),
  },
];

// Fallback Reactive API Store
export const mockStore = {
  // 1. Get Listings with Filtering and Distance Calculation
  getListings: (query = {}) => {
    let list = [...inMemoryListings];

    // Area filter
    if (query.area && query.area !== 'all') {
      list = list.filter(
        (item) => item.area.toLowerCase() === query.area.toLowerCase() || item.area.toLowerCase().includes(query.area.toLowerCase())
      );
    }

    // Tenant type filter
    if (query.tenantType && query.tenantType !== 'all') {
      list = list.filter((item) => item.tenantType === query.tenantType || item.tenantType === 'any');
    }

    // Property type filter
    if (query.propertyType && query.propertyType !== 'all') {
      list = list.filter((item) => item.propertyType === query.propertyType);
    }

    // Rent Range filter
    if (query.minRent) {
      list = list.filter((item) => item.rentAmount >= Number(query.minRent));
    }
    if (query.maxRent) {
      list = list.filter((item) => item.rentAmount <= Number(query.maxRent));
    }

    // Amenities filter (all requested amenities must be present)
    if (query.amenities) {
      const requiredAmenities = Array.isArray(query.amenities)
        ? query.amenities
        : query.amenities.split(',').map((a) => a.trim());

      list = list.filter((item) =>
        requiredAmenities.every((req) => item.amenities.includes(req))
      );
    }

    // Search query (matches title, address, or description)
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.addressText.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (query.status && query.status !== 'all') {
      list = list.filter((item) => item.status === query.status);
    }

    // Proximity Distance Calculation (from user's current GPS)
    const userLat = Number(query.userLat) || 23.8165; // Default Bashundhara Center
    const userLng = Number(query.userLng) || 90.4285;

    list = list.map((item) => {
      const distanceKm = calculateDistanceKm(
        userLat,
        userLng,
        item.location.coordinates[1],
        item.location.coordinates[0]
      );
      return {
        ...item,
        distanceKm,
        totalEstimatedCost: item.rentAmount + (item.utilityInfo?.totalUtility || 0),
      };
    });

    // Sort by proximity if requested, or by newest
    if (query.sortBy === 'distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (query.sortBy === 'price_low') {
      list.sort((a, b) => a.rentAmount - b.rentAmount);
    } else if (query.sortBy === 'price_high') {
      list.sort((a, b) => b.rentAmount - a.rentAmount);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  },

  // 2. Create Listing
  createListing: (data) => {
    const defaultCoords = {
      'Bashundhara R/A': [90.4285, 23.8165],
      Saidnagar: [90.442, 23.7995],
      Badda: [90.4260, 23.7812],
      Aftabnagar: [90.4350, 23.7680],
      Gulshan: [90.4152, 23.7808],
      Banani: [90.4043, 23.7937],
      Dhanmondi: [90.3742, 23.7538],
      Mirpur: [90.3685, 23.8071],
      Uttara: [90.3973, 23.8759],
      Mohakhali: [90.4005, 23.7776],
    };

    const areaCoords = defaultCoords[data.area] || [90.4285, 23.8165];

    let totalUtility = 0;
    if (data.utilityInfo?.mode === 'itemized' && data.utilityInfo?.breakdown) {
      const b = data.utilityInfo.breakdown;
      totalUtility =
        (Number(b.electricity) || 0) +
        (Number(b.gas) || 0) +
        (Number(b.water) || 0) +
        (Number(b.serviceCharge) || 0) +
        (Number(b.wifi) || 0) +
        (Number(b.waste) || 0);
    } else if (data.utilityInfo?.mode === 'inclusive') {
      totalUtility = Number(data.utilityInfo.amount) || 0;
    }

    const newListing = {
      _id: 'listing-' + (Date.now() + Math.floor(Math.random() * 1000)),
      title: data.title,
      description: data.description || '',
      rentAmount: Number(data.rentAmount),
      area: data.area || 'Bashundhara R/A',
      addressText: data.addressText || data.area,
      location: {
        type: 'Point',
        coordinates: data.coordinates || areaCoords,
      },
      propertyType: data.propertyType || 'single_room',
      tenantType: data.tenantType || 'bachelor_male',
      utilityInfo: {
        mode: data.utilityInfo?.mode || 'itemized',
        totalUtility,
        breakdown: data.utilityInfo?.breakdown || {},
      },
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      availableFrom: data.availableFrom || new Date().toISOString(),
      images: Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
      status: data.status || 'available',
      landlord: {
        name: data.landlord?.name || 'Apartment Owner',
        phone: data.landlord?.phone || '01700-000000',
        showPublicPhone: Boolean(data.landlord?.showPublicPhone),
        allowInAppCall: true,
        allowInAppChat: true,
      },
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryListings.unshift(newListing);
    return newListing;
  },

  // 3. Update Listing Status (Available ↔ Rented)
  updateStatus: (id, status) => {
    const idx = inMemoryListings.findIndex((item) => item._id === id);
    if (idx === -1) return null;
    inMemoryListings[idx].status = status;
    inMemoryListings[idx].updatedAt = new Date().toISOString();
    return inMemoryListings[idx];
  },

  // 4. Delete Listing
  deleteListing: (id) => {
    const idx = inMemoryListings.findIndex((item) => item._id === id);
    if (idx === -1) return false;
    inMemoryListings.splice(idx, 1);
    return true;
  },

  // 5. Get or Create Conversation
  getConversation: (listingId) => {
    let conv = inMemoryConversations.find((c) => c.listingId === listingId);
    if (!conv) {
      const listing = inMemoryListings.find((l) => l._id === listingId);
      conv = {
        _id: 'conv-' + Date.now(),
        listingId,
        listingTitle: listing ? listing.title : 'To-Let Inquiry',
        tenantName: 'Wasiur Rahman',
        landlordName: listing ? listing.landlord.name : 'Flat Owner',
        status: 'active',
        messages: [
          {
            id: 'msg-init',
            sender: 'system',
            text: '🔒 Privacy Shield Active: This in-app chat & call channel is private. Your phone number is hidden.',
            timestamp: new Date().toISOString(),
          },
        ],
        callLogs: [],
        lastActivity: new Date().toISOString(),
      };
      inMemoryConversations.unshift(conv);
    }
    return conv;
  },

  // 6. Send Message
  sendMessage: (listingId, sender, text) => {
    const conv = mockStore.getConversation(listingId);
    if (conv.status.startsWith('closed')) {
      return { error: 'This conversation has been closed.' };
    }
    const newMsg = {
      id: 'msg-' + Date.now(),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    conv.messages.push(newMsg);
    conv.lastActivity = new Date().toISOString();
    return { success: true, message: newMsg, conversation: conv };
  },

  // 7. Log Call
  logCall: (listingId, durationSeconds, status = 'completed') => {
    const conv = mockStore.getConversation(listingId);
    const callEntry = {
      id: 'call-' + Date.now(),
      durationSeconds,
      status,
      initiatedBy: 'tenant',
      timestamp: new Date().toISOString(),
    };
    conv.callLogs.push(callEntry);

    // Also add system notice to chat
    conv.messages.push({
      id: 'msg-call-' + Date.now(),
      sender: 'system',
      text: `📞 In-App Voice Call: ${status === 'completed' ? `Connected (${durationSeconds}s)` : 'Missed Call'}`,
      timestamp: new Date().toISOString(),
    });

    conv.lastActivity = new Date().toISOString();
    return callEntry;
  },

  // 8. One-Tap Close Chat (Anti-Harassment Shield)
  closeChat: (listingId, closedBy = 'tenant') => {
    const conv = mockStore.getConversation(listingId);
    conv.status = closedBy === 'tenant' ? 'closed_by_tenant' : 'closed_by_landlord';
    conv.messages.push({
      id: 'msg-close-' + Date.now(),
      sender: 'system',
      text: `🛑 Negotiation ended. Chat closed by ${closedBy}. No further calls or messages can be sent.`,
      timestamp: new Date().toISOString(),
    });
    conv.lastActivity = new Date().toISOString();
    return conv;
  },

  // 9. Analytics Summary
  getAnalytics: () => {
    const total = inMemoryListings.length;
    const available = inMemoryListings.filter((l) => l.status === 'available').length;
    const rented = inMemoryListings.filter((l) => l.status === 'rented').length;
    const byArea = {
      'Bashundhara R/A': inMemoryListings.filter((l) => l.area === 'Bashundhara R/A').length,
      Saidnagar: inMemoryListings.filter((l) => l.area === 'Saidnagar').length,
      Gulshan: inMemoryListings.filter((l) => l.area === 'Gulshan').length,
      Dhanmondi: inMemoryListings.filter((l) => l.area === 'Dhanmondi').length,
      Mirpur: inMemoryListings.filter((l) => l.area === 'Mirpur').length,
    };
    const avgRent = total > 0 ? Math.round(inMemoryListings.reduce((sum, l) => sum + l.rentAmount, 0) / total) : 0;
    return {
      total,
      available,
      rented,
      byArea,
      avgRent,
    };
  },
};
