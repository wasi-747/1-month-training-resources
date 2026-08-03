# 📖 Day 2: Comprehensive Study Notes — Advanced JavaScript & Asynchronous Architecture

**Date:** Monday (Week 1, Day 2)  
**Curriculum Track:** 1-Month Web Development Training  
**Author:** Intern Developer  

---

## 📚 Table of Contents
1. [Module 1: Advanced Scope, Closures & Lexical Environments](#-module-1-advanced-scope-closures--lexical-environments)
   - [Execution Context & Scope Chain](#1-execution-context--scope-chain)
   - [Closures & Practical Applications](#2-closures--practical-applications)
2. [Module 2: The `this` Keyword & Context Binding](#-module-2-the-this-keyword--context-binding)
   - [Implicit vs Explicit Binding](#1-implicit-vs-explicit-binding)
   - [Arrow Functions vs Regular Functions](#2-arrow-functions-vs-regular-functions)
3. [Module 3: Prototypes, Prototype Chain & ES6 Classes](#-module-3-prototypes-prototype-chain--es6-classes)
   - [Prototypal Inheritance Mechanics](#1-prototypal-inheritance-mechanics)
   - [ES6 Classes, Static Methods & Private Fields](#2-es6-classes-static-methods--private-fields)
4. [Module 4: The JavaScript Event Loop & Concurrency Model](#-module-4-the-javascript-event-loop--concurrency-model)
   - [Call Stack, Web APIs & Task Queues](#1-call-stack-web-apis--task-queues)
   - [Microtask Queue vs Macrotask Queue](#2-microtask-queue-vs-macrotask-queue)
5. [Module 5: Modern Asynchronous JavaScript & Promise Combinators](#-module-5-modern-asynchronous-javascript--promise-combinators)
   - [Promise Lifecycle & Error Handling](#1-promise-lifecycle--error-handling)
   - [Promise Combinators (all, allSettled, race, any)](#2-promise-combinators)
   - [Async/Await & Parallel Execution Patterns](#3-asyncawait--parallel-execution-patterns)
6. [Module 6: Object Copying & Modern ES6 Data Structures](#-module-6-object-copying--modern-es6-data-structures)
   - [Shallow Copy vs Deep Copy (`structuredClone`)](#1-shallow-copy-vs-deep-copy)
   - [Map, Set, WeakMap & WeakSet](#2-map-set-weakmap--weakset)

---

# 🟨 Module 1: Advanced Scope, Closures & Lexical Environments

### 1. Execution Context & Scope Chain
Whenever JavaScript code executes, it runs inside an **Execution Context**.
- **Global Execution Context (GEC)**: Created when the script starts running.
- **Function Execution Context (FEC)**: Created whenever a function is invoked.

Each context contains two phases:
1. **Creation Phase**: Allocates memory for variables (`hoisting`) and sets up the Lexical Environment.
2. **Execution Phase**: Executes code line-by-line, assigning values and invoking functions.

**Lexical Environment** consists of:
- **Environment Record**: Local variable & function declarations storage.
- **Outer Environment Reference**: Points to the parent execution context's lexical environment (forming the **Scope Chain**).

---

### 2. Closures & Practical Applications
A **Closure** is the combination of a function bundled together with references to its surrounding lexical environment. In simple terms: *A function remembers and accesses variables from its outer scope even after that outer function has finished executing.*

#### Practical Pattern A: Data Privacy / Encapsulation
```javascript
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.count);       // undefined (Cannot be directly mutated from outside!)
```

#### Practical Pattern B: Function Factories (Currying)
```javascript
const createMultiplier = (multiplier) => (value) => value * multiplier;

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

---

# 🔀 Module 2: The `this` Keyword & Context Binding

The value of `this` is determined by **how a function is called** (invocation context), not where it is defined.

### 1. Implicit vs Explicit Binding

| Binding Type | Syntax / Trigger | Description |
| :--- | :--- | :--- |
| **Implicit** | `obj.method()` | `this` refers to the object preceding the dot. |
| **Explicit (`call`)** | `fn.call(ctx, arg1, arg2)` | Invokes function immediately with explicit `this` context and comma-separated arguments. |
| **Explicit (`apply`)** | `fn.apply(ctx, [arg1, arg2])` | Invokes function immediately with explicit `this` context and an array of arguments. |
| **Explicit (`bind`)** | `const newFn = fn.bind(ctx, arg1)` | Returns a new function with fixed `this` context bound permanently. |

```javascript
const user = { name: "Rahim" };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

console.log(greet.call(user, "Hello", "!")); // "Hello, Rahim!"
console.log(greet.apply(user, ["Hi", "."]));  // "Hi, Rahim."

const boundGreet = greet.bind(user, "Welcome");
console.log(boundGreet("~")); // "Welcome, Rahim~"
```

### 2. Arrow Functions vs Regular Functions
- **Regular Functions**: Have their own `this` binding created at invocation time.
- **Arrow Functions**: Do **NOT** have their own `this`. They inherit `this` lexically from their enclosing lexical context.

```javascript
const timer = {
  seconds: 0,
  start() {
    // Arrow function captures 'this' from timer.start context
    setInterval(() => {
      this.seconds++;
    }, 1000);
  }
};
```

---

# 🧬 Module 3: Prototypes, Prototype Chain & ES6 Classes

### 1. Prototypal Inheritance Mechanics
JavaScript uses prototype-based inheritance. Every object has a hidden internal property `[[Prototype]]` (accessible via `Object.getPrototypeOf(obj)` or `__proto__`).

When accessing a property on an object:
1. JS looks on the object itself.
2. If not found, it traverses up the **Prototype Chain**.
3. If it reaches `Object.prototype` and still doesn't find it, it returns `undefined`.

---

### 2. ES6 Classes, Static Methods & Private Fields
ES6 Classes are syntactical sugar over JavaScript's existing prototype-based inheritance.

```javascript
class BankAccount {
  #balance; // ES2022 Private Field

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
    return this.#balance;
  }

  get balance() {
    return `$${this.#balance}`;
  }

  // Static method attached to the Class constructor, not instances
  static convertCurrency(amount, rate) {
    return amount * rate;
  }
}

class SavingsAccount extends BankAccount {
  constructor(owner, initialBalance, interestRate) {
    super(owner, initialBalance);
    this.interestRate = interestRate;
  }
}
```

---

# ⚡ Module 4: The JavaScript Event Loop & Concurrency Model

JavaScript is **single-threaded**, meaning it executes one task at a time on its single **Call Stack**. Non-blocking async behavior is achieved through the **Event Loop**.

```
+-------------------------------------------------------------+
|                          CALL STACK                         |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                  WEB APIs / NODE C++ APIs                   |
|   (DOM Events, setTimeout, fetch, fs.readFile, Promises)    |
+-------------------------------------------------------------+
                               |
                               +-----------------------+
                               |                       |
                               v                       v
               +-----------------------+   +-----------------------+
               |    MICROTASK QUEUE    |   |    MACROTASK QUEUE    |
               | (Promises, microtask) |   | (setTimeout, I/O)     |
               +-----------------------+   +-----------------------+
                               |                       |
                               +-----------+-----------+
                                           |
                                           v
                                   +---------------+
                                   |  EVENT LOOP   |
                                   +---------------+
```

### Execution Priority Rules:
1. **Call Stack**: Execute all synchronous code until stack is completely empty.
2. **Microtask Queue**: Process **ALL** pending microtasks (Promise `.then`/`.catch`/`.finally` handlers, `queueMicrotask`) until empty.
3. **Macrotask Queue**: Pick **ONE** task from the Macrotask queue (`setTimeout`, `setInterval`, `setImmediate`, I/O events).
4. **Repeat Loop**: Check Microtask queue again before picking the next Macrotask.

#### Output Execution Order Challenge:
```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

queueMicrotask(() => console.log("4"));

console.log("5");

// Expected Output: 1, 5, 3, 4, 2
```

---

# 🌐 Module 5: Modern Asynchronous JavaScript & Promise Combinators

### 1. Promise Lifecycle & Error Handling
A `Promise` represents an asynchronous operation with three states:
- `pending`: Initial state, neither fulfilled nor rejected.
- `fulfilled`: Completed successfully (`resolve(value)`).
- `rejected`: Operation failed (`reject(error)`).

---

### 2. Promise Combinators
Used for coordinating multiple concurrent asynchronous operations:

| Combinator | Behavior / Output | Typical Use Case |
| :--- | :--- | :--- |
| **`Promise.all([p1, p2])`** | Resolves when **ALL** promises resolve. Rejects immediately if **ANY** promise rejects. | Loading mandatory dependencies in parallel. |
| **`Promise.allSettled([p1, p2])`** | Resolves when **ALL** promises settle (either fulfilled or rejected). Never rejects. | Dashboard widget data fetching where partial failures are acceptable. |
| **`Promise.race([p1, p2])`** | Settles as soon as the **FIRST** promise settles (fulfills or rejects). | Implementing request timeout limits. |
| **`Promise.any([p1, p2])`** | Resolves as soon as the **FIRST** promise fulfills. Rejects only if **ALL** promises reject. | Querying redundant fallback API mirrors. |

---

### 3. Async/Await & Parallel Execution Patterns

#### Bottleneck Pattern (Sequential - Slow ❌):
```javascript
// Total time: ~400ms (200ms + 200ms)
const user = await fetchUser(id);
const posts = await fetchPosts(user.id);
```

#### Optimized Pattern (Parallel - Fast ✅):
```javascript
// Total time: ~200ms (executed concurrently)
const userPromise = fetchUser(id);
const postsPromise = fetchPosts(id);

const [user, posts] = await Promise.all([userPromise, postsPromise]);
```

---

# 📦 Module 6: Object Copying & Modern ES6 Data Structures

### 1. Shallow Copy vs Deep Copy

```javascript
const original = { name: "Project", meta: { version: 1 } };

// 1. Shallow Copy (Spread Operator)
const shallow = { ...original };
shallow.meta.version = 2; // Mutates original.meta.version!

// 2. Deep Copy (Native structuredClone - Modern Standard)
const deep = structuredClone(original);
deep.meta.version = 3; // Leaves original.meta.version intact!
```

### 2. Map & Set Collections
- **`Set`**: Collection of unique values (automatically eliminates duplicate entries).
- **`Map`**: Key-value store that supports **keys of any data type** (objects, functions, primitives) and preserves insertion order.

```javascript
// Set Example:
const numbers = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = [...new Set(numbers)]; // [1, 2, 3, 4, 5]

// Map Example:
const cache = new Map();
const userObj = { id: 101 };
cache.set(userObj, { role: "Admin" });
console.log(cache.get(userObj)); // { role: "Admin" }
```

---

## 🛠️ Practical Exercises Completed
1. Built a secure bank account closure module with private encapsulated state.
2. Verified `this` binding mechanics across regular and arrow functions.
3. Created an `ElectricCar` class inheriting from `Vehicle` featuring ES2022 private fields (`#batteryCapacity`).
4. Simulated and verified Event Loop microtask and macrotask execution order.
5. Handled concurrent API promises using `Promise.all` and `Promise.allSettled`.
6. Demonstrated immutability via native `structuredClone()`.
