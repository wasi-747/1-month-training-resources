/**
 * 🍃 Week 2 — Day 04 Practice Snippets
 * Topics: Custom Hooks (useFetch, useToggle), JS/React Mappings, MongoDB Queries & Mongoose Schemas
 */

// =============================================================
// 1. Reusable Custom Hooks (useFetch & useToggle Patterns)
// =============================================================
import { useState, useEffect } from 'react';

// Reusable Custom Hook for API Data Fetching with memory leak cleanup
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true; // Cleanup flag to prevent state updates on unmounted component

    async function executeFetch() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }
        const jsonResult = await response.json();
        if (active) setData(jsonResult);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    executeFetch();

    return () => {
      active = false; // Memory leak prevention cleanup
    };
  }, [url]);

  return { data, loading, error };
}

// Reusable Custom Hook for UI Toggle State Management
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}

// =============================================================
// 2. MongoDB Shell Query Snippets (BSON CRUD & Operators)
// =============================================================
/*
  // --- Create Operations ---
  db.trainees.insertOne({
    name: "Wasi",
    track: "Full Stack",
    score: 98,
    active: true,
    skills: ["React", "Node.js", "MongoDB"]
  });

  db.trainees.insertMany([
    { name: "Rahim", track: "Frontend", score: 85, active: true },
    { name: "Karim", track: "Backend", score: 92, active: false },
    { name: "Tanvir", track: "Full Stack", score: 94, active: true }
  ]);

  // --- Read Operations with Comparison Operators ($gte, $in) ---
  db.trainees.find({ score: { $gte: 90 }, active: true });
  db.trainees.find({ track: { $in: ["Frontend", "Full Stack"] } });

  // --- Update Operations with Update Operators ($set, $inc) ---
  db.trainees.updateOne(
    { name: "Wasi" },
    { $set: { status: "Senior Trainee" }, $inc: { score: 2 } }
  );

  db.trainees.updateMany(
    { active: true },
    { $inc: { score: 5 } }
  );

  // --- Aggregation Pipeline ($match, $group, $project, $sort) ---
  db.trainees.aggregate([
    { $match: { active: true } },
    { 
      $group: { 
        _id: "$track", 
        avgScore: { $avg: "$score" }, 
        totalTrainees: { $sum: 1 } 
      } 
    },
    { 
      $project: { 
        track: "$_id", 
        avgScore: { $round: ["$avgScore", 1] }, 
        totalTrainees: 1, 
        _id: 0 
      } 
    },
    { $sort: { avgScore: -1 } }
  ]);
*/

// =============================================================
// 3. Mongoose Schema, Validation & Pre/Post Hooks Example
// =============================================================
const mongoose = require('mongoose');

const TraineeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainee name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true
    },
    track: {
      type: String,
      enum: ['Frontend', 'Backend', 'Full Stack'],
      default: 'Full Stack'
    },
    score: {
      type: Number,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware hook (e.g. log / transform before saving)
TraineeSchema.pre('save', function (next) {
  console.log(`[Mongoose Pre-Save Hook] Saving trainee record for: ${this.name}`);
  next();
});

// Post-save middleware hook (e.g. audit log after save)
TraineeSchema.post('save', function (doc, next) {
  console.log(`[Mongoose Post-Save Hook] Successfully created record for ID: ${doc._id}`);
  next();
});

const Trainee = mongoose.models.Trainee || mongoose.model('Trainee', TraineeSchema);

module.exports = { Trainee };
