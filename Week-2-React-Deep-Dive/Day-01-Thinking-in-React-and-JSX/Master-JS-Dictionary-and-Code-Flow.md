# 📖 Master Full-Stack Engineering Dictionary & Call Flow Guide
### (JavaScript, DOM, Node.js, Git & GitHub Complete Master Reference)

**Author:** Full-Stack Engineering Trainee  
**Track:** 1-Month Web Development Training (Week 1 & Week 2 Master Reference)  

---

## 📚 Table of Contents
1. [Git & GitHub Professional Architecture & Commands](#1-git--github-professional-architecture--commands)
2. [Variables, Scope & Memory](#2-variables-scope--memory)
3. [Operators & Logical Expressions](#3-operators--logical-expressions)
4. [Functions, Execution Context & Closures](#4-functions-execution-context--closures)
5. [Data Structures & Higher-Order Array Methods](#5-data-structures--higher-order-array-methods)
6. [Asynchronous JavaScript & Event Loop Engine](#6-asynchronous-javascript--event-loop-engine)
7. [DOM Event Architecture & Browser Storage](#7-dom-event-architecture--browser-storage)
8. [Node.js Core Runtime & File System (fs)](#8-nodejs-core-runtime--file-system-fs)
9. [Real Code & Git Line-by-Line Execution & Call Flow Breakdown](#9-real-code--git-line-by-line-execution--call-flow-breakdown)

---

## 1. Git & GitHub Professional Architecture & Commands

### A. Core Concepts & States
| Term / Concept | Identity | Purpose & Underlying Mechanism |
| :--- | :--- | :--- |
| **Git** | Tool | Local distributed Version Control System (VCS) tracking code change history on your computer. |
| **GitHub** | Cloud Platform | Cloud hosting service for Git repositories facilitating team collaboration, PRs, and CI/CD. |
| **Working Directory** | Local State | Where you actively create and edit files before staging them. |
| **Staging Area (Index)** | Local State | The intermediate preparation zone where changes are marked to be included in the next commit. |
| **Local Repository** | Local State | The `.git` directory storing committed history snapshots permanently on your local disk. |
| **Remote Repository (`origin`)** | Cloud State | The central GitHub-hosted repository shared across engineering teams. |
| **`main` / `master`** | Branch | The default production branch representing live, deployable, stable code. |
| **Feature Branch** | Branch | An isolated branch (`feature/task-name`) where new features are built without risking `main`. |
| **Commit SHA / Hash** | Identifier | A unique 40-character cryptographic hash (e.g. `c840a8e`) identifying a specific commit snapshot. |
| **`.gitignore`** | Config File | A text file listing files/folders Git must never track (e.g. `node_modules/`, `.env`, secrets). |

---

### B. Essential Git Commands Dictionary

| Command | Category | Exact Action & What It Does |
| :--- | :--- | :--- |
| **`git init`** | Setup | Initializes a brand new empty Git repository in the current folder (creates `.git/`). |
| **`git clone <url>`** | Setup | Downloads a complete remote repository and its full commit history to your computer. |
| **`git status`** | Inspection | Shows modified, untracked, or staged files in your working tree. |
| **`git add .`** / `git add <file>` | Staging | Moves modified files from Working Directory to the Staging Area. |
| **`git commit -m "msg"`** | History | Saves a permanent snapshot of all staged files to local repository history. |
| **`git branch`** | Branching | Lists all existing local branches (shows active branch with `*`). |
| **`git checkout -b <name>`** | Branching | **Creates AND switches** to a new branch in a single command. |
| **`git switch <name>`** | Branching | Switches between existing branches (e.g. `git switch main`). |
| **`git remote add origin <url>`**| Remote | Links your local Git repository to a remote GitHub repository URL. |
| **`git push -u origin <branch>`**| Remote | Uploads local commits to GitHub and sets up upstream tracking. |
| **`git pull`** | Remote | Fetches updates from GitHub and immediately merges them into your active branch. |
| **`git fetch`** | Remote | Downloads remote changes to your local tracking branch without modifying working files. |
| **`git merge <branch>`** | Integration | Merges changes from the specified branch into your current active branch. |
| **`git log --oneline`** | History | Displays a compact chronological list of past commit hashes and messages. |
| **`git diff`** | Inspection | Shows line-by-line additions (`+`) and deletions (`-`) before staging. |
| **`git reset <file>`** | Undo | Unstages a file while keeping your local code edits intact. |

---

### C. Conventional Commit Standards (Corporate Best Practice)

| Prefix Tag | Meaning | Example |
| :--- | :--- | :--- |
| **`feat:`** | New functional feature added | `feat: add user bookmarking in localStorage` |
| **`fix:`** | Bug patch / issue resolution | `fix: resolve flexbox navbar overlap on mobile` |
| **`docs:`** | Documentation or README changes | `docs: add Day 1 study notes to README` |
| **`style:`** | CSS styling or formatting | `style: update button background to indigo` |
| **`refactor:`**| Code cleanup without feature change | `refactor: extract user card into modular component` |
| **`test:`** | Adding or updating unit tests | `test: add Jest tests for tax calculator function` |
| **`chore:`** | Maintenance or package updates | `chore: update dependencies in package.json` |

---

### D. GitHub Team Collaboration Concepts

* **Pull Request (PR)**: A formal request asking team members to review code on a feature branch before merging into `main`.
* **Code Review**: Senior engineers inspect lines changed in a PR, leaving comments, approvals, or change requests.
* **Merge Conflict**: Occurs when two developers edit the exact same line in a file; resolved manually by choosing which lines to keep.
* **GitHub Issues**: Task tracker tickets used to assign bugs, features, and milestones (`fixes #14` in commit automatically closes issue #14).

---

## 2. Variables, Scope & Memory

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

## 3. Operators & Logical Expressions

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

## 4. Functions, Execution Context & Closures

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

## 5. Data Structures & Higher-Order Array Methods

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

## 6. Asynchronous JavaScript & Event Loop Engine

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

## 7. DOM Event Architecture & Browser Storage

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

## 8. Node.js Core Runtime & File System (fs)

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

## 9. Real Code & Git Line-by-Line Execution & Call Flow Breakdown

### 🔀 Git Lifecycle Walkthrough: How Code Moves to GitHub

```
[ Working Directory ] ──( git add . )──> [ Staging Area ] ──( git commit )──> [ Local Repo ] ──( git push )──> [ GitHub PR ] ──( Merge )──> [ main ]
```

1. **Step 1 (Branching)**: `git checkout -b feature/user-bookmarks` creates an isolated branch from `main`.
2. **Step 2 (Modifying Code)**: Edit files in your editor (Working Directory). `git status` shows red modified files.
3. **Step 3 (Staging)**: `git add .` stages all changed files into index preparation. `git status` shows green staged files.
4. **Step 4 (Commit Snapshot)**: `git commit -m "feat: add user bookmarking"` creates a local immutable commit SHA snapshot.
5. **Step 5 (Push to GitHub)**: `git push -u origin feature/user-bookmarks` uploads commits to GitHub remote.
6. **Step 6 (Pull Request & Merge)**: Open Pull Request on `github.com`. After review, merge into `main` branch safely!

---

### 💻 Code Walkthrough: DevExplorer Parallel API Fetcher (`app.js`)

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
