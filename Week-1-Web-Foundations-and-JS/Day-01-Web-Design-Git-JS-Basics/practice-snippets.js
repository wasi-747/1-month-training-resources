/**
 * Day 1: JavaScript Fundamentals & ES6+ Practice Snippets
 */

// 1. Scope & Variable Declarations
const LEARNING_TRACK = "1-Month Web Development Training";
let currentDay = 1;

function demonstrateScope() {
  if (true) {
    let blockScoped = "I exist only inside this block";
    var functionScoped = "I leak to the function scope";
  }
  console.log("Function Scoped:", functionScoped); // Works
  // console.log(blockScoped); // ReferenceError
}

demonstrateScope();

// 2. Arrow Functions & Higher-Order Array Methods
const numbers = [10, 20, 30, 40, 50];

// Map: Double all numbers
const doubled = numbers.map((n) => n * 2);
console.log("Doubled:", doubled);

// Filter: Get numbers greater than 25
const filtered = numbers.filter((n) => n > 25);
console.log("Filtered > 25:", filtered);

// Reduce: Calculate total sum
const totalSum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log("Total Sum:", totalSum);

// 3. Object Destructuring & Spread Operator
const internProfile = {
  name: "Intern Developer",
  role: "Web Development Intern",
  skills: ["HTML", "CSS", "JavaScript", "React"],
};

const { name, role, skills } = internProfile;
console.log(`${name} - ${role} | Skills: ${skills.join(", ")}`);

const updatedProfile = {
  ...internProfile,
  status: "Active Training",
  currentWeek: 1,
};
console.log("Updated Profile:", updatedProfile);
