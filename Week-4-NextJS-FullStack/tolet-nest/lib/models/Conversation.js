import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['tenant', 'landlord', 'system'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const CallLogSchema = new mongoose.Schema(
  {
    durationSeconds: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['completed', 'missed', 'rejected'],
      default: 'completed',
    },
    initiatedBy: { type: String, enum: ['tenant', 'landlord'], default: 'tenant' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    listingId: {
      type: String,
      required: true,
      index: true,
    },
    listingTitle: {
      type: String,
      default: '',
    },
    tenantName: {
      type: String,
      required: true,
      default: 'Student Tenant',
    },
    landlordName: {
      type: String,
      required: true,
      default: 'Flat Owner',
    },
    status: {
      type: String,
      enum: ['active', 'closed_by_tenant', 'closed_by_landlord', 'booked'],
      default: 'active',
    },
    messages: [MessageSchema],
    callLogs: [CallLogSchema],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
