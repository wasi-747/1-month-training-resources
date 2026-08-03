/**
 * Day 2: Advanced JavaScript & Asynchronous Programming Practice Suite
 * Covers Closures, Scopes, 'this', Prototypes/Classes, Event Loop, Promises, and Modern ES6+ Features
 */

// ==========================================
// Section 1: Scopes & Closures
// ==========================================
console.log("=== Section 1: Scopes & Closures ===");

// 1. Lexical Scope & Closure Data Privacy
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private state variable

  return {
    deposit(amount) {
      if (amount <= 0) return "Invalid deposit amount";
      balance += amount;
      return `Deposited $${amount}. New balance: $${balance}`;
    },
    withdraw(amount) {
      if (amount > balance) return "Insufficient funds";
      balance -= amount;
      return `Withdrew $${amount}. Remaining balance: $${balance}`;
    },
    getBalance() {
      return balance;
    }
  };
}

const myAccount = createBankAccount(100);
console.log(myAccount.deposit(50));   // Deposited $50. New balance: $150
console.log(myAccount.withdraw(30));  // Withdrew $30. Remaining balance: $120
console.log("Direct balance access attempt:", myAccount.balance); // undefined (Private!)
console.log("Current Balance via Getter:", myAccount.getBalance()); // 120

// 2. Function Factory (Currying)
const multiply = (factor) => (number) => number * factor;
const double = multiply(2);
const triple = multiply(3);

console.log("Double 7:", double(7)); // 14
console.log("Triple 7:", triple(7)); // 21


// ==========================================
// Section 2: The 'this' Keyword & Context Binding
// ==========================================
console.log("\n=== Section 2: 'this' Keyword & Binding ===");

const developer = {
  name: "Sarah",
  role: "Frontend Engineer",
  introduce(greeting, punctuation) {
    return `${greeting}, I am ${this.name}, working as a ${this.role}${punctuation}`;
  }
};

const guest = {
  name: "Alex",
  role: "Backend Engineer"
};

// Explicit binding: call, apply, bind
console.log("call():", developer.introduce.call(guest, "Hello", "!"));
console.log("apply():", developer.introduce.apply(guest, ["Hi", "."]));

const boundIntroduce = developer.introduce.bind(guest, "Hey");
console.log("bind():", boundIntroduce("?"));

// Arrow function vs Regular function 'this' context
const team = {
  teamName: "Core UI Team",
  members: ["Alice", "Bob"],
  printMembersRegular() {
    // Arrow function inside preserves outer 'this'
    this.members.forEach((member) => {
      console.log(`${member} belongs to ${this.teamName}`);
    });
  }
};
team.printMembersRegular();


// ==========================================
// Section 3: Prototypes & ES6 Classes
// ==========================================
console.log("\n=== Section 3: Prototypes & ES6 Classes ===");

// ES6 Class Architecture with Inheritance
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  getSpecs() {
    return `${this.year} ${this.make} ${this.model}`;
  }

  static compareAge(v1, v2) {
    return v1.year > v2.year
      ? `${v1.model} is newer than ${v2.model}`
      : `${v2.model} is newer than ${v1.model}`;
  }
}

class ElectricCar extends Vehicle {
  #batteryCapacity; // Private field (ES2022)

  constructor(make, model, year, batteryCapacity) {
    super(make, model, year);
    this.#batteryCapacity = batteryCapacity;
  }

  getBatteryInfo() {
    return `Battery: ${this.#batteryCapacity} kWh`;
  }

  // Polymorphic method override
  getSpecs() {
    return `${super.getSpecs()} (EV - ${this.#batteryCapacity} kWh)`;
  }
}

const tesla = new ElectricCar("Tesla", "Model 3", 2023, 75);
const mustang = new Vehicle("Ford", "Mustang", 2020);

console.log("Tesla Specs:", tesla.getSpecs());
console.log("Tesla Battery:", tesla.getBatteryInfo());
console.log("Static Compare:", Vehicle.compareAge(tesla, mustang));


// ==========================================
// Section 4: Event Loop, Microtasks & Macrotasks
// ==========================================
console.log("\n=== Section 4: Event Loop & Task Queues ===");

function demonstrateEventLoop() {
  console.log("1. Synchronous Start");

  setTimeout(() => {
    console.log("4. Macrotask: setTimeout Callback");
  }, 0);

  Promise.resolve().then(() => {
    console.log("3. Microtask: Promise.then Callback");
  });

  queueMicrotask(() => {
    console.log("3b. Microtask: queueMicrotask Callback");
  });

  console.log("2. Synchronous End");
}

demonstrateEventLoop();


// ==========================================
// Section 5: Asynchronous JavaScript & Promise Combinators
// ==========================================
console.log("\n=== Section 5: Asynchronous JavaScript & Promise Combinators ===");

// Simulated API calls with varying response times
const mockFetchUser = (id) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `User_${id}` }), 100)
  );

const mockFetchPosts = (userId) =>
  new Promise((resolve) =>
    setTimeout(() => resolve([{ id: 101, title: "JS Deep Dive" }]), 150)
  );

const mockFailingTask = () =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Service Unavailable")), 80)
  );

// 1. Parallel execution with Promise.all & Promise.allSettled
async function runPromiseCombinators() {
  console.log("Executing Promise.all...");
  try {
    const [user, posts] = await Promise.all([
      mockFetchUser(42),
      mockFetchPosts(42)
    ]);
    console.log("Promise.all Result -> User:", user.name, "| Posts:", posts[0].title);
  } catch (err) {
    console.error("Promise.all Failed:", err.message);
  }

  console.log("\nExecuting Promise.allSettled...");
  const results = await Promise.allSettled([
    mockFetchUser(1),
    mockFailingTask(),
    mockFetchPosts(1)
  ]);

  results.forEach((res, index) => {
    if (res.status === "fulfilled") {
      console.log(`Task ${index + 1} Succeeded:`, res.value);
    } else {
      console.log(`Task ${index + 1} Failed:`, res.reason.message);
    }
  });

  // 2. Sequential vs Parallel execution pattern
  console.log("\nSequential vs Parallel Execution Demo:");
  const startTime = Date.now();

  // Parallel execution using Promise.all
  const p1 = mockFetchUser(100);
  const p2 = mockFetchUser(200);
  await Promise.all([p1, p2]);

  console.log(`Parallel Fetch Completed in ~${Date.now() - startTime}ms`);
}


// ==========================================
// Section 6: Shallow vs. Deep Copy & Modern Data Structures
// ==========================================
console.log("\n=== Section 6: Object Copying & Modern Data Structures ===");

// 1. Deep Copy with structuredClone vs Shallow Copy
const originalObj = {
  name: "Project Alpha",
  details: { tags: ["web", "js"], priority: 1 }
};

const shallowCopy = { ...originalObj };
const deepCopy = structuredClone(originalObj);

// Mutate nested object
originalObj.details.priority = 99;

console.log("Original Priority:", originalObj.details.priority); // 99
console.log("Shallow Copy Priority (Mutated):", shallowCopy.details.priority); // 99
console.log("Deep Copy Priority (Preserved):", deepCopy.details.priority); // 1

// 2. Map and Set Data Structures
const uniqueTags = new Set(["javascript", "html", "css", "javascript"]);
console.log("Unique Tags Count (Set):", uniqueTags.size); // 3 (duplicates removed)

const userCache = new Map();
userCache.set("user_101", { name: "Alice", lastActive: "Just now" });
console.log("Map Fetch user_101:", userCache.get("user_101").name);


// Run async suite after synchronous output completes
setTimeout(() => {
  runPromiseCombinators();
}, 200);
