# 📖 Day 1: Thinking in React, Component Architecture & JSX Syntax Rules

**Date:** Sunday (Week 2, Day 1)  
**Curriculum Track:** 1-Month Web Development Training — React Deep Dive  
**Author:** Intern Developer  

---

## 📚 Table of Contents
1. [Thinking in React Mental Model](#1-thinking-in-react-mental-model)
2. [React Component Architecture](#2-react-component-architecture)
3. [JSX Syntax Rules & Expression Embedding](#3-jsx-syntax-rules--expression-embedding)
4. [Props Architecture & Unidirectional Data Flow](#4-props-architecture--unidirectional-data-flow)
5. [State Management with useState](#5-state-management-with-usestate)

---

## 1. Thinking in React Mental Model

React shifts web development from **imperative DOM manipulation** to **declarative component-driven architecture**.

Instead of writing custom JS selectors (`document.querySelector`) to modify elements, you break the UI into a hierarchy of independent, reusable component boxes:

```
[ App Component ]
   ├── [ Navbar Component ]
   ├── [ UserProfileCard Component ]
   │      └── [ UserBadge Component ]
   └── [ Footer Component ]
```

---

## 2. React Component Architecture

A React component is a JavaScript function that returns UI markup (JSX).

```jsx
// Rule: Component names MUST start with a Capital letter!
function UserCard({ name, role }) {
  return (
    <div className="card bg-slate-800 p-4 rounded-lg">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-slate-400">{role}</p>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <UserCard name="Wasi" role="Full-Stack Engineering Trainee" />
    </main>
  );
}
```

---

## 3. JSX Syntax Rules & Expression Embedding

JSX allows writing HTML-like syntax inside JavaScript files.

### 3 Strict Rules of JSX:
1. **Single Root Element**: Wrap multiple adjacent siblings in a React Fragment (`<>...</>`).
2. **Self-Closing Tags**: All tags without children MUST self-close (`<img />`, `<input />`, `<br />`).
3. **camelCase HTML Attributes**: Use `className` instead of `class`, `onClick` instead of `onclick`, and `htmlFor` instead of `for`.

### Embedding JS Expressions `{}`
Wrap JavaScript code inside curly braces `{}` to embed variables, math calculations, or ternary conditional logic:

```jsx
const userAge = 22;
return <div>Age next year: {userAge + 1}</div>;
```

---

## 4. Props Architecture & Unidirectional Data Flow

* **Props (Short for Properties)**: Read-only inputs passed down from parent components to child components (similar to function parameters).
* **Golden Rule of Props**: **Props are Immutable!** A child component must never modify the props it receives.
* **Unidirectional Data Flow**: Data flows in one direction only: **Top-to-Bottom (Parent ➔ Child)**.

---

## 5. State Management with useState

State is a component's **internal memory**. When state updates, React automatically re-renders the component to show updated UI.

```jsx
import { useState } from 'react';

function Counter() {
  // const [stateValue, setterFunction] = useState(initialValue);
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 📊 Summary Table: Props vs. State

| Feature | Props | State |
| :--- | :--- | :--- |
| **Origin** | Passed from Parent outside | Created inside the Component |
| **Mutable?** | ❌ **NO** (Immutable / Read-Only) | ✅ **YES** (via `setState` updater) |
| **Purpose** | Passing data down component trees | Managing interactive changing data |
