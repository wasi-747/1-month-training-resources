# 📖 Master Day 02 Guide: React State, `useState` Hook & Interactive Tic-Tac-Toe

**Curriculum Track:** 1-Month Web Development Training (Week 2, Day 02 Master Reference)  
**Author:** Full-Stack Engineering Trainee  

---

## 📚 Table of Contents
1. [React State ki & Local Variable theke keno alada?](#1-react-state-ki--local-variable-theke-keno-alada)
2. [`useState` Hook Deep Dive & Functional Updates](#2-usestate-hook-deep-dive--functional-updates)
3. [The Golden Rule: State Immutability & Spread Operator](#3-the-golden-rule-state-immutability--spread-operator)
4. [Lifting State Up Pattern](#4-lifting-state-up-pattern)
5. [Tic-Tac-Toe Game Architecture & Line-by-Line Breakdown](#5-tic-tac-toe-game-architecture--line-by-line-breakdown)

---

## 1. React State ki & Local Variable theke keno alada?

### ❌ Normal JavaScript Variable:
```javascript
let count = 0;
function increment() {
  count++;
  console.log(count); // Value bare, kintu Screen-e DOM re-render hoy na!
}
```
* **Keno re-render hoy na?** React normal variable-er change track korte pare na.

---

### ✅ React Component State:
**State hocche Component-er Memory!**
1. **Data Retention:** Re-render holeo value haray na, memory-te theke jay.
2. **Re-render Trigger:** `setState()` call korle React Virtual DOM diffing shuru kore ebong automatically screen-e UI update kore.

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // [currentValue, updaterFunction]

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

---

## 2. `useState` Hook Deep Dive & Functional Updates

### Syntax:
```javascript
const [state, setState] = useState(initialValue);
```

### ⚠️ Functional Updater Form (`prev => prev + 1`) Keno Lagbe?
Jodi eki function-e multiple bar state update kora hoy, direct value dile stale state-er karone calculation vul hote pare.

```javascript
// ❌ Stale closure risk:
setCount(count + 1);
setCount(count + 1); // 2 bar call korleo shudhu 1 barbe!

// ✅ Safe Functional Update:
setCount(prev => prev + 1);
setCount(prev => prev + 1); // 2 barbe (100% accurate!)
```

---

## 3. The Golden Rule: State Immutability & Spread Operator

React Virtual DOM check kore **Memory Reference (`Object.is`)** diye.

Apni jodi array ba object direct mutate koren (`squares[0] = 'X'`), memory address eki thake — fole React mone kore kono change hoyni ebong **re-render skip kore!**

| Action | Direct Mutation (❌ FORBIDDEN) | Immutable Copy (✅ MANDATORY) |
| :--- | :--- | :--- |
| **Array Add** | `list.push(item)` | `setList([...list, item])` |
| **Array Replace** | `board[idx] = 'X'` | `const next = [...board]; next[idx] = 'X'; setBoard(next);` |
| **Array Delete** | `list.splice(idx, 1)` | `setList(list.filter((_, i) => i !== idx))` |
| **Object Update** | `user.score = 100` | `setUser({ ...user, score: 100 })` |

---

## 4. Lifting State Up Pattern

Jokhon 2 ba tar beshi Child Component-ke eki data share korte hoy ba sync thakte hoy, tokhon state-ke tader **Common Parent Component-e tule ante hoy (Lifting State Up)**.

```
               ┌──────────────────────────────────────────────┐
               │         PARENT COMPONENT: Board              │
               │   State: squares = ['X', null, 'O', ...]     │
               └──────────────────────┬───────────────────────┘
                                      │ passes value & onSquareClick
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
         [ Square Component 0 ]                  [ Square Component 1 ]
         (Pure Presentational)                   (Pure Presentational)
```

---

## 5. Tic-Tac-Toe Game Architecture & Line-by-Line Breakdown

```jsx
// 1. Child: Square Component
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 2. Parent: Board Component
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = [...squares]; // Immutable copy!
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : `Next: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div>
      <div>{status}</div>
      <div className="board-grid">
        {squares.map((val, idx) => (
          <Square key={idx} value={val} onSquareClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
}

// 3. Root Controller: Game Component (Time-Travel)
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <ol className="history-list">
        {history.map((_, move) => (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>
              {move > 0 ? `Go to move #${move}` : 'Go to game start'}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

### 🗣️ Call Flow & Technical Talk Track:
1. **User clicks Square 0**: `handleClick(0)` triggers.
2. **Immutability check**: `[...squares]` makes a shallow copy, replaces index 0 with `'X'`.
3. **History Append**: `handlePlay` slices history to `currentMove` and appends `nextSquares`.
4. **Re-render**: `setCurrentMove` triggers React re-render. Virtual DOM diffs and updates Square 0 to `'X'` and turn indicator to `'O'`.
5. **Time-Travel**: Clicking `"Go to move #1"` calls `jumpTo(1)`, setting `currentMove = 1`, instantly restoring the board to that exact past state!
