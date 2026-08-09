/**
 * Week 2, Day 1: React Core Foundations Practice Snippets
 * Demonstrates Component Breakdown, Props Passing, JSX Expressions & State
 */

// 1. Child Component Receiving Destructured Props
function UserBadge({ username, role, isOnline = true }) {
  return (
    <div className="user-badge-card bg-slate-800 p-3 rounded-md text-white">
      <h4 className="font-bold text-lg">{username}</h4>
      <p className="text-sm text-slate-400">Role: {role}</p>
      <span className="text-xs">
        {isOnline ? "🟢 Online" : "🔴 Offline"}
      </span>
    </div>
  );
}

// 2. Component Demonstrating JSX Expressions & Conditional Rendering
function ProfileSummary({ user }) {
  const { name, score, skills } = user;

  return (
    <section className="profile-summary p-4 border border-indigo-500 rounded-lg">
      <h2 className="text-2xl font-bold text-indigo-400">
        Developer Profile: {name.toUpperCase()}
      </h2>
      <p className="mt-2 text-slate-300">
        Skill Assessment Score: <strong className="text-amber-400">{score}</strong>
      </p>

      {/* Conditional Rendering via Ternary Operator */}
      <div className="mt-2">
        Status: {score >= 80 ? (
          <span className="text-green-400 font-semibold">Passed Qualification 🎉</span>
        ) : (
          <span className="text-red-400 font-semibold">Review Pending ⏳</span>
        )}
      </div>

      {/* List Rendering via .map() */}
      <div className="mt-3">
        <h4 className="font-semibold text-slate-200">Core Skills:</h4>
        <ul className="list-disc list-inside text-sm text-slate-300">
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// 3. Parent Component Managing State and Unidirectional Data Flow
export default function ReactFoundationsApp() {
  const sampleUser = {
    name: "Wasiur Rahman",
    score: 92,
    skills: ["HTML5 / CSS3", "JavaScript ES6+", "React.js", "Node.js"]
  };

  return (
    <main className="container mx-auto p-6 max-w-2xl bg-slate-900 min-h-screen text-slate-100">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">
          Week 2: React Core Foundations
        </h1>
        <p className="text-sm text-slate-400">
          Demonstrating Thinking in React, Props Architecture & JSX Syntax
        </p>
      </header>

      {/* Render Component Hierarchy */}
      <div className="space-y-6">
        <ProfileSummary user={sampleUser} />

        <div className="grid grid-cols-2 gap-4">
          <UserBadge username="Wasi" role="Full-Stack Engineering Trainee" isOnline={true} />
          <UserBadge username="Senior Mentor" role="Technical Director" isOnline={false} />
        </div>
      </div>
    </main>
  );
}
