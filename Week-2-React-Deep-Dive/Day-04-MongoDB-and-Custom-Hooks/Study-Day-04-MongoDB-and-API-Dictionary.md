# 📖 Study Reference: JS & React API Dictionary & MongoDB Architecture

**Curriculum Track:** 1-Month Web Development Training (Week 2, Day 4 Study Reference)  
**Goal:** Detailed documentation mapping parameters, return values, data types, line numbers, and architectural patterns for custom Hooks, JS/React Web APIs, MongoDB queries, and Mongoose ODM.

---

## ⚡ Part 1: JavaScript & React API Dictionary

### 1. `useFetch(url)`
* **Identity:** Custom Stateful React Hook.
* **Parameters:** `url` (*Type:* `string`) — Target HTTP endpoint API URL.
* **Return Value & Type:** Object `{ data: any, loading: boolean, error: string | null }`.
* **Code Reference:** [`Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js: Line 11-43`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js#L11-L43)
* **Architectural Reason:** Encapsulates asynchronous data fetching logic, loading states, and error handling into a reusable functional unit while preventing memory leaks on unmounted components via cleanup flags (`active`).

### 2. `useToggle(initialValue)`
* **Identity:** Custom UI State React Hook.
* **Parameters:** `initialValue` (*Type:* `boolean`, default: `false`) — Initial state boolean.
* **Return Value & Type:** Tuple `[value: boolean, toggleFn: () => void]`.
* **Code Reference:** [`Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js: Line 45-52`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js#L45-L52)
* **Architectural Reason:** Simplifies boolean state toggling (modal open/close, dark mode switches, UI dropdown visibility) without manually writing inline setter functions.

### 3. `useState(initialState)`
* **Identity:** React Core Hook.
* **Parameters:** `initialState` (*Type:* `any` | `() => any`).
* **Return Value & Type:** Array tuple `[stateValue: T, setStateFunction: Dispatch<SetStateAction<T>>]`.
* **Code Reference:** [`Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js: Line 12-14`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js#L12-L14)
* **Architectural Reason:** Declares component-scoped persistent state memory across renders.

### 4. `useEffect(setup, dependencies)`
* **Identity:** React Side-Effect Hook.
* **Parameters:** 
  * `setup` (*Type:* `() => cleanupFunction | void`) — Callback containing side-effect logic.
  * `dependencies` (*Type:* `Array<any>`) — Array of reactive values triggering effect re-execution.
* **Return Value & Type:** `undefined`.
* **Code Reference:** [`Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js: Line 16-40`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js#L16-L40)
* **Architectural Reason:** Coordinates synchronization with external systems after browser paint.

### 5. `fetch(url, options)`
* **Identity:** Browser Native Web API.
* **Parameters:** `url` (*Type:* `string`), `options` (*Type:* `RequestInit`, optional).
* **Return Value & Type:** `Promise<Response>`.
* **Code Reference:** [`Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js: Line 22`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js#L22)
* **Architectural Reason:** Initiates non-blocking HTTP network requests asynchronously.

### 6. `response.json()`
* **Identity:** Fetch Body Mixin API.
* **Parameters:** None.
* **Return Value & Type:** `Promise<any>`.
* **Code Reference:** [`Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js: Line 26`](file:///d:/Study/Projects/1%20month%20training%20resources/Week-2-React-Deep-Dive/Day-04-MongoDB-and-Custom-Hooks/practice-snippets.js#L26)
* **Architectural Reason:** Asynchronously decodes HTTP body stream as a JavaScript JSON object.

---

## 🍃 Part 2: MongoDB Document & BSON Architecture

### 1. Document Structure vs RDBMS
| Concept | NoSQL MongoDB | RDBMS (SQL) | Description |
| :--- | :--- | :--- | :--- |
| **Database** | Database | Database | Container holding collections/tables. |
| **Storage Unit** | **Collection** | Table | Group of related documents/rows. |
| **Record** | **Document** | Row | Single data record stored in BSON format. |
| **Data Attribute** | **Field** | Column | Key-value pair inside a document. |
| **Primary Key** | `_id` (`ObjectId`) | Primary Key (`id`) | Unique 12-byte identifier automatically generated. |

### 2. BSON (Binary JSON)
* **Definition:** Binary-encoded serialization format used by MongoDB to store documents.
* **Advantages over JSON:**
  1. High-speed scanning and traversal via embedded length fields.
  2. Rich Data Types: Supports `ObjectId`, `Date`, `BinData`, `Decimal128`, `Long`, `Regex`.

---

## 🔍 Part 3: MongoDB Query Comparison & Update Operators

### 1. Query Comparison Operators
* **`$gte` (Greater Than or Equal):** Matches values `>=` target.  
  *Example:* `{ score: { $gte: 90 } }`
* **`$gt` (Greater Than):** Matches values `>` target.  
  *Example:* `{ age: { $gt: 18 } }`
* **`$in` (In Array):** Matches any value specified in an array.  
  *Example:* `{ track: { $in: ['Frontend', 'Full Stack'] } }`
* **`$eq` (Equals):** Matches exact value equal to target.

### 2. Document Update Operators
* **`$set`:** Replaces the value of a field with the specified value.  
  *Example:* `{ $set: { status: "Active", level: 2 } }`
* **`$inc`:** Increments a numeric field value by a specified amount (can be positive or negative).  
  *Example:* `{ $inc: { score: 5, views: 1 } }`
* **`$push`:** Appends a specified value to an array field.
* **`$unset`:** Deletes a specific field from a document.

---

## 🛠️ Part 4: Mongoose ODM, Validation & Middleware Hooks

### 1. Mongoose Schema & Model Architecture
```javascript
const traineeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  score: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

const Trainee = mongoose.model('Trainee', traineeSchema);
```

### 2. Validation Rules
* `required`: Ensures field must exist prior to saving.
* `trim`: Strips leading and trailing whitespace strings.
* `unique`: Enforces unique index constraint in MongoDB.
* `min` / `max`: Enforces numeric boundaries.
* `enum`: Restricts string values to an allowed set of choices.

### 3. Pre/Post Middleware Hooks
* **`pre('save', fn)`:** Executes logic prior to saving document (e.g. password hashing, audit logs).
* **`post('save', fn)`:** Executes after successful save operation (e.g. sending welcome email).

---

## 📊 Part 5: MongoDB Aggregation Pipeline Stages

```javascript
db.trainees.aggregate([
  { $match: { active: true, score: { $gte: 80 } } },
  { $group: { _id: "$track", avgScore: { $avg: "$score" }, totalTrainees: { $sum: 1 } } },
  { $project: { track: "$_id", avgScore: { $round: ["$avgScore", 2] }, totalTrainees: 1, _id: 0 } },
  { $sort: { avgScore: -1 } }
]);
```

1. **`$match`:** Filters document stream matching query criteria (like SQL `WHERE`).
2. **`$group`:** Groups input documents by a specified `_id` key and computes accumulators (`$avg`, `$sum`, `$max`, `$min`).
3. **`$project`:** Reshapes documents by adding, renaming, or removing fields (like SQL `SELECT`).
4. **`$sort`:** Reorders documents by specified sort fields (`1` for ASC, `-1` for DESC).
