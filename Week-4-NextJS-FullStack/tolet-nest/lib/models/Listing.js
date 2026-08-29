import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    rentAmount: {
      type: Number,
      required: [true, 'Base monthly rent is required'],
      min: [1000, 'Rent must be at least 1,000 BDT'],
    },
    area: {
      type: String,
      required: [true, 'Area/Neighborhood is required'],
      enum: [
        'Bashundhara R/A',
        'Saidnagar',
        'Gulshan',
        'Banani',
        'Dhanmondi',
        'Mirpur',
        'Uttara',
        'Mohakhali',
      ],
      default: 'Bashundhara R/A',
    },
    addressText: {
      type: String,
      required: [true, 'Specific address/Road/Block is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [90.4285, 23.8165], // Center of Bashundhara R/A
      },
    },
    propertyType: {
      type: String,
      enum: ['single_room', 'master_bed', 'shared_seat', 'sublet', 'full_flat'],
      default: 'single_room',
    },
    tenantType: {
      type: String,
      enum: ['bachelor_male', 'bachelor_female', 'student_only', 'family', 'job_holder', 'any'],
      default: 'bachelor_male',
    },
    utilityInfo: {
      mode: {
        type: String,
        enum: ['itemized', 'inclusive', 'contact'],
        default: 'itemized',
      },
      totalUtility: {
        type: Number,
        default: 0,
      },
      breakdown: {
        electricity: { type: Number, default: 0 },
        gas: { type: Number, default: 0 },
        water: { type: Number, default: 0 },
        serviceCharge: { type: Number, default: 0 },
        wifi: { type: Number, default: 0 },
        waste: { type: Number, default: 0 },
      },
    },
    amenities: {
      type: [String],
      default: ['wifi', 'attached_bath'],
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['available', 'visit_scheduled', 'rented'],
      default: 'available',
    },
    landlord: {
      name: { type: String, required: true, default: 'Apartment Owner' },
      phone: { type: String, default: '01700-000000' },
      showPublicPhone: { type: Boolean, default: false },
      allowInAppCall: { type: Boolean, default: true },
      allowInAppChat: { type: Boolean, default: true },
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save Mongoose normalization middleware
ListingSchema.pre('save', function (next) {
  // Normalize amenities array
  if (Array.isArray(this.amenities)) {
    this.amenities = this.amenities.map((a) => a.trim().toLowerCase()).filter(Boolean);
  }

  // Calculate total utility if itemized mode
  if (this.utilityInfo && this.utilityInfo.mode === 'itemized' && this.utilityInfo.breakdown) {
    const b = this.utilityInfo.breakdown;
    this.utilityInfo.totalUtility =
      (b.electricity || 0) +
      (b.gas || 0) +
      (b.water || 0) +
      (b.serviceCharge || 0) +
      (b.wifi || 0) +
      (b.waste || 0);
  }

  next();
});

// Geo-Spatial 2dsphere index for location radius queries ($near, $geoWithin)
ListingSchema.index({ location: '2dsphere' });

export const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
