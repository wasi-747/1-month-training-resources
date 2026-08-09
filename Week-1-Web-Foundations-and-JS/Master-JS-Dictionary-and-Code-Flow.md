# 📖 Master JavaScript, DOM & Node.js Technical Dictionary & Call Flow Guide

**Author:** Full-Stack Engineering Trainee  
**Track:** 1-Month Web Development Training (Week 1 Master Reference)  

---

## 📚 Table of Contents
1. [Variables, Scope & Memory](#1-variables-scope--memory)
2. [Operators & Logical Expressions](#2-operators--logical-expressions)
3. [Functions, Execution Context & Closures](#3-functions-execution-context--closures)
4. [Data Structures & Higher-Order Array Methods](#4-data-structures--higher-order-array-methods)
5. [Asynchronous JavaScript & Event Loop Engine](#5-asynchronous-javascript--event-loop-engine)
6. [DOM Event Architecture & Browser Storage](#6-dom-event-architecture--browser-storage)
7. [Node.js Core Runtime & File System (fs)](#7-nodejs-core-runtime--file-system-fs)
8. [Real Code Line-by-Line Execution & Call Flow Breakdown](#8-real-code-line-by-line-execution--call-flow-breakdown)

---

## 1. Variables, Scope & Memory

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **`const`** | Keyword | **Immutable Identifier Binding.** Prevents variable reassignment. Default choice in modern JavaScript. |
| **`let`** | Keyword | **Mutable Block-Scoped Variable.** Used when variables need reassignment (e.g. loop counters). |
| **`var`** | Keyword (Legacy) | **Function-Scoped Variable.** Leaks out of `{}` blocks and hoists as `undefined` (avoided). |
| **Block Scope `{}`** | Memory Concept | Identifiers declared with `let`/`const` exist strictly inside their enclosing curly braces. |
| **Function Scope** | Memory Concept | Variables declared inside a function are invisible to the outer scope. |
| **Global Scope** | Memory Concept | Top-level execution context accessible throughout the entire script/runtime. |
| **Hoisting** | Engine Phase | V8 engine moves function declarations and variable names to the top of scope during compilation. |
| **Temporal Dead Zone (TDZ)** | Engine Phase | The zone from start of block until `let`/`const` declaration where accessing the variable throws `ReferenceError`. |

---

## 2. Operators & Logical Expressions

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **`===`** (Strict Equality) | Operator | Compares both **Value** and **Type** without implicit type coercion (`10 === "10"` is `false`). |
| **`==`** (Loose Equality) | Operator | Coerces types before comparison (prone to unexpected runtime bugs). |
| **`!==`** (Strict Inequality) | Operator | Returns `true` if values or types are not identical. |
| **`%`** (Modulo) | Operator | Returns division remainder (`10 % 3 = 1`). Used for even/odd checks (`n % 2 === 0`). |
| **`&&`** (Logical AND) | Operator | Returns `true` only if both operands evaluate to truthy. |
| **`\|\|`** (Logical OR) | Operator | Returns `true` if at least one operand evaluates to truthy. |
| **`!`** (Logical NOT) | Operator | Inverts truthiness (`!true` ➔ `false`, `!0` ➔ `true`). |
| **`? :`** (Ternary) | Operator | Inline conditional expression: `condition ? ifTrue : ifFalse`. |
| **`typeof`** | Operator | Returns a string indicating the data type of the unevaluated operand. |

---

## 3. Functions, Execution Context & Closures

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **`function`** | Keyword | Declares a named, reusable execution block with its own `this` context. |
| **`return`** | Keyword | Halts function execution and outputs a value to the caller. |
| **`() => {}`** (Arrow Function) | Syntax (ES6) | Compact function syntax with lexical `this` binding and single-line implicit return. |
| **Parameter** | Variable Name | Variable placeholder defined in function signature (e.g. `function add(a, b)`). |
| **Argument** | Real Value | The actual data value passed during function invocation (e.g. `add(5, 10)`). |
| **Default Parameter** | Syntax | Fallback value if argument is `undefined` (e.g. `function greet(name = "Guest")`). |
| **Rest Operator (`...args`)** | Syntax | Gathers indefinite trailing arguments into a true JavaScript array. |
| **Higher-Order Function** | Concept | A function that accepts another function as an argument or returns a function. |
| **Closure** | Memory Structure | An inner function retaining lexical access to its outer parent scope even after parent returns. |
| **`this`** | Keyword | References the object executing the current function (dynamic binding). |
| **`call`, `apply`, `bind`** | Methods | Explicitly sets the `this` context on function executions. |

---

## 4. Data Structures & Higher-Order Array Methods

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **`Array` `[]`** | Data Structure | Ordered list collection indexed from zero. |
| **`Object` `{}`** | Data Structure | Unordered key-value mapping accessed via dot notation (`obj.key`) or bracket (`obj["key"]`). |
| **`.length`** | Property | Returns number of elements in an array or character length of a string. |
| **`.push()`** | Array Method | Mutates array by appending element to the end. |
| **`.pop()`** | Array Method | Mutates array by removing the last element. |
| **`.map()`** | Array Method | Returns a **new array** by transforming every element with the callback. |
| **`.filter()`** | Array Method | Returns a **new array** containing elements that satisfy the boolean callback. |
| **`.reduce()`** | Array Method | Accumulates array elements into a **single resulting value** based on accumulator logic. |
| **`.find()`** | Array Method | Returns the first element satisfying the predicate, or `undefined`. |
| **`{ a, b } = obj`** (Destructuring) | Syntax | Extracts object properties or array items directly into individual variables. |
| **`...`** (Spread Operator) | Operator | Expands iterable elements into arguments or clones objects/arrays shallowly. |

---

## 5. Asynchronous JavaScript & Event Loop Engine

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **`Promise`** | Object | Manages future async completion. States: `Pending`, `Fulfilled` (Resolved), `Rejected` (Error). |
| **`async`** | Keyword | Designates function as asynchronous, automatically wrapping return value in a Promise. |
| **`await`** | Keyword | Pauses async function execution until Promise resolves without blocking browser UI. |
| **`try / catch`** | Control Flow | Error handling block preventing unhandled promise rejections from crashing the app. |
| **`fetch()`** | Web API | Dispatches asynchronous HTTP network requests to external APIs. |
| **`response.json()`** | Method | Decodes incoming network response stream into a JavaScript Object. |
| **`Promise.all([])`** | Method | Dispatches multiple independent Promises **concurrently in parallel**. |
| **Event Loop** | Runtime Engine | Monitors Call Stack; when empty, pushes pending microtasks/macrotasks to execution. |
| **Call Stack** | Memory Structure | LIFO (Last In First Out) execution stack tracking current function calls. |
| **Microtask Queue** | Queue Memory | High-priority queue for Promises; drained completely before next Macrotask. |
| **Macrotask Queue** | Queue Memory | Queue for `setTimeout`, `setInterval`, and I/O callbacks. |

---

## 6. DOM Event Architecture & Browser Storage

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **`document`** | Object | Browser representation of the loaded HTML DOM tree. |
| **`querySelector()`** | DOM Method | Returns the first matching element matching a CSS selector. |
| **`querySelectorAll()`** | DOM Method | Returns a static `NodeList` of all matching elements. |
| **`addEventListener()`** | DOM Method | Attaches an event handler function to a specified event target. |
| **`event.target`** | Event Property | References the exact DOM element that dispatched the raw event. |
| **`element.closest()`** | DOM Traversal | Climbs up the DOM ancestor tree to find the nearest element matching a selector. |
| **Event Bubbling** | DOM Architecture | Triggered events bubble up from target element through all parent DOM ancestors. |
| **Event Delegation** | Pattern | Attaching a **single listener on a parent container** to handle events from dynamic child nodes. |
| **`event.preventDefault()`**| Method | Cancels default browser action (e.g. stops form submit page reloads). |
| **`localStorage`** | Storage API | Client-side key-value storage persisted indefinitely across browser sessions. |
| **`JSON.stringify()`** | Native Method | Serializes JavaScript Objects/Arrays into JSON text strings for storage. |
| **`JSON.parse()`** | Native Method | Deserializes JSON strings back into live JavaScript Objects. |

---

## 7. Node.js Core Runtime & File System (fs)

| Term / Keyword | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **Node.js** | Runtime | Server-side JavaScript runtime powered by Google Chrome's V8 engine. |
| **`process`** | Global Object | Controls and inspects the Node.js process (`process.env`, `process.argv`). |
| **`__dirname`** | Global Variable | Absolute path to the directory containing the currently executing script. |
| **`require()`** | CommonJS Syntax | Imports built-in or custom CommonJS modules into current file scope. |
| **`module.exports`** | CommonJS Syntax | Exposes functions, classes, or objects to other importing files. |
| **`fs/promises`** | Native Module | Non-blocking, asynchronous Promise-based file system manipulation library. |
| **`fs.readFile()`** | Method | Asynchronously reads entire content of a file from disk into memory. |
| **`fs.writeFile()`** | Method | Asynchronously writes data to a file, replacing file if it exists. |
| **`fs.appendFile()`** | Method | Asynchronously appends data to an existing file without overwriting. |
| **`path.join()`** | Path Method | Joins path segments into a normalized absolute path compatible across Windows/Linux. |

---

## 8. Real Code Line-by-Line Execution & Call Flow Breakdown

### 💻 Walkthrough #1: DevExplorer Parallel API Fetcher (`app.js`)

```javascript
async fetchDeveloperProfile(username) {
  // Step 1: Memory Cache Verification
  if (this.#searchCache.has(username)) {
    const cached = this.#searchCache.get(username);
    this.renderProfileCard(cached.user);
    return;
  }

  // Step 2: Concurrent API Dispatch
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos`)
  ]);

  // Step 3: Stream Parsing
  const userData = await userRes.json();
  const reposData = await reposRes.json();

  // Step 4: State Update & Analytics Trigger
  this.currentDev = userData;
  this.#searchCache.set(username, { user: userData, repos: reposData });
  this.computeAnalytics(reposData);
  this.renderProfileCard(userData);
}
```

#### 🗣️ How to Explain on Screen:
1. **Trigger**: User inputs a username and submits the search form.
2. **Step 1 (In-Memory Map Cache)**: `#searchCache.has()` checks if this profile was already fetched. If yes, it retrieves cached data instantly without an API call and returns.
3. **Step 2 (Parallel Network Fetch)**: `Promise.all()` dispatches both the Profile and Repository endpoints concurrently, halving network latency compared to sequential calls.
4. **Step 3 (JSON Stream Parsing)**: `await .json()` decodes the raw HTTP response streams into JavaScript Objects in memory.
5. **Step 4 (State & Analytics Connection)**: Updates internal state `this.currentDev`, updates the in-memory cache, calls `computeAnalytics()` which uses `.reduce()` to calculate total stars, and triggers `renderProfileCard()` to update the DOM!

---

### 💻 Walkthrough #2: Event Delegation & LocalStorage Bookmarking (`app.js`)

```javascript
// Step 1: Parent Event Listener (Event Delegation)
this.quickTagsContainer.addEventListener("click", (e) => {
  const tagBtn = e.target.closest(".tag-btn");
  if (tagBtn) {
    const username = tagBtn.dataset.user;
    this.fetchDeveloperProfile(username);
  }
});

// Step 2: LocalStorage State Management
toggleBookmark(user) {
  const exists = this.bookmarks.some(b => b.login === user.login);
  if (exists) {
    this.bookmarks = this.bookmarks.filter(b => b.login !== user.login);
  } else {
    this.bookmarks.push(user);
  }
  localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  this.showToast("Bookmark updated ⭐");
}
```

#### 🗣️ How to Explain on Screen:
1. **Trigger**: User clicks any button within the container.
2. **Event Delegation**: Instead of binding individual listeners to every button, a single listener on `#quickTagsContainer` catches the bubbling event. `e.target.closest(".tag-btn")` extracts the target element.
3. **Data Extraction**: Reads `data-user` attribute directly from the DOM node and passes it to `fetchDeveloperProfile(username)`.
4. **LocalStorage Persistence**: `toggleBookmark()` verifies existence via `.some()`, updates the array via `.filter()` / `.push()`, serializes with `JSON.stringify()`, and persists to `localStorage.setItem()`.

---

### 💻 Walkthrough #3: Node.js Asynchronous File Operations (`Day-04/practice-snippets.js`)

```javascript
const fs = require('fs/promises');
const path = require('path');

async function logTrainingData(data) {
  const filePath = path.join(__dirname, 'log.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  const readContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(readContent);
}
```

#### 🗣️ How to Explain on Screen:
1. **Module Import**: `require('fs/promises')` imports Node's asynchronous file system module.
2. **Path Resolution**: `path.join(__dirname, ...)` resolves the absolute system path safely across Windows/Linux.
3. **Non-Blocking Write**: `fs.writeFile()` offloads disk write to libuv worker threads without freezing the single-threaded Event Loop.
4. **Read & Parse**: `fs.readFile(..., 'utf-8')` reads the string back from disk, and `JSON.parse()` converts it back into an active JavaScript Object.
