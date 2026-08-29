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
