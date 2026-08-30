import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://t6mnintendo_db_user:JEcnYOXpUZXioqyN@tolet.aymlr27.mongodb.net/tolet_nest?retryWrites=true&w=majority&appName=Tolet';

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rentAmount: { type: Number, required: true },
    area: { type: String, required: true },
    addressText: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    propertyType: { type: String, default: 'room_rent' },
    rentalCategory: { type: String, default: 'room' },
    quantityAvailable: { type: Number, default: 1 },
    tenantType: { type: String, default: 'bachelor_male' },
    utilityInfo: {
      mode: { type: String, default: 'itemized' },
      totalUtility: { type: Number, default: 0 },
      breakdown: {
        electricity: { type: Number, default: 0 },
        gas: { type: Number, default: 0 },
        water: { type: Number, default: 0 },
        serviceCharge: { type: Number, default: 0 },
        wifi: { type: Number, default: 0 },
        waste: { type: Number, default: 0 },
      },
    },
    amenities: [String],
    availableFrom: { type: Date, default: Date.now },
    images: [String],
    status: { type: String, default: 'available' },
    landlord: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      showPublicPhone: { type: Boolean, default: false },
      allowInAppCall: { type: Boolean, default: true },
      allowInAppChat: { type: Boolean, default: true },
    },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ListingSchema.index({ location: '2dsphere' });
const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

const seedData = [
  {
    title: '1 Seat Vacant in 2-Person Bachelor Room (Near NSU Gate 8)',
    description: 'Replacing my seat as I am graduating. Friendly NSU/IUB student preferred. High-speed optic WiFi, maid and fridge included.',
    rentAmount: 3800,
    area: 'Bashundhara R/A',
    addressText: 'Road 8, Block C, Bashundhara R/A (Opposite NSU Gate 8)',
    location: { type: 'Point', coordinates: [90.4289, 23.8160] },
    propertyType: 'seat_rent',
    rentalCategory: 'seat',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 750,
      breakdown: { electricity: 300, gas: 150, water: 100, serviceCharge: 100, wifi: 100, waste: 0 },
    },
    amenities: ['wifi', 'attached_bath', 'meal_system', 'gas', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Tanvir Ahmed (Outgoing Student)', phone: '01719-887766', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 220,
  },
  {
    title: 'Bachelor Master Bed with Attached Bath & Balcony',
    description: 'Fully tiled, high-ceiling master bed available for male students or job holders. 24/7 gas, high-speed WiFi, lift, and generator backup.',
    rentAmount: 8500,
    area: 'Bashundhara R/A',
    addressText: 'Road 4, Block C, Bashundhara R/A (2 mins walk to NSU Gate 2)',
    location: { type: 'Point', coordinates: [90.4278, 23.8155] },
    propertyType: 'master_bed',
    rentalCategory: 'room',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 1450,
      breakdown: { electricity: 600, gas: 250, water: 200, serviceCharge: 250, wifi: 150, waste: 0 },
    },
    amenities: ['attached_bath', 'balcony', 'wifi', 'lift', 'generator', 'gas', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Engr. Rafiqul Islam', phone: '01711-234567', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 142,
  },
  {
    title: 'Low-Budget Partitioned Dining Space Bed for Student',
    description: 'Curtain-partitioned single bed in spacious dining hall with personal locker and study space. Peaceful bachelor flat.',
    rentAmount: 2800,
    area: 'Saidnagar',
    addressText: 'Main Road, Saidnagar, Vatara (Near 100 Feet Road Bridge)',
    location: { type: 'Point', coordinates: [90.4425, 23.7990] },
    propertyType: 'dining_space',
    rentalCategory: 'dining_space',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: { mode: 'inclusive', totalUtility: 600, breakdown: { electricity: 0, gas: 0, water: 0, serviceCharge: 0, wifi: 0, waste: 0 } },
    amenities: ['wifi', 'gas', 'meal_system'],
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Shakil Mahmud (Flatmate)', phone: '01912-334455', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 195,
  },
  {
    title: 'Bachelor Master Room near BRAC / East West (Middle Badda)',
    description: 'Separate attached bath master room for male students or job holders. 2 mins from Middle Badda Link Road & Hatirjheel.',
    rentAmount: 7200,
    area: 'Badda',
    addressText: 'Pragoti Shoroni, Middle Badda (Near Link Road & Hatirjheel)',
    location: { type: 'Point', coordinates: [90.4260, 23.7812] },
    propertyType: 'master_bed',
    rentalCategory: 'room',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 1100,
      breakdown: { electricity: 450, gas: 200, water: 150, serviceCharge: 150, wifi: 150, waste: 0 },
    },
    amenities: ['attached_bath', 'balcony', 'wifi', 'gas', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Advocate Monirul Islam', phone: '01712-445566', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 145,
  },
  {
    title: 'Furnished Female Student Sublet in Aftabnagar Block B',
    description: 'Spacious well-ventilated room with attached balcony for female student in Aftabnagar Block B. Very close to East West University.',
    rentAmount: 6000,
    area: 'Aftabnagar',
    addressText: 'Road 3, Block B, Aftabnagar (5 mins walk to East West University)',
    location: { type: 'Point', coordinates: [90.4350, 23.7680] },
    propertyType: 'single_room',
    rentalCategory: 'sublet',
    quantityAvailable: 1,
    tenantType: 'bachelor_female',
    utilityInfo: { mode: 'inclusive', totalUtility: 850, breakdown: { electricity: 0, gas: 0, water: 0, serviceCharge: 0, wifi: 0, waste: 0 } },
    amenities: ['balcony', 'wifi', 'lift', 'gas', 'meal_system'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Mrs. Rokeya Begum', phone: '01819-223344', showPublicPhone: true, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 110,
  },
  {
    title: 'Full 3-Bed Bachelor / Family Flat in Dhanmondi 27',
    description: 'Entire 4th-floor flat available for student group or family. 3 spacious bedrooms, drawing, dining, lift, generator.',
    rentAmount: 24000,
    area: 'Dhanmondi',
    addressText: 'Road 27 (Old), Dhanmondi (Near Star Kabab & Rapa Plaza)',
    location: { type: 'Point', coordinates: [90.3742, 23.7538] },
    propertyType: 'full_flat',
    rentalCategory: 'full_flat',
    quantityAvailable: 1,
    tenantType: 'any',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 3500,
      breakdown: { electricity: 1800, gas: 800, water: 400, serviceCharge: 500, wifi: 0, waste: 0 },
    },
    amenities: ['attached_bath', 'balcony', 'lift', 'generator', 'gas', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Kazi Nurul Huda (Building Owner)', phone: '01711-889900', showPublicPhone: true, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 340,
  },

  // 🏢 TECHDOJO & UTTARA SECTOR 4/6 LISTINGS (Right Next to Office for Live GPS Demo!)
  {
    title: '1 Seat in 2-Bed Bachelor Room (Opposite TechDojo, Road 6)',
    description: 'Directly opposite TechDojo office on Road 6, Sector 4. Ideal for software interns, trainees, or IUBAT students. High-speed optic fiber WiFi, gas, maid service included.',
    rentAmount: 3600,
    area: 'Uttara',
    addressText: 'House 14, Road 6, Sector 4, Uttara (Opposite TechDojo)',
    location: { type: 'Point', coordinates: [90.4008, 23.8640] }, // 40m from TechDojo
    propertyType: 'seat_rent',
    rentalCategory: 'seat',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 750,
      breakdown: { electricity: 300, gas: 150, water: 100, serviceCharge: 100, wifi: 100, waste: 0 },
    },
    amenities: ['wifi', 'gas', 'meal_system', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Shakil Ahmed (Tech Intern)', phone: '01719-223344', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 290,
  },
  {
    title: 'Furnished Single Room with Balcony (Road 4, Sector 6, Uttara)',
    description: 'Well-ventilated single room with wide balcony in Sector 6. 2 minutes walk to TechDojo and Sector 6 Park. 24/7 water, WiFi, and cleaning maid.',
    rentAmount: 5800,
    area: 'Uttara',
    addressText: 'Road 4, Sector 6, Uttara (2 mins walk to TechDojo)',
    location: { type: 'Point', coordinates: [90.4015, 23.8648] }, // 150m from TechDojo
    propertyType: 'single_room',
    rentalCategory: 'room',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 900,
      breakdown: { electricity: 400, gas: 200, water: 150, serviceCharge: 150, wifi: 0, waste: 0 },
    },
    amenities: ['balcony', 'wifi', 'gas', 'meal_system'],
    images: ['https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Mahmudur Rahman', phone: '01815-998877', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 215,
  },
  {
    title: 'Bachelor Master Bed with Attached Bath (Sector 4, Near Jashimuddin Metro)',
    description: 'Spacious master bedroom with personal attached bathroom and private balcony. Located near Jashimuddin Avenue & Metro Station, 5 mins walk to TechDojo.',
    rentAmount: 8200,
    area: 'Uttara',
    addressText: 'Road 8, Sector 4, Uttara (Near Jashimuddin Metro & Sector 4 Kalyan Samity)',
    location: { type: 'Point', coordinates: [90.3995, 23.8630] }, // 160m from TechDojo
    propertyType: 'master_bed',
    rentalCategory: 'room',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 1300,
      breakdown: { electricity: 550, gas: 250, water: 200, serviceCharge: 200, wifi: 100, waste: 0 },
    },
    amenities: ['attached_bath', 'balcony', 'wifi', 'lift', 'generator', 'gas', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Engr. Tariqul Islam', phone: '01712-334455', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 380,
  },
  {
    title: 'Female Student / Intern Sublet Room (Sector 6, Road 8, Uttara)',
    description: 'Safe and peaceful sublet room for female student or tech trainee in a gated family building with 24/7 CCTV and security guard. Meal system available.',
    rentAmount: 6000,
    area: 'Uttara',
    addressText: 'Road 8, Sector 6, Uttara (Near Sector 6 Lake & High School)',
    location: { type: 'Point', coordinates: [90.4020, 23.8655] }, // 280m from TechDojo
    propertyType: 'single_room',
    rentalCategory: 'sublet',
    quantityAvailable: 1,
    tenantType: 'bachelor_female',
    utilityInfo: {
      mode: 'inclusive',
      totalUtility: 800,
      breakdown: { electricity: 0, gas: 0, water: 0, serviceCharge: 0, wifi: 0, waste: 0 },
    },
    amenities: ['wifi', 'lift', 'gas', 'meal_system'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Mrs. Ferdousi Begum', phone: '01819-556677', showPublicPhone: true, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 160,
  },
  {
    title: 'Budget Partitioned Dining Bed for Tech Trainee (Sector 4, Road 11)',
    description: 'Low-cost curtain partitioned bed space with study table, locker, and high-speed fiber internet. Non-smoker friendly bachelor flat.',
    rentAmount: 2600,
    area: 'Uttara',
    addressText: 'Road 11, Sector 4, Uttara (Near Sector 4 Park)',
    location: { type: 'Point', coordinates: [90.3990, 23.8622] }, // 320m from TechDojo
    propertyType: 'dining_space',
    rentalCategory: 'dining_space',
    quantityAvailable: 1,
    tenantType: 'bachelor_male',
    utilityInfo: {
      mode: 'inclusive',
      totalUtility: 500,
      breakdown: { electricity: 0, gas: 0, water: 0, serviceCharge: 0, wifi: 0, waste: 0 },
    },
    amenities: ['wifi', 'gas', 'meal_system'],
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Rubel Hossain (Flat Admin)', phone: '01911-223344', showPublicPhone: false, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 245,
  },
  {
    title: 'Full 3-Bed Bachelor Flat for Tech/Student Team (Sector 6 Main Road)',
    description: 'Entire 3rd floor flat available for 4-6 IT professionals or university students. 3 large bedrooms, drawing, dining, 3 baths, 2 balconies, lift, generator.',
    rentAmount: 23000,
    area: 'Uttara',
    addressText: 'Sector 6 Main Road, Uttara (Near Sector 6 High School)',
    location: { type: 'Point', coordinates: [90.4025, 23.8665] }, // 400m from TechDojo
    propertyType: 'full_flat',
    rentalCategory: 'full_flat',
    quantityAvailable: 1,
    tenantType: 'any',
    utilityInfo: {
      mode: 'itemized',
      totalUtility: 3200,
      breakdown: { electricity: 1600, gas: 800, water: 300, serviceCharge: 500, wifi: 0, waste: 0 },
    },
    amenities: ['attached_bath', 'balcony', 'lift', 'generator', 'gas', 'no_curfew'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    status: 'available',
    landlord: { name: 'Alhaj M. A. Rashid', phone: '01711-667788', showPublicPhone: true, allowInAppCall: true, allowInAppChat: true },
    viewsCount: 410,
  },
];

async function seed() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas Cloud Cluster...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Atlas Cloud Database!');

    await Listing.deleteMany({});
    console.log('🧹 Cleared existing listings in Atlas database.');

    await Listing.insertMany(seedData);
    console.log(`🎉 Successfully seeded ${seedData.length} live listings to MongoDB Atlas Cloud Cluster!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding Atlas:', err);
    process.exit(1);
  }
}

seed();
