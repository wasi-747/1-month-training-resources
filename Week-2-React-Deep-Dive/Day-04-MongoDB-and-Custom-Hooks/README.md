# 🍃 Week 2 — Day 04: Custom Hooks (`useFetch`), API Mappings & MongoDB Architecture

**Curriculum Track:** 1-Month Web Development Training  
**Date:** Thursday, August 13, 2026  
**Topic:** Custom Hook Extraction, JS/React API Dictionary & MongoDB Database Fundamentals  

---

## 📚 Table of Contents
1. [Custom Hook Mechanics (`useFetch`)](#1-custom-hook-mechanics-usefetch)
2. [JavaScript & React API Dictionary](#2-javascript--react-api-dictionary)
3. [MongoDB Architecture & Document Storage](#3-mongodb-architecture--document-storage)
4. [MongoDB CRUD Operations & Operators](#4-mongodb-crud-operations--operators)
5. [Mongoose ODM, Schemas & Aggregations](#5-mongoose-odm-schemas--aggregations)

---

## 1. Custom Hook Mechanics (`useFetch`)

Custom hooks allow extracting stateful component logic into reusable JavaScript functions.
* Custom hook names **MUST** start with the `use` prefix.
* Custom hooks can invoke native React hooks (`useState`, `useEffect`, `useRef`).

```javascript
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const result = await res.json();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();

    return () => { isMounted = false; };
  }, [url]);

  return { data, loading, error };
}
```

---

## 2. JavaScript & React API Dictionary

| API / Method | Category | Parameters | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| `useState(init)` | React Hook | `init: any` | `[value, setterFn]` | Provides state memory to functional components. |
| `useEffect(fn, deps)`| React Hook | `fn: () => cleanup?`, `deps?: Array` | `void` | Synchronizes component with side effects after render. |
| `fetch(url, opts)` | Web API | `url: string`, `opts?: RequestInit` | `Promise<Response>` | Initiates async network request to fetch HTTP resources. |
| `.json()` | Response API | None | `Promise<any>` | Parses response body stream as JSON object. |
| `Array.map(cb)` | JS ES6+ | `cb: (item, idx) => newItem` | `Array` | Transforms array items 1-to-1 into a new array. |
| `Array.filter(cb)` | JS ES6+ | `cb: (item, idx) => boolean` | `Array` | Returns new array containing items passing condition test. |

---

## 3. MongoDB Architecture & Document Storage

MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like **BSON (Binary JSON)** documents.

```
Database ➔ Collection (Tables) ➔ Document (Rows) ➔ Field (Columns)
```

### Key Features:
* **Dynamic Schema Flexibility**: Documents in the same collection don't need identical fields.
* **BSON Format**: Supports richer data types (ObjectId, Dates, Binary) than standard JSON.

---

## 4. MongoDB CRUD Operations & Operators

```javascript
// Create
db.users.insertOne({ name: "Wasi", role: "Developer", score: 95 });

// Read
db.users.find({ score: { $gte: 90 } });

// Update
db.users.updateOne({ name: "Wasi" }, { $set: { score: 100 } });

// Delete
db.users.deleteOne({ name: "Wasi" });
```

---

## 5. Mongoose ODM, Schemas & Aggregations

Mongoose provides a straight-forward, schema-based solution to model application data with built-in type validation, middleware hooks, and aggregation pipelines.

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
```

### Aggregation Pipeline Example:
```javascript
const analytics = await User.aggregate([
  { $match: { score: { $gte: 50 } } },
  { $group: { _id: "$role", avgScore: { $avg: "$score" }, totalUsers: { $sum: 1 } } },
  { $sort: { avgScore: -1 } }
]);
```
