/**
 * ==============================================================================================
 * 🍃 MongoDB CRUD Operations & Advanced Query Practice Lab
 * ==============================================================================================
 * Author: Wasiur Rahman Sakib
 * Track: 1-Month Web Development Training
 * Topics Covered:
 *   1. CREATE (insertOne, insertMany, Subdocuments, Data Types)
 *   2. READ & ADVANCED QUERIES (Comparison, Logical, Regex, Array, Element Operators, Pagination)
 *   3. UPDATE (Atomic Operators: $set, $inc, $push, $addToSet, $pull, Positional Filters, Upsert)
 *   4. DELETE (deleteOne, deleteMany)
 *   5. AGGREGATION PIPELINES ($match, $group, $project, $sort, $unwind, $lookup)
 *   6. INDEXING & EXECUTION STATS (Single, Compound, Unique Indexes & Query Optimization)
 * ==============================================================================================
 */

// ==============================================================================================
// 1. CREATE OPERATIONS (Inserting Documents & Nested Schemas)
// ==============================================================================================

// 1.1 Insert a Single Document with Rich Data Types (insertOne)
/*
db.trainees.insertOne({
  name: "Wasiur Rahman Sakib",
  email: "sakib@example.com",
  role: "Software Engineer Intern",
  age: 23,
  active: true,
  skills: ["JavaScript", "React 18", "Node.js", "MongoDB", "Next.js"],
  address: {
    city: "Dhaka",
    country: "Bangladesh",
    coordinates: [90.4125, 23.8103]
  },
  metrics: {
    projectsCompleted: 3,
    avgScore: 96.5
  },
  joinedAt: new Date("2026-08-01T09:00:00Z"),
  updatedAt: new Date()
});
*/

// 1.2 Insert Multiple Documents (insertMany)
/*
db.courses.insertMany([
  {
    courseId: "CS101",
    title: "Modern Web Foundations & ES6+",
    instructor: "Wasi",
    category: "Frontend",
    price: 49.99,
    enrolledCount: 140,
    tags: ["html5", "css3", "javascript", "async"],
    rating: 4.9,
    isPublished: true,
    modules: [
      { moduleNo: 1, title: "DOM Manipulation", durationHrs: 4 },
      { moduleNo: 2, title: "Async JavaScript & Promises", durationHrs: 6 }
    ]
  },
  {
    courseId: "CS201",
    title: "React 18 Deep Dive & Custom Hooks",
    instructor: "Wasi",
    category: "Frontend",
    price: 89.99,
    enrolledCount: 220,
    tags: ["react", "hooks", "virtual-dom", "state"],
    rating: 4.95,
    isPublished: true,
    modules: [
      { moduleNo: 1, title: "State Immutability & Reconciliation", durationHrs: 8 },
      { moduleNo: 2, title: "useEffect & Custom Hooks Architecture", durationHrs: 7 }
    ]
  },
  {
    courseId: "CS301",
    title: "MongoDB & Backend Database Design",
    instructor: "Rahim",
    category: "Backend",
    price: 79.99,
    enrolledCount: 85,
    tags: ["mongodb", "nosql", "bson", "mongoose"],
    rating: 4.7,
    isPublished: true,
    modules: [
      { moduleNo: 1, title: "CRUD & BSON Storage", durationHrs: 5 },
      { moduleNo: 2, title: "Aggregation Pipeline & Indexing", durationHrs: 6 }
    ]
  },
  {
    courseId: "CS401",
    title: "Next.js Full-Stack Architecture",
    instructor: "Karim",
    category: "FullStack",
    price: 119.99,
    enrolledCount: 60,
    tags: ["nextjs", "app-router", "server-components"],
    rating: 4.85,
    isPublished: false,
    modules: [
      { moduleNo: 1, title: "Server vs Client Components", durationHrs: 6 }
    ]
  }
]);
*/

// ==============================================================================================
// 2. READ & ADVANCED QUERY FILTERING (Comparison, Logical, Regex, Arrays)
// ==============================================================================================

// 2.1 Basic Read & Projections (Select only specific fields)
// db.courses.find({}, { title: 1, category: 1, price: 1, _id: 0 });

// 2.2 Comparison Operators ($gt, $gte, $lt, $lte, $eq, $ne, $in, $nin)
// Find courses with price >= 75 and rating >= 4.8
// db.courses.find({
//   price: { $gte: 75 },
//   rating: { $gte: 4.8 }
// });

// Find courses in specific categories ($in)
// db.courses.find({ category: { $in: ["Frontend", "FullStack"] } });

// Find published courses where enrolledCount is not equal to 0 ($ne)
// db.courses.find({ isPublished: true, enrolledCount: { $ne: 0 } });

// 2.3 Logical Operators ($and, $or, $not, $nor)
// Either price < 50 OR rating >= 4.9
// db.courses.find({
//   $or: [
//     { price: { $lt: 50 } },
//     { rating: { $gte: 4.9 } }
//   ]
// });

// 2.4 Array Queries ($all, $size, $elemMatch)
// Must contain both "react" and "hooks" tags in any order
// db.courses.find({ tags: { $all: ["react", "hooks"] } });

// Query matching nested subdocument array criteria ($elemMatch)
// db.courses.find({
//   modules: {
//     $elemMatch: { durationHrs: { $gte: 7 } }
//   }
// });

// 2.5 Regex Search (Case-Insensitive Text Matching)
// db.courses.find({ title: { $regex: /react/i } });

// 2.6 Sorting, Limiting, and Pagination
// Sort by rating descending (-1), then price ascending (1), skip 0, limit 2
// db.courses.find()
//   .sort({ rating: -1, price: 1 })
//   .skip(0)
//   .limit(2);

// ==============================================================================================
// 3. UPDATE OPERATIONS (Atomic Operators & Array Modifiers)
// ==============================================================================================

// 3.1 Field Updates ($set, $unset, $inc, $currentDate)
// db.courses.updateOne(
//   { courseId: "CS201" },
//   {
//     $set: { rating: 4.98 },
//     $inc: { enrolledCount: 15 },
//     $currentDate: { updatedAt: true }
//   }
// );

// 3.2 Array Update Operators ($push, $addToSet, $pull)
// Append a new tag without duplicate ($addToSet)
// db.courses.updateOne(
//   { courseId: "CS201" },
//   { $addToSet: { tags: "reconciliation" } }
// );

// Push a new module into subdocument array ($push)
// db.courses.updateOne(
//   { courseId: "CS301" },
//   {
//     $push: {
//       modules: { moduleNo: 3, title: "Mongoose Middleware & Security", durationHrs: 4 }
//     }
//   }
// );

// Remove a tag from array ($pull)
// db.courses.updateOne(
//   { courseId: "CS101" },
//   { $pull: { tags: "html5" } }
// );

// 3.3 Upsert Operation (Insert if not found, else Update)
// db.courses.updateOne(
//   { courseId: "CS501" },
//   {
//     $set: {
//       title: "React Native Cross-Platform Mobile",
//       instructor: "Wasi",
//       category: "Mobile",
//       price: 99.99,
//       isPublished: false
//     }
//   },
//   { upsert: true }
// );

// ==============================================================================================
// 4. DELETE OPERATIONS
// ==============================================================================================

// 4.1 Delete Single Document
// db.courses.deleteOne({ courseId: "CS501" });

// 4.2 Delete Multiple Documents (e.g. unpublished drafts with 0 enrollment)
// db.courses.deleteMany({ isPublished: false, enrolledCount: 0 });

// ==============================================================================================
// 5. ADVANCED AGGREGATION PIPELINES (Analytics & Data Reshaping)
// ==============================================================================================

/*
db.courses.aggregate([
  // Stage 1: Filter only published courses
  { $match: { isPublished: true } },

  // Stage 2: Group by Category and compute revenue, avg price, course count
  {
    $group: {
      _id: "$category",
      totalCourses: { $sum: 1 },
      totalEnrollments: { $sum: "$enrolledCount" },
      avgPrice: { $avg: "$price" },
      avgRating: { $avg: "$rating" },
      courseTitles: { $push: "$title" }
    }
  },

  // Stage 3: Project and format output fields cleanly
  {
    $project: {
      category: "$_id",
      totalCourses: 1,
      totalEnrollments: 1,
      avgPriceFormatted: { $round: ["$avgPrice", 2] },
      avgRatingFormatted: { $round: ["$avgRating", 2] },
      courseTitles: 1,
      _id: 0
    }
  },

  // Stage 4: Sort by total enrollments descending
  { $sort: { totalEnrollments: -1 } }
]);
*/

// ==============================================================================================
// 6. INDEXING & QUERY PERFORMANCE ANALYSIS
// ==============================================================================================

// 6.1 Create Single & Compound Indexes
// db.courses.createIndex({ courseId: 1 }, { unique: true });
// db.courses.createIndex({ category: 1, price: -1 });
// db.courses.createIndex({ title: "text", tags: "text" });

// 6.2 Analyze Query Execution Performance (Explain Plan)
// db.courses.find({ category: "Frontend", price: { $gte: 50 } })
//   .explain("executionStats");
