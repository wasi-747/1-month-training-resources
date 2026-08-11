# ⚛️ Week 2 — Day 02: React State, `useState` Hook & Interactive Tic-Tac-Toe

**Curriculum Track:** 1-Month Web Development Training  
**Date:** Tuesday, August 11, 2026  
**Topic:** Component Memory (State), Hook Mechanics, State Lifting & Interactive Game Engine  

---

## 📚 Table of Contents
1. [What is State in React? (Component Memory)](#1-what-is-state-in-react-component-memory)
2. [The `useState` Hook Deep Dive](#2-the-usestate-hook-deep-dive)
3. [The Golden Rule: State Immutability](#3-the-golden-rule-state-immutability)
4. [Lifting State Up Pattern](#4-lifting-state-up-pattern)
5. [Tic-Tac-Toe Game Architecture & Time-Travel](#5-tic-tac-toe-game-architecture--time-travel)

---

## 1. What is State in React? (Component Memory)

In standard JavaScript, changing a local variable (e.g. `let count = 0; count++;`) does **not** trigger a re-render of the DOM because React has no way of tracking local variable mutations across function calls.

**React State** provides **Component Memory**:
1. **Data Retention**: Persists values between component renders.
2. **Re-render Trigger**: Calling a state updater function notifies React to recalculate the Virtual DOM diff and update the screen.

```javascript
import { useState } from 'react';

function Counter() {
  // state: current value | setCount: state updater function
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

---

## 2. The `useState` Hook Deep Dive

### Syntax:
```javascript
const [value, setValue] = useState(initialValue);
```

### Functional Updates vs Direct Values:
When state updates depend on the previous state value, always use the **updater function form** to avoid stale state closures:

```javascript
// ❌ Stale Closure Risk in rapid calls:
setCount(count + 1);

// ✅ Safe Functional Update:
setCount(prevCount => prevCount + 1);
```

---

## 3. The Golden Rule: State Immutability

React determines whether to re-render a component by comparing **Object/Array memory references (shallow comparison `Object.is`)**.

If you mutate an array or object directly (`board[0] = 'X'`), the memory reference remains unchanged, and React **skips the re-render**!

| Type | Direct Mutation (❌ FORBIDDEN) | Immutable Update (✅ MANDATORY) |
| :--- | :--- | :--- |
| **Array Add** | `list.push(newItem)` | `setList([...list, newItem])` |
| **Array Replace** | `board[idx] = 'X'` | `const next = [...board]; next[idx] = 'X'; setBoard(next);` |
| **Array Filter** | `list.splice(idx, 1)` | `setList(list.filter((_, i) => i !== idx))` |
| **Object Update** | `user.score = 100` | `setUser({ ...user, score: 100 })` |

---

## 4. Lifting State Up Pattern

When multiple sibling components need to share state or stay in sync, **lift the state up to their closest common parent component**.

```
         ┌─────────────────────────────────┐
         │     PARENT COMPONENT (Board)    │
         │   Holds state: squares = [...]  │
         └────────────────┬────────────────┘
                          │ passes props & onClick callback
             ┌────────────┴────────────┐
             ▼                         ▼
    [ Square Component 1 ]    [ Square Component 2 ]
    (Pure Presentational)     (Pure Presentational)
```

---

## 5. Tic-Tac-Toe Game Architecture & Time-Travel

The Tic-Tac-Toe application is organized into 3 modular components:

1. **`Square` (Presentational Child)**: Receives `value` ('X', 'O', or null) and `onSquareClick` callback from Board.
2. **`Board` (Grid Container)**: Renders the 3x3 square matrix, displays current turn status or winner announcement.
3. **`Game` (Root Controller)**: Holds full move history array `history = [Array(9).fill(null), ...]`, manages time-travel navigation (`jumpTo(step)`).

### Winner Calculation Algorithm:
```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Returns 'X' or 'O'
    }
  }
  return null;
}
```
