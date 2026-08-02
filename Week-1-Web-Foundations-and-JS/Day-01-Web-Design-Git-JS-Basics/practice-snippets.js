/**
 * Day 1: Comprehensive JavaScript Fundamentals & ES6+ Practice Suite
 * Covers Chapters 1 to 6 of Eloquent JavaScript Training Track
 */

// ==========================================
// Chapter 1: Values, Types & Operators
// ==========================================
console.log("--- Chapter 1: Values, Types & Operators ---");

const numA = 15;
const numB = 4;
console.log(`Modulo (${numA} % ${numB}):`, numA % numB); // Output: 3

const isEvenNumber = (n) => n % 2 === 0;
console.log(`Is 10 even? ${isEvenNumber(10)}`); // true
console.log(`Is 7 even? ${isEvenNumber(7)}`);   // false

const userName = "Rahim";
console.log(`Template Literal Greeting: Welcome, ${userName}!`);

// Strict Equality check
console.log("Strict Equality (10 === '10'):", 10 === "10"); // false


// ==========================================
// Chapter 2: Program Structure & Loops
// ==========================================
console.log("\n--- Chapter 2: Program Structure & Loops ---");

let userScore = 85;
if (userScore >= 80) {
  console.log("Grade Evaluation: A+");
} else if (userScore >= 70) {
  console.log("Grade Evaluation: A");
} else {
  console.log("Grade Evaluation: Pass");
}

// Loop demonstration
console.log("Executing for-loop iteration:");
for (let i = 1; i <= 3; i++) {
  console.log(`Loop step: ${i}`);
}


// ==========================================
// Chapter 3: Functions & Arrow Functions
// ==========================================
console.log("\n--- Chapter 3: Functions & Arrow Functions ---");

// Classic Function
function calculateTax(amount, rate) {
  return amount * rate;
}
console.log("Tax Calculation ($100 at 15%):", calculateTax(100, 0.15));

// Modern Arrow Functions
const doubleValue = (x) => x * 2;
const squareValue = (n) => n * n;

console.log("Double 8:", doubleValue(8));   // 16
console.log("Square 4:", squareValue(4));   // 16


// ==========================================
// Chapter 4: Data Structures (Objects & Arrays)
// ==========================================
console.log("\n--- Chapter 4: Data Structures ---");

const sports = ["Football", "Cricket", "Tennis"];
sports.push("Basketball");
console.log("Updated Sports Array:", sports);

// Object & Destructuring
const developerProfile = {
  devName: "Rahim Developer",
  role: "Web Intern",
  points: 150,
  skills: ["HTML", "CSS", "JavaScript"]
};

const { devName, role, skills } = developerProfile;
console.log(`Developer: ${devName} (${role}) | Skills: ${skills.join(", ")}`);

// Spread Operator (...)
const baseNumbers = [1, 2, 3];
const expandedNumbers = [...baseNumbers, 4, 5];
console.log("Spread Array:", expandedNumbers);

const updatedProfile = { ...developerProfile, status: "Active Training", week: 1 };
console.log("Updated Profile Object:", updatedProfile);


// ==========================================
// Chapter 5: Higher-Order Array Methods
// ==========================================
console.log("\n--- Chapter 5: Higher-Order Array Methods ---");

const scores = [10, 20, 30];
const boostedScores = scores.map((score) => score + 5);
console.log("Mapped Bonus Scores:", boostedScores); // [15, 25, 35]

const ages = [12, 18, 25, 15, 30];
const adultAges = ages.filter((age) => age >= 18);
console.log("Filtered Adult Ages (>= 18):", adultAges); // [18, 25, 30]

const cartPrices = [15, 25, 10];
const grandTotal = cartPrices.reduce((accumulator, price) => accumulator + price, 0);
console.log("Reduced Grand Total Cart Price:", grandTotal); // 50


// ==========================================
// Chapter 6: Asynchronous JavaScript (async/await & fetch)
// ==========================================
console.log("\n--- Chapter 6: Asynchronous JavaScript ---");

async function fetchSampleUser() {
  try {
    console.log("Initiating asynchronous API call to jsonplaceholder...");
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await response.json();
    console.log(`Async Fetch Result -> Name: ${data.name} | City: ${data.address.city}`);
  } catch (error) {
    console.error("Async Operation Error:", error);
  }
}

fetchSampleUser();
